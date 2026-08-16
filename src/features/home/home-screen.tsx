'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationActions } from '../../shared/hooks/use-navigation';
import { useAuthStore } from '../../lib/stores/auth-store';
import { useWalletStore } from '../../lib/stores/wallet-store';
import { useAppStore } from '../../lib/stores/app-store';
import { homeScreenDataService } from './services/home-data.service';
import { formatFC } from '../../lib/utils/format';
import { toastStore } from '../../lib/notifications/toast-store';
import { supabase } from '../../lib/supabase/client';

// Declare Monetag and AdsGram on window interface
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

// Add coins to balance via Supabase RPC
const addCoinsToBalance = async (userId: string, amount: number, source: string): Promise<number | null> => {
  const { data, error } = await supabase.rpc('add_coins', {
    p_user_id: userId,
    p_amount: amount,
    p_source: source
  });
  
  if (error) {
    console.error('Error adding coins:', error);
    throw error;
  }
  return data;
};

// Show Monetag ad and add coins after completion
export const showMonetagAd = async (userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.show_11548562) {
      console.error('Monetag SDK not loaded');
      resolve(false);
      return;
    }
    
    // SDK chaqirish
    window.show_11548562().then(async () => {
      // Reklama ko'rilgandan keyin
      console.log('Monetag ad completed');
      
      // Backend'ga coin qo'shish so'rovi
      try {
        await addCoinsToBalance(userId, 50, 'monetag');
        resolve(true);
      } catch (e) {
        // Agar backend ishlamasa, local state'da ko'rsatish
        console.error('Failed to add coins via backend:', e);
        resolve(true);
      }
    }).catch(() => {
      resolve(false);
    });
  });
};

// Show AdsGram ad and add coins after completion
export const showAdsGramAd = async (userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.AdsGram) {
      console.error('AdsGram SDK not loaded');
      resolve(false);
      return;
    }
    
    const AdController = window.AdsGram.init({ blockId: "42176" });
    
    AdController.show().then(async () => {
      // Reklama ko'rilgandan keyin
      console.log('AdsGram ad completed');
      
      try {
        await addCoinsToBalance(userId, 30, 'adsgram');
        resolve(true);
      } catch (e) {
        console.error('Failed to add coins via backend:', e);
        resolve(true);
      }
    }).catch(() => {
      resolve(false);
    });
  });
};

