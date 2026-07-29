# Withdrawal Progress Engine

## Overview

The Withdrawal Progress Engine tracks user progress towards withdrawal eligibility. Unlike traditional systems where time or fake metrics increase progress, this engine ensures that progress grows ONLY when FC is legitimately earned through real user actions.

## Core Principle

**Progress = Legitimately Earned FC**

No time-based increase. No fake metrics. No manipulation.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Withdrawal Progress Engine                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Progress Calculation                                 │  │
│  │  - Tracks legitimately earned FC                      │  │
│  │  - Calculates percentage to target                    │  │
│  │  - Estimates time to reach target                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Milestone System                                     │  │
│  │  - Bronze (25%)                                       │  │
│  │  - Silver (50%)                                       │  │
│  │  - Gold (75%)                                         │  │
│  │  - Platinum (100%)                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Validation & Security                                │  │
│  │  - Prevents fake progress                             │  │
│  │  - Validates withdrawal requests                      │  │
│  │  - Tracks pending withdrawals                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## How It Works

### Progress Calculation

Progress is calculated based on legitimately earned FC:

```
Progress % = (Legitimately Earned FC / Target Amount) × 100
```

### What Counts as Legitimate FC?

Only FC earned through verified, fraud-checked actions:

- ✅ Ad views (completed, not skipped)
- ✅ Surveys (completed, not disqualified)
- ✅ Offerwalls (completed, not rejected)
- ✅ App installs (verified, not fraudulent)
- ✅ Referrals (referee verified)
- ✅ Daily bonuses (claimed)
- ✅ Missions (completed)
- ✅ Events (participated)

### What Does NOT Count?

- ❌ Pending FC (not yet confirmed)
- ❌ Fraudulent FC (reversed after fraud detection)
- ❌ Refunded FC (returned to system)
- ❌ Bonus FC from exploits (reversed)
- ❌ Admin-gifted FC (unless specified)

## Milestone System

### Milestone Tiers

| Tier | Progress | FC Required | Benefits |
|------|----------|-------------|----------|
| Bronze | 25% | 1,000 FC | Basic withdrawal eligibility |
| Silver | 50% | 2,500 FC | Reduced withdrawal fee |
| Gold | 75% | 5,000 FC | Priority processing |
| Platinum | 100% | 10,000 FC | Full access, no fees |

### Milestone Progression

```
User starts: 0 FC earned
    ↓
Earns 1,000 FC → Bronze milestone reached (25%)
    ↓
Earns 2,500 FC → Silver milestone reached (50%)
    ↓
Earns 5,000 FC → Gold milestone reached (75%)
    ↓
Earns 10,000 FC → Platinum milestone reached (100%) → Can withdraw!
```

## Configuration

### Default Thresholds

```typescript
withdrawalThresholds: [
  { percentage: 25, amount: 1000 },   // Bronze
  { percentage: 50, amount: 2500 },   // Silver
  { percentage: 75, amount: 5000 },   // Gold
  { percentage: 100, amount: 10000 }  // Platinum
]
```

### Remote Configuration

Update thresholds via database:

```sql
-- Change Bronze threshold to 1,500 FC
INSERT INTO remote_configs (key, value, is_active)
VALUES ('economy.withdrawalThresholds', 
  '[{"percentage": 25, "amount": 1500}, ...]', 
  true
);
```

## API Reference

### FCPercentageEngine

#### `calculateWithdrawalProgress(user, legitimatelyEarnedFC): WithdrawalProgress`

Calculates current withdrawal progress.

```typescript
const progress = engine.calculateWithdrawalProgress(user, 3500);

// Result:
{
  currentPercentage: 35,        // 3500/10000 = 35%
  targetPercentage: 100,        // Target is always 100%
  currentAmount: 3500,          // FC earned so far
  targetAmount: 10000,          // Total FC needed
  remainingAmount: 6500,        // FC still needed
  estimatedDays: 32,            // Days to reach target
  canWithdraw: false,           // Not yet eligible
  nextMilestone: {
    percentage: 50,             // Next milestone
    amount: 2500,               // Already achieved
    remaining: 0                // No remaining for this milestone
  }
}
```

#### `getWithdrawalMilestones(): Milestone[]`

Returns all withdrawal milestones.

```typescript
const milestones = engine.getWithdrawalMilestones();

// Result:
[
  { percentage: 25, amount: 1000, label: 'Bronze' },
  { percentage: 50, amount: 2500, label: 'Silver' },
  { percentage: 75, amount: 5000, label: 'Gold' },
  { percentage: 100, amount: 10000, label: 'Platinum' }
]
```

#### `canWithdraw(currentPercentage): boolean`

