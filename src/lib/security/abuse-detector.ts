// ============================================
// Abuse Detector
// Detect reward farming, referral farming
// Survey/offerwall/ad/multi-account abuse
// ============================================

export type AbuseType =
  | 'reward_farming'
  | 'referral_farming'
  | 'survey_abuse'
  | 'offerwall_abuse'
  | 'ad_abuse'
  | 'withdrawal_abuse'
  | 'provider_abuse'
  | 'session_abuse'
  | 'multi_account'
  | 'referral_abuse';

export interface AbusePattern {
  type: AbuseType;
  score: number;
  pattern: string;
  detectedAt: number;
  evidence: Record<string, any>;
}

export interface AbuseDetectionResult {
  isAbusing: boolean;
  overallScore: number;
  patterns: AbusePattern[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string[];
  recommendedAction: 'none' | 'warn' | 'limit' | 'block' | 'ban';
}

export interface AbuseDetectorConfig {
  rewardThreshold: {
    maxPerDay: number;
    maxPerWeek: number;
    maxPerMonth: number;
    suspiciousMultiplier: number;
  };
  referralThreshold: {
    maxReferralsPerDay: number;
    minTimeBetweenReferrals: number;
    maxReferralRewardPerDay: number;
    suspiciousConversionRate: number;
  };
  surveyThreshold: {
    maxPerDay: number;
    minTimeBetween: number;
    maxRewardPerDay: number;
  };
  offerwallThreshold: {
    maxCompletionsPerDay: number;
    minTimeBetween: number;
    suspiciousCompletionRate: number;
  };
  withdrawalThreshold: {
    maxPerDay: number;
    minAmount: number;
    maxAmount: number;
    suspiciousPattern: boolean;
  };
  sessionThreshold: {
    maxSessionsPerDay: number;
    minSessionInterval: number;
    maxConcurrentSessions: number;
  };
}

const DEFAULT_CONFIG: AbuseDetectorConfig = {
  rewardThreshold: {
    maxPerDay: 50000,
    maxPerWeek: 200000,
    maxPerMonth: 500000,
    suspiciousMultiplier: 3,
  },
  referralThreshold: {
    maxReferralsPerDay: 50,
    minTimeBetweenReferrals: 1000,
    maxReferralRewardPerDay: 10000,
    suspiciousConversionRate: 0.9,
  },
  surveyThreshold: {
    maxPerDay: 20,
    minTimeBetween: 30000,
    maxRewardPerDay: 5000,
  },
  offerwallThreshold: {
    maxCompletionsPerDay: 50,
    minTimeBetween: 10000,
    suspiciousCompletionRate: 0.8,
  },
  withdrawalThreshold: {
    maxPerDay: 3,
    minAmount: 100,
    maxAmount: 100000,
    suspiciousPattern: true,
  },
  sessionThreshold: {
    maxSessionsPerDay: 10,
    minSessionInterval: 5000,
    maxConcurrentSessions: 3,
  },
};

export class AbuseDetector {
  private config: AbuseDetectorConfig;
  private abuseHistory: Map<string, AbusePattern[]> = new Map();
  private userActivityLog: Map<string, { type: string; timestamp: number; value: number }[]> = new Map();

