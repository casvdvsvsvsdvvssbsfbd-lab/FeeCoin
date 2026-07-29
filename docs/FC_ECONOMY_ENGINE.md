# FC Economy Engine

## Overview

The FC Economy Engine is the core business logic system for calculating and managing FC (FEE Coin) rewards in the FEE Telegram Mini App. It provides a fully configurable, database-driven reward calculation system with support for multiple multipliers, anti-fraud measures, and validation.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FC Economy Engine                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │ Reward Calculator│  │ Validation       │  │ Economy   │ │
│  │                  │  │ Service          │  │ Config    │ │
│  │ - Base rewards   │  │ - Anti-fraud     │  │ - Remote  │ │
│  │ - Multipliers    │  │ - Anti-duplicate │  │ - Defaults│ │
│  │ - Adjustments    │  │ - Anti-spam      │  │ - Dynamic │ │
│  └──────────────────┘  └──────────────────┘  └───────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. FCRewardCalculator

Calculates FC rewards for all user actions with support for multiple multipliers and adjustments.

#### Features

- **Base Rewards**: Configurable base amounts for each action type
- **Multipliers**: Level, rank, VIP, country, campaign, and streak multipliers
- **Adjustments**: Anti-fraud reductions, daily limits, campaign limits
- **Validation**: Built-in reward validation

#### Usage

```typescript
import { FCRewardCalculator } from '@/lib/engine';
import { EconomyConfig, UserContext } from '@/lib/engine/types';

const config: EconomyConfig = {
  // ... configuration
};

const calculator = new FCRewardCalculator(config);

const user: UserContext = {
  userId: 'user-123',
  level: 5,
  rank: 'gold',
  countryCode: 'US',
  isVip: true,
  vipLevel: 2,
  currentStreak: 30,
  // ... other fields
};

const result = calculator.calculateReward('ad_view', user, {
  campaignId: 'summer2024',
  fraudScore: 0.2
});

console.log(result.finalAmount); // Calculated FC amount
console.log(result.multipliers); // Multiplier breakdown
console.log(result.adjustments); // Adjustment breakdown
```

#### Reward Sources

- `ad_view` - Watching advertisements
- `survey` - Completing surveys
- `offerwall` - Completing offers
- `app_install` - Installing apps
- `referral` - Referring friends
- `daily_bonus` - Daily login bonus
- `mission` - Completing missions
- `event` - Participating in events

### 2. FCPercentageEngine

Manages withdrawal progress tracking. Progress grows ONLY when FC is legitimately earned.

#### Features

- **Progress Calculation**: Tracks withdrawal progress based on legitimately earned FC
- **Milestones**: Bronze (25%), Silver (50%), Gold (75%), Platinum (100%)
- **Time Projection**: Estimates days remaining to reach withdrawal threshold
- **Validation**: Validates withdrawal requests

#### Usage

```typescript
import { FCPercentageEngine } from '@/lib/engine';

const engine = new FCPercentageEngine(config);

const progress = engine.calculateWithdrawalProgress(user, legitimatelyEarnedFC);

console.log(progress.currentPercentage); // Current progress %
console.log(progress.estimatedDays); // Days to reach target
console.log(progress.canWithdraw); // Can user withdraw?
```

### 3. EnergyEngine

Manages user energy system with configurable limits, recharge rates, and costs.

#### Features

- **Energy State**: Current, maximum, recharge speed, recharge interval
- **Energy Costs**: Different costs for different actions
- **Bonuses**: Referral, mission, and VIP energy bonuses
- **Recharge**: Time-based energy regeneration
- **Overflow Protection**: Prevents energy from exceeding maximum

#### Usage

