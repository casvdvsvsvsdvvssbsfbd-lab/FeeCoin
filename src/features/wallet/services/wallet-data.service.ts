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
        availableFC: data.balance || 0,
        pendingFC: data.pending_balance || 0,
        totalEarned: data.total_earned || 0,
        totalSpent: data.total_withdrawn || 0,
        energy: 100,
        maxEnergy: 100,
        withdrawalProgress: 0,
        estimatedUnlockDate: null,
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

      return (data || []).map(tx => ({
        id: tx.id,
        type: tx.transaction_type as Transaction['type'],
        amount: tx.amount,
        status: tx.status as Transaction['status'],
        description: tx.description || '',
        timestamp: tx.created_at,
        metadata: tx.metadata,
      }));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return [];
    }
  }

  // Fetch withdrawal history (from settlements table)
  async getWithdrawals(userId: string): Promise<Withdrawal[]> {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(w => ({
        id: w.id,
        amount: w.amount,
        status: w.status as Withdrawal['status'],
        method: w.payment_method || 'unknown',
        createdAt: w.created_at,
        completedAt: w.processed_at || undefined,
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

      if (!wallet || wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Create withdrawal request (settlement)
      const { error: withdrawalError } = await supabase.from('settlements').insert({
        user_id: userId,
        amount,
        currency: 'FC',
        status: 'pending',
        payment_method: method,
        payment_details: {},
      });

      if (withdrawalError) throw withdrawalError;

      // Deduct from available balance
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - amount })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Record transaction
      await supabase.from('transactions').insert({
        user_id: userId,
        wallet_id: wallet.id,
        transaction_type: 'withdrawal',
        amount,
        status: 'pending',
        description: `Withdrawal to ${method}`,
        metadata: { method },
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
    const { platform, referral } = deriveSourceBalances(data.transactions, data.wallet.availableFC);
    walletStore.setBalance(data.wallet.availableFC);
    walletStore.setFcBalance(data.wallet.availableFC);
    walletStore.setPlatformBalance(platform);
    walletStore.setReferralBalance(referral);
    walletStore.setWithdrawableBalance(Math.max(0, data.wallet.availableFC - data.wallet.pendingFC));
    walletStore.setTransactions(data.transactions);
    walletStore.setWithdrawals(data.withdrawals);
    walletStore.setError(null);
  }

  /**
   * Hydrate the Zustand wallet store with real data. Always sets the loading
   * flag false in the end so the Wallet UI never sticks on a spinner, even
   * when Supabase errors or returns empty data.
   */
  async hydrateWallet(userId: string): Promise<void> {
    if (!userId) {
      const store = useWalletStore.getState();
      store.setLoading(false);
      store.setError('User not authenticated');
      return;
    }

    const store = useWalletStore.getState();
    store.setLoading(true);
    store.setError(null);
    try {
      const data = await this.loadWalletData(userId);
      const { platform, referral } = deriveSourceBalances(data.transactions, data.wallet.availableFC);
      store.setBalance(data.wallet.availableFC);
      store.setFcBalance(data.wallet.availableFC);
      store.setPlatformBalance(platform);
      store.setReferralBalance(referral);
      // Withdrawable = available minus pending, floored at 0.
      store.setWithdrawableBalance(Math.max(0, data.wallet.availableFC - data.wallet.pendingFC));
      store.setTransactions(data.transactions);
      store.setWithdrawals(data.withdrawals);
    } catch (error: any) {
      store.setError(error?.message || 'Failed to load wallet');
    } finally {
      store.setLoading(false);
    }
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

      return (data || []).map(tx => ({
        id: tx.id,
        type: tx.transaction_type as Transaction['type'],
        amount: tx.amount,
        status: tx.status as Transaction['status'],
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

// ─── Source-balance derivation ─────────────────────────────
// Splits the available balance into platform vs referral buckets
// based on each transaction's reference_type / description. Falls
// back to the full available balance if no referral signal exists.

const REFERRAL_HINTS = [
  'refer',
  'referral',
  'invite',
  'friend',
  'team',
  'bonus',
];

function isReferralTx(tx: Transaction): boolean {
  const meta = tx.metadata || {};
  const refType = String(meta?.reference_type || meta?.source || '');
  const desc = String(tx.description || '').toLowerCase();
  return REFERRAL_HINTS.some((h) => refType.toLowerCase().includes(h) || desc.includes(h));
}

function deriveSourceBalances(
  transactions: Transaction[],
  availableFC: number,
): { platform: number; referral: number } {
  let referral = 0;
  for (const tx of transactions) {
    // Only completed positive earnings count toward the buckets.
    if (tx.status !== 'completed' || tx.amount <= 0) continue;
    if (isReferralTx(tx)) referral += tx.amount;
  }

  // Clamp so the two buckets never exceed the real available balance.
  referral = Math.min(referral, availableFC);
  const platform = Math.max(0, availableFC - referral);
  return { platform, referral };
}

// Singleton instance
export const walletDataService = new WalletDataService();

