# Energy Engine

## Overview

The Energy Engine manages the user energy system in the FEE Telegram Mini App. Energy is a consumable resource that users spend to perform actions and earn FC rewards. The system provides configurable limits, recharge rates, and various bonus mechanisms.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Energy Engine                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Energy State Management                              │  │
│  │  - Current/Maximum energy                             │  │
│  │  - Time-based recharge                                │  │
│  │  - Overflow protection                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Energy Cost System                                   │  │
│  │  - Per-action costs                                   │  │
│  │  - Free actions                                        │  │
│  │  - Effective cost calculation                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Bonus System                                         │  │
│  │  - Referral bonus                                     │  │
│  │  - Mission bonus                                      │  │
│  │  - VIP bonus                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Concepts

### Energy State

Every user has an energy state consisting of:

- **Current Energy**: Available energy to spend
- **Maximum Energy**: Upper limit of energy
- **Recharge Speed**: Amount of energy restored per recharge
- **Recharge Interval**: Minutes between automatic recharges
- **Last Recharge**: Timestamp of last recharge
- **Next Recharge**: Timestamp of next scheduled recharge
- **Is Full**: Boolean indicating if energy is at maximum

### Energy Flow

```
User Action → Check Energy → Consume Energy → Perform Action
                ↓
            Insufficient → Show "Not Enough Energy" → Wait for Recharge
                ↓
            Free Action → Skip Energy Check → Perform Action
```

## Configuration

### Default Values

```typescript
{
  defaultMaxEnergy: 1000,
  defaultRechargeSpeed: 10,
  defaultRechargeInterval: 5, // minutes
  energyCosts: {
    ad_view: 0,        // Free
    survey: 50,
    offerwall: 25,
    app_install: 100,
    referral: 0,       // Free
    daily_bonus: 0,    // Free
    mission: 30,
    event: 20
  },
  referralEnergyBonus: 50,
  missionEnergyBonus: 25,
  vipEnergyBonus: 100
}
```

### Remote Configuration

All values can be overridden via the `remote_configs` table:

```sql
-- Change maximum energy
INSERT INTO remote_configs (key, value, is_active)
VALUES ('economy.defaultMaxEnergy', 1500, true);

-- Change recharge speed
INSERT INTO remote_configs (key, value, is_active)
VALUES ('economy.defaultRechargeSpeed', 15, true);

-- Change energy cost for surveys
INSERT INTO remote_configs (key, value, is_active)
VALUES ('economy.energyCosts.survey', 75, true);
```

## API Reference

### EnergyEngine

#### Methods

##### `getEnergyState(user: UserContext): EnergyState`

Returns the current energy state for a user, including calculated recharge.

```typescript
const state = engine.getEnergyState(user);
// {
//   current: 850,
//   maximum: 1000,
//   rechargeSpeed: 10,
//   rechargeInterval: 5,
//   lastRechargeAt: '2024-01-01T10:00:00Z',
//   nextRechargeAt: '2024-01-01T10:05:00Z',
//   isFull: false
// }
```

##### `hasEnoughEnergy(user: UserContext, action: string): boolean`

Checks if user has sufficient energy for an action.

```typescript
const canPerform = engine.hasEnoughEnergy(user, 'survey');
// true if user.energy >= 50
```

##### `consumeEnergy(user: UserContext, action: string): ValidationResult`

Validates and returns energy consumption details.

```typescript
const result = engine.consumeEnergy(user, 'survey');
// {
//   isValid: true,
//   errors: [],
//   warnings: [],
//   metadata: {
//     cost: 50,
//     remaining: 450
//   }
// }
```

##### `addEnergy(user: UserContext, amount: number, reason: string): { newEnergy: number; overflow: number }`

Adds energy to user with overflow protection.

```typescript
const result = engine.addEnergy(user, 100, 'referral_bonus');
// {
//   newEnergy: 1000,  // Capped at maximum
//   overflow: 50      // Excess energy
// }
```

