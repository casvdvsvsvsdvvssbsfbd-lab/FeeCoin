// ============================================
// Revenue Aggregator Service
// Collect and aggregate revenue from all providers
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface RevenueRecord {
  id: string;
  providerId: string;
  providerName: string;
  userId: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'RUB' | 'COINS' | 'CREDITS';
  amountUsd: number;
  type: 'ad' | 'offer' | 'survey' | 'install';
  status: 'pending' | 'confirmed' | 'rejected' | 'processing' | 'completed';
  settlementCycle: string;
  metadata: any;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface ProviderRevenue {
  providerId: string;
  providerName: string;
  totalRevenue: number;
  totalRevenueUsd: number;
  transactionCount: number;
  averageRevenue: number;
  currency: string;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalRevenueUsd: number;
  byProvider: ProviderRevenue[];
  byType: {
    ad: number;
    offer: number;
    survey: number;
    install: number;
  };
  byCurrency: {
    USD: number;
    EUR: number;
    RUB: number;
    COINS: number;
    CREDITS: number;
  };
  pendingRevenue: number;
  confirmedRevenue: number;
  completedRevenue: number;
}

class RevenueAggregatorService {
  private analytics = useAnalytics();

  // Aggregate revenue from provider callbacks
  async aggregateRevenue(providerId: string, providerName: string, userId: string, data: {
    amount: number;
    currency: string;
    type: 'ad' | 'offer' | 'survey' | 'install';
    metadata?: any;
  }): Promise<string | null> {
    try {
      const amountUsd = await this.convertToUsd(data.amount, data.currency);

      const { data: record, error } = await supabase
        .from('revenue_records')
        .insert({
          provider_id: providerId,
          provider_name: providerName,
          user_id: userId,
          amount: data.amount,
          currency: data.currency,
          amount_usd: amountUsd,
          type: data.type,
          status: 'pending',
          settlement_cycle: this.getCurrentSettlementCycle(),
          metadata: data.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      this.analytics.trackEvent('revenue_aggregated', {
        providerId,
        userId,
        amount: data.amount,
        amountUsd,
        type: data.type,
      });

      return record.id;
    } catch (error) {
      console.error('Failed to aggregate revenue:', error);
      return null;
    }
  }

  // Convert currency to USD
  private async convertToUsd(amount: number, currency: string): Promise<number> {
    try {
      // Get exchange rates from remote config
      const rates = await this.getExchangeRates();
      const rate = rates[currency] || 1;
      return amount * rate;
    } catch (error) {
      console.error('Failed to convert currency:', error);
      return amount;
    }
  }

  // Get exchange rates
  private async getExchangeRates(): Promise<{ [key: string]: number }> {
    // Default rates (would be updated from remote config)
    return {
      'USD': 1,
      'EUR': 1.08,
      'RUB': 0.011,
      'COINS': 0.01,
      'CREDITS': 0.05,
    };
  }

  // Get current settlement cycle
  private getCurrentSettlementCycle(): string {
    const now = new Date();
    const cycle = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return cycle;
  }

  // Get revenue summary
  async getRevenueSummary(filters?: {
    startDate?: string;
    endDate?: string;
    providerId?: string;
    type?: string;
  }): Promise<RevenueSummary> {
    try {
      let query = supabase.from('revenue_records').select('*');

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query;

      if (error) throw error;

      const records = data || [];

      // Calculate totals
      const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);
      const totalRevenueUsd = records.reduce((sum, r) => sum + r.amount_usd, 0);

      // By provider
      const providerMap = new Map<string, ProviderRevenue>();
      records.forEach(record => {
        const existing = providerMap.get(record.provider_id);
        if (existing) {
          existing.totalRevenue += record.amount;
          existing.totalRevenueUsd += record.amount_usd;
          existing.transactionCount += 1;
        } else {
          providerMap.set(record.provider_id, {
            providerId: record.provider_id,
            providerName: record.provider_name,
            totalRevenue: record.amount,
            totalRevenueUsd: record.amount_usd,
            transactionCount: 1,
            averageRevenue: record.amount_usd,
            currency: record.currency,
          });
        }
      });

      const byProvider = Array.from(providerMap.values()).map(p => ({
        ...p,
        averageRevenue: p.totalRevenueUsd / p.transactionCount,
      }));

      // By type
      const byType = {
        ad: records.filter(r => r.type === 'ad').reduce((sum, r) => sum + r.amount_usd, 0),
        offer: records.filter(r => r.type === 'offer').reduce((sum, r) => sum + r.amount_usd, 0),
        survey: records.filter(r => r.type === 'survey').reduce((sum, r) => sum + r.amount_usd, 0),
        install: records.filter(r => r.type === 'install').reduce((sum, r) => sum + r.amount_usd, 0),
      };

      // By currency
      const byCurrency = {
        USD: records.filter(r => r.currency === 'USD').reduce((sum, r) => sum + r.amount, 0),
        EUR: records.filter(r => r.currency === 'EUR').reduce((sum, r) => sum + r.amount, 0),
        RUB: records.filter(r => r.currency === 'RUB').reduce((sum, r) => sum + r.amount, 0),
        COINS: records.filter(r => r.currency === 'COINS').reduce((sum, r) => sum + r.amount, 0),
        CREDITS: records.filter(r => r.currency === 'CREDITS').reduce((sum, r) => sum + r.amount, 0),
      };

      // By status
      const pendingRevenue = records.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount_usd, 0);
      const confirmedRevenue = records.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.amount_usd, 0);
      const completedRevenue = records.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount_usd, 0);

      return {
        totalRevenue,
        totalRevenueUsd,
        byProvider,
        byType,
        byCurrency,
        pendingRevenue,
        confirmedRevenue,
        completedRevenue,
      };
    } catch (error) {
      console.error('Failed to get revenue summary:', error);
      return {
        totalRevenue: 0,
        totalRevenueUsd: 0,
        byProvider: [],
        byType: { ad: 0, offer: 0, survey: 0, install: 0 },
        byCurrency: { USD: 0, EUR: 0, RUB: 0, COINS: 0, CREDITS: 0 },
        pendingRevenue: 0,
        confirmedRevenue: 0,
        completedRevenue: 0,
      };
    }
  }

  // Confirm revenue
  async confirmRevenue(recordId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('revenue_records')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', recordId);

      if (error) throw error;

      this.analytics.trackEvent('revenue_confirmed', { recordId });
      return true;
    } catch (error) {
      console.error('Failed to confirm revenue:', error);
      return false;
    }
  }

  // Complete revenue
  async completeRevenue(recordId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('revenue_records')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', recordId);

      if (error) throw error;

      this.analytics.trackEvent('revenue_completed', { recordId });
      return true;
    } catch (error) {
      console.error('Failed to complete revenue:', error);
      return false;
    }
  }

  // Reject revenue
  async rejectRevenue(recordId: string, reason: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('revenue_records')
        .update({
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', recordId);

      if (error) throw error;

      this.analytics.trackEvent('revenue_rejected', { recordId, reason });
      return true;
    } catch (error) {
      console.error('Failed to reject revenue:', error);
      return false;
    }
  }

  // Get pending revenue for settlement
  async getPendingRevenue(settlementCycle?: string): Promise<RevenueRecord[]> {
    try {
      const cycle = settlementCycle || this.getCurrentSettlementCycle();

      const { data, error } = await supabase
        .from('revenue_records')
        .select('*')
        .eq('status', 'confirmed')
        .eq('settlement_cycle', cycle)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(r => ({
        id: r.id,
        providerId: r.provider_id,
        providerName: r.provider_name,
        userId: r.user_id,
        amount: r.amount,
        currency: r.currency,
        amountUsd: r.amount_usd,
        type: r.type,
        status: r.status,
        settlementCycle: r.settlement_cycle,
        metadata: r.metadata,
        createdAt: r.created_at,
        confirmedAt: r.confirmed_at,
        completedAt: r.completed_at,
      }));
    } catch (error) {
      console.error('Failed to get pending revenue:', error);
      return [];
    }
  }
}

// Singleton instance
export const revenueAggregatorService = new RevenueAggregatorService();