// ============================================
// Profile Screen Data Service
// Connects UI to real production data
// ============================================

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useAnalytics } from '@/lib/analytics';

export interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  country: string;
  language: string;
  createdAt: string;
}

export interface UserStats {
  totalEarned: number;
  totalSpent: number;
  tasksCompleted: number;
  surveysCompleted: number;
  offersCompleted: number;
  referralsCount: number;
  streakDays: number;
  level: number;
  badges: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  progress: number;
  target: number;
}

class ProfileDataService {
  private analytics = useAnalytics();

  // Fetch user profile
  async getProfile(userId: string): Promise<ProfileData> {
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
        email: data.email,
        phone: data.phone,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        country: data.country || 'US',
        language: data.language || 'en',
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return {
        firstName: 'User',
        lastName: '',
        username: 'user',
        country: 'US',
        language: 'en',
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Fetch user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get total earned
      const { data: earnings } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'reward')
        .eq('status', 'completed');

      const totalEarned = earnings?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

      // Get tasks completed
      const { count: tasksCount } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      // Get referrals count
      const { count: referralsCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', userId);

      return {
        totalEarned,
        totalSpent: 0,
        tasksCompleted: tasksCount || 0,
        surveysCompleted: 0,
        offersCompleted: 0,
        referralsCount: referralsCount || 0,
        streakDays: 0,
        level: 1,
        badges: [],
      };
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      return {
        totalEarned: 0,
        totalSpent: 0,
        tasksCompleted: 0,
        surveysCompleted: 0,
        offersCompleted: 0,
        referralsCount: 0,
        streakDays: 0,
        level: 1,
        badges: [],
      };
    }
  }

  // Fetch achievements
  async getAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;

      return data.map(ach => ({
        id: ach.id,
        title: ach.title,
        description: ach.description,
        icon: ach.icon || '🏆',
        unlockedAt: ach.unlocked_at,
        progress: ach.progress || 0,
        target: ach.target || 1,
      }));
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      return [];
    }
  }

  // Update profile
  async updateProfile(userId: string, updates: Partial<ProfileData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          username: updates.username,
          bio: updates.bio,
          country: updates.country,
          language: updates.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      // Update auth store
      const authStore = useAuthStore.getState();
      if (authStore.profile) {
        authStore.setProfile({
          ...authStore.profile,
          ...updates,
        });
      }

      this.analytics.trackEvent('profile_updated', { updates });
      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  }

  // Load all profile data
  async loadProfileData(userId: string): Promise<{
    profile: ProfileData;
    stats: UserStats;
    achievements: Achievement[];
  }> {
    const [profile, stats, achievements] = await Promise.all([
      this.getProfile(userId),
      this.getUserStats(userId),
      this.getAchievements(userId),
    ]);

    return {
      profile,
      stats,
      achievements,
    };
  }
}

// Singleton instance
export const profileDataService = new ProfileDataService();
