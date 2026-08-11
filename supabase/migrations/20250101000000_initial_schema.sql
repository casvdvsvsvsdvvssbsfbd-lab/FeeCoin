-- ============================================
-- FEE Production Database Schema
-- Telegram Mini App - Complete Production Schema
-- Version: 1.0.0
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned', 'pending');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'transfer', 'withdrawal', 'refund', 'bonus', 'penalty');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'reversed');
CREATE TYPE settlement_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE ad_type AS ENUM ('video', 'banner', 'interstitial', 'native');
CREATE TYPE ad_network AS ENUM ('google_admob', 'unity_ads', 'iron_source', 'applovin', 'facebook_audience', 'custom');
CREATE TYPE survey_status AS ENUM ('available', 'in_progress', 'completed', 'disqualified', 'expired');
CREATE TYPE offerwall_type AS ENUM ('cpi', 'cpa', 'cpl', 'survey');
CREATE TYPE offerwall_status AS ENUM ('available', 'in_progress', 'completed', 'rejected', 'expired');
CREATE TYPE mission_type AS ENUM ('daily', 'weekly', 'achievement', 'special', 'referral');
CREATE TYPE mission_status AS ENUM ('active', 'completed', 'expired', 'locked');
CREATE TYPE badge_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE event_type AS ENUM ('seasonal', 'special', 'tournament', 'community');
CREATE TYPE event_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('reward', 'mission', 'achievement', 'system', 'promotion', 'referral');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_for_user', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE fraud_risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE fraud_status AS ENUM ('pending', 'investigating', 'confirmed', 'false_positive', 'resolved');
CREATE TYPE device_type AS ENUM ('mobile', 'tablet', 'desktop');
CREATE TYPE session_status AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE log_level AS ENUM ('debug', 'info', 'warning', 'error', 'critical');
CREATE TYPE leaderboard_period AS ENUM ('daily', 'weekly', 'monthly', 'all_time');

-- ============================================
-- CORE USER TABLES
-- ============================================

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id BIGINT UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status user_status DEFAULT 'active' NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    last_login_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_telegram_id CHECK (telegram_id IS NULL OR telegram_id > 0),
    CONSTRAINT valid_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$')
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    language_code VARCHAR(10) DEFAULT 'en' NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC' NOT NULL,
    country_code VARCHAR(2),
    level INTEGER DEFAULT 1 NOT NULL,
    experience_points INTEGER DEFAULT 0 NOT NULL,
    rank VARCHAR(20) DEFAULT 'bronze' NOT NULL,
    total_earned DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    total_withdrawn DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    tasks_completed INTEGER DEFAULT 0 NOT NULL,
    ads_watched INTEGER DEFAULT 0 NOT NULL,
    apps_installed INTEGER DEFAULT 0 NOT NULL,
    referrals_count INTEGER DEFAULT 0 NOT NULL,
    current_streak INTEGER DEFAULT 0 NOT NULL,
    longest_streak INTEGER DEFAULT 0 NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    show_on_leaderboard BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_level CHECK (level >= 1 AND level <= 100),
    CONSTRAINT valid_experience CHECK (experience_points >= 0),
    CONSTRAINT valid_rank CHECK (rank IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    CONSTRAINT valid_country CHECK (country_code IS NULL OR length(country_code) = 2)
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    pending_balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    withdrawable_balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    total_earned DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    total_withdrawn DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_balance CHECK (balance >= 0),
    CONSTRAINT valid_pending CHECK (pending_balance >= 0),
    CONSTRAINT valid_withdrawable CHECK (withdrawable_balance >= 0)
);

-- ============================================
-- FC LEDGER (Financial Core)
-- ============================================

CREATE TABLE IF NOT EXISTS fc_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    balance_before DECIMAL(20, 8) NOT NULL,
    balance_after DECIMAL(20, 8) NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_amount CHECK (amount <> 0),
    CONSTRAINT valid_balance_before CHECK (balance_before >= 0),
    CONSTRAINT valid_balance_after CHECK (balance_after >= 0)
);

-- Reward Pool (centralized reward management)
CREATE TABLE IF NOT EXISTS reward_pool (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    total_amount DECIMAL(20, 8) NOT NULL,
    distributed_amount DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    remaining_amount DECIMAL(20, 8) GENERATED ALWAYS AS (total_amount - distributed_amount) STORED,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_total_amount CHECK (total_amount >= 0),
    CONSTRAINT valid_distributed CHECK (distributed_amount >= 0 AND distributed_amount <= total_amount)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending' NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    fee DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    net_amount DECIMAL(20, 8) GENERATED ALWAYS AS (amount - fee) STORED,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    description TEXT,
    reference_type VARCHAR(50),
    reference_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ,
    failed_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_transaction_amount CHECK (amount <> 0),
    CONSTRAINT valid_fee CHECK (fee >= 0)
);

