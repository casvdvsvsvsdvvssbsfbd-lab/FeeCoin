// ============================================
// Leaderboard Data Service
// Connects UI to real production data
// ============================================

import { supabase } from '../../../lib/supabase/client';
import { useLeaderboardStore } from '../../../lib/stores/leaderboard-store';
import { useAnalytics } from '../../../lib/analytics';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  firstName: string;
  score: number;
  isCurrentUser: boolean;
  change?: number; // Rank change from previous period
}

export interface LeaderboardData {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  monthly: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
  userRank: LeaderboardEntry | null;
}

class LeaderboardDataService {
  private analytics = useAnalytics();

  // Fetch leaderboard for a specific period
  async getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all_time', limit: number = 100): Promise<LeaderboardEntry[]> {
    try {
      const dateFilter = this.getDateFilter(period);
      
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .gte('created_at', dateFilter)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((entry: any, index: number) => ({
        rank: index + 1,
        userId: entry.user_id,
        username: entry.username || 'user',
        firstName: entry.first_name || 'User',
        score: entry.score,
        isCurrentUser: false,
        change: entry.rank_change || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }

  // Fetch user's rank
  async getUserRank(userId: string, period: 'daily' | 'weekly' | 'monthly' | 'all_time'): Promise<LeaderboardEntry | null> {
    try {
      const dateFilter = this.getDateFilter(period);
      
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', dateFilter)
        .single();

      if (error || !data) return null;

      // Get user's rank
      const { count, error: rankError } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dateFilter)
        .gt('score', data.score);

      if (rankError) throw rankError;

      return {
        rank: (count || 0) + 1,
        userId: data.user_id,
        username: data.username || 'user',
        firstName: data.first_name || 'User',
        score: data.score,
        isCurrentUser: true,
        change: data.rank_change || 0,
      };
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
      return null;
    }
  }

  // Load all leaderboard data
  async loadLeaderboardData(userId: string): Promise<LeaderboardData> {
    const [daily, weekly, monthly, allTime, userRank] = await Promise.all([
      this.getLeaderboard('daily'),
      this.getLeaderboard('weekly'),
      this.getLeaderboard('monthly'),
      this.getLeaderboard('all_time'),
      this.getUserRank(userId, 'weekly'),
    ]);

    return {
      daily,
      weekly,
      monthly,
      allTime,
      userRank: userRank,
    };
  }

  // Refresh leaderboard
  async refreshLeaderboard(userId: string, period: string): Promise<void> {
    const leaderboard = await this.getLeaderboard(period as any);
    const userRank = await this.getUserRank(userId, period as any);

    const leaderboardStore = useLeaderboardStore.getState();
    
    switch (period) {
      case 'daily':
        leaderboardStore.setRankings(leaderboard);
        break;
      case 'weekly':
        leaderboardStore.setRankings(leaderboard);
        break;
      case 'monthly':
        leaderboardStore.setRankings(leaderboard);
        break;
      case 'all_time':
        leaderboardStore.setRankings(leaderboard);
        break;
    }

    if (userRank) {
      leaderboardStore.setUserRank(userRank);
    }
  }

  // Track leaderboard view
  trackLeaderboardView(period: string): void {
    this.analytics.trackEvent('leaderboard_view', { period });
  }

  // Get date filter for period
  private getDateFilter(period: string): string {
    const now = new Date();
    
    switch (period) {
      case 'daily':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case 'all_time':
      default:
        return new Date(0).toISOString();
    }
  }
}

// Singleton instance
export const leaderboardDataService = new LeaderboardDataService();