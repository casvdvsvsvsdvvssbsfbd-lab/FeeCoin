// ============================================
// Economy Configuration
// Database-driven configuration - Pure business logic
// ============================================

import { EconomyConfig } from './types';
import { Tables } from '../../types/database';

type RemoteConfig = Tables<'remote_configs'>;

export class EconomyConfiguration {
  private config: EconomyConfig;
  private remoteConfig: Map<string, any>;

  constructor() {
    this.config = this.getDefaultConfig();
    this.remoteConfig = new Map();
  }

  /**
   * Get default economy configuration
   */
  private getDefaultConfig(): EconomyConfig {
    return {
      // Base rewards
      baseAdReward: 10,
      baseSurveyReward: 50,
      baseOfferwallReward: 25,
      baseAppInstallReward: 100,
      baseReferralReward: 75,
      baseDailyBonus: 5,
      baseMissionReward: 30,
      baseEventReward: 40,

      // Multipliers
      levelMultipliers: {
        1: 1.0,
        2: 1.1,
        3: 1.2,
        4: 1.3,
        5: 1.5,
        10: 2.0,
        15: 2.5,
        20: 3.0,
        25: 3.5,
        30: 4.0,
        50: 5.0,
        100: 10.0
      },
      rankMultipliers: {
        'bronze': 1.0,
        'silver': 1.2,
        'gold': 1.5,
        'platinum': 2.0,
        'diamond': 2.5,
        'legendary': 3.0
      },
      vipMultipliers: {
        1: 1.2,
        2: 1.4,
        3: 1.7,
        4: 2.0,
        5: 2.5
      },
      countryMultipliers: {
        'US': 1.5,
        'GB': 1.3,
        'DE': 1.2,
        'FR': 1.2,
        'CA': 1.3,
        'AU': 1.3,
        'IN': 1.0,
        'BR': 1.0,
        'MX': 1.0,
        'RU': 1.0
      },
      campaignMultipliers: {},
      streakMultipliers: {
        3: 1.0,
        7: 1.0,
        14: 1.1,
        30: 1.2,
        60: 1.3,
        100: 1.5,
        365: 2.0
      },

      // Energy
      defaultMaxEnergy: 1000,
      defaultRechargeSpeed: 10,
      defaultRechargeInterval: 5,
      energyCosts: {
        ad_view: 0,
        survey: 50,
        offerwall: 25,
        app_install: 100,
        referral: 0,
        daily_bonus: 0,
        mission: 30,
        event: 20
      },

      // Limits
      dailyAdLimit: 50,
      dailySurveyLimit: 10,
      dailyOfferwallLimit: 20,
      dailyAppInstallLimit: 5,
      dailyReferralLimit: 10,
      campaignLimits: {},

      // Anti-fraud
      fraudScoreThreshold: 0.7,
      antiFraudReductionRate: 0.5,
      duplicateActionWindow: 60, // 60 minutes

      // Withdrawal
      withdrawalThresholds: [
        { percentage: 25, amount: 1000 },
        { percentage: 50, amount: 2500 },
        { percentage: 75, amount: 5000 },
        { percentage: 100, amount: 10000 }
      ],

      // Bonuses
      referralEnergyBonus: 50,
      missionEnergyBonus: 25,
      vipEnergyBonus: 100
    };
  }

  /**
   * Load configuration from remote config
   */
  loadFromRemoteConfig(remoteConfigs: RemoteConfig[]): void {
    remoteConfigs.forEach(config => {
      this.remoteConfig.set(config.key, config.value);
    });

    // Update config with remote values
    this.applyRemoteConfig();
  }

