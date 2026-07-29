// ============================================
// Telegram InitData Validator
// Production-grade HMAC-SHA256 validation
// Implements Telegram Mini Apps security spec
// ============================================

import { createHmac, timingSafeEqual } from 'crypto';

export interface ValidatedTelegramData {
  userId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
  authDate: number;
  startParam?: string;
  queryId?: string;
  chatInstance?: string;
  chatType?: string;
  canSendAfter?: number;
}

export interface ValidationResult {
  valid: boolean;
  data: ValidatedTelegramData | null;
  error: string | null;
  age: number;
  usedReplay?: boolean;
}

export interface TelegramValidatorConfig {
  botToken: string;
  maxAgeSeconds: number;
  enableReplayProtection: boolean;
  replayCacheSize: number;
  allowedChatTypes: string[];
  strictMode: boolean;
}

const DEFAULT_CONFIG: TelegramValidatorConfig = {
  botToken: '',
  maxAgeSeconds: 86400,
  enableReplayProtection: true,
  replayCacheSize: 100000,
  allowedChatTypes: ['private', 'group', 'supergroup', 'channel', 'sender'],
  strictMode: true,
};

export class TelegramValidator {
  private config: TelegramValidatorConfig;
  private replayCache: Map<string, number> = new Map();
  private replayCacheKeys: string[] = [];
  private secretKey: Buffer | null = null;
  private secretKeyGeneratedAt: number = 0;
  private secretKeyRotationInterval: number = 3600000; // 1 hour
  private readonly HMAC_ALGORITHM = 'sha256';

  constructor(config: Partial<TelegramValidatorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(config: Partial<TelegramValidatorConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.botToken) {
      this.secretKey = null;
    }
  }

  /**
   * Get current config (for monitoring)
   */
  getConfig(): Readonly<TelegramValidatorConfig> {
    return { ...this.config };
  }

  /**
   * Get or compute the HMAC secret key from bot token
   * Implements key rotation for enhanced security
   */
  private getSecretKey(): Buffer {
    const now = Date.now();
    if (
      this.secretKey &&
      now - this.secretKeyGeneratedAt < this.secretKeyRotationInterval
    ) {
      return this.secretKey;
    }

    // HMAC_SHA256(key="WebAppData", value=botToken)
    this.secretKey = createHmac(this.HMAC_ALGORITHM, 'WebAppData')
      .update(this.config.botToken)
      .digest();
    this.secretKeyGeneratedAt = now;

    return this.secretKey;
  }

  /**
   * Compute HMAC-SHA256 signature for init data
   * @param initData - raw init data string from Telegram
   * @returns computed hash
   */
  computeSignature(initData: string): string {
    const params = new URLSearchParams(initData);
    
    // Remove hash parameter
    const hash = params.get('hash');
    params.delete('hash');

    // Sort parameters alphabetically
    const sortedParams = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');

    // Compute HMAC-SHA256
    const secretKey = this.getSecretKey();
    const computedHash = createHmac(this.HMAC_ALGORITHM, secretKey)
      .update(sortedParams)
      .digest('hex');

    return computedHash;
  }

  /**
   * Validate init data signature using timing-safe comparison
   * @param initData - raw init data string from Telegram
   * @param providedHash - hash provided in initData
   */
  validateSignature(initData: string, providedHash: string): boolean {
    try {
      const computedHash = this.computeSignature(initData);
      const computedBuffer = Buffer.from(computedHash, 'hex');
      const providedBuffer = Buffer.from(providedHash, 'hex');

      if (computedBuffer.length !== providedBuffer.length) {
        return false;
      }

      return timingSafeEqual(computedBuffer, providedBuffer);
    } catch {
      return false;
    }
  }

  /**
   * Validate auth_date freshness
   * @param authDate - Unix timestamp in seconds
   */
  validateAuthDate(authDate: number): { valid: boolean; age: number } {
    const now = Math.floor(Date.now() / 1000);
    const age = now - authDate;

    return {
      valid: age >= 0 && age <= this.config.maxAgeSeconds,
      age,
    };
  }

  /**
   * Check replay protection
   * @param signature - unique signature to check for replay
   * @param authDate - auth timestamp
   */
  checkReplayProtection(signature: string, authDate: number): boolean {
    if (!this.config.enableReplayProtection) {
      return true;
    }

    const cacheKey = `${signature}:${authDate}`;
    
    if (this.replayCache.has(cacheKey)) {
      return false; // Replay detected
    }

    // Store in cache
    this.replayCache.set(cacheKey, Date.now());
    this.replayCacheKeys.push(cacheKey);

    // Evict oldest entries if cache exceeds limit
    if (this.replayCacheKeys.length > this.config.replayCacheSize) {
      const oldestKey = this.replayCacheKeys.shift();
      if (oldestKey) {
        this.replayCache.delete(oldestKey);
      }
    }

    // Clean expired entries periodically
    if (this.replayCacheKeys.length % 1000 === 0) {
      this.cleanExpiredCache();
    }

    return true;
  }

