# FEE Database - Supabase Production Setup

## Overview

Production-ready PostgreSQL database schema for FEE Telegram Mini App, designed to scale to 10+ million users.

## Structure

```
supabase/
├── migrations/
│   ├── 20250101000000_initial_schema.sql    # Core schema (45 tables)
│   ├── 20250101000001_add_levels_ranks.sql  # Level & rank configuration
│   └── 20250101000002_performance_optimization.sql  # Performance & partitioning
├── seed/
│   └── 001_initial_data.sql                 # Reference data & sample content
└── README.md                                 # This file
```

## Quick Start

### 1. Prerequisites

- Supabase CLI installed: `npm install -g supabase`
- Supabase project created
- PostgreSQL 15+ (Supabase managed)

### 2. Initialize Supabase

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Or initialize locally
supabase init
```

### 3. Apply Migrations

```bash
# Apply all migrations in order
supabase db push

# Or apply manually via Supabase Dashboard
# Go to: SQL Editor → New Query → Paste migration → Run
```

### 4. Seed Initial Data

```bash
# Via Supabase CLI
supabase db seed

# Or manually via Dashboard
# Go to: SQL Editor → New Query → Paste seed/001_initial_data.sql → Run
```

### 5. Generate TypeScript Types

```bash
# Generate types from your Supabase project
supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/supabase.ts

# Or use the provided types
# src/types/database.ts contains comprehensive type definitions
```

## Database Schema

### Core Tables (15)
- **users** - User authentication & identification
- **profiles** - Extended user information & stats
- **wallets** - User wallet balances
- **fc_ledger** - Double-entry bookkeeping for FC
- **transactions** - All FC transactions (immutable)
- **settlements** - Monthly settlement records
- **settlement_cycles** - Settlement cycle management
- **reward_pool** - Reward pool management
- **ad_views** - Ad watch records
- **ad_networks** - Ad network integrations
- **ad_rewards** - Ad reward distribution
- **surveys** - Available surveys
- **survey_history** - Survey completion history
- **offerwalls** - Offerwall integrations
- **offerwall_history** - Offerwall completion history

### Earning System (5)
- **app_installs** - App install offers
- **referral_links** - User referral links
- **referrals** - Referral relationships
- **referral_rewards** - Referral reward distribution
- **daily_bonus** - Daily bonus claims

### Progression System (7)
- **missions** - Mission definitions
- **mission_progress** - User mission progress
- **achievements** - Achievement definitions
- **badges** - Badge definitions
- **user_badges** - User earned badges
- **streaks** - User streak data
- **levels** - Level configuration (1-100)
- **ranks** - Rank configuration (Bronze to Legend)

### Events & Leaderboards (5)
- **events** - Event definitions
- **event_rewards** - Event reward distribution
- **leaderboard_daily** - Daily leaderboard snapshots
- **leaderboard_weekly** - Weekly leaderboard snapshots
- **leaderboard_monthly** - Monthly leaderboard snapshots
- **leaderboard_all_time** - All-time leaderboard

### Support & Admin (6)
- **notifications** - User notifications
- **support_tickets** - Support tickets
- **support_messages** - Support ticket messages
- **admin_users** - Admin user accounts
- **admin_actions** - Admin action audit trail
- **audit_logs** - Complete audit trail

### Security & Fraud (4)
- **fraud_detection** - Fraud detection records
- **fraud_reports** - Fraud investigation reports
- **device_sessions** - Active device sessions
- **user_devices** - User device registry

### System Tables (7)
- **countries** - Country reference data
- **languages** - Language reference data
- **feature_flags** - Feature flag management
- **remote_configs** - Remote configuration
- **app_statistics** - Daily app statistics
- **analytics_events** - Analytics event tracking
- **system_logs** - System log entries

**Total: 45 tables**

## Key Features

### Financial Integrity
- **Double-entry bookkeeping** via `fc_ledger`
- **Immutable transactions** - no updates or deletes
- **Balance verification** - triggers ensure balance consistency
- **Settlement engine** - automated monthly settlements

### Performance for 10M+ Users
- **Table partitioning** by date for large tables
- **Materialized views** for frequently accessed data
- **Composite indexes** optimized for common queries
- **JSONB GIN indexes** for flexible metadata queries
- **Partial indexes** for active records only
- **Autovacuum tuning** for high-traffic tables

### Security & Compliance
- **Row Level Security (RLS)** on all tables
- **Comprehensive audit logging** via `audit_logs`
- **Fraud detection** system with severity levels
- **Device tracking** and session management
- **GDPR compliance** - soft deletes, data retention
- **Admin RBAC** with role-based permissions

### Business Logic
- **Level & rank calculation** - automatic progression
- **Earning limits** - configurable daily limits
- **Streak system** - with freeze feature
- **Referral system** - multi-level support
- **Mission & event system** - flexible requirements
- **Achievement & badge system** - gamification

## Database Functions

### Core Functions
- `update_updated_at_column()` - Auto-update timestamps
- `update_user_stats()` - Update profile stats on transaction
- `check_fc_balance()` - Verify sufficient balance
- `distribute_reward()` - Safe FC distribution with limits
- `deduct_fc()` - Safe FC deduction with balance check
- `calculate_user_level()` - Calculate level from XP
- `get_user_rank()` - Calculate rank from total earned
- `check_earning_limit()` - Verify daily earning limits
- `refresh_materialized_views()` - Refresh all materialized views
- `cleanup_expired_sessions()` - Clean up old sessions
- `update_leaderboard_ranks()` - Recalculate leaderboard ranks

## Indexes

### Performance Indexes (100+)
- B-tree indexes for equality and range queries
- Composite indexes for common query patterns
- Partial indexes for active records
- GIN indexes for JSONB and full-text search
- Expression indexes for computed values

### Key Indexes
```sql
-- Users
idx_users_telegram_id, idx_users_email, idx_users_status

