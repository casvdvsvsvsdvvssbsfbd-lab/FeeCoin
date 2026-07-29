// ============================================
// Rate Limiter
// ============================================

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export class RateLimiter {
  private windows: Map<string, { count: number; resetTime: number }> = new Map();
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: 60000, // 1 minute
      maxRequests: 100,
      keyPrefix: 'ratelimit',
      ...config
    };
  }

  /**
   * Check if request is allowed
   */
  checkLimit(key: string): RateLimitResult {
    const now = Date.now();
    const fullKey = `${this.config.keyPrefix}:${key}`;
    
    const window = this.windows.get(fullKey);
    
    if (!window || now > window.resetTime) {
      // Create new window
      const resetTime = now + this.config.windowMs;
      this.windows.set(fullKey, {
        count: 1,
        resetTime
      });
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: new Date(resetTime)
      };
    }

    // Check if limit exceeded
    if (window.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(window.resetTime),
        retryAfter: Math.ceil((window.resetTime - now) / 1000)
      };
    }

    // Increment count
    window.count++;
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - window.count,
      resetTime: new Date(window.resetTime)
    };
  }

  /**
   * Check limit with sliding window
   */
  checkSlidingWindow(key: string, timestamps?: number[]): RateLimitResult {
    const now = Date.now();
    const fullKey = `${this.config.keyPrefix}:sliding:${key}`;
    const windowStart = now - this.config.windowMs;
    
    // Get existing timestamps or initialize
    let requestTimestamps: number[] = [];
    const existing = this.windows.get(fullKey);
    
    if (existing && Array.isArray(existing.count)) {
      requestTimestamps = existing.count as number[];
    } else if (timestamps) {
      requestTimestamps = timestamps;
    }
    
    // Filter to only include timestamps within the window
    const recentTimestamps = requestTimestamps.filter(ts => ts > windowStart);
    
    // Check if limit exceeded
    if (recentTimestamps.length >= this.config.maxRequests) {
      const oldestTimestamp = recentTimestamps[0];
      const retryAfter = Math.ceil((oldestTimestamp + this.config.windowMs - now) / 1000);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(oldestTimestamp + this.config.windowMs),
        retryAfter
      };
    }

    // Add current timestamp
    recentTimestamps.push(now);
    
    // Store updated timestamps
    this.windows.set(fullKey, {
      count: recentTimestamps as any,
      resetTime: now + this.config.windowMs
    });
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - recentTimestamps.length,
      resetTime: new Date(now + this.config.windowMs)
    };
  }

  /**
   * Token bucket implementation
   */
  private tokenBuckets: Map<string, { tokens: number; lastRefill: number }> = new Map();

  checkTokenBucket(key: string, tokensRequired: number = 1): RateLimitResult {
    const now = Date.now();
    const fullKey = `${this.config.keyPrefix}:bucket:${key}`;
    
    const bucket = this.tokenBuckets.get(fullKey);
    const refillRate = this.config.maxRequests / (this.config.windowMs / 1000); // tokens per second
    
    if (!bucket) {
      // Initialize bucket
      this.tokenBuckets.set(fullKey, {
        tokens: this.config.maxRequests - tokensRequired,
        lastRefill: now
      });
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - tokensRequired,
        resetTime: new Date(now + this.config.windowMs)
      };
    }

    // Refill tokens based on time passed
    const timePassed = (now - bucket.lastRefill) / 1000; // seconds
    const tokensToAdd = timePassed * refillRate;
    bucket.tokens = Math.min(this.config.maxRequests, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    // Check if enough tokens
    if (bucket.tokens < tokensRequired) {
      const tokensNeeded = tokensRequired - bucket.tokens;
      const retryAfter = Math.ceil(tokensNeeded / refillRate);
      
      return {
        allowed: false,
        remaining: Math.floor(bucket.tokens),
        resetTime: new Date(now + retryAfter * 1000),
        retryAfter
      };
    }

    // Consume tokens
    bucket.tokens -= tokensRequired;
    
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetTime: new Date(now + this.config.windowMs)
    };
  }

  /**
   * Global rate limiter
   */
  checkGlobalLimit(): RateLimitResult {
    return this.checkLimit('global');
  }

  /**
   * User rate limiter
   */
  checkUserLimit(userId: string): RateLimitResult {
    return this.checkLimit(`user:${userId}`);
  }

  /**
   * Device rate limiter
   */
  checkDeviceLimit(deviceId: string): RateLimitResult {
    return this.checkLimit(`device:${deviceId}`);
  }

  /**
   * IP rate limiter
   */
  checkIpLimit(ipAddress: string): RateLimitResult {
    return this.checkLimit(`ip:${ipAddress}`);
  }

  /**
   * Provider rate limiter
   */
  checkProviderLimit(providerId: string): RateLimitResult {
    return this.checkLimit(`provider:${providerId}`);
  }

  /**
   * Reset rate limit for key
   */
  resetKey(key: string): void {
    const fullKey = `${this.config.keyPrefix}:${key}`;
    this.windows.delete(fullKey);
    this.tokenBuckets.delete(fullKey);
  }

  /**
   * Clear all rate limits
   */
  clear(): void {
    this.windows.clear();
    this.tokenBuckets.clear();
  }

  /**
   * Get rate limit statistics
   */
  getStatistics(): {
    totalKeys: number;
    activeWindows: number;
    activeBuckets: number;
  } {
    return {
      totalKeys: this.windows.size + this.tokenBuckets.size,
      activeWindows: this.windows.size,
      activeBuckets: this.tokenBuckets.size
    };
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = Date.now();
    
    // Cleanup windows
    this.windows.forEach((window, key) => {
      if (now > window.resetTime) {
        this.windows.delete(key);
      }
    });
    
    // Cleanup token buckets (refill will recreate if needed)
    this.tokenBuckets.forEach((bucket, key) => {
      const timeSinceLastRefill = (now - bucket.lastRefill) / 1000;
      if (timeSinceLastRefill > this.config.windowMs * 2) {
        this.tokenBuckets.delete(key);
      }
    });
  }
}