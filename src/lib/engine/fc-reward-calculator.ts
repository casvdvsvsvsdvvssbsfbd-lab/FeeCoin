// ============================================
// FC Reward Calculator
// Pure business logic - No UI dependencies
// ============================================

import { 
  UserContext,
  RewardCalculation,
  MultiplierBreakdown,
  AdjustmentBreakdown,
  EconomyConfig,
  RewardSource,
  ValidationResult
} from './types';

export class FCRewardCalculator {
  private config: EconomyConfig;

  constructor(config: EconomyConfig) {
    this.config = config;
  }

  /**
   * Calculate FC reward for any action
   */
  calculateReward(
    source: RewardSource,
    user: UserContext,
    metadata: Record<string, any> = {}
  ): RewardCalculation {
    const baseAmount = this.getBaseReward(source);
    const multipliers = this.calculateMultipliers(user, metadata);
    const adjustments = this.calculateAdjustments(user, metadata);
    
    const finalAmount = Math.floor(
      baseAmount * multipliers.total * (1 - adjustments.total)
    );

    return {
      baseAmount,
      finalAmount: Math.max(0, finalAmount),
      currency: 'FC',
      multipliers,
      adjustments,
      isValid: finalAmount > 0,
      validationErrors: [],
      metadata
    };
  }

  /**
   * Get base reward amount from config
   */
  private getBaseReward(source: RewardSource): number {
    switch (source) {
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
   * Calculate all applicable multipliers
   */
  private calculateMultipliers(
    user: UserContext,
    metadata: Record<string, any>
  ): MultiplierBreakdown {
    const level = this.getLevelMultiplier(user.level);
    const rank = this.getRankMultiplier(user.rank);
    const vip = this.getVipMultiplier(user.isVip, user.vipLevel);
    const country = this.getCountryMultiplier(user.countryCode);
    const campaign = this.getCampaignMultiplier(metadata.campaignId);
    const streak = this.getStreakMultiplier(user.currentStreak);

    const total = level * rank * vip * country * campaign * streak;

    return {
      base: 1,
      level,
      rank,
      vip,
      country,
      campaign,
      streak,
      total
    };
  }

  /**
   * Calculate all adjustments (reductions)
   */
  private calculateAdjustments(
    user: UserContext,
    metadata: Record<string, any>
  ): AdjustmentBreakdown {
    const antiFraud = this.calculateAntiFraudReduction(metadata.fraudScore);
    const dailyLimit = this.calculateDailyLimitReduction(user, metadata.source);
    const campaignLimit = this.calculateCampaignLimitReduction(metadata.campaignId);
    const fraudScore = this.calculateFraudScoreReduction(metadata.fraudScore);

    const total = Math.min(
      antiFraud + dailyLimit + campaignLimit + fraudScore,
      0.9 // Max 90% reduction
    );

    return {
      antiFraud,
      dailyLimit,
      campaignLimit,
      fraudScore,
      total
    };
  }

  /**
   * Level multiplier based on user level
   */
  private getLevelMultiplier(level: number): number {
    const multiplier = this.config.levelMultipliers[level];
    return multiplier || 1.0;
  }

  /**
   * Rank multiplier based on user rank
   */
  private getRankMultiplier(rank: string): number {
    const multiplier = this.config.rankMultipliers[rank];
    return multiplier || 1.0;
  }

  /**
   * VIP multiplier based on VIP status and level
   */
  private getVipMultiplier(isVip: boolean, vipLevel?: number): number {
    if (!isVip) return 1.0;
    const level = vipLevel || 1;
    const multiplier = this.config.vipMultipliers[level];
    return multiplier || 1.0;
  }

  /**
   * Country multiplier based on user location
   */
  private getCountryMultiplier(countryCode?: string): number {
    if (!countryCode) return 1.0;
    const multiplier = this.config.countryMultipliers[countryCode];
    return multiplier || 1.0;
  }

  /**
   * Campaign multiplier for active campaigns
   */
  private getCampaignMultiplier(campaignId?: string): number {
    if (!campaignId) return 1.0;
    const multiplier = this.config.campaignMultipliers[campaignId];
    return multiplier || 1.0;
  }

  /**
   * Streak multiplier based on consecutive days
   */
  private getStreakMultiplier(streak: number): number {
    if (streak < 3) return 1.0;
    if (streak < 7) return 1.0;
    if (streak < 14) return 1.1;
    if (streak < 30) return 1.2;
    if (streak < 60) return 1.3;
    if (streak < 100) return 1.5;
    return 2.0;
  }

  /**
   * Anti-fraud reduction based on fraud score
   */
  private calculateAntiFraudReduction(fraudScore: number): number {
    if (fraudScore < 0.3) return 0;
    if (fraudScore < 0.5) return 0.1;
    if (fraudScore < 0.7) return 0.3;
    if (fraudScore < 0.9) return 0.5;
    return 0.9;
  }

  /**
   * Daily limit reduction
   */
  private calculateDailyLimitReduction(
    user: UserContext,
    source?: RewardSource
  ): number {
    // This would check against daily limits
    // For now, return 0 (no reduction)
    return 0;
  }

  /**
   * Campaign limit reduction
   */
  private calculateCampaignLimitReduction(campaignId?: string): number {
    // This would check against campaign limits
    // For now, return 0 (no reduction)
    return 0;
  }

  /**
   * Fraud score reduction
   */
  private calculateFraudScoreReduction(fraudScore: number): number {
    if (fraudScore < this.config.fraudScoreThreshold) return 0;
    return this.config.antiFraudReductionRate;
  }

  /**
   * Validate reward calculation
   */
  validateReward(
    source: RewardSource,
    user: UserContext,
    metadata: Record<string, any>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if user is active
    // Check if action is allowed
    // Check for duplicates
    // Check daily limits
    // Check campaign limits
    // Check fraud score
    // Check energy

    const calculation = this.calculateReward(source, user, metadata);

    if (!calculation.isValid) {
      errors.push('Invalid reward calculation');
    }

    if (calculation.finalAmount <= 0) {
      errors.push('Reward amount is zero or negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: calculation.metadata
    };
  }

  /**
   * Update economy configuration
   */
  updateConfig(config: Partial<EconomyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current economy configuration
   */
  getConfig(): EconomyConfig {
    return { ...this.config };
  }
}