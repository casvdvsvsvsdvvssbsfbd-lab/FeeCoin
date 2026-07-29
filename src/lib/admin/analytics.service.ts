// ============================================
// Analytics Service
// Admin analytics and reporting
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface AnalyticsStats {
  dau: number;
  wau: number;
  mau: number;
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  ltv: number;
  arpdau: number;
  revenue: {
    total: number;
    today: number;
    week: number;
    month: number;
  };
  metrics: {
    ctr: number;
    conversionRate: number;
    installRate: number;
    surveyCompletionRate: number;
    offerCompletionRate: number;
  };
}

export interface CountryAnalytics {
  country: string;
  users: number;
  revenue: number;
  percentage: number;
}

export interface DeviceAnalytics {
  device: string;
  users: number;
  percentage: number;
}

export interface PlatformAnalytics {
  platform: string;
  users: number;
  revenue: number;
  percentage: number;
}

class AnalyticsService {
  private analytics = useAnalytics();

  // Get comprehensive analytics
  async getAnalyticsStats(): Promise<AnalyticsStats> {
    try {
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // DAU (active in last 24 hours)
      const { count: dau } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', dayAgo.toISOString());

      // WAU (active in last 7 days)
      const { count: wau } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', weekAgo.toISOString());

      // MAU (active in last 30 days)
      const { count: mau } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', monthAgo.toISOString());

      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // New users day 1 ago
      const day1Ago = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      const { count: newUsersDay1 } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', day1Ago.toISOString())
        .lt('created_at', dayAgo.toISOString());

      // New users day 7 ago
      const day7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const { count: newUsersDay7 } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', day7Ago.toISOString())
        .lt('created_at', weekAgo.toISOString());

      // New users day 30 ago
      const day30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const { count: newUsersDay30 } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', day30Ago.toISOString())
        .lt('created_at', monthAgo.toISOString());

      // Retention
      const day1Retention = newUsersDay1 && dau ? (dau / newUsersDay1) * 100 : 0;
      const day7Retention = newUsersDay7 && wau ? (wau / newUsersDay7) * 100 : 0;
      const day30Retention = newUsersDay30 && mau ? (mau / newUsersDay30) * 100 : 0;

      // Revenue
      const { data: todayTx } = await supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', dayAgo.toISOString())
        .eq('status', 'completed');

      const { data: weekTx } = await supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', weekAgo.toISOString())
        .eq('status', 'completed');

      const { data: monthTx } = await supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', monthAgo.toISOString())
        .eq('status', 'completed');

      const revenueToday = todayTx?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
      const revenueWeek = weekTx?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
      const revenueMonth = monthTx?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

      // LTV (average revenue per user)
      const ltv = mau ? revenueMonth / mau : 0;

      // ARPDAU (average revenue per daily active user)
      const arpdau = dau ? revenueToday / dau : 0;

      // Metrics
      const { count: totalImpressions } = await supabase
        .from('ad_impressions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayAgo.toISOString());

      const { count: totalClicks } = await supabase
        .from('ad_clicks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayAgo.toISOString());

      const ctr = totalImpressions ? (totalClicks || 0) / totalImpressions * 100 : 0;

      const { count: totalOffers } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayAgo.toISOString());

      const { count: completedOffers } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayAgo.toISOString())
        .eq('status', 'completed');

      const offerCompletionRate = totalOffers ? (completedOffers || 0) / totalOffers * 100 : 0;

      return {
        dau: dau || 0,
        wau: wau || 0,
        mau: mau || 0,
        retention: {
          day1: day1Retention,
          day7: day7Retention,
          day30: day30Retention,
        },
        ltv,
        arpdau,
        revenue: {
          total: revenueMonth,
          today: revenueToday,
          week: revenueWeek,
          month: revenueMonth,
        },
        metrics: {
          ctr,
          conversionRate: 0,
          installRate: 0,
          surveyCompletionRate: 0,
          offerCompletionRate,
        },
      };
    } catch (error) {
      console.error('Failed to fetch analytics stats:', error);
      return {
        dau: 0,
        wau: 0,
        mau: 0,
        retention: { day1: 0, day7: 0, day30: 0 },
        ltv: 0,
        arpdau: 0,
        revenue: { total: 0, today: 0, week: 0, month: 0 },
        metrics: { ctr: 0, conversionRate: 0, installRate: 0, surveyCompletionRate: 0, offerCompletionRate: 0 },
      };
    }
  }

