'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../shared/hooks/use-navigation';
import { countries } from '../../shared/lib/mock-data';

export const CountryScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('US');

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#0A0E14] flex flex-col">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate('language')} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
          <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white">Choose Country</h1>
      </div>

      <div className="px-4 mb-3">
        <div className="glass-card p-2 flex items-center gap-2">
          <span className="text-sm text-white/30 pl-2">🔍</span>
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-4">
        {filtered.map((country, i) => (
          <motion.button
            key={country.code}
            onClick={() => { setSelected(country.code); setTimeout(() => navigate('permissions'), 300); }}
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
              selected === country.code ? 'bg-[#00FF88]/10 border border-[#00FF88]/20' : 'hover:bg-white/5'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <span className="text-xl">{country.flag}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{country.name}</p>
              <p className="text-xs text-white/40">{country.currency} • {country.phoneCode}</p>
            </div>
            {selected === country.code && <span className="text-[#00FF88]">✓</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
};