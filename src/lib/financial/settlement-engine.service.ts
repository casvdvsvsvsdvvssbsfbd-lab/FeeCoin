// ============================================
// Settlement Cycle Engine
// Manage revenue settlement cycles
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';
import { revenueAggregatorService } from './revenue-aggregator.service';

export interface SettlementCycle {
  id: string;
  cycle: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalRevenue: number;
  totalRevenueUsd: number;
  platformProfit: number;
  userRewards: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  createdAt: string;
  completedAt?: string;
}

export interface SettlementRecord {
  id: string;
  cycleId: string;
  revenueRecordId: string;
  userId: string;
  amount: number;
  amountUsd: number;
  platformShare: number;
  userShare: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

class SettlementEngineService {
  private analytics = useAnalytics();

  // Create settlement cycle
  async createSettlementCycle(type: 'daily' | 'weekly' | 'monthly' | 'custom', startDate?: string, endDate?: string): Promise<string | null> {
    try {
      const cycle = this.generateCycleId(type);
      const now = new Date();
      const start = startDate ? new Date(startDate) : now;
      const end = endDate ? new Date(endDate) : this.getCycleEndDate(type, start);

      const { data, error } = await supabase
        .from('settlement_cycles')
        .insert({
          cycle,
          type,
          start_date: start.toISOString(),
          end_date: end.toISOString(),
          status: 'pending',
          total_revenue: 0,
          total_revenue_usd: 0,
          platform_profit: 0,
          user_rewards: 0,
          pending_withdrawals: 0,
          completed_withdrawals: 0,
        })
        .select()
        .single();

      if (error) throw error;

      this.analytics.trackEvent('settlement_cycle_created', { cycleId: data.id, type });
      return data.id;
    } catch (error) {
      console.error('Failed to create settlement cycle:', error);
      return null;
    }
  }

  // Process settlement cycle
  async processSettlementCycle(cycleId: string): Promise<boolean> {
    try {
      // Get cycle details
      const { data: cycle, error: cycleError } = await supabase
        .from('settlement_cycles')
        .select('*')
        .eq('id', cycleId)
        .single();

      if (cycleError || !cycle) throw new Error('Cycle not found');

      // Update status to processing
      await supabase
        .from('settlement_cycles')
        .update({ status: 'processing' })
        .eq('id', cycleId);

      // Get all confirmed revenue for this cycle
      const pendingRevenue = await revenueAggregatorService.getPendingRevenue(cycle.cycle);

      let totalRevenue = 0;
      let totalRevenueUsd = 0;

      // Process each revenue record
      for (const revenue of pendingRevenue) {
        // Create settlement record
        const platformShare = revenue.amountUsd * 0.2;
        const userShare = revenue.amountUsd * 0.8;

        await supabase.from('settlement_records').insert({
          cycle_id: cycleId,
          revenue_record_id: revenue.id,
          user_id: revenue.userId,
          amount: revenue.amount,
          amount_usd: revenue.amountUsd,
          platform_share: platformShare,
          user_share: userShare,
          status: 'pending',
        });

        totalRevenue += revenue.amount;
        totalRevenueUsd += revenue.amountUsd;

        // Mark revenue as completed
        await revenueAggregatorService.completeRevenue(revenue.id);
      }

      // Calculate platform profit and user rewards
      const platformProfit = totalRevenueUsd * 0.2;
      const userRewards = totalRevenueUsd * 0.8;

      // Update cycle
      await supabase
        .from('settlement_cycles')
        .update({
          status: 'completed',
          total_revenue: totalRevenue,
          total_revenue_usd: totalRevenueUsd,
          platform_profit: platformProfit,
          user_rewards: userRewards,
          completed_at: new Date().toISOString(),
        })
        .eq('id', cycleId);

      // Distribute rewards to users
      await this.distributeRewards(cycleId);

      this.analytics.trackEvent('settlement_cycle_completed', {
        cycleId,
        totalRevenue: totalRevenueUsd,
        platformProfit,
        userRewards,
      });

      return true;
    } catch (error) {
      console.error('Failed to process settlement cycle:', error);

      // Mark as failed
      await supabase
        .from('settlement_cycles')
        .update({ status: 'cancelled' })
        .eq('id', cycleId);

      return false;
    }
  }

