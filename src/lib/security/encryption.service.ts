// ============================================
// Encryption Service
// AES-256-GCM encryption for sensitive data
// Supports key rotation and multiple keys
// ============================================

import { createCipheriv, createDecipheriv, randomBytes, createHash, scryptSync } from 'crypto';

export interface EncryptionKey {
  id: string;
  key: Buffer;
  createdAt: number;
  active: boolean;
}

export interface EncryptedData {
  keyId: string;
  iv: string;
  tag: string;
  data: string;
  algorithm: string;
  createdAt: number;
}

export interface EncryptionServiceConfig {
  masterKey: string;
  keyRotationInterval: number;
  maxKeys: number;
  algorithm: 'aes-256-gcm';
  keyDerivation: 'scrypt' | 'pbkdf2';
}

const DEFAULT_CONFIG: EncryptionServiceConfig = {
  masterKey: '',
  keyRotationInterval: 86400000, // 24 hours
  maxKeys: 5,
  algorithm: 'aes-256-gcm',
  keyDerivation: 'scrypt',
};

export class EncryptionService {
  private config: EncryptionServiceConfig;
  private keys: EncryptionKey[] = [];
  private currentKeyId: string | null = null;
  private readonly IV_LENGTH = 16;
  private readonly TAG_LENGTH = 16;
  private readonly KEY_LENGTH = 32;

  constructor(config: Partial<EncryptionServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeKeys();
  }

  /**
   * Initialize encryption keys
   */
  private initializeKeys(): void {
    if (!this.config.masterKey) {
      throw new Error('Master key is required for encryption service');
    }

    // Create initial key from master key
    const key = this.deriveKey(this.config.masterKey, this.generateSalt());
    this.addKey(key);
  }

  /**
   * Derive an encryption key using scrypt
   */
  private deriveKey(password: string, salt: Buffer): Buffer {
    if (this.config.keyDerivation === 'scrypt') {
      return scryptSync(password, salt, this.KEY_LENGTH, {
        N: 16384,
        r: 8,
        p: 1,
      });
    }
    return createHash('sha256').update(password + salt.toString('hex')).digest();
  }

  /**
   * Generate random salt
   */
  private generateSalt(): Buffer {
    return randomBytes(16);
  }

  /**
   * Add a new encryption key
   */
  private addKey(key: Buffer): EncryptionKey {
    const keyId = randomBytes(16).toString('hex');
    const encryptionKey: EncryptionKey = {
      id: keyId,
      key,
      createdAt: Date.now(),
      active: true,
    };

    this.keys.push(encryptionKey);
    this.currentKeyId = keyId;

    // Enforce max keys limit
    if (this.keys.length > this.config.maxKeys) {
      const oldestKey = this.keys.shift();
      if (oldestKey) {
        oldestKey.active = false;
      }
    }

    return encryptionKey;
  }

  /**
   * Rotate encryption key
   */
  rotateKey(): EncryptionKey {
    const salt = this.generateSalt();
    const key = this.deriveKey(this.config.masterKey, salt);
    return this.addKey(key);
  }

  /**
   * Get current active key
   */
  private getCurrentKey(): EncryptionKey {
    if (!this.currentKeyId) {
      throw new Error('No active encryption key');
    }

    const key = this.keys.find(k => k.id === this.currentKeyId && k.active);
    if (!key) {
      throw new Error('No active encryption key found');
    }

    return key;
  }

  /**
   * Get key by ID
   */
  private getKeyById(keyId: string): EncryptionKey | undefined {
    return this.keys.find(k => k.id === keyId);
  }