##### `applyReferralBonus(user: UserContext): number`

Applies referral energy bonus.

```typescript
const newEnergy = engine.applyReferralBonus(user);
// Returns new energy value after bonus
```

##### `applyMissionBonus(user: UserContext): number`

Applies mission energy bonus.

```typescript
const newEnergy = engine.applyMissionBonus(user);
// Returns new energy value after bonus
```

##### `applyVipBonus(user: UserContext): number`

Applies VIP energy bonus (only for VIP users).

```typescript
const newEnergy = engine.applyVipBonus(user);
// Returns new energy value after bonus
```

##### `calculateEffectiveCost(user: UserContext, action: string): number`

Calculates effective energy cost after applying discounts.

```typescript
const cost = engine.calculateEffectiveCost(user, 'survey');
// Base cost (50) - VIP discount (5) - Streak discount (2.5) = 42.5
```

##### `getEnergyStatus(user: UserContext): EnergyStatus`

Returns formatted energy status for UI.

```typescript
const status = engine.getEnergyStatus(user);
// {
//   current: 850,
//   maximum: 1000,
//   percentage: 85,
//   isFull: false,
//   timeToFull: 15 // minutes
// }
```

##### `validateEnergyAction(user: UserContext, action: string): ValidationResult`

Validates if user can perform an energy-consuming action.

```typescript
const result = engine.validateEnergyAction(user, 'survey');
// {
//   isValid: true,
//   errors: [],
//   warnings: [],
//   metadata: {
//     cost: 50,
//     current: 850,
//     timeToNextRecharge: 0
//   }
// }
```

## Energy Recharge System

### Recharge Calculation

Energy recharges automatically based on time:

```
Current Energy = min(
  Current Energy + (Intervals Passed × Recharge Speed),
  Maximum Energy
)
```

### Recharge Interval

- Default: 5 minutes
- Configurable via `defaultRechargeInterval`
- Stored in `nextRechargeAt` timestamp

### Example Recharge Flow

```
Time 0:   Energy = 500, Last Recharge = 10:00
Time 5:   Energy = 510 (500 + 10), Next Recharge = 10:05
Time 10:  Energy = 520 (510 + 10), Next Recharge = 10:10
Time 15:  Energy = 530 (520 + 10), Next Recharge = 10:15
...
Time 50:  Energy = 700 (500 + 20 intervals × 10), Next Recharge = 10:50
Time 100: Energy = 1000 (capped at max), Is Full = true
```

## Bonus System

### Referral Bonus

- **Amount**: 50 energy (configurable)
- **Trigger**: When user successfully refers a friend
- **Conditions**: Referee must complete verification
- **Overflow**: Excess energy is lost (not stored)

### Mission Bonus

- **Amount**: 25 energy (configurable)
- **Trigger**: When user completes a mission
- **Conditions**: Mission must be completed successfully
- **Stackable**: Can be combined with other bonuses

### VIP Bonus

- **Amount**: 100 energy (configurable)
- **Trigger**: Automatic for VIP users
- **Frequency**: Typically daily or weekly
- **Conditions**: User must maintain VIP status

### Bonus Stacking

Bonuses can be combined:

```typescript
// User completes mission and has VIP
const afterMission = engine.applyMissionBonus(user);
const afterVip = engine.applyVipBonus(afterMission);
// Total bonus: 25 + 100 = 125 energy
```

## Cost Calculation

### Base Costs

Each action has a base energy cost defined in `energyCosts`:

```typescript
{
  ad_view: 0,        // Free - incentivizes ad watching
  survey: 50,        // Moderate - surveys require effort
  offerwall: 25,     // Low - encourage offerwall usage
  app_install: 100,  // High - app installs are valuable
  referral: 0,       // Free - incentivize referrals
  daily_bonus: 0,    // Free - encourage daily login
  mission: 30,       // Low-Moderate - encourage mission completion
  event: 20          // Low - encourage event participation
}
```

