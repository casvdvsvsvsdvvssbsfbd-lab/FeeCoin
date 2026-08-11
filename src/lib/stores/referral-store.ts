// ============================================
// Referral Store
// ============================================

import { create } from 'zustand';

export interface ReferralEntry {
  id: string;
  userId: string;
  username: string;
  status: 'pending' | 'active' | 'completed';
  joinedAt: string;
  earnings: number;
}

export interface ReferralState {
  // Referral data
  referrals: ReferralEntry[];
  referralCode: string | null;
  referralLink: string | null;
  referredBy: string | null;
  totalReferrals: number;
  activeReferrals: number;
  referralEarnings: number;
  pendingEarnings: number;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setReferrals: (referrals: ReferralEntry[]) => void;
  setReferralCode: (code: string | null) => void;
  setReferralLink: (link: string | null) => void;
  setReferredBy: (code: string | null) => void;
  setStats: (stats: { totalReferrals: number; activeReferrals: number; referralEarnings: number; pendingEarnings: number }) => void;
  addReferral: (referral: ReferralEntry) => void;
  updateReferral: (referralId: string, updates: Partial<ReferralEntry>) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReferralStore = create<ReferralState>((set) => ({
  // Initial state
  referrals: [],
  referralCode: null,
  referralLink: null,
  referredBy: null,
  totalReferrals: 0,
  activeReferrals: 0,
  referralEarnings: 0,
  pendingEarnings: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,

  // Actions
  setReferrals: (referrals) => set((state) => {
    const totalReferrals = referrals.length;
    // DB referral statuses are 'pending' | 'completed'. Treat 'completed'
    // (and 'active') as active earnings referrals.
    const activeReferrals = referrals.filter((r) => r.status === 'completed' || r.status === 'active').length;
    const referralEarnings = referrals.reduce((sum, r) => sum + (r.earnings || 0), 0);
    return {
      referrals,
      totalReferrals,
      activeReferrals,
      referralEarnings,
      lastUpdated: new Date(),
    };
  }),

  setReferralCode: (referralCode) => set({ referralCode }),

  setReferralLink: (referralLink) => set({ referralLink }),

  setReferredBy: (referredBy) => set({ referredBy }),

  setStats: (stats) => set({
    ...stats,
    lastUpdated: new Date(),
  }),

  addReferral: (referral) => set((state) => {
    const isActive = referral.status === 'completed' || referral.status === 'active';
    return {
      referrals: [...state.referrals, referral],
      totalReferrals: state.totalReferrals + 1,
      activeReferrals: state.activeReferrals + (isActive ? 1 : 0),
      referralEarnings: state.referralEarnings + (referral.earnings || 0),
      lastUpdated: new Date(),
    };
  }),

  updateReferral: (referralId, updates) => set((state) => ({
    referrals: state.referrals.map((r) => r.id === referralId ? { ...r, ...updates } : r),
    lastUpdated: new Date(),
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  reset: () => set({
    referrals: [],
    referralCode: null,
    referralLink: null,
    referredBy: null,
    totalReferrals: 0,
    activeReferrals: 0,
    referralEarnings: 0,
    pendingEarnings: 0,
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
  }),
}));
