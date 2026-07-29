// ============================================
// Provider Manager
// Automatically selects best provider based on multiple factors
// ============================================

import {
  ProviderConfig,
  ProviderType,
  ProviderHealthStatus,
  ProviderSelectionCriteria,
  UserProviderHistory
} from './types';
import { IAdProvider, IOfferwallProvider, ISurveyProvider } from './base/provider';

export interface ProviderScore {
  providerId: string;
  score: number;
  reasons: string[];
}

export class ProviderManager {
  private providers: Map<string, IAdProvider | IOfferwallProvider | ISurveyProvider> = new Map();
  private providerConfigs: Map<string, ProviderConfig> = new Map();
  private healthStatuses: Map<string, ProviderHealthStatus> = new Map();
  private userHistory: Map<string, UserProviderHistory[]> = new Map();

  /**
   * Register a provider
   */
  registerProvider(provider: IAdProvider | IOfferwallProvider | ISurveyProvider): void {
    const config = provider.getConfig();
    this.providers.set(config.id, provider);
    this.providerConfigs.set(config.id, config);
  }

  /**
   * Unregister a provider
   */
  unregisterProvider(providerId: string): void {
    this.providers.delete(providerId);
    this.providerConfigs.delete(providerId);
    this.healthStatuses.delete(providerId);
  }

  /**
   * Get provider by ID
   */
  getProvider<T extends IAdProvider | IOfferwallProvider | ISurveyProvider>(
    providerId: string
  ): T | undefined {
    return this.providers.get(providerId) as T;
  }

  /**
   * Get all providers of a specific type
   */
  getProvidersByType(type: ProviderType): (IAdProvider | IOfferwallProvider | ISurveyProvider)[] {
    const result: (IAdProvider | IOfferwallProvider | ISurveyProvider)[] = [];
    
    this.providers.forEach((provider, id) => {
      const config = this.providerConfigs.get(id);
      if (config && config.type === type && config.isEnabled) {
        result.push(provider);
      }
    });

    return result;
  }

  /**
   * Select best provider based on criteria
   */
  selectProvider(criteria: ProviderSelectionCriteria): (IAdProvider | IOfferwallProvider | ISurveyProvider) | null {
    const availableProviders = this.getProvidersByType(criteria.providerType);
    
    if (availableProviders.length === 0) {
      return null;
    }

    // Score each provider
    const scores = availableProviders.map(provider => {
      const config = provider.getConfig();
      const health = this.healthStatuses.get(config.id);
      const history = this.getUserHistory(criteria.userId, config.id);
      
      return this.calculateProviderScore(config, health, history, criteria);
    });

    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score);

