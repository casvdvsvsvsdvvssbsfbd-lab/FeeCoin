// ============================================
// Toast Provider
// Production-ready toast notifications
// ============================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
  loading: (message: string, title?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  storageKey?: string;
  maxToasts?: number;
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  storageKey = 'fee_toasts',
  maxToasts = 5,
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toastData: Omit<Toast, 'id'>): string => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const toast: Toast = {
        ...toastData,
        id,
        duration: toastData.duration ?? defaultDuration,
      };

      setToasts((prev) => {
        const updated = [toast, ...prev];
        if (updated.length > maxToasts) {
          return updated.slice(0, maxToasts);
        }
        return updated;
      });

      // Auto-remove after duration
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration);
      }

      return id;
    },
    [maxToasts, defaultDuration]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.onClose) {
        toast.onClose();
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts((prev) => {
      prev.forEach((toast) => {
        if (toast.onClose) {
          toast.onClose();
        }
      });
      return [];
    });
  }, []);

  const success = useCallback(
    (message: string, title?: string, duration?: number): string => {
      return addToast({
        type: 'success',
        message,
        title,
        duration,
      });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number): string => {
      return addToast({
        type: 'error',
        message,
        title,
        duration: duration ?? 8000, // Errors stay longer
      });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number): string => {
      return addToast({
        type: 'warning',
        message,
        title,
        duration,
      });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number): string => {
      return addToast({
        type: 'info',
        message,
        title,
        duration,
      });
    },
    [addToast]
  );

  const loading = useCallback(
    (message: string, title?: string): string => {
      return addToast({
        type: 'loading',
        message,
        title,
        duration: 0, // No auto-dismiss for loading
      });
    },
    [addToast]
  );

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    loading,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const useSuccessToast = () => {
  const { success } = useToast();
  return success;
};

export const useErrorToast = () => {
  const { error } = useToast();
  return error;
};