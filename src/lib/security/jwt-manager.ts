// ============================================
// JWT Manager
// Production-grade JWT handling with refresh rotation
// Supports multiple sessions, device tracking
// ============================================

import { createHmac, timingSafeEqual } from 'crypto';

export interface JwtPayload {
  sub: string;
  userId: string;
  sessionId: string;
  deviceId: string;
  role: string;
  iat: number;
  exp: number;
  jti: string;
  type: 'access' | 'refresh';
}

export interface RefreshTokenPayload {
  sub: string;
  userId: string;
  sessionId: string;
  tokenFamily: string;
  rotationCount: number;
  iat: number;
  exp: number;
  jti: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
  issuedAt: number;
  sessionId: string;
}

export interface TokenValidationResult {
  valid: boolean;
  payload: JwtPayload | null;
  error: string | null;
  expired: boolean;
  needsRotation: boolean;
}

export interface JwtManagerConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
  refreshRotationWindow: number;
  maxRefreshRotations: number;
  issuer: string;
  audience: string;
}

const DEFAULT_CONFIG: JwtManagerConfig = {
  accessTokenSecret: '',
  refreshTokenSecret: '',
  accessTokenExpiry: 900, // 15 minutes
  refreshTokenExpiry: 604800, // 7 days
  refreshRotationWindow: 86400, // 24 hours before expiry to rotate
  maxRefreshRotations: 10,
  issuer: 'fee-platform',
  audience: 'fee-mini-app',
};

export class JwtManager {
  private config: JwtManagerConfig;
  private revokedTokens: Set<string> = new Set();
  private tokenFamilyCache: Map<string, number> = new Map();
  private readonly ENCODING: BufferEncoding = 'base64url';

  constructor(config: Partial<JwtManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Base64Url encode a string
   */
  private base64UrlEncode(data: string): string {
    return Buffer.from(data)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Base64Url decode
   */
  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  /**
   * Generate HMAC-SHA256 signature for JWT
   */
  private sign(payload: string, secret: string): string {
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    return this.base64UrlEncode(hmac.digest('base64'));
  }

  /**
   * Create a JWT token
   */
  private createToken(
    payload: Record<string, any>,
    secret: string,
    expiry: number
  ): string {
    const header = this.base64UrlEncode(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    );
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + expiry,
    };
    const payloadEncoded = this.base64UrlEncode(
      JSON.stringify(tokenPayload)
    );
    const signature = this.sign(`${header}.${payloadEncoded}`, secret);
    return `${header}.${payloadEncoded}.${signature}`;
  }

  /**
   * Verify and decode a JWT token
   */
  private verifyToken(token: string, secret: string): Record<string, any> | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [headerEncoded, payloadEncoded, signature] = parts;

      // Verify signature
      const expectedSignature = this.sign(
        `${headerEncoded}.${payloadEncoded}`,
        secret
      );
      const sigBuffer = Buffer.from(signature, 'base64url');
      const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

      if (
        sigBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(sigBuffer, expectedBuffer)
      ) {
        return null;
      }

      // Decode payload
      const payload = JSON.parse(this.base64UrlDecode(payloadEncoded));

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null;
      }

