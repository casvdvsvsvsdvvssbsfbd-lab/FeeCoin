'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useWalletStore } from '@/lib/stores/wallet-store';
import { walletDataService } from './services/wallet-data.service';
import { formatFC, formatRelativeTime } from '@/lib/utils/format';

const WITHDRAWAL_THRESHOLD = 5000;

// Pan gesture bounds for the card carousel
const CARD_DRAG = 160;

/** Compact FC formatter (no spaces, e.g. 1240) used inside the cards. */
function formatFloatFC(amount: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);
}

// ============================================================
// Virtual Card (bank-card style) — used for both Platform and
// Referral income sources. Distinguishing color is the signature:
//   platform = brass/gold, referral = teal-indigo.
// ============================================================
interface SpotlightCardProps {
  kind: 'platform' | 'referral';
  balance: number;
  maskedId: string;
  friends?: number;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ kind, balance, maskedId, friends = 0 }) => {
  const isPlatform = kind === 'platform';
  const label = isPlatform ? 'Platforma daromadi' : 'Referral daromadi';
  const holder = isPlatform ? 'FEECOIN' : 'FEECOIN · REFERRAL';

  return (
    <div className="relative h-full flex flex-col justify-between">
      {/* Top row: coin chip + wordmark */}
      <div className="flex items-start justify-between relative z-10">
        <div className="fc-chip">FC</div>
        <div className="fc-wordmark text-[11px] text-white/90 tracking-widest">{holder}</div>
      </div>

      {/* Balance */}
      <div className="relative z-10">
        <p className="text-[10px] text-white/70 uppercase tracking-wider mb-1">Balance</p>
        <p className={`mono-num text-[34px] leading-none font-bold ${
          isPlatform ? 'text-[#1a1405]' : 'text-[#F5F6F8]'
        }`}>
          {formatFloatFC(balance)}
          <span className="text-base ml-1 opacity-70">FC</span>
        </p>
      </div>

      {/* Bottom row: label + masked id */}
      <div className="flex items-end justify-between relative z-10">
        <div>
          <p className="text-[11px] font-semibold text-white/90">{label}</p>
          {!isPlatform && friends > 0 && (
            <p className="text-[10px] text-white/70 mt-0.5">{friends} ta do'st</p>
          )}
        </div>
        <p className="mono-num text-xs text-white/80">{maskedId}</p>
      </div>
    </div>
  );
};

export const WalletScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const {
    balance,
    pendingWithdrawals,
    transactionHistory,
    isLoading,
    error,
  } = useWalletStore();

  const [activeTab, setActiveTab] = useState<'history' | 'withdrawals'>('history');
  const [activeCard, setActiveCard] = useState<0 | 1>(0);

  const userId = user?.id || user?.user_id || '';

  const load = useCallback(() => {
    if (userId) {
      walletDataService.hydrateWallet(userId);
    } else {
      useWalletStore.getState().setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Wait for the auth session to be initialized before loading data, so RLS
    // queries run with a valid user session. If auth fails, the demo/guest
    // user still has an id and the wallet simply hydrates empty.
    if (!authLoading) {
      load();
    }
  }, [authLoading, userId, load]);

  // Derive platform (ads/tasks) vs referral earnings from the transaction history.
  const completedTx = transactionHistory.filter(
    (tx: any) => tx.type !== 'withdrawal' && tx.status === 'completed',
  );
  const platformEarned = completedTx
    .filter((tx: any) => tx.type === 'reward' || tx.type === 'deposit' || tx.type === 'fee')
    .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
  const referralEarned = completedTx
    .filter((tx: any) => tx.type === 'referral')
    .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);

  const totalEarned = platformEarned + referralEarned;
  const totalWithdrawn = transactionHistory
    .filter((tx: any) => tx.type === 'withdrawal' && tx.status === 'completed')
    .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);

  // Withdrawal goal progress
  const goalProgress = Math.min((balance / WITHDRAWAL_THRESHOLD) * 100, 100);

  // Approximate share splits for the "this week / this month" progress bars.
  const platformShare = totalEarned > 0 ? Math.round((platformEarned / totalEarned) * 100) : 100;
  const referralShare = Math.max(0, 100 - platformShare);

  // Masked user/account id for the bank-card feel.
  const accId = user?.id || 'demo';
  const shortId = accId.slice(-2).toUpperCase();
  const maskedId = `FC-••${shortId || '82'}`;

  const txIcon = (type: string) => {
    if (type === 'reward') return '📺';
    if (type === 'withdrawal') return '💳';
    if (type === 'referral') return '👥';
    if (type === 'deposit') return '💰';
    return '🎁';
  };

  return (
    <div className="min-h-screen bg-[#0D1117] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E7C767] to-[#8B6914] flex items-center justify-center text-sm font-bold text-[#0D1117]">
            {(user?.firstName || 'U')[0]}
          </div>
          <div>
            <p className="text-[10px] text-[#8890A0]">Assalomu alaykum</p>
            <p className="text-sm font-semibold text-[#F5F6F8]">
              {user?.firstName || 'Mehmon'} 👋
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
            <span className="text-sm">🔍</span>
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
            <span className="text-sm">🔔</span>
          </button>
        </div>
      </div>

      <p className="px-4 mt-1 mb-3 serif-display italic text-2xl text-[#F5F6F8]">
        Hamyon
      </p>

      <div className="px-4">
        {/* ── Card Carousel ── */}
        <div className="relative h-[196px] mb-6">
          <AnimatePresence initial={false}>
            {activeCard === 1 ? (
              <motion.div
                key="stack-platform"
                className="vc-card vc-gold absolute inset-0"
                initial={{ x: 0, scale: 0.94, y: 10, opacity: 0.7 }}
                animate={{ x: -12, scale: 0.94, y: 10, opacity: 0.55, zIndex: 1 }}
                exit={{ x: 0, scale: 0.96, y: 8, opacity: 0.6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <SpotlightCard kind="platform" balance={balance} maskedId={maskedId} />
              </motion.div>
            ) : (
              <motion.div
                key="stack-referral"
                className="vc-card vc-teal absolute inset-0"
                initial={{ x: 0, scale: 0.94, y: 10, opacity: 0.7 }}
                animate={{ x: -12, scale: 0.94, y: 10, opacity: 0.55, zIndex: 1 }}
                exit={{ x: 0, scale: 0.96, y: 8, opacity: 0.6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <SpotlightCard kind="referral" balance={referralEarned} maskedId={maskedId} friends={12} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active / front card */}
          {activeCard === 0 ? (
            <motion.div
              key="front-platform"
              className="vc-card vc-gold absolute inset-0 cursor-grab active:cursor-grabbing"
              initial={{ x: 120, scale: 0.9, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1, zIndex: 2 }}
              exit={{ x: -120, scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={CARD_DRAG}
              onDragEnd={(_, info) => {
                if (info.offset.x < -CARD_DRAG) setActiveCard(1);
              }}
            >
              <SpotlightCard kind="platform" balance={balance} maskedId={maskedId} />
            </motion.div>
          ) : (
            <motion.div
              key="front-referral"
              className="vc-card vc-teal absolute inset-0 cursor-grab active:cursor-grabbing"
              initial={{ x: -120, scale: 0.9, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1, zIndex: 2 }}
              exit={{ x: 120, scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={CARD_DRAG}
              onDragEnd={(_, info) => {
                if (info.offset.x > CARD_DRAG) setActiveCard(0);
              }}
            >
              <SpotlightCard
                kind="referral"
                balance={referralEarned}
                maskedId={maskedId}
                friends={12}
              />
            </motion.div>
          )}
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-1.5 -mt-2 mb-5">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setActiveCard(i as 0 | 1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCard === i ? 'w-5 bg-[#E7C767]' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* ── Total Balance Panel ── */}
        <motion.div
          className="rounded-2xl p-5 mb-4 bg-[#161B22] border border-white/8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p className="text-[10px] text-[#8890A0] uppercase tracking-wider">Jami balans</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="mono-num text-3xl font-bold text-[#F5F6F8]">
              {formatFloatFC(balance)}
            </span>
            <span className="text-xs font-bold text-[#2FB8A6] flex items-center gap-1">
              <span>▲</span> +4.2% shu hafta
            </span>
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t hairline">
            <div className="flex-1">
              <p className="text-[10px] text-[#8890A0]">Kutilayotgan</p>
              <p className="text-sm font-semibold text-[#F5F6F8]">
                {formatFC(pendingWithdrawals.reduce((sum: number, w: any) => sum + (w.amount || 0), 0))}
              </p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] text-[#8890A0]">Umumiy daromad</p>
              <p className="text-sm font-semibold text-[#2FB8A6]">{formatFC(totalEarned)}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { icon: '📺', label: 'Ishlash', tone: '#E7C767' },
            { icon: '🔄', label: 'Ayirboshlash', tone: '#2FB8A6' },
            { icon: '💳', label: 'Yechish', tone: '#F5F6F8' },
          ].map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-2">
              <button className="qa-btn">
                <span className="text-xl">{a.icon}</span>
              </button>
              <span className="text-[10px] font-semibold text-[#8890A0]">{a.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Sources (This Week / This Month) ── */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {[
            { label: 'Bu hafta' },
            { label: 'Bu oy' },
          ].map((slot, i) => (
            <div key={slot.label} className="rounded-2xl p-3 bg-[#161B22] border border-white/8">
              <p className="text-[10px] text-[#8890A0] mb-2">{slot.label}</p>
              <p className="mono-num text-sm font-bold text-[#F5F6F8] mb-2">{formatFloatFC(totalEarned)} FC</p>
              <div className="flex h-1.5 rounded-full overflow-hidden bg-white/5 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-[#E7C767] to-[#C9A227]"
                  initial={{ width: 0 }}
                  animate={{ width: `${platformShare}%` }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                />
                <motion.div
                  className="bg-gradient-to-r from-[#2FB8A6] to-[#134E4A]"
                  initial={{ width: 0 }}
                  animate={{ width: `${referralShare}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                />
              </div>
              <div className="flex items-center gap-2 text-[9px] text-[#8890A0]">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#E7C767]" /> Platforma</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#2FB8A6]" /> Referral</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Withdrawal Goal ── */}
        <motion.div
          className="rounded-2xl p-4 mb-4 bg-[#161B22] border border-white/8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#8890A0]">Keyingi yechib olish</p>
            <p className="mono-num text-xs font-bold text-[#E7C767]">
              {formatFloatFC(balance)} / {formatFC(WITHDRAWAL_THRESHOLD)}
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#E7C767] to-[#2FB8A6]"
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </div>
          <p className="text-[10px] text-[#8890A0] mt-2">
            {balance >= WITHDRAWAL_THRESHOLD
              ? 'Siz endi pul yechib olishingiz mumkin! 🎉'
              : `${formatFC(WITHDRAWAL_THRESHOLD - balance)} yig'ilsa yechib olish mumkin`}
          </p>
        </motion.div>

        {error && (
          <div className="rounded-2xl p-4 mb-4 bg-[#161B22] border border-red-500/20">
            <p className="text-xs text-[#FF6B6B]">Ma'lumot yuklashda xatolik: {error}</p>
          </div>
        )}

        {/* ── History / Withdrawals Tabs ── */}
        <div className="flex gap-1 mb-3">
          <button
            onClick={() => setActiveTab('history')}
            className={`filter-tab ${activeTab === 'history' ? 'active' : ''}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`filter-tab ${activeTab === 'withdrawals' ? 'active' : ''}`}
          >
            Withdrawals
          </button>
        </div>

        {activeTab === 'history' ? (
          isLoading ? (
            <div className="rounded-2xl p-8 bg-[#161B22] flex flex-col items-center justify-center border border-white/8">
              <div className="w-8 h-8 border-2 border-[#E7C767] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#8890A0] mt-3">Ma'lumot yuklanmoqda...</p>
            </div>
          ) : transactionHistory.length === 0 ? (
            <div className="rounded-2xl p-8 bg-[#161B22] flex flex-col items-center justify-center text-center border border-white/8">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-3">💳</div>
              <p className="text-sm font-semibold text-[#F5F6F8]">Hali tranzaksiyalar yo'q</p>
              <p className="text-xs text-[#8890A0] mt-1 max-w-[220px]">
                Reklama tomosha qiling yoki vazifalarni bajaring va birinchi daromadingizni oling!
              </p>
            </div>
          ) : (
            <div className="space-y-2 mb-20">
              {transactionHistory.map((tx: any, i: number) => (
                <motion.div
                  key={tx.id}
                  className="rounded-2xl p-3 bg-[#161B22] border border-white/8 flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.03 }}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                    tx.type === 'reward' ? 'bg-[#E7C767]/15' :
                    tx.type === 'referral' ? 'bg-[#2FB8A6]/15' :
                    tx.type === 'withdrawal' ? 'bg-[#FF3366]/10' : 'bg-[#E7C767]/10'
                  }`}>
                    {txIcon(tx.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#F5F6F8] truncate">{tx.description}</p>
                    <p className="text-[10px] text-[#8890A0]">{formatRelativeTime(tx.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`mono-num text-xs font-bold ${
                      tx.type === 'withdrawal' ? 'text-[#FF3366]' :
                      tx.type === 'referral' ? 'text-[#2FB8A6]' : 'text-[#E7C767]'
                    }`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}{formatFloatFC(tx.amount)}
                    </p>
                    <p className={`text-[10px] ${
                      tx.status === 'completed' ? 'text-[#2FB8A6]' :
                      tx.status === 'pending' ? 'text-[#E7C767]' : 'text-[#FF3366]'
                    }`}>{tx.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : isLoading ? (
          <div className="rounded-2xl p-8 bg-[#161B22] flex flex-col items-center justify-center border border-white/8">
            <div className="w-8 h-8 border-2 border-[#E7C767] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#8890A0] mt-3">Ma'lumot yuklanmoqda...</p>
          </div>
        ) : pendingWithdrawals.length === 0 ? (
          <div className="rounded-2xl p-8 bg-[#161B22] flex flex-col items-center justify-center text-center border border-white/8">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-3">🏦</div>
            <p className="text-sm font-semibold text-[#F5F6F8]">Hali yechib olishlar yo'q</p>
            <p className="text-xs text-[#8890A0] mt-1 max-w-[220px]">
              Balansingiz yetarli bo'lganda pul yechib olishingiz mumkin.
            </p>
          </div>
        ) : (
          <div className="space-y-2 mb-20">
            {pendingWithdrawals.map((w: any, i: number) => (
              <motion.div
                key={w.id}
                className="rounded-2xl p-3 bg-[#161B22] border border-white/8 flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FF3366]/10 flex items-center justify-center text-sm">💳</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#F5F6F8] truncate">{w.method || 'Withdrawal'}</p>
                  <p className="text-[10px] text-[#8890A0]">{formatRelativeTime(w.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="mono-num text-xs font-bold text-[#F5F6F8]">{formatFloatFC(w.amount)}</p>
                  <p className={`text-[10px] ${
                    w.status === 'completed' ? 'text-[#2FB8A6]' :
                    w.status === 'failed' ? 'text-[#FF3366]' : 'text-[#E7C767]'
                  }`}>{w.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
