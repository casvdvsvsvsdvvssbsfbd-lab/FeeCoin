-- ============================================
-- FEE Production Database Seed Data
-- Reference data and initial configuration
-- ============================================

-- ============================================
-- COUNTRIES (20 major markets)
-- ============================================

INSERT INTO countries (code, name, phone_code, is_active) VALUES
    ('US', 'United States', '+1', TRUE),
    ('GB', 'United Kingdom', '+44', TRUE),
    ('DE', 'Germany', '+49', TRUE),
    ('FR', 'France', '+33', TRUE),
    ('ES', 'Spain', '+34', TRUE),
    ('IT', 'Italy', '+39', TRUE),
    ('BR', 'Brazil', '+55', TRUE),
    ('IN', 'India', '+91', TRUE),
    ('CN', 'China', '+86', TRUE),
    ('JP', 'Japan', '+81', TRUE),
    ('KR', 'South Korea', '+82', TRUE),
    ('RU', 'Russia', '+7', TRUE),
    ('UA', 'Ukraine', '+380', TRUE),
    ('TR', 'Turkey', '+90', TRUE),
    ('SA', 'Saudi Arabia', '+966', TRUE),
    ('AE', 'UAE', '+971', TRUE),
    ('EG', 'Egypt', '+20', TRUE),
    ('NG', 'Nigeria', '+234', TRUE),
    ('ZA', 'South Africa', '+27', TRUE),
    ('MX', 'Mexico', '+52', TRUE)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- LANGUAGES (20 most common)
-- ============================================

INSERT INTO languages (code, name, native_name, is_active) VALUES
    ('en', 'English', 'English', TRUE),
    ('es', 'Spanish', 'Español', TRUE),
    ('fr', 'French', 'Français', TRUE),
    ('de', 'German', 'Deutsch', TRUE),
    ('it', 'Italian', 'Italiano', TRUE),
    ('pt', 'Portuguese', 'Português', TRUE),
    ('ru', 'Russian', 'Русский', TRUE),
    ('zh', 'Chinese', '中文', TRUE),
    ('ja', 'Japanese', '日本語', TRUE),
    ('ko', 'Korean', '한국어', TRUE),
    ('ar', 'Arabic', 'العربية', TRUE),
    ('hi', 'Hindi', 'हिन्दी', TRUE),
    ('tr', 'Turkish', 'Türkçe', TRUE),
    ('uk', 'Ukrainian', 'Українська', TRUE),
    ('nl', 'Dutch', 'Nederlands', TRUE),
    ('pl', 'Polish', 'Polski', TRUE),
    ('vi', 'Vietnamese', 'Tiếng Việt', TRUE),
    ('th', 'Thai', 'ไทย', TRUE),
    ('id', 'Indonesian', 'Bahasa Indonesia', TRUE),
    ('ms', 'Malay', 'Bahasa Melayu', TRUE)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- FEATURE FLAGS
-- ============================================

