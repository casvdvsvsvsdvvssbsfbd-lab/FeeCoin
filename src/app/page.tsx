'use client';

import { useEffect } from 'react';
import App from '../App';
import { initializeAuthSession } from '../lib/stores/auth-store';

export default function HomePage() {
  // DEV/TEST: establish the real Supabase test-user session at startup so
  // referral (and later wallet/transactions) data persists to the real DB.
  // TODO(PROD): Replace with real Telegram auth before shipping.
  useEffect(() => {
    initializeAuthSession();
  }, []);

  return <App />;
}
