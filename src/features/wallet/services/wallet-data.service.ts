// ============================================
// Wallet Screen Data Service
// Connects UI to real production data
// ============================================

import { supabase } from '@/lib/supabase';
import { useWalletStore } from '@/lib/stores/wallet-store';
import { useAnalytics } from '@/lib/analytics';

export interface WalletData {
  availableFC: number;
  pendingFC: number;
  totalEarned: number;
  totalSpent: number;
  energy: number;
  maxEnergy: number;
  withdrawalProgress: number;
  estimatedUnlockDate: string | null;
}

export interface Transaction {
  id: string;
  type: 'reward' | 'withdrawal' | 'deposit' | 'fee';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  createdAt: string;
  completedAt?: string;
}

class WalletDataService {
  private analytics = useAnalytics();

  // Fetch wallet data
  async getWalletData(userId: string): Promise<WalletData> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        availableFC: data.available_fc || 0,
        pendingFC: data.pending_fc || 0,
        totalEarned: data.total_earned || 0,
        totalSpent: data.total_spent || 0,
        energy: data.energy || 100,
        maxEnergy: data.max_energy || 100,
        withdrawalProgress: data.withdrawal_progress || 0,
        estimatedUnlockDate: data.estimated_unlock_date || null,
      };
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      return {
        availableFC: 0,
        pendingFC: 0,
        totalEarned: 0,
        totalSpent: 0,
        energy: 100,
        maxEnergy: 100,
        withdrawalProgress: 0,
        estimatedUnlockDate: null,
      };
    }
  }

  // Fetch transaction history
  async getTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        description: tx.description || '',
        timestamp: tx.created_at,
        metadata: tx.metadata,
      }));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return [];
    }
  }

  // Fetch withdrawal history
  async getWithdrawals(userId: string): Promise<Withdrawal[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(w => ({
        id: w.id,
        amount: w.amount,
        status: w.status,
        method: w.method,
        createdAt: w.created_at,
        completedAt: w.completed_at,
      }));
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      return [];
    }
  }

  // Request withdrawal
  async requestWithdrawal(userId: string, amount: number, method: string): Promise<boolean> {
    try {
      // Check eligibility
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!wallet || wallet.available_fc < amount) {
        throw new Error('Insufficient balance');
      }

      // Create withdrawal request
      const { error: withdrawalError } = await supabase.from('withdrawals').insert({
        user_id: userId,
        amount,
        method,
        status: 'pending',
      });

      if (withdrawalError) throw withdrawalError;

      // Deduct from available balance
      const { error: updateError } = await supabase.rpc('decrement_wallet_balance', {
        p_user_id: userId,
        p_amount: amount,
      });

      if (updateError) throw updateError;

      // Record transaction
      await supabase.from('transactions').insert({
        user_id: userId,
        type: 'withdrawal',
        amount: -amount,
        status: 'pending',
        description: `Withdrawal to ${method}`,
        metadata: { method, withdrawalId: userId },
      });

      // Track analytics
      this.analytics.trackEvent('withdrawal_requested', { amount, method });

      // Update wallet store
      const walletStore = useWalletStore.getState();
      walletStore.updateBalance(-amount);

      return true;
    } catch (error) {
      console.error('Failed to request withdrawal:', error);
      return false;
    }
  }

  // Load all wallet data
  async loadWalletData(userId: string): Promise<{
    wallet: WalletData;
    transactions: Transaction[];
    withdrawals: Withdrawal[];
  }> {
    const [wallet, transactions, withdrawals] = await Promise.all([
      this.getWalletData(userId),
      this.getTransactions(userId),
      this.getWithdrawals(userId),
    ]);

    return {
      wallet,
      transactions,
      withdrawals,
    };
  }

  // Refresh wallet data
  async refreshWallet(userId: string): Promise<void> {
    const data = await this.loadWalletData(userId);
    
    const walletStore = useWalletStore.getState();
    walletStore.setBalance(data.wallet.availableFC);
    walletStore.setFcBalance(data.wallet.availableFC);
  }

  // Get pending rewards
  async getPendingRewards(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        description: tx.description || '',
        timestamp: tx.created_at,
        metadata: tx.metadata,
      }));
    } catch (error) {
      console.error('Failed to fetch pending rewards:', error);
      return [];
    }
  }
}

// Singleton instance
export const walletDataService = new WalletDataService();
