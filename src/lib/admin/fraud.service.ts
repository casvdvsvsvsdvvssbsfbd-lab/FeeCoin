// ============================================
// Fraud Detection Service
// Admin fraud management
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface FraudAlert {
  id: string;
  userId: string;
  username: string;
  type: 'vpn' | 'emulator' | 'duplicate_device' | 'multi_account' | 'rapid_clicking' | 'callback_abuse' | 'reward_abuse';
  riskScore: number;
  details: any;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface FraudStats {
  totalAlerts: number;
  pendingReview: number;
  resolvedToday: number;
  highRiskUsers: number;
  alertsByType: {
    vpn: number;
    emulator: number;
    duplicate_device: number;
    multi_account: number;
    rapid_clicking: number;
    callback_abuse: number;
    reward_abuse: number;
  };
}

class FraudService {
  private analytics = useAnalytics();

  // Get fraud statistics
  async getFraudStats(): Promise<FraudStats> {
    try {
      const { count: totalAlerts } = await supabase
        .from('fraud_alerts')
        .select('*', { count: 'exact', head: true });

      const { count: pendingReview } = await supabase
        .from('fraud_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: resolvedToday } = await supabase
        .from('fraud_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved')
        .gte('resolved_at', today.toISOString());

      const { count: highRiskUsers } = await supabase
        .from('fraud_alerts')
        .select('user_id', { count: 'exact', head: true })
        .gte('risk_score', 70);

      // Alerts by type
      const types = ['vpn', 'emulator', 'duplicate_device', 'multi_account', 'rapid_clicking', 'callback_abuse', 'reward_abuse'] as const;
      const alertsByType: any = {};
      
      for (const type of types) {
        const { count } = await supabase
          .from('fraud_alerts')
          .select('*', { count: 'exact', head: true })
          .eq('type', type);
        alertsByType[type] = count || 0;
      }

      return {
        totalAlerts: totalAlerts || 0,
        pendingReview: pendingReview || 0,
        resolvedToday: resolvedToday || 0,
        highRiskUsers: highRiskUsers || 0,
        alertsByType,
      };
    } catch (error) {
      console.error('Failed to fetch fraud stats:', error);
      return {
        totalAlerts: 0,
        pendingReview: 0,
        resolvedToday: 0,
        highRiskUsers: 0,
        alertsByType: {
          vpn: 0,
          emulator: 0,
          duplicate_device: 0,
          multi_account: 0,
          rapid_clicking: 0,
          callback_abuse: 0,
          reward_abuse: 0,
        },
      };
    }
  }

  // Get fraud alerts with filters
  async getFraudAlerts(filters: {
    type?: string;
    status?: string;
    minRiskScore?: number;
    page?: number;
    limit?: number;
  }): Promise<{ alerts: FraudAlert[]; total: number }> {
    try {
      let query = supabase
        .from('fraud_alerts')
        .select('*, profiles!fraud_alerts_user_id_fkey(username)', { count: 'exact' });

      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.minRiskScore) {
        query = query.gte('risk_score', filters.minRiskScore);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('risk_score', { ascending: false });

      const { data, count, error } = await query;

      if (error) throw error;

      const alerts = (data || []).map(alert => ({
        id: alert.id,
        userId: alert.user_id,
        username: alert.profiles?.username || 'unknown',
        type: alert.type,
        riskScore: alert.risk_score,
        details: alert.details,
        status: alert.status,
        createdAt: alert.created_at,
      }));

      return {
        alerts,
        total: count || 0,
      };
    } catch (error) {
      console.error('Failed to fetch fraud alerts:', error);
      return { alerts: [], total: 0 };
    }
  }

  // Review fraud alert
  async reviewAlert(alertId: string, adminId: string, action: 'approved' | 'rejected', notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fraud_alerts')
        .update({
          status: 'reviewed',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          review_notes: notes,
          action: action,
        })
        .eq('id', alertId);

      if (error) throw error;

      this.analytics.trackEvent('admin_fraud_alert_reviewed', { alertId, action });
      return true;
    } catch (error) {
      console.error('Failed to review alert:', error);
      return false;
    }
  }

  // Get suspicious users
  async getSuspiciousUsers(limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('fraud_alerts')
        .select('*, profiles!fraud_alerts_user_id_fkey(*)')
        .gte('risk_score', 50)
        .order('risk_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to fetch suspicious users:', error);
      return [];
    }
  }

  // Ban suspicious user
  async banSuspiciousUser(userId: string, reason: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: 'banned',
          fraud_score: 100,
        })
        .eq('id', userId);

      if (error) throw error;

      this.analytics.trackEvent('admin_suspicious_user_banned', { userId, reason });
      return true;
    } catch (error) {
      console.error('Failed to ban suspicious user:', error);
      return false;
    }
  }

  // Get user fraud history
  async getUserFraudHistory(userId: string): Promise<FraudAlert[]> {
    try {
      const { data, error } = await supabase
        .from('fraud_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user fraud history:', error);
      return [];
    }
  }
}

// Singleton instance
export const fraudService = new FraudService();