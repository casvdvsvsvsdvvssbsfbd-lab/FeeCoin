// ============================================
// Provider Manager Tests
// ============================================

/// <reference types="jest" />

import { ProviderManager } from '../provider-manager';
import { AdsGramProvider } from '../providers/adsgram.provider';
import { ProviderConfig, ProviderType } from '../types';

describe('ProviderManager', () => {
  let manager: ProviderManager;
  let mockProvider: AdsGramProvider;

  beforeEach(() => {
    manager = new ProviderManager();
    
    const config: ProviderConfig = {
      id: 'adsgram',
      name: 'AdsGram',
      type: 'ad_network' as ProviderType,
      endpoint: 'https://api.adsgram.com',
      apiKey: 'test_key',
      isEnabled: true,
      priority: 10,
      countries: ['ALL'],
      languages: ['en'],
      settings: {},
      timeout: 5000,
      retryAttempts: 3,
      retryDelay: 1000
    };

    mockProvider = new AdsGramProvider(config);
  });

  describe('registerProvider', () => {
    it('should register a provider', () => {
      manager.registerProvider(mockProvider);
      const retrieved = manager.getProvider<AdsGramProvider>('adsgram');
      expect(retrieved).toBeDefined();
      expect(retrieved?.getConfig().id).toBe('adsgram');
    });

    it('should allow registering multiple providers', () => {
      manager.registerProvider(mockProvider);
      expect(manager.getEnabledProviders().length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('unregisterProvider', () => {
    it('should unregister a provider', () => {
      manager.registerProvider(mockProvider);
      manager.unregisterProvider('adsgram');
      const retrieved = manager.getProvider<AdsGramProvider>('adsgram');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('getProvidersByType', () => {
    it('should return providers of specific type', () => {
      manager.registerProvider(mockProvider);
      const adProviders = manager.getProvidersByType('ad_network');
      expect(adProviders.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array for non-existent type', () => {
      const providers = manager.getProvidersByType('survey');
      expect(providers.length).toBe(0);
    });
  });

  describe('selectProvider', () => {
    it('should select best provider based on criteria', () => {
      manager.registerProvider(mockProvider);
      
      const criteria = {
        userId: 'user123',
        countryCode: 'US',
        language: 'en',
        providerType: 'ad_network' as ProviderType,
        userHistory: [],
        availableProviders: []
      };

      const selected = manager.selectProvider(criteria);
      expect(selected).toBeDefined();
    });

    it('should return null when no providers available', () => {
      const criteria = {
        userId: 'user123',
        countryCode: 'US',
        language: 'en',
        providerType: 'ad_network' as ProviderType,
        userHistory: [],
        availableProviders: []
      };

      const selected = manager.selectProvider(criteria);
      expect(selected).toBeNull();
    });
  });

  describe('updateUserHistory', () => {
    it('should update user history for provider', () => {
      manager.registerProvider(mockProvider);
      
      manager.updateUserHistory('user123', 'adsgram', true, 100);
      
      const history = (manager as any).userHistory.get('user123');
      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThanOrEqual(1);
    });

    it('should increment success count on success', () => {
      manager.registerProvider(mockProvider);
      manager.updateUserHistory('user123', 'adsgram', true, 100);
      manager.updateUserHistory('user123', 'adsgram', true, 200);
      
      const history = (manager as any).userHistory.get('user123');
      const providerHistory = history.find((h: any) => h.providerId === 'adsgram');
      expect(providerHistory.successCount).toBe(2);
    });

    it('should increment failure count on failure', () => {
      manager.registerProvider(mockProvider);
      manager.updateUserHistory('user123', 'adsgram', false, 0);
      
      const history = (manager as any).userHistory.get('user123');
      const providerHistory = history.find((h: any) => h.providerId === 'adsgram');
      expect(providerHistory.failureCount).toBe(1);
    });
  });

  describe('updateHealthStatus', () => {
    it('should update health status for provider', () => {
      manager.registerProvider(mockProvider);
      
      const healthStatus = {
        providerId: 'adsgram',
        status: 'healthy' as const,
        lastCheck: new Date(),
        latency: 100,
        errorRate: 0,
        consecutiveFailures: 0,
        lastSuccess: new Date()
      };

      manager.updateHealthStatus('adsgram', healthStatus);
      const health = manager.getAllHealthStatuses();
      expect(health.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('enableProvider/disableProvider', () => {
    it('should enable a disabled provider', () => {
      manager.registerProvider(mockProvider);
      manager.disableProvider('adsgram');
      manager.enableProvider('adsgram');
      
      const provider = manager.getProvider<AdsGramProvider>('adsgram');
      expect(provider?.isEnabled()).toBe(true);
    });

    it('should disable an enabled provider', () => {
      manager.registerProvider(mockProvider);
      manager.disableProvider('adsgram');
      
      const provider = manager.getProvider<AdsGramProvider>('adsgram');
      expect(provider?.isEnabled()).toBe(false);
    });
  });

  describe('updateProviderConfig', () => {
    it('should update provider configuration', () => {
      manager.registerProvider(mockProvider);
      
      manager.updateProviderConfig('adsgram', {
        priority: 20,
        timeout: 10000
      });

      const provider = manager.getProvider<AdsGramProvider>('adsgram');
      expect(provider?.getConfig().priority).toBe(20);
      expect(provider?.getConfig().timeout).toBe(10000);
    });
  });

  describe('getEnabledProviders', () => {
    it('should return only enabled providers', () => {
      manager.registerProvider(mockProvider);
      const enabled = manager.getEnabledProviders();
      expect(enabled.length).toBeGreaterThanOrEqual(1);
      expect(enabled.every(p => p.isEnabled)).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all data', () => {
      manager.registerProvider(mockProvider);
      manager.updateUserHistory('user123', 'adsgram', true, 100);
      
      manager.clear();
      
      const provider = manager.getProvider<AdsGramProvider>('adsgram');
      expect(provider).toBeUndefined();
    });
  });
});