Checks if user can withdraw at current progress.

```typescript
const canWithdraw = engine.canWithdraw(100);  // true
const canWithdraw = engine.canWithdraw(99);   // false
```

#### `calculatePercentage(amount): number`

Calculates progress percentage for a given amount.

```typescript
const percentage = engine.calculatePercentage(5000);  // 50%
```

#### `getTimeProjection(currentAmount, targetAmount, averageDailyEarnings): TimeProjection`

Projects when user will reach target.

```typescript
const projection = engine.getTimeProjection(3500, 10000, 200);

// Result:
{
  daysRemaining: 32,           // (10000 - 3500) / 200 = 32.5
  dateReached: 2024-02-15,     // 32 days from now
  onTrack: false               // >30 days
}
```

#### `validateWithdrawal(currentPercentage, pendingWithdrawals): ValidationResult`

Validates if user can withdraw.

```typescript
const result = engine.validateWithdrawal(100, 0);

// Result:
{
  canWithdraw: true,
  reason: undefined
}

// If not eligible:
const result = engine.validateWithdrawal(50, 0);

// Result:
{
  canWithdraw: false,
  reason: 'Withdrawal requires 100% progress. Current: 50%'
}
```

## Progress Tracking

### FC Ledger Integration

Every legitimate FC earning is recorded in the `fc_ledger` table:

```sql
INSERT INTO fc_ledger (
  user_id,
  transaction_type,
  amount,
  balance_before,
  balance_after,
  reference_type,
  reference_id,
  description
) VALUES (
  'user-123',
  'credit',
  10,
  4990,
  5000,
  'ad_view',
  'ad-view-456',
  'Watched ad: Summer Sale'
);
```

### Calculating Legitimately Earned FC

```typescript
// Sum all legitimate FC from ledger
const legitFC = await db.fcLedger.findMany({
  where: {
    userId: 'user-123',
    transactionType: 'credit',
    // Exclude pending, reversed, or fraudulent transactions
    status: { notIn: ['pending', 'reversed', 'fraudulent'] }
  },
  select: { amount: true }
});

const totalLegitFC = legitFC.reduce((sum, t) => sum + t.amount, 0);
```

### Excluding Illegitimate FC

```typescript
// FC that does NOT count towards progress:
const excludedFC = await db.fcLedger.findMany({
  where: {
    userId: 'user-123',
    OR: [
      { status: 'pending' },
      { status: 'reversed' },
      { status: 'fraudulent' },
      { description: { contains: 'reversed' } },
      { description: { contains: 'fraud' } }
    ]
  }
});
```

## Security Measures

### Anti-Manipulation

1. **No Time-Based Progress**: Progress only increases with legitimate FC
2. **FC Ledger Verification**: All FC must be recorded in immutable ledger
3. **Fraud Checking**: FC from fraudulent actions is excluded
4. **Duplicate Prevention**: Same action cannot be counted twice
5. **Admin Oversight**: All progress changes are audited

### Fraud Detection

```typescript
// Check if FC is legitimate
function isLegitimateFC(transaction: FcLedger): boolean {
  // Must be completed
  if (transaction.status !== 'completed') return false;
  
  // Must not be reversed
  if (transaction.description?.includes('reversed')) return false;
  
  // Must not be from fraud
  if (transaction.description?.includes('fraud')) return false;
  
  // Must have valid reference
  if (!transaction.reference_type || !transaction.reference_id) return false;
  
  return true;
}
```

### Audit Trail

All progress changes are logged:

```typescript
await db.auditLogs.create({
  data: {
    userId: user.userId,
    action: 'withdrawal_progress_updated',
    resourceType: 'user_progress',
    resourceId: user.userId,
    oldValues: { progress: 35 },
    newValues: { progress: 40 },
    metadata: {
      fcAdded: 500,
      source: 'ad_view',
      referenceId: 'ad-view-789'
    }
  }
});
```

## User Experience

### Progress Display

```typescript
// Show user their progress
<div className="progress-container">
  <div className="progress-bar">
    <div 
      className="progress-fill" 
      style={{ width: `${progress.currentPercentage}%` }}
    />
  </div>
  <div className="progress-text">
    {progress.currentPercentage}% - {progress.currentAmount} / {progress.targetAmount} FC
  </div>
  <div className="milestone">
    Next: {progress.nextMilestone?.label} at {progress.nextMilestone?.percentage}%
  </div>
  <div className="eta">
    Estimated {progress.estimatedDays} days to reach target
  </div>
</div>
```

### Milestone Achievements

