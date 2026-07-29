// ============================================
// Behavior AI Service
// Analyze user behavior patterns
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface BehaviorProfile {
  userId: string;
  dailyPattern: {
    activeHours: number[];
    averageSessionDuration: number;
    averageTasksPerDay: number;
    averageRewardsPerDay: number;
  };
  clickPattern: {
    averageClickSpeed: number;
    maxClickSpeed: number;
    clickVariance: number;
  };
  taskPattern: {
    averageWatchDuration: number;
    averageCompletionTime: number;
    preferredTaskTypes: string[];
    completionRate: number;
  };
  withdrawalPattern: {
    averageWithdrawalAmount: number;
    withdrawalFrequency: number;
    preferredMethods: string[];
  };
  referralPattern: {
    averageReferralsPerMonth: number;
    referralQuality: number;
  };
  riskIndicators: {
    botLike: boolean;
    unnatural: boolean;
    suspicious: boolean;
  };
  lastUpdated: string;
}

export interface BehaviorEvent {
  userId: string;
  eventType: 'click' | 'scroll' | 'task_start' | 'task_complete' | 'install_start' | 'install_complete' | 'survey_start' | 'survey_complete' | 'withdrawal_request' | 'referral_click';
  timestamp: string;
  metadata: any;
}

class BehaviorAIService {
  private analytics = useAnalytics();
  private behaviorCache: Map<string, BehaviorProfile> = new Map();

  // Analyze user behavior
  async analyzeBehavior(userId: string): Promise<BehaviorProfile> {
    try {
      // Check cache
      if (this.behaviorCache.has(userId)) {
        return this.behaviorCache.get(userId)!;
      }

      const profile: BehaviorProfile = {
        userId,
        dailyPattern: await this.analyzeDailyPattern(userId),
        clickPattern: await this.analyzeClickPattern(userId),
        taskPattern: await this.analyzeTaskPattern(userId),
        withdrawalPattern: await this.analyzeWithdrawalPattern(userId),
        referralPattern: await this.analyzeReferralPattern(userId),
        riskIndicators: this.calculateRiskIndicators(),
        lastUpdated: new Date().toISOString(),
      };

      // Cache profile
      this.behaviorCache.set(userId, profile);

      // Store in database
      await this.storeProfile(profile);

      this.analytics.trackEvent('behavior_analyzed', {
        userId,
        botLike: profile.riskIndicators.botLike,
        suspicious: profile.riskIndicators.suspicious,
      });

      return profile;
    } catch (error) {
      console.error('Failed to analyze behavior:', error);
      throw error;
    }
  }

  // Analyze daily pattern
  private async analyzeDailyPattern(userId: string): Promise<BehaviorProfile['dailyPattern']> {
    try {
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('started_at, ended_at')
        .eq('user_id', userId)
        .gte('started_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('started_at', { ascending: false });

      const sessionsData = sessions || [];
      const activeHours: number[] = [];
      let totalDuration = 0;
      let totalTasks = 0;

      sessionsData.forEach(session => {
        const start = new Date(session.started_at);
        const end = session.ended_at ? new Date(session.ended_at) : new Date();
        const duration = end.getTime() - start.getTime();
        
        activeHours.push(start.getHours());
        totalDuration += duration;
      });

      // Get tasks count
      const { count: tasksCount } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const days = 30;
      const averageSessionDuration = sessionsData.length > 0 ? totalDuration / sessionsData.length : 0;
      const averageTasksPerDay = tasksCount ? tasksCount / days : 0;

      // Get rewards
      const { data: rewards } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'reward')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const totalRewards = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0;
      const averageRewardsPerDay = totalRewards / days;

      return {
        activeHours: [...new Set(activeHours)].sort(),
        averageSessionDuration,
        averageTasksPerDay,
        averageRewardsPerDay,
      };
    } catch (error) {
      return {
        activeHours: [],
        averageSessionDuration: 0,
        averageTasksPerDay: 0,
        averageRewardsPerDay: 0,
      };
    }
  }

  // Analyze click pattern
  private async analyzeClickPattern(userId: string): Promise<BehaviorProfile['clickPattern']> {
    try {
      const { data: events } = await supabase
        .from('behavior_events')
        .select('timestamp, metadata')
        .eq('user_id', userId)
        .eq('event_type', 'click')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: true })
        .limit(1000);

      const eventsData = events || [];
      const clickSpeeds: number[] = [];

      for (let i = 1; i < eventsData.length; i++) {
        const prev = new Date(eventsData[i - 1].timestamp).getTime();
        const curr = new Date(eventsData[i].timestamp).getTime();
        const diff = curr - prev;
        
        if (diff > 0) {
          clickSpeeds.push(1000 / diff); // Clicks per second
        }
      }

      const averageClickSpeed = clickSpeeds.length > 0 
        ? clickSpeeds.reduce((a, b) => a + b, 0) / clickSpeeds.length 
        : 0;
      const maxClickSpeed = Math.max(...clickSpeeds, 0);
      
      const variance = clickSpeeds.length > 0
        ? clickSpeeds.reduce((sum, speed) => sum + Math.pow(speed - averageClickSpeed, 2), 0) / clickSpeeds.length
        : 0;
      const clickVariance = Math.sqrt(variance);

