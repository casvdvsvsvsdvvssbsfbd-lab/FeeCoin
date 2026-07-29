'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockMissions, formatFC } from '../../shared/lib/mock-data';

const missionColors: Record<string, string> = {
  daily: '#00FF88',
  weekly: '#00BFFF',
  monthly: '#f0b90b',
  special: '#FF3366',
  seasonal: '#9c27b0',
};

export const MissionsScreen: React.FC = () => {
  const [missions, setMissions] = useState(mockMissions);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = ['all', 'daily', 'weekly', 'monthly', 'special', 'seasonal'];
  const filteredMissions = activeFilter === 'all' ? missions : missions.filter(m => m.type === activeFilter);

  const handleClaim = (id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, claimed: true } : m));
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-black text-white">Missions</h1>
        <p className="text-xs text-white/40 mt-1">Complete missions for big rewards</p>
      </div>

      {/* Filters */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto hide-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`filter-tab whitespace-nowrap ${activeFilter === f ? 'active' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Missions */}
      <div className="px-4 space-y-3">
        {filteredMissions.map((mission, i) => {
          const progressPercent = Math.min((mission.progress / mission.target) * 100, 100);
          return (
            <motion.div
              key={mission.id}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                  {mission.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{mission.title}</p>
                    <span className="text-xs font-bold text-[#f0b90b]">+{formatFC(mission.reward)}</span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">{mission.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-white/40">Progress</span>
                      <span className="text-[10px] font-semibold" style={{ color: missionColors[mission.type] }}>
                        {formatFC(mission.progress)} / {formatFC(mission.target)}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: missionColors[mission.type] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Type badge */}
                  <div className="flex items-center justify-between mt-3">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${missionColors[mission.type]}20`, color: missionColors[mission.type] }}
                    >
                      {mission.type}
                    </span>
                    
                    <button
                      onClick={() => handleClaim(mission.id)}
                      disabled={!mission.completed || mission.claimed}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        mission.claimed
                          ? 'bg-[#00FF88]/10 text-[#00FF88]'
                          : mission.completed
                          ? 'bg-[#00FF88] text-[#0A0E14]'
                          : 'bg-white/5 text-white/40 cursor-not-allowed'
                      }`}
                    >
                      {mission.claimed ? '✓ Claimed' : mission.completed ? 'Claim' : 'In Progress'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};