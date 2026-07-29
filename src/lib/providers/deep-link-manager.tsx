// ============================================
// Deep Link Manager
// Production-ready deep link handling
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface DeepLink {
  url: string;
  path: string;
  params: Record<string, string>;
  source: 'telegram' | 'browser' | 'clipboard' | 'unknown';
  timestamp: number;
}

interface DeepLinkContextType {
  deepLink: DeepLink | null;
  isProcessing: boolean;
  processDeepLink: (url: string) => DeepLink | null;
  clearDeepLink: () => void;
  getDeepLinkParam: (key: string) => string | undefined;
}

const DeepLinkContext = createContext<DeepLinkContextType | undefined>(undefined);

interface DeepLinkManagerProps {
  children: ReactNode;
  storageKey?: string;
  telegramBotUsername?: string;
  appUrl?: string;
}

export const DeepLinkManager: React.FC<DeepLinkManagerProps> = ({
  children,
  storageKey = 'fee_deep_link',
  telegramBotUsername = 'fee_app_bot',
  appUrl = 'https://fee.app',
}) => {
  const [deepLink, setDeepLink] = useState<DeepLink | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseDeepLink = useCallback((url: string): DeepLink | null => {
    try {
      const urlObj = new URL(url);
      const params: Record<string, string> = {};

      // Parse query parameters
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      // Determine source
      let source: DeepLink['source'] = 'unknown';
      if (url.includes('t.me') || url.includes('telegram.me')) {
        source = 'telegram';
      } else if (url.startsWith(appUrl)) {
        source = 'browser';
      }

      const deepLinkData: DeepLink = {
        url,
        path: urlObj.pathname,
        params,
        source,
        timestamp: Date.now(),
      };

      return deepLinkData;
    } catch {
      return null;
    }
  }, [appUrl]);

  const processDeepLink = useCallback((url: string): DeepLink | null => {
    setIsProcessing(true);

    try {
      const link = parseDeepLink(url);
      if (link) {
        setDeepLink(link);

        // Store deep link
        try {
          localStorage.setItem(storageKey, JSON.stringify(link));
        } catch {
          // Ignore storage errors
        }

        // Handle Telegram deep links
        if (link.source === 'telegram') {
          handleTelegramDeepLink(link);
        }

        setIsProcessing(false);
        return link;
      }
    } catch {
      // Ignore errors
    }

    setIsProcessing(false);
    return null;
  }, [parseDeepLink, storageKey]);

  const handleTelegramDeepLink = useCallback((link: DeepLink) => {
    // Handle Telegram-specific deep link parameters
    const { startapp, startgroup, group, channel } = link.params;

    if (startapp) {
      // User started the app via Telegram
      console.log('App started via Telegram with startapp:', startapp);
      // In production, handle referral codes, campaign tracking, etc.
    }

    if (startgroup || group) {
      // User started the app from a Telegram group
      console.log('App started from Telegram group:', group || startgroup);
    }

    if (channel) {
      // User started the app from a Telegram channel
      console.log('App started from Telegram channel:', channel);
    }
  }, []);

  const clearDeepLink = useCallback(() => {
    setDeepLink(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }, [storageKey]);

  const getDeepLinkParam = useCallback((key: string): string | undefined => {
    return deepLink?.params[key];
  }, [deepLink]);

  // Handle initial deep link on app load
  useEffect(() => {
    const handleInitialDeepLink = async () => {
      // Check for stored deep link
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as DeepLink;
          setDeepLink(parsed);
        }
      } catch {
        // Ignore
      }

      // Check URL for deep link parameters
      if (typeof window !== 'undefined') {
        const url = window.location.href;
        if (url.includes('startapp=') || url.includes('t.me')) {
          processDeepLink(url);
        }
      }
    };

    handleInitialDeepLink();
  }, [processDeepLink, storageKey]);

  // Listen for Telegram WebApp ready event
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      
      if (tg.initDataUnsafe?.start_param) {
        const deepLinkUrl = `${appUrl}?startapp=${tg.initDataUnsafe.start_param}`;
        processDeepLink(deepLinkUrl);
      }
    }
  }, [appUrl, processDeepLink]);

  const value: DeepLinkContextType = {
    deepLink,
    isProcessing,
    processDeepLink,
    clearDeepLink,
    getDeepLinkParam,
  };

  return <DeepLinkContext.Provider value={value}>{children}</DeepLinkContext.Provider>;
};

export const useDeepLink = (): DeepLinkContextType => {
  const context = useContext(DeepLinkContext);
  if (!context) {
    throw new Error('useDeepLink must be used within a DeepLinkManager');
  }
  return context;
};

export const useDeepLinkParam = (key: string): string | undefined => {
  const { getDeepLinkParam } = useDeepLink();
  return getDeepLinkParam(key);
};