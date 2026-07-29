// ============================================
// Admin Service
// Enterprise admin panel backend
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface AdminStats {
  totalUsers: number;
  onlineUsers: number;
  newUsersToday: number;
  activeUsers: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  platformProfit: number;
  userRewards: number;
  withdrawPending: number;
  withdrawCompleted: number;
  adRevenue: number;
  offerwallRevenue: number;
  surveyRevenue: number;
  installRevenue: number;
}

export interface UserData {
  id: string;
  telegramId: number;
  username: string;
  firstName: string;
  lastName: string;
  country: string;
  language: string;
  registrationDate: string;
  level: number;
  rank: number;
  energy: number;
  fcBalance: number;
  withdrawalProgress: number;
  isPremium: boolean;
  status: 'active' | 'banned' | 'frozen';
  fraudScore: number;
  deviceInfo: any;
  sessions: any[];
}

export interface WithdrawalData {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  createdAt: string;
  processedAt?: string;
  settlementCycle: string;
}

export interface ProviderStats {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'disabled';
  revenue: number;
  fillRate: number;
  latency: number;
  successRate: number;
  errors: number;
  priority: number;
}

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

export interface AuditLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  targetType: string;
  targetId: string;
  changes: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

class AdminService {
  private analytics = useAnalytics();

  // Get dashboard statistics
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Online users (active in last 15 minutes)
      const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
      const { count: onlineUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', fifteenMinsAgo.toISOString());

      // New users today
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Active users (with transactions in last 24 hours)
      const { count: activeUsers } = await supabase
        .from('transactions')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Revenue calculations
      const { data: todayTx } = await supabase
        .from('transactions')
        .select('amount, type')
        .gte('created_at', today.toISOString())
        .eq('status', 'completed');

      const { data: weekTx } = await supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', weekAgo.toISOString())
        .eq('status', 'completed');

      const { data: monthTx } = await supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', monthAgo.toISOString())
        .eq('status', 'completed');

      const revenueToday = todayTx?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
      const revenueWeek = weekTx?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
      const revenueMonth = monthTx?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

      // Withdrawals
      const { count: withdrawPending } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: withdrawCompleted } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Revenue by type
      const adRevenue = todayTx?.filter(tx => tx.type === 'ad').reduce((sum, tx) => sum + tx.amount, 0) || 0;
      const offerwallRevenue = todayTx?.filter(tx => tx.type === 'offer').reduce((sum, tx) => sum + tx.amount, 0) || 0;
      const surveyRevenue = todayTx?.filter(tx => tx.type === 'survey').reduce((sum, tx) => sum + tx.amount, 0) || 0;
      const installRevenue = todayTx?.filter(tx => tx.type === 'install').reduce((sum, tx) => sum + tx.amount, 0) || 0;

