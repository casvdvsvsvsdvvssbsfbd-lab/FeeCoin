'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Screen = 
  | 'splash' 
  | 'welcome' 
  | 'language' 
  | 'country' 
  | 'permissions'
  | 'home' 
  | 'tasks' 
  | 'leaderboard' 
  | 'wallet' 
  | 'profile'
  | 'referral'
  | 'missions'
  | 'notifications'
  | 'support';

interface NavigationState {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  history: Screen[];
}

export const useNavigation = create<NavigationState>()(
  persist(
    (set, get) => ({
      currentScreen: 'splash',
      history: [],
      navigate: (screen: Screen) => {
        const { currentScreen, history } = get();
        set({
          currentScreen: screen,
          history: [...history, currentScreen],
        });
      },
      goBack: () => {
        const { history } = get();
        if (history.length > 0) {
          const prevScreen = history[history.length - 1];
          set({
            currentScreen: prevScreen,
            history: history.slice(0, -1),
          });
        }
      },
    }),
    {
      name: 'navigation-storage',
    }
  )
);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useScreen = () => {
  const { currentScreen } = useNavigation();
  return currentScreen;
};

export const useNavigationActions = () => {
  const { navigate, goBack } = useNavigation();
  return { navigate, goBack };
};