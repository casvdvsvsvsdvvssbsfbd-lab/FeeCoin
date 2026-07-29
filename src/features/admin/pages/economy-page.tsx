import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const EconomyPage: React.FC = () => {
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Economy</h1>
        <p className="text-sm text-gray-400 mt-1">Platform economy & reward pool management</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Reward Pool</div>
          <div className="text-2xl font-bold text-green-400 mt-1">$1,234,567</div>
          <div className="text-xs text-gray-500 mt-1">80% of revenue</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Platform Profit</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">$308,642</div>
          <div className="text-xs text-gray-500 mt-1">20% of revenue</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">FC in Circulation</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">45,678,901</div>
          <div className="text-xs text-gray-500 mt-1">Total FC distributed</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Conversion Rate</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">1 USD = 100 FC</div>
          <div className="text-xs text-gray-500 mt-1">Base rate</div>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Revenue Distribution</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">User Rewards (80%)</span>
              <span className="text-green-400 font-medium">$987,654</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Platform Profit (20%)</span>
              <span className="text-blue-400 font-medium">$246,913</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};