const EarnButton: React.FC = () => {
  const [isEarning, setIsEarning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const auth = useAuthStore();
  const wallet = useWalletStore();

  const handleEarnMonetag = async () => {
    if (isEarning) return;
    const userId = auth.profile?.id;
    if (!userId) {
      toastStore.error("Foydalanuvchi topilmadi");
      return;
    }
    
    setIsEarning(true);
    setStatusMessage(null);

    try {
      const success = await showMonetagAd(userId);
      if (success) {
        const successMsg = "Monetag reklama ko'rildi! 50 coin qo'shildi";
        setStatusMessage({ text: successMsg, type: 'success' });
        toastStore.success(successMsg);
        // Refresh wallet balance
        wallet.fetchBalance();
      } else {
        const errorMsg = "Monetag reklama ko'rsatilmadi";
        setStatusMessage({ text: errorMsg, type: 'error' });
        toastStore.error(errorMsg);
      }
    } catch (e: any) {
      console.error("Error displaying Monetag ad:", e);
      const errorMsg = `Monetag reklama topilmadi: ${e.message}`;
      setStatusMessage({ text: errorMsg, type: 'error' });
      toastStore.error(errorMsg);
    } finally {
      setIsEarning(false);
    }
  };

  const handleEarnAdsGram = async () => {
    if (isEarning) return;
    const userId = auth.profile?.id;
    if (!userId) {
      toastStore.error("Foydalanuvchi topilmadi");
      return;
    }
    
    setIsEarning(true);
    setStatusMessage(null);

    if (typeof window === 'undefined' || !window.AdsGram) {
      const errorMsg = "AdsGram SDK topilmadi";
      setStatusMessage({ text: errorMsg, type: 'error' });
      toastStore.error(errorMsg);
      setIsEarning(false);
      return;
    }

    try {
      const success = await showAdsGramAd(userId);
      if (success) {
        const successMsg = "AdsGram reklama ko'rildi! 30 coin qo'shildi";
        setStatusMessage({ text: successMsg, type: 'success' });
        toastStore.success(successMsg);
        // Refresh wallet balance
        wallet.fetchBalance();
      } else {
        const errorMsg = "AdsGram reklama ko'rsatilmadi";
        setStatusMessage({ text: errorMsg, type: 'error' });
        toastStore.error(errorMsg);
      }
    } catch (e: any) {
      console.error("Error displaying AdsGram ad:", e);
      const errorMsg = `AdsGram reklama ko'rsatishda xatolik: ${e.message || e}`;
      setStatusMessage({ text: errorMsg, type: 'error' });
      toastStore.error(errorMsg);
    } finally {
      setIsEarning(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-4 gap-4">
      <div className="flex gap-4">
        {/* Monetag Button */}
        <motion.button
          onClick={handleEarnMonetag}
          disabled={isEarning}
          whileTap={{ scale: 0.9 }}
          className={`
            w-36 h-36 rounded-full flex flex-col items-center justify-center
            bg-gradient-to-br from-[#00FF88] to-[#00d4aa]
            shadow-[0_0_40px_rgba(0,255,136,0.3)]
            ${isEarning ? 'animate-pulse opacity-80 cursor-not-allowed' : ''}
            transition-all duration-300
          `}
        >
          <motion.span
            className="text-2xl font-black text-[#0A0E14]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isEarning ? '✦' : '▶'}
          </motion.span>
          <span className="text-[10px] font-bold text-[#0A0E14]/70 mt-1">
            MONETAG
          </span>
        </motion.button>

        {/* AdsGram Button */}
        <motion.button
          onClick={handleEarnAdsGram}
          disabled={isEarning}
          whileTap={{ scale: 0.9 }}
          className={`
            w-36 h-36 rounded-full flex flex-col items-center justify-center
            bg-gradient-to-br from-[#00BFFF] to-[#007bff]
            shadow-[0_0_40px_rgba(0,191,255,0.3)]
            ${isEarning ? 'animate-pulse opacity-80 cursor-not-allowed' : ''}
            transition-all duration-300
          `}
        >
          <motion.span
            className="text-2xl font-black text-[#0A0E14]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isEarning ? '✦' : '▶'}
          </motion.span>
          <span className="text-[10px] font-bold text-[#0A0E14]/70 mt-1">
            ADSGRAM
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-center max-w-xs ${
              statusMessage.type === 'success'
                ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HomeScreen: React.FC = () => {
  const { navigate } = useNavigationActions();
  const user = useAuthStore((state) => state.profile);
  const wallet = useWalletStore((state) => state);
  const app = useAppStore((state) => state);
  const [recentRewards, setRecentRewards] = useState<any[]>([]);
  const [earnings, setEarnings] = useState({ today: 0, weekly: 0, monthly: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      try {
        const data = await homeScreenDataService.loadHomeScreenData(userId);
        if (cancelled) return;
        setRecentRewards(data.recentRewards);
        setEarnings(data.earnings);
        if (data.wallet.availableFC > 0) {
          wallet.setBalance(data.wallet.availableFC);
          wallet.setFcBalance(data.wallet.availableFC);
        }
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const displayUser = {
    firstName: user?.first_name || 'User',
    lastName: user?.last_name || '',
    username: user?.username || 'user',
  };

  const streak = app.streak || 0;

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00BFFF] flex items-center justify-center text-sm font-bold text-[#0A0E14]">
              {displayUser.firstName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{displayUser.firstName} {displayUser.lastName}</p>
              <p className="text-xs text-white/40">@{displayUser.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              <span className="text-sm">🔔</span>
            </button>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="mt-3 flex items-center gap-2">
          <div className="glass-card px-3 py-1.5 flex items-center gap-2">
            <span className="text-base">🔥</span>
            <span className="text-xs font-bold text-white">{streak} kunlik streak</span>
          </div>
        </div>
      </div>

      <div className="px-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {/* Balance Card */}
        <motion.div
          className="glass-card p-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Mavjud balans</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#f0b90b] tabular-nums">{formatFC(wallet.balance)}</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div>
              <p className="text-[10px] text-white/40">Energy</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 h-1.5 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#00BFFF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${app.energy}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-xs font-semibold text-white/70">{app.energy}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40">Kutilayotgan</p>
              <p className="text-xs font-semibold text-white/70">{formatFC(0)}</p>
            </div>
          </div>
        </motion.div>

        {/* Earnings Row */}
        <motion.div
          className="flex gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Bugun', value: earnings.today, color: '#00FF88' },
            { label: 'Hafta', value: earnings.weekly, color: '#00BFFF' },
            { label: 'Oy', value: earnings.monthly, color: '#f0b90b' },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 glass-card p-3 text-center">
              <p className="text-[10px] text-white/40">{stat.label}</p>
              <p className="text-sm font-bold mt-1 tabular-nums" style={{ color: stat.color }}>
                {formatFC(stat.value)}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Earn Button */}
        <EarnButton />

        {/* Quick Actions */}
        <motion.div
          className="flex gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: '📋', label: 'Tasks', target: 'tasks' as const },
            { icon: '👥', label: 'Referral', target: 'referral' as const },
            { icon: '🏆', label: 'Missions', target: 'missions' as const },
          ].map((action) => (
            <div
              key={action.label}
              className="flex-1 glass-card p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-white/5 transition-all"
              onClick={() => navigate(action.target)}
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-[10px] font-semibold text-white/60">{action.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <div className="mb-4">
          <p className="section-title mb-3 px-1">Yaqin faoliyat</p>
          {recentRewards.length > 0 ? recentRewards.slice(0, 4).map((reward, i) => (
            <motion.div
              key={reward.id}
              className="glass-card p-3 mb-2 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <span className="text-lg">{reward.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{reward.description}</p>
                <p className="text-[10px] text-white/40">{reward.timestamp}</p>
              </div>
              <span className="text-xs font-bold text-[#00FF88]">+{formatFC(reward.amount)}</span>
            </motion.div>
          )) : (
            <div className="glass-card p-4 text-center text-white/40 text-xs">
              Yaqin faoliyat yo'q
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
