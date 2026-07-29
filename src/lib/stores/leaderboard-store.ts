// ============================================
// Leaderboard Store
// ============================================

import { create } from 'zustand';

export interface LeaderboardState {
  // Leaderboard data
  rankings: any[];
  userRank: any | null;
  topUsers: any[];
  
  // Time periods
  daily: any[];
  weekly: any[];
  monthly: any[];
  allTime: any[];
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  currentPeriod: 'daily' | 'weekly' | 'monthly' | 'allTime';
  
  // Actions
  setRankings: (rankings: any[]) => void;
  setUserRank: (rank: any | null) => void;
  setPeriod: (period: 'daily' | 'weekly' | 'monthly' | 'allTime') => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  // Initial state
  rankings: [],
  userRank: null,
  topUsers: [],
  daily: [],
  weekly: [],
  monthly: [],
  allTime: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
  currentPeriod: 'weekly',

  // Actions
  setRankings: (rankings) => set({
    rankings,
    topUsers: rankings.slice(0, 10),
    lastUpdated: new Date()
  }),

  setUserRank: (userRank) => set({ userRank }),

  setPeriod: (currentPeriod) => {
    const periodData = {
      daily: 'daily',
      weekly: 'weekly',
      monthly: 'monthly',
      allTime: 'allTime'
    }[currentPeriod];
    
    set({ 
      currentPeriod: periodData as any,
      rankings: (set as any).getState()[periodData as keyof LeaderboardState] as any || []
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  reset: () => set({
    rankings: [],
    userRank: null,
    topUsers: [],
    daily: [],
    weekly: [],
    monthly: [],
    allTime: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
    currentPeriod: 'weekly',
  }),
}));