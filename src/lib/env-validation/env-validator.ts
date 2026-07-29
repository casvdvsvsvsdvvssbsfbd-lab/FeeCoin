// ============================================
// Environment Validation
// Production-ready environment validation
// ============================================

interface EnvironmentConfig {
  NODE_ENV: 'development' | 'staging' | 'production';
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  API_URL: string;
  CDN_URL?: string;
  SENTRY_DSN?: string;
  AMPLITUDE_API_KEY?: string;
  MIXPANEL_TOKEN?: string;
  GOOGLE_ANALYTICS_ID?: string;
  FIREBASE_CONFIG?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  ADMOB_APP_ID?: string;
  UNITY_GAME_ID?: string;
  IRONSOURCE_APP_KEY?: string;
  APPLOVIN_SDK_KEY?: string;
  FACEBOOK_APP_ID?: string;
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  ENABLE_PERFORMANCE_MONITORING: boolean;
  ENABLE_FEATURE_FLAGS: boolean;
  ENABLE_REMOTE_CONFIG: boolean;
  ENABLE_OFFLINE_MODE: boolean;
  ENABLE_BACKGROUND_SYNC: boolean;
  MAX_RETRY_ATTEMPTS: number;
  REQUEST_TIMEOUT: number;
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private config: EnvironmentConfig | null = null;
  private validationErrors: string[] = [];

  private constructor() {}

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  public validate(): EnvironmentConfig {
    if (this.config) {
      return this.config;
    }

    this.validationErrors = [];

    // Validate NODE_ENV
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (!['development', 'staging', 'production'].includes(nodeEnv)) {
      this.validationErrors.push(`Invalid NODE_ENV: ${nodeEnv}`);
    }

    // Validate required Supabase config
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      this.validationErrors.push('Missing VITE_SUPABASE_URL');
    } else if (!supabaseUrl.startsWith('https://')) {
      this.validationErrors.push('VITE_SUPABASE_URL must start with https://');
    }

    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseAnonKey) {
      this.validationErrors.push('Missing VITE_SUPABASE_ANON_KEY');
    } else if (supabaseAnonKey.length < 32) {
      this.validationErrors.push('VITE_SUPABASE_ANON_KEY appears to be invalid');
    }

    // Validate optional but recommended configs
    const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseServiceRoleKey && nodeEnv === 'production') {
      this.validationErrors.push('Missing VITE_SUPABASE_SERVICE_ROLE_KEY in production');
    }

    // Validate API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fee.app';
    if (!apiUrl.startsWith('https://') && nodeEnv === 'production') {
      this.validationErrors.push('VITE_API_URL must use HTTPS in production');
    }

    // Validate optional integrations
    if (process.env.NEXT_PUBLIC_SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN.startsWith('https://')) {
      this.validationErrors.push('VITE_SENTRY_DSN must be a valid URL');
    }

    if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY && process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY.length < 10) {
      this.validationErrors.push('VITE_AMPLITUDE_API_KEY appears to be invalid');
    }

    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN.length < 10) {
      this.validationErrors.push('VITE_MIXPANEL_TOKEN appears to be invalid');
    }

    // Check for errors
    if (this.validationErrors.length > 0) {
      const errorMessage = `Environment validation failed:\n${this.validationErrors.join('\n')}`;
      
      if (nodeEnv === 'production') {
        throw new Error(errorMessage);
      } else {
        console.error(errorMessage);
      }
    }

    // Build config
    this.config = {
      NODE_ENV: nodeEnv as 'development' | 'staging' | 'production',
      SUPABASE_URL: supabaseUrl || '',
      SUPABASE_ANON_KEY: supabaseAnonKey || '',
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey,
      TELEGRAM_BOT_TOKEN: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
      API_URL: apiUrl,
      CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
      SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      AMPLITUDE_API_KEY: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
      MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
      GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      FIREBASE_CONFIG: process.env.NEXT_PUBLIC_FIREBASE_CONFIG ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) : undefined,
      ADMOB_APP_ID: process.env.NEXT_PUBLIC_ADMOB_APP_ID,
      UNITY_GAME_ID: process.env.NEXT_PUBLIC_UNITY_GAME_ID,
      IRONSOURCE_APP_KEY: process.env.NEXT_PUBLIC_IRONSOURCE_APP_KEY,
      APPLOVIN_SDK_KEY: process.env.NEXT_PUBLIC_APPLOVIN_SDK_KEY,
      FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
      ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
      ENABLE_CRASH_REPORTING: process.env.NEXT_PUBLIC_ENABLE_CRASH_REPORTING !== 'false',
      ENABLE_PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== 'false',
      ENABLE_FEATURE_FLAGS: process.env.NEXT_PUBLIC_ENABLE_FEATURE_FLAGS !== 'false',
      ENABLE_REMOTE_CONFIG: process.env.NEXT_PUBLIC_ENABLE_REMOTE_CONFIG !== 'false',
      ENABLE_OFFLINE_MODE: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
      ENABLE_BACKGROUND_SYNC: process.env.NEXT_PUBLIC_ENABLE_BACKGROUND_SYNC === 'true',
      MAX_RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_MAX_RETRY_ATTEMPTS || '3'),
      REQUEST_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT || '30000'),
    };

    // Log config in development
    if (nodeEnv === 'development') {
      console.log('Environment validated:', {
        ...this.config,
        SUPABASE_ANON_KEY: this.config.SUPABASE_ANON_KEY ? '***' + this.config.SUPABASE_ANON_KEY.slice(-4) : 'MISSING',
        SUPABASE_SERVICE_ROLE_KEY: this.config.SUPABASE_SERVICE_ROLE_KEY ? '***' + this.config.SUPABASE_SERVICE_ROLE_KEY.slice(-4) : 'MISSING',
      });
    }

    return this.config;
  }

  public getConfig(): EnvironmentConfig {
    if (!this.config) {
      return this.validate();
    }
    return this.config;
  }

  public isDevelopment(): boolean {
    return this.getConfig().NODE_ENV === 'development';
  }

  public isStaging(): boolean {
    return this.getConfig().NODE_ENV === 'staging';
  }

  public isProduction(): boolean {
    return this.getConfig().NODE_ENV === 'production';
  }

  public getValidationErrors(): string[] {
    return [...this.validationErrors];
  }
}

export const envValidator = EnvironmentValidator.getInstance();
export type { EnvironmentConfig };