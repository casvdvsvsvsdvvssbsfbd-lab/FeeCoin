// ============================================
// Route Manager
// Production-ready routing management
// ============================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type RouteType = 'home' | 'wallet' | 'profile' | 'leaderboard' | 'missions' | 'referrals' | 'settings' | 'support' | 'auth' | 'loading';

export interface Route {
  path: string;
  type: RouteType;
  title?: string;
  requiresAuth: boolean;
  requiresGuest: boolean;
  meta?: Record<string, any>;
}

interface RouteContextType {
  currentRoute: Route | null;
  previousRoute: Route | null;
  routeHistory: Route[];
  navigate: (path: string, type: RouteType, options?: { replace?: boolean; title?: string; meta?: Record<string, any> }) => void;
  goBack: () => void;
  canGoBack: boolean;
  isCurrentRoute: (type: RouteType) => boolean;
  getRouteParams: () => Record<string, string>;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

const DEFAULT_ROUTES: Record<string, Route> = {
  home: { path: '/', type: 'home', title: 'Home', requiresAuth: true, requiresGuest: false },
  wallet: { path: '/wallet', type: 'wallet', title: 'Wallet', requiresAuth: true, requiresGuest: false },
  profile: { path: '/profile', type: 'profile', title: 'Profile', requiresAuth: true, requiresGuest: false },
  leaderboard: { path: '/leaderboard', type: 'leaderboard', title: 'Leaderboard', requiresAuth: false, requiresGuest: false },
  missions: { path: '/missions', type: 'missions', title: 'Missions', requiresAuth: true, requiresGuest: false },
  referrals: { path: '/referrals', type: 'referrals', title: 'Referrals', requiresAuth: true, requiresGuest: false },
  settings: { path: '/settings', type: 'settings', title: 'Settings', requiresAuth: true, requiresGuest: false },
  support: { path: '/support', type: 'support', title: 'Support', requiresAuth: true, requiresGuest: false },
  auth: { path: '/auth', type: 'auth', title: 'Login', requiresAuth: false, requiresGuest: true },
  loading: { path: '/loading', type: 'loading', title: 'Loading', requiresAuth: false, requiresGuest: false },
};

interface RouteManagerProps {
  children: ReactNode;
  storageKey?: string;
  maxHistory?: number;
  defaultRoute?: RouteType;
}

export const RouteManager: React.FC<RouteManagerProps> = ({
  children,
  storageKey = 'fee_route',
  maxHistory = 10,
  defaultRoute = 'loading',
}) => {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Route;
        return parsed;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_ROUTES[defaultRoute] || null;
  });

  const [previousRoute, setPreviousRoute] = useState<Route | null>(null);
  const [routeHistory, setRouteHistory] = useState<Route[]>([]);
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  const navigate = useCallback(
    (path: string, type: RouteType, options?: { replace?: boolean; title?: string; meta?: Record<string, any> }) => {
      const route: Route = {
        path,
        type,
        title: options?.title || DEFAULT_ROUTES[type]?.title,
        requiresAuth: DEFAULT_ROUTES[type]?.requiresAuth || false,
        requiresGuest: DEFAULT_ROUTES[type]?.requiresGuest || false,
        meta: options?.meta,
      };

      setPreviousRoute(currentRoute);
      
      if (!options?.replace) {
        setRouteHistory((prev) => {
          const updated = [currentRoute, ...prev].filter((r): r is Route => r !== null);
          if (updated.length > maxHistory) {
            return updated.slice(0, maxHistory);
          }
          return updated;
        });
      }

      setCurrentRoute(route);

      // Update URL
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', path);
      }

      // Store route
      try {
        localStorage.setItem(storageKey, JSON.stringify(route));
      } catch {
        // Ignore storage errors
      }
    },
    [currentRoute, maxHistory, storageKey]
  );

  const goBack = useCallback(() => {
    if (routeHistory.length === 0) return;

    const previous = routeHistory[0];
    setRouteHistory((prev) => prev.slice(1));
    setPreviousRoute(currentRoute);
    setCurrentRoute(previous);

    // Update URL
    if (previous && typeof window !== 'undefined') {
      window.history.back();
    }
  }, [currentRoute, routeHistory]);

  const isCurrentRoute = useCallback(
    (type: RouteType): boolean => {
      return currentRoute?.type === type;
    },
    [currentRoute]
  );

  const getRouteParams = useCallback((): Record<string, string> => {
    return routeParams;
  }, [routeParams]);

  const value: RouteContextType = {
    currentRoute,
    previousRoute,
    routeHistory,
    navigate,
    goBack,
    canGoBack: routeHistory.length > 0,
    isCurrentRoute,
    getRouteParams,
  };

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
};

export const useRoute = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteManager');
  }
  return context;
};

export const useCurrentRoute = (): Route | null => {
  const { currentRoute } = useRoute();
  return currentRoute;
};

export const useNavigation = () => {
  const { navigate, goBack, canGoBack } = useRoute();
  return { navigate, goBack, canGoBack };
};

export const useIsCurrentRoute = (type: RouteType): boolean => {
  const { isCurrentRoute } = useRoute();
  return isCurrentRoute(type);
};