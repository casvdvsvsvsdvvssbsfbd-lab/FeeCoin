# Business Rules

## Overview

This document defines the complete business rules for the FEE Telegram Mini App economy system. These rules govern how FC (FEE Coin) is earned, spent, and managed. All rules are enforced by the Core Business Engine and are configurable via the database.

## Table of Contents

1. [FC Earning Rules](#fc-earning-rules)
2. [Energy Rules](#energy-rules)
3. [Withdrawal Rules](#withdrawal-rules)
4. [Anti-Fraud Rules](#anti-fraud-rules)
5. [Multiplier Rules](#multiplier-rules)
6. [Validation Rules](#validation-rules)
7. [Security Rules](#security-rules)
8. [Edge Cases](#edge-cases)

---

## FC Earning Rules

### General Principles

1. **Legitimacy First**: FC is only awarded for legitimate, verified actions
2. **No Time-Based Earning**: FC cannot be earned passively over time
3. **Action-Based Only**: Every FC must be tied to a specific user action
4. **Immutable Ledger**: All FC transactions are recorded in `fc_ledger`
5. **Reversibility**: Fraudulent FC can be reversed with audit trail

### Reward Sources and Base Amounts

| Action | Base FC | Energy Cost | Daily Limit |
|--------|---------|-------------|-------------|
| Ad View | 10 FC | 0 | 50 |
| Survey | 50 FC | 50 | 10 |
| Offerwall | 25 FC | 25 | 20 |
| App Install | 100 FC | 100 | 5 |
| Referral | 75 FC | 0 | 10 |
| Daily Bonus | 5 FC | 0 | 1 |
| Mission | 30 FC | 30 | Unlimited |
| Event | 40 FC | 20 | Unlimited |

### Reward Calculation Formula

```
Final FC = Base FC × Total Multiplier × (1 - Total Adjustments)
```

Where:
- **Total Multiplier** = Level × Rank × VIP × Country × Campaign × Streak
- **Total Adjustments** = Anti-Fraud + Daily Limit + Campaign Limit + Fraud Score
- **Max Total Adjustment** = 90% (prevents complete elimination)

### Multiplier Application Rules

1. **Multipliers stack multiplicatively**: 1.5 × 1.2 × 1.3 = 2.34
2. **Minimum multiplier**: 1.0 (no reduction below base)
3. **Maximum multiplier**: No hard limit (configurable)
4. **All multipliers are optional**: Missing multiplier = 1.0

### Adjustment Rules

1. **Anti-Fraud Reduction**: 0% to 90% based on fraud score
2. **Daily Limit Reduction**: Applied when approaching limit (>90%)
3. **Campaign Limit Reduction**: Applied when campaign limit reached
4. **Fraud Score Reduction**: Applied when score exceeds threshold
5. **Max Total Reduction**: 90% (ensures minimum reward)

### FC Distribution Rules

1. **Immediate Credit**: FC is credited immediately after validation
2. **Pending Period**: High-value rewards may have 24-hour pending period
3. **Reversal Window**: FC can be reversed within 7 days if fraud detected
4. **Finality**: After 7 days, FC becomes permanent (unless fraud proven)

---

## Energy Rules

### Energy State

Every user has an energy state with the following properties:

- **Current Energy**: Available energy (0 to Maximum)
- **Maximum Energy**: Upper limit (default: 1000)
- **Recharge Speed**: Energy per recharge (default: 10)
- **Recharge Interval**: Minutes between recharges (default: 5)
- **Last Recharge**: Timestamp of last recharge
- **Next Recharge**: Timestamp of next scheduled recharge

### Energy Recharge Rules

1. **Automatic Recharge**: Energy recharges automatically over time
2. **Recharge Calculation**: `Current + (Intervals Passed × Recharge Speed)`
3. **Maximum Cap**: Energy cannot exceed Maximum
4. **Overflow Protection**: Excess energy is lost (not stored)
5. **Time-Based Only**: No other way to increase energy except bonuses

### Energy Cost Rules

1. **Free Actions**: Some actions have 0 energy cost (ad_view, referral, daily_bonus)
2. **Paid Actions**: Most actions require energy (survey: 50, offerwall: 25, etc.)
3. **Pre-Check**: Energy is checked before action execution
4. **Post-Consumption**: Energy is deducted after successful action
5. **No Refund**: Energy is not refunded if action fails

### Energy Bonus Rules

1. **Referral Bonus**: +50 energy when referee completes verification
2. **Mission Bonus**: +25 energy when mission is completed
3. **VIP Bonus**: +100 energy for VIP users (frequency configurable)
4. **Stackable**: Bonuses can be combined
5. **Overflow Protected**: Bonuses cannot exceed maximum energy

### Energy Validation Rules

1. **Free Actions**: Skip energy check if cost = 0
2. **Sufficient Energy**: User must have ≥ cost energy
3. **Error Message**: Clear message if insufficient energy
4. **Time to Recharge**: Show time until next recharge
5. **No Negative Energy**: Energy cannot go below 0

---

## Withdrawal Rules

### Progress Calculation Rules

1. **Only Legitimate FC Counts**: Pending/reversed/fraud FC excluded
2. **No Time-Based Progress**: Progress only increases with FC earnings
3. **Immutable Ledger**: All FC must be recorded in `fc_ledger`
4. **Real-Time Calculation**: Progress is calculated on-demand
5. **Caching Allowed**: Can be cached with short TTL (5 minutes)

### Milestone System

| Milestone | Progress | FC Required | Benefits |
|-----------|----------|-------------|----------|
| Bronze | 25% | 1,000 FC | Basic withdrawal eligibility |
| Silver | 50% | 2,500 FC | Reduced withdrawal fee |
| Gold | 75% | 5,000 FC | Priority processing |
| Platinum | 100% | 10,000 FC | Full access, no fees |

### Withdrawal Eligibility Rules

1. **100% Progress Required**: User must reach Platinum milestone
2. **No Pending Withdrawals**: Cannot have pending withdrawals
3. **Active Account**: Account must be active (not suspended/banned)
4. **KYC Verified**: User must complete KYC (if applicable)
5. **Withdrawal Limits**: Maximum 50% of balance per withdrawal

### Withdrawal Processing Rules

1. **Processing Time**: 24-48 hours for standard, 12 hours for Gold+
2. **Fee Structure**: 
   - Bronze: 10% fee
   - Silver: 5% fee
   - Gold: 2% fee
   - Platinum: 0% fee
3. **Minimum Amount**: 100 FC minimum withdrawal
4. **Maximum Amount**: 10,000 FC per withdrawal
5. **Daily Limit**: 1 withdrawal per day

### Progress Reversal Rules

1. **Fraud Detection**: FC from fraud is removed, progress decreases
2. **Reversal Window**: 7 days to detect and reverse fraud
3. **Audit Trail**: All reversals are logged with reason
4. **User Notification**: User is notified of FC reversal
5. **Appeal Process**: User can appeal reversal within 7 days

---

## Anti-Fraud Rules

### Fraud Score Calculation

Fraud score is calculated based on multiple factors:

| Factor | Score | Description |
|--------|-------|-------------|
| High Earnings, Low Tasks | +0.2 | Earned >10k FC, tasks <100 |
| Rapid Actions | +0.3 | >10 actions per minute |
| Missing Device Fingerprint | +0.1 | No device fingerprint provided |
| Suspicious IP | +0.2 | IP from known bad list |
| Bot-Like Behavior | +0.3 | Session <5 seconds |
| Duplicate Action | +0.4 | Same action within 60 minutes |
| VPN/Proxy Detected | +0.3 | Using VPN or proxy |

### Risk Levels

| Score | Risk Level | Action |
|-------|-----------|--------|
| 0.0 - 0.3 | Low | No action |
| 0.3 - 0.5 | Medium | Monitor, reduce rewards by 10% |
| 0.5 - 0.7 | High | Reduce rewards by 50%, flag account |
| 0.7+ | Critical | Block action, review account |

### Anti-Fraud Measures

1. **Device Fingerprinting**: Required for all actions
2. **IP Tracking**: All actions logged with IP address
3. **Session Monitoring**: Track session duration and patterns
4. **Duplicate Detection**: Prevent same action within 60 minutes
5. **Rate Limiting**: Max 10 actions per minute
6. **Behavioral Analysis**: Detect bot-like patterns
7. **Machine Learning**: AI-based fraud detection (future)

### Fraud Consequences

1. **Reward Reduction**: 0% to 90% reduction based on score
2. **Action Blocking**: High-risk actions are blocked
3. **Account Review**: Critical risk triggers account review
4. **FC Reversal**: Fraudulent FC is reversed
5. **Account Ban**: Repeat offenses result in ban

### Fraud Detection Triggers

- Sudden spike in earnings
- Unusual action patterns
- Multiple accounts from same device
- VPN/Proxy usage
- Device fingerprint mismatch
- IP address from high-risk country
- Rapid successive actions

---

## Multiplier Rules

### Level Multipliers

| Level | Multiplier | XP Required |
|-------|-----------|-------------|
| 1 | 1.0x | 0 |
| 2 | 1.1x | 100 |
| 3 | 1.2x | 300 |
| 4 | 1.3x | 600 |
| 5 | 1.5x | 1000 |
| 10 | 2.0x | 5000 |
| 15 | 2.5x | 15000 |
| 20 | 3.0x | 30000 |
| 25 | 3.5x | 50000 |
| 30 | 4.0x | 75000 |
| 50 | 5.0x | 200000 |
| 100 | 10.0x | 1000000 |

### Rank Multipliers

| Rank | Multiplier | Requirements |
|------|-----------|--------------|
| Bronze | 1.0x | Default |
| Silver | 1.2x | 1,000 FC earned |
| Gold | 1.5x | 5,000 FC earned |
| Platinum | 2.0x | 10,000 FC earned |
| Diamond | 2.5x | 50,000 FC earned |
| Legendary | 3.0x | 100,000 FC earned |

### VIP Multipliers

| VIP Level | Multiplier | Requirements |
|-----------|-----------|--------------|
| None | 1.0x | Default |
| VIP 1 | 1.2x | Monthly subscription |
| VIP 2 | 1.4x | Quarterly subscription |
| VIP 3 | 1.7x | Semi-annual subscription |
| VIP 4 | 2.0x | Annual subscription |
| VIP 5 | 2.5x | Lifetime subscription |

### Country Multipliers

| Country | Multiplier | Reason |
|---------|-----------|--------|
| US | 1.5x | High ad revenue |
| GB | 1.3x | High ad revenue |
| DE | 1.2x | High ad revenue |
| FR | 1.2x | High ad revenue |
| CA | 1.3x | High ad revenue |
| AU | 1.3x | High ad revenue |
| Others | 1.0x | Standard rate |

### Streak Multipliers

| Streak Days | Multiplier | Bonus |
|-------------|-----------|-------|
| 0-6 | 1.0x | None |
| 7-13 | 1.0x | None |
| 14-29 | 1.1x | +10% |
| 30-59 | 1.2x | +20% |
| 60-99 | 1.3x | +30% |
| 100-364 | 1.5x | +50% |
| 365+ | 2.0x | +100% |

### Campaign Multipliers

- **Temporary**: Campaigns have start and end dates
- **Stackable**: Can combine with other multipliers
- **Configurable**: Set via remote config
- **Targeted**: Can target specific user segments
- **Limited**: May have usage limits

---

## Validation Rules

### Pre-Action Validation

Every action must pass validation before FC is awarded:

1. **User Status**: User must be active
2. **Duplicate Check**: Action not performed within duplicate window
3. **Daily Limit**: User has not exceeded daily limit
4. **Campaign Limit**: User has not exceeded campaign limit
5. **Fraud Score**: User's fraud score is below threshold
6. **Energy Check**: User has sufficient energy (if applicable)
7. **Spam Check**: Action is not spam/bot-like

### Post-Action Validation

After action completion:

1. **Completion Verification**: Action was actually completed
2. **Quality Check**: Action met quality standards
3. **Fraud Re-Check**: Re-check fraud score after action
4. **Duplicate Re-Check**: Ensure no duplicates
5. **FC Calculation**: Calculate final FC with all multipliers

### Validation Failure Handling

1. **Error Message**: Clear, user-friendly error message
2. **Retry Allowed**: User can retry after fixing issue
3. **Logging**: All validation failures are logged
4. **Monitoring**: Track validation failure rates
5. **Alerting**: Alert on unusual failure patterns

---

## Security Rules

### Data Protection

1. **Encryption**: All sensitive data encrypted at rest and in transit
2. **Access Control**: Role-based access to all data
3. **Audit Trail**: All data access is logged
4. **Data Retention**: FC ledger retained for 7 years
5. **Privacy**: User data protected per GDPR/privacy laws

### FC Ledger Integrity

1. **Immutable**: FC ledger entries cannot be modified
2. **Append-Only**: New entries only, no updates/deletes
3. **Balanced**: Each entry has balance_before and balance_after
4. **Verified**: Balance calculations are validated by triggers
5. **Audited**: All entries are auditable

### Anti-Manipulation

1. **No Backdating**: Timestamps cannot be in the past
2. **No Cloning**: Same action cannot be counted twice
3. **No Inflation**: FC cannot be created from nothing
4. **No External Transfers**: FC cannot be transferred between users
5. **No Admin Favoritism**: All admin actions are audited

### System Security

1. **Rate Limiting**: API endpoints are rate-limited
2. **DDoS Protection**: System protected against DDoS
3. **SQL Injection**: All queries are parameterized
4. **XSS Protection**: All user input is sanitized
5. **CSRF Protection**: All forms have CSRF tokens

---

## Edge Cases

### Negative FC Balance

**Rule**: FC balance cannot be negative

**Handling**: 
- Prevent actions that would result in negative balance
- Show error message: "Insufficient FC balance"
- Log attempt for monitoring

### Energy Overflow

**Rule**: Energy cannot exceed maximum

**Handling**:
- Cap energy at maximum
- Discard overflow (do not store)
- Log overflow event

### Time Zone Differences

**Rule**: Daily limits reset at UTC midnight

**Handling**:
- All timestamps stored in UTC
- Daily limits calculated based on UTC date
- User sees local time, system uses UTC

### Concurrent Actions

**Rule**: Prevent race conditions in FC calculation

**Handling**:
- Database transactions with row locking
- Optimistic concurrency control
- Retry logic for conflicts

### System Maintenance

**Rule**: System must handle maintenance windows

**Handling**:
- Scheduled maintenance announced 24 hours in advance
- Maintenance mode prevents new actions
- Existing actions complete before maintenance
- FC calculations paused during maintenance

### Database Failures

**Rule**: System must handle database failures gracefully

**Handling**:
- Circuit breaker pattern for DB calls
- Fallback to cached values
- Queue actions for retry
- Alert on DB failures

### Network Issues

**Rule**: System must handle network issues

**Handling**:
- Retry logic with exponential backoff
- Offline mode for read operations
- Queue write operations for retry
- Show user-friendly error messages

---

## Compliance Rules

### Legal Compliance

1. **KYC/AML**: Comply with KYC/AML regulations where applicable
2. **Tax Reporting**: Report earnings to tax authorities as required
3. **Age Verification**: Ensure users are of legal age
4. **Terms of Service**: All users must accept TOS
5. **Privacy Policy**: All users must accept privacy policy

### Financial Compliance

1. **Transaction Limits**: Comply with financial regulations
2. **Withdrawal Limits**: Comply with anti-money laundering laws
3. **Identity Verification**: Verify identity for large withdrawals
4. **Suspicious Activity**: Report suspicious activity to authorities
5. **Record Keeping**: Maintain transaction records for 7 years

### Platform Compliance

1. **Telegram TOS**: Comply with Telegram Terms of Service
2. **App Store Rules**: Comply with Apple/Google Play rules
3. **Ad Network Rules**: Comply with ad network terms
4. **Survey Provider Rules**: Comply with survey provider terms
5. **Offerwall Rules**: Comply with offerwall provider terms

---

## Monitoring and Alerts

### Key Performance Indicators

- **Reward Calculation Time**: Target <10ms
- **Validation Time**: Target <5ms
- **Energy Calculation Time**: Target <5ms
- **Database Query Time**: Target <50ms
- **Error Rate**: Target <0.1%
- **Fraud Detection Rate**: Track false positives/negatives

### Alert Thresholds

- **High Error Rate**: >1% errors in 5 minutes
- **Slow Calculations**: >100ms average in 5 minutes
- **Fraud Spike**: >10% fraud rate in 1 hour
- **DB Connection Failures**: Any failure
- **Unusual FC Distribution**: >3σ from mean

### Monitoring Dashboards

1. **Real-Time Dashboard**: Current system status
2. **Historical Dashboard**: Trends over time
3. **User Dashboard**: Per-user metrics
4. **Fraud Dashboard**: Fraud detection metrics
5. **Financial Dashboard**: FC flow and balances

---

## Change Management

### Configuration Changes

1. **Remote Config**: Changes via database take effect immediately
2. **Code Changes**: Require deployment and testing
3. **Rollback Plan**: All changes have rollback plan
4. **Testing**: Changes tested in staging first
5. **Monitoring**: Changes monitored for 24 hours

### Business Rule Changes

1. **Documentation**: All changes documented
2. **Approval**: Changes require approval from stakeholders
3. **Communication**: Users notified of major changes
4. **Grace Period**: 7-day grace period for changes
5. **Audit Trail**: All changes are audited

---

## Version History

- **v1.0** (2024-01-01): Initial business rules
- **v1.1** (2024-02-01): Added energy system
- **v1.2** (2024-03-01): Added withdrawal progress engine
- **v1.3** (2024-04-01): Enhanced anti-fraud measures

---

## Contact

For questions or clarifications about these business rules, contact the FEE development team.