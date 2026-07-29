// ============================================
// App Store
// ============================================

import { create } from 'zustand';

export interface AppState {
  // App state
  isInitialized: boolean;
  isOnline: boolean;
  isMaintenanceMode: boolean;
  appVersion: string;
  forceUpdate: boolean;
  
  // Navigation state
  currentRoute: string;
  previousRoute: string | null;
  navigationHistory: string[];
  
  // Energy state
  energy: number;
  maxEnergy: number;
  lastEnergyUpdate: Date | null;
  
  // Streak state
  streak: number;
  lastLoginDate: Date | null;
  
  // FC progress
  fcProgress: number;
  fcLevel: number;
  
  // Loading states
  isLoading: boolean;
  isBootstrapping: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setInitialized: (initialized: boolean) => void;
  setOnline: (online: boolean) => void;
  setMaintenanceMode: (enabled: boolean) => void;
  setAppVersion: (version: string) => void;
  setForceUpdate: (force: boolean) => void;
  navigate: (route: string) => void;
  setEnergy: (energy: number) => void;
  setMaxEnergy: (max: number) => void;
  updateEnergy: (amount: number) => void;
  setStreak: (streak: number) => void;
  setLastLoginDate: (date: Date | null) => void;
  setFcProgress: (progress: number) => void;
  setFcLevel: (level: number) => void;
  setLoading: (loading: boolean) => void;
  setBootstrapping: (bootstrapping: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isInitialized: false,
  isOnline: true,
  isMaintenanceMode: false,
  appVersion: '1.0.0',
  forceUpdate: false,
  currentRoute: '/',
  previousRoute: null,
  navigationHistory: [],
  energy: 100,
  maxEnergy: 100,
  lastEnergyUpdate: null,
  streak: 0,
  lastLoginDate: null,
  fcProgress: 0,
  fcLevel: 1,
  isLoading: false,
  isBootstrapping: true,
  error: null,
  lastUpdated: null,

  // Actions
  setInitialized: (isInitialized) => set({ 
    isInitialized,
    lastUpdated: new Date()
  }),

  setOnline: (isOnline) => set({ 
    isOnline,
    error: isOnline ? null : 'You are offline'
  }),

  setMaintenanceMode: (isMaintenanceMode) => set({ 
    isMaintenanceMode,
    lastUpdated: new Date()
  }),

  setAppVersion: (appVersion) => set({ 
    appVersion,
    lastUpdated: new Date()
  }),

  setForceUpdate: (forceUpdate) => set({ forceUpdate }),

  navigate: (currentRoute) => set((state) => ({
    currentRoute,
    previousRoute: state.currentRoute,
    navigationHistory: [...state.navigationHistory, state.currentRoute].slice(-10)
  })),

  setEnergy: (energy) => set({ 
    energy,
    lastEnergyUpdate: new Date(),
    lastUpdated: new Date()
  }),

  setMaxEnergy: (maxEnergy) => set({ 
    maxEnergy,
    lastUpdated: new Date()
  }),

  updateEnergy: (amount) => set((state) => ({
    energy: Math.max(0, Math.min(state.maxEnergy, state.energy + amount)),
    lastEnergyUpdate: new Date(),
    lastUpdated: new Date()
  })),

  setStreak: (streak) => set({ 
    streak,
    lastUpdated: new Date()
  }),

  setLastLoginDate: (lastLoginDate) => set({ 
    lastLoginDate,
    lastUpdated: new Date()
  }),

  setFcProgress: (fcProgress) => set({ 
    fcProgress,
    lastUpdated: new Date()
  }),

  setFcLevel: (fcLevel) => set({ 
    fcLevel,
    lastUpdated: new Date()
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),

  setError: (error) => set({ error }),

  reset: () => set({
    isInitialized: false,
    isOnline: true,
    isMaintenanceMode: false,
    appVersion: '1.0.0',
    forceUpdate: false,
    currentRoute: '/',
    previousRoute: null,
    navigationHistory: [],
    energy: 100,
    maxEnergy: 100,
    lastEnergyUpdate: null,
    streak: 0,
    lastLoginDate: null,
    fcProgress: 0,
    fcLevel: 1,
    isLoading: false,
    isBootstrapping: true,
    error: null,
    lastUpdated: null,
  }),
}));