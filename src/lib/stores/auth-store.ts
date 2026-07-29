// ============================================
// Auth Store
// ============================================

import { create } from 'zustand';

export interface AuthState {
  // User state
  user: any | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Session state
  session: any | null;
  lastActivity: Date | null;
  
  // Actions
  setUser: (user: any | null) => void;
  setProfile: (profile: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSession: (session: any | null) => void;
  updateLastActivity: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  session: null,
  lastActivity: null,

  // Actions
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    lastActivity: new Date()
  }),

  setProfile: (profile) => set({ profile }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setSession: (session) => set({ 
    session,
    user: session?.user || null,
    isAuthenticated: !!session?.user
  }),

  updateLastActivity: () => set({ 
    lastActivity: new Date() 
  }),

  reset: () => set({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    session: null,
    lastActivity: null,
  }),
}));