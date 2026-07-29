// ============================================
// Loading Provider
// Production-ready loading state management
// ============================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface LoadingState {
  id: string;
  message?: string;
  progress?: number;
  isIndeterminate: boolean;
  createdAt: number;
}

interface LoadingContextType {
  loadings: LoadingState[];
  isLoading: boolean;
  globalLoading: LoadingState | null;
  startLoading: (id: string, message?: string, progress?: number) => void;
  updateLoading: (id: string, message?: string, progress?: number) => void;
  stopLoading: (id: string) => void;
  stopAllLoadings: () => void;
  setGlobalLoading: (message?: string) => void;
  clearGlobalLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
  storageKey?: string;
  maxLoadings?: number;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
  storageKey = 'fee_loadings',
  maxLoadings = 10,
}) => {
  const [loadings, setLoadings] = useState<LoadingState[]>([]);

  const isLoading = loadings.length > 0;
  const globalLoading = loadings.find((l) => l.id === 'global') || null;

  const startLoading = useCallback(
    (id: string, message?: string, progress: number = 0) => {
      setLoadings((prev) => {
        const existing = prev.find((l) => l.id === id);
        if (existing) {
          return prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  message: message || l.message,
                  progress,
                  isIndeterminate: progress === 0,
                }
              : l
          );
        }

        const newLoading: LoadingState = {
          id,
          message,
          progress,
          isIndeterminate: progress === 0,
          createdAt: Date.now(),
        };

        const updated = [newLoading, ...prev];
        if (updated.length > maxLoadings) {
          return updated.slice(0, maxLoadings);
        }
        return updated;
      });
    },
    [maxLoadings]
  );

  const updateLoading = useCallback(
    (id: string, message?: string, progress?: number) => {
      setLoadings((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                message: message || l.message,
                progress: progress ?? l.progress,
                isIndeterminate: progress === 0,
              }
            : l
        )
      );
    },
    []
  );

  const stopLoading = useCallback((id: string) => {
    setLoadings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const stopAllLoadings = useCallback(() => {
    setLoadings([]);
  }, []);

  const setGlobalLoading = useCallback((message?: string) => {
    startLoading('global', message, 0);
  }, [startLoading]);

  const clearGlobalLoading = useCallback(() => {
    stopLoading('global');
  }, [stopLoading]);

  const value: LoadingContextType = {
    loadings,
    isLoading,
    globalLoading,
    startLoading,
    updateLoading,
    stopLoading,
    stopAllLoadings,
    setGlobalLoading,
    clearGlobalLoading,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const useIsLoading = (): boolean => {
  const { isLoading } = useLoading();
  return isLoading;
};

export const useGlobalLoading = (): LoadingState | null => {
  const { globalLoading } = useLoading();
  return globalLoading;
};