'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../shared/hooks/use-navigation';
import { languages } from '../../shared/lib/mock-data';

export const LanguageScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('en');

  const filtered = languages.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#0A0E14] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate('welcome')} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
          <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white">Choose Language</h1>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="glass-card p-2 flex items-center gap-2">
          <span className="text-sm text-white/30 pl-2">🔍</span>
          <input
            type="text"
            placeholder="Search language..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-4">
        {filtered.map((lang, i) => (
          <motion.button
            key={lang.code}
            onClick={() => { setSelected(lang.code); setTimeout(() => navigate('country'), 300); }}
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
              selected === lang.code ? 'bg-[#00FF88]/10 border border-[#00FF88]/20' : 'hover:bg-white/5'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{lang.nativeName}</p>
              <p className="text-xs text-white/40">{lang.name}</p>
            </div>
            {lang.isRTL && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">RTL</span>}
            {selected === lang.code && <span className="text-[#00FF88]">✓</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
};