-- Financial
idx_wallets_balance, idx_transactions_user_created, idx_fc_ledger_user_type_created

-- Leaderboards
idx_leaderboard_daily_rank, idx_leaderboard_all_time_score

-- Analytics
idx_analytics_events_event_created, idx_audit_logs_created
```

## Row Level Security

### User Policies
- Users can read/update their own data
- Users can read public profiles
- Users can read leaderboards
- Users can manage their own sessions

### Admin Policies
- Admins can manage all data
- Role-based access control (RBAC)
- Audit logging for all admin actions

### Public Policies
- Read access to reference data (countries, languages)
- Read access to active content (surveys, missions, events)

## Materialized Views

### mv_user_stats
Pre-computed user statistics for fast profile loading

### mv_leaderboard_all_time
Pre-computed all-time leaderboard

### mv_daily_stats
Daily statistics for analytics dashboard

**Refresh Strategy**: Refresh hourly via cron job
```sql
SELECT refresh_materialized_views();
```

## Partitioning Strategy

### Partitioned Tables
- `transactions_partitioned` - Monthly partitions
- `fc_ledger_partitioned` - Monthly partitions
- `analytics_events_partitioned` - Monthly partitions
- `audit_logs_partitioned` - Monthly partitions

### Benefits
- Faster queries on recent data
- Easier data archival
- Better vacuum performance
- Parallel query execution

## Data Retention

### Active Data
- Users: Indefinite
- Transactions: Indefinite (immutable)
- Profiles: Indefinite

### Archived Data
- Analytics events: 1 year (hot), 7 years (cold)
- Audit logs: 7 years (compliance)
- Inactive users: 7 years (GDPR)

### Cleanup Jobs
```sql
-- Run daily
SELECT cleanup_expired_sessions();
SELECT archive_old_analytics();
```

## Backup Strategy

### Automated Backups
- **Frequency**: Daily
- **Retention**: 30 days
- **Verification**: Weekly
- **Recovery Testing**: Monthly

### Point-in-Time Recovery
- WAL archiving enabled
- 7-day PITR window
- Cross-region replication (optional)

## Monitoring

### Key Metrics
- Query performance (pg_stat_statements)
- Table bloat (pg_stat_user_tables)
- Index usage (pg_stat_user_indexes)
- Connection count (pg_stat_activity)
- Cache hit ratio (pg_statio_user_tables)

### Alerts
- Slow queries (> 1s)
- High connection count
- Low cache hit ratio (< 0.9)
- Table bloat > 20%
- Replication lag

## Deployment

### Production Checklist
- [ ] Apply all migrations
- [ ] Seed reference data
- [ ] Generate TypeScript types
- [ ] Configure RLS policies
- [ ] Set up materialized view refresh (cron)
- [ ] Configure backup schedule
- [ ] Set up monitoring & alerts
- [ ] Enable PITR
- [ ] Configure connection pooling
- [ ] Review security settings
- [ ] Test RLS policies
- [ ] Load test with expected traffic
- [ ] Document admin credentials
- [ ] Set up audit logging

### Environment Variables
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Maintenance

### Daily
- Refresh materialized views
- Clean up expired sessions
- Monitor slow queries

### Weekly
- Review audit logs
- Check table bloat
- Analyze query performance

### Monthly
- Update statistics
- Review indexes
- Archive old data
- Test backup restoration

## Troubleshooting

### Common Issues

**Slow queries on transactions table**
→ Check if partitioning is working
→ Verify indexes are being used
→ Consider additional composite indexes

**High memory usage**
→ Review materialized view sizes
→ Check for missing indexes
→ Analyze query plans

**RLS policy errors**
→ Verify auth.uid() is correct
→ Check policy conditions
→ Test with different user roles

## Support

For issues or questions:
- Documentation: [Supabase Docs](https://supabase.com/docs)
- Discord: [Supabase Discord](https://discord.supabase.com)
- Email: support@fee.app

## License

Proprietary - FEE Platform
© 2025 FEE. All rights reserved.