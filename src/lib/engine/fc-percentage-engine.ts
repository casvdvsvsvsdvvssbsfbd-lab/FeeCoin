// ============================================
// FC Percentage Engine
// Withdrawal Progress Engine - Pure business logic
// ============================================

import { 
  WithdrawalProgress,
  EconomyConfig,
  UserContext
} from './types';

export class FCPercentageEngine {
  private config: EconomyConfig;

  constructor(config: EconomyConfig) {
    this.config = config;
  }

  /**
   * Calculate withdrawal progress
   * Progress grows ONLY when FC is legitimately earned
   */
  calculateWithdrawalProgress(
    user: UserContext,
    legitimatelyEarnedFC: number
  ): WithdrawalProgress {
    const thresholds = this.config.withdrawalThresholds;
    const targetThreshold = thresholds[thresholds.length - 1];
    
    const targetAmount = targetThreshold.amount;
    const currentAmount = legitimatelyEarnedFC;
    const remainingAmount = Math.max(0, targetAmount - currentAmount);
    
    const currentPercentage = Math.min(100, (currentAmount / targetAmount) * 100);
    const targetPercentage = targetThreshold.percentage;

    // Calculate estimated days based on average daily earnings
    const averageDailyEarnings = this.estimateAverageDailyEarnings(user);
    const estimatedDays = remainingAmount > 0 && averageDailyEarnings > 0
      ? Math.ceil(remainingAmount / averageDailyEarnings)
      : 0;

    // Find next milestone
    const nextMilestone = this.findNextMilestone(currentPercentage, thresholds);

    return {
      currentPercentage: Math.floor(currentPercentage * 100) / 100,
      targetPercentage,
      currentAmount,
      targetAmount,
      remainingAmount,
      estimatedDays,
      canWithdraw: currentPercentage >= targetPercentage,
      nextMilestone
    };
  }

  /**
   * Estimate average daily earnings based on user activity
   */
  private estimateAverageDailyEarnings(user: UserContext): number {
    // Calculate based on user's historical performance
    const daysActive = this.estimateDaysActive(user);
    if (daysActive === 0) return 0;

    const totalEarned = user.totalEarned;
    const averageDaily = totalEarned / daysActive;

    // Apply a conservative estimate (80% of average)
    return averageDaily * 0.8;
  }

  /**
   * Estimate days active based on user data
   */
  private estimateDaysActive(user: UserContext): number {
    // This would typically come from user registration date
    // For now, estimate based on tasks completed
    const tasksPerDay = 5; // Average tasks per day
    return Math.max(1, Math.floor(user.tasksCompleted / tasksPerDay));
  }

  /**
   * Find next milestone to achieve
   */
  private findNextMilestone(
    currentPercentage: number,
    thresholds: Array<{ percentage: number; amount: number }>
  ): { percentage: number; amount: number; remaining: number } | undefined {
    for (const threshold of thresholds) {
      if (threshold.percentage > currentPercentage) {
        return {
          percentage: threshold.percentage,
          amount: threshold.amount,
          remaining: threshold.amount - (currentPercentage / 100 * threshold.amount)
        };
      }
    }
    return undefined;
  }

  /**
   * Get all withdrawal milestones
   */
  getWithdrawalMilestones(): Array<{ percentage: number; amount: number; label: string }> {
    return this.config.withdrawalThresholds.map(threshold => ({
      percentage: threshold.percentage,
      amount: threshold.amount,
      label: this.getMilestoneLabel(threshold.percentage)
    }));
  }

  /**
   * Get human-readable milestone label
   */
  private getMilestoneLabel(percentage: number): string {
    if (percentage === 25) return 'Bronze';
    if (percentage === 50) return 'Silver';
    if (percentage === 75) return 'Gold';
    if (percentage === 100) return 'Platinum';
    return `${percentage}%`;
  }

  /**
   * Check if user can withdraw at current progress
   */
  canWithdraw(currentPercentage: number): boolean {
    return currentPercentage >= 100;
  }

  /**
   * Calculate progress percentage for a given amount
   */
  calculatePercentage(amount: number): number {
    const targetAmount = this.config.withdrawalThresholds[
      this.config.withdrawalThresholds.length - 1
    ].amount;
    
    return Math.min(100, (amount / targetAmount) * 100);
  }

  /**
   * Get time-based projection
   */
  getTimeProjection(
    currentAmount: number,
    targetAmount: number,
    averageDailyEarnings: number
  ): {
    daysRemaining: number;
    dateReached: Date;
    onTrack: boolean;
  } {
    const remaining = targetAmount - currentAmount;
    const daysRemaining = remaining > 0 && averageDailyEarnings > 0
      ? Math.ceil(remaining / averageDailyEarnings)
      : 0;

    const dateReached = new Date();
    dateReached.setDate(dateReached.getDate() + daysRemaining);

    // Consider on track if user can reach target within 30 days
    const onTrack = daysRemaining <= 30;

    return {
      daysRemaining,
      dateReached,
      onTrack
    };
  }

  /**
   * Validate withdrawal request
   */
  validateWithdrawal(
    currentPercentage: number,
    pendingWithdrawals: number
  ): { canWithdraw: boolean; reason?: string } {
    if (currentPercentage < 100) {
      return {
        canWithdraw: false,
        reason: `Withdrawal requires 100% progress. Current: ${currentPercentage.toFixed(2)}%`
      };
    }

    // Check if user has pending withdrawals
    if (pendingWithdrawals > 0) {
      return {
        canWithdraw: false,
        reason: 'You have pending withdrawals. Please wait for them to complete.'
      };
    }

    return { canWithdraw: true };
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