```typescript
// When user reaches milestone
if (progress.currentPercentage >= 25 && !user.bronzeAchieved) {
  await db.notifications.create({
    data: {
      userId: user.userId,
      type: 'achievement',
      title: 'Bronze Status Unlocked!',
      message: 'You can now withdraw your earnings',
      actionUrl: '/withdraw'
    }
  });
}
```

### Withdrawal Flow

```typescript
// User attempts withdrawal
const result = engine.validateWithdrawal(progress.currentPercentage, pendingWithdrawals);

if (result.canWithdraw) {
  // Show withdrawal form
  showWithdrawalForm();
} else {
  // Show progress and requirements
  showProgressRequirements(progress);
}
```

## Edge Cases

### FC Reversal

If FC is reversed (fraud, refund):

```typescript
// FC was earned and counted towards progress
user.legitFC = 5000;
progress = engine.calculateWithdrawalProgress(user, 5000);
// Progress: 50%

// FC is reversed due to fraud
await reverseFraudulentFC(user, 1000);

// Recalculate progress
user.legitFC = 4000;
progress = engine.calculateWithdrawalProgress(user, 4000);
// Progress: 40% (decreased!)
```

### Pending FC

Pending FC does NOT count:

```typescript
// User has pending FC
user.legitFC = 5000;
user.pendingFC = 500;

// Only legit FC counts
progress = engine.calculateWithdrawalProgress(user, user.legitFC);
// Progress: 50% (pending FC ignored)
```

### Multiple Currencies

If supporting multiple currencies:

```typescript
// Convert all to base currency
const totalFC = await convertToFC(user.allCurrencies);
progress = engine.calculateWithdrawalProgress(user, totalFC);
```

## Performance Considerations

### Caching

- Progress is calculated on-demand from FC ledger
- Can be cached with TTL (e.g., 5 minutes)
- Invalidate cache on new FC earning

### Database Queries

```typescript
// Optimized query for legit FC
const legitFC = await db.fcLedger.aggregate({
  where: {
    userId: user.userId,
    transactionType: 'credit',
    status: 'completed',
    description: { not: { contains: 'reversed' } }
  },
  _sum: { amount: true }
});
```

### Scalability

- Pure calculation (no complex logic)
- Single DB query for FC sum
- Can be cached at CDN level
- Supports 10+ million users

## Monitoring

### Key Metrics

- **Progress Calculation Time**: Target <10ms
- **FC Ledger Query Time**: Target <50ms
- **Milestone Achievement Rate**: Track conversion
- **Withdrawal Request Rate**: Track demand

### Alerts

- Progress calculation errors
- FC ledger query failures
- Unusual progress jumps (potential fraud)
- High withdrawal request volume

## Business Rules

### Withdrawal Rules

1. **Minimum Progress**: 100% required for withdrawal
2. **Pending Withdrawals**: Cannot have pending withdrawals
3. **Account Status**: Account must be active
4. **KYC Verification**: User must be verified (if applicable)
5. **Withdrawal Limits**: Maximum 50% of balance per withdrawal

### Progress Rules

1. **Only Legitimate FC**: Pending/reversed/fraud FC excluded
2. **No Time-Based Increase**: Progress only increases with FC
3. **Immutable Ledger**: All FC must be in fc_ledger
4. **Audit Trail**: All changes are logged
5. **Fraud Exclusion**: Fraudulent FC is removed

## Testing

### Unit Tests

```typescript
describe('WithdrawalProgressEngine', () => {
  it('should calculate progress correctly', () => {
    const progress = engine.calculateWithdrawalProgress(user, 5000);
    expect(progress.currentPercentage).toBe(50);
    expect(progress.canWithdraw).toBe(false);
  });

  it('should allow withdrawal at 100%', () => {
    const progress = engine.calculateWithdrawalProgress(user, 10000);
    expect(progress.canWithdraw).toBe(true);
  });

  it('should estimate days correctly', () => {
    const projection = engine.getTimeProjection(5000, 10000, 200);
    expect(projection.daysRemaining).toBe(25);
  });

  it('should validate withdrawal request', () => {
    const result = engine.validateWithdrawal(100, 0);
    expect(result.canWithdraw).toBe(true);
  });

  it('should reject withdrawal below 100%', () => {
    const result = engine.validateWithdrawal(50, 0);
    expect(result.canWithdraw).toBe(false);
    expect(result.reason).toContain('requires 100%');
  });
});
```

## Future Enhancements

- [ ] Tiered withdrawal limits based on milestones
- [ ] Dynamic withdrawal fees based on tier
- [ ] Priority processing for higher tiers
- [ ] Milestone-based rewards
- [ ] Progress boosters (limited time)
- [ ] Social sharing of achievements
- [ ] Leaderboard integration