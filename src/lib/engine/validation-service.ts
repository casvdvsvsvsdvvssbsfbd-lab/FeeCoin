// ============================================
// Validation Service
// Anti-fraud, anti-duplicate, anti-spam - Pure business logic
// ============================================

import { 
  ValidationResult,
  UserContext,
  EconomyConfig,
  RewardSource,
  FraudCheck
} from './types';

export class ValidationService {
  private config: EconomyConfig;

  constructor(config: EconomyConfig) {
    this.config = config;
  }

  private getDailyLimit(source: RewardSource): number {
    switch (source) {
      case 'ad_view': return this.config.dailyAdLimit;
      case 'survey': return this.config.dailySurveyLimit;
      case 'offerwall': return this.config.dailyOfferwallLimit;
      case 'app_install': return this.config.dailyAppInstallLimit;
      case 'referral': return this.config.dailyReferralLimit;
      default: return 0;
    }
  }

  private getEnergyCost(source: RewardSource): number {
    return this.config.energyCosts[source] || 0;
  }

  /**
   * Validate reward action
   */
  validateRewardAction(
    source: RewardSource,
    user: UserContext,
    metadata: Record<string, any>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check if user is active
    const userStatusCheck = this.checkUserStatus(user);
    if (!userStatusCheck.isValid) {
      errors.push(...userStatusCheck.errors);
    }

    // 2. Check for duplicate actions
    const duplicateCheck = this.checkDuplicateAction(source, user, metadata);
    if (!duplicateCheck.isValid) {
      errors.push(...duplicateCheck.errors);
    }
    warnings.push(...duplicateCheck.warnings);

    // 3. Check daily limits
    const dailyLimitCheck = this.checkDailyLimit(source, user);
    if (!dailyLimitCheck.isValid) {
      errors.push(...dailyLimitCheck.errors);
    }
    warnings.push(...dailyLimitCheck.warnings);

    // 4. Check campaign limits
    const campaignLimitCheck = this.checkCampaignLimit(metadata.campaignId, user);
    if (!campaignLimitCheck.isValid) {
      errors.push(...campaignLimitCheck.errors);
    }
    warnings.push(...campaignLimitCheck.warnings);

    // 5. Check fraud score
    const fraudCheck = this.checkFraudScore(metadata.fraudScore);
    if (!fraudCheck.isValid) {
      errors.push(...fraudCheck.errors);
    }
    warnings.push(...fraudCheck.warnings);

    // 6. Check energy
    const energyCheck = this.checkEnergy(user, source);
    if (!energyCheck.isValid) {
      errors.push(...energyCheck.errors);
    }
    warnings.push(...energyCheck.warnings);

    // 7. Check spam patterns
    const spamCheck = this.checkSpamPatterns(user, metadata);
    if (!spamCheck.isValid) {
      errors.push(...spamCheck.errors);
    }
    warnings.push(...spamCheck.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        userStatus: userStatusCheck.metadata,
        duplicate: duplicateCheck.metadata,
        dailyLimit: dailyLimitCheck.metadata,
        campaignLimit: campaignLimitCheck.metadata,
        fraud: fraudCheck.metadata,
        energy: energyCheck.metadata,
        spam: spamCheck.metadata
      }
    };
  }

  /**
   * Check if user is active and eligible
   */
  private checkUserStatus(user: UserContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // User should have valid data
    if (!user.userId) {
      errors.push('Invalid user ID');
    }

    // User should have positive total earned (not a new user spam)
    if (user.totalEarned < 0) {
      errors.push('Invalid user earnings');
    }

    // Check if user has been active recently (within last 7 days)
    const lastActive = new Date(user.lastActiveAt);
    const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceActive > 7) {
      warnings.push('User has been inactive for more than 7 days');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        daysSinceActive: Math.floor(daysSinceActive)
      }
    };
  }

  /**
   * Check for duplicate actions
   */
  private checkDuplicateAction(
    source: RewardSource,
    user: UserContext,
    metadata: Record<string, any>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // This would check against recent actions in the database
    // For now, we check metadata for duplicate indicators
    const actionId = metadata.actionId;
    const timestamp = metadata.timestamp;

    if (!actionId) {
      warnings.push('Missing action ID - potential duplicate risk');
    }

    if (!timestamp) {
      warnings.push('Missing timestamp - potential duplicate risk');
    }

    // Check if action is within duplicate window
    if (timestamp) {
      const actionTime = new Date(timestamp);
      const now = new Date();
      const minutesSinceAction = (now.getTime() - actionTime.getTime()) / (1000 * 60);

      if (minutesSinceAction < this.config.duplicateActionWindow) {
        warnings.push(`Action occurred within duplicate window (${Math.floor(minutesSinceAction)} minutes ago)`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        actionId,
        timestamp,
        withinDuplicateWindow: timestamp ? 
          (Date.now() - new Date(timestamp).getTime()) / (1000 * 60) < this.config.duplicateActionWindow 
          : false
      }
    };
  }

  /**
   * Check daily limits
   */
  private checkDailyLimit(
    source: RewardSource,
    user: UserContext
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const dailyLimit = this.getDailyLimit(source);
    
    // This would check against actual daily count from database
    // For now, we use metadata or user context
    const currentCount = this.getCurrentDailyCount(source, user);

    if (currentCount >= dailyLimit) {
      errors.push(`Daily limit reached for ${source}. Limit: ${dailyLimit}, Current: ${currentCount}`);
    } else if (currentCount >= dailyLimit * 0.9) {
      warnings.push(`Approaching daily limit for ${source}. ${currentCount}/${dailyLimit}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        limit: dailyLimit,
        current: currentCount,
        remaining: dailyLimit - currentCount
      }
    };
  }

  /**
   * Check campaign limits
   */
  private checkCampaignLimit(
    campaignId: string | undefined,
    user: UserContext
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!campaignId) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        metadata: { hasCampaign: false }
      };
    }

    const campaignLimit = this.config.campaignLimits[campaignId];
    if (!campaignLimit) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        metadata: { hasCampaign: true, hasLimit: false }
      };
    }

    // This would check against actual campaign count from database
    const currentCount = 0; // Placeholder

    if (currentCount >= campaignLimit) {
      errors.push(`Campaign limit reached for ${campaignId}. Limit: ${campaignLimit}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        hasCampaign: true,
        hasLimit: true,
        limit: campaignLimit,
        current: currentCount,
        remaining: campaignLimit - currentCount
      }
    };
  }

  /**
   * Check fraud score
   */
  private checkFraudScore(fraudScore: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (fraudScore >= this.config.fraudScoreThreshold) {
      errors.push(`Fraud score too high: ${fraudScore} (threshold: ${this.config.fraudScoreThreshold})`);
    } else if (fraudScore >= this.config.fraudScoreThreshold * 0.8) {
      warnings.push(`Fraud score approaching threshold: ${fraudScore}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        fraudScore,
        threshold: this.config.fraudScoreThreshold,
        riskLevel: this.getFraudRiskLevel(fraudScore)
      }
    };
  }

  /**
   * Check energy availability
   */
  private checkEnergy(user: UserContext, source: RewardSource): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const energyCost = this.getEnergyCost(source);

    if (energyCost === 0) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        metadata: { isFree: true }
      };
    }

    if (user.energy < energyCost) {
      errors.push(`Insufficient energy. Required: ${energyCost}, Available: ${user.energy}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        required: energyCost,
        available: user.energy,
        sufficient: user.energy >= energyCost
      }
    };
  }

  /**
   * Check for spam patterns
   */
  private checkSpamPatterns(
    user: UserContext,
    metadata: Record<string, any>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for rapid successive actions
    const actionsPerMinute = metadata.actionsPerMinute || 0;
    if (actionsPerMinute > 10) {
      errors.push(`Too many actions per minute: ${actionsPerMinute}`);
    } else if (actionsPerMinute > 5) {
      warnings.push(`High action frequency: ${actionsPerMinute} actions/minute`);
    }

    // Check for bot-like behavior
    const sessionDuration = metadata.sessionDuration || 0;
    if (sessionDuration > 0 && sessionDuration < 5) {
      warnings.push('Very short session duration - potential bot');
    }

    // Check for suspicious patterns
    const deviceFingerprint = metadata.deviceFingerprint;
    if (!deviceFingerprint) {
      warnings.push('Missing device fingerprint');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        actionsPerMinute,
        sessionDuration,
        hasDeviceFingerprint: !!deviceFingerprint
      }
    };
  }

  /**
   * Get fraud risk level
   */
  private getFraudRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 0.3) return 'low';
    if (score < 0.5) return 'medium';
    if (score < 0.7) return 'high';
    return 'critical';
  }

  /**
   * Get current daily count for action
   */
  private getCurrentDailyCount(source: RewardSource, user: UserContext): number {
    // This would query the database for actual count
    // For now, return 0 as placeholder
    return 0;
  }

  /**
   * Perform comprehensive fraud check
   */
  performFraudCheck(user: UserContext, metadata: Record<string, any>): FraudCheck {
    const factors: string[] = [];
    let score = 0;

    // Check user history
    if (user.totalEarned > 10000 && user.tasksCompleted < 100) {
      factors.push('high_earnings_low_tasks');
      score += 0.2;
    }

    // Check activity patterns
    const actionsPerMinute = metadata.actionsPerMinute || 0;
    if (actionsPerMinute > 10) {
      factors.push('rapid_actions');
      score += 0.3;
    }

    // Check device fingerprint
    if (!metadata.deviceFingerprint) {
      factors.push('missing_device_fingerprint');
      score += 0.1;
    }

    // Check IP patterns
    if (metadata.ipAddress) {
      // This would check against known bad IPs
      // For now, placeholder
    }

    const riskLevel = this.getFraudRiskLevel(score);
    const isBlocked = score >= this.config.fraudScoreThreshold;

    return {
      score,
      riskLevel,
      factors,
      isBlocked
    };
  }

  /**
   * Validate withdrawal request
   */
  validateWithdrawal(
    user: UserContext,
    amount: number,
    pendingWithdrawals: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if user has sufficient balance
    if (user.totalEarned < amount) {
      errors.push(`Insufficient balance. Required: ${amount}, Available: ${user.totalEarned}`);
    }

    // Check for pending withdrawals
    if (pendingWithdrawals > 0) {
      errors.push(`Pending withdrawals exist: ${pendingWithdrawals}`);
    }

    // Check withdrawal limits
    const maxWithdrawal = user.totalEarned * 0.5; // Max 50% at once
    if (amount > maxWithdrawal) {
      errors.push(`Withdrawal amount exceeds limit. Max: ${maxWithdrawal}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        requestedAmount: amount,
        availableBalance: user.totalEarned,
        maxWithdrawal,
        pendingWithdrawals
      }
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