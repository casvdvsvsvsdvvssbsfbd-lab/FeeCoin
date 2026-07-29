// ============================================
// FC Reward Calculator Tests
// Pure unit tests - No UI dependencies
// ============================================

import { FCRewardCalculator } from '../fc-reward-calculator';
import { EconomyConfig, UserContext } from '../types';

describe('FCRewardCalculator', () => {
  let calculator: FCRewardCalculator;
  let config: EconomyConfig;
  let user: UserContext;

  beforeEach(() => {
    config = {
      baseAdReward: 10,
      baseSurveyReward: 50,
      baseOfferwallReward: 25,
      baseAppInstallReward: 100,
      baseReferralReward: 75,
      baseDailyBonus: 5,
      baseMissionReward: 30,
      baseEventReward: 40,
      levelMultipliers: { 1: 1.0, 5: 1.5, 10: 2.0 },
      rankMultipliers: { bronze: 1.0, silver: 1.2, gold: 1.5 },
      vipMultipliers: { 1: 1.2, 2: 1.5 },
      countryMultipliers: { US: 1.5, GB: 1.3 },
      campaignMultipliers: { summer2024: 1.5 },
      streakMultipliers: { 7: 1.1, 30: 1.2 },
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
      dailyAdLimit: 50,
      dailySurveyLimit: 10,
      dailyOfferwallLimit: 20,
      dailyAppInstallLimit: 5,
      dailyReferralLimit: 10,
      campaignLimits: {},
      fraudScoreThreshold: 0.7,
      antiFraudReductionRate: 0.5,
      duplicateActionWindow: 60,
      withdrawalThresholds: [
        { percentage: 25, amount: 1000 },
        { percentage: 100, amount: 10000 }
      ],
      referralEnergyBonus: 50,
      missionEnergyBonus: 25,
      vipEnergyBonus: 100
    };

    user = {
      userId: 'user-123',
      level: 5,
      rank: 'gold',
      countryCode: 'US',
      isVip: true,
      vipLevel: 2,
      currentStreak: 30,
      longestStreak: 30,
      totalEarned: 5000,
      tasksCompleted: 100,
      adsWatched: 50,
      appsInstalled: 10,
      referralsCount: 5,
      energy: 500,
      maxEnergy: 1000,
      lastActiveAt: new Date().toISOString()
    };

    calculator = new FCRewardCalculator(config);
  });

  describe('calculateReward', () => {
    it('should calculate base reward for ad view', () => {
      const result = calculator.calculateReward('ad_view', user, {});
      
      expect(result.baseAmount).toBe(10);
      expect(result.currency).toBe('FC');
      expect(result.isValid).toBe(true);
    });

    it('should calculate base reward for survey', () => {
      const result = calculator.calculateReward('survey', user, {});
      
      expect(result.baseAmount).toBe(50);
      expect(result.isValid).toBe(true);
    });

    it('should calculate base reward for offerwall', () => {
      const result = calculator.calculateReward('offerwall', user, {});
      
      expect(result.baseAmount).toBe(25);
      expect(result.isValid).toBe(true);
    });

    it('should calculate base reward for app install', () => {
      const result = calculator.calculateReward('app_install', user, {});
      
      expect(result.baseAmount).toBe(100);
      expect(result.isValid).toBe(true);
    });

    it('should calculate base reward for referral', () => {
      const result = calculator.calculateReward('referral', user, {});
      
      expect(result.baseAmount).toBe(75);
      expect(result.isValid).toBe(true);
    });

    it('should calculate base reward for daily bonus', () => {
      const result = calculator.calculateReward('daily_bonus', user, {});
      
      expect(result.baseAmount).toBe(5);
      expect(result.isValid).toBe(true);
    });

    it('should calculate base reward for mission', () => {
      const result = calculator.calculateReward('mission', user, {});
      
      expect(result.baseAmount).toBe(30);
      expect(result.isValid).toBe(true);
    });

    it('should calculate base reward for event', () => {
      const result = calculator.calculateReward('event', user, {});
      
      expect(result.baseAmount).toBe(40);
      expect(result.isValid).toBe(true);
    });
  });

  describe('multipliers', () => {
    it('should apply level multiplier', () => {
      const result = calculator.calculateReward('ad_view', user, {});
      
      expect(result.multipliers.level).toBe(1.5); // Level 5
    });

    it('should apply rank multiplier', () => {
      const result = calculator.calculateReward('ad_view', user, {});
      
      expect(result.multipliers.rank).toBe(1.5); // Gold rank
    });

    it('should apply VIP multiplier', () => {
      const result = calculator.calculateReward('ad_view', user, {});
      
      expect(result.multipliers.vip).toBe(1.5); // VIP level 2
    });

    it('should apply country multiplier', () => {
      const result = calculator.calculateReward('ad_view', user, {});
      
      expect(result.multipliers.country).toBe(1.5); // US
    });

    it('should apply campaign multiplier', () => {
      const result = calculator.calculateReward('ad_view', user, {
        campaignId: 'summer2024'
      });
      
      expect(result.multipliers.campaign).toBe(1.5);
    });

    it('should apply streak multiplier', () => {
      const result = calculator.calculateReward('ad_view', user, {});
      
      expect(result.multipliers.streak).toBe(1.2); // 30 day streak
    });

    it('should calculate total multiplier correctly', () => {
      const result = calculator.calculateReward('ad_view', user, {
        campaignId: 'summer2024'
      });
      
      // base * level * rank * vip * country * campaign * streak
      // 1.0 * 1.5 * 1.5 * 1.5 * 1.5 * 1.5 * 1.2 = 4.05
      expect(result.multipliers.total).toBeCloseTo(4.05, 2);
    });
  });

  describe('adjustments', () => {
    it('should apply anti-fraud reduction for high fraud score', () => {
      const result = calculator.calculateReward('ad_view', user, {
        fraudScore: 0.8
      });
      
      expect(result.adjustments.antiFraud).toBeGreaterThan(0);
    });

    it('should not apply anti-fraud reduction for low fraud score', () => {
      const result = calculator.calculateReward('ad_view', user, {
        fraudScore: 0.2
      });
      
      expect(result.adjustments.antiFraud).toBe(0);
    });

    it('should cap total reduction at 90%', () => {
      const result = calculator.calculateReward('ad_view', user, {
        fraudScore: 0.95
      });
      
      expect(result.adjustments.total).toBeLessThanOrEqual(0.9);
    });
  });

  describe('final calculation', () => {
    it('should calculate final amount correctly', () => {
      const result = calculator.calculateReward('ad_view', user, {
        campaignId: 'summer2024'
      });
      
      // base (10) * total multiplier (4.05) * (1 - adjustments)
      const expected = Math.floor(10 * 4.05);
      expect(result.finalAmount).toBe(expected);
    });

    it('should never return negative amount', () => {
      const result = calculator.calculateReward('ad_view', user, {
        fraudScore: 0.99
      });
      
      expect(result.finalAmount).toBeGreaterThanOrEqual(0);
    });

    it('should mark as invalid if final amount is 0', () => {
      const result = calculator.calculateReward('ad_view', user, {
        fraudScore: 0.99
      });
      
      // With 90% reduction, 10 * 4.05 * 0.1 = 0.405, floor = 0
      if (result.finalAmount === 0) {
        expect(result.isValid).toBe(false);
      }
    });
  });

  describe('validation', () => {
    it('should validate reward successfully', () => {
      const result = calculator.validateReward('ad_view', user, {});
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for invalid reward', () => {
      const result = calculator.validateReward('ad_view', user, {
        fraudScore: 0.99
      });
      
      if (result.errors.length > 0) {
        expect(result.isValid).toBe(false);
      }
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      calculator.updateConfig({ baseAdReward: 20 });
      const result = calculator.calculateReward('ad_view', user, {});
      
      expect(result.baseAmount).toBe(20);
    });

    it('should get current configuration', () => {
      const currentConfig = calculator.getConfig();
      
      expect(currentConfig.baseAdReward).toBe(10);
    });
  });
});