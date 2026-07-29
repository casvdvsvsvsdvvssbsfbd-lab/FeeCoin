import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  level: number;
  rank: string;
  status: string;
  country: string;
  createdAt: string;
  fraudScore: number;
  totalWithdrawals: number;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof User>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadUsers();
  }, [page, sortField, sortDir]);

  const loadUsers = async () => {
    setLoading(true);
    // Simulated data - would use adminService.getUsers() in production
    setTimeout(() => {
      setUsers(Array.from({ length: 50 }).map((_, i) => ({
        id: `user_${i}`,
        username: `user_${i}`,
        email: `user${i}@example.com`,
        balance: Math.floor(Math.random() * 10000),
        level: Math.floor(Math.random() * 50),
        rank: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'][Math.floor(Math.random() * 5)],
        status: ['active', 'active', 'active', 'frozen', 'banned'][Math.floor(Math.random() * 5)],
        country: ['US', 'UK', 'DE', 'FR', 'IN', 'BR'][Math.floor(Math.random() * 6)],
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        fraudScore: Math.floor(Math.random() * 100),
        totalWithdrawals: Math.floor(Math.random() * 5000),
      })));
      setLoading(false);
    }, 300);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filteredUsers, sortField, sortDir]);

  const toggleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedUsers.size === sortedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(sortedUsers.map(u => u.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'frozen': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'banned': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getFraudColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-800/50 rounded-xl animate-pulse" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-sm text-gray-400 mt-1">{sortedUsers.length} total users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 w-64"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center gap-3"
        >
          <span className="text-sm text-blue-400">{selectedUsers.size} selected</span>
          <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs">Freeze</button>
          <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs">Ban</button>
          <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">Approve</button>
          <button className="ml-auto px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs">Deselect</button>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === sortedUsers.length && sortedUsers.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-600 bg-gray-800"
                  />
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400 cursor-pointer hover:text-white" onClick={() => toggleSort('username')}>
                  User {sortField === 'username' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400">Status</th>
                <th className="p-4 text-right text-xs font-medium text-gray-400 cursor-pointer hover:text-white" onClick={() => toggleSort('balance')}>
                  Balance {sortField === 'balance' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-center text-xs font-medium text-gray-400 cursor-pointer hover:text-white" onClick={() => toggleSort('level')}>
                  Level {sortField === 'level' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-center text-xs font-medium text-gray-400 cursor-pointer hover:text-white" onClick={() => toggleSort('fraudScore')}>
                  Fraud Score {sortField === 'fraudScore' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400">Country</th>
                <th className="p-4 text-right text-xs font-medium text-gray-400 cursor-pointer hover:text-white" onClick={() => toggleSort('totalWithdrawals')}>
                  Withdrawals {sortField === 'totalWithdrawals' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-right text-xs font-medium text-gray-400 cursor-pointer hover:text-white" onClick={() => toggleSort('createdAt')}>
                  Joined {sortField === 'createdAt' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.slice(0, 25).map(user => (
                <tr key={user.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="rounded border-gray-600 bg-gray-800"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm text-white font-medium">${user.balance.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className="text-sm text-white">{user.level}</span>
                    <span className="text-xs text-gray-500 ml-1">{user.rank}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-sm font-medium ${getFraudColor(user.fraudScore)}`}>
                      {user.fraudScore}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{user.country}</td>
                  <td className="p-4 text-right text-sm text-white">${user.totalWithdrawals.toLocaleString()}</td>
                  <td className="p-4 text-right text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Page {page} of {Math.ceil(sortedUsers.length / 25)}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-300 disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(sortedUsers.length / 25)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-300 disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};