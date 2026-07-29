// ============================================
// Settings Store
// ============================================

import { create } from 'zustand';

export interface SettingsState {
  // App settings
  language: string;
  country: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  
  // Feature flags
  featureFlags: Record<string, boolean>;
  remoteConfig: Record<string, any>;
  
  // Notification settings
  notificationsEnabled: boolean;
  notificationSound: boolean;
  notificationVibration: boolean;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setLanguage: (language: string) => void;
  setCountry: (country: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFeatureFlag: (key: string, value: boolean) => void;
  setRemoteConfig: (key: string, value: any) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  // Initial state
  language: 'en',
  country: 'US',
  currency: 'FC',
  theme: 'system',
  featureFlags: {},
  remoteConfig: {},
  notificationsEnabled: true,
  notificationSound: true,
  notificationVibration: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,

  // Actions
  setLanguage: (language) => set({ 
    language,
    lastUpdated: new Date()
  }),

  setCountry: (country) => set({ 
    country,
    lastUpdated: new Date()
  }),

  setTheme: (theme) => set({ 
    theme,
    lastUpdated: new Date()
  }),

  setFeatureFlag: (key, value) => set((state) => ({
    featureFlags: { ...state.featureFlags, [key]: value },
    lastUpdated: new Date()
  })),

  setRemoteConfig: (key, value) => set((state) => ({
    remoteConfig: { ...state.remoteConfig, [key]: value },
    lastUpdated: new Date()
  })),

  setNotificationsEnabled: (notificationsEnabled) => set({ 
    notificationsEnabled,
    lastUpdated: new Date()
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  reset: () => set({
    language: 'en',
    country: 'US',
    currency: 'FC',
    theme: 'system',
    featureFlags: {},
    remoteConfig: {},
    notificationsEnabled: true,
    notificationSound: true,
    notificationVibration: true,
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
  }),
}));