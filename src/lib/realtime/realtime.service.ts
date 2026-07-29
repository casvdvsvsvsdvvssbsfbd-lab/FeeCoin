// ============================================
// Realtime Service
// Production-ready Supabase Realtime subscriptions
// ============================================

import { supabase } from '../supabase/client';
import { useRealtimeStore } from '../stores/realtime-store';
import { useWalletStore } from '../stores/wallet-store';
import { useNotificationStore } from '../stores/notification-store';
import { useLeaderboardStore } from '../stores/leaderboard-store';
import { useAuthStore } from '../stores/auth-store';
import { useMissionStore } from '../stores/mission-store';
import { useAnalytics } from '../analytics';

type SubscriptionCallback = (payload: any) => void;

class RealtimeService {
  private subscriptions: Map<string, any> = new Map();
  private analytics = useAnalytics();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Subscribe to wallet updates
  subscribeToWallet(userId: string, callback: SubscriptionCallback): () => void {
    const channelName = `wallet:${userId}`;
    
    if (this.subscriptions.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
          this.handleWalletUpdate(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelName, channel);
    this.reconnectAttempts = 0;

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to transaction updates
  subscribeToTransactions(userId: string, callback: SubscriptionCallback): () => void {
    const channelName = `transactions:${userId}`;

    if (this.subscriptions.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
          this.handleTransactionUpdate(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to notifications
  subscribeToNotifications(userId: string, callback: SubscriptionCallback): () => void {
    const channelName = `notifications:${userId}`;

    if (this.subscriptions.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
          this.handleNotificationUpdate(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to leaderboard updates
  subscribeToLeaderboard(period: string, callback: SubscriptionCallback): () => void {
    const channelName = `leaderboard:${period}`;

    if (this.subscriptions.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard',
        },
        (payload) => {
          callback(payload);
          this.handleLeaderboardUpdate(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to mission updates
  subscribeToMissions(userId: string, callback: SubscriptionCallback): () => void {
    const channelName = `missions:${userId}`;

    if (this.subscriptions.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_missions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
          this.handleMissionUpdate(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to withdrawal updates
  subscribeToWithdrawals(userId: string, callback: SubscriptionCallback): () => void {
    const channelName = `withdrawals:${userId}`;

    if (this.subscriptions.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'withdrawals',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
          this.handleWithdrawalUpdate(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to profile updates
  subscribeToProfile(userId: string, callback: SubscriptionCallback): () => void {
    const channelName = `profile:${userId}`;

    if (this.subscriptions.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
          this.handleProfileUpdate(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Handle wallet update
  private handleWalletUpdate(payload: any) {
    const walletStore = useWalletStore.getState();
    const newWallet = payload.new;
    
    walletStore.setBalance(newWallet.available_fc);
    walletStore.setFcBalance(newWallet.available_fc);

    this.analytics.trackEvent('wallet_updated', {
      availableFC: newWallet.available_fc,
      pendingFC: newWallet.pending_fc,
    });
  }

  // Handle transaction update
  private handleTransactionUpdate(payload: any) {
    const walletStore = useWalletStore.getState();
    const notificationStore = useNotificationStore.getState();
    const tx = payload.new;

    // Add to transaction history
    walletStore.addTransaction({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      description: tx.description,
      timestamp: tx.created_at,
    });

    // Create notification for reward
    if (tx.type === 'reward' && tx.status === 'completed') {
      notificationStore.addNotification({
        id: tx.id,
        type: 'reward',
        title: 'Reward Received!',
        message: `You earned ${tx.amount} FC`,
        data: { amount: tx.amount },
        read: false,
        createdAt: new Date(tx.created_at),
      });
    }

    this.analytics.trackEvent('transaction_received', {
      type: tx.type,
      amount: tx.amount,
    });
  }

  // Handle notification update
  private handleNotificationUpdate(payload: any) {
    const notificationStore = useNotificationStore.getState();
    const notification = payload.new;

    notificationStore.addNotification({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      read: false,
      createdAt: new Date(notification.created_at),
    });

    this.analytics.trackEvent('notification_received', {
      type: notification.type,
    });
  }

  // Handle leaderboard update
  private handleLeaderboardUpdate(payload: any) {
    const leaderboardStore = useLeaderboardStore.getState();
    
    if (payload.new) {
      leaderboardStore.setRankings([payload.new]);
    }
  }

  // Handle mission update
  private handleMissionUpdate(payload: any) {
    const missionStore = useMissionStore.getState();
    const userMission = payload.new;

    if (payload.eventType === 'UPDATE' && userMission) {
      missionStore.setMissions([userMission]);
    }
  }

  // Handle withdrawal update
  private handleWithdrawalUpdate(payload: any) {
    const walletStore = useWalletStore.getState();
    const withdrawal = payload.new;

    if (payload.eventType === 'UPDATE') {
      // Notify user of status change
      this.analytics.trackEvent('withdrawal_status_changed', {
        withdrawalId: withdrawal.id,
        status: withdrawal.status,
      });
    }
  }

  // Handle profile update
  private handleProfileUpdate(payload: any) {
    const authStore = useAuthStore.getState();
    const profile = payload.new;

    if (authStore.profile && profile) {
      authStore.setProfile({
        ...authStore.profile,
        first_name: profile.first_name,
        last_name: profile.last_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
      });
    }
  }

  // Unsubscribe from channel
  private async unsubscribe(channelName: string): Promise<void> {
    const channel = this.subscriptions.get(channelName);
    
    if (channel) {
      await supabase.removeChannel(channel);
      this.subscriptions.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  async unsubscribeAll(): Promise<void> {
    const unsubscribePromises = Array.from(this.subscriptions.keys()).map(channelName =>
      this.unsubscribe(channelName)
    );

    await Promise.all(unsubscribePromises);
    this.subscriptions.clear();
  }

  // Get active subscriptions count
  getActiveSubscriptionsCount(): number {
    return this.subscriptions.size;
  }

  // Check if subscribed to channel
  isSubscribed(channelName: string): boolean {
    return this.subscriptions.has(channelName);
  }
}

// Singleton instance
export const realtimeService = new RealtimeService();