-- Settlement Cycles table (must be created before settlements due to FK)
CREATE TABLE IF NOT EXISTS settlement_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    total_amount DECIMAL(20, 8) NOT NULL,
    total_users INTEGER DEFAULT 0 NOT NULL,
    status settlement_status DEFAULT 'pending' NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_period CHECK (period_end > period_start),
    CONSTRAINT valid_total_amount CHECK (total_amount >= 0),
    CONSTRAINT valid_total_users CHECK (total_users >= 0)
);

-- Settlements table
CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_cycle_id UUID REFERENCES settlement_cycles(id),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    status settlement_status DEFAULT 'pending' NOT NULL,
    payment_method VARCHAR(50),
    payment_details JSONB DEFAULT '{}'::jsonb,
    transaction_id UUID REFERENCES transactions(id),
    processed_at TIMESTAMPTZ,
    failed_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_settlement_amount CHECK (amount > 0)
);

-- ============================================
-- AD REWARDS SYSTEM
-- ============================================

-- Ad Networks table
CREATE TABLE IF NOT EXISTS ad_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type ad_network NOT NULL,
    api_key TEXT,
    api_secret TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    priority INTEGER DEFAULT 0 NOT NULL,
    fill_rate DECIMAL(5, 2) DEFAULT 100,
    ecpm DECIMAL(10, 4) DEFAULT 0,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ad Views table
CREATE TABLE IF NOT EXISTS ad_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ad_network_id UUID REFERENCES ad_networks(id),
    ad_type ad_type NOT NULL,
    ad_unit_id VARCHAR(100),
    placement VARCHAR(100),
    reward_amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    watch_time INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    is_skipped BOOLEAN DEFAULT FALSE NOT NULL,
    fraud_score DECIMAL(5, 2) DEFAULT 0,
    device_fingerprint TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_watch_time CHECK (watch_time >= 0),
    CONSTRAINT valid_fraud_score CHECK (fraud_score >= 0 AND fraud_score <= 100)
);

-- Ad Rewards table
CREATE TABLE IF NOT EXISTS ad_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_view_id UUID NOT NULL REFERENCES ad_views(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_pool_id UUID REFERENCES reward_pool(id),
    amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    status transaction_status DEFAULT 'pending' NOT NULL,
    transaction_id UUID REFERENCES transactions(id),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_reward_amount CHECK (amount > 0)
);

-- ============================================
-- SURVEYS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    provider VARCHAR(100) NOT NULL,
    provider_survey_id VARCHAR(100) NOT NULL,
    reward_amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    estimated_time INTEGER DEFAULT 0,
    difficulty VARCHAR(20) DEFAULT 'medium',
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    max_completions INTEGER,
    current_completions INTEGER DEFAULT 0 NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_reward CHECK (reward_amount > 0),
    CONSTRAINT valid_estimated_time CHECK (estimated_time >= 0),
    CONSTRAINT valid_completions CHECK (current_completions >= 0 AND (max_completions IS NULL OR current_completions <= max_completions))
);

CREATE TABLE IF NOT EXISTS survey_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    status survey_status DEFAULT 'in_progress' NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    reward_amount DECIMAL(20, 8),
    currency VARCHAR(10) DEFAULT 'FC',
    provider_response_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- OFFERWALLS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS offerwalls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type offerwall_type NOT NULL,
    provider VARCHAR(100) NOT NULL,
    api_key TEXT,
    api_secret TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    priority INTEGER DEFAULT 0 NOT NULL,
    icon_url TEXT,
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS offerwall_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offerwall_id UUID NOT NULL REFERENCES offerwalls(id) ON DELETE CASCADE,
    offer_id VARCHAR(100) NOT NULL,
    offer_name VARCHAR(255) NOT NULL,
    status offerwall_status DEFAULT 'in_progress' NOT NULL,
    reward_amount DECIMAL(20, 8),
    currency VARCHAR(10) DEFAULT 'FC',
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    provider_transaction_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- APP INSTALLS
-- ============================================

CREATE TABLE IF NOT EXISTS app_installs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    app_name VARCHAR(255) NOT NULL,
    package_name VARCHAR(255),
    app_store_url TEXT,
    reward_amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    status transaction_status DEFAULT 'pending' NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    screenshot_url TEXT,
    verified_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_reward CHECK (reward_amount > 0)
);

-- ============================================
-- REFERRAL SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS referral_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(20) UNIQUE NOT NULL,
    uses_count INTEGER DEFAULT 0 NOT NULL,
    max_uses INTEGER,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_uses CHECK (uses_count >= 0 AND (max_uses IS NULL OR uses_count <= max_uses))
);

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_link_id UUID NOT NULL REFERENCES referral_links(id) ON DELETE CASCADE,
    reward_amount DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    status transaction_status DEFAULT 'pending' NOT NULL,
    referee_verified BOOLEAN DEFAULT FALSE NOT NULL,
    referee_verified_at TIMESTAMPTZ,
    reward_paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT different_users CHECK (referrer_id != referee_id)
);

