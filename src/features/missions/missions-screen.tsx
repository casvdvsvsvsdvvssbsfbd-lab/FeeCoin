'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useMissionStore } from '@/lib/stores/mission-store';
import { missionsDataService } from './services/missions-data.service';
import { formatFC } from '@/lib/utils/format';

const missionColors: Record<string, string> = {
  daily: '#00FF88',
  weekly: '#00BFFF',
  monthly: '#f0b90b',
  special: '#FF3366',
  seasonal: '#9c27b0',
};

export const MissionsScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const { missions, isLoading, error } = useMissionStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const userId = user?.id || user?.user_id || '';

  const load = useCallback(() => {
    if (userId) {
      missionsDataService.hydrateMissions(userId);
    } else {
      useMissionStore.getState().setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!authLoading) {
      load();
    }
  }, [authLoading, userId, load]);

  const filters = ['all', 'daily', 'weekly', 'monthly', 'special', 'seasonal'];
  const filteredMissions = activeFilter === 'all'
    ? missions
    : missions.filter((m: any) => m.type === activeFilter);

  const handleClaim = async (id: string) => {
    if (!userId) return;
    await missionsDataService.claimMissionReward(id, userId);
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

      {error && (
        <div className="px-4 mb-4">
          <div className="glass-card p-4">
            <p className="text-xs text-[#FF6B6B]">Ma'lumot yuklashda xatolik: {error}</p>
          </div>
        </div>
      )}

      {/* Missions */}
      {isLoading ? (
        <div className="px-4">
          <div className="glass-card p-8 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-white/40 mt-3">Ma'lumot yuklanmoqda...</p>
          </div>
        </div>
      ) : filteredMissions.length === 0 ? (
        <div className="px-4">
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-3">🎯</div>
            <p className="text-sm font-semibold text-white">Hozircha missionlar yo'q</p>
            <p className="text-xs text-white/40 mt-1 max-w-[240px]">
              Yaqinda yangi missionlar qo'shiladi. Tez orada qayta kirib ko'ring!
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {filteredMissions.map((mission: any, i: number) => {
            const progressPercent = Math.min((mission.progress / mission.target) * 100, 100);
            const isClaimed = mission.status === 'claimed';
            const isCompleted = mission.status === 'completed';
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
                        style={{ backgroundColor: `${missionColors[mission.type] || '#00FF88'}20`, color: missionColors[mission.type] || '#00FF88' }}
                      >
                        {mission.type}
                      </span>

                      <button
                        onClick={() => handleClaim(mission.id)}
                        disabled={!isCompleted || isClaimed}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isClaimed
                            ? 'bg-[#00FF88]/10 text-[#00FF88]'
                            : isCompleted
                            ? 'bg-[#00FF88] text-[#0A0E14]'
                            : 'bg-white/5 text-white/40 cursor-not-allowed'
                        }`}
                      >
                        {isClaimed ? '✓ Claimed' : isCompleted ? 'Claim' : 'In Progress'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