    // Return the best provider
    const bestProviderId = scores[0].providerId;
    return this.providers.get(bestProviderId) || null;
  }

  /**
   * Calculate provider score
   */
  private calculateProviderScore(
    config: ProviderConfig,
    health: ProviderHealthStatus | undefined,
    history: UserProviderHistory | undefined,
    criteria: ProviderSelectionCriteria
  ): ProviderScore {
    let score = 0;
    const reasons: string[] = [];

    // 1. Priority (higher is better)
    score += config.priority * 10;
    if (config.priority > 5) {
      reasons.push(`High priority (${config.priority})`);
    }

    // 2. Health status
    if (health) {
      switch (health.status) {
        case 'healthy':
          score += 50;
          reasons.push('Provider is healthy');
          break;
        case 'degraded':
          score += 20;
          reasons.push('Provider is degraded');
          break;
        case 'down':
          score -= 100;
          reasons.push('Provider is down');
          break;
      }

      // Latency (lower is better)
      if (health.latency < 100) {
        score += 20;
        reasons.push(`Low latency (${health.latency}ms)`);
      } else if (health.latency < 500) {
        score += 10;
      } else {
        score -= 20;
        reasons.push(`High latency (${health.latency}ms)`);
      }

      // Error rate (lower is better)
      if (health.errorRate < 0.01) {
        score += 20;
        reasons.push('Low error rate');
      } else if (health.errorRate < 0.05) {
        score += 10;
      } else {
        score -= 20;
        reasons.push('High error rate');
      }
    }

    // 3. Country support
    if (config.countries.includes(criteria.countryCode) || config.countries.includes('ALL')) {
      score += 30;
      reasons.push('Supports user country');
    } else {
      score -= 50;
      reasons.push('Does not support user country');
    }

    // 4. Language support
    if (config.languages.includes(criteria.language) || config.languages.includes('en')) {
      score += 10;
      reasons.push('Supports user language');
    } else {
      score -= 20;
      reasons.push('Does not support user language');
    }

    // 5. User history
    if (history) {
      const successRate = history.successCount / (history.successCount + history.failureCount || 1);
      
      if (successRate > 0.9) {
        score += 30;
        reasons.push('High success rate with user');
      } else if (successRate > 0.7) {
        score += 15;
      } else {
        score -= 20;
        reasons.push('Low success rate with user');
      }

      // Recent usage (more recent is better)
      const daysSinceLastUse = (Date.now() - history.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastUse < 7) {
        score += 10;
        reasons.push('Recently used');
      } else if (daysSinceLastUse > 30) {
        score -= 10;
        reasons.push('Not used recently');
      }
    }

    // 6. Revenue/fill rate (from config settings)
    const fillRate = config.settings.fillRate || 0;
    if (fillRate > 0.8) {
      score += 20;
      reasons.push('High fill rate');
    } else if (fillRate > 0.5) {
      score += 10;
    } else {
      score -= 10;
      reasons.push('Low fill rate');
    }

    return {
      providerId: config.id,
      score: Math.max(0, score), // Ensure non-negative score
      reasons
    };
  }

  /**
   * Get user history for a provider
   */
  private getUserHistory(userId: string, providerId: string): UserProviderHistory | undefined {
    const userHistories = this.userHistory.get(userId);
    if (!userHistories) {
      return undefined;
    }
    return userHistories.find(h => h.providerId === providerId);
  }

  /**
   * Update user history
   */
  updateUserHistory(
    userId: string,
    providerId: string,
    success: boolean,
    earnings: number
  ): void {
    const userHistories = this.userHistory.get(userId) || [];
    const existingIndex = userHistories.findIndex(h => h.providerId === providerId);

    if (existingIndex >= 0) {
      const history = userHistories[existingIndex];
      history.lastUsed = new Date();
      history.successCount += success ? 1 : 0;
      history.failureCount += success ? 0 : 1;
      history.totalEarnings += earnings;
      userHistories[existingIndex] = history;
    } else {
      userHistories.push({
        providerId,
        lastUsed: new Date(),
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
        totalEarnings: earnings
      });
    }

    this.userHistory.set(userId, userHistories);
  }

  /**
   * Update provider health status
   */
  updateHealthStatus(providerId: string, health: ProviderHealthStatus): void {
    this.healthStatuses.set(providerId, health);
  }

  /**
   * Get health status for all providers
   */
  getAllHealthStatuses(): ProviderHealthStatus[] {
    const statuses: ProviderHealthStatus[] = [];
    
    this.providerConfigs.forEach((config, id) => {
      const health = this.healthStatuses.get(id);
      if (health) {
        statuses.push(health);
      }
    });

    return statuses;
  }

  /**
   * Get provider statistics
   */
  getProviderStatistics(providerId: string): {
    config: ProviderConfig;
    health?: ProviderHealthStatus;
    userCount: number;
  } | null {
    const config = this.providerConfigs.get(providerId);
    if (!config) {
      return null;
    }

    const health = this.healthStatuses.get(providerId);
    const userCount = this.userHistory.size;

    return {
      config,
      health,
      userCount
    };
  }

  /**
   * Enable provider
   */
  enableProvider(providerId: string): void {
    const config = this.providerConfigs.get(providerId);
    if (config) {
      config.isEnabled = true;
      this.providerConfigs.set(providerId, config);
    }
  }

  /**
   * Disable provider
   */
  disableProvider(providerId: string): void {
    const config = this.providerConfigs.get(providerId);
    if (config) {
      config.isEnabled = false;
      this.providerConfigs.set(providerId, config);
    }
  }

  /**
   * Update provider configuration
   */
  updateProviderConfig(providerId: string, config: Partial<ProviderConfig>): void {
    const existingConfig = this.providerConfigs.get(providerId);
    if (existingConfig) {
      const updatedConfig = { ...existingConfig, ...config };
      this.providerConfigs.set(providerId, updatedConfig);
      
      // Update provider instance if it exists
      const provider = this.providers.get(providerId);
      if (provider) {
        provider.updateConfig(updatedConfig);
      }
    }
  }

  /**
   * Get all enabled providers
   */
  getEnabledProviders(): ProviderConfig[] {
    return Array.from(this.providerConfigs.values()).filter(config => config.isEnabled);
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.providers.clear();
    this.providerConfigs.clear();
    this.healthStatuses.clear();
    this.userHistory.clear();
  }
}