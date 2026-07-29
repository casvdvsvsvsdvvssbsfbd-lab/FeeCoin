// ============================================
// Referral Store
// ============================================

import { create } from 'zustand';

export interface ReferralState {
  // Referral data
  referrals: any[];
  referralCode: string | null;
  referredBy: string | null;
  totalReferrals: number;
  activeReferrals: number;
  referralEarnings: number;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setReferrals: (referrals: any[]) => void;
  setReferralCode: (code: string | null) => void;
  setReferredBy: (code: string | null) => void;
  addReferral: (referral: any) => void;
  updateReferral: (referralId: string, updates: any) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReferralStore = create<ReferralState>((set) => ({
  // Initial state
  referrals: [],
  referralCode: null,
  referredBy: null,
  totalReferrals: 0,
  activeReferrals: 0,
  referralEarnings: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,

  // Actions
  setReferrals: (referrals) => set({
    referrals,
    totalReferrals: referrals.length,
    activeReferrals: referrals.filter((r: any) => r.status === 'active').length,
    lastUpdated: new Date()
  }),

  setReferralCode: (referralCode) => set({ referralCode }),

  setReferredBy: (referredBy) => set({ referredBy }),

  addReferral: (referral) => set((state) => ({
    referrals: [...state.referrals, referral],
    totalReferrals: state.totalReferrals + 1,
    activeReferrals: referral.status === 'active' ? state.activeReferrals + 1 : state.activeReferrals,
    lastUpdated: new Date()
  })),

  updateReferral: (referralId, updates) => set((state) => ({
    referrals: state.referrals.map((r: any) => r.id === referralId ? { ...r, ...updates } : r),
    lastUpdated: new Date()
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  reset: () => set({
    referrals: [],
    referralCode: null,
    referredBy: null,
    totalReferrals: 0,
    activeReferrals: 0,
    referralEarnings: 0,
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
  }),
}));