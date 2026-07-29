// ============================================
// Notification Store
// ============================================

import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'reward' | 'mission' | 'referral' | 'system' | 'support';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export interface NotificationState {
  // Notifications data
  notifications: Notification[];
  unreadCount: number;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,

  // Actions
  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    lastUpdated: new Date()
  }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    lastUpdated: new Date()
  })),

  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    ),
    unreadCount: state.notifications.filter((n) => !n.read && n.id !== notificationId).length,
    lastUpdated: new Date()
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
    lastUpdated: new Date()
  })),

  removeNotification: (notificationId) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== notificationId),
    unreadCount: state.notifications.filter((n) => !n.read && n.id !== notificationId).length,
    lastUpdated: new Date()
  })),

  clearAll: () => set({
    notifications: [],
    unreadCount: 0,
    lastUpdated: new Date()
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  reset: () => set({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
  }),
}));