  constructor(config: Partial<AbuseDetectorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Check for abuse patterns
   */
  async check(params: {
    userId: string;
    type: AbuseType;
    activity: {
      timestamp: number;
      value: number;
      metadata: Record<string, any>;
    };
  }): Promise<AbuseDetectionResult> {
    const patterns: AbusePattern[] = [];
    const details: string[] = [];

    // Log activity
    this.logActivity(params.userId, params.type, params.activity);

    switch (params.type) {
      case 'reward_farming':
        patterns.push(...await this.checkRewardFarming(params.userId, params.activity));
        break;
      case 'referral_farming':
        patterns.push(...await this.checkReferralFarming(params.userId, params.activity));
        break;
      case 'survey_abuse':
        patterns.push(...await this.checkSurveyAbuse(params.userId, params.activity));
        break;
      case 'offerwall_abuse':
        patterns.push(...await this.checkOfferwallAbuse(params.userId, params.activity));
        break;
      case 'withdrawal_abuse':
        patterns.push(...await this.checkWithdrawalAbuse(params.userId, params.activity));
        break;
      case 'session_abuse':
        patterns.push(...await this.checkSessionAbuse(params.userId, params.activity));
        break;
      case 'multi_account':
        patterns.push(...await this.checkMultiAccount(params.userId, params.activity));
        break;
      case 'referral_abuse':
        patterns.push(...await this.checkReferralAbuse(params.userId, params.activity));
        break;
      case 'ad_abuse':
        patterns.push(...await this.checkAdAbuse(params.userId, params.activity));
        break;
      case 'provider_abuse':
        patterns.push(...await this.checkProviderAbuse(params.userId, params.activity));
        break;
    }

    // Calculate overall score
    const overallScore = Math.min(
      patterns.reduce((sum, p) => sum + p.score, 0),
      100
    );

    // Track abuse history
    if (patterns.length > 0) {
      this.abuseHistory.set(params.userId, patterns);
    }

    // Determine severity
    const severity = this.getSeverity(overallScore);

    // Determine action
    const recommendedAction = this.getRecommendedAction(overallScore, patterns);

    // Collect details
    patterns.forEach(p => details.push(`${p.type}: ${p.pattern} (score: ${p.score})`));

    return {
      isAbusing: overallScore >= 40,
      overallScore,
      patterns,
      severity,
      details,
      recommendedAction,
    };
  }

  /**
   * Log user activity
   */
  private logActivity(
    userId: string,
    type: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): void {
    const userLog = this.userActivityLog.get(userId) || [];
    userLog.push({
      type,
      timestamp: activity.timestamp || Date.now(),
      value: activity.value || 0,
    });

    // Keep last 1000 entries per user
    if (userLog.length > 1000) {
      userLog.splice(0, userLog.length - 1000);
    }

    this.userActivityLog.set(userId, userLog);
  }

  /**
   * Check reward farming patterns
   */
  private async checkRewardFarming(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];
    const now = activity.timestamp || Date.now();
    const day = 86400000;

    const recentActivity = this.userActivityLog.get(userId) || [];
    const rewardActivities = recentActivity.filter(a => a.type === 'reward_farming');

    // Check daily limits
    const dayActivity = rewardActivities.filter(a => now - a.timestamp < day);
    const dayTotal = dayActivity.reduce((sum, a) => sum + a.value, 0);

    if (dayTotal > this.config.rewardThreshold.maxPerDay) {
      patterns.push({
        type: 'reward_farming',
        score: 30,
        pattern: `Daily reward limit exceeded: ${dayTotal} (max: ${this.config.rewardThreshold.maxPerDay})`,
        detectedAt: now,
        evidence: { dayTotal, limit: this.config.rewardThreshold.maxPerDay },
      });
    }

    // Check weekly limits
    const weekActivity = rewardActivities.filter(a => now - a.timestamp < day * 7);
    const weekTotal = weekActivity.reduce((sum, a) => sum + a.value, 0);

    if (weekTotal > this.config.rewardThreshold.maxPerWeek) {
      patterns.push({
        type: 'reward_farming',
        score: 40,
        pattern: `Weekly reward limit exceeded: ${weekTotal}`,
        detectedAt: now,
        evidence: { weekTotal, limit: this.config.rewardThreshold.maxPerWeek },
      });
    }

    return patterns;
  }

  /**
   * Check referral farming patterns
   */
  private async checkReferralFarming(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];
    const now = activity.timestamp || Date.now();

    const recentActivity = this.userActivityLog.get(userId) || [];
    const referralActivities = recentActivity.filter(a => a.type === 'referral_farming');