  /**
   * Check if key rotation is needed
   */
  private isRotationNeeded(): boolean {
    const currentKey = this.getCurrentKey();
    return Date.now() - currentKey.createdAt > this.config.keyRotationInterval;
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(plaintext: string): EncryptedData {
    // Rotate key if needed
    if (this.isRotationNeeded()) {
      this.rotateKey();
    }

    const key = this.getCurrentKey();
    const iv = randomBytes(this.IV_LENGTH);

    const cipher = createCipheriv(
      this.config.algorithm,
      key.key,
      iv,
      { authTagLength: this.TAG_LENGTH }
    );

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag().toString('hex');

    return {
      keyId: key.id,
      iv: iv.toString('hex'),
      tag,
      data: encrypted,
      algorithm: this.config.algorithm,
      createdAt: Date.now(),
    };
  }

  /**
   * Decrypt encrypted data
   */
  decrypt(encryptedData: EncryptedData): string {
    const key = this.getKeyById(encryptedData.keyId);
    if (!key) {
      throw new Error(`Encryption key not found: ${encryptedData.keyId}`);
    }

    const decipher = createDecipheriv(
      encryptedData.algorithm as any,
      key.key,
      Buffer.from(encryptedData.iv, 'hex'),
      { authTagLength: this.TAG_LENGTH }
    );

    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Re-encrypt data with current key
   */
  reEncrypt(encryptedData: EncryptedData): EncryptedData {
    const plaintext = this.decrypt(encryptedData);
    return this.encrypt(plaintext);
  }

  /**
   * Encrypt wallet information
   */
  encryptWalletData(walletData: Record<string, any>): EncryptedData {
    return this.encrypt(JSON.stringify(walletData));
  }

  /**
   * Decrypt wallet information
   */
  decryptWalletData(encryptedData: EncryptedData): Record<string, any> {
    const decrypted = this.decrypt(encryptedData);
    return JSON.parse(decrypted);
  }

  /**
   * Encrypt settlement information
   */
  encryptSettlementData(settlementData: Record<string, any>): EncryptedData {
    return this.encrypt(JSON.stringify(settlementData));
  }

  /**
   * Decrypt settlement information
   */
  decryptSettlementData(encryptedData: EncryptedData): Record<string, any> {
    const decrypted = this.decrypt(encryptedData);
    return JSON.parse(decrypted);
  }

  /**
   * Encrypt provider secret
   */
  encryptProviderSecret(secret: string): EncryptedData {
    return this.encrypt(secret);
  }

  /**
   * Decrypt provider secret
   */
  decryptProviderSecret(encryptedData: EncryptedData): string {
    return this.decrypt(encryptedData);
  }

  /**
   * Encrypt referral sensitive data
   */
  encryptReferralData(referralData: Record<string, any>): EncryptedData {
    return this.encrypt(JSON.stringify(referralData));
  }

  /**
   * Decrypt referral sensitive data
   */
  decryptReferralData(encryptedData: EncryptedData): Record<string, any> {
    const decrypted = this.decrypt(encryptedData);
    return JSON.parse(decrypted);
  }

  /**
   * Hash sensitive data (one-way, for comparisons)
   */
  hashSensitiveData(data: string): string {
    const hash = createHash('sha512');
    hash.update(data + this.config.masterKey);
    return hash.digest('hex');
  }

  /**
   * Get encryption key info (for monitoring)
   */
  getKeyInfo(): Array<{ id: string; createdAt: string; active: boolean; age: number }> {
    return this.keys.map(k => ({
      id: k.id,
      createdAt: new Date(k.createdAt).toISOString(),
      active: k.active,
      age: Date.now() - k.createdAt,
    }));
  }

  /**
   * Get encryption statistics
   */
  getStats(): { keyCount: number; currentKeyAge: number; rotationDue: boolean } {
    const currentKey = this.getCurrentKey();
    return {
      keyCount: this.keys.length,
      currentKeyAge: Date.now() - currentKey.createdAt,
      rotationDue: this.isRotationNeeded(),
    };
  }
}

// Singleton instance
export const encryptionService = new EncryptionService();

// Export factory
export function createEncryptionService(config: Partial<EncryptionServiceConfig> = {}): EncryptionService {
  return new EncryptionService(config);
}