import React, { useState, useCallback, lazy, Suspense } from 'react';
import { AdminLayout } from './components/admin-layout';
import { DashboardPage } from './pages/dashboard-page';
import { UsersPage } from './pages/users-page';
import { WithdrawalsPage } from './pages/withdrawals-page';
import { ProvidersPage } from './pages/providers-page';

type AdminModule = 'dashboard' | 'users' | 'withdrawals' | 'providers' | 'economy' | 'fraud' | 'analytics' | 'config' | 'broadcast' | 'audit' | 'support' | 'settings';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Lazy loaded pages
const EconomyPage = lazy(() => import('./pages/economy-page').then(m => ({ default: m.EconomyPage })));
const FraudPage = lazy(() => import('./pages/fraud-page').then(m => ({ default: m.FraudPage })));
const AnalyticsPage = lazy(() => import('./pages/analytics-page').then(m => ({ default: m.AnalyticsPage })));
const ConfigPage = lazy(() => import('./pages/config-page').then(m => ({ default: m.ConfigPage })));
const BroadcastPage = lazy(() => import('./pages/broadcast-page').then(m => ({ default: m.BroadcastPage })));
const AuditPage = lazy(() => import('./pages/audit-page').then(m => ({ default: m.AuditPage })));
const SupportPage = lazy(() => import('./pages/support-page').then(m => ({ default: m.SupportPage })));
const SettingsPage = lazy(() => import('./pages/settings-page').then(m => ({ default: m.SettingsPage })));

export const AdminApp: React.FC = () => {
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');

  const renderPage = useCallback(() => {
    const page = (() => {
      switch (activeModule) {
        case 'dashboard': return <DashboardPage />;
        case 'users': return <UsersPage />;
        case 'withdrawals': return <WithdrawalsPage />;
        case 'providers': return <ProvidersPage />;
        case 'economy': return <EconomyPage />;
        case 'fraud': return <FraudPage />;
        case 'analytics': return <AnalyticsPage />;
        case 'config': return <ConfigPage />;
        case 'broadcast': return <BroadcastPage />;
        case 'audit': return <AuditPage />;
        case 'support': return <SupportPage />;
        case 'settings': return <SettingsPage />;
        default: return <DashboardPage />;
      }
    })();
    return <Suspense fallback={<LoadingFallback />}>{page}</Suspense>;
  }, [activeModule]);

  return (
    <AdminLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderPage()}
    </AdminLayout>
  );
};
