'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/shared/components/ui/glass-card';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useReferralStore } from '@/lib/stores/referral-store';
import { referralDataService } from './services/referral-data.service';
import { useNavigationActions } from '@/shared/hooks/use-navigation';
import { formatFC } from '@/lib/utils/format';

const StatusBadge: React.FC<{ status: 'pending' | 'active' | 'completed' }> = ({ status }) => {
  const styles: Record<string, string> = {
    completed: 'bg-[#00FF88]/15 text-[#00FF88]',
    active: 'bg-[#00BFFF]/15 text-[#00BFFF]',
    pending: 'bg-[#f0b90b]/15 text-[#f0b90b]',
  };
  const labels: Record<string, string> = {
    completed: 'Faol',
    active: 'Faol',
    pending: 'Kutilmoqda',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[status] || styles.pending}`}>
      {labels[status] || 'Kutilmoqda'}
    </span>
  );
};

export const ReferralScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const {
    referralCode,
    referralLink,
    totalReferrals,
    activeReferrals,
    referralEarnings,
    referrals,
    isLoading,
    error,
  } = useReferralStore();

  const { navigate } = useNavigationActions();
  const [copiedField, setCopiedField] = useState<'code' | 'link' | null>(null);

  const userId = user?.id || user?.user_id || '';

  const load = useCallback(() => {
    if (userId) {
      // Auto-generates a code if missing (also for demo user) and loads real data.
      referralDataService.loadReferralData(userId);
    }
  }, [userId]);

  useEffect(() => {
    // Wait until the Supabase auth session is fully initialized (initializeAuthSession
    // flips auth isLoading true -> false when sign-in completes). This avoids a race
    // where the referral insert runs before the session exists, which would fail RLS
    // and fall back to offline storage.
    if (!authLoading && userId) {
      load();
    }
  }, [authLoading, userId, load]);

  const copyToClipboard = async (text: string, field: 'code' | 'link') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.warn('[Referral] Copy failed:', e);
    }
  };

  const shareLink = async () => {
    if (referralLink) {
      try {
        if (navigator.share) {
          await navigator.share({ title: 'Watch to Earn', text: 'Join me on Watch to Earn!', url: referralLink });
          return;
        }
      } catch (e) {
        // user cancelled share - fall through to copy
      }
      await copyToClipboard(referralLink, 'link');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Referral</h1>
          <p className="text-xs text-white/40 mt-1">Do'stlaringizni taklif qiling va birga pul ishlang</p>
        </div>
        <button
          onClick={() => navigate('home')}
          className="w-9 h-9 rounded-xl bg-white/5 text-white text-sm flex items-center justify-center active:scale-95 transition-all"
          aria-label="Orqaga"
        >
          ✕
        </button>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard glow="green">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-black text-[#00FF88]">{isLoading ? '—' : totalReferrals}</p>
                <p className="text-[10px] text-white/40">Taklif qilingan</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#00BFFF]">{isLoading ? '—' : activeReferrals}</p>
                <p className="text-[10px] text-white/40">Faol</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#f0b90b]">{isLoading ? '—' : formatFC(referralEarnings)}</p>
                <p className="text-[10px] text-white/40">Topilgan</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Referral Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <p className="text-xs text-white/40 mb-2">Sizning referral kodingiz</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/5 rounded-xl px-4 py-3">
                <p className="text-sm font-bold text-white tracking-wider">
                  {isLoading ? 'Yuklanmoqda...' : referralCode || 'Kod yaratilmoqda...'}
                </p>
              </div>
              <button
                onClick={() => referralCode && copyToClipboard(referralCode, 'code')}
                disabled={!referralCode}
                className="px-4 py-3 rounded-xl bg-[#00FF88] text-[#0A0E14] text-xs font-bold disabled:opacity-40 active:scale-95 transition-all"
              >
                {copiedField === 'code' ? '✓ Nusxalandi' : 'Nusxalash'}
              </button>
            </div>
            {referralLink && (
              <p className="mt-2 text-[10px] text-white/30 truncate">{referralLink}</p>
            )}
          </GlassCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => referralLink && copyToClipboard(referralCode || '', 'code')}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#00FF88] to-[#00d4aa] text-[#0A0E14] text-sm font-bold shadow-[0_0_20px_rgba(0,255,136,0.2)] active:scale-95 transition-all"
          >
            Do'stni taklif qilish
          </button>
          <button
            onClick={shareLink}
            className="flex-1 py-3 rounded-2xl bg-white/5 text-white text-sm font-bold active:scale-95 transition-all"
          >
            Havolani ulashish
          </button>
        </motion.div>

        {/* Rewards Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <p className="text-xs font-semibold text-white mb-3">Referral mukofotlari</p>
            <div className="space-y-2">
              {[
                { level: '1-daraja', reward: '5,000 FC', desc: "To'g'ridan-to'g'ri taklif" },
                { level: '2-daraja', reward: '2,000 FC', desc: 'Ularning taklifi' },
                { level: '3-daraja', reward: '1,000 FC', desc: 'Uchinchi daraja' },
                { level: 'Rank bonus', reward: '50,000 FC', desc: 'Haftalik eng yaxshi taklif qiluvchi' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-xs text-white/70">{r.level}</p>
                    <p className="text-[10px] text-white/30">{r.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-[#00FF88]">+{r.reward}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Invited Friends List / Empty state */}
        <div>
          <p className="text-xs font-semibold text-white mb-3 px-1">Taklif qilingan do'stlar</p>

          {error && (
            <div className="glass-card p-4 mb-3">
              <p className="text-xs text-[#FF6B6B]">Ma'lumot yuklashda xatolik: {error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-white/40 mt-3">Ma'lumot yuklanmoqda...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-3">👥</div>
              <p className="text-sm font-semibold text-white">Hali hech kimni taklif qilmadingiz</p>
              <p className="text-xs text-white/40 mt-1 max-w-[220px]">
                Referral kodingizni do'stlaringiz bilan ulashing va ular qo'shilganda mukofot oling!
              </p>
            </div>
          ) : (
            <div className="glass-card p-4 space-y-3">
              {referrals.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/70 uppercase">
                      {(r.username || '?')[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">@{r.username}</p>
                      <p className="text-[10px] text-white/30">
                        {new Date(r.joinedAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#00FF88]">+{formatFC(r.earnings)}</span>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
