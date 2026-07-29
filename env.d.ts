/// <reference types="next" />
/// <reference types="next/image-types/global" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_SUPABASE_URL: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  readonly NEXT_PUBLIC_API_URL: string;
  readonly NEXT_PUBLIC_SENTRY_DSN: string;
  readonly NEXT_PUBLIC_AMPLITUDE_API_KEY: string;
  readonly NEXT_PUBLIC_MIXPANEL_TOKEN: string;
  readonly NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: string;
  readonly NEXT_PUBLIC_CDN_URL: string;
  readonly NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
  readonly NEXT_PUBLIC_FIREBASE_CONFIG: string;
  readonly NEXT_PUBLIC_ADMOB_APP_ID: string;
  readonly NEXT_PUBLIC_UNITY_GAME_ID: string;
  readonly NEXT_PUBLIC_IRONSOURCE_APP_KEY: string;
  readonly NEXT_PUBLIC_APPLOVIN_SDK_KEY: string;
  readonly NEXT_PUBLIC_FACEBOOK_APP_ID: string;
  readonly NEXT_PUBLIC_ENABLE_ANALYTICS: string;
  readonly NEXT_PUBLIC_ENABLE_CRASH_REPORTING: string;
  readonly NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: string;
  readonly NEXT_PUBLIC_ENABLE_FEATURE_FLAGS: string;
  readonly NEXT_PUBLIC_ENABLE_REMOTE_CONFIG: string;
  readonly NEXT_PUBLIC_ENABLE_OFFLINE_MODE: string;
  readonly NEXT_PUBLIC_ENABLE_BACKGROUND_SYNC: string;
  readonly NEXT_PUBLIC_MAX_RETRY_ATTEMPTS: string;
  readonly NEXT_PUBLIC_REQUEST_TIMEOUT: string;
  readonly NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}