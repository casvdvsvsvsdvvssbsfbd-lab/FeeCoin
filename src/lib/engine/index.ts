// ============================================
// Core Business Engine
// Export all engine components
// ============================================

export { FCRewardCalculator } from './fc-reward-calculator';
export { FCPercentageEngine } from './fc-percentage-engine';
export { EnergyEngine } from './energy-engine';
export { EconomyConfiguration } from './economy-config';
export { ValidationService } from './validation-service';

export type {
  RewardSource,
  Currency,
  UserContext,
  RewardCalculation,
  MultiplierBreakdown,
  AdjustmentBreakdown,
  EnergyState,
  EnergyCost,
  WithdrawalProgress,
  EconomyConfig,
  ValidationResult,
  DailyLimit,
  CampaignLimit,
  FraudCheck
} from './types';