      return {
        averageClickSpeed,
        maxClickSpeed,
        clickVariance,
      };
    } catch (error) {
      return {
        averageClickSpeed: 0,
        maxClickSpeed: 0,
        clickVariance: 0,
      };
    }
  }

  // Analyze task pattern
  private async analyzeTaskPattern(userId: string): Promise<BehaviorProfile['taskPattern']> {
    try {
      const { data: tasks } = await supabase
        .from('user_tasks')
        .select('task_type, status, created_at, completed_at, metadata')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const tasksData = tasks || [];
      const completedTasks = tasksData.filter(t => t.status === 'completed');

      const taskTypes: { [key: string]: number } = {};
      let totalCompletionTime = 0;

      completedTasks.forEach(task => {
        taskTypes[task.task_type] = (taskTypes[task.task_type] || 0) + 1;
        
        if (task.completed_at) {
          const created = new Date(task.created_at).getTime();
          const completed = new Date(task.completed_at).getTime();
          totalCompletionTime += completed - created;
        }
      });

      const preferredTaskTypes = Object.entries(taskTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([type]) => type);

      const averageCompletionTime = completedTasks.length > 0 
        ? totalCompletionTime / completedTasks.length 
        : 0;
      const completionRate = tasksData.length > 0 
        ? (completedTasks.length / tasksData.length) * 100 
        : 0;

      return {
        averageWatchDuration: averageCompletionTime,
        averageCompletionTime,
        preferredTaskTypes,
        completionRate,
      };
    } catch (error) {
      return {
        averageWatchDuration: 0,
        averageCompletionTime: 0,
        preferredTaskTypes: [],
        completionRate: 0,
      };
    }
  }

  // Analyze withdrawal pattern
  private async analyzeWithdrawalPattern(userId: string): Promise<BehaviorProfile['withdrawalPattern']> {
    try {
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('amount, method, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      const withdrawalsData = withdrawals || [];

      const methods: { [key: string]: number } = {};
      let totalAmount = 0;

      withdrawalsData.forEach(w => {
        totalAmount += w.amount;
        methods[w.method] = (methods[w.method] || 0) + 1;
      });

      const preferredMethods = Object.entries(methods)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([method]) => method);

      const days = 90;
      const averageWithdrawalAmount = withdrawalsData.length > 0 ? totalAmount / withdrawalsData.length : 0;
      const withdrawalFrequency = withdrawalsData.length / days;

      return {
        averageWithdrawalAmount,
        withdrawalFrequency,
        preferredMethods,
      };
    } catch (error) {
      return {
        averageWithdrawalAmount: 0,
        withdrawalFrequency: 0,
        preferredMethods: [],
      };
    }
  }

  // Analyze referral pattern
  private async analyzeReferralPattern(userId: string): Promise<BehaviorProfile['referralPattern']> {
    try {
      const { count: referrals } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', userId)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      const months = 3;
      const averageReferralsPerMonth = referrals ? referrals / months : 0;

      // Calculate referral quality (active referrals / total referrals)
      const { count: activeReferrals } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', userId)
        .eq('status', 'active');

      const referralQuality = referrals ? (activeReferrals || 0) / referrals : 0;

      return {
        averageReferralsPerMonth,
        referralQuality,
      };
    } catch (error) {
      return {
        averageReferralsPerMonth: 0,
        referralQuality: 0,
      };
    }
  }

  // Calculate risk indicators
  private calculateRiskIndicators(): BehaviorProfile['riskIndicators'] {
    // This would use ML/heuristics in production
    // For now, return default values
    return {
      botLike: false,
      unnatural: false,
      suspicious: false,
    };
  }

  // Store profile in database
  private async storeProfile(profile: BehaviorProfile): Promise<void> {
    try {
      await supabase.from('behavior_profiles').insert({
        user_id: profile.userId,
        daily_pattern: profile.dailyPattern,
        click_pattern: profile.clickPattern,
        task_pattern: profile.taskPattern,
        withdrawal_pattern: profile.withdrawalPattern,
        referral_pattern: profile.referralPattern,
        risk_indicators: profile.riskIndicators,
      });
    } catch (error) {
      console.error('Failed to store behavior profile:', error);
    }
  }

  // Record behavior event
  async recordEvent(userId: string, eventType: BehaviorEvent['eventType'], metadata: any = {}): Promise<void> {
    try {
      await supabase.from('behavior_events').insert({
        user_id: userId,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        metadata,
      });
    } catch (error) {
      console.error('Failed to record behavior event:', error);
    }
  }

  // Get behavior profile
  async getBehaviorProfile(userId: string): Promise<BehaviorProfile | null> {
    try {
      const { data, error } = await supabase
        .from('behavior_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      return {
        userId: data.user_id,
        dailyPattern: data.daily_pattern,
        clickPattern: data.click_pattern,
        taskPattern: data.task_pattern,
        withdrawalPattern: data.withdrawal_pattern,
        referralPattern: data.referral_pattern,
        riskIndicators: data.risk_indicators,
        lastUpdated: data.updated_at,
      };
    } catch (error) {
      console.error('Failed to fetch behavior profile:', error);
      return null;
    }
  }

  // Clear cache
  clearCache(userId?: string): void {
    if (userId) {
      this.behaviorCache.delete(userId);
    } else {
      this.behaviorCache.clear();
    }
  }
}

// Singleton instance
export const behaviorAIService = new BehaviorAIService();