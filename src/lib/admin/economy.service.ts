// ============================================
// Economy Service
// Admin economy management
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface EconomyStats {
  totalRewardsDistributed: number;
  totalRevenue: number;
  platformProfit: number;
  userRewards: number;
  conversionRate: number;
  withdrawalProgress: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  revenueByType: {
    ad: number;
    offerwall: number;
    survey: number;
    install: number;
  };
}

export interface RewardPool {
  id: string;
  name: string;
  type: string;
  totalAmount: number;
  distributedAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface RevenueForecast {
  date: string;
  predicted: number;
  actual?: number;
}

class EconomyService {
  private analytics = useAnalytics();

  // Get economy statistics
  async getEconomyStats(): Promise<EconomyStats> {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type, status')
        .eq('status', 'completed');

      const totalRevenue = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
      const platformProfit = totalRevenue * 0.2;
      const userRewards = totalRevenue * 0.8;

      // Revenue by type
      const revenueByType = {
        ad: transactions?.filter(tx => tx.type === 'ad').reduce((sum, tx) => sum + tx.amount, 0) || 0,
        offerwall: transactions?.filter(tx => tx.type === 'offer').reduce((sum, tx) => sum + tx.amount, 0) || 0,
        survey: transactions?.filter(tx => tx.type === 'survey').reduce((sum, tx) => sum + tx.amount, 0) || 0,
        install: transactions?.filter(tx => tx.type === 'install').reduce((sum, tx) => sum + tx.amount, 0) || 0,
      };

      // Withdrawals
      const { count: pendingWithdrawals } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: completedWithdrawals } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Conversion rate
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: usersWithWithdrawals } = await supabase
        .from('withdrawals')
        .select('user_id', { count: 'exact', head: true });

      const conversionRate = totalUsers ? ((usersWithWithdrawals || 0) / totalUsers) * 100 : 0;

      return {
        totalRewardsDistributed: userRewards,
        totalRevenue,
        platformProfit,
        userRewards,
        conversionRate,
        withdrawalProgress: 0,
        pendingWithdrawals: pendingWithdrawals || 0,
        completedWithdrawals: completedWithdrawals || 0,
        revenueByType,
      };
    } catch (error) {
      console.error('Failed to fetch economy stats:', error);
      return {
        totalRewardsDistributed: 0,
        totalRevenue: 0,
        platformProfit: 0,
        userRewards: 0,
        conversionRate: 0,
        withdrawalProgress: 0,
        pendingWithdrawals: 0,
        completedWithdrawals: 0,
        revenueByType: { ad: 0, offerwall: 0, survey: 0, install: 0 },
      };
    }
  }

  // Get reward pools
  async getRewardPools(): Promise<RewardPool[]> {
    try {
      const { data, error } = await supabase
        .from('reward_pools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to fetch reward pools:', error);
      return [];
    }
  }

  // Create reward pool
  async createRewardPool(pool: {
    name: string;
    type: string;
    totalAmount: number;
    startDate: string;
    endDate: string;
  }): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('reward_pools')
        .insert({
          name: pool.name,
          type: pool.type,
          total_amount: pool.totalAmount,
          distributed_amount: 0,
          remaining_amount: pool.totalAmount,
          start_date: pool.startDate,
          end_date: pool.endDate,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      this.analytics.trackEvent('admin_reward_pool_created', { poolId: data.id });
      return data.id;
    } catch (error) {
      console.error('Failed to create reward pool:', error);
      return null;
    }
  }

  // Get revenue forecast
  async getRevenueForecast(days: number = 30): Promise<RevenueForecast[]> {
    try {
      const forecast: RevenueForecast[] = [];
      const now = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        forecast.push({
          date: date.toISOString().split('T')[0],
          predicted: 0,
        });
      }

      return forecast;
    } catch (error) {
      console.error('Failed to fetch revenue forecast:', error);
      return [];
    }
  }

  // Get settlement statistics
  async getSettlementStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to fetch settlement stats:', error);
      return [];
    }
  }
}

// Singleton instance
export const economyService = new EconomyService();