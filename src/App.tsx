// ============================================
// App Component - Main Application Container
// Production-ready with navigation and routing
// ============================================

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavigationProvider, useScreen } from './shared/hooks/use-navigation';
import { SplashScreen } from './features/onboarding/splash-screen';
import { WelcomeScreen } from './features/onboarding/welcome-screen';
import { LanguageScreen } from './features/onboarding/language-screen';
import { CountryScreen } from './features/onboarding/country-screen';
import { PermissionsScreen } from './features/onboarding/permissions-screen';
import { AppShell } from './lib/app-shell';

const Router: React.FC = () => {
  const currentScreen = useScreen();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen bg-[#0A0E14]"
      >
        {currentScreen === 'splash' && <SplashScreen />}
        {currentScreen === 'welcome' && <WelcomeScreen />}
        {currentScreen === 'language' && <LanguageScreen />}
        {currentScreen === 'country' && <CountryScreen />}
        {currentScreen === 'permissions' && <PermissionsScreen />}
        {(currentScreen === 'home' || currentScreen === 'tasks' || currentScreen === 'leaderboard' || currentScreen === 'wallet' || currentScreen === 'profile') && <AppShell />}
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <Router />
    </NavigationProvider>
  );
};

export default App;