### Effective Cost Calculation

Effective cost can be reduced by bonuses:

```typescript
Base Cost: 50 (survey)
VIP Discount: 10% = 5
Streak Discount: 5% = 2.5
Effective Cost: 50 - 5 - 2.5 = 42.5
```

### Free Actions

Actions with 0 energy cost bypass energy validation:

```typescript
const result = engine.consumeEnergy(user, 'ad_view');
// {
//   isValid: true,
//   metadata: { isFree: true }
// }
```

## Validation

### Energy Validation

Every energy-consuming action must pass validation:

1. **Check if action is free**: Skip validation if cost = 0
2. **Check current energy**: Ensure user has enough energy
3. **Return validation result**: Include remaining energy

### Validation Result

```typescript
{
  isValid: boolean,
  errors: string[],
  warnings: string[],
  metadata: {
    cost: number,
    available: number,
    sufficient: boolean,
    timeToNextRecharge?: number
  }
}
```

## Edge Cases

### Overflow Protection

Energy cannot exceed maximum:

```typescript
user.energy = 950;
engine.addEnergy(user, 100, 'bonus');
// Result: newEnergy = 1000 (capped), overflow = 50
```

### Negative Energy

Energy cannot be negative:

```typescript
user.energy = 10;
engine.consumeEnergy(user, 'survey'); // costs 50
// Result: isValid = false, error = "Insufficient energy"
```

### Time Travel

If user's last active time is in the future:

```typescript
user.lastActiveAt = new Date(Date.now() + 1000000).toISOString();
const state = engine.getEnergyState(user);
// Result: No recharge applied (future timestamp)
```

### Zero Recharge Speed

If recharge speed is 0:

```typescript
config.defaultRechargeSpeed = 0;
const state = engine.getEnergyState(user);
// Result: Energy stays at current level, no recharge
```

## Performance Considerations

### Caching

- Energy state is calculated on-demand (no DB queries)
- Recharge calculations are O(1)
- Suitable for high-frequency calls

### Scalability

- Pure business logic (no I/O)
- Stateless design
- Can be deployed as serverless functions
- Supports 10+ million users

## Testing

### Unit Tests

```typescript
describe('EnergyEngine', () => {
  it('should recharge energy over time', () => {
    const engine = new EnergyEngine(config);
    const user = { energy: 500, maxEnergy: 1000, lastActiveAt: '10:00' };
    
    // Simulate 10 minutes passing
    jest.advanceTimersByTime(10 * 60 * 1000);
    
    const state = engine.getEnergyState(user);
    expect(state.current).toBe(600); // 500 + 10
  });

  it('should cap energy at maximum', () => {
    const engine = new EnergyEngine(config);
    const user = { energy: 990, maxEnergy: 1000, lastActiveAt: '10:00' };
    
    const result = engine.addEnergy(user, 50, 'bonus');
    expect(result.newEnergy).toBe(1000);
    expect(result.overflow).toBe(40);
  });

  it('should reject insufficient energy', () => {
    const engine = new EnergyEngine(config);
    const user = { energy: 10, maxEnergy: 1000, lastActiveAt: '10:00' };
    
    const result = engine.consumeEnergy(user, 'survey');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Insufficient energy');
  });
});
```

## Monitoring

### Key Metrics

- **Energy Calculation Time**: Target <5ms
- **Recharge Accuracy**: Must be exact to the minute
- **Bonus Application Success Rate**: Target >99.9%
- **Validation Error Rate**: Target <0.1%

### Alerts

- Energy calculation time >10ms
- Recharge calculation errors
- Bonus application failures
- Validation error rate spike

## Future Enhancements

- [ ] Energy boosters (temporary multipliers)
- [ ] Energy gifting between users
- [ ] Energy trading marketplace
- [ ] Dynamic energy costs based on demand
- [ ] Energy recovery accelerators
- [ ] Team energy sharing