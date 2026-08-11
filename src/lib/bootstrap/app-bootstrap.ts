// ============================================
// App Bootstrap
// Production-ready application bootstrap
// ============================================

import { telegramSDK } from '../telegram';
import { supabase } from '../supabase';
import { LaunchParams, AppConfig, DeviceInfo, FeatureFlags, RemoteConfig } from '../telegram/types';

class AppBootstrap {
  private static instance: AppBootstrap;
  private isBootstrapped = false;
  private bootstrapPromise: Promise<void> | null = null;

  public readonly config: AppConfig = {
    appName: 'FEE',
    version: '1.0.0',
    buildNumber: '1',
    environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.fee.app',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    amplitudeApiKey: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
    mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  };

  private constructor() {
    this.validateEnvironment();
  }

  public static getInstance(): AppBootstrap {
    if (!AppBootstrap.instance) {
      AppBootstrap.instance = new AppBootstrap();
    }
    return AppBootstrap.instance;
  }

  private validateEnvironment(): void {
    const required = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  public async bootstrap(options?: { skipOnboarding?: boolean; skipAuth?: boolean }): Promise<void> {
    if (this.isBootstrapped) return;
    if (this.bootstrapPromise) return this.bootstrapPromise;

    this.bootstrapPromise = this.performBootstrap(options);
    return this.bootstrapPromise;
  }

  private async performBootstrap(options?: { skipOnboarding?: boolean; skipAuth?: boolean }): Promise<void> {
    try {
      // Step 1: Wait for Telegram SDK to initialize
      await telegramSDK.waitForInitialization();

      // Step 2: Parse launch parameters
      const launchParams = this.parseLaunchParams();
      this.storeLaunchParams(launchParams);

      // Step 3: Detect device info
      const deviceInfo = this.detectDeviceInfo();
      this.storeDeviceInfo(deviceInfo);

      // Step 4: Initialize Supabase
      await this.initializeSupabase();

      // Step 5: Load feature flags
      const featureFlags = await this.loadFeatureFlags();
      this.storeFeatureFlags(featureFlags);

      // Step 6: Load remote config
      const remoteConfig = await this.loadRemoteConfig();
      this.storeRemoteConfig(remoteConfig);

      // Step 7: Check for existing session
      const session = await this.checkExistingSession();

      // Step 8: Initialize analytics
      if (this.config.amplitudeApiKey || this.config.mixpanelToken) {
        this.initializeAnalytics();
      }

      // Step 9: Initialize crash reporting
      if (this.config.sentryDsn) {
        this.initializeCrashReporting();
      }

      // Step 10: Setup online/offline detection
      this.setupConnectivityMonitoring();

      // Step 11: Setup session recovery
      this.setupSessionRecovery();

      // Step 12: Mark as bootstrapped
      this.isBootstrapped = true;

      console.log('✅ App bootstrap complete');
    } catch (error) {
      console.error('❌ Bootstrap failed:', error);
      throw error;
    }
  }

  private parseLaunchParams(): LaunchParams {
    const initData = telegramSDK.getWebApp()?.initDataUnsafe;

    if (!initData) {
      return {
        authDate: Date.now(),
        hash: '',
      };
    }

    return {
      userId: initData.user?.id,
      username: initData.user?.username || undefined,
      firstName: initData.user?.first_name || undefined,
      lastName: initData.user?.last_name || undefined,
      languageCode: initData.user?.language_code || undefined,
      isPremium: initData.user?.is_premium || undefined,
      startParam: initData.start_param || undefined,
      queryId: initData.query_id || undefined,
      chatInstance: initData.chat_instance || undefined,
      chatType: initData.chat_type || undefined,
      canSendAfter: initData.can_send_after || undefined,
      authDate: initData.auth_date || Date.now(),
      hash: initData.hash || '',
    };
  }

  private storeLaunchParams(params: LaunchParams): void {
    localStorage.setItem('fee_launch_params', JSON.stringify(params));
  }

  private detectDeviceInfo(): DeviceInfo {
    const webApp = telegramSDK.getWebApp();
    const userAgent = navigator.userAgent;
    const platform = webApp?.platform || this.detectPlatform(userAgent);
    const colorScheme = webApp?.colorScheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    return {
      platform,
      version: webApp?.version || 'unknown',
      colorScheme,
      isPremium: telegramSDK.isPremium(),
      languageCode: telegramSDK.getLanguageCode() || navigator.language.split('-')[0] || 'en',
      viewport: {
        height: telegramSDK.getViewportHeight(),
        stableHeight: telegramSDK.getViewportStableHeight(),
        width: window.innerWidth,
        isExpanded: webApp?.isExpanded || false,
      },
      safeArea: this.getSafeAreaInsets(),
    };
  }

  private getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
    const webApp = telegramSDK.getWebApp();

    if (webApp && typeof webApp === 'object' && 'safeAreaInsets' in webApp) {
      return (webApp as any).safeAreaInsets;
    }

    // Fallback: use CSS env() values
    if (typeof window !== 'undefined') {
      const style = getComputedStyle(document.documentElement);
      return {
        top: parseFloat(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
        bottom: parseFloat(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseFloat(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
        right: parseFloat(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
      };
    }

    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  private detectPlatform(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (ua.includes('telegram')) return 'telegram';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
    if (ua.includes('android')) return 'android';
    if (ua.includes('windows')) return 'windows';
    if (ua.includes('mac')) return 'macos';
    if (ua.includes('linux')) return 'linux';

    return 'web';
  }

  private storeDeviceInfo(deviceInfo: DeviceInfo): void {
    localStorage.setItem('fee_device_info', JSON.stringify(deviceInfo));
  }

  private async initializeSupabase(): Promise<void> {
    // Supabase client is already initialized
    // Just verify connection
    try {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Supabase session check failed:', error);
      }
    } catch (error) {
      console.error('Supabase initialization failed:', error);
    }
  }

  private async loadFeatureFlags(): Promise<FeatureFlags> {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('key, is_enabled, rollout_percentage, target_audience')
        .eq('is_enabled', true);

      if (error) {
        console.error('Failed to load feature flags:', error);
        return {};
      }

      const flags: FeatureFlags = {};

      for (const flag of data || []) {
        // Check if user is in target audience
        if (this.isUserInTargetAudience(flag.target_audience as Record<string, any>)) {
          // Apply rollout percentage
          if (flag.rollout_percentage >= 100) {
            flags[flag.key] = true;
          } else if (flag.rollout_percentage > 0) {
            // Hash user ID to determine if they're in the rollout
            const userId = telegramSDK.getUser()?.id || Math.random();
            const hash = this.hashCode(String(userId) + flag.key);
            const inRollout = (hash % 100) < flag.rollout_percentage;
            flags[flag.key] = inRollout;
          }
        }
      }

      return flags;
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      return {};
    }
  }

  private isUserInTargetAudience(targetAudience: Record<string, any>): boolean {
    if (!targetAudience || Object.keys(targetAudience).length === 0) {
      return true;
    }

    const user = telegramSDK.getUser();

    // Check platform targeting
    if (targetAudience.platforms && user) {
      const platform = this.detectPlatform(navigator.userAgent);
      if (!targetAudience.platforms.includes(platform)) {
        return false;
      }
    }

    // Check premium targeting
    if (targetAudience.premium_only && !telegramSDK.isPremium()) {
      return false;
    }

    // Check language targeting
    if (targetAudience.languages && user?.language_code) {
      if (!targetAudience.languages.includes(user.language_code)) {
        return false;
      }
    }

    return true;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private storeFeatureFlags(flags: FeatureFlags): void {
    localStorage.setItem('fee_feature_flags', JSON.stringify(flags));
  }

  private async loadRemoteConfig(): Promise<RemoteConfig> {
    try {
      const { data, error } = await supabase
        .from('remote_configs')
        .select('key, value, is_active')
        .eq('is_active', true);

      if (error) {
        console.error('Failed to load remote config:', error);
        return {};
      }

      const config: RemoteConfig = {};

      for (const item of data || []) {
        config[item.key] = item.value;
      }

      return config;
    } catch (error) {
      console.error('Failed to load remote config:', error);
      return {};
    }
  }

  private storeRemoteConfig(config: RemoteConfig): void {
    localStorage.setItem('fee_remote_config', JSON.stringify(config));
  }

  private async checkExistingSession(): Promise<any> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        return session;
      }

      // Try to restore from localStorage
      const storedSession = localStorage.getItem('fee_session');
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          // Validate session
          if (sessionData.expires_at && new Date(sessionData.expires_at) > new Date()) {
            return sessionData;
          }
        } catch (error) {
          console.error('Failed to parse stored session:', error);
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to check existing session:', error);
      return null;
    }
  }

  private initializeAnalytics(): void {
    // Initialize Amplitude
    if (this.config.amplitudeApiKey) {
      this.initAmplitude();
    }

    // Initialize Mixpanel
    if (this.config.mixpanelToken) {
      this.initMixpanel();
    }
  }

  private initAmplitude(): void {
    // Dynamically load Amplitude
    const script = document.createElement('script');
    script.src = 'https://cdn.amplitude.com/libs/analytics-browser-2.5.0-min.js';
    script.async = true;

    script.onload = () => {
      try {
        const amplitude = (window as any).amplitude;
        amplitude.init(this.config.amplitudeApiKey, undefined, {
          defaultTracking: {
            sessions: true,
            pageViews: true,
          },
        });

        // Track app launch
        amplitude.logEvent('app_launched', {
          version: this.config.version,
          environment: this.config.environment,
          platform: telegramSDK.getPlatform(),
          isPremium: telegramSDK.isPremium(),
        });
      } catch (error) {
        console.error('Amplitude initialization failed:', error);
      }
    };

    document.head.appendChild(script);
  }

  private initMixpanel(): void {
    // Dynamically load Mixpanel
    const script = document.createElement('script');
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
    script.async = true;

    script.onload = () => {
      try {
        const mixpanel = (window as any).mixpanel;
        mixpanel.init(this.config.mixpanelToken, {
          debug: this.config.environment === 'development',
        });

        // Track app launch
        mixpanel.track('App Launched', {
          version: this.config.version,
          environment: this.config.environment,
          platform: telegramSDK.getPlatform(),
          isPremium: telegramSDK.isPremium(),
        });
      } catch (error) {
        console.error('Mixpanel initialization failed:', error);
      }
    };

    document.head.appendChild(script);
  }

  private initializeCrashReporting(): void {
    // Dynamically load Sentry
    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/7.28.0/bundle.min.js';
    script.crossOrigin = 'anonymous';
    script.async = true;

    script.onload = () => {
      try {
        const Sentry = (window as any).Sentry;
        Sentry.init({
          dsn: this.config.sentryDsn,
          environment: this.config.environment,
          release: `fee@${this.config.version}`,
          tracesSampleRate: this.config.environment === 'production' ? 0.1 : 1.0,
          profilesSampleRate: this.config.environment === 'production' ? 0.1 : 1.0,
        });

        // Set user context
        const user = telegramSDK.getUser();
        if (user) {
          Sentry.setUser({
            id: String(user.id),
            username: user.username,
            email: undefined,
          });
        }
      } catch (error) {
        console.error('Sentry initialization failed:', error);
      }
    };

    document.head.appendChild(script);
  }

  private setupConnectivityMonitoring(): void {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored');
      this.handleConnectionRestored();
    });