  // Get country analytics
  async getCountryAnalytics(): Promise<CountryAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('country, wallets!profiles_id_fkey(available_fc)')
        .not('country', 'is', null);

      if (error) throw error;

      const countryStats: any = {};
      const totalUsers = data?.length || 0;

      data?.forEach(user => {
        const country = user.country || 'Unknown';
        if (!countryStats[country]) {
          countryStats[country] = { users: 0, revenue: 0 };
        }
        countryStats[country].users += 1;
        const wallet = Array.isArray(user.wallets) ? user.wallets[0] : user.wallets;
        countryStats[country].revenue += wallet?.available_fc || 0;
      });

      return Object.entries(countryStats).map(([country, stats]: [string, any]) => ({
        country,
        users: stats.users,
        revenue: stats.revenue,
        percentage: totalUsers ? (stats.users / totalUsers) * 100 : 0,
      })).sort((a, b) => b.users - a.users);
    } catch (error) {
      console.error('Failed to fetch country analytics:', error);
      return [];
    }
  }

  // Get device analytics
  async getDeviceAnalytics(): Promise<DeviceAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('device_info')
        .not('device_info', 'is', null);

      if (error) throw error;

      const deviceStats: any = {};
      const totalUsers = data?.length || 0;

      data?.forEach(user => {
        const device = user.device_info?.platform || 'Unknown';
        if (!deviceStats[device]) {
          deviceStats[device] = 0;
        }
        deviceStats[device] += 1;
      });

      return Object.entries(deviceStats).map(([device, users]: [string, any]) => ({
        device,
        users,
        percentage: totalUsers ? (users / totalUsers) * 100 : 0,
      })).sort((a, b) => b.users - a.users);
    } catch (error) {
      console.error('Failed to fetch device analytics:', error);
      return [];
    }
  }

  // Get platform analytics
  async getPlatformAnalytics(): Promise<PlatformAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('platform, wallets!profiles_id_fkey(available_fc)')
        .not('platform', 'is', null);

      if (error) throw error;

      const platformStats: any = {};
      const totalUsers = data?.length || 0;

      data?.forEach(user => {
        const platform = user.platform || 'Unknown';
        if (!platformStats[platform]) {
          platformStats[platform] = { users: 0, revenue: 0 };
        }
        platformStats[platform].users += 1;
        const wallet = Array.isArray(user.wallets) ? user.wallets[0] : user.wallets;
        platformStats[platform].revenue += wallet?.available_fc || 0;
      });

      return Object.entries(platformStats).map(([platform, stats]: [string, any]) => ({
        platform,
        users: stats.users,
        revenue: stats.revenue,
        percentage: totalUsers ? (stats.users / totalUsers) * 100 : 0,
      })).sort((a, b) => b.users - a.users);
    } catch (error) {
      console.error('Failed to fetch platform analytics:', error);
      return [];
    }
  }

  // Get revenue over time
  async getRevenueOverTime(days: number = 30): Promise<any[]> {
    try {
      const revenueData: any[] = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const { data } = await supabase
          .from('transactions')
          .select('amount')
          .gte('created_at', dayStart.toISOString())
          .lt('created_at', dayEnd.toISOString())
          .eq('status', 'completed');

        const revenue = data?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

        revenueData.push({
          date: dayStart.toISOString().split('T')[0],
          revenue,
        });
      }

      return revenueData;
    } catch (error) {
      console.error('Failed to fetch revenue over time:', error);
      return [];
    }
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();