CREATE TABLE IF NOT EXISTS referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_type VARCHAR(50) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    transaction_id UUID REFERENCES transactions(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_reward_amount CHECK (amount > 0)
);

-- ============================================
-- MISSIONS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type mission_type NOT NULL,
    requirements JSONB DEFAULT '{}'::jsonb NOT NULL,
    rewards JSONB DEFAULT '{}'::jsonb NOT NULL,
    difficulty INTEGER DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_repeatable BOOLEAN DEFAULT FALSE NOT NULL,
    max_completions INTEGER DEFAULT 1 NOT NULL,
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_difficulty CHECK (difficulty >= 1 AND difficulty <= 5),
    CONSTRAINT valid_max_completions CHECK (max_completions >= 1)
);

CREATE TABLE IF NOT EXISTS mission_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    progress JSONB DEFAULT '{}'::jsonb NOT NULL,
    current_value INTEGER DEFAULT 0 NOT NULL,
    target_value INTEGER NOT NULL,
    status mission_status DEFAULT 'active' NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_current_value CHECK (current_value >= 0),
    CONSTRAINT valid_target_value CHECK (target_value > 0),
    CONSTRAINT unique_user_mission UNIQUE (user_id, mission_id)
);

-- ============================================
-- GAMIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB DEFAULT '{}'::jsonb NOT NULL,
    rewards JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    rarity badge_rarity DEFAULT 'common' NOT NULL,
    criteria JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER DEFAULT 0 NOT NULL,
    longest_streak INTEGER DEFAULT 0 NOT NULL,
    last_activity_date DATE,
    freeze_available BOOLEAN DEFAULT FALSE NOT NULL,
    freeze_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_current_streak CHECK (current_streak >= 0),
    CONSTRAINT valid_longest_streak CHECK (longest_streak >= 0),
    CONSTRAINT valid_freeze_count CHECK (freeze_count >= 0)
);

CREATE TABLE IF NOT EXISTS daily_bonus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    reward_amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    claimed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_day CHECK (day_number >= 1 AND day_number <= 30),
    CONSTRAINT valid_reward CHECK (reward_amount > 0),
    CONSTRAINT unique_user_day UNIQUE (user_id, day_number)
);

-- ============================================
-- EVENTS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type event_type NOT NULL,
    status event_status DEFAULT 'upcoming' NOT NULL,
    rewards JSONB DEFAULT '{}'::jsonb NOT NULL,
    rules JSONB DEFAULT '{}'::jsonb NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    max_participants INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_event_period CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS event_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rank_position INTEGER,
    reward_amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FC' NOT NULL,
    transaction_id UUID REFERENCES transactions(id),
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_rank CHECK (rank_position IS NULL OR rank_position > 0),
    CONSTRAINT valid_reward CHECK (reward_amount >= 0),
    CONSTRAINT unique_user_event UNIQUE (event_id, user_id)
);

-- ============================================
-- LEADERBOARDS
-- ============================================

CREATE TABLE IF NOT EXISTS leaderboard_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score DECIMAL(20, 8) NOT NULL,
    rank INTEGER NOT NULL,
    period_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_score CHECK (score >= 0),
    CONSTRAINT valid_rank CHECK (rank > 0),
    CONSTRAINT unique_user_date UNIQUE (user_id, period_date)
);

CREATE TABLE IF NOT EXISTS leaderboard_weekly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score DECIMAL(20, 8) NOT NULL,
    rank INTEGER NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_score CHECK (score >= 0),
    CONSTRAINT valid_rank CHECK (rank > 0),
    CONSTRAINT valid_period CHECK (period_end > period_start),
    CONSTRAINT unique_user_week UNIQUE (user_id, period_start)
);

CREATE TABLE IF NOT EXISTS leaderboard_monthly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score DECIMAL(20, 8) NOT NULL,
    rank INTEGER NOT NULL,
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_score CHECK (score >= 0),
    CONSTRAINT valid_rank CHECK (rank > 0),
    CONSTRAINT valid_month CHECK (period_month >= 1 AND period_month <= 12),
    CONSTRAINT unique_user_month UNIQUE (user_id, period_year, period_month)
);

CREATE TABLE IF NOT EXISTS leaderboard_all_time (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    score DECIMAL(20, 8) NOT NULL,
    rank INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_score CHECK (score >= 0),
    CONSTRAINT valid_rank CHECK (rank > 0)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- SUPPORT SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status ticket_status DEFAULT 'open' NOT NULL,
    priority ticket_priority DEFAULT 'medium' NOT NULL,
    category VARCHAR(100),
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_internal BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_sender_type CHECK (sender_type IN ('user', 'support', 'system'))
);

-- ============================================
-- ADMIN SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_role CHECK (role IN ('super_admin', 'admin', 'moderator', 'support'))
);

CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- FRAUD DETECTION
-- ============================================

CREATE TABLE IF NOT EXISTS fraud_detection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    risk_level fraud_risk_level DEFAULT 'low' NOT NULL,
    status fraud_status DEFAULT 'pending' NOT NULL,
    detection_type VARCHAR(100) NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    evidence JSONB DEFAULT '{}'::jsonb NOT NULL,
    reviewed_by UUID REFERENCES admin_users(id),
    reviewed_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_risk_score CHECK (score >= 0 AND score <= 100)
);

CREATE TABLE IF NOT EXISTS fraud_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fraud_detection_id UUID NOT NULL REFERENCES fraud_detection(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    evidence JSONB DEFAULT '{}'::jsonb,
    status fraud_status DEFAULT 'pending' NOT NULL,
    reviewed_by UUID REFERENCES admin_users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- DEVICE TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    device_type device_type NOT NULL,
    device_name VARCHAR(255),
    device_model VARCHAR(255),
    os_version VARCHAR(100),
    app_version VARCHAR(50),
    is_trusted BOOLEAN DEFAULT FALSE NOT NULL,
    first_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT unique_user_device UNIQUE (user_id, device_id)
);

CREATE TABLE IF NOT EXISTS device_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    device_type device_type NOT NULL,
    device_name VARCHAR(255),
    ip_address INET NOT NULL,
    user_agent TEXT,
    location JSONB DEFAULT '{}'::jsonb,
    status session_status DEFAULT 'active' NOT NULL,
    last_active_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- ============================================
-- SYSTEM TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS countries (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_code VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    rollout_percentage INTEGER DEFAULT 0 NOT NULL,
    target_audience JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_rollout CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100)
);

CREATE TABLE IF NOT EXISTS remote_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- ANALYTICS & LOGGING
-- ============================================

CREATE TABLE IF NOT EXISTS app_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    total_users INTEGER DEFAULT 0 NOT NULL,
    active_users INTEGER DEFAULT 0 NOT NULL,
    new_users INTEGER DEFAULT 0 NOT NULL,
    total_transactions INTEGER DEFAULT 0 NOT NULL,
    total_volume DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    total_rewards DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    total_withdrawals DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    ad_views_count INTEGER DEFAULT 0 NOT NULL,
    surveys_completed INTEGER DEFAULT 0 NOT NULL,
    offerwalls_completed INTEGER DEFAULT 0 NOT NULL,
    referrals_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT unique_date UNIQUE (date),
    CONSTRAINT valid_counts CHECK (
        total_users >= 0 AND
        active_users >= 0 AND
        new_users >= 0 AND
        total_transactions >= 0 AND
        total_volume >= 0 AND
        total_rewards >= 0 AND
        total_withdrawals >= 0
    )
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name VARCHAR(255) NOT NULL,
    event_category VARCHAR(100),
    properties JSONB DEFAULT '{}'::jsonb,
    device_id VARCHAR(255),
    session_id UUID REFERENCES device_sessions(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level log_level NOT NULL,
    logger VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_rank ON profiles(rank);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country_code);

-- Wallets indexes
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- FC Ledger indexes
CREATE INDEX IF NOT EXISTS idx_fc_ledger_user_id ON fc_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_fc_ledger_type ON fc_ledger(transaction_type);
CREATE INDEX IF NOT EXISTS idx_fc_ledger_created_at ON fc_ledger(created_at);
CREATE INDEX IF NOT EXISTS idx_fc_ledger_reference ON fc_ledger(reference_type, reference_id);

-- Transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Settlements indexes
CREATE INDEX IF NOT EXISTS idx_settlements_user_id ON settlements(user_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
CREATE INDEX IF NOT EXISTS idx_settlements_cycle_id ON settlements(settlement_cycle_id);

-- Ad Views indexes
CREATE INDEX IF NOT EXISTS idx_ad_views_user_id ON ad_views(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_views_network ON ad_views(ad_network_id);
CREATE INDEX IF NOT EXISTS idx_ad_views_created_at ON ad_views(created_at);
CREATE INDEX IF NOT EXISTS idx_ad_views_completed ON ad_views(is_completed) WHERE is_completed = TRUE;

-- Survey indexes
CREATE INDEX IF NOT EXISTS idx_surveys_provider ON surveys(provider);
CREATE INDEX IF NOT EXISTS idx_surveys_active ON surveys(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_survey_history_user_id ON survey_history(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_history_status ON survey_history(status);

-- Offerwall indexes
CREATE INDEX IF NOT EXISTS idx_offerwalls_provider ON offerwalls(provider);
CREATE INDEX IF NOT EXISTS idx_offerwalls_active ON offerwalls(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_offerwall_history_user_id ON offerwall_history(user_id);
CREATE INDEX IF NOT EXISTS idx_offerwall_history_status ON offerwall_history(status);

-- Referral indexes
CREATE INDEX IF NOT EXISTS idx_referral_links_code ON referral_links(code);
CREATE INDEX IF NOT EXISTS idx_referral_links_user_id ON referral_links(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);

-- Mission indexes
CREATE INDEX IF NOT EXISTS idx_missions_type ON missions(type);
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_mission_progress_user_id ON mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_status ON mission_progress(status);

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_daily_rank ON leaderboard_daily(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_daily_date ON leaderboard_daily(period_date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_rank ON leaderboard_weekly(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_monthly_rank ON leaderboard_monthly(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_all_time_rank ON leaderboard_all_time(rank);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Support indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);

-- Fraud indexes
CREATE INDEX IF NOT EXISTS idx_fraud_detection_user_id ON fraud_detection(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_detection_status ON fraud_detection(status);
CREATE INDEX IF NOT EXISTS idx_fraud_detection_risk ON fraud_detection(risk_level);

-- Device indexes
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_user_id ON device_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_status ON device_sessions(status);
CREATE INDEX IF NOT EXISTS idx_device_sessions_expires ON device_sessions(expires_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- System logs indexes
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_surveys_title_fts ON surveys USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_notifications_message_fts ON notifications USING GIN(to_tsvector('english', title || ' ' || message));

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reward_pool_updated_at BEFORE UPDATE ON reward_pool FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON settlements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settlement_cycles_updated_at BEFORE UPDATE ON settlement_cycles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_survey_history_updated_at BEFORE UPDATE ON survey_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offerwalls_updated_at BEFORE UPDATE ON offerwalls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offerwall_history_updated_at BEFORE UPDATE ON offerwall_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_app_installs_updated_at BEFORE UPDATE ON app_installs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referral_links_updated_at BEFORE UPDATE ON referral_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mission_progress_updated_at BEFORE UPDATE ON mission_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_rewards_updated_at BEFORE UPDATE ON event_rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_daily_updated_at BEFORE UPDATE ON leaderboard_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_weekly_updated_at BEFORE UPDATE ON leaderboard_weekly FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_monthly_updated_at BEFORE UPDATE ON leaderboard_monthly FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_all_time_updated_at BEFORE UPDATE ON leaderboard_all_time FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fraud_detection_updated_at BEFORE UPDATE ON fraud_detection FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_remote_configs_updated_at BEFORE UPDATE ON remote_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_app_statistics_updated_at BEFORE UPDATE ON app_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FC Ledger integrity trigger
CREATE OR REPLACE FUNCTION fc_ledger_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Update wallet balance
    UPDATE wallets 
    SET balance = NEW.balance_after,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fc_ledger_after_insert 
    AFTER INSERT ON fc_ledger 
    FOR EACH ROW 
    EXECUTE FUNCTION fc_ledger_insert_trigger();

-- Update reward pool distributed amount
CREATE OR REPLACE FUNCTION update_reward_pool_distributed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE reward_pool
        SET distributed_amount = distributed_amount + NEW.amount
        WHERE id = NEW.reward_pool_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reward_pool_after_reward 
    AFTER UPDATE OF status ON ad_rewards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_reward_pool_distributed();

-- Auto-create profile and wallet on user creation
CREATE OR REPLACE FUNCTION create_user_extensions()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO profiles (user_id, language_code, timezone)
    VALUES (NEW.id, 'en', 'UTC')
    ON CONFLICT DO NOTHING;
    
    -- Create wallet
    INSERT INTO wallets (user_id, balance, pending_balance, withdrawable_balance)
    VALUES (NEW.id, 0, 0, 0)
    ON CONFLICT DO NOTHING;
    
    -- Create streak
    INSERT INTO streaks (user_id, current_streak, longest_streak, freeze_available)
    VALUES (NEW.id, 0, 0, FALSE)
    ON CONFLICT DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_extensions_after_insert 
    AFTER INSERT ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION create_user_extensions();

-- Update user last_active_at
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET last_active_at = NOW() 
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_last_active_after_ad_view 
    AFTER INSERT ON ad_views 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_last_active();

CREATE TRIGGER update_user_last_active_after_survey 
    AFTER INSERT ON survey_history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_last_active();

CREATE TRIGGER update_user_last_active_after_offerwall 
    AFTER INSERT ON offerwall_history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_last_active();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fc_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE offerwalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE offerwall_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_bonus ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_weekly ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_all_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE remote_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can manage users" ON users FOR ALL USING (auth.role() = 'service_role');

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Service role can manage profiles" ON profiles FOR ALL USING (auth.role() = 'service_role');

-- Wallets policies
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage wallets" ON wallets FOR ALL USING (auth.role() = 'service_role');

-- FC Ledger policies
CREATE POLICY "Users can view own ledger" ON fc_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage ledger" ON fc_ledger FOR ALL USING (auth.role() = 'service_role');

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage transactions" ON transactions FOR ALL USING (auth.role() = 'service_role');

-- Ad views policies
CREATE POLICY "Users can view own ad views" ON ad_views FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ad views" ON ad_views FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage ad views" ON ad_views FOR ALL USING (auth.role() = 'service_role');

-- Survey history policies
CREATE POLICY "Users can view own survey history" ON survey_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own survey history" ON survey_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage survey history" ON survey_history FOR ALL USING (auth.role() = 'service_role');

-- Offerwall history policies
CREATE POLICY "Users can view own offerwall history" ON offerwall_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own offerwall history" ON offerwall_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage offerwall history" ON offerwall_history FOR ALL USING (auth.role() = 'service_role');

-- Referral links policies
CREATE POLICY "Users can view own referral links" ON referral_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own referral links" ON referral_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view referral links by code" ON referral_links FOR SELECT USING (TRUE);
CREATE POLICY "Service role can manage referral links" ON referral_links FOR ALL USING (auth.role() = 'service_role');

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage tickets" ON support_tickets FOR ALL USING (auth.role() = 'service_role');

-- Device sessions policies
CREATE POLICY "Users can view own sessions" ON device_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage sessions" ON device_sessions FOR ALL USING (auth.role() = 'service_role');

-- Public read policies
CREATE POLICY "Anyone can view surveys" ON surveys FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view offerwalls" ON offerwalls FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Anyone can view leaderboards" ON leaderboard_daily FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view leaderboards" ON leaderboard_weekly FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view leaderboards" ON leaderboard_monthly FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view leaderboards" ON leaderboard_all_time FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view countries" ON countries FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view languages" ON languages FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view feature flags" ON feature_flags FOR SELECT USING (is_enabled = TRUE);
CREATE POLICY "Anyone can view remote configs" ON remote_configs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view app statistics" ON app_statistics FOR SELECT USING (TRUE);

-- Admin tables policies
CREATE POLICY "Admins can view admin users" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can manage admin users" ON admin_users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can manage audit logs" ON audit_logs FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default countries
INSERT INTO countries (code, name, phone_code) VALUES
    ('US', 'United States', '+1'),
    ('GB', 'United Kingdom', '+44'),
    ('DE', 'Germany', '+49'),
    ('FR', 'France', '+33'),
    ('ES', 'Spain', '+34'),
    ('IT', 'Italy', '+39'),
    ('BR', 'Brazil', '+55'),
    ('IN', 'India', '+91'),
    ('CN', 'China', '+86'),
    ('JP', 'Japan', '+81'),
    ('KR', 'South Korea', '+82'),
    ('RU', 'Russia', '+7'),
    ('UA', 'Ukraine', '+380'),
    ('TR', 'Turkey', '+90'),
    ('SA', 'Saudi Arabia', '+966'),
    ('AE', 'UAE', '+971'),
    ('EG', 'Egypt', '+20'),
    ('NG', 'Nigeria', '+234'),
    ('ZA', 'South Africa', '+27'),
    ('MX', 'Mexico', '+52')
ON CONFLICT (code) DO NOTHING;

-- Insert default languages
INSERT INTO languages (code, name, native_name) VALUES
    ('en', 'English', 'English'),
    ('es', 'Spanish', 'Español'),
    ('fr', 'French', 'Français'),
    ('de', 'German', 'Deutsch'),
    ('it', 'Italian', 'Italiano'),
    ('pt', 'Portuguese', 'Português'),
    ('ru', 'Russian', 'Русский'),
    ('zh', 'Chinese', '中文'),
    ('ja', 'Japanese', '日本語'),
    ('ko', 'Korean', '한국어'),
    ('ar', 'Arabic', 'العربية'),
    ('hi', 'Hindi', 'हिन्दी'),
    ('tr', 'Turkish', 'Türkçe'),
    ('uk', 'Ukrainian', 'Українська'),
    ('nl', 'Dutch', 'Nederlands'),
    ('pl', 'Polish', 'Polski'),
    ('vi', 'Vietnamese', 'Tiếng Việt'),
    ('th', 'Thai', 'ไทย'),
    ('id', 'Indonesian', 'Bahasa Indonesia'),
    ('ms', 'Malay', 'Bahasa Melayu')
ON CONFLICT (code) DO NOTHING;

-- Insert default feature flags
INSERT INTO feature_flags (key, name, description, is_enabled, rollout_percentage) VALUES
    ('new_user_onboarding', 'New User Onboarding', 'Enable new user onboarding flow', TRUE, 100),
    ('referral_system', 'Referral System', 'Enable referral system', TRUE, 100),
    ('daily_bonus', 'Daily Bonus', 'Enable daily bonus system', TRUE, 100),
    ('leaderboards', 'Leaderboards', 'Enable leaderboards', TRUE, 100),
    ('surveys', 'Surveys', 'Enable surveys feature', TRUE, 100),
    ('offerwalls', 'Offerwalls', 'Enable offerwalls feature', TRUE, 100),
    ('app_installs', 'App Installs', 'Enable app installs feature', TRUE, 100),
    ('premium_features', 'Premium Features', 'Enable premium user features', TRUE, 100),
    ('advanced_analytics', 'Advanced Analytics', 'Enable advanced analytics', FALSE, 0),
    ('beta_features', 'Beta Features', 'Enable beta features for testing', FALSE, 10)
ON CONFLICT (key) DO NOTHING;

-- Insert default remote configs
INSERT INTO remote_configs (key, value, description) VALUES
    ('min_withdrawal_amount', '10', 'Minimum withdrawal amount in FC'),
    ('max_daily_earnings', '1000', 'Maximum daily earnings in FC'),
    ('referral_reward_amount', '50', 'Referral reward amount in FC'),
    ('ad_reward_base', '5', 'Base ad reward amount in FC'),
    ('survey_reward_min', '10', 'Minimum survey reward in FC'),
    ('survey_reward_max', '100', 'Maximum survey reward in FC'),
    ('streak_freeze_cost', '25', 'Cost to purchase streak freeze in FC'),
    ('level_up_bonus_base', '20', 'Base level up bonus in FC')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get user rank
CREATE OR REPLACE FUNCTION get_user_rank(user_uuid UUID)
RETURNS TABLE(rank_position BIGINT, score DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY lb.score DESC)::BIGINT,
        lb.score
    FROM leaderboard_all_time lb
    WHERE lb.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard(
    user_uuid UUID,
    score_increase DECIMAL,
    period_type VARCHAR
)
RETURNS VOID AS $$
DECLARE
    current_score DECIMAL;
BEGIN
    -- Update all-time leaderboard
    INSERT INTO leaderboard_all_time (user_id, score, rank)
    VALUES (user_uuid, score_increase, 0)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        score = leaderboard_all_time.score + score_increase,
        updated_at = NOW();
    
    -- Update ranks for all-time leaderboard
    WITH ranked AS (
        SELECT user_id, ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
        FROM leaderboard_all_time
    )
    UPDATE leaderboard_all_time 
    SET rank = ranked.new_rank
    FROM ranked 
    WHERE leaderboard_all_time.user_id = ranked.user_id;
    
    -- Update period-specific leaderboards based on period_type
    IF period_type = 'daily' THEN
        INSERT INTO leaderboard_daily (user_id, score, rank, period_date)
        VALUES (user_uuid, score_increase, 0, CURRENT_DATE)
        ON CONFLICT (user_id, period_date)
        DO UPDATE SET 
            score = leaderboard_daily.score + score_increase,
            updated_at = NOW();
        
        UPDATE leaderboard_daily 
        SET rank = sub.new_rank
        FROM (
            SELECT user_id, ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
            FROM leaderboard_daily
            WHERE period_date = CURRENT_DATE
        ) sub
        WHERE leaderboard_daily.user_id = sub.user_id;
        
    ELSIF period_type = 'weekly' THEN
        INSERT INTO leaderboard_weekly (user_id, score, rank, period_start, period_end)
        VALUES (user_uuid, score_increase, 0, DATE_TRUNC('week', CURRENT_DATE)::DATE, (DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days')::DATE)
        ON CONFLICT (user_id, period_start)
        DO UPDATE SET 
            score = leaderboard_weekly.score + score_increase,
            updated_at = NOW();
        
        UPDATE leaderboard_weekly 
        SET rank = sub.new_rank
        FROM (
            SELECT user_id, ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
            FROM leaderboard_weekly
            WHERE period_start = DATE_TRUNC('week', CURRENT_DATE)::DATE
        ) sub
        WHERE leaderboard_weekly.user_id = sub.user_id;
        
    ELSIF period_type = 'monthly' THEN
        INSERT INTO leaderboard_monthly (user_id, score, rank, period_year, period_month)
        VALUES (user_uuid, score_increase, 0, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER)
        ON CONFLICT (user_id, period_year, period_month)
        DO UPDATE SET 
            score = leaderboard_monthly.score + score_increase,
            updated_at = NOW();
        
        UPDATE leaderboard_monthly 
        SET rank = sub.new_rank
        FROM (
            SELECT user_id, ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
            FROM leaderboard_monthly
            WHERE period_year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER 
            AND period_month = EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER
        ) sub
        WHERE leaderboard_monthly.user_id = sub.user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user statistics
CREATE OR REPLACE FUNCTION calculate_user_statistics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO app_statistics (
        date,
        total_users,
        active_users,
        new_users,
        total_transactions,
        total_volume,
        total_rewards,
        total_withdrawals,
        ad_views_count,
        surveys_completed,
        offerwalls_completed,
        referrals_count
    )
    SELECT 
        target_date,
        COUNT(*) FILTER (WHERE status != 'banned'),
        COUNT(*) FILTER (WHERE last_active_at >= target_date AND status != 'banned'),
        COUNT(*) FILTER (WHERE DATE(created_at) = target_date),
        (SELECT COUNT(*) FROM transactions WHERE DATE(created_at) = target_date),
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE DATE(created_at) = target_date AND transaction_type = 'credit'),
        (SELECT COALESCE(SUM(amount), 0) FROM ad_rewards WHERE DATE(created_at) = target_date AND status = 'completed'),
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE DATE(created_at) = target_date AND transaction_type = 'withdrawal'),
        (SELECT COUNT(*) FROM ad_views WHERE DATE(created_at) = target_date),
        (SELECT COUNT(*) FROM survey_history WHERE DATE(created_at) = target_date AND status = 'completed'),
        (SELECT COUNT(*) FROM offerwall_history WHERE DATE(created_at) = target_date AND status = 'completed'),
        (SELECT COUNT(*) FROM referrals WHERE DATE(created_at) = target_date)
    FROM users
    ON CONFLICT (date) 
    DO UPDATE SET
        total_users = EXCLUDED.total_users,
        active_users = EXCLUDED.active_users,
        new_users = EXCLUDED.new_users,
        total_transactions = EXCLUDED.total_transactions,
        total_volume = EXCLUDED.total_volume,
        total_rewards = EXCLUDED.total_rewards,
        total_withdrawals = EXCLUDED.total_withdrawals,
        ad_views_count = EXCLUDED.ad_views_count,
        surveys_completed = EXCLUDED.surveys_completed,
        offerwalls_completed = EXCLUDED.offerwalls_completed,
        referrals_count = EXCLUDED.referrals_count,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'User accounts - extends Supabase Auth';
COMMENT ON TABLE profiles IS 'User profiles with gamification data';
COMMENT ON TABLE wallets IS 'User wallets with FC balances';
COMMENT ON TABLE fc_ledger IS 'Financial ledger for all FC transactions';
COMMENT ON TABLE reward_pool IS 'Centralized reward pools';
COMMENT ON TABLE transactions IS 'All financial transactions';
COMMENT ON TABLE settlements IS 'User settlement records';
COMMENT ON TABLE settlement_cycles IS 'Settlement processing cycles';
COMMENT ON TABLE ad_views IS 'Ad view tracking';
COMMENT ON TABLE ad_networks IS 'Ad network configurations';
COMMENT ON TABLE ad_rewards IS 'Ad reward records';
COMMENT ON TABLE surveys IS 'Available surveys';
COMMENT ON TABLE survey_history IS 'User survey completion history';
COMMENT ON TABLE offerwalls IS 'Offerwall configurations';
COMMENT ON TABLE offerwall_history IS 'User offerwall completion history';
COMMENT ON TABLE app_installs IS 'App install tracking';
COMMENT ON TABLE referral_links IS 'Referral link management';
COMMENT ON TABLE referrals IS 'Referral relationships';
COMMENT ON TABLE referral_rewards IS 'Referral reward records';
COMMENT ON TABLE missions IS 'Mission definitions';
COMMENT ON TABLE mission_progress IS 'User mission progress';
COMMENT ON TABLE achievements IS 'Achievement definitions';
COMMENT ON TABLE badges IS 'Badge definitions';
COMMENT ON TABLE user_badges IS 'User earned badges';
COMMENT ON TABLE streaks IS 'User streak tracking';
COMMENT ON TABLE daily_bonus IS 'Daily bonus claims';
COMMENT ON TABLE events IS 'Event definitions';
COMMENT ON TABLE event_rewards IS 'Event reward records';
COMMENT ON TABLE leaderboard_daily IS 'Daily leaderboard';
COMMENT ON TABLE leaderboard_weekly IS 'Weekly leaderboard';
COMMENT ON TABLE leaderboard_monthly IS 'Monthly leaderboard';
COMMENT ON TABLE leaderboard_all_time IS 'All-time leaderboard';
COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON TABLE support_tickets IS 'Support tickets';
COMMENT ON TABLE support_messages IS 'Support ticket messages';
COMMENT ON TABLE audit_logs IS 'System audit logs';
COMMENT ON TABLE admin_users IS 'Admin user management';
COMMENT ON TABLE admin_actions IS 'Admin action tracking';
COMMENT ON TABLE fraud_detection IS 'Fraud detection records';
COMMENT ON TABLE fraud_reports IS 'User fraud reports';
COMMENT ON TABLE user_devices IS 'User device tracking';
COMMENT ON TABLE device_sessions IS 'Device session management';
COMMENT ON TABLE countries IS 'Country reference data';
COMMENT ON TABLE languages IS 'Language reference data';
COMMENT ON TABLE feature_flags IS 'Feature flag management';
COMMENT ON TABLE remote_configs IS 'Remote configuration';
COMMENT ON TABLE app_statistics IS 'Daily app statistics';
COMMENT ON TABLE analytics_events IS 'Analytics event tracking';
COMMENT ON TABLE system_logs IS 'System logs';