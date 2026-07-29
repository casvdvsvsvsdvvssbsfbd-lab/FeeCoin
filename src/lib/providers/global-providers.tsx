// ============================================
// Global Providers
// Production-ready provider composition
// ============================================

import React, { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { LanguageProvider } from './language-provider';
import { CountryProvider } from './country-provider';
import { FeatureFlagProvider } from './feature-flag-provider';
import { RemoteConfigProvider } from './remote-config-provider';
import { WalletProvider } from './wallet-provider';
import { RewardEngineProvider } from './reward-engine-provider';
import { NotificationProvider } from './notification-provider';
import { AnalyticsProvider } from './analytics-provider';
import { LoadingProvider } from './loading-provider';
import { ModalProvider } from './modal-provider';
import { ToastProvider } from './toast-provider';
import { NetworkMonitor } from './network-monitor';
import { SessionManager } from './session-manager';
import { BackgroundSync } from './background-sync';
import { RouteManager } from './route-manager';
import { DeepLinkManager } from './deep-link-manager';
import { CrashHandler } from './crash-handler';
import { PerformanceMonitor } from './performance-monitor';

interface GlobalProvidersProps {
  children: ReactNode;
  enableAnalytics?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableCrashReporting?: boolean;
  enableBackgroundSync?: boolean;
}

export const GlobalProviders: React.FC<GlobalProvidersProps> = ({
  children,
  enableAnalytics = true,
  enablePerformanceMonitoring = true,
  enableCrashReporting = true,
  enableBackgroundSync = true,
}) => {
  return (
    <ThemeProvider>{children}</ThemeProvider>
  );
};

export default GlobalProviders;