// ============================================
// Telegram SDK Wrapper
// Production-ready Telegram Mini App SDK wrapper
// ============================================

import type { TelegramWebApp, TelegramUser, TelegramThemeParams } from './types';

class TelegramSDK {
  private webApp: any = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this.loadSDK();
  }

private async loadSDK(): Promise<void> {
    return new Promise((resolve) => {
      // Guard: never allow the Telegram script load to hang the promise.
      // If WebApp is not available within SDK_TIMEOUT_MS, fall back to the
      // mock WebApp so the UI always renders (critical on Vercel production
      // where the script may be blocked, delayed, or never fire callbacks).
      const SDK_TIMEOUT_MS = 3000;
      let settled = false;

      const finish = (mode: 'webapp' | 'mock' | 'error') => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (mode === 'webapp' && this.webApp) {
          this.setupWebApp();
          this.isInitialized = true;
        } else {
          this.createMockWebApp();
          this.isInitialized = true;
        }
        resolve();
      };

      const timer = setTimeout(() => {
        console.warn('[TelegramSDK] SDK load timed out — falling back to mock WebApp.');
        finish('mock');
      }, SDK_TIMEOUT_MS);

      try {
        // Check if Telegram WebApp is already available
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          this.webApp = window.Telegram.WebApp as any;
          finish('webapp');
          return;
        }

        // Load Telegram WebApp script dynamically
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;

        script.onload = () => {
          if (window.Telegram?.WebApp) {
            this.webApp = window.Telegram.WebApp as any;
            finish('webapp');
          } else {
            console.warn('[TelegramSDK] Script loaded but WebApp missing — using mock.');
            finish('error');
          }
        };

        script.onerror = () => {
          // In development or non-Telegram environment, create mock
          console.warn('[TelegramSDK] Script failed to load — using mock WebApp.');
          finish('mock');
        };

        document.head.appendChild(script);
      } catch (error) {
        // In development or non-Telegram environment, create mock
        console.warn('[TelegramSDK] Error loading SDK — using mock WebApp.', error);
        finish('mock');
      }
    });
  }

  private setupWebApp(): void {
    if (!this.webApp) return;

    // Enable closing confirmation
    this.webApp.enableClosingConfirmation();

    // Set header color
    this.webApp.setHeaderColor(this.webApp.themeParams.header_bg_color || 'bg_color');

    // Expand the app to full height
    this.webApp.expand();

    // Ready signal
    this.webApp.ready();
  }

  private createMockWebApp(): void {
    // Mock WebApp for development/testing
    this.webApp = {
      ready: () => {},
      expand: () => {},
      close: () => {},
      sendData: (data: string) => console.log('Mock sendData:', data),
      switchInlineQuery: (query: string, choose_chat_types?: string[]) => console.log('Mock switchInlineQuery:', query),
      openLink: (url: string, options?: { try_instant_view?: boolean }) => window.open(url, '_blank'),
      openTelegramLink: (url: string) => window.open(url, '_blank'),
      showAlert: (message: string, callback?: () => void) => alert(message),
      showConfirm: (message: string, callback?: (confirmed: boolean) => void) => {
        const confirmed = confirm(message);
        callback?.(confirmed);
      },
      showPopup: (params: any, callback?: (button_id: string) => void) => {
        const result = confirm(params.message || 'Popup');
        callback?.(result ? 'ok' : 'cancel');
      },
      showMainButton: (params?: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => {
        console.log('Mock showMainButton:', params);
      },
      hideMainButton: () => console.log('Mock hideMainButton'),
      showSecondaryButton: (params?: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => {
        console.log('Mock showSecondaryButton:', params);
      },
      hideSecondaryButton: () => console.log('Mock hideSecondaryButton'),
      showBackButton: (callback?: () => void) => {
        console.log('Mock showBackButton');
        callback?.();
      },
      hideBackButton: () => console.log('Mock hideBackButton'),
      showSettingsButton: (callback?: () => void) => {
        console.log('Mock showSettingsButton');
        callback?.();
      },
      hideSettingsButton: () => console.log('Mock hideSettingsButton'),
      setHeaderColor: (color: string) => console.log('Mock setHeaderColor:', color),
      setBackgroundColor: (color: string) => console.log('Mock setBackgroundColor:', color),
      enableClosingConfirmation: () => console.log('Mock enableClosingConfirmation'),
      disableClosingConfirmation: () => console.log('Mock disableClosingConfirmation'),
      setHeaderParams: (params: any) => console.log('Mock setHeaderParams:', params),
      HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => console.log('Mock haptic:', style),
        notificationOccurred: (type: 'error' | 'success' | 'warning') => console.log('Mock haptic notification:', type),
        selectionChanged: () => console.log('Mock haptic selection'),
      },
      CloudStorage: {
        getItem: (key: string, callback?: (error: string | null, value: string | null) => void) => {
          try {
            const value = localStorage.getItem(`tg_${key}`);
            callback?.(null, value);
          } catch (error) {
            callback?.('error', null);
          }
        },
        setItem: (key: string, value: string, callback?: (error: string | null) => void) => {
          try {
            localStorage.setItem(`tg_${key}`, value);
            callback?.(null);
          } catch (error) {
            callback?.('error');
          }
        },
        removeItem: (key: string, callback?: (error: string | null) => void) => {
          try {
            localStorage.removeItem(`tg_${key}`);
            callback?.(null);
          } catch (error) {
            callback?.('error');
          }
        },
        getItems: (keys: string[], callback?: (error: string | null, values: Record<string, string>) => void) => {
          try {
            const values: Record<string, string> = {};
            keys.forEach(key => {
              const value = localStorage.getItem(`tg_${key}`);
              if (value) values[key] = value;
            });
            callback?.(null, values);
          } catch (error) {
            callback?.('error', {});
          }
        },
        setItems: (items: Record<string, string>, callback?: (error: string | null) => void) => {
          try {
            Object.entries(items).forEach(([key, value]) => {
              localStorage.setItem(`tg_${key}`, value);
            });
            callback?.(null);
          } catch (error) {
            callback?.('error');
          }
        },
        removeItems: (keys: string[], callback?: (error: string | null) => void) => {
          try {
            keys.forEach(key => localStorage.removeItem(`tg_${key}`));
            callback?.(null);
          } catch (error) {
            callback?.('error');
          }
        },
      },
      themeParams: {
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff',
        secondary_bg_color: '#f0f0f0',
      } as TelegramThemeParams,
      version: '6.0',
      platform: 'web',
      colorScheme: 'light',
      isExpanded: true,
      viewportHeight: window.innerHeight,
      viewportStableHeight: window.innerHeight,
      headerColor: '#ffffff',
      backgroundColor: '#ffffff',
      isClosingConfirmationEnabled: true,
      isVerticalSwipesEnabled: true,
    } as any;
  }

  public async waitForInitialization(): Promise<void> {
    if (this.isInitialized) return;
    // Defensive guard: even if the internal promise somehow never settles,
    // never hang the caller. Resolve within SDK_TIMEOUT_MS regardless.
    const promise = this.initializationPromise ?? Promise.resolve();
    await Promise.race([
      promise,
      new Promise<void>((resolve) => {
        setTimeout(resolve, 4000);
      }),
    ]);
    // Ensure a mock exists if initialization still hasn't completed.
    if (!this.webApp) {
      this.createMockWebApp();
      this.isInitialized = true;
    }
  }

  public getWebApp(): TelegramWebApp | null {
    return this.webApp;
  }

  public isTelegramEnvironment(): boolean {
    return this.webApp !== null && typeof window !== 'undefined' && 'Telegram' in window;
  }

  public getUser(): TelegramUser | null {
    return this.webApp?.initDataUnsafe?.user || null;
  }

  public getStartParam(): string | null {
    return this.webApp?.initDataUnsafe?.start_param || null;
  }

  /**
   * Return the RAW initData string (needed for server-side validation).
   * Returns null when not running inside a real Telegram client.
   */
  public getInitDataString(): string | null {
    return this.webApp?.initData || null;
  }

  public getQueryId(): string | null {
    return this.webApp?.initDataUnsafe?.query_id || null;
  }

  public getThemeParams(): TelegramThemeParams | null {
    return this.webApp?.themeParams || null;
  }

  public getColorScheme(): 'light' | 'dark' | null {
    return this.webApp?.colorScheme || null;
  }

  public getViewportHeight(): number {
    return this.webApp?.viewportHeight || window.innerHeight;
  }

  public getViewportStableHeight(): number {
    return this.webApp?.viewportStableHeight || window.innerHeight;
  }

  public isPremium(): boolean {
    return this.webApp?.initDataUnsafe?.user?.is_premium || false;
  }

  public getLanguageCode(): string | null {
    return this.webApp?.initDataUnsafe?.user?.language_code || null;
  }

  public getPlatform(): string {
    return this.webApp?.platform || 'web';
  }

  public getVersion(): string {
    return this.webApp?.version || 'unknown';
  }

  public isDarkMode(): boolean {
    return this.webApp?.colorScheme === 'dark';
  }

  public isFullscreen(): boolean {
    return this.webApp?.isExpanded || false;
  }

  public expand(): void {
    this.webApp?.expand();
  }

  public ready(): void {
    this.webApp?.ready();
  }

  public close(): void {
    this.webApp?.close();
  }

  public sendData(data: string): void {
    this.webApp?.sendData(data);
  }

  public switchInlineQuery(query: string, choose_chat_types?: string[]): void {
    this.webApp?.switchInlineQuery(query, choose_chat_types);
  }

  public openLink(url: string, options?: { try_instant_view?: boolean }): void {
    this.webApp?.openLink(url, options);
  }

  public openTelegramLink(url: string): void {
    this.webApp?.openTelegramLink(url);
  }

  public showAlert(message: string, callback?: () => void): void {
    this.webApp?.showAlert(message, callback);
  }

  public showConfirm(message: string, callback?: (confirmed: boolean) => void): void {
    this.webApp?.showConfirm(message, callback);
  }

  public showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (button_id: string) => void): void {
    this.webApp?.showPopup(params, callback);
  }

  public showMainButton(params?: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }): void {
    this.webApp?.showMainButton(params);
  }

  public hideMainButton(): void {
    this.webApp?.hideMainButton();
  }

  public setMainButtonText(text: string): void {
    if (this.webApp?.MainButton) {
      this.webApp.MainButton.setText(text);
    }
  }

  public setMainButtonParams(params: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }): void {
    if (this.webApp?.MainButton) {
      Object.assign(this.webApp.MainButton, params);
    }
  }

  public showSecondaryButton(params?: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }): void {
    this.webApp?.showSecondaryButton(params);
  }

  public hideSecondaryButton(): void {
    this.webApp?.hideSecondaryButton();
  }

  public showBackButton(callback?: () => void): void {
    this.webApp?.showBackButton(callback);
  }

  public hideBackButton(): void {
    this.webApp?.hideBackButton();
  }

  public showSettingsButton(callback?: () => void): void {
    this.webApp?.showSettingsButton(callback);
  }

  public hideSettingsButton(): void {
    this.webApp?.hideSettingsButton();
  }

  public enableClosingConfirmation(): void {
    this.webApp?.enableClosingConfirmation();
  }

  public disableClosingConfirmation(): void {
    this.webApp?.disableClosingConfirmation();
  }

  public hapticImpact(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void {
    this.webApp?.HapticFeedback?.impactOccurred(style);
  }

  public hapticNotification(type: 'error' | 'success' | 'warning'): void {
    this.webApp?.HapticFeedback?.notificationOccurred(type);
  }

  public hapticSelection(): void {
    this.webApp?.HapticFeedback?.selectionChanged();
  }

  public async cloudStorageGetItem(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      this.webApp?.CloudStorage?.getItem(key, (error: any, value: any) => {
        if (error) {
          console.error('CloudStorage getItem error:', error);
          resolve(null);
        } else {
          resolve(value);
        }
      });
    });
  }

  public async cloudStorageSetItem(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webApp?.CloudStorage?.setItem(key, value, (error: any) => {
        if (error) {
          console.error('CloudStorage setItem error:', error);
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }

  public async cloudStorageRemoveItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webApp?.CloudStorage?.removeItem(key, (error: any) => {
        if (error) {
          console.error('CloudStorage removeItem error:', error);
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }

  public async cloudStorageGetItems(keys: string[]): Promise<Record<string, string>> {
    return new Promise((resolve) => {
      this.webApp?.CloudStorage?.getItems(keys, (error: any, values: any) => {
        if (error) {
          console.error('CloudStorage getItems error:', error);
          resolve({});
        } else {
          resolve(values || {});
        }
      });
    });
  }

  public async cloudStorageSetItems(items: Record<string, string>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webApp?.CloudStorage?.setItems(items, (error: any) => {
        if (error) {
          console.error('CloudStorage setItems error:', error);
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }

  public async cloudStorageRemoveItems(keys: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webApp?.CloudStorage?.removeItems(keys, (error: any) => {
        if (error) {
          console.error('CloudStorage removeItems error:', error);
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }

  public onEvent(event: string, callback: (...args: any[]) => void): void {
    this.webApp?.onEvent(event, callback);
  }

  public offEvent(event: string, callback: (...args: any[]) => void): void {
    this.webApp?.offEvent(event, callback);
  }

  public setHeaderColor(color: string): void {
    this.webApp?.setHeaderColor(color);
  }

  public setBackgroundColor(color: string): void {
    this.webApp?.setBackgroundColor(color);
  }
}

// Singleton instance
export const telegramSDK = new TelegramSDK();

// Export types
export * from './types';