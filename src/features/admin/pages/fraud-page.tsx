import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const FraudPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const alerts = [
    { id: 1, user: 'user_45', risk: 92, type: 'VPN Detected', time: '2 min ago', status: 'critical' },
    { id: 2, user: 'user_128', risk: 78, type: 'Duplicate Device', time: '5 min ago', status: 'high' },
    { id: 3, user: 'user_67', risk: 85, type: 'Rapid Clicking', time: '10 min ago', status: 'high' },
    { id: 4, user: 'user_23', risk: 45, type: 'API Abuse', time: '15 min ago', status: 'medium' },
    { id: 5, user: 'user_89', risk: 95, type: 'Reward Abuse', time: '20 min ago', status: 'critical' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Fraud Center</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time fraud detection & monitoring</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <div className="text-sm text-red-400">Critical Alerts</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{alerts.filter(a => a.status === 'critical').length}</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
          <div className="text-sm text-yellow-400">High Risk</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">{alerts.filter(a => a.status === 'high').length}</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="text-sm text-blue-400">Medium Risk</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{alerts.filter(a => a.status === 'medium').length}</div>
        </div>
        <div className="bg-gray-500/10 border border-gray-500/20 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Total Flagged</div>
          <div className="text-2xl font-bold text-gray-400 mt-1">{alerts.length}</div>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  alert.status === 'critical' ? 'bg-red-400' :
                  alert.status === 'high' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div>
                  <div className="text-sm font-medium text-white">{alert.type}</div>
                  <div className="text-xs text-gray-500">User: {alert.user} · {alert.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${
                  alert.risk > 80 ? 'text-red-400' :
                  alert.risk > 60 ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  Risk: {alert.risk}
                </span>
                <button className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs hover:text-white">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};