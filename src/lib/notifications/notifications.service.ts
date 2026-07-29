// ============================================
// Notifications Service
// Production-ready notification system
// ============================================

import { supabase } from '../supabase/client';
import { useNotificationStore } from '../stores/notification-store';
import { useAnalytics } from '../analytics';

export interface Notification {
  id: string;
  type: 'reward' | 'mission' | 'referral' | 'system' | 'support';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

class NotificationsService {
  private analytics = useAnalytics();

  // Fetch notifications
  async getNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        read: n.read,
        createdAt: new Date(n.created_at),
      }));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      const notificationStore = useNotificationStore.getState();
      notificationStore.markAsRead(notificationId);

      this.analytics.trackEvent('notification_read', { notificationId });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      const notificationStore = useNotificationStore.getState();
      notificationStore.markAllAsRead();

      this.analytics.trackEvent('all_notifications_read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      const notificationStore = useNotificationStore.getState();
      notificationStore.removeNotification(notificationId);

      this.analytics.trackEvent('notification_deleted', { notificationId });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }

  // Load notifications
  async loadNotifications(userId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications(userId);
      
      const notificationStore = useNotificationStore.getState();
      notificationStore.setNotifications(notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  // Create notification
  async createNotification(userId: string, notification: {
    type: 'reward' | 'mission' | 'referral' | 'system' | 'support';
    title: string;
    message: string;
    data?: any;
  }): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        read: false,
      });

      if (error) throw error;

      this.analytics.trackEvent('notification_created', {
        type: notification.type,
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  // Refresh notifications
  async refreshNotifications(userId: string): Promise<void> {
    await this.loadNotifications(userId);
  }
}

// Singleton instance
export const notificationsService = new NotificationsService();