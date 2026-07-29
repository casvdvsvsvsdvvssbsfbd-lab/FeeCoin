// ============================================
// FC Conversion Engine
// Convert revenue to FC with configurable algorithms
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';
import { remoteConfigService } from '../admin/remote-config.service';

export interface ConversionRate {
  type: 'global' | 'daily' | 'provider' | 'country' | 'campaign' | 'event';
  rate: number;
  minAmount: number;
  maxAmount: number;
  validFrom: string;
  validTo?: string;
}

export interface FCConversion {
  userId: string;
  revenueAmount: number;
  revenueCurrency: string;
  conversionRate: number;
  fcAmount: number;
  conversionType: string;
  metadata: any;
}

class FCConversionService {
  private analytics = useAnalytics();

  // Convert revenue to FC
  async convertRevenueToFC(userId: string, revenueAmount: number, revenueCurrency: string, conversionType: string = 'global', metadata: any = {}): Promise<number> {
    try {
      // Get conversion rate
      const rate = await this.getConversionRate(conversionType, revenueAmount, metadata);
      
      // Convert revenue to USD first
      const revenueUsd = await this.convertToUsd(revenueAmount, revenueCurrency);
      
      // Calculate FC amount
      const fcAmount = revenueUsd * rate;

      // Record conversion
      await this.recordConversion(userId, revenueAmount, revenueCurrency, rate, fcAmount, conversionType, metadata);

      this.analytics.trackEvent('fc_converted', {
        userId,
        revenueAmount,
        revenueCurrency,
        rate,
        fcAmount,
        conversionType,
      });

      return fcAmount;
    } catch (error) {
      console.error('Failed to convert revenue to FC:', error);
      return 0;
    }
  }

  // Get conversion rate
  private async getConversionRate(type: string, amount: number, metadata: any): Promise<number> {
    try {
      // Get base rate from remote config
      const baseRate = await remoteConfigService.getConfig('fc_conversion_base_rate');
      const rate = baseRate || 100; // Default: 1 USD = 100 FC

      // Apply multipliers based on type
      let finalRate = rate;

      switch (type) {
        case 'daily':
          const dailyMultiplier = await remoteConfigService.getConfig('fc_conversion_daily_multiplier');
          if (dailyMultiplier) finalRate *= dailyMultiplier;
          break;
        case 'provider':
          const providerId = metadata.providerId;
          if (providerId) {
            const providerMultiplier = await remoteConfigService.getConfig(`fc_conversion_provider_${providerId}`);
            if (providerMultiplier) finalRate *= providerMultiplier;
          }
          break;
        case 'country':
          const country = metadata.country;
          if (country) {
            const countryMultiplier = await remoteConfigService.getConfig(`fc_conversion_country_${country}`);
            if (countryMultiplier) finalRate *= countryMultiplier;
          }
          break;
        case 'campaign':
          const campaignId = metadata.campaignId;
          if (campaignId) {
            const campaignMultiplier = await remoteConfigService.getConfig(`fc_conversion_campaign_${campaignId}`);
            if (campaignMultiplier) finalRate *= campaignMultiplier;
          }
          break;
        case 'event':
          const eventType = metadata.eventType;
          if (eventType) {
            const eventMultiplier = await remoteConfigService.getConfig(`fc_conversion_event_${eventType}`);
            if (eventMultiplier) finalRate *= eventMultiplier;
          }
          break;
      }

      return finalRate;
    } catch (error) {
      console.error('Failed to get conversion rate:', error);
      return 100; // Default rate
    }
  }

  // Convert currency to USD
  private async convertToUsd(amount: number, currency: string): Promise<number> {
    const rates = {
      'USD': 1,
      'EUR': 1.08,
      'RUB': 0.011,
      'COINS': 0.01,
      'CREDITS': 0.05,
    };

    const rate = rates[currency as keyof typeof rates] || 1;
    return amount * rate;
  }

  // Record conversion
  private async recordConversion(userId: string, revenueAmount: number, revenueCurrency: string, rate: number, fcAmount: number, conversionType: string, metadata: any): Promise<void> {
    try {
      await supabase.from('fc_conversions').insert({
        user_id: userId,
        revenue_amount: revenueAmount,
        revenue_currency: revenueCurrency,
        conversion_rate: rate,
        fc_amount: fcAmount,
        conversion_type: conversionType,
        metadata,
      });
    } catch (error) {
      console.error('Failed to record conversion:', error);
    }
  }

  // Get conversion history
  async getConversionHistory(userId: string, limit: number = 50): Promise<FCConversion[]> {
    try {
      const { data, error } = await supabase
        .from('fc_conversions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(c => ({
        userId: c.user_id,
        revenueAmount: c.revenue_amount,
        revenueCurrency: c.revenue_currency,
        conversionRate: c.conversion_rate,
        fcAmount: c.fc_amount,
        conversionType: c.conversion_type,
        metadata: c.metadata,
      }));
    } catch (error) {
      console.error('Failed to fetch conversion history:', error);
      return [];
    }
  }

  // Get total FC distributed
  async getTotalFCDistributed(filters?: {
    startDate?: string;
    endDate?: string;
    conversionType?: string;
  }): Promise<number> {
    try {
      let query = supabase
        .from('fc_conversions')
        .select('fc_amount');

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters?.conversionType) {
        query = query.eq('conversion_type', filters.conversionType);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).reduce((sum, c) => sum + c.fc_amount, 0);
    } catch (error) {
      console.error('Failed to get total FC distributed:', error);
      return 0;
    }
  }

  // Update conversion rate
  async updateConversionRate(type: string, rate: number, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversion_rates')
        .upsert({
          type,
          rate,
          updated_by: adminId,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      this.analytics.trackEvent('conversion_rate_updated', { type, rate });
      return true;
    } catch (error) {
      console.error('Failed to update conversion rate:', error);
      return false;
    }
  }
}

// Singleton instance
export const fcConversionService = new FCConversionService();