```typescript
import { EnergyEngine } from '@/lib/engine';

const engine = new EnergyEngine(config);

// Get current energy state
const state = engine.getEnergyState(user);
console.log(state.current); // Current energy
console.log(state.isFull); // Is energy full?

// Check if user can perform action
const canPerform = engine.hasEnoughEnergy(user, 'survey');

// Consume energy
const result = engine.consumeEnergy(user, 'survey');
if (result.isValid) {
  // Deduct energy and perform action
}

// Add energy bonus
engine.applyReferralBonus(user);
engine.applyMissionBonus(user);
engine.applyVipBonus(user);
```

### 4. EconomyConfiguration

Database-driven configuration system with remote config support.

#### Features

- **Default Configuration**: Sensible defaults for all parameters
- **Remote Config**: Dynamic configuration via database
- **Live Updates**: Update configuration without code changes
- **Export/Import**: Persist and restore configuration

#### Configuration Parameters

##### Base Rewards
- `baseAdReward` - FC per ad view
- `baseSurveyReward` - FC per survey
- `baseOfferwallReward` - FC per offerwall
- `baseAppInstallReward` - FC per app install
- `baseReferralReward` - FC per referral
- `baseDailyBonus` - FC for daily bonus
- `baseMissionReward` - FC per mission
- `baseEventReward` - FC per event

##### Multipliers
- `levelMultipliers` - Multiplier by user level
- `rankMultipliers` - Multiplier by user rank
- `vipMultipliers` - Multiplier by VIP level
- `countryMultipliers` - Multiplier by country
- `campaignMultipliers` - Multiplier by campaign
- `streakMultipliers` - Multiplier by streak days

##### Energy
- `defaultMaxEnergy` - Maximum energy
- `defaultRechargeSpeed` - Energy per recharge
- `defaultRechargeInterval` - Minutes between recharges
- `energyCosts` - Energy cost per action

##### Limits
- `dailyAdLimit` - Max ads per day
- `dailySurveyLimit` - Max surveys per day
- `dailyOfferwallLimit` - Max offerwalls per day
- `dailyAppInstallLimit` - Max app installs per day
- `dailyReferralLimit` - Max referrals per day
- `campaignLimits` - Limits per campaign

##### Anti-Fraud
- `fraudScoreThreshold` - Score above which actions are blocked
- `antiFraudReductionRate` - Reduction applied for fraud
- `duplicateActionWindow` - Minutes to consider action duplicate

##### Withdrawal
- `withdrawalThresholds` - Array of {percentage, amount} milestones

##### Bonuses
- `referralEnergyBonus` - Energy for referring
- `missionEnergyBonus` - Energy for missions
- `vipEnergyBonus` - Energy for VIP users

### 5. ValidationService

Comprehensive validation for all user actions.

#### Features

- **User Status**: Validates user is active and eligible
- **Duplicate Detection**: Prevents duplicate actions
- **Daily Limits**: Enforces daily action limits
- **Campaign Limits**: Enforces campaign-specific limits
- **Fraud Detection**: Checks fraud scores
- **Energy Validation**: Ensures sufficient energy
- **Spam Detection**: Detects bot-like behavior

#### Usage

```typescript
import { ValidationService } from '@/lib/engine';

const validator = new ValidationService(config);

const result = validator.validateRewardAction('ad_view', user, {
  actionId: 'action-123',
  timestamp: new Date().toISOString(),
  fraudScore: 0.2,
  deviceFingerprint: 'device-123'
});

if (result.isValid) {
  // Proceed with reward
} else {
  console.error(result.errors);
}
```

## Multiplier System

### Level Multipliers

| Level | Multiplier |
|-------|-----------|
| 1 | 1.0x |
| 5 | 1.5x |
| 10 | 2.0x |
| 15 | 2.5x |
| 20 | 3.0x |
| 25 | 3.5x |
| 30 | 4.0x |
| 50 | 5.0x |
| 100 | 10.0x |

### Rank Multipliers

| Rank | Multiplier |
|------|-----------|
| Bronze | 1.0x |
| Silver | 1.2x |
| Gold | 1.5x |
| Platinum | 2.0x |
| Diamond | 2.5x |
| Legendary | 3.0x |

### VIP Multipliers