      return {
        totalUsers: totalUsers || 0,
        onlineUsers: onlineUsers || 0,
        newUsersToday: newUsersToday || 0,
        activeUsers: activeUsers || 0,
        revenueToday,
        revenueWeek,
        revenueMonth,
        platformProfit: revenueMonth * 0.2,
        userRewards: revenueMonth * 0.8,
        withdrawPending: withdrawPending || 0,
        withdrawCompleted: withdrawCompleted || 0,
        adRevenue,
        offerwallRevenue,
        surveyRevenue,
        installRevenue,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        totalUsers: 0,
        onlineUsers: 0,
        newUsersToday: 0,
        activeUsers: 0,
        revenueToday: 0,
        revenueWeek: 0,
        revenueMonth: 0,
        platformProfit: 0,
        userRewards: 0,
        withdrawPending: 0,
        withdrawCompleted: 0,
        adRevenue: 0,
        offerwallRevenue: 0,
        surveyRevenue: 0,
        installRevenue: 0,
      };
    }
  }

  // Get users with filters
  async getUsers(filters: {
    search?: string;
    country?: string;
    language?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: UserData[]; total: number }> {
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.search) {
        query = query.or(`username.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
      }
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, count, error } = await query;

      if (error) throw error;

      // Fetch wallet data for each user
      const usersWithWallets = await Promise.all(
        (data || []).map(async (user) => {
          const { data: wallet } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .single();

          return {
            id: user.id,
            telegramId: user.telegram_id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            country: user.country,
            language: user.language,
            registrationDate: user.created_at,
            level: user.level || 1,
            rank: user.rank || 0,
            energy: wallet?.energy || 100,
            fcBalance: wallet?.available_fc || 0,
            withdrawalProgress: wallet?.withdrawal_progress || 0,
            isPremium: user.is_premium || false,
            status: user.status || 'active',
            fraudScore: user.fraud_score || 0,
            deviceInfo: user.device_info,
            sessions: [],
          };
        })
      );

      return {
        users: usersWithWallets,
        total: count || 0,
      };
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return { users: [], total: 0 };
    }
  }

  // Get withdrawals with filters
  async getWithdrawals(filters: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ withdrawals: WithdrawalData[]; total: number }> {
    try {
      let query = supabase
        .from('withdrawals')
        .select('*, profiles!withdrawals_user_id_fkey(username)', { count: 'exact' });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`profiles.username.ilike.%${filters.search}%`);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, count, error } = await query;

      if (error) throw error;

      const withdrawals = (data || []).map(w => ({
        id: w.id,
        userId: w.user_id,
        username: w.profiles?.username || 'unknown',
        amount: w.amount,
        method: w.method,
        status: w.status,
        createdAt: w.created_at,
        processedAt: w.processed_at,
        settlementCycle: w.settlement_cycle || 'N/A',
      }));

      return {
        withdrawals,
        total: count || 0,
      };
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      return { withdrawals: [], total: 0 };
    }
  }

  // Approve withdrawal
  async approveWithdrawal(withdrawalId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: adminId,
        })
        .eq('id', withdrawalId);

      if (error) throw error;

      this.analytics.trackEvent('admin_withdrawal_approved', { withdrawalId });
      return true;
    } catch (error) {
      console.error('Failed to approve withdrawal:', error);
      return false;
    }
  }

  // Reject withdrawal
  async rejectWithdrawal(withdrawalId: string, reason: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: adminId,
          rejection_reason: reason,
        })
        .eq('id', withdrawalId);

      if (error) throw error;

      this.analytics.trackEvent('admin_withdrawal_rejected', { withdrawalId, reason });
      return true;
    } catch (error) {
      console.error('Failed to reject withdrawal:', error);
      return false;
    }
  }

  // Get provider statistics
  async getProviderStats(): Promise<ProviderStats[]> {
    try {
      const { data, error } = await supabase
        .from('provider_stats')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to fetch provider stats:', error);
      return [];
    }
  }

  // Get fraud alerts
  async getFraudAlerts(filters: { status?: string; page?: number; limit?: number }): Promise<{ alerts: FraudAlert[]; total: number }> {
    try {
      let query = supabase
        .from('fraud_alerts')
        .select('*, profiles!fraud_alerts_user_id_fkey(username)', { count: 'exact' });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

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

  // Get audit logs
  async getAuditLogs(filters: {
    adminId?: string;
    action?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' });

      if (filters.adminId) {
        query = query.eq('admin_id', filters.adminId);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, count, error } = await query;

      if (error) throw error;

      const logs = (data || []).map(log => ({
        id: log.id,
        adminId: log.admin_id,
        adminUsername: log.admin_username,
        action: log.action,
        targetType: log.target_type,
        targetId: log.target_id,
        changes: log.changes,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        createdAt: log.created_at,
      }));

      return {
        logs,
        total: count || 0,
      };
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return { logs: [], total: 0 };
    }
  }

  // Ban user
  async banUser(userId: string, reason: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'banned' })
        .eq('id', userId);

      if (error) throw error;

      // Log action
      await this.logAudit(adminId, 'ban_user', 'user', userId, { reason });

      this.analytics.trackEvent('admin_user_banned', { userId, reason });
      return true;
    } catch (error) {
      console.error('Failed to ban user:', error);
      return false;
    }
  }

  // Unban user
  async unbanUser(userId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', userId);

      if (error) throw error;

      await this.logAudit(adminId, 'unban_user', 'user', userId, {});

      this.analytics.trackEvent('admin_user_unbanned', { userId });
      return true;
    } catch (error) {
      console.error('Failed to unban user:', error);
      return false;
    }
  }

  // Log audit action
  private async logAudit(adminId: string, action: string, targetType: string, targetId: string, changes: any): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        admin_id: adminId,
        action,
        target_type: targetType,
        target_id: targetId,
        changes,
        ip_address: '',
        user_agent: '',
      });
    } catch (error) {
      console.error('Failed to log audit:', error);
    }
  }
}

// Singleton instance
export const adminService = new AdminService();