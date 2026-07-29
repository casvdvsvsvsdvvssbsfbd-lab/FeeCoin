/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace Telegram {
  namespace WebApp {
    interface User {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    }

    interface InitDataUnsafe {
      user?: User;
      query_id?: string;
      auth_date?: number;
      hash?: string;
    }

    interface HapticFeedback {
      impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
      notificationOccurred(type: 'error' | 'success' | 'warning'): void;
      selectionChanged(): void;
    }

    interface MainButton {
      text: string;
      color: string;
      isVisible: boolean;
      isActive: boolean;
      show(): void;
      hide(): void;
      setText(text: string): void;
      setColor(color: string): void;
      onClick(callback: () => void): void;
    }

    interface BackButton {
      isVisible: boolean;
      show(): void;
      hide(): void;
      onClick(callback: () => void): void;
    }

    interface WebApp {
      initDataUnsafe: InitDataUnsafe;
      HapticFeedback: HapticFeedback;
      MainButton: MainButton;
      BackButton: BackButton;
      setHeaderColor(color: string): void;
      setBackgroundColor(color: string): void;
      expand(): void;
      ready(): void;
      close(): void;
    }
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: Telegram.WebApp.WebApp;
    };
  }
}

export {};
