import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '@/lib/admin/admin.service';
import { forecastEngineService } from '@/lib/financial/forecast-engine.service';
import { revenueAggregatorService } from '@/lib/financial/revenue-aggregator.service';

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [revenueForecast, setRevenueForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [dashboardData, forecast] = await Promise.all([
        adminService.getDashboardStats(),
        forecastEngineService.getRevenueForecast(),
      ]);

      setStats([
        { label: 'Total Users', value: dashboardData.totalUsers.toLocaleString(), change: `+${dashboardData.newUsersToday} today`, changeType: 'up', icon: '👥' },
        { label: 'Online Now', value: dashboardData.onlineUsers.toLocaleString(), change: '12% increase', changeType: 'up', icon: '🟢' },
        { label: 'Revenue Today', value: `$${dashboardData.revenueToday.toLocaleString()}`, change: '8% vs yesterday', changeType: 'up', icon: '💰' },
        { label: 'Revenue This Month', value: `$${dashboardData.revenueMonth.toLocaleString()}`, change: '15% vs last month', changeType: 'up', icon: '📈' },
        { label: 'Platform Profit', value: `$${dashboardData.platformProfit.toLocaleString()}`, change: '20% share', changeType: 'neutral', icon: '🏦' },
        { label: 'Pending Withdrawals', value: dashboardData.withdrawPending.toLocaleString(), change: `${dashboardData.withdrawPending} pending`, changeType: 'down', icon: '⏳' },
        { label: 'Completed Withdrawals', value: dashboardData.withdrawCompleted.toLocaleString(), change: 'All time', changeType: 'up', icon: '✅' },
        { label: 'Reward Pool', value: `$${dashboardData.userRewards.toLocaleString()}`, change: '80% of revenue', changeType: 'neutral', icon: '🎁' },
      ]);

      setRevenueForecast(forecast);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of your platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                stat.changeType === 'up' ? 'bg-green-500/10 text-green-400' :
                stat.changeType === 'down' ? 'bg-red-500/10 text-red-400' :
                'bg-gray-500/10 text-gray-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Forecast */}
      {revenueForecast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Forecast</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-gray-400">Today</div>
              <div className="text-xl font-bold text-white mt-1">${revenueForecast.today.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-gray-400">This Week</div>
              <div className="text-xl font-bold text-white mt-1">${revenueForecast.thisWeek.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-gray-400">This Month</div>
              <div className="text-xl font-bold text-white mt-1">${revenueForecast.thisMonth.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-gray-400">Next Month (Projected)</div>
              <div className="text-xl font-bold text-white mt-1">${revenueForecast.nextMonth.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <span>Confidence:</span>
            <div className="flex-1 max-w-xs h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${revenueForecast.confidence * 100}%` }}
              />
            </div>
            <span className="text-white font-medium">{(revenueForecast.confidence * 100).toFixed(0)}%</span>
          </div>
        </motion.div>
      )}

      {/* Provider Revenue Breakdown */}
      {revenueForecast?.providerBreakdown && Object.keys(revenueForecast.providerBreakdown).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Provider Revenue (This Month)</h2>
          <div className="space-y-3">
            {Object.entries(revenueForecast.providerBreakdown)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([provider, amount]) => (
                <div key={provider} className="flex items-center gap-4">
                  <span className="text-sm text-gray-300 w-32 truncate">{provider}</span>
                  <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                       style={{ width: `${(Number(amount) / Math.max(...Object.values(revenueForecast.providerBreakdown).map(Number))) * 100}%` }}
                    />
                  </div>
                   <span className="text-sm text-white font-medium w-24 text-right">${Number(amount).toLocaleString()}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};