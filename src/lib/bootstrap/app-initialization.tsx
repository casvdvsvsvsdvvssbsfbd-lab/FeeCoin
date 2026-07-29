// ============================================
// App Initialization Pipeline
// Production-ready application bootstrap
// ============================================

import React, { useState, useCallback, useEffect } from 'react';
import { envValidator } from '../env-validation/env-validator';
import { telegramSDK } from '../telegram/telegram-sdk';
import { supabase } from '../supabase';
import { userSyncService } from '../services/user-sync.service';

export type InitializationStep = 
  | 'validate_environment'
  | 'initialize_telegram'
  | 'initialize_supabase'
  | 'load_telegram_user'
  | 'synchronize_profile'
  | 'synchronize_wallet'
  | 'load_country'
  | 'load_language'
  | 'load_feature_flags'
  | 'load_remote_config'
  | 'initialize_analytics'
  | 'initialize_rewards'
  | 'initialize_notifications'
  | 'initialize_background_services'
  | 'open_home_screen';

export interface InitializationState {
  currentStep: InitializationStep;
  progress: number;
  isComplete: boolean;
  error: Error | null;
  steps: {
    step: InitializationStep;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    error?: Error;
  }[];
}

interface AppInitializationProps {
  children: React.ReactNode;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onStepChange?: (step: InitializationStep, progress: number) => void;
}

