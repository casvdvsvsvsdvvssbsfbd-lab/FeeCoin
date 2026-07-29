// ============================================
// Language Provider
// Production-ready internationalization
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

export interface Translations {
  [key: string]: Record<string, any>;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  t: (key: string, options?: { defaultValue?: string; params?: Record<string, string | number> }) => string;
  isLoading: boolean;
  supportedLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', isRTL: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRTL: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', isRTL: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isRTL: false },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', isRTL: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', isRTL: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', isRTL: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', isRTL: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', isRTL: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', isRTL: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', isRTL: false },
];

const DEFAULT_TRANSLATIONS: Translations = {
  en: {
    app: {
      name: 'FEE',
      tagline: 'Watch, Earn, Repeat',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      skip: 'Skip',
      done: 'Done',
      retry: 'Retry',
      refresh: 'Refresh',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      noData: 'No data available',
      comingSoon: 'Coming Soon',
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      verifyEmail: 'Verify Email',
      welcome: 'Welcome',
    },
    home: {
      title: 'Home',
      dailyBonus: 'Daily Bonus',
      watchAds: 'Watch Ads',
      completeTasks: 'Complete Tasks',
      installApps: 'Install Apps',
      referFriends: 'Refer Friends',
      leaderboard: 'Leaderboard',
      profile: 'Profile',
    },
    wallet: {
      title: 'Wallet',
      balance: 'Balance',
      pending: 'Pending',
      withdrawable: 'Withdrawable',
      totalEarned: 'Total Earned',
      totalWithdrawn: 'Total Withdrawn',
      withdraw: 'Withdraw',
      deposit: 'Deposit',
      transactionHistory: 'Transaction History',
      noTransactions: 'No transactions yet',
    },
    profile: {
      title: 'Profile',
      level: 'Level',
      rank: 'Rank',
      experience: 'Experience',
      tasksCompleted: 'Tasks Completed',
      adsWatched: 'Ads Watched',
      appsInstalled: 'Apps Installed',
      referrals: 'Referrals',
      streak: 'Streak',
      editProfile: 'Edit Profile',
      settings: 'Settings',
    },
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No notifications',
      reward: 'Reward',
      mission: 'Mission',
      achievement: 'Achievement',
      system: 'System',
      promotion: 'Promotion',
      referral: 'Referral',
    },
    errors: {
      networkError: 'Network error. Please check your connection.',
      unauthorized: 'You are not authorized to perform this action.',
      notFound: 'Resource not found.',
      serverError: 'Server error. Please try again later.',
      validationError: 'Validation error.',
      unknownError: 'An unknown error occurred.',
    },
  },
  es: {
    app: {
      name: 'FEE',
      tagline: 'Mira, Gana, Repite',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      skip: 'Omitir',
      done: 'Hecho',
      retry: 'Reintentar',
      refresh: 'Actualizar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      noData: 'No hay datos disponibles',
      comingSoon: 'Próximamente',
    },
  },
  ru: {
    app: {
      name: 'FEE',
      tagline: 'Смотри, Зарабатывай, Повторяй',
    },
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      close: 'Закрыть',
      back: 'Назад',
      next: 'Далее',
      skip: 'Пропустить',
      done: 'Готово',
      retry: 'Повторить',
      refresh: 'Обновить',
      search: 'Поиск',
      filter: 'Фильтр',
      sort: 'Сортировка',
      noData: 'Нет данных',
      comingSoon: 'Скоро',
    },
  },
};

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
  storageKey?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = 'en',
  storageKey = 'fee_language',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const found = SUPPORTED_LANGUAGES.find((lang) => lang.code === stored);
        if (found) return found;
      }
    } catch {
      // Ignore
    }
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === defaultLanguage) || SUPPORTED_LANGUAGES[0];
  });

  const [translations, setTranslations] = useState<Translations>(DEFAULT_TRANSLATIONS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        // In production, load translations from API or CDN
        // For now, use default translations
        const allTranslations = { ...DEFAULT_TRANSLATIONS };
        
        // Merge with stored translations if available
        try {
          const stored = localStorage.getItem(`${storageKey}_translations`);
          if (stored) {
            const parsed = JSON.parse(stored);
            Object.assign(allTranslations, parsed);
          }
        } catch {
          // Ignore
        }

        setTranslations(allTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [storageKey]);

  useEffect(() => {
    // Update document direction for RTL languages
    const root = document.documentElement;
    if (language.isRTL) {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', 'ltr');
    }

    // Update lang attribute
    root.setAttribute('lang', language.code);

    // Store preference
    try {
      localStorage.setItem(storageKey, language.code);
    } catch {
      // Ignore storage errors
    }
  }, [language, storageKey]);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
  }, []);

  const t = useCallback(
    (key: string, options?: { defaultValue?: string; params?: Record<string, string | number> }): string => {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return options?.defaultValue || key;
        }
      }

      if (typeof value !== 'string') {
        return options?.defaultValue || key;
      }

      // Replace parameters
      if (options?.params) {
        Object.entries(options.params).forEach(([param, paramValue]) => {
          value = value.replace(new RegExp(`{{${param}}}`, 'g'), String(paramValue));
        });
      }

      return value;
    },
    [translations]
  );

  const value: LanguageContextType = {
    language,
    setLanguage,
    translations,
    t,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslations = () => {
  const { t } = useLanguage();
  return t;
};

export const useCurrentLanguage = (): Language => {
  const { language } = useLanguage();
  return language;
};