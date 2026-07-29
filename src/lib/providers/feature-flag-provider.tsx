// ============================================
// Feature Flag Provider
// Production-ready feature flag management
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface FeatureFlag {
  key: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  rolloutPercentage: number;
  targetAudience: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface FeatureFlagContextType {
  flags: Map<string, FeatureFlag>;
  isLoading: boolean;
  error: Error | null;
  isEnabled: (key: string) => boolean;
  getFlag: (key: string) => FeatureFlag | undefined;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

const DEFAULT_FLAGS: FeatureFlag[] = [
  {
    key: 'new_user_onboarding',
    name: 'New User Onboarding',
    description: 'Enable new user onboarding flow',
    isEnabled: true,
    rolloutPercentage: 100,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'referral_system',
    name: 'Referral System',
    description: 'Enable referral system',
    isEnabled: true,
    rolloutPercentage: 100,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'daily_bonus',
    name: 'Daily Bonus',
    description: 'Enable daily bonus system',
    isEnabled: true,
    rolloutPercentage: 100,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'leaderboards',
    name: 'Leaderboards',
    description: 'Enable leaderboards',
    isEnabled: true,
    rolloutPercentage: 100,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'surveys',
    name: 'Surveys',
    description: 'Enable surveys feature',
    isEnabled: true,
    rolloutPercentage: 100,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'offerwalls',
    name: 'Offerwalls',
    description: 'Enable offerwalls feature',
    isEnabled: true,
    rolloutPercentage: 100,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'app_installs',
    name: 'App Installs',
    description: 'Enable app installs feature',
    isEnabled: true,
    rolloutPercentage: 100,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'premium_features',
    name: 'Premium Features',
    description: 'Enable premium user features',
    isEnabled: true,
    rolloutPercentage: 100,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Enable advanced analytics',
    isEnabled: false,
    rolloutPercentage: 0,
    targetAudience: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'beta_features',
    name: 'Beta Features',
    description: 'Enable beta features for testing',
    isEnabled: false,
    rolloutPercentage: 10,
    targetAudience: { premium_only: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface FeatureFlagProviderProps {
  children: ReactNode;
  storageKey?: string;
  refreshInterval?: number;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
  storageKey = 'fee_feature_flags',
  refreshInterval = 5 * 60 * 1000, // 5 minutes
}) => {
  const [flags, setFlags] = useState<Map<string, FeatureFlag>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Map(Object.entries(parsed));
      }
    } catch {
      // Ignore
    }
    return new Map(DEFAULT_FLAGS.map((flag) => [flag.key, flag]));
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadFlags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, load from API
      // For now, use default flags
      const flagsMap = new Map(DEFAULT_FLAGS.map((flag) => [flag.key, flag]));
      setFlags(flagsMap);

      // Store in localStorage
      try {
        const obj = Object.fromEntries(flagsMap);
        localStorage.setItem(storageKey, JSON.stringify(obj));
      } catch {
        // Ignore storage errors
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load feature flags'));
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    loadFlags();

    // Refresh flags periodically
    const interval = setInterval(() => {
      loadFlags();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [loadFlags, refreshInterval]);

  const isEnabled = useCallback(
    (key: string): boolean => {
      const flag = flags.get(key);
      if (!flag) return false;

      if (!flag.isEnabled) return false;

      // Check rollout percentage
      if (flag.rolloutPercentage >= 100) return true;
      if (flag.rolloutPercentage <= 0) return false;

      // Hash-based rollout
      const userId = typeof window !== 'undefined' ? window.location.href + key : key;
      const hash = hashCode(userId);
      const inRollout = (hash % 100) < flag.rolloutPercentage;

      return inRollout;
    },
    [flags]
  );

  const getFlag = useCallback(
    (key: string): FeatureFlag | undefined => {
      return flags.get(key);
    },
    [flags]
  );

  const refreshFlags = useCallback(async () => {
    await loadFlags();
  }, [loadFlags]);

  const value: FeatureFlagContextType = {
    flags,
    isLoading,
    error,
    isEnabled,
    getFlag,
    refreshFlags,
  };

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
};

export const useFeatureFlags = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

export const useFeatureFlag = (key: string): boolean => {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(key);
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}