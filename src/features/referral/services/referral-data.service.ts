// ============================================
// Referral Screen Data Service
// Connects UI to real production data
// ============================================

import { supabase } from '@/lib/supabase';
import { useReferralStore } from '@/lib/stores/referral-store';
import { useAnalytics } from '@/lib/analytics';

export interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  referrals: Array<{
    id: string;
    userId: string;
    username: string;
    status: 'pending' | 'active' | 'completed';
    joinedAt: string;
    earnings: number;
  }>;
}

class ReferralDataService {
  private analytics = useAnalytics();

  // Fetch referral data
  async getReferralData(userId: string): Promise<ReferralData> {
    try {
      // Get user's referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', userId)
        .single();

      const referralCode = profile?.referral_code || '';

      // Get referrals
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('*, profiles!referrals_referred_id_fkey(username)')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalReferrals = referrals?.length || 0;
      const activeReferrals = referrals?.filter((r: any) => r.status === 'active').length || 0;
      const totalEarnings = referrals?.reduce((sum: number, r: any) => sum + (r.earnings || 0), 0) || 0;

      return {
        referralCode,
        totalReferrals,
        activeReferrals,
        totalEarnings,
        pendingEarnings: 0,
        referrals: referrals?.map((r: any) => ({
          id: r.id,
          userId: r.referred_id,
          username: r.profiles?.username || 'user',
          status: r.status,
          joinedAt: r.created_at,
          earnings: r.earnings || 0,
        })) || [],
      };
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
      return {
        referralCode: '',
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        referrals: [],
      };
    }
  }

  // Generate referral code
  async generateReferralCode(userId: string): Promise<string> {
    try {
      const code = `REF${userId.substring(0, 8).toUpperCase()}`;
      
      const { error } = await supabase
        .from('profiles')
        .update({ referral_code: code })
        .eq('id', userId);

      if (error) throw error;

      return code;
    } catch (error) {
      console.error('Failed to generate referral code:', error);
      return '';
    }
  }

  // Track referral click
  async trackReferralClick(referralCode: string): Promise<void> {
    try {
      // Find referrer by code
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (profile) {
      this.analytics.trackEvent('referral_click', { referralCode });
      }
    } catch (error) {
      console.error('Failed to track referral click:', error);
    }
  }

  // Load referral data
  async loadReferralData(userId: string): Promise<ReferralData> {
    return this.getReferralData(userId);
  }

  // Refresh referral data
  async refreshReferrals(userId: string): Promise<void> {
    const data = await this.getReferralData(userId);
    
    const referralStore = useReferralStore.getState();
    referralStore.setReferrals(data.referrals);
    referralStore.setReferralCode(data.referralCode);
  }
}

// Singleton instance
export const referralDataService = new ReferralDataService();
