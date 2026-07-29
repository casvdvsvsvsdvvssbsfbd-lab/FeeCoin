// ============================================
// Global App Provider
// Production-ready application initialization
// ============================================

'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from './stores/app-store';
import { useAuthStore } from './stores/auth-store';
import { useSettingsStore } from './stores/settings-store';
import { useRealtimeStore } from './stores/realtime-store';
import { useLoadingStore, useGlobalLoading } from './loading/loading-store';
import { toastStore } from './notifications/toast-store';
import { supabase } from './supabase/client';
import { telegramSDK } from './telegram/telegram-sdk';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AppInitializer>
      {children}
    </AppInitializer>
  );
};

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setInitialized, setBootstrapping, setOnline, setMaintenanceMode, isLoading } = useAppStore();
  const { setUser, setProfile, setSession, setLoading: setAuthLoading, reset: resetAuth } = useAuthStore();
  const { setLanguage, setCountry, setFeatureFlag, setRemoteConfig, isLoading: settingsLoading } = useSettingsStore();
  const { setConnected, setReconnecting } = useRealtimeStore();
  const { setGlobalLoading } = useGlobalLoading();

  // Initialize application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setGlobalLoading(true, 'Initializing app...');
        setBootstrapping(true);

        // Check online status
        const isOnline = navigator.onLine;
        setOnline(isOnline);
        if (!isOnline) {
          console.warn('App started in offline mode');
        }

        // Check maintenance mode
        const maintenanceMode = false; // TODO: Fetch from config
        setMaintenanceMode(maintenanceMode);
        if (maintenanceMode) {
          console.warn('App is in maintenance mode');
        }

        // Initialize Telegram WebApp
        const tg = telegramSDK.getWebApp();
        if (tg) {
          // Expand to full height
          tg.expand();
          
          // Set theme
          const theme = telegramSDK.isDarkMode() ? 'dark' : 'light';
          
          // Get user data from Telegram
          const user = telegramSDK.getUser();
          if (user) {
            // TODO: Authenticate with Telegram data
            console.log('Telegram user:', user);
          }
        }

        // Load settings
        await loadSettings();

        // Initialize realtime connection
        await initializeRealtime();

        // Restore session
        await restoreSession();

        // Mark as initialized
        setInitialized(true);
        setIsInitialized(true);
        setBootstrapping(false);
        setGlobalLoading(false);

        console.log('App initialized successfully');
      } catch (error) {
        console.error('App initialization failed:', error);
        setGlobalLoading(false);
        setBootstrapping(false);
        toastStore.error('Failed to initialize app. Please refresh.');
      }
    };

    initializeApp();
  }, []);

  // Load user settings
  const loadSettings = async () => {
    try {
      // Load from localStorage first
      const savedLanguage = localStorage.getItem('language') || 'en';
      const savedCountry = localStorage.getItem('country') || 'US';
      
      setLanguage(savedLanguage);
      setCountry(savedCountry);

      // TODO: Fetch from server
      // const { data: settings } = await supabase.from('settings').select('*').single();
      // if (settings) {
      //   setLanguage(settings.language);
      //   setCountry(settings.country);
      //   setFeatureFlag('new_feature', settings.new_feature);
      // }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Initialize realtime subscriptions
  const initializeRealtime = async () => {
    try {
      // TODO: Set up realtime subscriptions
      // const channel = supabase
      //   .channel('global')
      //   .on('postgres_changes', { event: '*', schema: 'public' }, handleRealtimeUpdate)
      //   .subscribe();
      
      // setConnected(true);
      // setRealtimeChannel(channel);
    } catch (error) {
      console.error('Failed to initialize realtime:', error);
      setReconnecting(true);
    }
  };

  // Restore user session
  const restoreSession = async () => {
    try {
      setAuthLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        
        // Load user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setProfile(profile);
        }
      } else {
        // No session - user is guest
        resetAuth();
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      resetAuth();
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      toastStore.info('You are back online');
      // TODO: Sync pending data
    };

    const handleOffline = () => {
      setOnline(false);
      toastStore.warning('You are offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle visibility change (app backgrounding)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App came to foreground
        console.log('App resumed');
        // TODO: Refresh data, sync pending actions
      } else {
        // App went to background
        console.log('App paused');
        // TODO: Save state, pause timers
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Show loading screen during initialization
  if (!isInitialized || isLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppProvider;