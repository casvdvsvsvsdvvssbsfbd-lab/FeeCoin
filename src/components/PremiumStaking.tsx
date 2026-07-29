import React, { useState } from 'react';
import { usePlayer } from '../context/GameContext';

export function PremiumStaking() {
  const { player, activeStakes, stakeBalance, loadingStakes } = usePlayer();
  const [amount, setAmount] = useState('');
  const [stakeError, setStakeError] = useState('');
  const [stakingStatus, setStakingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleStake = async () => {
    setStakeError('');
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      setStakeError('Minimum staking amount is 100 FEE');
      return;
    }
    if (!player || numAmount > player.fee_balance) {
      setStakeError('Insufficient balance');
      return;
    }

    setStakingStatus('loading');
    try {
      await stakeBalance(numAmount);
      setStakingStatus('success');
      setAmount('');
      setTimeout(() => setStakingStatus('idle'), 2000);
    } catch (err: any) {
      setStakeError(err.message || 'Staking failed');
      setStakingStatus('error');
      setTimeout(() => setStakingStatus('idle'), 3000);
    }
  };

  const calculateEndDate = (endDate: string) => {
    const d = new Date(endDate);
    return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  return (
    <div className="space-y-5">
      {/* HEADER CARD */}
      <div className="premium-card p-6 text-center relative overflow-hidden card-glow-hover">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-36 bg-[#F7C948]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative w-[60px] h-[60px] mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-[#F7C948]/10 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F7C948]/15 to-[#F59E0B]/5 border-2 border-[#F7C948]/20 flex items-center justify-center backdrop-blur-[8px]" style={{ boxShadow: '0 0 30px rgba(247, 201, 72, 0.2)' }}>
            <div className="absolute inset-0 rounded-full bg-[#F7C948]/5 blur-sm"></div>
            <i className="fa-solid fa-lock text-xl text-[#F7C948] glow-yellow relative z-10"></i>
          </div>
        </div>
        
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Premium Staking</h3>
        <p className="text-xs text-[#9CA3AF] mt-2 font-medium max-w-[240px] mx-auto leading-relaxed">
          30 kunlik muddatga +20% foiz bilan
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 glass-badge px-4 py-2">
          <i className="fa-solid fa-percent text-[#22C55E] text-xs"></i>
          <span className="text-[#22C55E] font-extrabold text-xs">20% APY</span>
        </div>
      </div>

      {/* STAKE FORM */}
      <div className="premium-card p-6 card-glow-hover">
        <div className="flex items-center space-x-2 mb-5">
          <div className="section-title-line"></div>
          <h4 className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest">Yangi staking</h4>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">Miqdor (FEE)</span>
            <span className="text-[9px] text-[#9CA3AF]">
              Balans: <span className="text-white font-bold">{Number(player?.fee_balance || 0).toLocaleString('uz-UZ')} FEE</span>
            </span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100 FEE minimum"
            className="premium-input w-full"
            min="100"
            step="1"
          />
        </div>

        {stakeError && (
          <div className="mb-3 p-3 bg-[#EF4444]/10 border border-[#EF4444]/15 rounded-xl">
            <p className="text-[10px] text-[#EF4444] font-bold text-center">{stakeError}</p>
          </div>
        )}

        {stakingStatus === 'success' && (
          <div className="mb-3 p-3 bg-[#22C55E]/10 border border-[#22C55E]/15 rounded-xl">
            <p className="text-[10px] text-[#22C55E] font-bold text-center flex items-center justify-center gap-1.5">
              <i className="fa-solid fa-circle-check"></i>
              Staking muvaffaqiyatli!
            </p>
          </div>
        )}

        <button
          onClick={handleStake}
          disabled={stakingStatus === 'loading'}
          className="w-full py-[14px] btn-primary text-xs uppercase tracking-widest flex items-center justify-center gap-2 ripple"
        >
          {stakingStatus === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Jarayon...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-lock text-sm"></i>
              <span>Balansni bloklash</span>
            </>
          )}
        </button>
      </div>

      {/* ACTIVE STAKINGS */}
      {loadingStakes ? (
        <div className="premium-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="section-title-line"></div>
            <h4 className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest">Faol stakinglar</h4>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton-pulse h-[72px] w-full"></div>
            ))}
          </div>
        </div>
      ) : activeStakes.length > 0 ? (
        <div className="premium-card p-6 card-glow-hover">
          <div className="flex items-center space-x-2 mb-4">
            <div className="section-title-line"></div>
            <div className="flex-1 flex items-center justify-between">
              <h4 className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest">Faol stakinglar</h4>
              <span className="glass-badge text-[8px]">{activeStakes.length} ta</span>
            </div>
          </div>
          <div className="space-y-3">
            {activeStakes.map((stake) => {
              const progress = calculateProgress(stake.start_date, stake.end_date);
              return (
                <div key={stake.id} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl relative overflow-hidden group hover:border-[#F7C948]/20 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F7C948]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-extrabold text-white">
                        {Number(stake.amount_fee).toLocaleString('uz-UZ')} FEE
                      </span>
                      <span className="text-[10px] text-[#22C55E] font-bold">
                        +{Number(stake.amount_fee * 0.2).toLocaleString('uz-UZ')} FEE
                      </span>
                    </div>
                    <div className="premium-progress mb-2">
                      <div className="premium-progress-fill" style={{ width: `${Math.round(progress)}%`, background: 'linear-gradient(90deg, #F7C948, #F59E0B)' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-[#9CA3AF] font-medium">{Math.round(progress)}%</span>
                      <span className="text-[8px] text-[#9CA3AF] font-medium">
                        {calculateEndDate(stake.end_date)} gacha
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="premium-card p-6 text-center">
          <div className="w-[40px] h-[40px] mx-auto mb-3 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
            <i className="fa-regular fa-clock text-[#9CA3AF] text-base"></i>
          </div>
          <p className="text-xs text-[#9CA3AF] font-medium">Hozircha faol stakinglar mavjud emas</p>
        </div>
      )}
    </div>
  );
}