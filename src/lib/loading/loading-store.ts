// ============================================
// Global Loading Store
// Production-ready loading state management
// ============================================

import { create } from 'zustand';

export interface LoadingState {
  // Global loading
  isGlobalLoading: boolean;
  globalLoadingMessage: string;
  
  // Page loading
  isPageLoading: boolean;
  pageLoadingMessage: string;
  
  // Component loading
  componentLoading: Record<string, boolean>;
  
  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setPageLoading: (loading: boolean, message?: string) => void;
  setComponentLoading: (componentId: string, loading: boolean) => void;
  hideAllLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  // Initial state
  isGlobalLoading: false,
  globalLoadingMessage: '',
  isPageLoading: false,
  pageLoadingMessage: '',
  componentLoading: {},

  // Actions
  setGlobalLoading: (loading, message = '') => set({
    isGlobalLoading: loading,
    globalLoadingMessage: message,
  }),

  setPageLoading: (loading, message = '') => set({
    isPageLoading: loading,
    pageLoadingMessage: message,
  }),

  setComponentLoading: (componentId, loading) => set((state) => ({
    componentLoading: {
      ...state.componentLoading,
      [componentId]: loading,
    },
  })),

  hideAllLoading: () => set({
    isGlobalLoading: false,
    globalLoadingMessage: '',
    isPageLoading: false,
    pageLoadingMessage: '',
    componentLoading: {},
  }),
}));

// Helper hooks
export const useGlobalLoading = () => {
  const { isGlobalLoading, globalLoadingMessage, setGlobalLoading } = useLoadingStore();
  return { isGlobalLoading, message: globalLoadingMessage, setGlobalLoading };
};

export const usePageLoading = () => {
  const { isPageLoading, pageLoadingMessage, setPageLoading } = useLoadingStore();
  return { isPageLoading, message: pageLoadingMessage, setPageLoading };
};

export const useComponentLoading = (componentId: string) => {
  const { componentLoading, setComponentLoading } = useLoadingStore();
  const isLoading = componentLoading[componentId] || false;
  const setLoading = (loading: boolean) => setComponentLoading(componentId, loading);
  return { isLoading, setLoading };
};