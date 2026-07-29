'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { mockReferral, formatFC } from '../../shared/lib/mock-data';

const ReferralNode: React.FC<{ node: typeof mockReferral.referralTree[0]; depth: number }> = ({ node, depth }) => (
  <div className="ml-4">
    <div className="flex items-center gap-2 py-1.5">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
        depth === 0 ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-[#00BFFF]/20 text-[#00BFFF]'
      }`}>
        {node.username[0].toUpperCase()}
      </div>
      <span className="text-xs text-white/70">@{node.username}</span>
      <span className="text-[10px] text-[#00FF88] font-semibold">+{formatFC(node.earned)}</span>
    </div>
    {node.children.map(child => (
      <ReferralNode key={child.userId} node={child} depth={depth + 1} />
    ))}
  </div>
);

export const ReferralScreen: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-black text-white">Referral</h1>
        <p className="text-xs text-white/40 mt-1">Invite friends and earn together</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats Card */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-[#00FF88]">{mockReferral.totalReferrals}</p>
              <p className="text-[10px] text-white/40">Total</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#00BFFF]">{mockReferral.activeReferrals}</p>
              <p className="text-[10px] text-white/40">Active</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#f0b90b]">{formatFC(mockReferral.totalEarned)}</p>
              <p className="text-[10px] text-white/40">Earned</p>
            </div>
          </div>
        </motion.div>

        {/* Referral Code */}
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs text-white/40 mb-2">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 rounded-xl px-4 py-3">
              <p className="text-sm font-bold text-white tracking-wider">{mockReferral.referralCode}</p>
            </div>
            <button
              onClick={() => copyToClipboard(mockReferral.referralCode)}
              className="px-4 py-3 rounded-xl bg-[#00FF88] text-[#0A0E14] text-xs font-bold"
            >
              Copy
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#00FF88] to-[#00d4aa] text-[#0A0E14] text-sm font-bold shadow-[0_0_20px_rgba(0,255,136,0.2)] active:scale-95 transition-all">
            Invite Friends
          </button>
          <button
            onClick={() => copyToClipboard(mockReferral.referralLink)}
            className="flex-1 py-3 rounded-2xl bg-white/5 text-white text-sm font-bold active:scale-95 transition-all"
          >
            Share Link
          </button>
        </motion.div>

        {/* Rewards Info */}
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs font-semibold text-white mb-3">Referral Rewards</p>
          <div className="space-y-2">
            {[
              { level: 'Level 1', reward: '5,000 FC', desc: 'Direct referral' },
              { level: 'Level 2', reward: '2,000 FC', desc: 'Their referral' },
              { level: 'Level 3', reward: '1,000 FC', desc: 'Third level' },
              { level: 'Rank Bonus', reward: '50,000 FC', desc: 'Top referrer weekly' },
            ].map((reward, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-xs text-white/70">{reward.level}</p>
                  <p className="text-[10px] text-white/30">{reward.desc}</p>
                </div>
                <span className="text-xs font-bold text-[#00FF88]">+{reward.reward}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Referral Tree */}
        <div>
          <p className="text-xs font-semibold text-white mb-3 px-1">Referral Tree</p>
          <div className="glass-card p-4">
            {mockReferral.referralTree.map(node => (
              <ReferralNode key={node.userId} node={node} depth={0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};