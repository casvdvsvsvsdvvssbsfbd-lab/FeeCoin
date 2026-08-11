// ============================================
// Wallet Store
// ============================================

import { create } from 'zustand';

export interface WalletState {
  // Wallet data
  balance: number;
  currency: string;
  pendingWithdrawals: any[];
  transactionHistory: any[];

  // FC (Fuel Coin) specific
  fcBalance: number;
  fcEarned: number;
  fcSpent: number;

  // Logical balance buckets (backed by transaction derivations)
  platformBalance: number;
  referralBalance: number;
  withdrawableBalance: number;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setBalance: (balance: number) => void;
  setFcBalance: (balance: number) => void;
  setPlatformBalance: (platformBalance: number) => void;
  setReferralBalance: (referralBalance: number) => void;
  setWithdrawableBalance: (withdrawableBalance: number) => void;
  setTransactions: (transactions: any[]) => void;
  setWithdrawals: (withdrawals: any[]) => void;
  addTransaction: (transaction: any) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  updateBalance: (amount: number) => void;
  addFc: (amount: number) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  // Initial state
  balance: 0,
  currency: 'FC',
  pendingWithdrawals: [],
  transactionHistory: [],
  fcBalance: 0,
  fcEarned: 0,
  fcSpent: 0,
  platformBalance: 0,
  referralBalance: 0,
  withdrawableBalance: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,

  // Actions
  setBalance: (balance) => set({
    balance,
    lastUpdated: new Date(),
  }),

  setFcBalance: (fcBalance) => set({
    fcBalance,
    lastUpdated: new Date(),
  }),

  setPlatformBalance: (platformBalance) => set({
    platformBalance,
    lastUpdated: new Date(),
  }),

  setReferralBalance: (referralBalance) => set({
    referralBalance,
    lastUpdated: new Date(),
  }),

  setWithdrawableBalance: (withdrawableBalance) => set({
    withdrawableBalance,
    lastUpdated: new Date(),
  }),

  setTransactions: (transactionHistory) => set({
    transactionHistory,
    lastUpdated: new Date(),
  }),

  setWithdrawals: (pendingWithdrawals) => set({
    pendingWithdrawals,
    lastUpdated: new Date(),
  }),

  addTransaction: (transaction) => set((state) => ({
    transactionHistory: [transaction, ...state.transactionHistory].slice(0, 100),
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  updateBalance: (amount) => set((state) => ({
    balance: state.balance + amount,
    fcBalance: state.fcBalance + amount,
    lastUpdated: new Date(),
  })),

  addFc: (amount) => set((state) => ({
    balance: state.balance + amount,
    fcBalance: state.fcBalance + amount,
    fcEarned: state.fcEarned + amount,
    transactionHistory: [
      {
        id: `tx_${Date.now()}`,
        type: 'reward',
        amount,
        status: 'completed',
        description: 'Ad reward',
        timestamp: new Date().toISOString(),
      },
      ...state.transactionHistory,
    ].slice(0, 100),
    lastUpdated: new Date(),
  })),

  reset: () => set({
    balance: 0,
    currency: 'FC',
    pendingWithdrawals: [],
    transactionHistory: [],
    fcBalance: 0,
    fcEarned: 0,
    fcSpent: 0,
    platformBalance: 0,
    referralBalance: 0,
    withdrawableBalance: 0,
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
  }),
}));

