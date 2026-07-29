import React, { useState, useEffect } from 'react';

export const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-800/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Platform analytics & insights</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">DAU</div>
          <div className="text-2xl font-bold text-white mt-1">12,345</div>
          <div className="text-xs text-green-400 mt-1">↑ 8% vs yesterday</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">WAU</div>
          <div className="text-2xl font-bold text-white mt-1">45,678</div>
          <div className="text-xs text-green-400 mt-1">↑ 12% vs last week</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">MAU</div>
          <div className="text-2xl font-bold text-white mt-1">123,456</div>
          <div className="text-xs text-green-400 mt-1">↑ 15% vs last month</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">ARPDAU</div>
          <div className="text-2xl font-bold text-white mt-1">$0.45</div>
          <div className="text-xs text-green-400 mt-1">↑ 5% vs yesterday</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Retention</h2>
          <div className="space-y-3">
            {[
              { day: 'Day 1', rate: 65 },
              { day: 'Day 7', rate: 42 },
              { day: 'Day 14', rate: 28 },
              { day: 'Day 30', rate: 18 },
              { day: 'Day 60', rate: 12 },
              { day: 'Day 90', rate: 8 },
            ].map(r => (
              <div key={r.day} className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-16">{r.day}</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${r.rate}%` }} />
                </div>
                <span className="text-sm text-white font-medium w-12 text-right">{r.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Countries</h2>
          <div className="space-y-3">
            {[
              { country: 'United States', flag: '🇺🇸', users: 45200, revenue: 128000 },
              { country: 'United Kingdom', flag: '🇬🇧', users: 23100, revenue: 65000 },
              { country: 'Germany', flag: '🇩🇪', users: 18900, revenue: 52000 },
              { country: 'France', flag: '🇫🇷', users: 15600, revenue: 43000 },
              { country: 'India', flag: '🇮🇳', users: 12300, revenue: 28000 },
            ].map(c => (
              <div key={c.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{c.flag}</span>
                  <span className="text-sm text-gray-300">{c.country}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">{c.users.toLocaleString()} users</div>
                  <div className="text-xs text-gray-500">${c.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};