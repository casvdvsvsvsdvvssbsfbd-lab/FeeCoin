# Supabase Database Setup Guide

## 1. Create the following tables in your Supabase SQL Editor:

```sql
-- Players table
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT DEFAULT '',
  first_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  balance_uzs DOUBLE PRECISION DEFAULT 0,
  balance_rub DOUBLE PRECISION DEFAULT 0,
  pending_uzs DOUBLE PRECISION DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank TEXT DEFAULT 'Rookie',
  total_watched INTEGER DEFAULT 0,
  today_watched INTEGER DEFAULT 0,
  lifetime_earnings_uzs DOUBLE PRECISION DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  referral_earnings DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Staking contracts table
CREATE TABLE staking_contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) NOT NULL,
  amount_uzs DOUBLE PRECISION NOT NULL,
  interest_rate DOUBLE PRECISION DEFAULT 0.20,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'locked', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ad_reward', 'staking_deposit', 'staking_interest', 'referral_bonus', 'withdrawal', 'withdrawal_fee')),
  amount_uzs DOUBLE PRECISION NOT NULL,
  amount_rub DOUBLE PRECISION DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Withdrawal requests table
CREATE TABLE withdrawal_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) NOT NULL,
  amount_uzs DOUBLE PRECISION NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('uzcard', 'humo', 'payeer', 'qiwi')),
  account_details TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Referral logs table
CREATE TABLE referral_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES players(id) NOT NULL,
  referred_username TEXT DEFAULT '',
  bonus_uzs DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 2. Create indexes for performance:

```sql
CREATE INDEX idx_players_telegram_id ON players(telegram_id);
CREATE INDEX idx_transactions_player_id ON transactions(player_id);
CREATE INDEX idx_staking_contracts_player_id ON staking_contracts(player_id);
CREATE INDEX idx_withdrawal_requests_player_id ON withdrawal_requests(player_id);
CREATE INDEX idx_referral_logs_referrer_id ON referral_logs(referrer_id);
```

## 3. Enable Row Level Security (optional but recommended):

```sql
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for the app (since it's a Telegram Mini App)
CREATE POLICY "Allow all on players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on staking_contracts" ON staking_contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on withdrawal_requests" ON withdrawal_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on referral_logs" ON referral_logs FOR ALL USING (true) WITH CHECK (true);
```

## 4. Configure your .env file:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Update the referral bot link in `GameContext.tsx`:

Search for `https://t.me/YourBot?start=` and replace `YourBot` with your actual Telegram bot username.