INSERT INTO feature_flags (key, name, description, is_enabled, rollout_percentage, target_audience) VALUES
    ('new_user_onboarding', 'New User Onboarding', 'Enable new user onboarding flow', TRUE, 100, '{}'),
    ('referral_system', 'Referral System', 'Enable referral system', TRUE, 100, '{}'),
    ('daily_bonus', 'Daily Bonus', 'Enable daily bonus system', TRUE, 100, '{}'),
    ('leaderboards', 'Leaderboards', 'Enable leaderboards', TRUE, 100, '{}'),
    ('surveys', 'Surveys', 'Enable surveys feature', TRUE, 100, '{}'),
    ('offerwalls', 'Offerwalls', 'Enable offerwalls feature', TRUE, 100, '{}'),
    ('app_installs', 'App Installs', 'Enable app installs feature', TRUE, 100, '{}'),
    ('premium_features', 'Premium Features', 'Enable premium user features', TRUE, 100, '{}'),
    ('advanced_analytics', 'Advanced Analytics', 'Enable advanced analytics', FALSE, 0, '{}'),
    ('beta_features', 'Beta Features', 'Enable beta features for testing', FALSE, 10, '{"premium_only": true}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- REMOTE CONFIGS
-- ============================================

INSERT INTO remote_configs (key, value, description, is_active) VALUES
    ('min_withdrawal_amount', '10', 'Minimum withdrawal amount in FC', TRUE),
    ('max_daily_earnings', '1000', 'Maximum daily earnings in FC', TRUE),
    ('referral_reward_amount', '50', 'Referral reward amount in FC', TRUE),
    ('ad_reward_base', '5', 'Base ad reward amount in FC', TRUE),
    ('survey_reward_min', '10', 'Minimum survey reward in FC', TRUE),
    ('survey_reward_max', '100', 'Maximum survey reward in FC', TRUE),
    ('streak_freeze_cost', '25', 'Cost to purchase streak freeze in FC', TRUE),
    ('level_up_bonus_base', '20', 'Base level up bonus in FC', TRUE),
    ('max_withdrawal_per_day', '500', 'Maximum withdrawal per day in FC', TRUE),
    ('referral_level_1_reward', '50', 'Level 1 referral reward in FC', TRUE),
    ('referral_level_2_reward', '25', 'Level 2 referral reward in FC', TRUE),
    ('mission_reward_multiplier', '1', 'Mission reward multiplier', TRUE),
    ('event_reward_multiplier', '1.5', 'Event reward multiplier', TRUE),
    ('fraud_score_threshold', '70', 'Fraud score threshold for blocking', TRUE),
    ('max_devices_per_user', '5', 'Maximum devices per user', TRUE)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- AD NETWORKS
-- ============================================

INSERT INTO ad_networks (name, type, is_active, priority, fill_rate, ecpm, settings) VALUES
    ('Google AdMob', 'google_admob', TRUE, 1, 95.00, 2.50, '{"app_id": "ca-app-pub-xxxxxxxx", "banner_id": "ca-app-pub-xxxxxxxx/xxxxxxxx", "interstitial_id": "ca-app-pub-xxxxxxxx/xxxxxxxx", "rewarded_id": "ca-app-pub-xxxxxxxx/xxxxxxxx"}'),
    ('Unity Ads', 'unity_ads', TRUE, 2, 90.00, 2.20, '{"game_id": "xxxxxxxx", "banner_id": "banner", "interstitial_id": "video", "rewarded_id": "rewardedVideo"}'),
    ('Iron Source', 'iron_source', TRUE, 3, 85.00, 2.00, '{"app_key": "xxxxxxxx", "instance_name": "Default"}'),
    ('AppLovin', 'applovin', TRUE, 4, 88.00, 2.30, '{"sdk_key": "xxxxxxxx", "banner_ad_unit_id": "xxxxxxxx", "interstitial_ad_unit_id": "xxxxxxxx", "rewarded_ad_unit_id": "xxxxxxxx"}'),
    ('Facebook Audience', 'facebook_audience', TRUE, 5, 92.00, 2.40, '{"placement_id": "xxxxxxxx", "banner_placement_id": "xxxxxxxx"}'),
    ('Custom', 'custom', FALSE, 0, 0.00, 0.00, '{}')
ON CONFLICT DO NOTHING;

-- ============================================
-- BADGES
-- ============================================

INSERT INTO badges (name, description, icon_url, rarity, criteria) VALUES
    ('First Steps', 'Complete your first task', 'badge_first_steps.png', 'common', '{"type": "tasks_completed", "count": 1}'),
    ('Ad Watcher', 'Watch 100 ads', 'badge_ad_watcher.png', 'common', '{"type": "ads_watched", "count": 100}'),
    ('Survey Master', 'Complete 50 surveys', 'badge_survey_master.png', 'uncommon', '{"type": "surveys_completed", "count": 50}'),
    ('Offerwall Pro', 'Complete 25 offerwalls', 'badge_offerwall_pro.png', 'uncommon', '{"type": "offerwalls_completed", "count": 25}'),
    ('Referral Champion', 'Refer 10 friends', 'badge_referral_champion.png', 'rare', '{"type": "referrals_count", "count": 10}'),
    ('Streak Master', 'Maintain a 30-day streak', 'badge_streak_master.png', 'rare', '{"type": "streak_days", "count": 30}'),
    ('High Roller', 'Earn 10,000 FC total', 'badge_high_roller.png', 'epic', '{"type": "total_earned", "amount": 10000}'),
    ('Diamond Hands', 'Reach Diamond rank', 'badge_diamond_hands.png', 'legendary', '{"type": "rank", "rank": "diamond"}'),
    ('Event Champion', 'Win 5 events', 'badge_event_champion.png', 'epic', '{"type": "events_won", "count": 5}'),
    ('Early Adopter', 'Join in the first month', 'badge_early_adopter.png', 'rare', '{"type": "registration_date", "days": 30}')
ON CONFLICT DO NOTHING;

-- ============================================
-- ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (name, description, icon_url, criteria, rewards, is_hidden) VALUES
    ('Getting Started', 'Complete your profile', 'achievement_getting_started.png', '{"type": "profile_complete"}', '{"fc": 50, "xp": 100}', FALSE),
    ('First Earnings', 'Earn your first FC', 'achievement_first_earnings.png', '{"type": "first_earning"}', '{"fc": 10, "xp": 50}', FALSE),
    ('Social Butterfly', 'Connect with 5 friends', 'achievement_social_butterfly.png', '{"type": "referrals_count", "count": 5}', '{"fc": 100, "xp": 200}', FALSE),
    ('Dedicated User', 'Use the app for 7 consecutive days', 'achievement_dedicated_user.png', '{"type": "streak_days", "count": 7}', '{"fc": 75, "xp": 150}', FALSE),
    ('Survey Expert', 'Complete 25 surveys', 'achievement_survey_expert.png', '{"type": "surveys_completed", "count": 25}', '{"fc": 200, "xp": 300}', FALSE),
    ('Offerwall Master', 'Complete 10 offerwalls', 'achievement_offerwall_master.png', '{"type": "offerwalls_completed", "count": 10}', '{"fc": 150, "xp": 250}', FALSE),
    ('Ad Enthusiast', 'Watch 500 ads', 'achievement_ad_enthusiast.png', '{"type": "ads_watched", "count": 500}', '{"fc": 100, "xp": 200}', FALSE),
    ('Big Spender', 'Install 20 apps', 'achievement_big_spender.png', '{"type": "apps_installed", "count": 20}', '{"fc": 250, "xp": 350}', FALSE),
    ('Leaderboard Legend', 'Reach top 10 in leaderboard', 'achievement_leaderboard_legend.png', '{"type": "leaderboard_rank", "rank": 10}', '{"fc": 500, "xp": 500}', TRUE),
    ('FC Millionaire', 'Earn 1,000,000 FC', 'achievement_fc_millionaire.png', '{"type": "total_earned", "amount": 1000000}', '{"fc": 10000, "xp": 5000}', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- MISSIONS
-- ============================================

INSERT INTO missions (title, description, type, requirements, rewards, difficulty, is_active, is_repeatable, max_completions, available_from, available_until) VALUES
    ('Daily Login', 'Log in to the app today', 'daily', '{"type": "login", "count": 1}', '{"fc": 10, "xp": 20}', 1, TRUE, TRUE, 1, NOW(), NULL),
    ('Watch 5 Ads', 'Watch 5 video ads', 'daily', '{"type": "ads_watched", "count": 5}', '{"fc": 25, "xp": 50}', 1, TRUE, TRUE, 1, NOW(), NULL),
    ('Complete 1 Survey', 'Complete 1 survey', 'daily', '{"type": "surveys_completed", "count": 1}', '{"fc": 30, "xp": 60}', 2, TRUE, TRUE, 1, NOW(), NULL),
    ('Refer a Friend', 'Refer 1 friend', 'daily', '{"type": "referrals_count", "count": 1}', '{"fc": 50, "xp": 100}', 2, TRUE, TRUE, 1, NOW(), NULL),
    ('Weekly Warrior', 'Complete 10 tasks this week', 'weekly', '{"type": "tasks_completed", "count": 10}', '{"fc": 100, "xp": 200}', 3, TRUE, TRUE, 1, NOW(), NULL),
    ('Survey Master', 'Complete 5 surveys this week', 'weekly', '{"type": "surveys_completed", "count": 5}', '{"fc": 150, "xp": 300}', 3, TRUE, TRUE, 1, NOW(), NULL),
    ('Ad Commander', 'Watch 50 ads this week', 'weekly', '{"type": "ads_watched", "count": 50}', '{"fc": 125, "xp": 250}', 2, TRUE, TRUE, 1, NOW(), NULL),
    ('Referral Star', 'Refer 3 friends this week', 'weekly', '{"type": "referrals_count", "count": 3}', '{"fc": 200, "xp": 400}', 3, TRUE, TRUE, 1, NOW(), NULL),
    ('First Steps', 'Complete your first task', 'achievement', '{"type": "tasks_completed", "count": 1}', '{"fc": 20, "xp": 50}', 1, TRUE, FALSE, 1, NOW(), NULL),
    ('Century Club', 'Watch 100 ads total', 'achievement', '{"type": "ads_watched", "count": 100}', '{"fc": 100, "xp": 200}', 2, TRUE, FALSE, 1, NOW(), NULL),
    ('Survey Pro', 'Complete 25 surveys total', 'achievement', '{"type": "surveys_completed", "count": 25}', '{"fc": 250, "xp": 400}', 3, TRUE, FALSE, 1, NOW(), NULL),
    ('Referral Hero', 'Refer 10 friends total', 'achievement', '{"type": "referrals_count", "count": 10}', '{"fc": 500, "xp": 800}', 4, TRUE, FALSE, 1, NOW(), NULL),
    ('Streak Keeper', 'Maintain a 7-day streak', 'achievement', '{"type": "streak_days", "count": 7}', '{"fc": 75, "xp": 150}', 2, TRUE, FALSE, 1, NOW(), NULL),
    ('Week Warrior', 'Maintain a 30-day streak', 'achievement', '{"type": "streak_days", "count": 30}', '{"fc": 500, "xp": 1000}', 4, TRUE, FALSE, 1, NOW(), NULL),
    ('Level 10', 'Reach level 10', 'achievement', '{"type": "level", "level": 10}', '{"fc": 200, "xp": 500}', 3, TRUE, FALSE, 1, NOW(), NULL),
    ('Level 25', 'Reach level 25', 'achievement', '{"type": "level", "level": 25}', '{"fc": 500, "xp": 1000}', 4, TRUE, FALSE, 1, NOW(), NULL),
    ('Level 50', 'Reach level 50', 'achievement', '{"type": "level", "level": 50}', '{"fc": 2000, "xp": 5000}', 5, TRUE, FALSE, 1, NOW(), NULL),
    ('Welcome Bonus', 'Complete registration', 'special', '{"type": "registration"}', '{"fc": 50, "xp": 100}', 1, TRUE, FALSE, 1, NOW(), NULL),
    ('Weekend Special', 'Complete tasks on weekend', 'special', '{"type": "weekend_tasks", "count": 3}', '{"fc": 100, "xp": 200}', 2, TRUE, TRUE, 1, NOW(), NULL),
    ('Double Rewards', 'Earn double rewards for a day', 'special', '{"type": "special_event"}', '{"fc": 0, "xp": 0, "multiplier": 2}', 1, TRUE, TRUE, 1, NOW(), NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- EVENTS
-- ============================================

INSERT INTO events (name, description, type, status, rewards, rules, starts_at, ends_at, is_public, max_participants) VALUES
    ('Summer Tournament 2024', 'Compete in our biggest summer event!', 'tournament', 'upcoming', 
     '{"first": {"fc": 10000, "xp": 5000}, "second": {"fc": 5000, "xp": 3000}, "third": {"fc": 2500, "xp": 1500}, "participation": {"fc": 100, "xp": 200}}',
     '{"type": "points", "duration": "7_days", "max_participants": 10000}',
     NOW() + INTERVAL '7 days', NOW() + INTERVAL '14 days', TRUE, 10000),
    ('Weekly Challenge', 'Complete weekly challenges for bonus rewards', 'special', 'active',
     '{"completion": {"fc": 200, "xp": 400}, "bonus": {"fc": 100, "xp": 200}}',
     '{"type": "tasks", "tasks": ["watch_10_ads", "complete_2_surveys", "refer_1_friend"]}',
     NOW(), NOW() + INTERVAL '7 days', TRUE, NULL),
    ('Monthly Madness', 'Monthly competition for top earners', 'seasonal', 'upcoming',
     '{"first": {"fc": 5000, "xp": 2500}, "top10": {"fc": 1000, "xp": 500}, "participation": {"fc": 50, "xp": 100}}',
     '{"type": "earnings", "duration": "30_days"}',
     DATE_TRUNC('month', NOW() + INTERVAL '1 month'), DATE_TRUNC('month', NOW() + INTERVAL '1 month') + INTERVAL '30 days', TRUE, 5000),
    ('Community Event', 'Special community event', 'community', 'upcoming',
     '{"participation": {"fc": 150, "xp": 300}, "bonus": {"fc": 50, "xp": 100}}',
     '{"type": "engagement", "tasks": ["share_app", "invite_friends"]}',
     NOW() + INTERVAL '3 days', NOW() + INTERVAL '10 days', TRUE, NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- REWARD POOLS
-- ============================================

INSERT INTO reward_pool (name, description, total_amount, currency, is_active, starts_at, ends_at) VALUES
    ('Daily Ad Rewards', 'Daily pool for ad viewing rewards', 100000, 'FC', TRUE, NOW(), NULL),
    ('Survey Rewards', 'Pool for survey completion rewards', 50000, 'FC', TRUE, NOW(), NULL),
    ('Offerwall Rewards', 'Pool for offerwall completion rewards', 75000, 'FC', TRUE, NOW(), NULL),
    ('Referral Rewards', 'Pool for referral bonuses', 25000, 'FC', TRUE, NOW(), NULL),
    ('Mission Rewards', 'Pool for mission completion rewards', 30000, 'FC', TRUE, NOW(), NULL),
    ('Event Rewards', 'Pool for event participation rewards', 100000, 'FC', TRUE, NOW(), NULL),
    ('Daily Bonus Pool', 'Pool for daily login bonuses', 10000, 'FC', TRUE, NOW(), NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- OFFERWALLS
-- ============================================

INSERT INTO offerwalls (name, type, provider, is_active, priority, description, settings) VALUES
    ('CPX Research', 'cpa', 'CPX Research', TRUE, 1, 'Complete surveys and offers from CPX Research', '{"api_key": "xxx", "api_secret": "xxx", "endpoint": "https://api.cpxresearch.com"}'),
    ('AdGate Media', 'cpa', 'AdGate Media', TRUE, 2, 'Complete offers from AdGate Media', '{"api_key": "xxx", "api_secret": "xxx", "endpoint": "https://api.adgatemedia.com"}'),
    ('Kiwi Wall', 'cpa', 'Kiwi Wall', TRUE, 3, 'Complete offers from Kiwi Wall', '{"api_key": "xxx", "api_secret": "xxx", "endpoint": "https://api.kiwiwall.com"}'),
    ('OfferToro', 'cpa', 'OfferToro', TRUE, 4, 'Complete offers from OfferToro', '{"api_key": "xxx", "api_secret": "xxx", "endpoint": "https://api.offertoro.com"}'),
    ('Survey Time', 'survey', 'Survey Time', TRUE, 5, 'Complete surveys from Survey Time', '{"api_key": "xxx", "api_secret": "xxx", "endpoint": "https://api.surveytime.io"}'),
    ('Peanut Labs', 'survey', 'Peanut Labs', TRUE, 6, 'Complete surveys from Peanut Labs', '{"api_key": "xxx", "api_secret": "xxx", "endpoint": "https://api.peanutlabs.com"}')
ON CONFLICT DO NOTHING;

-- ============================================
-- SURVEYS
-- ============================================

INSERT INTO surveys (title, description, provider, provider_survey_id, reward_amount, currency, estimated_time, difficulty, tags, is_active, available_from, available_until) VALUES
    ('Consumer Survey - Electronics', 'Tell us about your electronics preferences', 'CPX Research', 'CPX-001', 50, 'FC', 10, 'easy', ARRAY['electronics', 'consumer'], TRUE, NOW(), NULL),
    ('Shopping Habits Survey', 'Share your shopping preferences', 'AdGate Media', 'ADG-001', 75, 'FC', 15, 'medium', ARRAY['shopping', 'lifestyle'], TRUE, NOW(), NULL),
    ('Travel Preferences', 'Help us understand travel trends', 'Kiwi Wall', 'KIWI-001', 100, 'FC', 20, 'medium', ARRAY['travel', 'lifestyle'], TRUE, NOW(), NULL),
    ('Food & Beverage Survey', 'Your opinions on food and drinks', 'Survey Time', 'ST-001', 60, 'FC', 12, 'easy', ARRAY['food', 'beverage'], TRUE, NOW(), NULL),
    ('Technology Usage', 'How do you use technology daily?', 'Peanut Labs', 'PL-001', 80, 'FC', 18, 'medium', ARRAY['technology', 'digital'], TRUE, NOW(), NULL),
    ('Health & Wellness', 'Your health and wellness habits', 'CPX Research', 'CPX-002', 90, 'FC', 15, 'medium', ARRAY['health', 'wellness'], TRUE, NOW(), NULL),
    ('Financial Services', 'Banking and financial product feedback', 'AdGate Media', 'ADG-002', 120, 'FC', 25, 'hard', ARRAY['finance', 'banking'], TRUE, NOW(), NULL),
    ('Entertainment Survey', 'Movies, music, and entertainment', 'Kiwi Wall', 'KIWI-002', 55, 'FC', 10, 'easy', ARRAY['entertainment', 'media'], TRUE, NOW(), NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- ADMIN USERS (Placeholder - create via auth)
-- ============================================

-- Note: Admin users should be created through the application
-- This is just a placeholder for the admin_users table structure
-- Actual admin users will be created by super admins through the UI

-- ============================================
-- SYSTEM CONFIGURATION
-- ============================================

-- Insert default app statistics for today
INSERT INTO app_statistics (date, total_users, active_users, new_users, total_transactions, total_volume, total_rewards, total_withdrawals, ad_views_count, surveys_completed, offerwalls_completed, referrals_count)
VALUES (CURRENT_DATE, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
ON CONFLICT (date) DO NOTHING;

-- ============================================
-- CLEANUP AND MAINTENANCE
-- ============================================

-- Create a function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
    -- Delete old analytics events (older than 90 days)
    DELETE FROM analytics_events 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Delete old system logs (older than 30 days)
    DELETE FROM system_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Delete expired device sessions
    DELETE FROM device_sessions 
    WHERE expires_at < NOW();
    
    -- Archive old app statistics (older than 1 year)
    -- Note: In production, you might want to archive instead of delete
    DELETE FROM app_statistics 
    WHERE date < CURRENT_DATE - INTERVAL '1 year';
    
    RAISE NOTICE 'Cleanup completed';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup_old_data', '0 2 * * *', 'SELECT cleanup_old_data();');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- User summary view
CREATE OR REPLACE VIEW user_summary AS
SELECT 
    u.id,
    u.telegram_id,
    u.username,
    u.first_name,
    u.last_name,
    u.status,
    u.is_premium,
    u.last_active_at,
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
    s.current_streak as streak_current,
    s.longest_streak as streak_longest,
    s.freeze_available
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN wallets w ON u.id = w.user_id
LEFT JOIN streaks s ON u.id = s.user_id
WHERE u.deleted_at IS NULL;

-- Leaderboard view with user info
CREATE OR REPLACE VIEW leaderboard_with_users AS
SELECT 
    lb.user_id,
    lb.score,
    lb.rank,
    u.username,
    u.first_name,
    u.last_name,
    p.level,
    p.rank as user_rank,
    p.avatar_url
FROM leaderboard_all_time lb
JOIN users u ON lb.user_id = u.id
LEFT JOIN profiles p ON lb.user_id = p.user_id
WHERE u.deleted_at IS NULL
  AND u.status = 'active'
ORDER BY lb.rank ASC;

-- Transaction summary view
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    user_id,
    transaction_type,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    SUM(fee) as total_fee,
    SUM(net_amount) as total_net,
    DATE(created_at) as date
FROM transactions
GROUP BY user_id, transaction_type, status, DATE(created_at);

-- ============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ============================================

-- Function to add FC to user wallet
CREATE OR REPLACE FUNCTION add_fc_to_wallet(
    p_user_id UUID,
    p_amount DECIMAL,
    p_transaction_type transaction_type,
    p_description TEXT,
    p_reference_type VARCHAR DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_wallet_id UUID;
    v_balance_before DECIMAL;
    v_balance_after DECIMAL;
    v_transaction_id UUID;
BEGIN
    -- Get wallet
    SELECT id, balance INTO v_wallet_id, v_balance_before
    FROM wallets 
    WHERE user_id = p_user_id 
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;
    
    -- Calculate new balance
    v_balance_after := v_balance_before + p_amount;
    
    -- Validate balance
    IF v_balance_after < 0 THEN
        RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', v_balance_before, ABS(p_amount);
    END IF;
    
    -- Create transaction
    INSERT INTO transactions (user_id, wallet_id, transaction_type, status, amount, description, reference_type, reference_id)
    VALUES (p_user_id, v_wallet_id, p_transaction_type, 'completed', p_amount, p_description, p_reference_type, p_reference_id)
    RETURNING id INTO v_transaction_id;
    
    -- Update wallet
    UPDATE wallets 
    SET balance = v_balance_after,
        total_earned = total_earned + CASE WHEN p_amount > 0 THEN p_amount ELSE 0 END,
        updated_at = NOW()
    WHERE id = v_wallet_id;
    
    -- Create ledger entry
    INSERT INTO fc_ledger (user_id, transaction_type, amount, balance_before, balance_after, reference_type, reference_id, description)
    VALUES (p_user_id, p_transaction_type, p_amount, v_balance_before, v_balance_after, p_reference_type, p_reference_id, p_description);
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Function to subtract FC from user wallet
CREATE OR REPLACE FUNCTION subtract_fc_from_wallet(
    p_user_id UUID,
    p_amount DECIMAL,
    p_transaction_type transaction_type,
    p_description TEXT,
    p_reference_type VARCHAR DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
BEGIN
    RETURN add_fc_to_wallet(p_user_id, -p_amount, p_transaction_type, p_description, p_reference_type, p_reference_id);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can withdraw
CREATE OR REPLACE FUNCTION can_user_withdraw(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_withdrawable DECIMAL;
    v_min_withdrawal DECIMAL;
BEGIN
    -- Get withdrawable balance
    SELECT withdrawable_balance INTO v_withdrawable
    FROM wallets 
    WHERE user_id = p_user_id;
    
    -- Get minimum withdrawal from remote config
    SELECT (value::DECIMAL) INTO v_min_withdrawal
    FROM remote_configs 
    WHERE key = 'min_withdrawal_amount' 
      AND is_active = TRUE;
    
    IF v_min_withdrawal IS NULL THEN
        v_min_withdrawal := 10; -- Default minimum
    END IF;
    
    RETURN v_withdrawable >= v_min_withdrawal;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_telegram_id_status ON users(telegram_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_user_level ON profiles(user_id, level);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fc_ledger_user_created ON fc_ledger(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_views_user_created ON ad_views(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_history_user_status ON survey_history(user_id, status);
CREATE INDEX IF NOT EXISTS idx_offerwall_history_user_status ON offerwall_history(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_all_time_score ON leaderboard_all_time(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_daily_score ON leaderboard_daily(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_score ON leaderboard_weekly(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_monthly_score ON leaderboard_monthly(score DESC);

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_users_active ON users(created_at) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_public ON profiles(level, rank) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_leaderboards_public ON leaderboard_all_time(rank) WHERE user_id IN (SELECT id FROM users WHERE is_public = TRUE);

-- GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_surveys_tags_gin ON surveys USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_feature_flags_audience_gin ON feature_flags USING GIN(target_audience);
CREATE INDEX IF NOT EXISTS idx_remote_configs_value_gin ON remote_configs USING GIN(value);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE countries IS 'Country reference data for user profiles';
COMMENT ON TABLE languages IS 'Supported languages for the application';
COMMENT ON TABLE feature_flags IS 'Feature flags for gradual rollouts and A/B testing';
COMMENT ON TABLE remote_configs IS 'Remote configuration values that can be updated without deployment';
COMMENT ON TABLE ad_networks IS 'Ad network configurations and API credentials';
COMMENT ON TABLE surveys IS 'Available surveys from various providers';
COMMENT ON TABLE offerwalls IS 'Offerwall configurations from various providers';
COMMENT ON TABLE badges IS 'Badge definitions for gamification';
COMMENT ON TABLE achievements IS 'Achievement definitions for gamification';
COMMENT ON TABLE missions IS 'Mission definitions for daily/weekly/special tasks';
COMMENT ON TABLE events IS 'Event definitions for tournaments and special events';
COMMENT ON TABLE reward_pool IS 'Centralized reward pools for different reward types';
COMMENT ON VIEW user_summary IS 'Comprehensive user summary with all related data';
COMMENT ON VIEW leaderboard_with_users IS 'Leaderboard with user details for display';
COMMENT ON VIEW transaction_summary IS 'Transaction summary grouped by user, type, and date';