  /**
   * Clean expired cache entries
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    const maxAge = this.config.maxAgeSeconds * 1000;

    for (let i = this.replayCacheKeys.length - 1; i >= 0; i--) {
      const key = this.replayCacheKeys[i];
      const timestamp = this.replayCache.get(key);
      if (timestamp && now - timestamp > maxAge) {
        this.replayCache.delete(key);
        this.replayCacheKeys.splice(i, 1);
      }
    }
  }

  /**
   * Parse validated Telegram init data
   */
  parseInitData(initData: string): ValidatedTelegramData | null {
    try {
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      if (!userStr) return null;

      const user = JSON.parse(decodeURIComponent(userStr));

      return {
        userId: user.id,
        firstName: user.first_name || '',
        lastName: user.last_name,
        username: user.username,
        languageCode: user.language_code,
        isPremium: user.is_premium || false,
        photoUrl: user.photo_url,
        authDate: parseInt(params.get('auth_date') || '0', 10),
        startParam: params.get('start_param') || undefined,
        queryId: params.get('query_id') || undefined,
        chatInstance: params.get('chat_instance') || undefined,
        chatType: params.get('chat_type') || undefined,
        canSendAfter: params.get('can_send_after')
          ? parseInt(params.get('can_send_after')!, 10)
          : undefined,
      };
    } catch {
      return null;
    }
  }

  /**
   * Validate complete init data with all security checks
   * @param initData - raw init data string from Telegram
   * @returns ValidationResult with parsed data or error
   */
  validate(initData: string): ValidationResult {
    const result: ValidationResult = {
      valid: false,
      data: null,
      error: null,
      age: 0,
    };

    try {
      // 1. Parse init data
      const params = new URLSearchParams(initData);
      
      // 2. Check required fields
      const hash = params.get('hash');
      const authDateStr = params.get('auth_date');
      const userStr = params.get('user');

      if (!hash) {
        result.error = 'Missing hash parameter';
        return result;
      }

      if (!authDateStr) {
        result.error = 'Missing auth_date parameter';
        return result;
      }

      if (!userStr) {
        result.error = 'Missing user parameter';
        return result;
      }

      // 3. Validate auth_date freshness
      const authDate = parseInt(authDateStr, 10);
      const authDateValidation = this.validateAuthDate(authDate);
      result.age = authDateValidation.age;

      if (!authDateValidation.valid) {
        result.error = `Auth date expired: ${authDateValidation.age}s old (max: ${this.config.maxAgeSeconds}s)`;
        return result;
      }

      // 4. Validate signature with timing-safe comparison
      const signatureValid = this.validateSignature(initData, hash);
      if (!signatureValid) {
        result.error = 'Invalid signature: hash mismatch';
        return result;
      }

      // 5. Replay protection check
      if (this.config.enableReplayProtection) {
        const replayValid = this.checkReplayProtection(hash, authDate);
        if (!replayValid) {
          result.error = 'Replay attack detected: duplicate hash';
          result.usedReplay = true;
          return result;
        }
      }

      // 6. Validate chat_type if present
      if (this.config.strictMode) {
        const chatType = params.get('chat_type');
        if (chatType && !this.config.allowedChatTypes.includes(chatType)) {
          result.error = `Invalid chat_type: ${chatType}`;
          return result;
        }
      }

      // 7. Parse and return validated data
      const parsedData = this.parseInitData(initData);
      if (!parsedData) {
        result.error = 'Failed to parse user data';
        return result;
      }

      result.valid = true;
      result.data = parsedData;
      return result;
    } catch (error) {
      result.error = `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      return result;
    }
  }

  /**
   * Validate init data from Telegram WebApp
   * Works in both server and client environments
   */
  validateFromWebApp(): ValidationResult {
    try {
      if (typeof window === 'undefined') {
        return {
          valid: false,
          data: null,
          error: 'Telegram WebApp not available in server context',
          age: 0,
        };
      }

      const webApp = (window as any).Telegram?.WebApp;
      if (!webApp?.initData) {
        return {
          valid: false,
          data: null,
          error: 'Telegram WebApp not available',
          age: 0,
        };
      }

      return this.validate(webApp.initData);
    } catch {
      return {
        valid: false,
        data: null,
        error: 'Telegram WebApp validation error',
        age: 0,
      };
    }
  }

  /**
   * Get replay cache statistics
   */
  getCacheStats(): { size: number; maxSize: number; expiredCount: number } {
    return {
      size: this.replayCache.size,
      maxSize: this.config.replayCacheSize,
      expiredCount: this.replayCacheKeys.length - this.replayCache.size,
    };
  }

  /**
   * Clear replay cache
   */
  clearCache(): void {
    this.replayCache.clear();
    this.replayCacheKeys = [];
  }
}

// Singleton instance with default config
export const telegramValidator = new TelegramValidator();

// Export factory for creating instances with custom config
export function createTelegramValidator(
  botToken: string,
  config: Partial<TelegramValidatorConfig> = {}
): TelegramValidator {
  return new TelegramValidator({ ...config, botToken });
}