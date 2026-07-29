// ============================================
// Network Monitor
// Production-ready network status monitoring
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type NetworkStatus = 'online' | 'offline' | 'slow';

export interface NetworkInfo {
  status: NetworkStatus;
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  lastOnlineAt?: number;
  lastOfflineAt?: number;
  offlineDuration?: number;
}

interface NetworkContextType {
  network: NetworkInfo;
  isOnline: boolean;
  isOffline: boolean;
  isSlow: boolean;
  checkConnection: () => Promise<boolean>;
  waitForConnection: () => Promise<void>;
  getNetworkInfo: () => NetworkInfo;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkMonitorProps {
  children: ReactNode;
  checkInterval?: number;
  slowConnectionThreshold?: number;
  offlineTimeout?: number;
}

export const NetworkMonitor: React.FC<NetworkMonitorProps> = ({
  children,
  checkInterval = 30000, // 30 seconds
  slowConnectionThreshold = 500, // RTT > 500ms is slow
  offlineTimeout = 5000, // 5 seconds without response = offline
}) => {
  const [network, setNetwork] = useState<NetworkInfo>(() => ({
    status: 'online',
    isOnline: true,
    lastOnlineAt: Date.now(),
  }));

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(offlineTimeout),
      });
      const rtt = Date.now() - startTime;

      const isOnline = response.ok;
      const effectiveType = (navigator as any).connection?.effectiveType;
      const downlink = (navigator as any).connection?.downlink;
      const saveData = (navigator as any).connection?.saveData;

      const status: NetworkStatus = !isOnline ? 'offline' : rtt > slowConnectionThreshold ? 'slow' : 'online';

      setNetwork({
        status,
        isOnline,
        effectiveType,
        downlink,
        rtt,
        saveData,
        lastOnlineAt: isOnline ? Date.now() : network.lastOnlineAt,
        lastOfflineAt: !isOnline ? Date.now() : network.lastOfflineAt,
        offlineDuration: !isOnline ? (network.offlineDuration || 0) + (Date.now() - (network.lastOfflineAt || Date.now())) : 0,
      });

      return isOnline;
    } catch {
      setNetwork((prev) => ({
        ...prev,
        status: 'offline',
        isOnline: false,
        lastOfflineAt: Date.now(),
        offlineDuration: (prev.offlineDuration || 0) + (Date.now() - (prev.lastOfflineAt || Date.now())),
      }));
      return false;
    }
  }, [offlineTimeout, slowConnectionThreshold, network.lastOnlineAt, network.lastOfflineAt, network.offlineDuration]);

  const waitForConnection = useCallback(async (): Promise<void> => {
    while (!network.isOnline) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await checkConnection();
    }
  }, [network.isOnline, checkConnection]);

  const getNetworkInfo = useCallback((): NetworkInfo => {
    return network;
  }, [network]);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => {
      setNetwork((prev) => ({
        ...prev,
        status: 'online',
        isOnline: true,
        lastOnlineAt: Date.now(),
      }));
    };

    const handleOffline = () => {
      setNetwork((prev) => ({
        ...prev,
        status: 'offline',
        isOnline: false,
        lastOfflineAt: Date.now(),
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkConnection();

    // Periodic checks
    const interval = setInterval(() => {
      checkConnection();
    }, checkInterval);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnection, checkInterval]);

  const value: NetworkContextType = {
    network,
    isOnline: network.isOnline,
    isOffline: !network.isOnline,
    isSlow: network.status === 'slow',
    checkConnection,
    waitForConnection,
    getNetworkInfo,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkMonitor');
  }
  return context;
};

export const useIsOnline = (): boolean => {
  const { isOnline } = useNetwork();
  return isOnline;
};

export const useIsOffline = (): boolean => {
  const { isOffline } = useNetwork();
  return isOffline;
};

export const useIsSlowNetwork = (): boolean => {
  const { isSlow } = useNetwork();
  return isSlow;
};