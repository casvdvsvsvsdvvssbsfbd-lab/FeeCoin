// ============================================
// Withdrawal Guard
// Pre-withdrawal verification system
// Checks fraud, risk, device trust, progress, etc.
// ============================================

export interface WithdrawalVerification {
  fraudScore: number;
  riskScore: number;
  deviceTrust: number;
  progressPercent: number;
  settlementStatus: string;
  rewardVerified: boolean;
  referralAbuse: boolean;
  multiAccountAbuse: boolean;
  providerVerified: boolean;
}

export interface WithdrawalGuardResult {
  allowed: boolean;
  score: number;
  verifications: WithdrawalVerification;
  rejectReason: string | null;
  recommendedAction: 'approve' | 'review' | 'reject' | 'block';
  details: string[];
}

export interface WithdrawalGuardConfig {
  minFraudScore: number;
  maxRiskScore: number;
  minDeviceTrust: number;
  minProgressPercent: number;
  requireSettlement: boolean;
  requireRewardVerification: boolean;
  blockReferralAbuse: boolean;
  blockMultiAccount: boolean;
  requireProviderVerification: boolean;
  autoRejectThreshold: number;
  manualReviewThreshold: number;
}

const DEFAULT_CONFIG: WithdrawalGuardConfig = {
  minFraudScore: 0,
  maxRiskScore: 50,
  minDeviceTrust: 0.3,
  minProgressPercent: 0,
  requireSettlement: true,
  requireRewardVerification: true,
  blockReferralAbuse: true,
  blockMultiAccount: true,
  requireProviderVerification: true,
  autoRejectThreshold: 70,
  manualReviewThreshold: 40,
};

export class WithdrawalGuard {
  private config: WithdrawalGuardConfig;

  constructor(config: Partial<WithdrawalGuardConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Verify withdrawal request
   */
  async verify(params: {
    userId: string;
    withdrawalId: string;
    amount: number;
    verifications: WithdrawalVerification;
  }): Promise<WithdrawalGuardResult> {
    const details: string[] = [];
    let totalScore = 0;
    const v = params.verifications;

    // 1. Check fraud score
    if (v.fraudScore > this.config.minFraudScore) {
      totalScore += v.fraudScore * 0.3;
      if (v.fraudScore > 50) {
        details.push(`High fraud score: ${v.fraudScore}`);
      }
    }

    // 2. Check risk score
    if (v.riskScore > this.config.maxRiskScore) {
      totalScore += v.riskScore * 0.25;
      details.push(`Risk score exceeds threshold: ${v.riskScore}`);
    }

    // 3. Check device trust
    if (v.deviceTrust < this.config.minDeviceTrust) {
      totalScore += 30;
      details.push(`Low device trust: ${v.deviceTrust}`);
    }

    // 4. Check progress percentage
    if (v.progressPercent < this.config.minProgressPercent) {
      totalScore += 20;
      details.push(`Insufficient progress: ${v.progressPercent}%`);
    }

    // 5. Check settlement status
    if (this.config.requireSettlement && v.settlementStatus !== 'settled') {
      totalScore += 25;
      details.push(`Settlement not completed: ${v.settlementStatus}`);
    }

    // 6. Check reward verification
    if (this.config.requireRewardVerification && !v.rewardVerified) {
      totalScore += 30;
      details.push('Reward verification failed');
    }

    // 7. Check referral abuse
    if (this.config.blockReferralAbuse && v.referralAbuse) {
      totalScore += 50;
      details.push('Referral abuse detected');
    }

    // 8. Check multi-account abuse
    if (this.config.blockMultiAccount && v.multiAccountAbuse) {
      totalScore += 60;
      details.push('Multi-account abuse detected');
    }

    // 9. Check provider verification
    if (this.config.requireProviderVerification && !v.providerVerified) {
      totalScore += 20;
      details.push('Provider verification failed');
    }

    // Normalize score
    totalScore = Math.min(totalScore, 100);

    // Determine action
    let allowed = true;
    let rejectReason: string | null = null;
    let recommendedAction: 'approve' | 'review' | 'reject' | 'block';

    if (totalScore >= this.config.autoRejectThreshold) {
      allowed = false;
      rejectReason = 'Automatic rejection: high risk score';
      recommendedAction = 'reject';
    } else if (totalScore >= this.config.manualReviewThreshold) {
      allowed = false;
      rejectReason = 'Requires manual review: medium risk';
      recommendedAction = 'review';
    } else if (v.multiAccountAbuse || v.referralAbuse) {
      allowed = false;
      rejectReason = 'Blocked: abuse detected';
      recommendedAction = 'block';
    } else {
      recommendedAction = 'approve';
    }

    return {
      allowed,
      score: totalScore,
      verifications: v,
      rejectReason,
      recommendedAction,
      details,
    };
  }

  /**
   * Update config at runtime
   */
  updateConfig(config: Partial<WithdrawalGuardConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current config
   */
  getConfig(): Readonly<WithdrawalGuardConfig> {
    return { ...this.config };
  }
}

// Singleton instance
export const withdrawalGuard = new WithdrawalGuard();