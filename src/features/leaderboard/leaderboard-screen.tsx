'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockLeaderboard, mockUser, formatNumber } from '../../shared/lib/mock-data';

const medals = ['🥇', '🥈', '🥉'];

export const LeaderboardScreen: React.FC = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('weekly');
  const entries = mockLeaderboard;

  const periods = [
    { key: 'daily' as const, label: 'Daily' },
    { key: 'weekly' as const, label: 'Weekly' },
    { key: 'monthly' as const, label: 'Monthly' },
    { key: 'all_time' as const, label: 'All Time' },
  ];

  const currentUserEntry = entries.find(e => e.isCurrentUser);

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-black text-white">Leaderboard</h1>
        <p className="text-xs text-white/40 mt-1">Top earners this {period}</p>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto hide-scrollbar">
        {periods.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`filter-tab whitespace-nowrap ${period === p.key ? 'active' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-3 px-4 mb-6 h-40">
        {[1, 0, 2].map((pos) => {
          const entry = entries[pos];
          if (!entry) return null;
          return (
            <motion.div
              key={entry.rank}
              className="flex flex-col items-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: pos * 0.15 }}
            >
              <div className="flex flex-col items-center mb-2">
                <div className={`w-10 h-10 rounded-full ${entry.isCurrentUser ? 'ring-2 ring-[#00FF88]' : ''} bg-gradient-to-br from-[#00FF88]/20 to-[#00BFFF]/20 flex items-center justify-center text-sm font-bold`}>
                  {entry.firstName[0]}
                </div>
                <p className="text-[10px] font-semibold text-white/70 mt-1">{entry.firstName}</p>
              </div>
              <div
                className="w-16 rounded-t-xl flex flex-col items-center justify-end pb-2 pt-4"
                style={{
                  height: pos === 0 ? 140 : pos === 1 ? 110 : 90,
                  background: pos === 0 ? 'linear-gradient(180deg, #f0b90b40 0%, transparent)' : 
                              pos === 1 ? 'linear-gradient(180deg, #00BFFF40 0%, transparent)' : 
                              'linear-gradient(180deg, #00FF8840 0%, transparent)',
                }}
              >
                <span className="text-lg mb-1">{medals[entry.rank - 1]}</span>
                <p className="text-xs font-bold text-white">{formatNumber(entry.score)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leaderboard List */}
      <div className="px-4 space-y-1">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.userId}
            className={`p-3 rounded-xl flex items-center gap-3 ${
              entry.isCurrentUser ? 'bg-[#00FF88]/5 border border-[#00FF88]/20' : ''
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <span className="w-6 text-center text-xs font-bold text-white/40">#{entry.rank}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00FF88]/20 to-[#00BFFF]/20 flex items-center justify-center text-xs font-bold">
              {entry.firstName[0]}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">
                {entry.firstName}
                {entry.isCurrentUser && <span className="text-[10px] text-[#00FF88] ml-1">(you)</span>}
              </p>
              <p className="text-[10px] text-white/40">@{entry.username}</p>
            </div>
            <p className="text-xs font-bold text-[#f0b90b]">{formatNumber(entry.score)}</p>
          </motion.div>
        ))}
      </div>

      {/* Current User Card */}
      {currentUserEntry && (
        <div className="px-4 mt-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00BFFF] flex items-center justify-center text-sm font-bold text-[#0A0E14]">
              {currentUserEntry.firstName[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Your Position</p>
              <p className="text-xs text-white/40">#{currentUserEntry.rank} of {entries.length}</p>
            </div>
            <p className="text-sm font-bold text-[#f0b90b]">{formatNumber(currentUserEntry.score)}</p>
          </div>
        </div>
      )}
    </div>
  );
};