| VIP Level | Multiplier |
|-----------|-----------|
| 1 | 1.2x |
| 2 | 1.4x |
| 3 | 1.7x |
| 4 | 2.0x |
| 5 | 2.5x |

### Country Multipliers

| Country | Multiplier |
|---------|-----------|
| US | 1.5x |
| GB | 1.3x |
| DE | 1.2x |
| FR | 1.2x |
| CA | 1.3x |
| AU | 1.3x |
| Others | 1.0x |

### Streak Multipliers

| Streak Days | Multiplier |
|-------------|-----------|
| 0-6 | 1.0x |
| 7-13 | 1.0x |
| 14-29 | 1.1x |
| 30-59 | 1.2x |
| 60-99 | 1.3x |
| 100-364 | 1.5x |
| 365+ | 2.0x |

## Anti-Fraud System

### Fraud Score Calculation

The system calculates a fraud score based on multiple factors:

- **High Earnings, Low Tasks**: +0.2 (earned >10k FC, tasks <100)
- **Rapid Actions**: +0.3 (>10 actions/minute)
- **Missing Device Fingerprint**: +0.1
- **Suspicious IP**: Variable

### Risk Levels

| Score | Risk Level | Action |
|-------|-----------|--------|
| 0.0-0.3 | Low | No action |
| 0.3-0.5 | Medium | Monitor |
| 0.5-0.7 | High | Reduce rewards |
| 0.7+ | Critical | Block action |

### Adjustments

- **Anti-Fraud Reduction**: 0% to 90% based on fraud score
- **Daily Limit Reduction**: Applied when approaching limits
- **Campaign Limit Reduction**: Applied when campaign limit reached
- **Max Total Reduction**: 90% (prevents complete reward elimination)

## Database Integration

### Remote Config

All configuration values can be overridden via the `remote_configs` table:

```sql
INSERT INTO remote_configs (key, value, is_active)
VALUES ('economy.baseAdReward', 15, true);
```

### Configuration Keys

- `economy.baseAdReward`
- `economy.baseSurveyReward`
- `economy.baseOfferwallReward`
- `economy.baseAppInstallReward`
- `economy.baseReferralReward`
- `economy.baseDailyBonus`
- `economy.baseMissionReward`
- `economy.baseEventReward`
- `economy.defaultMaxEnergy`
- `economy.defaultRechargeSpeed`
- `economy.defaultRechargeInterval`
- `economy.dailyAdLimit`
- `economy.dailySurveyLimit`
- `economy.dailyOfferwallLimit`
- `economy.dailyAppInstallLimit`
- `economy.dailyReferralLimit`
- `economy.fraudScoreThreshold`
- `economy.antiFraudReductionRate`
- `economy.duplicateActionWindow`
- `economy.referralEnergyBonus`
- `economy.missionEnergyBonus`
- `economy.vipEnergyBonus`

## Performance Considerations

### Caching

- Configuration is cached in memory
- Remote config updates trigger cache refresh
- User context is passed as parameter (no DB queries)

### Scalability

- Pure business logic (no I/O)
- Stateless design
- Can be deployed as serverless functions
- Supports 10+ million users

## Testing

Run unit tests:

```bash
npm test
```

Run with coverage:

```bash
npm run test:coverage
```

## Production Deployment

### Environment Variables

```env
ECONOMY_CONFIG_SOURCE=remote  # 'default' or 'remote'
REMOTE_CONFIG_REFRESH_INTERVAL=300  # seconds
```

### Monitoring

Monitor these metrics:

- Reward calculation time (target: <10ms)
- Validation time (target: <5ms)
- Configuration refresh time (target: <100ms)
- Error rate (target: <0.1%)

## Future Enhancements

- [ ] A/B testing support for different reward strategies
- [ ] Machine learning-based fraud detection
- [ ] Dynamic difficulty adjustment
- [ ] Personalized reward optimization
- [ ] Real-time configuration updates via WebSocket