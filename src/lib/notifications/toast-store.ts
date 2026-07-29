// ============================================
// Toast Notification Store
// Production-ready notification system
// ============================================

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

interface ToastState {
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

// Simple store implementation without zustand dependency
class ToastStore {
  private toasts: Toast[] = [];
  private listeners: Set<() => void> = new Set();
  private toastIdCounter = 0;

  private generateId(): string {
    return `toast_${Date.now()}_${++this.toastIdCounter}`;
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  private subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private getState(): Toast[] {
    return [...this.toasts];
  }

  public addToast(toast: Omit<Toast, 'id'>): string {
    const id = this.generateId();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    this.toasts.push(newToast);
    this.notify();

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, newToast.duration);
    }

    return id;
  }

  public removeToast(id: string): void {
    const toast = this.toasts.find(t => t.id === id);
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
    toast?.onClose?.();
  }

  public clearAllToasts(): void {
    this.toasts = [];
    this.notify();
  }

  public success(message: string, title?: string, duration?: number): string {
    return this.addToast({
      type: 'success',
      message,
      title,
      duration,
    });
  }

  public error(message: string, title?: string, duration?: number): string {
    return this.addToast({
      type: 'error',
      message,
      title,
      duration: duration ?? 8000, // Errors stay longer
    });
  }

  public warning(message: string, title?: string, duration?: number): string {
    return this.addToast({
      type: 'warning',
      message,
      title,
      duration,
    });
  }

  public info(message: string, title?: string, duration?: number): string {
    return this.addToast({
      type: 'info',
      message,
      title,
      duration,
    });
  }

  public loading(message: string, title?: string): string {
    return this.addToast({
      type: 'loading',
      message,
      title,
      duration: 0, // No auto-dismiss for loading
    });
  }

  public subscribeToChanges(listener: () => void): () => void {
    return this.subscribe(listener);
  }

  public getToasts(): Toast[] {
    return this.getState();
  }
}

// Singleton instance
export const toastStore = new ToastStore();

// React hook for using toasts
export const useToasts = () => {
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    const unsubscribe = toastStore.subscribeToChanges(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return {
    toasts: toastStore.getToasts(),
    addToast: toastStore.addToast.bind(toastStore),
    removeToast: toastStore.removeToast.bind(toastStore),
    clearAllToasts: toastStore.clearAllToasts.bind(toastStore),
    success: toastStore.success.bind(toastStore),
    error: toastStore.error.bind(toastStore),
    warning: toastStore.warning.bind(toastStore),
    info: toastStore.info.bind(toastStore),
    loading: toastStore.loading.bind(toastStore),
  };
};

// Import React for the hook
import React from 'react';