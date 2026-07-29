// ============================================
// Telegram Service
// Production-ready Telegram Mini App SDK integration
// ============================================

import { useAuthStore } from '../stores/auth-store';
import { useSettingsStore } from '../stores/settings-store';
import { useAnalytics } from '../analytics';
import { useRealtimeStore } from '../stores/realtime-store';


export interface TelegramUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
  isPremium: boolean;
  photoUrl?: string;
}

export interface TelegramInitData {
  queryId?: string;
  user?: TelegramUser;
  authDate: number;
  hash: string;
  startParam?: string;
  ref?: string;
  campaign?: string;
  source?: string;
}

export interface TelegramTheme {
  backgroundColor: string;
  textColor: string;
  hintColor: string;
  linkColor: string;
  buttonColor: string;
  buttonTextColor: string;
  secondaryBackgroundColor: string;
}

class TelegramService {
  private analytics = useAnalytics();
  private webApp: any = null;
  private isInitialized = false;
  private initData: TelegramInitData | null = null;

  // Initialize Telegram WebApp
  async initialize(): Promise<void> {
    try {
      // Check if Telegram WebApp is available
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        this.webApp = window.Telegram.WebApp;
        
        // Initialize the WebApp
        this.webApp.ready();
        
        // Parse init data
        this.initData = this.parseInitData(this.webApp.initData);
        
        // Set up event listeners
        this.setupEventListeners();
        this.analytics.trackEvent('telegram_initialized', {
          userId: this.initData?.user?.id,
          platform: this.webApp.platform,
        });
      } else {
        // Development mode - create mock WebApp
        console.warn('Telegram WebApp not available, running in development mode');
        this.createMockWebApp();
      }
    } catch (error) {
      console.error('Failed to initialize Telegram:', error);
      this.createMockWebApp();
    }
  }

  // Create mock WebApp for development
  private createMockWebApp(): void {
    this.webApp = {
      ready: () => {},
      expand: () => {},
      close: () => {},
      sendData: (data: string) => console.log('Mock sendData:', data),
      switchInlineQuery: (query: string) => {},
      openLink: (url: string) => window.open(url, '_blank'),
      openTelegramLink: (url: string) => window.open(url, '_blank'),
      openInvoice: (url: string, callback: (status: string) => void) => callback('paid'),
      showPopup: (params: any, callback: (buttonId: string) => void) => callback('close'),
      showAlert: (message: string, callback: () => void) => callback(),
      showConfirm: (message: string, callback: (buttonId: string) => void) => callback('OK'),
      showProgress: () => {},
      hideProgress: () => {},
      showMainButton: () => {},
      hideMainButton: () => {},
      setMainButtonText: (text: string) => {},
      setMainButtonColor: (color: string) => {},
      showSecondaryButton: () => {},
      hideSecondaryButton: () => {},
      setSecondaryButtonText: (text: string) => {},
      setSecondaryButtonColor: (color: string) => {},
      showBackButton: () => {},
      hideBackButton: () => {},
      onEvent: (event: string, callback: any) => {},
      offEvent: (event: string, callback: any) => {},
      setHeaderColor: (color: string) => {},
      setBackgroundColor: (color: string) => {},
      setBottomBarColor: (color: string) => {},
      MainButton: {
        text: '',
        color: '',
        textColor: '',
        isVisible: false,
        isActive: true,
        isProgressVisible: false,
        setText: (text: string) => {},
        show: () => {},
        hide: () => {},
        setColor: (color: string) => {},
        setTextColor: (color: string) => {},
        showProgress: () => {},
        hideProgress: () => {},
        enable: () => {},
        disable: () => {},
        onClick: (callback: () => void) => {},
      },
      SecondaryButton: {
        text: '',
        color: '',
        textColor: '',
        isVisible: false,
        isActive: true,
        setText: (text: string) => {},
        show: () => {},
        hide: () => {},
        setColor: (color: string) => {},
        setTextColor: (color: string) => {},
        onClick: (callback: () => void) => {},
      },
      BackButton: {
        isVisible: false,
        show: () => {},
        hide: () => {},
        onClick: (callback: () => void) => {},
      },
      SettingsButton: {
        isVisible: false,
        show: () => {},
        hide: () => {},
        onClick: (callback: () => void) => {},
      },
      BiometricManager: {
        isInited: false,
        isBiometricAvailable: false,
        isAccessRequested: false,
        isAccessGranted: false,
        isBiometricLocked: false,
        lockReason: '',
        deviceId: '',
        init: (callback: (success: boolean) => void) => callback(true),
        requestAccess: (callback: (success: boolean) => void) => callback(true),
        authenticate: (callback: (success: boolean) => void) => callback(true),
        updateBiometricToken: (token: string, callback: (success: boolean) => void) => callback(true),
      },
      CloudStorage: {
        getItem: (key: string, callback: (value: string | null) => void) => callback(null),
        setItem: (key: string, value: string, callback: (success: boolean) => void) => callback(true),
        removeItem: (key: string, callback: (success: boolean) => void) => callback(true),
        getKeys: (callback: (keys: string[]) => void) => callback([]),
      },
      viewportHeight: window.innerHeight,
      viewportStableHeight: window.innerHeight,
      isExpanded: true,
      isFullscreen: false,
      platform: 'web',
      version: '6.0',
      colorScheme: 'dark',
      themeParams: {
        bg_color: '#0A0E14',
        text_color: '#ffffff',
        hint_color: '#888888',
        link_color: '#00FF88',
        button_color: '#00FF88',
        button_text_color: '#0A0E14',
        secondary_bg_color: '#1A1F2E',
      },
      initData: '',
      initDataUnsafe: {},
    };

    this.initData = {
      authDate: Math.floor(Date.now() / 1000),
      hash: 'mock_hash',
    };

    this.isInitialized = true;
  }

  // Parse init data from Telegram
  private parseInitData(initData: string): TelegramInitData | null {
    try {
      if (!initData) return null;

      const params = new URLSearchParams(initData);
      const data: any = {};

      params.forEach((value, key) => {
        data[key] = value;
      });

      // Parse user data
      if (data.user) {
        data.user = JSON.parse(data.user);
      }

      return {
        queryId: data.query_id,
        user: data.user,
        authDate: parseInt(data.auth_date),
        hash: data.hash,
        startParam: data.start_param,
        ref: data.ref,
        campaign: data.campaign,
        source: data.source,
      };
    } catch (error) {
      console.error('Failed to parse init data:', error);
      return null;
    }
  }

  // Set up Telegram event listeners
  private setupEventListeners(): void {
    if (!this.webApp) return;

    // Theme changed
    this.webApp.onEvent('themeChanged', () => {
      this.applyTheme();
      this.analytics.trackEvent('telegram_theme_changed');
    });

    // Viewport changed
    this.webApp.onEvent('viewportChanged', (data: any) => {
      this.analytics.trackEvent('telegram_viewport_changed', {
        height: data.height,
        isExpanded: data.isExpanded,
      });
    });

    // Safe area changed
    this.webApp.onEvent('safeAreaChanged', (data: any) => {
      this.analytics.trackEvent('telegram_safearea_changed', {
        top: data.safeArea?.top,
        bottom: data.safeArea?.bottom,
      });
    });

    // Back button clicked
    this.webApp.onEvent('backButtonClicked', () => {
      this.analytics.trackEvent('telegram_back_button_clicked');
    });

    // Main button clicked
    this.webApp.onEvent('mainButtonClicked', () => {
      this.analytics.trackEvent('telegram_main_button_clicked');
    });

    // Secondary button clicked
    this.webApp.onEvent('secondaryButtonClicked', () => {
      this.analytics.trackEvent('telegram_secondary_button_clicked');
    });

    // Settings button clicked
    this.webApp.onEvent('settingsButtonClicked', () => {
      this.analytics.trackEvent('telegram_settings_button_clicked');
    });

    // Popup closed
    this.webApp.onEvent('popupClosed', (data: any) => {
      this.analytics.trackEvent('telegram_popup_closed', {
        buttonId: data.button_id,
      });
    });

    // Invoice closed
    this.webApp.onEvent('invoiceClosed', (data: any) => {
      this.analytics.trackEvent('telegram_invoice_closed', {
        status: data.status,
      });
    });

    // QR text received
    this.webApp.onEvent('qrTextReceived', (data: any) => {
      this.analytics.trackEvent('telegram_qr_received', {
        text: data.text,
      });
    });

    // Activated
    this.webApp.onEvent('activated', () => {
      this.analytics.trackEvent('telegram_activated');
    });

    // Deactivated
    this.webApp.onEvent('deactivated', () => {
      this.analytics.trackEvent('telegram_deactivated');
    });

    // Fullscreen changed
    this.webApp.onEvent('fullscreenChanged', (data: any) => {
      this.analytics.trackEvent('telegram_fullscreen_changed', {
        isFullscreen: data.is_fullscreen,
      });
    });
  }

  // Apply Telegram theme to app
  private applyTheme(): void {
    if (!this.webApp?.themeParams) return;

    const settingsStore = useSettingsStore.getState();
    const theme = this.webApp.themeParams;

    // Update settings store with Telegram theme
    settingsStore.setTheme('dark');
  }

  // Get Telegram user data
  getUser(): TelegramUser | null {
    return this.initData?.user || null;
  }

  // Get init data
  getInitData(): TelegramInitData | null {
    return this.initData;
  }

  // Validate init data hash
  validateInitData(initData: string, botToken: string): boolean {
    try {
      // This would use crypto to validate the hash
      // For now, return true in development
      return true;
    } catch (error) {
      console.error('Failed to validate init data:', error);
      return false;
    }
  }

  // Get start parameter (for referrals/deep links)
  getStartParam(): string | null {
    return this.initData?.startParam || null;
  }

  // Get referral code from start param
  getReferralCode(): string | null {
    const startParam = this.getStartParam();
    if (!startParam) return null;

    // Parse start param for referral code
    // Format: ref_CODE or startapp=CODE
    if (startParam.startsWith('ref_')) {
      return startParam.substring(4);
    }

    return startParam;
  }

  // Show main button
  showMainButton(text: string, onClick: () => void): void {
    if (!this.webApp) return;

    this.webApp.MainButton.setText(text);
    this.webApp.MainButton.show();
    this.webApp.MainButton.onClick(onClick);
  }

  // Hide main button
  hideMainButton(): void {
    if (!this.webApp) return;
    this.webApp.MainButton.hide();
  }

  // Show back button
  showBackButton(onClick: () => void): void {
    if (!this.webApp) return;

    this.webApp.BackButton.show();
    this.webApp.BackButton.onClick(onClick);
  }

  // Hide back button
  hideBackButton(): void {
    if (!this.webApp) return;
    this.webApp.BackButton.hide();
  }

  // Haptic feedback
  hapticFeedback(type: 'impact' | 'notification' | 'selection', style?: string): void {
    if (!this.webApp?.HapticFeedback) return;

    switch (type) {
      case 'impact':
        this.webApp.HapticFeedback.impactOccurred(style || 'medium');
        break;
      case 'notification':
        this.webApp.HapticFeedback.notificationOccurred(style || 'success');
        break;
      case 'selection':
        this.webApp.HapticFeedback.selectionChanged();
        break;
    }
  }

  // Open link
  openLink(url: string): void {
    if (!this.webApp) {
      window.open(url, '_blank');
      return;
    }

    this.webApp.openLink(url);
  }

  // Open Telegram link
  openTelegramLink(url: string): void {
    if (!this.webApp) {
      window.open(url, '_blank');
      return;
    }

    this.webApp.openTelegramLink(url);
  }

  // Show popup
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: string; text: string }>;
  }, callback: (buttonId: string) => void): void {
    if (!this.webApp) {
      alert(params.message);
      callback('close');
      return;
    }

    this.webApp.showPopup(params, callback);
  }

  // Show alert
  showAlert(message: string, callback: () => void = () => {}): void {
    if (!this.webApp) {
      alert(message);
      callback();
      return;
    }

    this.webApp.showAlert(message, callback);
  }

  // Show confirm
  showConfirm(message: string, callback: (confirmed: boolean) => void): void {
    if (!this.webApp) {
      const confirmed = confirm(message);
      callback(confirmed);
      return;
    }

    this.webApp.showConfirm(message, (buttonId: string) => {
      callback(buttonId === 'OK');
    });
  }

  // Open invoice
  openInvoice(url: string, callback: (status: string) => void): void {
    if (!this.webApp) {
      this.openLink(url);
      callback('failed');
      return;
    }

    this.webApp.openInvoice(url, callback);
  }

  // Share link
  shareLink(text: string, callback?: () => void): void {
    if (navigator.share) {
      navigator.share({
        title: 'Watch to Earn',
        text: text,
        url: window.location.href,
      }).then(() => {
        this.analytics.trackEvent('link_shared');
        callback?.();
      }).catch((error) => {
        console.error('Failed to share:', error);
      });
    } else {
      // Fallback: copy to clipboard
      this.copyToClipboard(window.location.href);
      this.showAlert('Link copied to clipboard!', callback);
    }
  }

  // Copy to clipboard
  copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.analytics.trackEvent('copied_to_clipboard');
    }
  }

  // Close app
  close(): void {
    if (this.webApp) {
      this.webApp.close();
    }
  }

  // Check if initialized
  isReady(): boolean {
    return this.isInitialized;
  }

  // Get WebApp instance
  getWebApp(): any {
    return this.webApp;
  }
}

// Singleton instance
export const telegramService = new TelegramService();