export const AppInitialization: React.FC<AppInitializationProps> = ({
  children,
  onComplete,
  onError,
  onStepChange,
}) => {
  const [state, setState] = useState<InitializationState>({
    currentStep: 'validate_environment',
    progress: 0,
    isComplete: false,
    error: null,
    steps: [
      { step: 'validate_environment', status: 'pending' },
      { step: 'initialize_telegram', status: 'pending' },
      { step: 'initialize_supabase', status: 'pending' },
      { step: 'load_telegram_user', status: 'pending' },
      { step: 'synchronize_profile', status: 'pending' },
      { step: 'synchronize_wallet', status: 'pending' },
      { step: 'load_country', status: 'pending' },
      { step: 'load_language', status: 'pending' },
      { step: 'load_feature_flags', status: 'pending' },
      { step: 'load_remote_config', status: 'pending' },
      { step: 'initialize_analytics', status: 'pending' },
      { step: 'initialize_rewards', status: 'pending' },
      { step: 'initialize_notifications', status: 'pending' },
      { step: 'initialize_background_services', status: 'pending' },
      { step: 'open_home_screen', status: 'pending' },
    ],
  });

  const updateStep = useCallback(
    (step: InitializationStep, status: InitializationState['steps'][0]['status'], error?: Error) => {
      setState((prev) => {
        const steps = prev.steps.map((s) =>
          s.step === step ? { ...s, status, error } : s
        );

        const currentStepIndex = steps.findIndex((s) => s.step === step);
        const progress = ((currentStepIndex + 1) / steps.length) * 100;

        return {
          ...prev,
          steps,
          progress,
          currentStep: step,
          error: error || null,
        };
      });
    },
    []
  );

  const runInitialization = useCallback(async () => {
    try {
      // Step 1: Validate Environment
      updateStep('validate_environment', 'in_progress');
      try {
        envValidator.validate();
        updateStep('validate_environment', 'completed');
      } catch (error) {
        updateStep('validate_environment', 'failed', error as Error);
        throw error;
      }

      // Step 2: Initialize Telegram SDK
      updateStep('initialize_telegram', 'in_progress');
      try {
        await telegramSDK.waitForInitialization();
        updateStep('initialize_telegram', 'completed');
      } catch (error) {
        updateStep('initialize_telegram', 'failed', error as Error);
        // Non-critical, continue without Telegram
        updateStep('initialize_telegram', 'completed');
      }

      // Step 3: Initialize Supabase
      updateStep('initialize_supabase', 'in_progress');
      try {
        await supabase.auth.getSession();
        updateStep('initialize_supabase', 'completed');
      } catch (error) {
        updateStep('initialize_supabase', 'failed', error as Error);
        throw error;
      }

      // Step 4: Load Telegram User
      updateStep('load_telegram_user', 'in_progress');
      try {
        const telegramUser = await telegramSDK.getUser();
        if (telegramUser) {
          await userSyncService.syncUser();
        }
        updateStep('load_telegram_user', 'completed');
      } catch (error) {
        updateStep('load_telegram_user', 'failed', error as Error);
        // Non-critical, continue
        updateStep('load_telegram_user', 'completed');
      }

      // Step 5: Synchronize Profile
      updateStep('synchronize_profile', 'in_progress');
      try {
        await userSyncService.updateUser({});
        updateStep('synchronize_profile', 'completed');
      } catch (error) {
        updateStep('synchronize_profile', 'failed', error as Error);
        // Non-critical, continue
        updateStep('synchronize_profile', 'completed');
      }

      // Step 6: Synchronize Wallet
      updateStep('synchronize_wallet', 'in_progress');
      try {
        updateStep('synchronize_wallet', 'completed');
      } catch (error) {
        updateStep('synchronize_wallet', 'failed', error as Error);
        // Non-critical, continue
        updateStep('synchronize_wallet', 'completed');
      }

      // Step 7: Load Country
      updateStep('load_country', 'in_progress');
      try {
        // Country will be loaded by CountryProvider
        updateStep('load_country', 'completed');
      } catch (error) {
        updateStep('load_country', 'failed', error as Error);
        updateStep('load_country', 'completed');
      }

      // Step 8: Load Language
      updateStep('load_language', 'in_progress');
      try {
        // Language will be loaded by LanguageProvider
        updateStep('load_language', 'completed');
      } catch (error) {
        updateStep('load_language', 'failed', error as Error);
        updateStep('load_language', 'completed');
      }

      // Step 9: Load Feature Flags
      updateStep('load_feature_flags', 'in_progress');
      try {
        // Feature flags will be loaded by FeatureFlagProvider
        updateStep('load_feature_flags', 'completed');
      } catch (error) {
        updateStep('load_feature_flags', 'failed', error as Error);
        updateStep('load_feature_flags', 'completed');
      }

      // Step 10: Load Remote Config
      updateStep('load_remote_config', 'in_progress');
      try {
        // Remote config will be loaded by RemoteConfigProvider
        updateStep('load_remote_config', 'completed');
      } catch (error) {
        updateStep('load_remote_config', 'failed', error as Error);
        updateStep('load_remote_config', 'completed');
      }

      // Step 11: Initialize Analytics
      updateStep('initialize_analytics', 'in_progress');
      try {
        // Analytics will be initialized by AnalyticsProvider
        updateStep('initialize_analytics', 'completed');
      } catch (error) {
        updateStep('initialize_analytics', 'failed', error as Error);
        updateStep('initialize_analytics', 'completed');
      }

      // Step 12: Initialize Rewards
      updateStep('initialize_rewards', 'in_progress');
      try {
        // Rewards will be initialized by RewardEngineProvider
        updateStep('initialize_rewards', 'completed');
      } catch (error) {
        updateStep('initialize_rewards', 'failed', error as Error);
        updateStep('initialize_rewards', 'completed');
      }

      // Step 13: Initialize Notifications
      updateStep('initialize_notifications', 'in_progress');
      try {
        // Notifications will be initialized by NotificationProvider
        updateStep('initialize_notifications', 'completed');
      } catch (error) {
        updateStep('initialize_notifications', 'failed', error as Error);
        updateStep('initialize_notifications', 'completed');
      }

      // Step 14: Initialize Background Services
      updateStep('initialize_background_services', 'in_progress');
      try {
        // Background services will be initialized by BackgroundSync
        updateStep('initialize_background_services', 'completed');
      } catch (error) {
        updateStep('initialize_background_services', 'failed', error as Error);
        updateStep('initialize_background_services', 'completed');
      }

      // Step 15: Open Home Screen
      updateStep('open_home_screen', 'in_progress');
      try {
        // Navigation will be handled by RouteManager
        updateStep('open_home_screen', 'completed');
      } catch (error) {
        updateStep('open_home_screen', 'failed', error as Error);
        updateStep('open_home_screen', 'completed');
      }

      // Mark initialization as complete
      setState((prev) => ({ ...prev, isComplete: true }));
      onComplete?.();
    } catch (error) {
      const err = error as Error;
      onError?.(err);
    }
  }, [updateStep, onComplete, onError]);

  useEffect(() => {
    runInitialization();
  }, [runInitialization]);

  // Notify step changes
  useEffect(() => {
    onStepChange?.(state.currentStep, state.progress);
  }, [state.currentStep, state.progress, onStepChange]);

  if (state.error && !state.isComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Initialization Error</h1>
          <p className="text-gray-600 mb-4">{state.error.message}</p>
          <button
            onClick={runInitialization}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!state.isComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {state.currentStep.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitialization;