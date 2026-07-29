import React, { useState } from 'react';
import { usePlayer } from '../context/GameContext';

export function ReferralDashboard() {
  const { player, referralLink, referralLogs, copyReferralLink } = usePlayer();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyReferralLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* HEADER CARD */}
      <div className="premium-card p-6 text-center relative overflow-hidden card-glow-hover">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-36 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative w-[60px] h-[60px] mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-[#22C55E]/10 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22C55E]/15 to-[#16A34A]/5 border-2 border-[#22C55E]/20 flex items-center justify-center backdrop-blur-[8px]" style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.2)' }}>
            <div className="absolute inset-0 rounded-full bg-[#22C55E]/5 blur-sm"></div>
            <i className="fa-solid fa-user-group text-xl text-[#22C55E] glow-green relative z-10"></i>
          </div>
        </div>
        
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Referral Tizimi</h3>
        <p className="text-xs text-[#9CA3AF] mt-2 font-medium max-w-[240px] mx-auto leading-relaxed">
          Do'stlaringizni taklif qiling va ularning daromadidan 10% bonus oling
        </p>
      </div>

      {/* STATS CARD */}
      <div className="premium-card p-6 card-glow-hover">
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center relative overflow-hidden group hover:border-[#22C55E]/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">Taklif qilingan</span>
              <div className="text-xl font-extrabold text-white mt-1.5">
                {player?.total_referrals || 0}
              </div>
            </div>
          </div>
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center relative overflow-hidden group hover:border-[#22C55E]/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">Bonus</span>
              <div className="text-xl font-extrabold text-[#22C55E] mt-1.5">
                {Number(player?.referral_earnings || 0).toLocaleString('uz-UZ')}
              </div>
              <span className="text-[7px] text-[#9CA3AF] font-medium">FEE</span>
            </div>
          </div>
        </div>
      </div>

      {/* REFERRAL LINK */}
      <div className="premium-card p-6 card-glow-hover">
        <div className="flex items-center space-x-2 mb-4">
          <div className="section-title-line"></div>
          <h4 className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest">Referral havola</h4>
        </div>
        
        <div className="p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-3">
          <p className="text-[10px] text-[#9CA3AF] font-medium break-all leading-relaxed">{referralLink}</p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-[14px] btn-primary text-xs uppercase tracking-widest flex items-center justify-center gap-2 ripple"
        >
          {copied ? (
            <>
              <i className="fa-solid fa-check text-sm"></i>
              <span>Nusxa olindi!</span>
            </>
          ) : (
            <>
              <i className="fa-regular fa-copy text-sm"></i>
              <span>Havolani nusxalash</span>
            </>
          )}
        </button>
      </div>

      {/* REFERRAL LOGS */}
      <div className="premium-card p-6 card-glow-hover">
        <div className="flex items-center space-x-2 mb-4">
          <div className="section-title-line"></div>
          <div className="flex-1 flex items-center justify-between">
            <h4 className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest">Bonuslar tarixi</h4>
            <span className="glass-badge text-[8px]">{referralLogs.length} ta</span>
          </div>
        </div>

        {referralLogs.length > 0 ? (
          <div className="space-y-2">
            {referralLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] relative overflow-hidden group hover:border-[#22C55E]/20 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-2.5 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 border-2 border-[#22C55E]/20 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)' }}>
                    <i className="fa-solid fa-user text-[10px] text-[#22C55E]"></i>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">{log.referred_username}</span>
                    <p className="text-[9px] text-[#9CA3AF] mt-0.5">
                      {new Date(log.created_at).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#22C55E] relative z-10">+{log.bonus_fee} FEE</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-[40px] h-[40px] mx-auto mb-3 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <i className="fa-regular fa-user text-[#9CA3AF] text-base"></i>
            </div>
            <p className="text-xs text-[#9CA3AF] font-medium">Hozircha referral bonuslar mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
}