    window.addEventListener('offline', () => {
      console.log('📡 Connection lost');
      this.handleConnectionLost();
    });

    // Initial status
    if (!navigator.onLine) {
      this.handleConnectionLost();
    }
  }

  private handleConnectionRestored(): void {
    // Sync any pending data
    this.syncPendingData();
  }

  private handleConnectionLost(): void {
    // Show offline indicator
    // Queue any pending requests
  }

  private async syncPendingData(): Promise<void> {
    // Sync pending transactions, notifications, etc.
    console.log('Syncing pending data...');
  }

  private setupSessionRecovery(): void {
    // Setup session expiry monitoring
    setInterval(() => {
      this.checkSessionExpiry();
    }, 60000); // Check every minute
  }

  private async checkSessionExpiry(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Session expired, try to refresh
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Session refresh failed:', error);
          // Redirect to auth
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  }

  public getLaunchParams(): LaunchParams | null {
    const stored = localStorage.getItem('fee_launch_params');
    return stored ? JSON.parse(stored) : null;
  }

  public getDeviceInfo(): DeviceInfo | null {
    const stored = localStorage.getItem('fee_device_info');
    return stored ? JSON.parse(stored) : null;
  }

  public getFeatureFlags(): FeatureFlags {
    const stored = localStorage.getItem('fee_feature_flags');
    return stored ? JSON.parse(stored) : {};
  }

  public getRemoteConfig(): RemoteConfig {
    const stored = localStorage.getItem('fee_remote_config');
    return stored ? JSON.parse(stored) : {};
  }

  public isFeatureEnabled(feature: string): boolean {
    const flags = this.getFeatureFlags();
    return flags[feature] === true;
  }

  public getRemoteConfigValue<T = any>(key: string, defaultValue?: T): T {
    const config = this.getRemoteConfig();
    return config[key] ?? defaultValue;
  }

  public checkIsBootstrapped(): boolean {
    return this.isBootstrapped;
  }
}

// Singleton instance
export const appBootstrap = AppBootstrap.getInstance();

// Export types
export type { LaunchParams, AppConfig, DeviceInfo, FeatureFlags, RemoteConfig };
