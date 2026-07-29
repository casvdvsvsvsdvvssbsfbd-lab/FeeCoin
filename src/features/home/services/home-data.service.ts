// ============================================
// Home Screen Data Service
// Connects UI to real production data
// ============================================

import { supabase } from '../../../lib/supabase/client';
import { useWalletStore } from '../../../lib/stores/wallet-store';
import { useAuthStore } from '../../../lib/stores/auth-store';
import { useTaskStore } from '../../../lib/stores/task-store';
import { useNotificationStore } from '../../../lib/stores/notification-store';
import { useAppStore } from '../../../lib/stores/app-store';
import { useAnalytics } from '../../../lib/analytics';

export interface HomeScreenData {
  user: {
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string;
  };
  wallet: {
    availableFC: number;
    pendingFC: number;
    energy: number;
    maxEnergy: number;
    withdrawProgress: number;
    estimatedUnlockDate: string | null;
  };
  earnings: {
    today: number;
    weekly: number;
    monthly: number;
  };
  recentRewards: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    timestamp: string;
    icon: string;
  }>;
}

class HomeScreenDataService {
  private analytics = useAnalytics();

  // Fetch user profile
  async getUserProfile(userId: string): Promise<HomeScreenData['user']> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        firstName: data.first_name || 'User',
        lastName: data.last_name || '',
        username: data.username || 'user',
        avatarUrl: data.avatar_url,
      };
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return {
        firstName: 'User',
        lastName: '',
        username: 'user',
      };
    }
  }

  // Fetch wallet data
  async getWalletData(userId: string): Promise<HomeScreenData['wallet']> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // Calculate withdrawal progress
      const withdrawProgress = data.withdrawal_progress || 0;
      const estimatedUnlockDate = data.estimated_unlock_date || null;

      return {
        availableFC: data.available_fc || 0,
        pendingFC: data.pending_fc || 0,
        energy: data.energy || 100,
        maxEnergy: data.max_energy || 100,
        withdrawProgress,
        estimatedUnlockDate,
      };
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      return {
        availableFC: 0,
        pendingFC: 0,
        energy: 100,
        maxEnergy: 100,
        withdrawProgress: 0,
        estimatedUnlockDate: null,
      };
    }
  }

  // Fetch earnings statistics
  async getEarnings(userId: string): Promise<HomeScreenData['earnings']> {
    try {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get today's earnings
      const { data: todayData, error: todayError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'reward')
        .gte('created_at', today.toISOString())
        .eq('status', 'completed');

      if (todayError) throw todayError;

      // Get weekly earnings
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'reward')
        .gte('created_at', weekAgo.toISOString())
        .eq('status', 'completed');

      if (weeklyError) throw weeklyError;

      // Get monthly earnings
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'reward')
        .gte('created_at', monthAgo.toISOString())
        .eq('status', 'completed');

      if (monthlyError) throw monthlyError;

      return {
        today: todayData?.reduce((sum, tx) => sum + tx.amount, 0) || 0,
        weekly: weeklyData?.reduce((sum, tx) => sum + tx.amount, 0) || 0,
        monthly: monthlyData?.reduce((sum, tx) => sum + tx.amount, 0) || 0,
      };
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
      return {
        today: 0,
        weekly: 0,
        monthly: 0,
      };
    }
  }

  // Fetch recent rewards/transactions
  async getRecentRewards(userId: string, limit: number = 4): Promise<HomeScreenData['recentRewards']> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'reward')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(tx => ({
        id: tx.id,
        type: tx.metadata?.type || 'reward',
        amount: tx.amount,
        description: tx.description || 'Reward earned',
        timestamp: this.formatTimestamp(tx.created_at),
        icon: this.getIconForType(tx.metadata?.type),
      })) || [];
    } catch (error) {
      console.error('Failed to fetch recent rewards:', error);
      return [];
    }
  }

  // Load all home screen data
  async loadHomeScreenData(userId: string): Promise<HomeScreenData> {
    const [user, wallet, earnings, recentRewards] = await Promise.all([
      this.getUserProfile(userId),
      this.getWalletData(userId),
      this.getEarnings(userId),
      this.getRecentRewards(userId),
    ]);

    return {
      user,
      wallet,
      earnings,
      recentRewards,
    };
  }

  // Track ad view and award reward
  async trackAdView(adType: string, provider: string, userId: string): Promise<number> {
    try {
      this.analytics.trackAdView(adType, provider, 0);

      // Calculate reward using FC Economy Engine
      const rewardAmount = await this.calculateAdReward(adType, provider);

      // Record transaction
      const { error } = await supabase.from('transactions').insert({
        user_id: userId,
        type: 'reward',
        amount: rewardAmount,
        status: 'completed',
        description: `Ad reward - ${provider}`,
        metadata: {
          type: 'ad',
          provider,
          adType,
        },
      });

      if (error) throw error;

      // Update wallet balance
      const { error: updateError } = await supabase.rpc('increment_wallet_balance', {
        p_user_id: userId,
        p_amount: rewardAmount,
      });

      if (updateError) throw updateError;

      this.analytics.trackRewardEarned('ad', rewardAmount, 'FC');
      
      return rewardAmount;
    } catch (error) {
      console.error('Failed to track ad view:', error);
      return 0;
    }
  }

  // Calculate ad reward using business rules
  private async calculateAdReward(adType: string, provider: string): Promise<number> {
    // This would integrate with the FC Economy Engine
    // For now, return a base reward
    const baseReward = 2500;
    return baseReward;
  }

  // Format timestamp
  private formatTimestamp(date: string): string {
    const now = new Date();
    const timestamp = new Date(date);
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return timestamp.toLocaleDateString();
  }

  // Get icon for reward type
  private getIconForType(type?: string): string {
    const icons: Record<string, string> = {
      ad: '📺',
      survey: '📊',
      offer: '📦',
      referral: '👥',
      mission: '🎯',
      daily: '🎁',
    };
    return icons[type || ''] || '💰';
  }

  // Refresh home screen data
  async refreshHomeData(userId: string): Promise<void> {
    const data = await this.loadHomeScreenData(userId);
    
    // Update stores
    const walletStore = useWalletStore.getState();
    const authStore = useAuthStore.getState();
    const notificationStore = useNotificationStore.getState();

    // Update wallet
    walletStore.setBalance(data.wallet.availableFC);
    walletStore.setFcBalance(data.wallet.availableFC);

    // Update app store with energy
    const appStore = useAppStore.getState();
    appStore.setEnergy(data.wallet.energy);
    appStore.setMaxEnergy(data.wallet.maxEnergy);
  }
}

// Singleton instance
export const homeScreenDataService = new HomeScreenDataService();