  /**
   * Apply remote configuration to economy config
   */
  private applyRemoteConfig(): void {
    // Base rewards
    if (this.remoteConfig.has('economy.baseAdReward')) {
      this.config.baseAdReward = this.remoteConfig.get('economy.baseAdReward');
    }
    if (this.remoteConfig.has('economy.baseSurveyReward')) {
      this.config.baseSurveyReward = this.remoteConfig.get('economy.baseSurveyReward');
    }
    if (this.remoteConfig.has('economy.baseOfferwallReward')) {
      this.config.baseOfferwallReward = this.remoteConfig.get('economy.baseOfferwallReward');
    }
    if (this.remoteConfig.has('economy.baseAppInstallReward')) {
      this.config.baseAppInstallReward = this.remoteConfig.get('economy.baseAppInstallReward');
    }
    if (this.remoteConfig.has('economy.baseReferralReward')) {
      this.config.baseReferralReward = this.remoteConfig.get('economy.baseReferralReward');
    }
    if (this.remoteConfig.has('economy.baseDailyBonus')) {
      this.config.baseDailyBonus = this.remoteConfig.get('economy.baseDailyBonus');
    }
    if (this.remoteConfig.has('economy.baseMissionReward')) {
      this.config.baseMissionReward = this.remoteConfig.get('economy.baseMissionReward');
    }
    if (this.remoteConfig.has('economy.baseEventReward')) {
      this.config.baseEventReward = this.remoteConfig.get('economy.baseEventReward');
    }

    // Energy
    if (this.remoteConfig.has('economy.defaultMaxEnergy')) {
      this.config.defaultMaxEnergy = this.remoteConfig.get('economy.defaultMaxEnergy');
    }
    if (this.remoteConfig.has('economy.defaultRechargeSpeed')) {
      this.config.defaultRechargeSpeed = this.remoteConfig.get('economy.defaultRechargeSpeed');
    }
    if (this.remoteConfig.has('economy.defaultRechargeInterval')) {
      this.config.defaultRechargeInterval = this.remoteConfig.get('economy.defaultRechargeInterval');
    }

    // Limits
    if (this.remoteConfig.has('economy.dailyAdLimit')) {
      this.config.dailyAdLimit = this.remoteConfig.get('economy.dailyAdLimit');
    }
    if (this.remoteConfig.has('economy.dailySurveyLimit')) {
      this.config.dailySurveyLimit = this.remoteConfig.get('economy.dailySurveyLimit');
    }
    if (this.remoteConfig.has('economy.dailyOfferwallLimit')) {
      this.config.dailyOfferwallLimit = this.remoteConfig.get('economy.dailyOfferwallLimit');
    }
    if (this.remoteConfig.has('economy.dailyAppInstallLimit')) {
      this.config.dailyAppInstallLimit = this.remoteConfig.get('economy.dailyAppInstallLimit');
    }
    if (this.remoteConfig.has('economy.dailyReferralLimit')) {
      this.config.dailyReferralLimit = this.remoteConfig.get('economy.dailyReferralLimit');
    }

    // Anti-fraud
    if (this.remoteConfig.has('economy.fraudScoreThreshold')) {
      this.config.fraudScoreThreshold = this.remoteConfig.get('economy.fraudScoreThreshold');
    }
    if (this.remoteConfig.has('economy.antiFraudReductionRate')) {
      this.config.antiFraudReductionRate = this.remoteConfig.get('economy.antiFraudReductionRate');
    }
    if (this.remoteConfig.has('economy.duplicateActionWindow')) {
      this.config.duplicateActionWindow = this.remoteConfig.get('economy.duplicateActionWindow');
    }

    // Bonuses
    if (this.remoteConfig.has('economy.referralEnergyBonus')) {
      this.config.referralEnergyBonus = this.remoteConfig.get('economy.referralEnergyBonus');
    }
    if (this.remoteConfig.has('economy.missionEnergyBonus')) {
      this.config.missionEnergyBonus = this.remoteConfig.get('economy.missionEnergyBonus');
    }
    if (this.remoteConfig.has('economy.vipEnergyBonus')) {
      this.config.vipEnergyBonus = this.remoteConfig.get('economy.vipEnergyBonus');
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<EconomyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): EconomyConfig {
    return { ...this.config };
  }

  /**
   * Get specific configuration value
   */
  getValue(key: string): any {
    return (this.config as any)[key];
  }

  /**
   * Set specific configuration value
   */
  setValue(key: string, value: any): void {
    (this.config as any)[key] = value;
  }

  /**
   * Get base reward for action
   */
  getBaseReward(action: string): number {
    switch (action) {
      case 'ad_view':
        return this.config.baseAdReward;
      case 'survey':
        return this.config.baseSurveyReward;
      case 'offerwall':
        return this.config.baseOfferwallReward;
      case 'app_install':
        return this.config.baseAppInstallReward;
      case 'referral':
        return this.config.baseReferralReward;
      case 'daily_bonus':
        return this.config.baseDailyBonus;
      case 'mission':
        return this.config.baseMissionReward;
      case 'event':
        return this.config.baseEventReward;
      default:
        return 0;
    }
  }

  /**
   * Get energy cost for action
   */
  getEnergyCost(action: string): number {
    return this.config.energyCosts[action] || 0;
  }

  /**
   * Get daily limit for action
   */
  getDailyLimit(action: string): number {
    switch (action) {
      case 'ad_view':
        return this.config.dailyAdLimit;
      case 'survey':
        return this.config.dailySurveyLimit;
      case 'offerwall':
        return this.config.dailyOfferwallLimit;
      case 'app_install':
        return this.config.dailyAppInstallLimit;
      case 'referral':
        return this.config.dailyReferralLimit;
      default:
        return 0;
    }
  }

  /**
   * Get multiplier for user level
   */
  getLevelMultiplier(level: number): number {
    return this.config.levelMultipliers[level] || 1.0;
  }

  /**
   * Get multiplier for user rank
   */
  getRankMultiplier(rank: string): number {
    return this.config.rankMultipliers[rank] || 1.0;
  }

  /**
   * Get multiplier for VIP user
   */
  getVipMultiplier(vipLevel: number): number {
    return this.config.vipMultipliers[vipLevel] || 1.0;
  }

  /**
   * Get multiplier for country
   */
  getCountryMultiplier(countryCode: string): number {
    return this.config.countryMultipliers[countryCode] || 1.0;
  }

  /**
   * Get multiplier for campaign
   */
  getCampaignMultiplier(campaignId: string): number {
    return this.config.campaignMultipliers[campaignId] || 1.0;
  }

  /**
   * Get streak multiplier
   */
  getStreakMultiplier(streak: number): number {
    const thresholds = Object.keys(this.config.streakMultipliers)
      .map(Number)
      .sort((a, b) => a - b);

    let multiplier = 1.0;
    for (const threshold of thresholds) {
      if (streak >= threshold) {
        multiplier = this.config.streakMultipliers[threshold];
      }
    }

    return multiplier;
  }

  /**
   * Get withdrawal thresholds
   */
  getWithdrawalThresholds(): Array<{ percentage: number; amount: number }> {
    return [...this.config.withdrawalThresholds];
  }

  /**
   * Export configuration for persistence
   */
  export(): EconomyConfig {
    return this.getConfig();
  }

  /**
   * Import configuration from persistence
   */
  import(config: EconomyConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.config = this.getDefaultConfig();
    this.remoteConfig.clear();
  }
}