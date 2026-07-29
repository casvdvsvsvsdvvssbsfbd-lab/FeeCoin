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
        .eq('status', 'active')
        .order('priority', { ascending: false });

      if (error) throw error;

      return data.map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        type: mission.mission_type,
        reward: mission.reward_amount,
        progress: mission.progress || 0,
        target: mission.target || 1,
        status: 'active',
        icon: this.getIconForType(mission.mission_type),
        expiresAt: mission.expires_at,
      }));
    } catch (error) {
      console.error('Failed to fetch missions:', error);
      return [];
    }
  }

  // Fetch user's mission progress
  async getUserMissions(userId: string): Promise<Mission[]> {
    try {
      const { data, error } = await supabase
        .from('user_missions')
        .select('*, missions(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(um => ({
        id: um.missions.id,
        title: um.missions.title,
        description: um.missions.description,
        type: um.missions.mission_type,
        reward: um.missions.reward_amount,
        progress: um.progress || 0,
        target: um.missions.target || 1,
        status: um.status,
        icon: this.getIconForType(um.missions.mission_type),
        expiresAt: um.missions.expires_at,
      }));
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

      const rewardAmount = mission.reward_amount;

      // Update user mission status
      const { error: updateError } = await supabase
        .from('user_missions')
        .update({ status: 'claimed', claimed_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('mission_id', missionId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: userId,
        type: 'reward',
        amount: rewardAmount,
        status: 'completed',
        description: `Mission reward - ${mission.title}`,
        metadata: {
          type: 'mission',
          missionId,
        },
      });

      if (txError) throw txError;

      // Update wallet
      const { error: walletError } = await supabase.rpc('increment_wallet_balance', {
        p_user_id: userId,
        p_amount: rewardAmount,
      });

      if (walletError) throw walletError;

      // Track analytics
      this.analytics.trackRewardEarned('mission', rewardAmount, 'FC');
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

  // Get icon for mission type
  private getIconForType(type: string): string {
    const icons: Record<string, string> = {
      daily: '🎁',
      weekly: '📅',
      seasonal: '🌟',
      special: '⭐',
    };
    return icons[type] || '🎯';
  }
}

// Singleton instance
export const missionsDataService = new MissionsDataService();
