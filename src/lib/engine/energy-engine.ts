// ============================================
// Energy Engine
// Pure business logic - No UI dependencies
// ============================================

import { 
  EnergyState,
  EnergyCost,
  EconomyConfig,
  UserContext,
  ValidationResult
} from './types';

export class EnergyEngine {
  private config: EconomyConfig;

  constructor(config: EconomyConfig) {
    this.config = config;
  }

  /**
   * Get current energy state for user
   */
  getEnergyState(user: UserContext): EnergyState {
    const now = new Date();
    const lastRechargeAt = new Date(user.lastActiveAt || now.toISOString());
    const nextRechargeAt = this.calculateNextRecharge(lastRechargeAt);
    
    // Calculate current energy with recharge
    const currentEnergy = this.calculateCurrentEnergy(
      user.energy,
      lastRechargeAt,
      nextRechargeAt
    );

    return {
      current: Math.min(currentEnergy, user.maxEnergy),
      maximum: user.maxEnergy,
      rechargeSpeed: this.config.defaultRechargeSpeed,
      rechargeInterval: this.config.defaultRechargeInterval,
      lastRechargeAt: lastRechargeAt.toISOString(),
      nextRechargeAt: nextRechargeAt.toISOString(),
      isFull: currentEnergy >= user.maxEnergy
    };
  }

  /**
   * Calculate current energy with time-based recharge
   */
  private calculateCurrentEnergy(
    currentEnergy: number,
    lastRechargeAt: Date,
    nextRechargeAt: Date
  ): number {
    const now = new Date();
    
    // If energy is full, no need to calculate
    if (currentEnergy >= this.config.defaultMaxEnergy) {
      return currentEnergy;
    }

    // If next recharge hasn't happened yet, return current energy
    if (now < nextRechargeAt) {
      return currentEnergy;
    }

    // Calculate how many recharge intervals have passed
    const timeDiff = now.getTime() - lastRechargeAt.getTime();
    const intervalsPassed = Math.floor(
      timeDiff / (this.config.defaultRechargeInterval * 60 * 1000)
    );

    // Add recharged energy
    const rechargedEnergy = currentEnergy + (
      intervalsPassed * this.config.defaultRechargeSpeed
    );

    return Math.min(rechargedEnergy, this.config.defaultMaxEnergy);
  }

  /**
   * Calculate next recharge time
   */
  private calculateNextRecharge(lastRechargeAt: Date): Date {
    const nextRecharge = new Date(lastRechargeAt);
    nextRecharge.setMinutes(
      nextRecharge.getMinutes() + this.config.defaultRechargeInterval
    );
    return nextRecharge;
  }

  /**
   * Check if user has enough energy for action
   */
  hasEnoughEnergy(user: UserContext, action: string): boolean {
    const energyState = this.getEnergyState(user);
    const cost = this.getEnergyCost(action);
    
    return energyState.current >= cost;
  }

  /**
   * Get energy cost for action
   */
  getEnergyCost(action: string): number {
    const cost = this.config.energyCosts[action];
    return cost || 0;
  }

  /**
   * Consume energy for action
   */
  consumeEnergy(user: UserContext, action: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const energyState = this.getEnergyState(user);
    const cost = this.getEnergyCost(action);

    if (cost === 0) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        metadata: { isFree: true }
      };
    }

    if (energyState.current < cost) {
      errors.push(`Insufficient energy. Required: ${cost}, Available: ${energyState.current}`);
      
      return {
        isValid: false,
        errors,
        warnings,
        metadata: {
          required: cost,
          available: energyState.current,
          missing: cost - energyState.current
        }
      };
    }

    return {
      isValid: true,
      errors: [],
      warnings: [],
      metadata: {
        cost,
        remaining: energyState.current - cost
      }
    };
  }

  /**
   * Add energy to user
   */
  addEnergy(
    user: UserContext,
    amount: number,
    reason: string
  ): { newEnergy: number; overflow: number } {
    const energyState = this.getEnergyState(user);
    const newEnergy = Math.min(
      energyState.current + amount,
      energyState.maximum
    );
    const overflow = (energyState.current + amount) - energyState.maximum;

    return {
      newEnergy,
      overflow: Math.max(0, overflow)
    };
  }

  /**
   * Apply referral energy bonus
   */
  applyReferralBonus(user: UserContext): number {
    const bonus = this.config.referralEnergyBonus;
    const result = this.addEnergy(user, bonus, 'referral_bonus');
    return result.newEnergy;
  }

  /**
   * Apply mission energy bonus
   */
  applyMissionBonus(user: UserContext): number {
    const bonus = this.config.missionEnergyBonus;
    const result = this.addEnergy(user, bonus, 'mission_bonus');
    return result.newEnergy;
  }

  /**
   * Apply VIP energy bonus
   */
  applyVipBonus(user: UserContext): number {
    if (!user.isVip) return user.energy;
    
    const bonus = this.config.vipEnergyBonus;
    const result = this.addEnergy(user, bonus, 'vip_bonus');
    return result.newEnergy;
  }

  /**
   * Calculate energy cost with bonuses
   */
  calculateEffectiveCost(user: UserContext, action: string): number {
    const baseCost = this.getEnergyCost(action);
    
    // Apply bonuses that reduce cost
    let reduction = 0;
    
    if (user.isVip) {
      reduction += this.config.vipEnergyBonus * 0.1; // 10% discount for VIP
    }

    if (user.currentStreak >= 7) {
      reduction += this.config.missionEnergyBonus * 0.05; // 5% discount for 7+ streak
    }

    return Math.max(0, baseCost - reduction);
  }

  /**
   * Get energy status for UI
   */
  getEnergyStatus(user: UserContext): {
    current: number;
    maximum: number;
    percentage: number;
    isFull: boolean;
    timeToFull: number; // minutes
  } {
    const energyState = this.getEnergyState(user);
    const percentage = (energyState.current / energyState.maximum) * 100;
    
    // Calculate time to full
    const energyNeeded = energyState.maximum - energyState.current;
    const timeToFull = Math.ceil(
      energyNeeded / this.config.defaultRechargeSpeed
    ) * this.config.defaultRechargeInterval;

    return {
      current: energyState.current,
      maximum: energyState.maximum,
      percentage: Math.floor(percentage),
      isFull: energyState.isFull,
      timeToFull
    };
  }

  /**
   * Validate energy action
   */
  validateEnergyAction(
    user: UserContext,
    action: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const energyState = this.getEnergyState(user);
    const cost = this.getEnergyCost(action);

    // Check if action is free
    if (cost === 0) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        metadata: { isFree: true }
      };
    }

    // Check if user has enough energy
    if (energyState.current < cost) {
      errors.push(`Insufficient energy for ${action}`);
      warnings.push(`Energy will be recharged in ${this.getTimeToNextRecharge(energyState)} minutes`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        cost,
        current: energyState.current,
        timeToNextRecharge: this.getTimeToNextRecharge(energyState)
      }
    };
  }

  /**
   * Get time to next recharge in minutes
   */
  private getTimeToNextRecharge(energyState: EnergyState): number {
    const now = new Date();
    const nextRecharge = new Date(energyState.nextRechargeAt);
    const diff = nextRecharge.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (60 * 1000)));
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