// ============================================
// Realtime Store
// ============================================

import { create } from 'zustand';

export interface RealtimeState {
  // Connection state
  isConnected: boolean;
  isReconnecting: boolean;
  lastHeartbeat: Date | null;
  
  // Subscriptions
  subscriptions: Map<string, any>;
  
  // Pending updates
  pendingUpdates: any[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setConnected: (connected: boolean) => void;
  setReconnecting: (reconnecting: boolean) => void;
  updateHeartbeat: () => void;
  addSubscription: (channel: string, data: any) => void;
  removeSubscription: (channel: string) => void;
  addPendingUpdate: (update: any) => void;
  clearPendingUpdates: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  // Initial state
  isConnected: false,
  isReconnecting: false,
  lastHeartbeat: null,
  subscriptions: new Map(),
  pendingUpdates: [],
  isLoading: false,
  error: null,

  // Actions
  setConnected: (isConnected) => set({ 
    isConnected,
    isReconnecting: false
  }),

  setReconnecting: (isReconnecting) => set({ 
    isReconnecting,
    error: isReconnecting ? 'Reconnecting...' : null
  }),

  updateHeartbeat: () => set({ 
    lastHeartbeat: new Date() 
  }),

  addSubscription: (channel, data) => set((state) => {
    const newSubscriptions = new Map(state.subscriptions);
    newSubscriptions.set(channel, data);
    return { subscriptions: newSubscriptions };
  }),

  removeSubscription: (channel) => set((state) => {
    const newSubscriptions = new Map(state.subscriptions);
    newSubscriptions.delete(channel);
    return { subscriptions: newSubscriptions };
  }),

  addPendingUpdate: (update) => set((state) => ({
    pendingUpdates: [...state.pendingUpdates, update]
  })),

  clearPendingUpdates: () => set({ pendingUpdates: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set({
    isConnected: false,
    isReconnecting: false,
    lastHeartbeat: null,
    subscriptions: new Map(),
    pendingUpdates: [],
    isLoading: false,
    error: null,
  }),
}));