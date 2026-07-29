import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '@/lib/admin/admin.service';

type AdminModule = 'dashboard' | 'users' | 'withdrawals' | 'providers' | 'economy' | 'fraud' | 'analytics' | 'config' | 'broadcast' | 'audit' | 'support' | 'settings';

interface AdminLayoutProps {
  activeModule: AdminModule;
  onModuleChange: (module: AdminModule) => void;
  children: React.ReactNode;
}

const modules: { id: AdminModule; label: string; icon: string; shortcut: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', shortcut: '⌘1' },
  { id: 'users', label: 'Users', icon: '👥', shortcut: '⌘2' },
  { id: 'withdrawals', label: 'Withdrawals', icon: '💳', shortcut: '⌘3' },
  { id: 'providers', label: 'Providers', icon: '🔗', shortcut: '⌘4' },
  { id: 'economy', label: 'Economy', icon: '💰', shortcut: '⌘5' },
  { id: 'fraud', label: 'Fraud Center', icon: '🛡️', shortcut: '⌘6' },
  { id: 'analytics', label: 'Analytics', icon: '📈', shortcut: '⌘7' },
  { id: 'config', label: 'Config', icon: '⚙️', shortcut: '⌘8' },
  { id: 'broadcast', label: 'Broadcast', icon: '📡', shortcut: '⌘9' },
  { id: 'audit', label: 'Audit Logs', icon: '📋', shortcut: '⌘0' },
  { id: 'support', label: 'Support', icon: '🎧', shortcut: '⌘-' },
  { id: 'settings', label: 'Settings', icon: '🔧', shortcut: '⌘=' },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeModule, onModuleChange, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.metaKey && e.key === 'b') {
        e.preventDefault();
        setCollapsed(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        className="flex flex-col border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-sm font-bold">
            W
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 font-semibold text-sm"
            >
              Watch2Earn Admin
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => onModuleChange(mod.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                activeModule === mod.id
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={mod.label}
            >
              <span className="text-lg shrink-0">{mod.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{mod.label}</span>
                  <span className="text-[10px] text-gray-600 font-mono">{mod.shortcut}</span>
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="p-4 border-t border-gray-800 text-gray-500 hover:text-white text-xs"
        >
          {collapsed ? '→' : 'Collapse'}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/30 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>🔍</span>
              <span>Search...</span>
              <span className="text-[10px] text-gray-600 ml-4">⌘K</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Admin</span>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                <span className="text-gray-400">🔍</span>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search modules, users, actions..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                />
                <span className="text-[10px] text-gray-600">ESC</span>
              </div>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {modules.filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase())).map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => { onModuleChange(mod.id); setSearchOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <span>{mod.icon}</span>
                    <span>{mod.label}</span>
                    <span className="ml-auto text-[10px] text-gray-600">{mod.shortcut}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};