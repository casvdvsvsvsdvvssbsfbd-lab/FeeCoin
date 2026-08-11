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

  // Fetch user profile (users joined with profiles)
  async getProfile(userId: string): Promise<ProfileData> {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError || !user) throw userError || new Error('User not found');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) throw profileError;

      return {
        firstName: user.first_name || 'User',
        lastName: user.last_name || '',
        username: user.username || 'user',
        email: user.email != null ? user.email : undefined,
        phone: user.phone != null ? user.phone : undefined,
        avatarUrl: profile?.avatar_url != null ? profile.avatar_url : undefined,
        bio: profile?.bio != null ? profile.bio : undefined,
        country: profile?.country_code || 'US',
        language: profile?.language_code || 'en',
        createdAt: profile?.created_at || user.created_at,
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
      // Get total earned from completed credit transactions
      const { data: earnings } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('transaction_type', 'credit')
        .eq('status', 'completed');

      const totalEarned = earnings?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

      // Get profile aggregate stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Get referrals count
      const { count: referralsCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', userId);

      return {
        totalEarned,
        totalSpent: profile?.total_withdrawn || 0,
        tasksCompleted: profile?.tasks_completed || 0,
        surveysCompleted: 0,
        offersCompleted: profile?.apps_installed || 0,
        referralsCount: referralsCount || 0,
        streakDays: profile?.current_streak || 0,
        level: profile?.level || 1,
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

  // Fetch achievements catalog
  async getAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(ach => ({
        id: ach.id,
        title: ach.name,
        description: ach.description || '',
        icon: ach.icon_url || '🏆',
        unlockedAt: ach.created_at,
        progress: 0,
        target: (() => {
          const c = ach.criteria as { target?: unknown } | null;
          return typeof c?.target === 'number' ? c.target : 1;
        })(),
      }));
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      return [];
    }
  }

  // Update profile (name fields on users, cosmetic fields on profiles)
  async updateProfile(userId: string, updates: Partial<ProfileData>): Promise<boolean> {
    try {
      const { error: userError } = await supabase
        .from('users')
        .update({
          ...(updates.firstName ? { first_name: updates.firstName } : {}),
          ...(updates.lastName ? { last_name: updates.lastName } : {}),
          ...(updates.username ? { username: updates.username } : {}),
        })
        .eq('id', userId);

      if (userError) throw userError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...(updates.bio !== undefined ? { bio: updates.bio } : {}),
          ...(updates.country ? { country_code: updates.country } : {}),
          ...(updates.language ? { language_code: updates.language } : {}),
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

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

  /**
   * Hydrate the auth store's profile with real data. Since the profile
   * screen reads identity from the auth store, we update it directly with
   * the fetched/profile data and persist the latest stats for display.
   */
  async hydrateProfile(userId: string): Promise<{ profile: ProfileData; stats: UserStats } | null> {
    if (!userId) return null;
    try {
      const data = await this.loadProfileData(userId);
      // Update the auth store profile so the Profile screen shows real data.
      const authStore = useAuthStore.getState();
      authStore.setProfile({
        ...(authStore.profile || {}),
        ...(data.profile.firstName ? { first_name: data.profile.firstName } : {}),
        ...(data.profile.lastName ? { last_name: data.profile.lastName } : {}),
        username: data.profile.username,
        language_code: data.profile.language,
        country_code: data.profile.country,
      });
      return { profile: data.profile, stats: data.stats };
    } catch (error) {
      console.error('Failed to hydrate profile:', error);
      return null;
    }
  }
}

// Singleton instance
export const profileDataService = new ProfileDataService();