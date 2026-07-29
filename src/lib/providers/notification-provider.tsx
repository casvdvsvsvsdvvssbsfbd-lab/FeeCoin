// ============================================
// Notification Provider
// Production-ready notification management
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  userId: string;
  type: 'reward' | 'mission' | 'achievement' | 'system' | 'promotion' | 'referral';
  title: string;
  message: string;
  data: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Notification;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  storageKey?: string;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  storageKey = 'fee_notifications',
  maxNotifications = 100,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as Notification[];
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    // Store notifications in localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch {
      // Ignore storage errors
    }
  }, [notifications, storageKey]);

  const addNotification = useCallback(
    (notificationData: Omit<Notification, 'id' | 'createdAt'>): Notification => {
      const notification: Notification = {
        ...notificationData,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => {
        const updated = [notification, ...prev];
        // Limit notifications
        if (updated.length > maxNotifications) {
          return updated.slice(0, maxNotifications);
        }
        return updated;
      });

      // In production, send push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
        });
      }

      return notification;
    },
    [maxNotifications]
  );

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId && !notification.isRead
          ? {
              ...notification,
              isRead: true,
              readAt: new Date().toISOString(),
            }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) =>
        !notification.isRead
          ? {
              ...notification,
              isRead: true,
              readAt: new Date().toISOString(),
            }
          : notification
      )
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, fetch from API
      // For now, use stored notifications
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setNotifications(JSON.parse(stored) as Notification[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load notifications'));
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refreshNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const useUnreadNotifications = (): number => {
  const { unreadCount } = useNotifications();
  return unreadCount;
};