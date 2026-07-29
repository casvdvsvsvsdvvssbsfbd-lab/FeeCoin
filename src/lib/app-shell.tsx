'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreen, useNavigation, Screen } from '../shared/hooks/use-navigation';
import { HomeScreen } from '../features/home/home-screen';
import { TasksScreen } from '../features/tasks/tasks-screen';
import { LeaderboardScreen } from '../features/leaderboard/leaderboard-screen';
import { WalletScreen } from '../features/wallet/wallet-screen';
import { ProfileScreen } from '../features/profile/profile-screen';

type Tab = 'home' | 'tasks' | 'leaderboard' | 'wallet' | 'profile';

const tabs: { key: Tab; icon: string; label: string }[] = [
  { key: 'home', icon: '🏠', label: 'Home' },
  { key: 'tasks', icon: '📋', label: 'Tasks' },
  { key: 'leaderboard', icon: '🏆', label: 'Top' },
  { key: 'wallet', icon: '💼', label: 'Wallet' },
  { key: 'profile', icon: '👤', label: 'Profile' },
];

const ScreenRenderer: React.FC = () => {
  const screen = useScreen();

  switch (screen) {
    case 'home': return <HomeScreen />;
    case 'tasks': return <TasksScreen />;
    case 'leaderboard': return <LeaderboardScreen />;
    case 'wallet': return <WalletScreen />;
    case 'profile': return <ProfileScreen />;
    default: return <HomeScreen />;
  }
};

export const AppShell: React.FC = () => {
  const { navigate, currentScreen } = useNavigation();
  const isMain = ['home', 'tasks', 'leaderboard', 'wallet', 'profile'].includes(currentScreen);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab);
    navigate(tab);
  };

  if (!isMain) return null;

  return (
    <div className="relative min-h-screen bg-[#0A0E14] max-w-[430px] mx-auto">
      {/* Screen Content */}
      <div className="pb-20">
        <ScreenRenderer />
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabPress(tab.key)}
            className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
          >
            <motion.span
              className="text-lg"
              animate={activeTab === tab.key ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {tab.icon}
            </motion.span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};