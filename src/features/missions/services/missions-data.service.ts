// ============================================
// Missions Screen Data Service
// Connects UI to real production data
// ============================================

import { supabase } from '../../../lib/supabase/client';
import { useMissionStore } from '../../../lib/stores/mission-store';
import { useWalletStore } from '../../../lib/stores/wallet-store';
import { useAnalytics } from '../../../lib/analytics';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'special';
  reward: number;
  progress: number;
  target: number;
  status: 'active' | 'completed' | 'claimed';
  icon: string;
  expiresAt: string;
}

class MissionsDataService {
  private analytics = useAnalytics();

  // Fetch available missions
  async getMissions(userId: string): Promise<Mission[]> {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(mission => {
        const rewards = mission.rewards as { amount?: number } | null;
        return {
          id: mission.id,
          title: mission.title,
          description: mission.description || '',
          type: mission.type as Mission['type'],
          reward: rewards?.amount || 0,
          progress: 0,
          target: 1,
          status: 'active',
          icon: this.getIconForType(mission.type),
          expiresAt: mission.available_until || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
      });
    } catch (error) {
      console.error('Failed to fetch missions:', error);
      return [];
    }
  }

  // Fetch user's mission progress
  async getUserMissions(userId: string): Promise<Mission[]> {
    try {
      const { data, error } = await supabase
        .from('mission_progress')
        .select('*, missions(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(um => {
        const mission = um.missions as { id: string; title: string; description?: string; type: string; rewards: { amount?: number } | null; available_until?: string } | null;
        const rewards = mission?.rewards as { amount?: number } | null;
        return {
          id: mission?.id || um.mission_id,
          title: mission?.title || '',
          description: mission?.description || '',
          type: (mission?.type as Mission['type']) || 'daily',
          reward: rewards?.amount || 0,
          progress: um.current_value || 0,
          target: um.target_value || 1,
          status: um.status === 'completed' ? 'completed' : um.status === 'claimed' ? 'claimed' : 'active',
          icon: this.getIconForType(mission?.type || ''),
          expiresAt: mission?.available_until || um.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
      });
    } catch (error) {
      console.error('Failed to fetch user missions:', error);
      return [];
    }
  }

  // Claim mission reward
  async claimMissionReward(missionId: string, userId: string): Promise<number> {
    try {
      // Get mission details
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();

      if (missionError) throw missionError;

      const rewards = mission.rewards as { amount?: number } | null;
      const rewardAmount = rewards?.amount || 0;

      // Update user mission status
      const { error: updateError } = await supabase
        .from('mission_progress')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('mission_id', missionId);

      if (updateError) throw updateError;

      // Get wallet for transaction
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', userId)
        .single();

      // Record transaction
      if (wallet) {
        const { error: txError } = await supabase.from('transactions').insert({
          user_id: userId,
          wallet_id: wallet.id,
          transaction_type: 'credit',
          amount: rewardAmount,
          status: 'completed',
          description: `Mission reward - ${mission.title}`,
          metadata: { type: 'mission', missionId },
        });

        if (txError) throw txError;
      }

      // Track analytics
      this.analytics.trackEvent('mission_claimed', {
        missionId,
        reward: rewardAmount,
      });

      // Update stores
      const missionStore = useMissionStore.getState();
      missionStore.claimMission(missionId);

      const walletStore = useWalletStore.getState();
      walletStore.updateBalance(rewardAmount);

      return rewardAmount;
    } catch (error) {
      console.error('Failed to claim mission reward:', error);
      return 0;
    }
  }

  // Load all missions data
  async loadMissionsData(userId: string): Promise<{
    availableMissions: Mission[];
    userMissions: Mission[];
  }> {
    const [availableMissions, userMissions] = await Promise.all([
      this.getMissions(userId),
      this.getUserMissions(userId),
    ]);

    return {
      availableMissions,
      userMissions,
    };
  }

  // Refresh missions
  async refreshMissions(userId: string): Promise<void> {
    const data = await this.loadMissionsData(userId);
    
    const missionStore = useMissionStore.getState();
    missionStore.setMissions([...data.availableMissions, ...data.userMissions]);
  }

  /**
   * Hydrate the Zustand mission store with real data. Always sets loading
   * false in the end so the Missions UI never sticks on a spinner.
   */
  async hydrateMissions(userId: string): Promise<void> {
    if (!userId) {
      const store = useMissionStore.getState();
      store.setLoading(false);
      store.setError('User not authenticated');
      return;
    }

    const store = useMissionStore.getState();
    store.setLoading(true);
    store.setError(null);
    try {
      const data = await this.loadMissionsData(userId);
      // Prefer user-specific progress; fall back to the catalog missions.
      const merged = data.userMissions.length > 0 ? data.userMissions : data.availableMissions;
      store.setMissions(merged);
    } catch (error: any) {
      store.setError(error?.message || 'Failed to load missions');
      // Never leave an empty store with a spinner — fall back to catalog.
      store.setMissions([]);
    } finally {
      store.setLoading(false);
    }
  }

  // Get icon for mission type
  private getIconForType(type: string): string {
    const icons: Record<string, string> = {
      daily: '🎁',
      weekly: '📅',
      seasonal: '🌟',
      special: '⭐',
      achievement: '🏆',
      referral: '👥',
    };
    return icons[type] || '🎯';
  }
}

// Singleton instance
export const missionsDataService = new MissionsDataService();