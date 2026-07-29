// ============================================
// Forecast Engine Service
// Predict revenue, expenses, and liquidity
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface RevenueForecast {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  nextDay: number;
  nextWeek: number;
  nextMonth: number;
  nextQuarter: number;
  providerBreakdown: { [provider: string]: number };
  confidence: number;
}

export interface ExpenseForecast {
  totalRewards: number;
  platformCost: number;
  operationalCost: number;
  marketingCost: number;
  totalExpenses: number;
  netRevenue: number;
}

export interface LiquidityForecast {
  currentBalance: number;
  pendingWithdrawals: number;
  projectedInflow: number;
  projectedOutflow: number;
  projectedBalance: number;
  liquidityRatio: number;
  daysOfCover: number;
  withdrawalCapacity: number;
}

export interface ProviderRevenueProjection {
  providerId: string;
  providerName: string;
  currentMonthRevenue: number;
  projectedRevenue: number;
  growthRate: number;
  trend: 'up' | 'down' | 'stable';
  seasonalityFactor: number;
}

class ForecastEngineService {
  private analytics = useAnalytics();

  // Get revenue forecast
  async getRevenueForecast(): Promise<RevenueForecast> {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      // Get historical data
      const { data: todayRevenue } = await supabase
        .from('revenue_records')
        .select('amount_usd, provider_name')
        .gte('created_at', todayStart.toISOString());

      const todayTotal = todayRevenue?.reduce((sum, r) => sum + r.amount_usd, 0) || 0;

      const { data: weekRevenue } = await supabase
        .from('revenue_records')
        .select('amount_usd')
        .gte('created_at', weekStart.toISOString());

      const weekTotal = weekRevenue?.reduce((sum, r) => sum + r.amount_usd, 0) || 0;

      const { data: monthRevenue } = await supabase
        .from('revenue_records')
        .select('amount_usd, provider_name')
        .gte('created_at', monthStart.toISOString());

      const monthTotal = monthRevenue?.reduce((sum, r) => sum + r.amount_usd, 0) || 0;

      const { data: yearRevenue } = await supabase
        .from('revenue_records')
        .select('amount_usd')
        .gte('created_at', yearStart.toISOString());

      const yearTotal = yearRevenue?.reduce((sum, r) => sum + r.amount_usd, 0) || 0;

      // Provider breakdown for this month
      const providerBreakdown: { [provider: string]: number } = {};
      monthRevenue?.forEach(r => {
        providerBreakdown[r.provider_name] = (providerBreakdown[r.provider_name] || 0) + r.amount_usd;
      });

      // Calculate projections
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysPassed = now.getDate();
      const averageDailyRevenue = daysPassed > 0 ? monthTotal / daysPassed : 0;
      const averageWeeklyRevenue = weekTotal / 1;

      // Calculate growth rates from last 3 months
      const growthRate = await this.calculateGrowthRate();
      const seasonalityFactor = this.getSeasonalityFactor(now.getMonth());

      // Projections
      const projectedNextDay = averageDailyRevenue * (1 + growthRate);
      const projectedNextWeek = averageWeeklyRevenue * 7 * (1 + growthRate);
      const projectedNextMonth = averageDailyRevenue * daysInMonth * (1 + growthRate) * seasonalityFactor;
      const projectedNextQuarter = projectedNextMonth * 3;

      const forecast: RevenueForecast = {
        today: todayTotal,
        thisWeek: weekTotal,
        thisMonth: monthTotal,
        thisYear: yearTotal,
        nextDay: projectedNextDay,
        nextWeek: projectedNextWeek,
        nextMonth: projectedNextMonth,
        nextQuarter: projectedNextQuarter,
        providerBreakdown,
        confidence: this.calculateConfidence(daysPassed),
      };

      this.analytics.trackEvent('revenue_forecast_generated', forecast);
      return forecast;
    } catch (error) {
      console.error('Failed to generate revenue forecast:', error);
      return {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        thisYear: 0,
        nextDay: 0,
        nextWeek: 0,
        nextMonth: 0,
        nextQuarter: 0,
        providerBreakdown: {},
        confidence: 0,
      };
    }
  }

  // Get expense forecast
  async getExpenseForecast(): Promise<ExpenseForecast> {
    try {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      // Get rewards distributed this month
      const { data: rewards } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'reward')
        .gte('created_at', monthStart.toISOString());

      const totalRewards = rewards?.reduce((sum, r) => sum + Math.abs(r.amount), 0) || 0;

      // Platform cost (20% of rewards)
      const platformCost = totalRewards * 0.2;

      // Operational cost (estimated from historical data)
      const operationalCost = await this.calculateOperationalCost();

      // Marketing cost
      const marketingCost = await this.calculateMarketingCost();

      const totalExpenses = totalRewards + platformCost + operationalCost + marketingCost;

      // Get net revenue (total revenue - expenses)
      const { data: revenue } = await supabase
        .from('revenue_records')
        .select('amount_usd')
        .gte('created_at', monthStart.toISOString());

      const totalRevenue = revenue?.reduce((sum, r) => sum + r.amount_usd, 0) || 0;
      const netRevenue = totalRevenue - totalExpenses;

      return {
        totalRewards,
        platformCost,
        operationalCost,
        marketingCost,
        totalExpenses,
        netRevenue: Math.max(netRevenue, 0),
      };
    } catch (error) {
      console.error('Failed to get expense forecast:', error);
      return {
        totalRewards: 0,
        platformCost: 0,
        operationalCost: 0,
        marketingCost: 0,
        totalExpenses: 0,
        netRevenue: 0,
      };
    }
  }

  // Get liquidity forecast
  async getLiquidityForecast(): Promise<LiquidityForecast> {
    try {
      // Get current wallet balances
      const { data: wallets } = await supabase
        .from('wallets')
        .select('balance');

      const currentBalance = wallets?.reduce((sum, w) => sum + w.balance, 0) || 0;

      // Get pending withdrawals
      const { data: pendingWithdrawals } = await supabase
        .from('withdrawals')
        .select('amount')
        .eq('status', 'pending');

      const pendingAmount = pendingWithdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;

      // Projected inflow (next 30 days)
      const forecast = await this.getRevenueForecast();
      const projectedInflow = forecast.nextMonth;

      // Projected outflow (rewards + withdrawals)
      const expenseForecast = await this.getExpenseForecast();
      const projectedOutflow = expenseForecast.totalRewards + pendingAmount;

      // Calculate metrics
      const projectedBalance = currentBalance + projectedInflow - projectedOutflow;
      const liquidityRatio = projectedOutflow > 0 ? projectedInflow / projectedOutflow : 0;
      const dailyBurn = projectedOutflow / 30;
      const daysOfCover = dailyBurn > 0 ? currentBalance / dailyBurn : 0;
      const withdrawalCapacity = currentBalance * 0.8; // 80% of balance available

      return {
        currentBalance,
        pendingWithdrawals: pendingAmount,
        projectedInflow,
        projectedOutflow,
        projectedBalance: Math.max(projectedBalance, 0),
        liquidityRatio,
        daysOfCover,
        withdrawalCapacity,
      };
    } catch (error) {
      console.error('Failed to get liquidity forecast:', error);
      return {
        currentBalance: 0,
        pendingWithdrawals: 0,
        projectedInflow: 0,
        projectedOutflow: 0,
        projectedBalance: 0,
        liquidityRatio: 0,
        daysOfCover: 0,
        withdrawalCapacity: 0,
      };
    }
  }

  // Get provider revenue projections
  async getProviderProjections(): Promise<ProviderRevenueProjection[]> {
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      // Get current month revenue by provider
      const { data: currentMonth } = await supabase
        .from('revenue_records')
        .select('provider_id, provider_name, amount_usd')
        .gte('created_at', monthStart.toISOString());

      // Get last month revenue by provider
      const { data: lastMonth } = await supabase
        .from('revenue_records')
        .select('provider_id, provider_name, amount_usd')
        .gte('created_at', lastMonthStart.toISOString())
        .lt('created_at', monthStart.toISOString());

      // Aggregate by provider
      const currentMap = new Map<string, { name: string; amount: number }>();
      currentMonth?.forEach(r => {
        const existing = currentMap.get(r.provider_id) || { name: r.provider_name, amount: 0 };
        existing.amount += r.amount_usd;
        currentMap.set(r.provider_id, existing);
      });

      const lastMap = new Map<string, { name: string; amount: number }>();
      lastMonth?.forEach(r => {
        const existing = lastMap.get(r.provider_id) || { name: r.provider_name, amount: 0 };
        existing.amount += r.amount_usd;
        lastMap.set(r.provider_id, existing);
      });

      const projections: ProviderRevenueProjection[] = [];

      currentMap.forEach((current, providerId) => {
        const last = lastMap.get(providerId);
        const lastAmount = last?.amount || 0;
        const growthRate = lastAmount > 0 ? (current.amount - lastAmount) / lastAmount : 0;

        projections.push({
          providerId,
          providerName: current.name,
          currentMonthRevenue: current.amount,
          projectedRevenue: current.amount * (1 + growthRate),
          growthRate,
          trend: growthRate > 0.1 ? 'up' : growthRate < -0.1 ? 'down' : 'stable',
          seasonalityFactor: this.getSeasonalityFactor(now.getMonth()),
        });
      });

      return projections.sort((a, b) => b.projectedRevenue - a.projectedRevenue);
    } catch (error) {
      console.error('Failed to get provider projections:', error);
      return [];
    }
  }

  // Calculate growth rate
  private async calculateGrowthRate(): Promise<number> {
    try {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

      const { data: monthlyRevenue } = await supabase
        .from('revenue_records')
        .select('amount_usd, created_at')
        .gte('created_at', threeMonthsAgo.toISOString());

      if (!monthlyRevenue || monthlyRevenue.length < 2) return 0.05;

      const monthlyMap = new Map<string, number>();
      monthlyRevenue.forEach(r => {
        const month = r.created_at.substring(0, 7);
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + r.amount_usd);
      });

      const amounts = Array.from(monthlyMap.values());
      if (amounts.length < 2) return 0.05;

      const totalGrowth = amounts[amounts.length - 1] - amounts[0];
      const growthRate = amounts[0] > 0 ? totalGrowth / amounts[0] / amounts.length : 0.05;

      return Math.max(growthRate, 0) || 0.05;
    } catch (error) {
      return 0.05;
    }
  }

  // Calculate operational cost
  private async calculateOperationalCost(): Promise<number> {
    try {
      // Get operational costs from transactions
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { data: costs } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'operational_cost')
        .gte('created_at', monthStart.toISOString());

      return costs?.reduce((sum, c) => sum + Math.abs(c.amount), 0) || 0;
    } catch (error) {
      return 0;
    }
  }

  // Calculate marketing cost
  private async calculateMarketingCost(): Promise<number> {
    try {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { data: costs } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'marketing_cost')
        .gte('created_at', monthStart.toISOString());

      return costs?.reduce((sum, c) => sum + Math.abs(c.amount), 0) || 0;
    } catch (error) {
      return 0;
    }
  }

  // Get seasonality factor based on month
  private getSeasonalityFactor(month: number): number {
    const factors: { [key: number]: number } = {
      0: 0.9,  // January
      1: 0.85, // February
      2: 1.0,  // March
      3: 1.05, // April
      4: 1.1,  // May
      5: 1.15, // June
      6: 1.2,  // July
      7: 1.15, // August
      8: 1.0,  // September
      9: 0.95, // October
      10: 0.9, // November
      11: 0.85, // December
    };

    return factors[month] || 1.0;
  }

  // Calculate confidence level
  private calculateConfidence(daysPassed: number): number {
    // More data = higher confidence
    if (daysPassed >= 25) return 0.90;
    if (daysPassed >= 20) return 0.85;
    if (daysPassed >= 15) return 0.80;
    if (daysPassed >= 10) return 0.75;
    if (daysPassed >= 5) return 0.70;
    return 0.60;
  }
}

// Singleton instance
export const forecastEngineService = new ForecastEngineService();