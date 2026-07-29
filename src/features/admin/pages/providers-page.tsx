import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Provider {
  id: string;
  name: string;
  icon: string;
  type: 'ad' | 'offerwall' | 'survey' | 'install';
  status: 'active' | 'inactive' | 'error';
  revenue: number;
  fillRate: number;
  latency: number;
  successRate: number;
  priority: number;
  health: number;
}

export const ProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    setTimeout(() => {
      setProviders([
        { id: 'adsgram', name: 'AdsGram', icon: '📺', type: 'ad', status: 'active', revenue: 45200, fillRate: 92, latency: 45, successRate: 98, priority: 1, health: 97 },
        { id: 'admob', name: 'AdMob', icon: '📱', type: 'ad', status: 'active', revenue: 38400, fillRate: 88, latency: 52, successRate: 96, priority: 2, health: 94 },
        { id: 'unityads', name: 'Unity Ads', icon: '🎮', type: 'ad', status: 'active', revenue: 29100, fillRate: 85, latency: 48, successRate: 95, priority: 3, health: 91 },
        { id: 'applovin', name: 'AppLovin MAX', icon: '📊', type: 'ad', status: 'active', revenue: 26700, fillRate: 90, latency: 41, successRate: 97, priority: 4, health: 95 },
        { id: 'ironsource', name: 'IronSource', icon: '🔩', type: 'ad', status: 'active', revenue: 22300, fillRate: 83, latency: 55, successRate: 93, priority: 5, health: 89 },
        { id: 'monetag', name: 'Monetag', icon: '💵', type: 'ad', status: 'active', revenue: 19800, fillRate: 78, latency: 62, successRate: 91, priority: 6, health: 86 },
        { id: 'timewall', name: 'TimeWall', icon: '⏱️', type: 'offerwall', status: 'active', revenue: 34500, fillRate: 95, latency: 35, successRate: 99, priority: 7, health: 98 },
        { id: 'offertoro', name: 'OfferToro', icon: '🎯', type: 'offerwall', status: 'active', revenue: 31200, fillRate: 91, latency: 38, successRate: 97, priority: 8, health: 96 },
        { id: 'lootably', name: 'Lootably', icon: '💎', type: 'offerwall', status: 'active', revenue: 28900, fillRate: 89, latency: 42, successRate: 96, priority: 9, health: 93 },
        { id: 'cpxresearch', name: 'CPX Research', icon: '🔬', type: 'survey', status: 'active', revenue: 21500, fillRate: 82, latency: 58, successRate: 92, priority: 10, health: 88 },
        { id: 'bitlabs', name: 'BitLabs', icon: '🧪', type: 'survey', status: 'active', revenue: 18400, fillRate: 79, latency: 61, successRate: 90, priority: 11, health: 85 },
        { id: 'pollfish', name: 'Pollfish', icon: '🐟', type: 'survey', status: 'active', revenue: 15600, fillRate: 76, latency: 65, successRate: 88, priority: 12, health: 82 },
        { id: 'inbrain', name: 'InBrain', icon: '🧠', type: 'survey', status: 'active', revenue: 14200, fillRate: 74, latency: 68, successRate: 87, priority: 13, health: 80 },
        { id: 'ayetstudios', name: 'AyetStudios', icon: '🎨', type: 'offerwall', status: 'active', revenue: 12800, fillRate: 72, latency: 71, successRate: 85, priority: 14, health: 78 },
        { id: 'wannads', name: 'Wannads', icon: '📢', type: 'ad', status: 'inactive', revenue: 9500, fillRate: 65, latency: 78, successRate: 82, priority: 15, health: 72 },
        { id: 'adgate', name: 'AdGate', icon: '🚪', type: 'offerwall', status: 'active', revenue: 11200, fillRate: 70, latency: 75, successRate: 84, priority: 16, health: 75 },
      ]);
      setLoading(false);
    }, 300);
  };

  const totalRevenue = providers.reduce((s, p) => s + p.revenue, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Providers</h1>
          <p className="text-sm text-gray-400 mt-1">Manage all 16 revenue providers</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total Revenue (30d)</div>
          <div className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Active</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{providers.filter(p => p.status === 'active').length}</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Inactive</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">{providers.filter(p => p.status === 'inactive').length}</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Avg Fill Rate</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{(providers.reduce((s, p) => s + p.fillRate, 0) / providers.length).toFixed(1)}%</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Avg Health</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{(providers.reduce((s, p) => s + p.health, 0) / providers.length).toFixed(0)}%</div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider, i) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{provider.icon}</span>
                <div>
                  <div className="text-sm font-medium text-white">{provider.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{provider.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  provider.status === 'active' ? 'bg-green-400' :
                  provider.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <span className="text-xs text-gray-400">Priority {provider.priority}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <div className="text-xs text-gray-500">Revenue</div>
                <div className="text-sm font-medium text-white">${provider.revenue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Fill Rate</div>
                <div className="text-sm font-medium text-green-400">{provider.fillRate}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Latency</div>
                <div className="text-sm font-medium text-yellow-400">{provider.latency}ms</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Health</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        provider.health > 90 ? 'bg-green-400' :
                        provider.health > 75 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${provider.health}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white">{provider.health}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};