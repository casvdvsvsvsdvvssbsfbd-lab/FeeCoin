import React, { useState } from 'react';
import { usePlayer } from '../context/GameContext';

const MIN_WITHDRAWAL = 50000;
const PAYOUT_METHODS = [
  { value: 'uzcard', label: 'Uzcard', icon: 'fa-regular fa-credit-card' },
  { value: 'humo', label: 'Humo', icon: 'fa-regular fa-credit-card' },
  { value: 'payeer', label: 'Payeer', icon: 'fa-solid fa-wallet' },
  { value: 'qiwi', label: 'QIWI', icon: 'fa-solid fa-mobile-screen-button' },
] as const;

export function WalletGateway() {
  const { player, transactions, requestWithdrawal, loadingTx, coinBalance, convertCoinsToUzs, convertCoinsToRub } = usePlayer();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<string>('uzcard');
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Coin converter state
  const [convertAmount, setConvertAmount] = useState('');
  const [convertTarget, setConvertTarget] = useState<'uzs' | 'rub'>('uzs');
  const [convertStatus, setConvertStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [convertMsg, setConvertMsg] = useState('');

  const handleWithdraw = async () => {
    setError('');
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal: ${MIN_WITHDRAWAL.toLocaleString('uz-UZ')} FEE`);
      return;
    }
    if (!player || numAmount > player.fee_balance) {
      setError('Insufficient balance');
      return;
    }
    if (!account.trim()) {
      setError('Enter account details');
      return;
    }

    setStatus('loading');
    try {
      await requestWithdrawal(numAmount, method as any, account.trim());
      setStatus('success');
      setAmount('');
      setAccount('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed');
      setStatus('idle');
    }
  };

  const handleConvert = async () => {
    setConvertMsg('');
    const coins = parseInt(convertAmount, 10);
    if (isNaN(coins) || coins < 1) {
      setConvertMsg('Minimal 1 COIN');
      setConvertStatus('error');
      return;
    }
    if (coins > coinBalance) {
      setConvertMsg(`Sizda ${coinBalance} COIN bor`);
      setConvertStatus('error');
      return;
    }

    setConvertStatus('loading');
    try {
      if (convertTarget === 'uzs') {
        await convertCoinsToUzs(coins);
      } else {
        await convertCoinsToRub(coins);
      }
      setConvertStatus('success');
      setConvertAmount('');
      const reward = convertTarget === 'uzs' ? coins * 10 : coins * 3.5;
      setConvertMsg(`+${reward} ${convertTarget.toUpperCase()} hisobingizga qo'shildi!`);
      setTimeout(() => { setConvertStatus('idle'); setConvertMsg(''); }, 3000);
    } catch (err: any) {
      setConvertMsg(err.message || 'Konvertatsiya amalga oshmadi');
      setConvertStatus('error');
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER CARD */}
      <div className="premium-card p-6 text-center relative overflow-hidden card-glow-hover">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-36 bg-[#4F8CFF]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative w-[60px] h-[60px] mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-[#4F8CFF]/10 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4F8CFF]/15 to-[#3578FF]/5 border-2 border-[#4F8CFF]/20 flex items-center justify-center backdrop-blur-[8px]" style={{ boxShadow: '0 0 30px rgba(79, 140, 255, 0.2)' }}>
            <div className="absolute inset-0 rounded-full bg-[#4F8CFF]/5 blur-sm"></div>
            <i className="fa-solid fa-wallet text-xl text-[#4F8CFF] glow-blue relative z-10"></i>
          </div>
        </div>
        
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Wallet & Payout</h3>
        <p className="text-xs text-[#9CA3AF] mt-2 font-medium max-w-[240px] mx-auto leading-relaxed">
          Mablag'laringizni tokenizatsiya qiling va chiqarib oling
        </p>
      </div>

      {/* BALANCE CARD */}
      <div className="premium-card p-6 card-glow-hover">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center relative overflow-hidden group hover:border-[#F7C948]/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F7C948]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-[8px] text-[#9CA3AF] font-bold uppercase tracking-wider">COIN</span>
              <div className="text-lg font-extrabold text-[#F7C948] mt-1">
                {coinBalance}
              </div>
            </div>
          </div>
          <div className="p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center relative overflow-hidden group hover:border-[#4F8CFF]/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F8CFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-[8px] text-[#9CA3AF] font-bold uppercase tracking-wider">Balans</span>
              <div className="text-lg font-extrabold text-white mt-1">
                {Number(player?.fee_balance || 0).toLocaleString('uz-UZ')}
              </div>
              <span className="text-[7px] text-[#9CA3AF] font-medium">FEE</span>
            </div>
          </div>
          <div className="p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center relative overflow-hidden group hover:border-[#F59E0B]/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-[8px] text-[#9CA3AF] font-bold uppercase tracking-wider">Kutilmoqda</span>
              <div className="text-lg font-extrabold text-[#F59E0B] mt-1">
                {Number(player?.pending_fee || 0).toLocaleString('uz-UZ')}
              </div>
              <span className="text-[7px] text-[#9CA3AF] font-medium">FEE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ COIN CONVERTER ═══ */}
      <div className="premium-card p-6 card-glow-hover relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F7C948]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center space-x-2 mb-5">
          <div className="section-title-line"></div>
          <h4 className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest">COIN Konverter</h4>
        </div>

        {/* Rate display */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="text-center p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl min-w-[90px] relative overflow-hidden group hover:border-[#4F8CFF]/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F8CFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-[8px] text-[#9CA3AF] block font-bold uppercase">1 COIN →</span>
              <span className="text-sm font-extrabold text-[#4F8CFF]">10 FEE</span>
            </div>
          </div>
          <div className="text-[#9CA3AF] text-lg font-extrabold">/</div>
          <div className="text-center p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl min-w-[90px] relative overflow-hidden group hover:border-[#F7C948]/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F7C948]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-[8px] text-[#9CA3AF] block font-bold uppercase">1 COIN →</span>
              <span className="text-sm font-extrabold text-[#F7C948]">3.5 FEE</span>
            </div>
          </div>
        </div>

        {/* Input + Target selector */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            value={convertAmount}
            onChange={(e) => setConvertAmount(e.target.value)}
            placeholder="COIN miqdori"
            className="premium-input flex-1"
            min="1"
            step="1"
          />
          <div className="flex gap-1">
            <button
              onClick={() => setConvertTarget('uzs')}
              className={`px-3 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                convertTarget === 'uzs'
                  ? 'bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 text-[#4F8CFF]'
                  : 'bg-white/[0.03] border border-white/[0.06] text-[#9CA3AF]'
              }`}
            >FEE</button>
            <button
              onClick={() => setConvertTarget('rub')}
              className={`px-3 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                convertTarget === 'rub'
                  ? 'bg-[#F7C948]/15 border border-[#F7C948]/30 text-[#F7C948]'
                  : 'bg-white/[0.03] border border-white/[0.06] text-[#9CA3AF]'
              }`}
            >FEE</button>
          </div>
        </div>

        {/* Live preview */}
        {convertAmount && parseInt(convertAmount) > 0 && (
          <div className="text-center mb-3 p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <span className="text-[10px] text-[#9CA3AF] font-medium">
              {convertAmount} COIN ={' '}
              <span className={`font-extrabold ${convertTarget === 'uzs' ? 'text-[#4F8CFF]' : 'text-[#F7C948]'}`}>
                {convertTarget === 'uzs'
                  ? (parseInt(convertAmount) * 10).toLocaleString('uz-UZ')
                  : (parseInt(convertAmount) * 3.5).toLocaleString('ru-RU')}
                {' '}{convertTarget.toUpperCase()}
              </span>
            </span>
          </div>
        )}

        {convertMsg && (
          <div className={`mb-3 p-3 rounded-xl ${
            convertStatus === 'error' ? 'bg-[#EF4444]/10 border border-[#EF4444]/15' :
            'bg-[#22C55E]/10 border border-[#22C55E]/15'
          }`}>
            <p className={`text-[10px] font-bold text-center ${
              convertStatus === 'error' ? 'text-[#EF4444]' : 'text-[#22C55E]'
            }`}>
              {convertMsg}
            </p>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={convertStatus === 'loading'}
          className="w-full py-[14px] btn-primary text-xs uppercase tracking-widest flex items-center justify-center gap-2 ripple"
          style={{
            background: convertTarget === 'rub'
              ? 'linear-gradient(135deg, #F7C948, #F59E0B)'
              : undefined,
          }}
        >
          {convertStatus === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Konvertatsiya...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-arrows-rotate text-sm"></i>
              <span>COIN → {convertTarget.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>

      {/* WITHDRAWAL FORM */}
      <div className="premium-card p-6 card-glow-hover">
        <div className="flex items-center space-x-2 mb-5">
          <div className="section-title-line"></div>
          <h4 className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest">Chiqarish</h4>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">Miqdor (FEE)</span>
            <span className="text-[9px] text-[#9CA3AF]">
              Min: <span className="text-[#F59E0B] font-bold">{MIN_WITHDRAWAL.toLocaleString('uz-UZ')}</span>
            </span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`${MIN_WITHDRAWAL.toLocaleString('uz-UZ')} FEE minimum`}
            className="premium-input w-full"
            min={MIN_WITHDRAWAL}
          />
        </div>

        {/* Method */}
        <div className="mb-4">
          <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider block mb-2">Payout usuli</span>
          <div className="grid grid-cols-2 gap-2">
            {PAYOUT_METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMethod(m.value)}
                className={`py-3 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
                  method === m.value
                    ? 'bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 text-[#4F8CFF]'
                    : 'bg-white/[0.03] border border-white/[0.06] text-[#9CA3AF] hover:text-white'
                }`}
              >
                <i className={m.icon}></i>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="mb-4">
          <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider block mb-1.5">
            Hisob raqam / Karta
          </span>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Karta raqami yoki hisob"
            className="premium-input w-full"
          />
        </div>

        {error && (
          <div className="mb-3 p-3 bg-[#EF4444]/10 border border-[#EF4444]/15 rounded-xl">
            <p className="text-[10px] text-[#EF4444] font-bold text-center">{error}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mb-3 p-3 bg-[#22C55E]/10 border border-[#22C55E]/15 rounded-xl">
            <p className="text-[10px] text-[#22C55E] font-bold text-center flex items-center justify-center gap-1.5">
              <i className="fa-solid fa-circle-check"></i>
              So'rov yuborildi! Admin tomonidan ko'rib chiqiladi.
            </p>
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={status === 'loading'}
          className="w-full py-[14px] btn-primary text-xs uppercase tracking-widest flex items-center justify-center gap-2 ripple"
        >
          {status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Jarayon...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane text-sm"></i>
              <span>Chiqarish so'rovini yuborish</span>
            </>
          )}
        </button>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="premium-card p-6 card-glow-hover">
        <div className="flex items-center space-x-2 mb-4">
          <div className="section-title-line"></div>
          <div className="flex-1 flex items-center justify-between">
            <h4 className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest">Tranzaksiyalar</h4>
            <span className="glass-badge text-[8px]">{transactions.length} ta</span>
          </div>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] relative overflow-hidden group hover:border-[#4F8CFF]/20 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4F8CFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-2.5 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    tx.type === 'ad_reward' ? 'bg-[#4F8CFF]/10 border-[#4F8CFF]/20' :
                    tx.type === 'staking_deposit' || tx.type === 'staking_interest' ? 'bg-[#F7C948]/10 border-[#F7C948]/20' :
                    tx.type === 'referral_bonus' ? 'bg-[#22C55E]/10 border-[#22C55E]/20' :
                    'bg-[#F59E0B]/10 border-[#F59E0B]/20'
                  }`} style={{
                    boxShadow: tx.type === 'ad_reward' ? '0 0 15px rgba(79, 140, 255, 0.1)' :
                               tx.type === 'staking_deposit' || tx.type === 'staking_interest' ? '0 0 15px rgba(247, 201, 72, 0.1)' :
                               tx.type === 'referral_bonus' ? '0 0 15px rgba(34, 197, 94, 0.1)' :
                               '0 0 15px rgba(245, 158, 11, 0.1)'
                  }}>
                    <i className={`text-[10px] ${
                      tx.type === 'ad_reward' ? 'fa-regular fa-circle-play text-[#4F8CFF]' :
                      tx.type === 'staking_deposit' ? 'fa-solid fa-lock text-[#F7C948]' :
                      tx.type === 'staking_interest' ? 'fa-solid fa-percent text-[#F7C948]' :
                      tx.type === 'referral_bonus' ? 'fa-solid fa-user-group text-[#22C55E]' :
                      'fa-solid fa-paper-plane text-[#F59E0B]'
                    }`}></i>
                  </div>
                  <div className="max-w-[140px]">
                    <p className="text-[10px] font-semibold text-white truncate">{tx.description}</p>
                    <p className="text-[8px] text-[#9CA3AF] mt-0.5">
                      {new Date(tx.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[11px] font-extrabold ${
                    tx.type === 'ad_reward' || tx.type === 'referral_bonus' || tx.type === 'staking_interest'
                      ? 'text-[#22C55E]' : 'text-[#F59E0B]'
                  }`}>
                    {tx.type === 'ad_reward' || tx.type === 'referral_bonus' || tx.type === 'staking_interest' ? '+' : '-'}
                    {tx.amount_fee.toLocaleString('uz-UZ')}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 justify-end">
                    <span className={`text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                      tx.status === 'completed' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                      tx.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {tx.status === 'completed' ? 'Bajarildi' : tx.status === 'pending' ? 'Kutilmoqda' : 'Bekor'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-[40px] h-[40px] mx-auto mb-3 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <i className="fa-regular fa-clock text-[#9CA3AF] text-base"></i>
            </div>
            <p className="text-xs text-[#9CA3AF] font-medium">Hozircha tranzaksiyalar mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
}