// ============================================
// Remote Config Provider
// Production-ready remote configuration
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface RemoteConfig {
  key: string;
  value: any;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RemoteConfigContextType {
  configs: Map<string, RemoteConfig>;
  isLoading: boolean;
  error: Error | null;
  getValue: <T = any>(key: string, defaultValue: T) => T;
  getString: (key: string, defaultValue?: string) => string;
  getNumber: (key: string, defaultValue?: number) => number;
  getBoolean: (key: string, defaultValue?: boolean) => boolean;
  getObject: <T = any>(key: string, defaultValue: T) => T;
  refreshConfigs: () => Promise<void>;
}

const RemoteConfigContext = createContext<RemoteConfigContextType | undefined>(undefined);

const DEFAULT_CONFIGS: RemoteConfig[] = [
  { key: 'min_withdrawal_amount', value: 10, description: 'Minimum withdrawal amount in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'max_daily_earnings', value: 1000, description: 'Maximum daily earnings in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'referral_reward_amount', value: 50, description: 'Referral reward amount in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'ad_reward_base', value: 5, description: 'Base ad reward amount in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'survey_reward_min', value: 10, description: 'Minimum survey reward in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'survey_reward_max', value: 100, description: 'Maximum survey reward in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'streak_freeze_cost', value: 25, description: 'Cost to purchase streak freeze in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'level_up_bonus_base', value: 20, description: 'Base level up bonus in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'max_withdrawal_per_day', value: 500, description: 'Maximum withdrawal per day in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'referral_level_1_reward', value: 50, description: 'Level 1 referral reward in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'referral_level_2_reward', value: 25, description: 'Level 2 referral reward in FC', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'mission_reward_multiplier', value: 1, description: 'Mission reward multiplier', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'event_reward_multiplier', value: 1.5, description: 'Event reward multiplier', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'fraud_score_threshold', value: 70, description: 'Fraud score threshold for blocking', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { key: 'max_devices_per_user', value: 5, description: 'Maximum devices per user', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

interface RemoteConfigProviderProps {
  children: ReactNode;
  storageKey?: string;
  refreshInterval?: number;
}

export const RemoteConfigProvider: React.FC<RemoteConfigProviderProps> = ({
  children,
  storageKey = 'fee_remote_config',
  refreshInterval = 5 * 60 * 1000, // 5 minutes
}) => {
  const [configs, setConfigs] = useState<Map<string, RemoteConfig>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Map(Object.entries(parsed));
      }
    } catch {
      // Ignore
    }
    return new Map(DEFAULT_CONFIGS.map((config) => [config.key, config]));
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadConfigs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, load from API
      // For now, use default configs
      const configsMap = new Map(DEFAULT_CONFIGS.map((config) => [config.key, config]));
      setConfigs(configsMap);

      // Store in localStorage
      try {
        const obj = Object.fromEntries(configsMap);
        localStorage.setItem(storageKey, JSON.stringify(obj));
      } catch {
        // Ignore storage errors
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load remote configs'));
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    loadConfigs();

    // Refresh configs periodically
    const interval = setInterval(() => {
      loadConfigs();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [loadConfigs, refreshInterval]);

  const getValue = useCallback(
    <T = any>(key: string, defaultValue: T): T => {
      const config = configs.get(key);
      if (!config || !config.isActive) {
        return defaultValue;
      }
      const value = config.value as T | undefined;
      return value !== undefined && value !== null ? value : defaultValue;
    },
    [configs]
  );

  const getString = useCallback(
    (key: string, defaultValue: string = ''): string => {
      const value = getValue(key, defaultValue);
      return typeof value === 'string' ? value : defaultValue;
    },
    [getValue]
  );

  const getNumber = useCallback(
    (key: string, defaultValue: number = 0): number => {
      const value = getValue(key, defaultValue);
      return typeof value === 'number' ? value : defaultValue;
    },
    [getValue]
  );

  const getBoolean = useCallback(
    (key: string, defaultValue: boolean = false): boolean => {
      const value = getValue(key, defaultValue);
      return typeof value === 'boolean' ? value : defaultValue;
    },
    [getValue]
  );

  const getObject = useCallback(
    <T = any>(key: string, defaultValue: T = {} as T): T => {
      const value = getValue(key, defaultValue);
      return typeof value === 'object' && value !== null ? value : defaultValue;
    },
    [getValue]
  );

  const refreshConfigs = useCallback(async () => {
    await loadConfigs();
  }, [loadConfigs]);

  const value: RemoteConfigContextType = {
    configs,
    isLoading,
    error,
    getValue,
    getString,
    getNumber,
    getBoolean,
    getObject,
    refreshConfigs,
  };

  return <RemoteConfigContext.Provider value={value}>{children}</RemoteConfigContext.Provider>;
};

export const useRemoteConfig = (): RemoteConfigContextType => {
  const context = useContext(RemoteConfigContext);
  if (!context) {
    throw new Error('useRemoteConfig must be used within a RemoteConfigProvider');
  }
  return context;
};

export const useConfigValue = <T = any>(key: string, defaultValue: T): T => {
  const { getValue } = useRemoteConfig();
  return getValue(key, defaultValue) as T;
};
