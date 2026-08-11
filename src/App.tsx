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
import { ReferralScreen } from './features/referral/referral-screen';
import { AppShell } from './lib/app-shell';
import ErrorBoundary from './lib/error-boundary/error-boundary';

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
        {currentScreen === 'referral' && <ReferralScreen />}
        {(currentScreen === 'home' || currentScreen === 'tasks' || currentScreen === 'leaderboard' || currentScreen === 'wallet' || currentScreen === 'profile') && <AppShell />}
        {(currentScreen === 'missions' || currentScreen === 'notifications' || currentScreen === 'support' || (!currentScreen)) && <AppShell />}
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary level="app">
      <NavigationProvider>
        <Router />
      </NavigationProvider>
    </ErrorBoundary>
  );
};

export default App;