    // Check daily referral count
    const dayReferrals = referralActivities.filter(a => now - a.timestamp < 86400000);
    if (dayReferrals.length > this.config.referralThreshold.maxReferralsPerDay) {
      patterns.push({
        type: 'referral_farming',
        score: 35,
        pattern: `Excessive referrals: ${dayReferrals.length} in 24h`,
        detectedAt: now,
        evidence: { count: dayReferrals.length },
      });
    }

    // Check rapid referrals
    const lastReferrals = dayReferrals.slice(-5);
    if (lastReferrals.length >= 3) {
      const timeSpan = lastReferrals[lastReferrals.length - 1].timestamp - lastReferrals[0].timestamp;
      if (timeSpan < this.config.referralThreshold.minTimeBetweenReferrals * 3) {
        patterns.push({
          type: 'referral_farming',
          score: 30,
          pattern: 'Rapid referral pattern detected',
          detectedAt: now,
          evidence: { timeSpan, count: lastReferrals.length },
        });
      }
    }

    return patterns;
  }

  /**
   * Check survey abuse patterns
   */
  private async checkSurveyAbuse(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];
    const now = activity.timestamp || Date.now();

    const recentActivity = this.userActivityLog.get(userId) || [];
    const surveyActivities = recentActivity.filter(a => a.type === 'survey_abuse');

    // Check daily survey count
    const daySurveys = surveyActivities.filter(a => now - a.timestamp < 86400000);
    if (daySurveys.length > this.config.surveyThreshold.maxPerDay) {
      patterns.push({
        type: 'survey_abuse',
        score: 40,
        pattern: `Excessive surveys: ${daySurveys.length} in 24h`,
        detectedAt: now,
        evidence: { count: daySurveys.length },
      });
    }

    // Check rapid survey completions
    if (daySurveys.length >= 2) {
      const lastTwoInterval = daySurveys[daySurveys.length - 1].timestamp - daySurveys[daySurveys.length - 2].timestamp;
      if (lastTwoInterval < 5000) {
        patterns.push({
          type: 'survey_abuse',
          score: 50,
          pattern: 'Impossible survey completion speed',
          detectedAt: now,
          evidence: { interval: lastTwoInterval },
        });
      }
    }