  // Distribute rewards to users
  private async distributeRewards(cycleId: string): Promise<void> {
    try {
      // Get all settlement records for this cycle
      const { data: records } = await supabase
        .from('settlement_records')
        .select('*')
        .eq('cycle_id', cycleId)
        .eq('status', 'pending');

      // Group by user
      const userRewards: { [userId: string]: number } = {};
      records?.forEach(record => {
        userRewards[record.user_id] = (userRewards[record.user_id] || 0) + record.user_share;
      });

      // Distribute to wallets
      for (const [userId, amount] of Object.entries(userRewards)) {
        await supabase.rpc('increment_wallet_balance', {
          p_user_id: userId,
          p_amount: amount,
        });

        // Record transaction
        await supabase.from('transactions').insert({
          user_id: userId,
          type: 'reward',
          amount,
          status: 'completed',
          description: `Settlement reward - Cycle ${cycleId}`,
          metadata: { cycleId, type: 'settlement' },
        });

        // Update settlement records
        await supabase
          .from('settlement_records')
          .update({ status: 'completed' })
          .eq('cycle_id', cycleId)
          .eq('user_id', userId);
      }

      this.analytics.trackEvent('rewards_distributed', {
        cycleId,
        userCount: Object.keys(userRewards).length,
        totalAmount: Object.values(userRewards).reduce((a, b) => a + b, 0),
      });
    } catch (error) {
      console.error('Failed to distribute rewards:', error);
    }
  }

  // Get settlement cycles
  async getSettlementCycles(filters?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ cycles: SettlementCycle[]; total: number }> {
    try {
      let query = supabase
        .from('settlement_cycles')
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, count, error } = await query;

      if (error) throw error;

      const cycles = (data || []).map(c => ({
        id: c.id,
        cycle: c.cycle,
        type: c.type,
        startDate: c.start_date,
        endDate: c.end_date,
        status: c.status,
        totalRevenue: c.total_revenue,
        totalRevenueUsd: c.total_revenue_usd,
        platformProfit: c.platform_profit,
        userRewards: c.user_rewards,
        pendingWithdrawals: c.pending_withdrawals,
        completedWithdrawals: c.completed_withdrawals,
        createdAt: c.created_at,
        completedAt: c.completed_at,
      }));

      return {
        cycles,
        total: count || 0,
      };
    } catch (error) {
      console.error('Failed to fetch settlement cycles:', error);
      return { cycles: [], total: 0 };
    }
  }

  // Get settlement details
  async getSettlementDetails(cycleId: string): Promise<any> {
    try {
      const { data: records, error } = await supabase
        .from('settlement_records')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return records || [];
    } catch (error) {
      console.error('Failed to fetch settlement details:', error);
      return [];
    }
  }

  // Generate cycle ID
  private generateCycleId(type: string): string {
    const now = new Date();
    let cycle = '';

    switch (type) {
      case 'daily':
        cycle = now.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        cycle = `${weekStart.toISOString().split('T')[0]}_to_${now.toISOString().split('T')[0]}`;
        break;
      case 'monthly':
        cycle = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        cycle = now.toISOString().split('T')[0];
    }

    return cycle;
  }

  // Get cycle end date
  private getCycleEndDate(type: string, start: Date): Date {
    const end = new Date(start);

    switch (type) {
      case 'daily':
        end.setDate(end.getDate() + 1);
        break;
      case 'weekly':
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      default:
        end.setDate(end.getDate() + 1);
    }

    return end;
  }
}

// Singleton instance
export const settlementEngineService = new SettlementEngineService();