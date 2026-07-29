// ============================================
// Reward Engine Provider
// Production-ready reward management
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface Reward {
  id: string;
  userId: string;
  type: 'ad_view' | 'survey' | 'offerwall' | 'app_install' | 'referral' | 'mission' | 'daily_bonus' | 'event';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  referenceId?: string;
  metadata: Record<string, any>;
  createdAt: string;
  processedAt?: string;
}

interface RewardContextType {
  rewards: Reward[];
  pendingRewards: Reward[];
  totalEarned: number;
  isLoading: boolean;
  error: Error | null;
  addReward: (reward: Omit<Reward, 'id' | 'createdAt'>) => Promise<Reward>;
  processReward: (rewardId: string) => Promise<void>;
  getRewardsByType: (type: Reward['type']) => Reward[];
  getPendingRewards: () => Reward[];
  refreshRewards: () => Promise<void>;
}

const RewardContext = createContext<RewardContextType | undefined>(undefined);

interface RewardEngineProviderProps {
  children: ReactNode;
  storageKey?: string;
  maxPendingRewards?: number;
}

export const RewardEngineProvider: React.FC<RewardEngineProviderProps> = ({
  children,
  storageKey = 'fee_rewards',
  maxPendingRewards = 100,
}) => {
  const [rewards, setRewards] = useState<Reward[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as Reward[];
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pendingRewards = rewards.filter((r) => r.status === 'pending');
  const totalEarned = rewards
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  useEffect(() => {
    // Store rewards in localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(rewards));
    } catch {
      // Ignore storage errors
    }
  }, [rewards, storageKey]);

  const addReward = useCallback(
    async (rewardData: Omit<Reward, 'id' | 'createdAt'>): Promise<Reward> => {
      const reward: Reward = {
        ...rewardData,
        id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      setRewards((prev) => {
        const updated = [reward, ...prev];
        // Limit pending rewards
        if (updated.length > maxPendingRewards) {
          return updated.slice(0, maxPendingRewards);
        }
        return updated;
      });

      // In production, send to API for processing
      // For now, auto-complete rewards
      setTimeout(() => {
        processReward(reward.id);
      }, 1000);

      return reward;
    },
    [maxPendingRewards]
  );

  const processReward = useCallback(async (rewardId: string): Promise<void> => {
    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === rewardId && reward.status === 'pending'
          ? {
              ...reward,
              status: 'completed' as const,
              processedAt: new Date().toISOString(),
            }
          : reward
      )
    );
  }, []);

  const getRewardsByType = useCallback(
    (type: Reward['type']): Reward[] => {
      return rewards.filter((r) => r.type === type);
    },
    [rewards]
  );

  const getPendingRewards = useCallback((): Reward[] => {
    return rewards.filter((r) => r.status === 'pending');
  }, [rewards]);

  const refreshRewards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, fetch from API
      // For now, use stored rewards
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setRewards(JSON.parse(stored) as Reward[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load rewards'));
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  const value: RewardContextType = {
    rewards,
    pendingRewards,
    totalEarned,
    isLoading,
    error,
    addReward,
    processReward,
    getRewardsByType,
    getPendingRewards,
    refreshRewards,
  };

  return <RewardContext.Provider value={value}>{children}</RewardContext.Provider>;
};

export const useRewards = (): RewardContextType => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardEngineProvider');
  }
  return context;
};

export const useTotalEarned = (): number => {
  const { totalEarned } = useRewards();
  return totalEarned;
};

export const usePendingRewards = (): Reward[] => {
  const { pendingRewards } = useRewards();
  return pendingRewards;
};