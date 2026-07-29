// ============================================
// Financial Ledger Service
// Immutable financial record keeping
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface LedgerEntry {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'adjustment' | 'settlement' | 'withdrawal' | 'refund' | 'correction' | 'rollback';
  amount: number;
  currency: string;
  amountUsd: number;
  balance: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  metadata: any;
  signature: string;
  createdAt: string;
}

export interface LedgerSummary {
  totalCredits: number;
  totalDebits: number;
  totalAdjustments: number;
  totalSettlements: number;
  totalWithdrawals: number;
  totalRefunds: number;
  currentBalance: number;
  entryCount: number;
}

class FinancialLedgerService {
  private analytics = useAnalytics();

  // Create ledger entry
  async createEntry(entry: Omit<LedgerEntry, 'id' | 'signature' | 'createdAt' | 'balance'>): Promise<string | null> {
    try {
      // Get current balance
      const currentBalance = await this.getCurrentBalance(entry.userId, entry.currency);
      
      // Calculate new balance
      let newBalance = currentBalance;
      switch (entry.type) {
        case 'credit':
        case 'settlement':
        case 'refund':
        case 'correction':
          newBalance += entry.amount;
          break;
        case 'debit':
        case 'withdrawal':
          newBalance -= entry.amount;
          break;
        case 'adjustment':
          newBalance = entry.amount; // Set to specific amount
          break;
        case 'rollback':
          // Rollback logic
          newBalance = currentBalance - entry.amount;
          break;
      }

      // Generate signature for immutability
      const signature = this.generateSignature(entry, newBalance);

      const { data, error } = await supabase
        .from('financial_ledger')
        .insert({
          user_id: entry.userId,
          type: entry.type,
          amount: entry.amount,
          currency: entry.currency,
          amount_usd: entry.amountUsd,
          balance: newBalance,
          description: entry.description,
          reference_id: entry.referenceId,
          reference_type: entry.referenceType,
          metadata: entry.metadata || {},
          signature,
          previous_entry_id: await this.getLastEntryId(entry.userId),
        })
        .select()
        .single();

      if (error) throw error;

      this.analytics.trackEvent('ledger_entry_created', {
        userId: entry.userId,
        type: entry.type,
        amount: entry.amount,
        currency: entry.currency,
      });

      return data.id;
    } catch (error) {
      console.error('Failed to create ledger entry:', error);
      return null;
    }
  }

  // Get current balance
  async getCurrentBalance(userId: string, currency: string = 'USD'): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('financial_ledger')
        .select('balance')
        .eq('user_id', userId)
        .eq('currency', currency)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        return data[0].balance;
      }

      return 0;
    } catch (error) {
      console.error('Failed to get current balance:', error);
      return 0;
    }
  }

  // Get last entry ID
  private async getLastEntryId(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('financial_ledger')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      return data && data.length > 0 ? data[0].id : null;
    } catch (error) {
      return null;
    }
  }

  // Generate signature for immutability
  private generateSignature(entry: Omit<LedgerEntry, 'id' | 'signature' | 'createdAt' | 'balance'>, balance: number): string {
    const data = `${entry.userId}|${entry.type}|${entry.amount}|${entry.currency}|${entry.amountUsd}|${balance}|${entry.description || ''}|${entry.referenceId || ''}|${Date.now()}`;
    return this.hash(data);
  }

  // Simple hash function
  private hash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `ledger_${Math.abs(hash).toString(16)}_${Date.now().toString(36)}`;
  }

  // Verify ledger integrity
  async verifyIntegrity(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('financial_ledger')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const entries = data || [];
      let previousBalance = 0;

      for (const entry of entries) {
        // Recalculate expected balance
        let expectedBalance = previousBalance;
        switch (entry.type) {
          case 'credit':
          case 'settlement':
          case 'refund':
          case 'correction':
            expectedBalance += entry.amount;
            break;
          case 'debit':
          case 'withdrawal':
            expectedBalance -= entry.amount;
            break;
          case 'adjustment':
            expectedBalance = entry.amount;
            break;
        }

        // Check balance matches
        if (entry.balance !== expectedBalance) {
          console.error('Ledger integrity violation:', {
            entryId: entry.id,
            expected: expectedBalance,
            actual: entry.balance,
          });
          return false;
        }

        previousBalance = entry.balance;
      }

      return true;
    } catch (error) {
      console.error('Failed to verify ledger integrity:', error);
      return false;
    }
  }

  // Get ledger entries for user
  async getLedgerEntries(userId: string, filters?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ entries: LedgerEntry[]; total: number }> {
    try {
      let query = supabase
        .from('financial_ledger')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, count, error } = await query;

      if (error) throw error;

      const entries = (data || []).map(e => ({
        id: e.id,
        userId: e.user_id,
        type: e.type,
        amount: e.amount,
        currency: e.currency,
        amountUsd: e.amount_usd,
        balance: e.balance,
        description: e.description,
        referenceId: e.reference_id,
        referenceType: e.reference_type,
        metadata: e.metadata,
        signature: e.signature,
        createdAt: e.created_at,
      }));

      return { entries, total: count || 0 };
    } catch (error) {
      console.error('Failed to fetch ledger entries:', error);
      return { entries: [], total: 0 };
    }
  }

  // Get ledger summary
  async getLedgerSummary(userId: string): Promise<LedgerSummary> {
    try {
      const { data, error } = await supabase
        .from('financial_ledger')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const entries = data || [];

      return {
        totalCredits: entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0),
        totalDebits: entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0),
        totalAdjustments: entries.filter(e => e.type === 'adjustment').reduce((sum, e) => sum + e.amount, 0),
        totalSettlements: entries.filter(e => e.type === 'settlement').reduce((sum, e) => sum + e.amount, 0),
        totalWithdrawals: entries.filter(e => e.type === 'withdrawal').reduce((sum, e) => sum + e.amount, 0),
        totalRefunds: entries.filter(e => e.type === 'refund').reduce((sum, e) => sum + e.amount, 0),
        currentBalance: entries.length > 0 ? entries[entries.length - 1].balance : 0,
        entryCount: entries.length,
      };
    } catch (error) {
      console.error('Failed to get ledger summary:', error);
      return {
        totalCredits: 0,
        totalDebits: 0,
        totalAdjustments: 0,
        totalSettlements: 0,
        totalWithdrawals: 0,
        totalRefunds: 0,
        currentBalance: 0,
        entryCount: 0,
      };
    }
  }
}

// Singleton instance
export const financialLedgerService = new FinancialLedgerService();