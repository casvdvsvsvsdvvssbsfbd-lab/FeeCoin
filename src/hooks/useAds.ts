'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTelegramAuth } from './useTelegramAuth';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/stores/app-store';
import { toastStore } from '@/lib/notifications/toast-store';

// Declare global SDKs
declare global {
  interface Window {
    show_11548562?: (type?: string) => Promise<void>;
    AdsGram?: {
      init: (params: { blockId: string; debug?: boolean }) => {
        show: () => Promise<void>;
      };
    };
  }
}

export type AdNetwork = 'monetag' | 'adsgram';

export interface AdConfig {
  network: AdNetwork;
  rewardAmount: number;
  blockId?: string; // For AdsGram
  placement?: string; // For Monetag
}

export interface AdResult {
  success: boolean;
  rewardAmount: number;
  network: AdNetwork;
  error?: string;
}

const AD_CONFIGS: Record<AdNetwork, AdConfig> = {
  monetag: {
    network: 'monetag',
    rewardAmount: 50,
    placement: 'pop',
  },
  adsgram: {
    network: 'adsgram',
    rewardAmount: 30,
    blockId: '42176',
  },
};

export function useAds() {
  const { user, isInTelegram } = useTelegramAuth();
  const { energy, setEnergy } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAd, setCurrentAd] = useState<AdNetwork | null>(null);
  const [lastResult, setLastResult] = useState<AdResult | null>(null);
  const isShowingAd = useRef(false);

  // Check if user has enough energy
  const canShowAd = useCallback(() => {
    return energy > 0;
  }, [energy]);

  // Deduct energy after ad view
  const deductEnergy = useCallback(() => {
    setEnergy(Math.max(0, energy - 10));
  }, [energy, setEnergy]);

  // Add coins via Supabase RPC
  const addCoinsToBalance = useCallback(async (userId: string, amount: number, source: string): Promise<number | null> => {
    const { data, error } = await supabase.rpc('add_coins', {
      p_user_id: userId,
      p_amount: amount,
      p_source: source,
    });

    if (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
    return data;
  }, []);

  // Show Monetag ad
  const showMonetagAd = useCallback(async (userId: string): Promise<AdResult> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.show_11548562) {
        resolve({
          success: false,
          rewardAmount: 0,
          network: 'monetag',
          error: 'Monetag SDK not loaded',
        });
        return;
      }

      window.show_11548562('pop').then(async () => {
        console.log('Monetag ad completed');
        
        try {
          await addCoinsToBalance(userId, 50, 'monetag');
          deductEnergy();
          resolve({
            success: true,
            rewardAmount: 50,
            network: 'monetag',
          });
        } catch (e) {
          console.error('Failed to add coins via backend:', e);
          // Still resolve as success for UX, but log error
          deductEnergy();
          resolve({
            success: true,
            rewardAmount: 50,
            network: 'monetag',
            error: 'Backend sync failed, but ad was shown',
          });
        }
      }).catch((err) => {
        resolve({
          success: false,
          rewardAmount: 0,
          network: 'monetag',
          error: err?.message || 'Monetag ad failed',
        });
      });
    });
  }, [addCoinsToBalance, deductEnergy]);

  // Show AdsGram ad
  const showAdsGramAd = useCallback(async (userId: string): Promise<AdResult> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.AdsGram) {
        resolve({
          success: false,
          rewardAmount: 0,
          network: 'adsgram',
          error: 'AdsGram SDK not loaded',
        });
        return;
      }

      try {
        const AdController = window.AdsGram.init({ blockId: "42176", debug: false });
        
        AdController.show().then(async () => {
          console.log('AdsGram ad completed');
          
          try {
            await addCoinsToBalance(userId, 30, 'adsgram');
            deductEnergy();
            resolve({
              success: true,
              rewardAmount: 30,
              network: 'adsgram',
            });
          } catch (e) {
            console.error('Failed to add coins via backend:', e);
            deductEnergy();
            resolve({
              success: true,
              rewardAmount: 30,
              network: 'adsgram',
              error: 'Backend sync failed, but ad was shown',
            });
          }
        }).catch((err) => {
          resolve({
            success: false,
            rewardAmount: 0,
            network: 'adsgram',
            error: err?.message || 'AdsGram ad failed',
          });
        });
      } catch (err) {
        resolve({
          success: false,
          rewardAmount: 0,
          network: 'adsgram',
          error: err instanceof Error ? err.message : 'AdsGram init failed',
        });
      }
    });
  }, [addCoinsToBalance, deductEnergy]);

  // Main function to show ad
  const showAd = useCallback(async (network: AdNetwork = 'monetag'): Promise<AdResult> => {
    if (isShowingAd.current) {
      return {
        success: false,
        rewardAmount: 0,
        network,
        error: 'Ad already showing',
      };
    }

    if (!user) {
      return {
        success: false,
        rewardAmount: 0,
        network,
        error: 'User not authenticated',
      };
    }

    if (!canShowAd()) {
      return {
        success: false,
        rewardAmount: 0,
        network,
        error: 'Not enough energy',
      };
    }

    isShowingAd.current = true;
    setIsLoading(true);
    setCurrentAd(network);

    try {
      let result: AdResult;

      if (network === 'monetag') {
        result = await showMonetagAd(user.id);
      } else {
        result = await showAdsGramAd(user.id);
      }

      setLastResult(result);

      if (result.success) {
        const successMsg = `${network === 'monetag' ? 'Monetag' : 'AdsGram'} reklama ko'rildi! +${result.rewardAmount} coin`;
        toastStore.success(successMsg);
      } else {
        const errorMsg = result.error || `${network} reklama ko'rsatilmadi`;
        toastStore.error(errorMsg);
      }

      return result;
    } finally {
      isShowingAd.current = false;
      setIsLoading(false);
      setCurrentAd(null);
    }
  }, [user, canShowAd, showMonetagAd, showAdsGramAd]);

  // Auto-select best available network
  const showBestAd = useCallback(async (): Promise<AdResult> => {
    // Prefer Monetag first (higher reward), fallback to AdsGram
    const hasMonetag = typeof window !== 'undefined' && !!window.show_11548562;
    const hasAdsGram = typeof window !== 'undefined' && !!window.AdsGram;

    if (hasMonetag) {
      return showAd('monetag');
    } else if (hasAdsGram) {
      return showAd('adsgram');
    } else {
      const errorMsg = 'Hech qanday reklama SDK yuklanmagan';
      toastStore.error(errorMsg);
      return {
        success: false,
        rewardAmount: 0,
        network: 'monetag',
        error: errorMsg,
      };
    }
  }, [showAd]);

  return {
    // State
    isLoading,
    currentAd,
    lastResult,
    energy,
    canShowAd: canShowAd(),
    
    // Actions
    showAd,
    showBestAd,
    showMonetagAd: () => showAd('monetag'),
    showAdsGramAd: () => showAd('adsgram'),
    
    // Network availability
    hasMonetag: typeof window !== 'undefined' && !!window.show_11548562,
    hasAdsGram: typeof window !== 'undefined' && !!window.AdsGram,
    isInTelegram,
  };
}