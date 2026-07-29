-- ============================================
-- Performance Optimization for 10M+ Users
-- Version: 1.0.2
-- Description: Additional indexes, partitioning, and performance optimizations
-- ============================================

-- ============================================
-- PARTITIONING FOR LARGE TABLES
-- ============================================

-- Partition transactions by created_at (monthly partitions)
CREATE TABLE IF NOT EXISTS transactions_partitioned (
    LIKE transactions INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create partitions for the next 12 months
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
BEGIN
    FOR i IN 0..11 LOOP
        start_date := DATE_TRUNC('month', NOW() + (i || ' months')::INTERVAL);
        end_date := start_date + INTERVAL '1 month';
        
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS transactions_%s PARTITION OF transactions_partitioned
            FOR VALUES FROM (''%s'') TO (''%s'')
        ', to_char(start_date, 'YYYY_MM'), start_date, end_date);
    END LOOP;
END $$;

-- Partition fc_ledger by created_at (monthly partitions)
CREATE TABLE IF NOT EXISTS fc_ledger_partitioned (
    LIKE fc_ledger INCLUDING ALL
) PARTITION BY RANGE (created_at);

DO $$
DECLARE
    start_date DATE;
    end_date DATE;
BEGIN
    FOR i IN 0..11 LOOP
        start_date := DATE_TRUNC('month', NOW() + (i || ' months')::INTERVAL);
        end_date := start_date + INTERVAL '1 month';
        
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS fc_ledger_%s PARTITION OF fc_ledger_partitioned
            FOR VALUES FROM (''%s'') TO (''%s'')
        ', to_char(start_date, 'YYYY_MM'), start_date, end_date);
    END LOOP;
END $$;

-- Partition analytics_events by created_at (monthly partitions)
CREATE TABLE IF NOT EXISTS analytics_events_partitioned (
    LIKE analytics_events INCLUDING ALL
) PARTITION BY RANGE (created_at);

DO $$
DECLARE
    start_date DATE;
    end_date DATE;
BEGIN
    FOR i IN 0..11 LOOP
        start_date := DATE_TRUNC('month', NOW() + (i || ' months')::INTERVAL);
        end_date := start_date + INTERVAL '1 month';
        
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS analytics_events_%s PARTITION OF analytics_events_partitioned
            FOR VALUES FROM (''%s'') TO (''%s'')
        ', to_char(start_date, 'YYYY_MM'), start_date, end_date);
    END LOOP;
END $$;

-- Partition audit_logs by created_at (monthly partitions)
CREATE TABLE IF NOT EXISTS audit_logs_partitioned (
    LIKE audit_logs INCLUDING ALL
) PARTITION BY RANGE (created_at);

DO $$
DECLARE
    start_date DATE;
    end_date DATE;
BEGIN
    FOR i IN 0..11 LOOP
        start_date := DATE_TRUNC('month', NOW() + (i || ' months')::INTERVAL);
        end_date := start_date + INTERVAL '1 month';
        
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS audit_logs_%s PARTITION OF audit_logs_partitioned
            FOR VALUES FROM (''%s'') TO (''%s'')
        ', to_char(start_date, 'YYYY_MM'), start_date, end_date);
    END LOOP;
END $$;

-- ============================================
-- ADDITIONAL PERFORMANCE INDEXES
-- ============================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_users_telegram_id_active ON users(telegram_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_profiles_user_level ON profiles(user_id, level DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_user_rank ON profiles(user_id, rank);
CREATE INDEX IF NOT EXISTS idx_wallets_user_balance ON wallets(user_id, balance DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type_status ON transactions(user_id, type, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created_type ON transactions(user_id, created_at DESC, type);
CREATE INDEX IF NOT EXISTS idx_fc_ledger_user_type_created ON fc_ledger(user_id, type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_settlements_user_status ON settlements(user_id, status);
CREATE INDEX IF NOT EXISTS idx_settlements_cycle_status ON settlements(cycle_id, status);
CREATE INDEX IF NOT EXISTS idx_ad_views_user_watched ON ad_views(user_id, watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_views_network_status ON ad_views(ad_network_id, status);
CREATE INDEX IF NOT EXISTS idx_survey_history_user_completed ON survey_history(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_offerwall_history_user_completed ON offerwall_history(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_status ON referrals(referrer_id, status);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_status ON referrals(referee_id, status);
CREATE INDEX IF NOT EXISTS idx_mission_progress_user_completed ON mission_progress(user_id, is_completed, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_progress_user_completed ON event_progress(user_id, is_completed, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status_created ON support_tickets(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_device_sessions_user_status_expires ON device_sessions(user_id, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_user_devices_user_last_seen ON user_devices(user_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_created ON analytics_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_event ON analytics_events(user_id, event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level_created ON system_logs(level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created ON audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_created ON audit_logs(resource_type, resource_id, created_at DESC);

-- Partial indexes for active records only
CREATE INDEX IF NOT EXISTS idx_users_active ON users(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_profiles_public ON profiles(user_id) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_device_sessions_active ON device_sessions(user_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_leaderboard_daily_current ON leaderboard_daily(snapshot_date) WHERE snapshot_date = CURRENT_DATE;
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_current ON leaderboard_weekly(week_start_date) WHERE week_start_date = DATE_TRUNC('week', CURRENT_DATE)::DATE;
CREATE INDEX IF NOT EXISTS idx_leaderboard_monthly_current ON leaderboard_monthly(month_start_date) WHERE month_start_date = DATE_TRUNC('month', CURRENT_DATE)::DATE;

-- Expression indexes for JSONB queries
CREATE INDEX IF NOT EXISTS idx_profiles_metadata_gin ON profiles USING GIN((jsonb_build_object('level', level, 'rank', rank)));
CREATE INDEX IF NOT EXISTS idx_transactions_metadata_gin ON transactions USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_fc_ledger_metadata_gin ON fc_ledger USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_mission_progress_progress_gin ON mission_progress USING GIN(progress);
CREATE INDEX IF NOT EXISTS idx_event_progress_progress_gin ON event_progress USING GIN(progress);
CREATE INDEX IF NOT EXISTS idx_notifications_data_gin ON notifications USING GIN(data);
CREATE INDEX IF NOT EXISTS idx_admin_actions_metadata_gin ON admin_actions USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_fraud_detection_details_gin ON fraud_detection USING GIN(details);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_evidence_gin ON fraud_reports USING GIN(evidence);

-- ============================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- ============================================

-- Materialized view for user stats (frequently accessed)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_stats AS
SELECT 
    u.id as user_id,
    u.telegram_id,
    u.username,
    u.first_name,
    u.last_name,
    u.status,
    p.level,
    p.rank,
    p.total_earned,
    p.total_withdrawn,
    p.tasks_completed,
    p.ads_watched,
    p.apps_installed,
    p.referrals_count,
    p.current_streak,
    p.longest_streak,
    w.balance,
    w.pending_balance,
    w.withdrawable_balance,
    COUNT(DISTINCT t.id) as transaction_count,
    MAX(t.created_at) as last_transaction_at
FROM users u
LEFT JOIN profiles p ON p.user_id = u.id
LEFT JOIN wallets w ON w.user_id = u.id
LEFT JOIN transactions t ON t.user_id = u.id
WHERE u.status = 'active'
GROUP BY u.id, u.telegram_id, u.username, u.first_name, u.last_name, u.status,
         p.level, p.rank, p.total_earned, p.total_withdrawn, p.tasks_completed,
         p.ads_watched, p.apps_installed, p.referrals_count, p.current_streak,
         p.longest_streak, w.balance, w.pending_balance, w.withdrawable_balance;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_user_stats_user_id ON mv_user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_mv_user_stats_level ON mv_user_stats(level DESC);
CREATE INDEX IF NOT EXISTS idx_mv_user_stats_rank ON mv_user_stats(rank);
CREATE INDEX IF NOT EXISTS idx_mv_user_stats_balance ON mv_user_stats(balance DESC);

-- Materialized view for leaderboard (frequently accessed)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_leaderboard_all_time AS
SELECT 
    u.id as user_id,
    u.username,
    u.first_name,
    u.last_name,
    p.level,
    p.rank,
    p.avatar_url,
    COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) as total_earned,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) DESC) as rank
FROM users u
LEFT JOIN profiles p ON p.user_id = u.id
LEFT JOIN transactions t ON t.user_id = u.id AND t.status = 'completed'
WHERE u.status = 'active' AND p.show_on_leaderboard = TRUE
GROUP BY u.id, u.username, u.first_name, u.last_name, p.level, p.rank, p.avatar_url
ORDER BY total_earned DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_leaderboard_user_id ON mv_leaderboard_all_time(user_id);
CREATE INDEX IF NOT EXISTS idx_mv_leaderboard_rank ON mv_leaderboard_all_time(rank);

-- Materialized view for daily stats
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_earned,
    SUM(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END) as total_withdrawn
FROM transactions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_stats_date ON mv_daily_stats(date);

-- ============================================
-- FUNCTIONS FOR MATERIALIZED VIEWS
-- ============================================

-- Refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_leaderboard_all_time;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ADVANCED FUNCTIONS FOR BUSINESS LOGIC
-- ============================================

-- Function to calculate user level from XP
CREATE OR REPLACE FUNCTION calculate_user_level(xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
    user_level INTEGER;
BEGIN
    SELECT level INTO user_level
    FROM levels
    WHERE xp_required <= xp
    ORDER BY xp_required DESC
    LIMIT 1;
    
    RETURN COALESCE(user_level, 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get user rank based on total earned
CREATE OR REPLACE FUNCTION get_user_rank(total_earned DECIMAL)
RETURNS VARCHAR(50) AS $$
DECLARE
    user_rank VARCHAR(50);
BEGIN
    SELECT name INTO user_rank
    FROM ranks
    WHERE total_earned >= min_fc AND total_earned < max_fc
    ORDER BY min_fc DESC
    LIMIT 1;
    
    RETURN COALESCE(user_rank, 'bronze');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user level and rank
CREATE OR REPLACE FUNCTION update_user_level_and_rank()
RETURNS TRIGGER AS $$
DECLARE
    new_level INTEGER;
    new_rank VARCHAR(50);
BEGIN
    -- Calculate new level and rank
    new_level := calculate_user_level(NEW.total_earned);
    new_rank := get_user_rank(NEW.total_earned);
    
    -- Update profile
    UPDATE profiles
    SET 
        level = new_level,
        rank = new_rank,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update level and rank on transaction
CREATE TRIGGER update_level_rank_on_transaction
    AFTER INSERT ON transactions
    FOR EACH ROW
    WHEN (NEW.type = 'credit' AND NEW.status = 'completed')
    EXECUTE FUNCTION update_user_level_and_rank();

-- Function to check earning limits
CREATE OR REPLACE FUNCTION check_earning_limit(
    p_user_id UUID,
    p_limit_type VARCHAR(50),
    p_amount DECIMAL
) RETURNS BOOLEAN AS $$
DECLARE
    current_usage DECIMAL;
    daily_limit DECIMAL;
BEGIN
    -- Get limit from remote_configs
    SELECT value::DECIMAL INTO daily_limit
    FROM remote_configs
    WHERE key = 'max_daily_' || p_limit_type;
    
    IF daily_limit IS NULL THEN
        RETURN TRUE; -- No limit configured
    END IF;
    
    -- Get current usage today
    SELECT COALESCE(SUM(amount), 0) INTO current_usage
    FROM transactions
    WHERE user_id = p_user_id
    AND type = 'credit'
    AND DATE(created_at) = CURRENT_DATE
    AND reference_type = p_limit_type;
    
    RETURN (current_usage + p_amount) <= daily_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to distribute FC from reward pool
CREATE OR REPLACE FUNCTION distribute_reward(
    p_user_id UUID,
    p_amount DECIMAL,
    p_reward_type VARCHAR(50),
    p_description TEXT,
    p_reference_type VARCHAR(50) DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_transaction_id UUID;
    v_wallet_id UUID;
    v_balance_before DECIMAL;
    v_balance_after DECIMAL;
BEGIN
    -- Get wallet
    SELECT id, balance INTO v_wallet_id, v_balance_before
    FROM wallets
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;
    
    -- Check earning limit
    IF NOT check_earning_limit(p_user_id, p_reward_type, p_amount) THEN
        RAISE EXCEPTION 'Earning limit exceeded for %', p_reward_type;
    END IF;
    
    -- Calculate new balance
    v_balance_after := v_balance_before + p_amount;
    
    -- Create transaction
    INSERT INTO transactions (
        user_id, wallet_id, type, status, amount, currency, description,
        reference_type, reference_id
    ) VALUES (
        p_user_id, v_wallet_id, 'credit', 'completed', p_amount, 'FC', p_description,
        p_reference_type, p_reference_id
    ) RETURNING id INTO v_transaction_id;
    
    -- Update wallet
    UPDATE wallets
    SET 
        balance = v_balance_after,
        total_earned = total_earned + p_amount,
        updated_at = NOW()
    WHERE id = v_wallet_id;
    
    -- Create FC ledger entry
    INSERT INTO fc_ledger (
        user_id, wallet_id, transaction_id, type, amount,
        balance_before, balance_after, description
    ) VALUES (
        p_user_id, v_wallet_id, v_transaction_id, 'credit', p_amount,
        v_balance_before, v_balance_after, p_description
    );
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Function to deduct FC from wallet
CREATE OR REPLACE FUNCTION deduct_fc(
    p_user_id UUID,
    p_amount DECIMAL,
    p_description TEXT,
    p_reference_type VARCHAR(50) DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_transaction_id UUID;
    v_wallet_id UUID;
    v_balance_before DECIMAL;
    v_balance_after DECIMAL;
BEGIN
    -- Get wallet with lock
    SELECT id, balance INTO v_wallet_id, v_balance_before
    FROM wallets
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;
    
    -- Check sufficient balance
    IF v_balance_before < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance. Required: %, Available: %', p_amount, v_balance_before;
    END IF;
    
    -- Calculate new balance
    v_balance_after := v_balance_before - p_amount;
    
    -- Create transaction
    INSERT INTO transactions (
        user_id, wallet_id, type, status, amount, currency, description,
        reference_type, reference_id
    ) VALUES (
        p_user_id, v_wallet_id, 'debit', 'completed', p_amount, 'FC', p_description,
        p_reference_type, p_reference_id
    ) RETURNING id INTO v_transaction_id;
    
    -- Update wallet
    UPDATE wallets
    SET 
        balance = v_balance_after,
        updated_at = NOW()
    WHERE id = v_wallet_id;
    
    -- Create FC ledger entry
    INSERT INTO fc_ledger (
        user_id, wallet_id, transaction_id, type, amount,
        balance_before, balance_after, description
    ) VALUES (
        p_user_id, v_wallet_id, v_transaction_id, 'debit', p_amount,
        v_balance_before, v_balance_after, p_description
    );
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VACUUM AND ANALYZE CONFIGURATION
-- ============================================

-- Autovacuum settings for high-traffic tables
ALTER TABLE transactions SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_analyze_scale_factor = 0.005,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_threshold = 500
);

ALTER TABLE fc_ledger SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_analyze_scale_factor = 0.005,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_threshold = 500
);

ALTER TABLE analytics_events SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 10000,
    autovacuum_analyze_threshold = 5000
);

ALTER TABLE audit_logs SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 10000,
    autovacuum_analyze_threshold = 5000
);

-- ============================================
-- CONNECTION POOLING CONFIGURATION
-- ============================================

-- Set connection limits for different user types
ALTER DATABASE postgres SET idle_in_transaction_session_timeout = '5min';
ALTER DATABASE postgres SET statement_timeout = '30s';
ALTER DATABASE postgres SET lock_timeout = '10s';

-- ============================================
-- QUERY OPTIMIZATION
-- ============================================

-- Enable query planning for better performance
SET enable_seqscan = off;
SET enable_indexscan = on;
SET enable_bitmapscan = on;

-- ============================================
-- STATISTICS UPDATE
-- ============================================

-- Update statistics for better query planning
ANALYZE users;
ANALYZE profiles;
ANALYZE wallets;
ANALYZE transactions;
ANALYZE fc_ledger;
ANALYZE settlements;
ANALYZE ad_views;
ANALYZE survey_history;
ANALYZE offerwall_history;
ANALYZE referrals;
ANALYZE mission_progress;
ANALYZE event_progress;
ANALYZE leaderboard_daily;
ANALYZE leaderboard_weekly;
ANALYZE leaderboard_monthly;
ANALYZE leaderboard_all_time;
ANALYZE notifications;
ANALYZE support_tickets;
ANALYZE analytics_events;
ANALYZE audit_logs;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- This migration adds performance optimizations for 10M+ users
-- Partitioning, materialized views, and advanced indexes ensure fast queries
-- Refresh materialized views periodically (e.g., every hour) using refresh_materialized_views()