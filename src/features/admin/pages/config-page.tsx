import React, { useState, useEffect } from 'react';

export const ConfigPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const configs = [
    { key: 'fc_conversion_base_rate', value: '100', type: 'number', category: 'rewards', description: 'Base FC conversion rate per USD' },
    { key: 'risk_threshold_warning', value: '30', type: 'number', category: 'fraud', description: 'Risk score threshold for warning' },
    { key: 'risk_threshold_freeze_rewards', value: '50', type: 'number', category: 'fraud', description: 'Risk score threshold for freezing rewards' },
    { key: 'risk_threshold_permanent_ban', value: '95', type: 'number', category: 'fraud', description: 'Risk score threshold for permanent ban' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean', category: 'maintenance', description: 'Enable maintenance mode' },
    { key: 'energy_max', value: '100', type: 'number', category: 'energy', description: 'Maximum energy per user' },
    { key: 'energy_regen_rate', value: '1', type: 'number', category: 'energy', description: 'Energy regeneration per minute' },
    { key: 'daily_bonus_amount', value: '50', type: 'number', category: 'rewards', description: 'Daily bonus FC amount' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Remote Config</h1>
        <p className="text-sm text-gray-400 mt-1">Manage all platform configuration variables</p>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'rewards', 'fraud', 'energy', 'maintenance'].map(cat => (
          <button key={cat} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-400 hover:text-white transition-colors capitalize">
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {configs.map(config => (
            <div key={config.key} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{config.key}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-500 uppercase">{config.type}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded uppercase">{config.category}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{config.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-white bg-gray-800 px-3 py-1 rounded-lg">{config.value}</span>
                <button className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-colors">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};