    return patterns;
  }

  /**
   * Check offerwall abuse patterns
   */
  private async checkOfferwallAbuse(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];
    const now = activity.timestamp || Date.now();

    const recentActivity = this.userActivityLog.get(userId) || [];
    const offerwallActivities = recentActivity.filter(a => a.type === 'offerwall_abuse');

    // Check daily completions
    const dayCompletions = offerwallActivities.filter(a => now - a.timestamp < 86400000);
    if (dayCompletions.length > this.config.offerwallThreshold.maxCompletionsPerDay) {
      patterns.push({
        type: 'offerwall_abuse',
        score: 35,
        pattern: `Excessive offerwall completions: ${dayCompletions.length}`,
        detectedAt: now,
        evidence: { count: dayCompletions.length },
      });
    }

    return patterns;
  }

  /**
   * Check withdrawal abuse patterns
   */
  private async checkWithdrawalAbuse(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];
    const now = activity.timestamp || Date.now();

    const recentActivity = this.userActivityLog.get(userId) || [];
    const withdrawalActivities = recentActivity.filter(a => a.type === 'withdrawal_abuse');

    // Check daily withdrawal count
    const dayWithdrawals = withdrawalActivities.filter(a => now - a.timestamp < 86400000);
    if (dayWithdrawals.length > this.config.withdrawalThreshold.maxPerDay) {
      patterns.push({
        type: 'withdrawal_abuse',
        score: 45,
        pattern: `Excessive withdrawals: ${dayWithdrawals.length} in 24h`,
        detectedAt: now,
        evidence: { count: dayWithdrawals.length },
      });
    }

    return patterns;
  }

  /**
   * Check session abuse patterns
   */
  private async checkSessionAbuse(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];
    const now = activity.timestamp || Date.now();

    const recentActivity = this.userActivityLog.get(userId) || [];
    const sessionActivities = recentActivity.filter(a => a.type === 'session_abuse');

    // Check rapid session creation
    const recentSessions = sessionActivities.filter(a => now - a.timestamp < 300000);
    if (recentSessions.length > 5) {
      patterns.push({
        type: 'session_abuse',
        score: 30,
        pattern: `Rapid session creation: ${recentSessions.length}`,
        detectedAt: now,
        evidence: { count: recentSessions.length },
      });
    }

    return patterns;
  }

  /**
   * Check multi-account patterns
   */
  private async checkMultiAccount(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];

    // Multi-account detection is primarily handled by device fingerprinting
    // This would check if the same device/IP is used by multiple accounts
    if (activity.metadata?.sharedDevice) {
      patterns.push({
        type: 'multi_account',
        score: 60,
        pattern: 'Device shared with multiple accounts',
        detectedAt: activity.timestamp,
        evidence: activity.metadata,
      });
    }

    return patterns;
  }

  /**
   * Check referral abuse
   */
  private async checkReferralAbuse(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];

    // Self-referral detection
    if (activity.metadata?.selfReferral) {
      patterns.push({
        type: 'referral_abuse',
        score: 80,
        pattern: 'Self-referral detected',
        detectedAt: activity.timestamp,
        evidence: activity.metadata,
      });
    }

    return patterns;
  }

  /**
   * Check ad abuse patterns
   */
  private async checkAdAbuse(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];
    const now = activity.timestamp || Date.now();

    const recentActivity = this.userActivityLog.get(userId) || [];
    const adActivities = recentActivity.filter(a => a.type === 'ad_abuse');

    // Check impossible ad completion
    if (adActivities.length >= 2) {
      const lastTwo = adActivities.slice(-2);
      const interval = lastTwo[1].timestamp - lastTwo[0].timestamp;
      if (interval < 15000) {
        patterns.push({
          type: 'ad_abuse',
          score: 50,
          pattern: `Impossible ad completion: ${interval}ms interval`,
          detectedAt: now,
          evidence: { interval },
        });
      }
    }

    return patterns;
  }

  /**
   * Check provider abuse
   */
  private async checkProviderAbuse(
    userId: string,
    activity: { timestamp: number; value: number; metadata: Record<string, any> }
  ): Promise<AbusePattern[]> {
    const patterns: AbusePattern[] = [];

    if (activity.metadata?.callbackManipulation) {
      patterns.push({
        type: 'provider_abuse',
        score: 70,
        pattern: 'Provider callback manipulation detected',
        detectedAt: activity.timestamp,
        evidence: activity.metadata,
      });
    }

    return patterns;
  }

  /**
   * Get severity based on score
   */
  private getSeverity(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 20) return 'low';
    if (score < 50) return 'medium';
    if (score < 80) return 'high';
    return 'critical';
  }

  /**
   * Get recommended action based on score and patterns
   */
  private getRecommendedAction(
    score: number,
    patterns: AbusePattern[]
  ): 'none' | 'warn' | 'limit' | 'block' | 'ban' {
    if (score >= 80) return 'ban';
    if (score >= 60) return 'block';
    if (score >= 40) return 'limit';
    if (score >= 20) return 'warn';
    return 'none';
  }

  /**
   * Get abuse history for a user
   */
  getAbuseHistory(userId: string): AbusePattern[] {
    return this.abuseHistory.get(userId) || [];
  }

  /**
   * Get detection statistics
   */
  getStats(): {
    trackedUsers: number;
    totalDetections: number;
  } {
    let totalDetections = 0;
    this.abuseHistory.forEach(patterns => {
      totalDetections += patterns.length;
    });

    return {
      trackedUsers: this.userActivityLog.size,
      totalDetections,
    };
  }
}

// Singleton instance
export const abuseDetector = new AbuseDetector();