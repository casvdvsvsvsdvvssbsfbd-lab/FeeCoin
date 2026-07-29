import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Withdrawal {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  createdAt: string;
  processedAt?: string;
  fraudCheck: 'passed' | 'flagged' | 'failed';
}

export const WithdrawalsPage: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    setLoading(true);
    setTimeout(() => {
      setWithdrawals(Array.from({ length: 30 }).map((_, i) => ({
        id: `wd_${i}`,
        userId: `user_${Math.floor(Math.random() * 20)}`,
        username: `user_${Math.floor(Math.random() * 20)}`,
        amount: Math.floor(Math.random() * 1000) + 10,
        method: ['USDT', 'TON', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 4)],
        status: (['pending', 'approved', 'rejected', 'paid', 'cancelled'] as const)[Math.floor(Math.random() * 5)],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        fraudCheck: (['passed', 'flagged', 'failed'] as const)[Math.floor(Math.random() * 3)],
      })));
      setLoading(false);
    }, 300);
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return withdrawals;
    return withdrawals.filter(w => w.status === filter);
  }, [withdrawals, filter]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      approved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
      paid: 'bg-green-500/10 text-green-400 border-green-500/20',
      cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[status] || colors.pending;
  };

  const getFraudColor = (check: string) => {
    const colors: Record<string, string> = {
      passed: 'text-green-400',
      flagged: 'text-yellow-400',
      failed: 'text-red-400',
    };
    return colors[check] || colors.passed;
  };

  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
  const totalApproved = withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0);
  const totalPaid = withdrawals.filter(w => w.status === 'paid').reduce((s, w) => s + w.amount, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Withdrawals</h1>
        <p className="text-sm text-gray-400 mt-1">Manage withdrawal requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Pending Amount</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">${totalPending.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{withdrawals.filter(w => w.status === 'pending').length} requests</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Approved</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">${totalApproved.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Awaiting payment</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Paid Today</div>
          <div className="text-2xl font-bold text-green-400 mt-1">${totalPaid.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Completed</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-400">Flagged</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{withdrawals.filter(w => w.fraudCheck === 'failed').length}</div>
          <div className="text-xs text-gray-500 mt-1">Needs review</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected', 'paid', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center gap-3"
        >
          <span className="text-sm text-blue-400">{selected.size} selected</span>
          <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">Approve</button>
          <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs">Reject</button>
          <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">Mark Paid</button>
          <button className="ml-auto px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs">Deselect</button>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left w-10">
                  <input type="checkbox" className="rounded border-gray-600 bg-gray-800" />
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400">User</th>
                <th className="p-4 text-right text-xs font-medium text-gray-400">Amount</th>
                <th className="p-4 text-left text-xs font-medium text-gray-400">Method</th>
                <th className="p-4 text-left text-xs font-medium text-gray-400">Status</th>
                <th className="p-4 text-left text-xs font-medium text-gray-400">Fraud Check</th>
                <th className="p-4 text-right text-xs font-medium text-gray-400">Date</th>
                <th className="p-4 text-center text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.has(w.id)}
                      onChange={() => setSelected(prev => {
                        const next = new Set(prev);
                        if (next.has(w.id)) next.delete(w.id);
                        else next.add(w.id);
                        return next;
                      })}
                      className="rounded border-gray-600 bg-gray-800"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {w.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{w.username}</div>
                        <div className="text-xs text-gray-500">{w.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm text-white font-medium">${w.amount.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-300">{w.method}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(w.status)}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium ${getFraudColor(w.fraudCheck)}`}>
                      {w.fraudCheck === 'passed' ? '✅' : w.fraudCheck === 'flagged' ? '⚠️' : '❌'} {w.fraudCheck}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm text-gray-400">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white" title="Approve">✅</button>
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white" title="Reject">❌</button>
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white" title="View">👁️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};