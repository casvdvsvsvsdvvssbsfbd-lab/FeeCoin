// ============================================
// Secret Manager
// Centralized secrets management
// Never hardcode secrets - load from env or vault
// ============================================

export interface SecretEntry {
  key: string;
  value: string;
  category: SecretCategory;
  encrypted: boolean;
  rotatedAt: number;
  version: number;
}

export type SecretCategory =
  | 'supabase'
  | 'telegram'
  | 'provider'
  | 'webhook'
  | 'encryption'
  | 'jwt'
  | 'admin'
  | 'database'
  | 'api'
  | 'third_party';

export interface SecretManagerConfig {
  environment: 'development' | 'staging' | 'production';
  enableEncryption: boolean;
  enableRotation: boolean;
  rotationCheckInterval: number;
  vaultUrl?: string;
  vaultToken?: string;
}

const DEFAULT_CONFIG: SecretManagerConfig = {
  environment: 'development',
  enableEncryption: true,
  enableRotation: true,
  rotationCheckInterval: 3600000, // 1 hour
};

export class SecretManager {
  private config: SecretManagerConfig;
  private secrets: Map<string, SecretEntry> = new Map();
  private rotationTimers: Map<string, NodeJS.Timeout> = new Map();
  private initialized = false;

  constructor(config: Partial<SecretManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize secret manager - load all secrets from environment
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const getEnv = (key: string, fallback = ''): string => {
      return (typeof process !== 'undefined' && process.env?.[key]) || (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.[key]) || fallback;
    };

    // Load Supabase secrets
    this.registerSecret('supabase_url', getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL'), 'supabase');
    this.registerSecret('supabase_anon_key', getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY'), 'supabase');
    this.registerSecret('supabase_service_role_key', getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('VITE_SUPABASE_SERVICE_ROLE_KEY'), 'supabase');

    // Load Telegram secrets
    this.registerSecret('telegram_bot_token', getEnv('TELEGRAM_BOT_TOKEN') || getEnv('VITE_TELEGRAM_BOT_TOKEN'), 'telegram');
    this.registerSecret('telegram_bot_name', getEnv('NEXT_PUBLIC_TELEGRAM_BOT_NAME') || getEnv('VITE_TELEGRAM_BOT_NAME'), 'telegram');

    // Load JWT secrets
    this.registerSecret('jwt_access_secret', getEnv('JWT_ACCESS_SECRET') || getEnv('VITE_JWT_ACCESS_SECRET') || 'fee-access-secret', 'jwt');
    this.registerSecret('jwt_refresh_secret', getEnv('JWT_REFRESH_SECRET') || getEnv('VITE_JWT_REFRESH_SECRET') || 'fee-refresh-secret', 'jwt');

    // Load encryption secrets
    this.registerSecret('encryption_master_key', getEnv('ENCRYPTION_MASTER_KEY') || getEnv('VITE_ENCRYPTION_MASTER_KEY') || 'fee-master-key', 'encryption');

    // Load admin secrets
    this.registerSecret('admin_secret_key', getEnv('ADMIN_SECRET_KEY') || getEnv('VITE_ADMIN_SECRET_KEY'), 'admin');
    this.registerSecret('admin_api_key', getEnv('ADMIN_API_KEY') || getEnv('VITE_ADMIN_API_KEY'), 'admin');

    // Load provider API keys
    this.registerSecret('adsgram_api_key', getEnv('ADSGRAM_API_KEY') || getEnv('VITE_ADSGRAM_API_KEY'), 'provider');
    this.registerSecret('monetag_api_key', getEnv('MONETAG_API_KEY') || getEnv('VITE_MONETAG_API_KEY'), 'provider');
    this.registerSecret('lootably_api_key', getEnv('LOOTABLY_API_KEY') || getEnv('VITE_LOOTABLY_API_KEY'), 'provider');
    this.registerSecret('offertoro_api_key', getEnv('OFFERTORO_API_KEY') || getEnv('VITE_OFFERTORO_API_KEY'), 'provider');
    this.registerSecret('cpxresearch_api_key', getEnv('CPXRESEARCH_API_KEY') || getEnv('VITE_CPXRESEARCH_API_KEY'), 'provider');
    this.registerSecret('bitlabs_api_key', getEnv('BITLABS_API_KEY') || getEnv('VITE_BITLABS_API_KEY'), 'provider');
    this.registerSecret('pollfish_api_key', getEnv('POLLFISH_API_KEY') || getEnv('VITE_POLLFISH_API_KEY'), 'provider');
    this.registerSecret('inbrain_api_key', getEnv('INBRAIN_API_KEY') || getEnv('VITE_INBRAIN_API_KEY'), 'provider');
    this.registerSecret('ayetstudios_api_key', getEnv('AYETSTUDIOS_API_KEY') || getEnv('VITE_AYETSTUDIOS_API_KEY'), 'provider');
    this.registerSecret('wannads_api_key', getEnv('WANNADS_API_KEY') || getEnv('VITE_WANNADS_API_KEY'), 'provider');
    this.registerSecret('adgate_api_key', getEnv('ADGATE_API_KEY') || getEnv('VITE_ADGATE_API_KEY'), 'provider');
    this.registerSecret('timewall_api_key', getEnv('TIMEWALL_API_KEY') || getEnv('VITE_TIMEWALL_API_KEY'), 'provider');
    this.registerSecret('admob_app_id', getEnv('NEXT_PUBLIC_ADMOB_APP_ID') || getEnv('VITE_ADMOB_APP_ID'), 'provider');
    this.registerSecret('unity_game_id', getEnv('NEXT_PUBLIC_UNITY_GAME_ID') || getEnv('VITE_UNITY_GAME_ID'), 'provider');
    this.registerSecret('ironsource_app_key', getEnv('NEXT_PUBLIC_IRONSOURCE_APP_KEY') || getEnv('VITE_IRONSOURCE_APP_KEY'), 'provider');
    this.registerSecret('applovin_sdk_key', getEnv('NEXT_PUBLIC_APPLOVIN_SDK_KEY') || getEnv('VITE_APPLOVIN_SDK_KEY'), 'provider');

    // Load webhook secrets
    this.registerSecret('webhook_adsgram_secret', getEnv('WEBHOOK_ADSGRAM_SECRET') || getEnv('VITE_WEBHOOK_ADSGRAM_SECRET'), 'webhook');
    this.registerSecret('webhook_monetag_secret', getEnv('WEBHOOK_MONETAG_SECRET') || getEnv('VITE_WEBHOOK_MONETAG_SECRET'), 'webhook');
    this.registerSecret('webhook_lootably_secret', getEnv('WEBHOOK_LOOTABLY_SECRET') || getEnv('VITE_WEBHOOK_LOOTABLY_SECRET'), 'webhook');
    this.registerSecret('webhook_offertoro_secret', getEnv('WEBHOOK_OFFERTORO_SECRET') || getEnv('VITE_WEBHOOK_OFFERTORO_SECRET'), 'webhook');
    this.registerSecret('webhook_generic_secret', getEnv('WEBHOOK_GENERIC_SECRET') || getEnv('VITE_WEBHOOK_GENERIC_SECRET'), 'webhook');

    // Load API secrets
    this.registerSecret('api_rate_limit_ttl', getEnv('API_RATE_LIMIT_TTL') || '60', 'api');
    this.registerSecret('api_rate_limit_max', getEnv('API_RATE_LIMIT_MAX') || '100', 'api');

    // Load third-party secrets
    this.registerSecret('sentry_dsn', getEnv('NEXT_PUBLIC_SENTRY_DSN') || getEnv('VITE_SENTRY_DSN'), 'third_party');
    this.registerSecret('amplitude_api_key', getEnv('NEXT_PUBLIC_AMPLITUDE_API_KEY') || getEnv('VITE_AMPLITUDE_API_KEY'), 'third_party');
    this.registerSecret('mixpanel_token', getEnv('NEXT_PUBLIC_MIXPANEL_TOKEN') || getEnv('VITE_MIXPANEL_TOKEN'), 'third_party');

    // Validate required secrets in production
    if (this.config.environment === 'production') {
      this.validateRequiredSecrets();
    }

    this.initialized = true;

    // Start rotation checks
    if (this.config.enableRotation) {
      this.startRotationChecks();
    }
  }

  /**
   * Register a secret
   */
  private registerSecret(key: string, value: string, category: SecretCategory): void {
    const existing = this.secrets.get(key);
    this.secrets.set(key, {
      key,
      value,
      category,
      encrypted: false,
      rotatedAt: Date.now(),
      version: existing ? existing.version + 1 : 1,
    });
  }

  /**
   * Get a secret value
   */
  getSecret(key: string): string {
    const entry = this.secrets.get(key);
    if (!entry) {
      if (this.config.environment === 'production') {
        throw new Error(`Secret not found: ${key}`);
      }
      return '';
    }
    return entry.value;
  }

  /**
   * Get a secret entry with metadata
   */
  getSecretEntry(key: string): SecretEntry | undefined {
    return this.secrets.get(key);
  }

  /**
   * Get all secrets for a category
   */
  getSecretsByCategory(category: SecretCategory): SecretEntry[] {
    return Array.from(this.secrets.values()).filter(s => s.category === category);
  }

  /**
   * Check if a secret exists
   */
  hasSecret(key: string): boolean {
    return this.secrets.has(key);
  }

  /**
   * Update a secret value
   */
  updateSecret(key: string, value: string): void {
    const existing = this.secrets.get(key);
    if (existing) {
      this.secrets.set(key, {
        ...existing,
        value,
        version: existing.version + 1,
        rotatedAt: Date.now(),
      });
    }
  }

  /**
   * Mask a secret value for logging (show first 4 chars)
   */
  maskSecret(key: string): string {
    const value = this.getSecret(key);
    if (!value) return 'EMPTY';
    if (value.length <= 8) return '***';
    return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
  }

  /**
   * Validate that required secrets exist in production
   */
  private validateRequiredSecrets(): void {
    const requiredSecrets = [
      'supabase_url',
      'supabase_anon_key',
      'supabase_service_role_key',
      'telegram_bot_token',
      'jwt_access_secret',
      'jwt_refresh_secret',
      'encryption_master_key',
      'admin_secret_key',
      'admin_api_key',
    ];

    const missing = requiredSecrets.filter(key => {
      const entry = this.secrets.get(key);
      return !entry || !entry.value;
    });

    if (missing.length > 0) {
      console.error(`Missing required secrets in production: ${missing.join(', ')}`);
    }
  }

  /**
   * Start automatic rotation checks
   */
  private startRotationChecks(): void {
    setInterval(() => {
      this.checkRotationNeeds();
    }, this.config.rotationCheckInterval);
  }

  /**
   * Check which secrets need rotation
   */
  private async checkRotationNeeds(): Promise<void> {
    const now = Date.now();
    const rotationPeriods: Record<string, number> = {
      jwt: 86400000, // 24 hours for JWT secrets
      encryption: 86400000, // 24 hours for encryption keys
      webhook: 2592000000, // 30 days for webhook secrets
      provider: 2592000000, // 30 days for provider keys
    };

    for (const [key, entry] of this.secrets) {
      const period = rotationPeriods[entry.category];
      if (period && now - entry.rotatedAt > period) {
        console.warn(`Secret ${key} is due for rotation (category: ${entry.category})`);
        this.emitRotationNeeded(key, entry);
      }
    }
  }

  /**
   * Emit rotation needed event
   */
  private emitRotationNeeded(key: string, entry: SecretEntry): void {
    // In production, this would notify the rotation system
  }

  /**
   * Get all secret categories
   */
  getCategories(): SecretCategory[] {
    const categories = new Set<SecretCategory>();
    this.secrets.forEach(entry => categories.add(entry.category));
    return Array.from(categories);
  }

  /**
   * Get secrets summary for monitoring
   */
  getSummary(): Record<string, { count: number; masked: string }> {
    const summary: Record<string, { count: number; masked: string }> = {};
    
    this.getCategories().forEach(category => {
      const categorySecrets = this.getSecretsByCategory(category);
      summary[category] = {
        count: categorySecrets.length,
        masked: categorySecrets.length > 0 ? '***configured***' : '***missing***',
      };
    });

    return summary;
  }

  /**
   * Get total secret count
   */
  getTotalCount(): number {
    return this.secrets.size;
  }

  /**
   * Check if manager is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Export secrets for startup validation
   */
  exportValidationReport(): Array<{ key: string; present: boolean; category: SecretCategory }> {
    return Array.from(this.secrets.values()).map(entry => ({
      key: entry.key,
      present: !!entry.value,
      category: entry.category,
    }));
  }
}

// Singleton instance
export const secretManager = new SecretManager();

// Export factory
export function createSecretManager(config: Partial<SecretManagerConfig> = {}): SecretManager {
  return new SecretManager(config);
}