'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { TelegramWebApp, TelegramUser } from '@/lib/telegram/types';

export interface AuthUser {
  id: string;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
  initData: string;
}

export function useTelegramAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  // Generate UUID from telegram ID or create new one
  const generateUserId = useCallback((telegramId: number): string => {
    // Use a deterministic UUID based on telegram ID for consistency
    return `tg-${telegramId.toString().padStart(10, '0')}-0000-0000-0000-000000000000`.slice(0, 36);
  }, []);

  // Initialize Telegram WebApp
  useEffect(() => {
    const initTelegram = async () => {
      try {
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const tg = window.Telegram?.WebApp as TelegramWebApp | undefined;
        
        if (!tg) {
          // Not in Telegram - create demo user for browser testing
          console.log('Not in Telegram WebApp, creating demo user');
          const demoUser: AuthUser = {
            id: 'demo-user-001',
            telegramId: 123456789,
            firstName: 'Demo',
            lastName: 'User',
            username: 'demouser',
            languageCode: 'en',
            isPremium: false,
            photoUrl: undefined,
            initData: '',
          };
          setUser(demoUser);
          setIsLoading(false);
          return;
        }

        setWebApp(tg);
        tg.ready();
        tg.expand();

        const initData = tg.initData;
        const tgUser = tg.initDataUnsafe?.user;

        if (!tgUser) {
          throw new Error('Telegram user data not available');
        }

        const userId = generateUserId(tgUser.id);

        const authUser: AuthUser = {
          id: userId,
          telegramId: tgUser.id,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
          username: tgUser.username,
          languageCode: tgUser.language_code,
          isPremium: tgUser.is_premium,
          photoUrl: tgUser.photo_url,
          initData,
        };

        setUser(authUser);

        // Sync user with Supabase
        try {
          await syncUserWithSupabase(authUser, initData);
        } catch (syncError) {
          console.warn('Failed to sync user with Supabase:', syncError);
          // Don't fail auth if sync fails
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Telegram auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsLoading(false);
      }
    };

    initTelegram();
  }, [generateUserId]);

  const syncUserWithSupabase = async (authUser: AuthUser, initData: string) => {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: authUser.id,
        telegram_id: authUser.telegramId,
        first_name: authUser.firstName,
        last_name: authUser.lastName,
        username: authUser.username,
        language_code: authUser.languageCode,
        is_premium: authUser.isPremium,
        photo_url: authUser.photoUrl,
        init_data: initData,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      });

    if (error) {
      throw error;
    }
  };

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'light') => {
    if (webApp?.HapticFeedback) {
      if (type === 'success' || type === 'error' || type === 'warning') {
        webApp.HapticFeedback.notificationOccurred(type);
      } else {
        webApp.HapticFeedback.impactOccurred(type);
      }
    }
  }, [webApp]);

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
    }
  }, [webApp]);

  const hideMainButton = useCallback(() => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
    }
  }, [webApp]);

  return {
    user,
    isLoading,
    error,
    webApp,
    hapticFeedback,
    showMainButton,
    hideMainButton,
    isInTelegram: !!webApp,
  };
}