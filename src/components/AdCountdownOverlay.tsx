import React from 'react';

interface Props {
  countdown: number;
  showSuccess?: boolean;
}

export function AdCountdownOverlay({ countdown, showSuccess = false }: Props) {
  const progress = countdown / 15;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - progress);

  // Success state
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center modal-overlay animate-fade-in">
        <div className="absolute inset-0 bg-[#05070D]/80 backdrop-blur-xl"></div>
        <div className="relative premium-card p-8 text-center max-w-[300px] w-full mx-4 animate-scale-in">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#22C55E]/8 rounded-full blur-3xl pointer-events-none"></div>

          {/* Success checkmark */}
          <div className="relative w-[80px] h-[80px] mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-[#22C55E]/10 animate-ping opacity-30"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/5 border-2 border-[#22C55E]/20 flex items-center justify-center" style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)' }}>
              <div className="absolute inset-0 rounded-full bg-[#22C55E]/5 blur-sm"></div>
              <i className="fa-solid fa-check text-3xl text-[#22C55E] relative z-10" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))' }}></i>
            </div>
          </div>

          <h3 className="text-base font-extrabold text-white tracking-tight">Mukofot olindi!</h3>
          <p className="text-xs text-[#9CA3AF] mt-2 font-medium">
            +1.25 UZS va +0.45 RUB hisobingizga qo'shildi
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" style={{ boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}></span>
            <span className="text-[10px] text-[#22C55E] font-bold uppercase tracking-wider">Muvaffaqiyatli</span>
          </div>
        </div>
      </div>
    );
  }

  // Watching state
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center modal-overlay animate-fade-in">
      <div className="absolute inset-0 bg-[#05070D]/80 backdrop-blur-xl"></div>

      <div className="relative premium-card p-8 text-center max-w-[300px] w-full mx-4 animate-scale-in">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#4F8CFF]/8 rounded-full blur-3xl pointer-events-none"></div>

        {/* Circular countdown */}
        <div className="relative w-[80px] h-[80px] mx-auto mb-5">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="#4F8CFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.3s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-extrabold text-white">{countdown}</span>
          </div>
        </div>

        <h3 className="text-base font-extrabold text-white tracking-tight">Watch & Earn</h3>
        <p className="text-xs text-[#9CA3AF] mt-2 font-medium">
          Reklama ko'rilmoqda...
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="live-dot"></span>
          <span className="text-[10px] text-[#4F8CFF] font-bold uppercase tracking-wider">Yuklanmoqda</span>
        </div>
      </div>
    </div>
  );
}