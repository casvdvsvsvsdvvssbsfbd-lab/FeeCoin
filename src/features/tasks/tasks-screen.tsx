'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockTasks, formatFC } from '../../shared/lib/mock-data';

export const TasksScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'install' | 'offer' | 'social'>('survey');
  const [tasks, setTasks] = useState(mockTasks);

  const filteredTasks = tasks.filter(t => t.type === activeTab);

  const handleComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
  };

  const tabs = [
    { key: 'survey' as const, label: 'Surveys', icon: '📊' },
    { key: 'install' as const, label: 'Install', icon: '📲' },
    { key: 'offer' as const, label: 'Offers', icon: '🎯' },
    { key: 'social' as const, label: 'Social', icon: '👥' },
  ];

  const difficultyColors = { easy: '#00FF88', medium: '#f0b90b', hard: '#FF3366' };

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

      {/* Task List */}
      <div className="px-4 space-y-3">
        {filteredTasks.map((task, i) => (
          <motion.div
            key={task.id}
            className="glass-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
                {task.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{task.title}</p>
                    <p className="text-xs text-white/50 mt-0.5">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-bold text-[#f0b90b]">+{formatFC(task.reward)} FC</span>
                  <span className="text-[10px] text-white/40">⏱ {task.estimatedTime}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${difficultyColors[task.difficulty]}20`, color: difficultyColors[task.difficulty] }}>
                    {task.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-white/30">{task.provider}</span>
                  <span className="text-[10px] text-white/20">•</span>
                  <span className="text-[10px] text-white/30">{task.completionRate}% rate</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleComplete(task.id)}
              disabled={task.completed}
              className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                task.completed
                  ? 'bg-[#00FF88]/10 text-[#00FF88]'
                  : 'bg-[#00FF88] text-[#0A0E14] active:scale-95'
              }`}
            >
              {task.completed ? '✓ Completed' : 'Start Task'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};