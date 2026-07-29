// ============================================
// Remote Config Service
// Admin configuration management
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface ConfigVariable {
  key: string;
  value: any;
  type: 'number' | 'string' | 'boolean' | 'json';
  category: 'energy' | 'rewards' | 'features' | 'maintenance';
  description: string;
  isActive: boolean;
  updatedAt: string;
}

export interface FeatureFlag {
  key: string;
  value: boolean;
  description: string;
  rolloutPercentage: number;
  isActive: boolean;
  updatedAt: string;
}

class RemoteConfigService {
  private analytics = useAnalytics();
  private configCache: Map<string, any> = new Map();

  // Get all config variables
  async getConfigVariables(category?: string): Promise<ConfigVariable[]> {
    try {
      let query = supabase
        .from('remote_config')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(config => ({
        key: config.key,
        value: config.value,
        type: config.type,
        category: config.category,
        description: config.description,
        isActive: config.is_active,
        updatedAt: config.updated_at,
      }));
    } catch (error) {
      console.error('Failed to fetch config variables:', error);
      return [];
    }
  }

  // Get single config value
  async getConfig(key: string): Promise<any> {
    try {
      // Check cache first
      if (this.configCache.has(key)) {
        return this.configCache.get(key);
      }

      const { data, error } = await supabase
        .from('remote_config')
        .select('value')
        .eq('key', key)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      const value = data?.value;
      this.configCache.set(key, value);
      return value;
    } catch (error) {
      console.error('Failed to fetch config:', error);
      return null;
    }
  }

  // Update config variable
  async updateConfig(key: string, value: any, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('remote_config')
        .update({
          value,
          updated_at: new Date().toISOString(),
          updated_by: adminId,
        })
        .eq('key', key);

      if (error) throw error;

      // Update cache
      this.configCache.set(key, value);

      this.analytics.trackEvent('admin_config_updated', { key, value });
      return true;
    } catch (error) {
      console.error('Failed to update config:', error);
      return false;
    }
  }

  // Create config variable
  async createConfig(config: {
    key: string;
    value: any;
    type: 'number' | 'string' | 'boolean' | 'json';
    category: 'energy' | 'rewards' | 'features' | 'maintenance';
    description: string;
  }): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('remote_config')
        .insert({
          key: config.key,
          value: config.value,
          type: config.type,
          category: config.category,
          description: config.description,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      this.analytics.trackEvent('admin_config_created', { key: config.key });
      return data.id;
    } catch (error) {
      console.error('Failed to create config:', error);
      return null;
    }
  }

  // Get feature flags
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;

      return (data || []).map(flag => ({
        key: flag.key,
        value: flag.value,
        description: flag.description,
        rolloutPercentage: flag.rollout_percentage,
        isActive: flag.is_active,
        updatedAt: flag.updated_at,
      }));
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
      return [];
    }
  }

  // Update feature flag
  async updateFeatureFlag(key: string, value: boolean, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({
          value,
          updated_at: new Date().toISOString(),
          updated_by: adminId,
        })
        .eq('key', key);

      if (error) throw error;

      this.analytics.trackEvent('admin_feature_flag_updated', { key, value });
      return true;
    } catch (error) {
      console.error('Failed to update feature flag:', error);
      return false;
    }
  }

  // Toggle maintenance mode
  async setMaintenanceMode(enabled: boolean, adminId: string, message?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('remote_config')
        .update({
          value: enabled,
          updated_at: new Date().toISOString(),
          updated_by: adminId,
        })
        .eq('key', 'maintenance_mode');

      if (error) throw error;

      this.analytics.trackEvent('admin_maintenance_mode_changed', { enabled, message });
      return true;
    } catch (error) {
      console.error('Failed to set maintenance mode:', error);
      return false;
    }
  }

  // Get energy config
  async getEnergyConfig(): Promise<any> {
    return this.getConfig('energy_config');
  }

  // Get rewards config
  async getRewardsConfig(): Promise<any> {
    return this.getConfig('rewards_config');
  }

  // Clear cache
  clearCache(): void {
    this.configCache.clear();
  }
}

// Singleton instance
export const remoteConfigService = new RemoteConfigService();