      // Check if revoked
      if (payload.jti && this.revokedTokens.has(payload.jti)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Generate a unique token ID
   */
  private generateTokenId(): string {
    const random = Buffer.from(
      Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
    );
    return random.toString('hex');
  }

  /**
   * Generate a token family identifier
   */
  private generateTokenFamily(): string {
    return this.generateTokenId();
  }

  /**
   * Create access and refresh token pair
   */
  async createTokenPair(params: {
    userId: string;
    sessionId: string;
    deviceId: string;
    role: string;
    previousRefreshToken?: string;
  }): Promise<TokenPair> {
    const now = Math.floor(Date.now() / 1000);
    const jti = this.generateTokenId();
    let tokenFamily: string;
    let rotationCount = 0;

    // If rotating from previous refresh token
    if (params.previousRefreshToken) {
      const oldPayload = this.verifyToken(
        params.previousRefreshToken,
        this.config.refreshTokenSecret
      ) as RefreshTokenPayload | null;

      if (oldPayload) {
        tokenFamily = oldPayload.tokenFamily;
        rotationCount = oldPayload.rotationCount + 1;

        // Check max rotations
        if (rotationCount > this.config.maxRefreshRotations) {
          // Token family compromised, revoke all
          this.revokeTokenFamily(tokenFamily);
          throw new Error('Max refresh rotations exceeded - token family revoked');
        }
      } else {
        // Previous token invalid, check if it was already used
        tokenFamily = this.generateTokenFamily();
      }
    } else {
      tokenFamily = this.generateTokenFamily();
    }

    const accessPayload: JwtPayload = {
      sub: params.userId,
      userId: params.userId,
      sessionId: params.sessionId,
      deviceId: params.deviceId,
      role: params.role,
      iat: now,
      exp: now + this.config.accessTokenExpiry,
      jti,
      type: 'access',
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: params.userId,
      userId: params.userId,
      sessionId: params.sessionId,
      tokenFamily,
      rotationCount,
      iat: now,
      exp: now + this.config.refreshTokenExpiry,
      jti: this.generateTokenId(),
    };

    const accessToken = this.createToken(
      accessPayload,
      this.config.accessTokenSecret,
      this.config.accessTokenExpiry
    );

    const refreshToken = this.createToken(
      refreshPayload,
      this.config.refreshTokenSecret,
      this.config.refreshTokenExpiry
    );

    // Track token family
    this.tokenFamilyCache.set(tokenFamily, rotationCount);

    return {
      accessToken,
      refreshToken,
      accessExpiresIn: this.config.accessTokenExpiry,
      refreshExpiresIn: this.config.refreshTokenExpiry,
      issuedAt: now,
      sessionId: params.sessionId,
    };
  }

  /**
   * Validate an access token
   */
  validateAccessToken(token: string): TokenValidationResult {
    const payload = this.verifyToken(
      token,
      this.config.accessTokenSecret
    ) as JwtPayload | null;

    if (!payload) {
      // Check if expired
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const decoded = JSON.parse(this.base64UrlDecode(parts[1]));
          if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return {
              valid: false,
              payload: null,
              error: 'Token expired',
              expired: true,
              needsRotation: false,
            };
          }
        } catch {
          // Invalid payload
        }
      }
      return {
        valid: false,
        payload: null,
        error: 'Invalid token',
        expired: false,
        needsRotation: false,
      };
    }

    return {
      valid: true,
      payload,
      error: null,
      expired: false,
      needsRotation: false,
    };
  }

  /**
   * Validate a refresh token and check if rotation is needed
   */
  validateRefreshToken(token: string): TokenValidationResult {
    const payload = this.verifyToken(
      token,
      this.config.refreshTokenSecret
    ) as RefreshTokenPayload | null;

    if (!payload) {
      return {
        valid: false,
        payload: null,
        error: 'Invalid refresh token',
        expired: false,
        needsRotation: false,
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - now;
    const needsRotation = timeUntilExpiry < this.config.refreshRotationWindow;

    return {
      valid: true,
      payload: payload as unknown as JwtPayload,
      error: null,
      expired: false,
      needsRotation,
    };
  }

  /**
   * Revoke a specific token
   */
  revokeToken(jti: string): void {
    this.revokedTokens.add(jti);
    // Cleanup old revoked tokens periodically
    if (this.revokedTokens.size > 10000) {
      this.cleanRevokedTokens();
    }
  }

  /**
   * Revoke an entire token family (compromised)
   */
  revokeTokenFamily(tokenFamily: string): void {
    this.tokenFamilyCache.set(tokenFamily, -1); // Mark as compromised
  }

  /**
   * Check if a token family is compromised
   */
  isTokenFamilyCompromised(tokenFamily: string): boolean {
    const rotationCount = this.tokenFamilyCache.get(tokenFamily);
    return rotationCount === -1;
  }

  /**
   * Revoke all tokens for a user
   */
  revokeAllUserTokens(userId: string): void {
    // Implementation would scan and revoke all user tokens
    // In production, this would use a database-backed token store
  }

  /**
   * Clean revoked tokens cache
   */
  private cleanRevokedTokens(): void {
    // Keep only last 1000 revoked tokens
    const tokensArray = Array.from(this.revokedTokens);
    if (tokensArray.length > 1000) {
      this.revokedTokens = new Set(tokensArray.slice(-1000));
    }
  }

  /**
   * Decode token without verification (for header inspection)
   */
  decodeToken(token: string): Record<string, any> | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(this.base64UrlDecode(parts[1]));
    } catch {
      return null;
    }
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry(token: string): number | null {
    const payload = this.decodeToken(token);
    return payload?.exp || null;
  }

  /**
   * Check if token is close to expiry
   */
  isTokenExpiringSoon(token: string, thresholdSeconds: number = 300): boolean {
    const exp = this.getTokenExpiry(token);
    if (!exp) return true;
    return exp - Math.floor(Date.now() / 1000) < thresholdSeconds;
  }
}

// Singleton instance
export const jwtManager = new JwtManager();

// Export factory
export function createJwtManager(
  config: JwtManagerConfig
): JwtManager {
  return new JwtManager(config);
}
