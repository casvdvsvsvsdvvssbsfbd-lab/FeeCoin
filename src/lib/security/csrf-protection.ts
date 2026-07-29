// ============================================
// CSRF Protection
// Production-grade CSRF token validation
// Origin/referer validation, SameSite cookies
// ============================================

import { randomBytes, createHmac, timingSafeEqual } from 'crypto';

export interface CsrfTokenData {
  token: string;
  expiresAt: number;
  fingerprint: string;
}

export interface CsrfConfig {
  tokenLength: number;
  tokenExpiry: number;
  cookieName: string;
  headerName: string;
  allowedOrigins: string[];
  allowedMethods: string[];
  sameSite: 'strict' | 'lax' | 'none';
  secure: boolean;
  validateOrigin: boolean;
  validateReferer: boolean;
}

const DEFAULT_CONFIG: CsrfConfig = {
  tokenLength: 32,
  tokenExpiry: 3600000, // 1 hour
  cookieName: '_csrf_token',
  headerName: 'x-csrf-token',
  allowedOrigins: [],
  allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'TRACE'],
  sameSite: 'strict',
  secure: true,
  validateOrigin: true,
  validateReferer: true,
};

export class CsrfProtection {
  private config: CsrfConfig;
  private tokens: Map<string, CsrfTokenData> = new Map();
  private secretKey: string;

  constructor(config: Partial<CsrfConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.secretKey = this.generateSecret();
  }

  /**
   * Generate secret key
   */
  private generateSecret(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Generate a CSRF token
   */
  generateToken(sessionId: string): CsrfTokenData {
    const token = randomBytes(this.config.tokenLength).toString('hex');
    const fingerprint = this.generateFingerprint(sessionId, token);

    const tokenData: CsrfTokenData = {
      token,
      expiresAt: Date.now() + this.config.tokenExpiry,
      fingerprint,
    };

    this.tokens.set(token, tokenData);

    // Clean expired tokens
    this.cleanExpiredTokens();

    return tokenData;
  }

  /**
   * Generate a fingerprint for the token
   */
  private generateFingerprint(sessionId: string, token: string): string {
    const hmac = createHmac('sha256', this.secretKey);
    hmac.update(`${sessionId}:${token}`);
    return hmac.digest('hex');
  }

  /**
   * Validate a CSRF token
   */
  validateToken(token: string, sessionId: string): boolean {
    const tokenData = this.tokens.get(token);
    if (!tokenData) return false;

    // Check expiry
    if (Date.now() > tokenData.expiresAt) {
      this.tokens.delete(token);
      return false;
    }

    // Verify fingerprint
    const expectedFingerprint = this.generateFingerprint(sessionId, token);
    const fpBuffer = Buffer.from(tokenData.fingerprint, 'hex');
    const expectedBuffer = Buffer.from(expectedFingerprint, 'hex');

    if (fpBuffer.length !== expectedBuffer.length) return false;

    if (!timingSafeEqual(fpBuffer, expectedBuffer)) return false;

    // Remove used token (one-time use)
    this.tokens.delete(token);

    return true;
  }

  /**
   * Validate request origin
   */
  validateOrigin(origin: string | null): boolean {
    if (!this.config.validateOrigin) return true;
    if (!origin && this.config.validateReferer) return true; // Let referer handle it
    if (!origin) return false;

    try {
      const parsedOrigin = new URL(origin);
      return this.config.allowedOrigins.some(allowed => {
        const parsedAllowed = new URL(allowed);
        return parsedOrigin.origin === parsedAllowed.origin;
      });
    } catch {
      return false;
    }
  }

  /**
   * Validate request referer
   */
  validateReferer(referer: string | null): boolean {
    if (!this.config.validateReferer) return true;
    if (!referer && this.config.validateOrigin) return true; // Let origin handle it
    if (!referer) return false;

    try {
      const parsedReferer = new URL(referer);
      return this.config.allowedOrigins.some(allowed => {
        const parsedAllowed = new URL(allowed);
        return parsedReferer.origin === parsedAllowed.origin;
      });
    } catch {
      return false;
    }
  }

  /**
   * Check if method is safe (no CSRF protection needed)
   */
  isSafeMethod(method: string): boolean {
    return this.config.allowedMethods.includes(method.toUpperCase());
  }

  /**
   * Validate request for CSRF
   */
  validateRequest(params: {
    method: string;
    origin: string | null;
    referer: string | null;
    csrfToken: string | null;
    sessionId: string;
  }): { valid: boolean; error: string | null } {
    // Safe methods don't need CSRF
    if (this.isSafeMethod(params.method)) {
      return { valid: true, error: null };
    }

    // Validate origin
    if (!this.validateOrigin(params.origin)) {
      return { valid: false, error: 'Invalid origin' };
    }

    // Validate referer
    if (!this.validateReferer(params.referer)) {
      return { valid: false, error: 'Invalid referer' };
    }

    // Validate CSRF token
    if (!params.csrfToken) {
      return { valid: false, error: 'Missing CSRF token' };
    }

    if (!this.validateToken(params.csrfToken, params.sessionId)) {
      return { valid: false, error: 'Invalid or expired CSRF token' };
    }

    return { valid: true, error: null };
  }

  /**
   * Clean expired tokens
   */
  private cleanExpiredTokens(): void {
    const now = Date.now();
    for (const [token, data] of this.tokens) {
      if (now > data.expiresAt) {
        this.tokens.delete(token);
      }
    }

    // Prevent memory leak - cap at 10000 tokens
    if (this.tokens.size > 10000) {
      const entries = Array.from(this.tokens.entries());
      const toDelete = entries.slice(0, entries.length - 10000);
      toDelete.forEach(([token]) => this.tokens.delete(token));
    }
  }

  /**
   * Get CSRF cookie options
   */
  getCookieOptions(): {
    name: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    maxAge: number;
  } {
    return {
      name: this.config.cookieName,
      httpOnly: true,
      secure: this.config.secure,
      sameSite: this.config.sameSite,
      path: '/',
      maxAge: this.config.tokenExpiry / 1000,
    };
  }

  /**
   * Get stats
   */
  getStats(): { activeTokens: number; config: Readonly<CsrfConfig> } {
    return {
      activeTokens: this.tokens.size,
      config: { ...this.config },
    };
  }
}

// Singleton instance
export const csrfProtection = new CsrfProtection();