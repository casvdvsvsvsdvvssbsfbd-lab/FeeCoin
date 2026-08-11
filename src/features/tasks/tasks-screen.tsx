'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useTaskStore } from '@/lib/stores/task-store';
import { tasksDataService, type TaskData } from './services/tasks-data.service';
import { formatFC } from '@/lib/utils/format';

export const TasksScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const { tasks, isLoading, error } = useTaskStore();
  const [activeTab, setActiveTab] = useState<string>('survey');

  const userId = user?.id || user?.user_id || '';

  const load = useCallback(() => {
    if (userId) {
      tasksDataService.refreshTasks(userId);
    } else {
      useTaskStore.getState().setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!authLoading) {
      load();
    }
  }, [authLoading, userId, load]);

  const tabs = [
    { key: 'survey', label: 'Surveys', icon: '📊' },
    { key: 'offer', label: 'Offers', icon: '📦' },
    { key: 'ad', label: 'Watch', icon: '📺' },
    { key: 'mission', label: 'Missions', icon: '🎯' },
  ];

  const filteredTasks = tasks.filter((t: any) => t.type === activeTab);
  const difficultyColors: Record<string, string> = { easy: '#00FF88', medium: '#f0b90b', hard: '#FF3366' };

  const handleComplete = async (taskId: string) => {
    if (!userId) return;
    await tasksDataService.completeTask(taskId, userId);
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-black text-white">Tasks</h1>
        <p className="text-xs text-white/40 mt-1">Complete tasks and earn rewards</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`filter-tab whitespace-nowrap ${activeTab === tab.key ? 'active' : ''}`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 mb-4">
          <div className="glass-card p-4">
            <p className="text-xs text-[#FF6B6B]">Vazifalarni yuklashda xatolik: {error}</p>
          </div>
        </div>
      )}

      {/* Task List */}
      {isLoading ? (
        <div className="px-4">
          <div className="glass-card p-8 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-white/40 mt-3">Ma'lumot yuklanmoqda...</p>
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="px-4">
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-3">📋</div>
            <p className="text-sm font-semibold text-white">Hozircha vazifalar yo'q</p>
            <p className="text-xs text-white/40 mt-1 max-w-[240px]">
              Yaqinda yangi vazifalar qo'shiladi. Tez orada qayta kirib ko'ring!
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {filteredTasks.map((task, i) => {
            const t = task as unknown as TaskData;
            const diffColor = difficultyColors[t.difficulty] || '#f0b90b';
            const isCompleted = t.status === 'completed' || t.status === 'claimed';
            return (
              <motion.div
                key={t.id}
                className="glass-card p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{t.title}</p>
                        <p className="text-xs text-white/50 mt-0.5">{t.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-bold text-[#f0b90b]">+{formatFC(t.reward)} FC</span>
                      <span className="text-[10px] text-white/40">⏱ {t.estimatedTime}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${diffColor}20`, color: diffColor }}>
                        {t.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-white/30">{t.provider}</span>
                      <span className="text-[10px] text-white/20">•</span>
                      <span className="text-[10px] text-white/30">{t.completionRate}% rate</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleComplete(t.id)}
                  disabled={isCompleted}
                  className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#00FF88]/10 text-[#00FF88]'
                      : 'bg-[#00FF88] text-[#0A0E14] active:scale-95'
                  }`}
                >
                  {isCompleted ? '✓ Completed' : 'Start Task'}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
