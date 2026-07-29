// ============================================
// Risk Engine Service
// Calculate dynamic risk scores
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';
import { remoteConfigService } from '../admin/remote-config.service';

export interface RiskScore {
  userId: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    emulator: boolean;
    virtualMachine: boolean;
    root: boolean;
    jailbreak: boolean;
    automation: boolean;
    macro: boolean;
    rapidClicking: boolean;
    impossibleSpeed: boolean;
    duplicateDevice: boolean;
    duplicateIp: boolean;
    duplicateWallet: boolean;
    multipleTelegramAccounts: boolean;
    cookieAbuse: boolean;
    referralAbuse: boolean;
    rewardAbuse: boolean;
    fakeSurveys: boolean;
    fakeOfferwalls: boolean;
    callbackManipulation: boolean;
    apiAbuse: boolean;
  };
  violations: string[];
  lastCalculated: string;
  recommendedAction: 'none' | 'warning' | 'freeze_rewards' | 'freeze_withdrawals' | 'shadow_ban' | 'temporary_ban' | 'permanent_ban' | 'manual_review';
}

export interface RiskThresholds {
  warning: number;
  freezeRewards: number;
  freezeWithdrawals: number;
  shadowBan: number;
  temporaryBan: number;
  permanentBan: number;
}

class RiskEngineService {
  private analytics = useAnalytics();
  private thresholds: RiskThresholds = {
    warning: 30,
    freezeRewards: 50,
    freezeWithdrawals: 60,
    shadowBan: 70,
    temporaryBan: 85,
    permanentBan: 95,
  };

  // Calculate risk score for user
  async calculateRiskScore(userId: string): Promise<RiskScore> {
    try {
      // Load thresholds from remote config
      await this.loadThresholds();

      const factors = {
        vpn: false,
        proxy: false,
        tor: false,
        emulator: false,
        virtualMachine: false,
        root: false,
        jailbreak: false,
        automation: false,
        macro: false,
        rapidClicking: false,
        impossibleSpeed: false,
        duplicateDevice: false,
        duplicateIp: false,
        duplicateWallet: false,
        multipleTelegramAccounts: false,
        cookieAbuse: false,
        referralAbuse: false,
        rewardAbuse: false,
        fakeSurveys: false,
        fakeOfferwalls: false,
        callbackManipulation: false,
        apiAbuse: false,
      };

      const violations: string[] = [];

      // Check device fingerprint
      const deviceRisk = await this.checkDeviceRisk(userId);
      factors.vpn = deviceRisk.vpn;
      factors.proxy = deviceRisk.proxy;
      factors.tor = deviceRisk.tor;
      factors.emulator = deviceRisk.emulator;
      factors.virtualMachine = deviceRisk.virtualMachine;
      factors.root = deviceRisk.root;
      factors.jailbreak = deviceRisk.jailbreak;
      if (deviceRisk.violations.length > 0) violations.push(...deviceRisk.violations);

      // Check behavior patterns
      const behaviorRisk = await this.checkBehaviorRisk(userId);
      factors.rapidClicking = behaviorRisk.rapidClicking;
      factors.impossibleSpeed = behaviorRisk.impossibleSpeed;
      factors.automation = behaviorRisk.automation;
      factors.macro = behaviorRisk.macro;
      if (behaviorRisk.violations.length > 0) violations.push(...behaviorRisk.violations);

      // Check duplicate accounts
      const duplicateRisk = await this.checkDuplicateRisk(userId);
      factors.duplicateDevice = duplicateRisk.duplicateDevice;
      factors.duplicateIp = duplicateRisk.duplicateIp;
      factors.duplicateWallet = duplicateRisk.duplicateWallet;
      factors.multipleTelegramAccounts = duplicateRisk.multipleTelegramAccounts;
      if (duplicateRisk.violations.length > 0) violations.push(...duplicateRisk.violations);

      // Check reward abuse
      const rewardRisk = await this.checkRewardAbuse(userId);
      factors.rewardAbuse = rewardRisk.rewardAbuse;
      factors.referralAbuse = rewardRisk.referralAbuse;
      factors.fakeSurveys = rewardRisk.fakeSurveys;
      factors.fakeOfferwalls = rewardRisk.fakeOfferwalls;
      factors.callbackManipulation = rewardRisk.callbackManipulation;
      if (rewardRisk.violations.length > 0) violations.push(...rewardRisk.violations);

      // Check API abuse
      const apiRisk = await this.checkApiAbuse(userId);
      factors.apiAbuse = apiRisk.apiAbuse;
      factors.cookieAbuse = apiRisk.cookieAbuse;
      if (apiRisk.violations.length > 0) violations.push(...apiRisk.violations);

      // Calculate score
      const score = this.calculateScore(factors);

      // Determine level
      const level = this.getRiskLevel(score);

      // Determine recommended action
      const recommendedAction = this.getRecommendedAction(score);

      const riskScore: RiskScore = {
        userId,
        score,
        level,
        factors,
        violations,
        lastCalculated: new Date().toISOString(),
        recommendedAction,
      };

      // Store in database
      await this.storeRiskScore(riskScore);

      // Take automatic action if needed
      if (recommendedAction !== 'none') {
        await this.takeAction(userId, recommendedAction, violations);
      }

      this.analytics.trackEvent('risk_score_calculated', {
        userId,
        score,
        level,
        violations: violations.length,
      });

      return riskScore;
    } catch (error) {
      console.error('Failed to calculate risk score:', error);
      throw error;
    }
  }

  // Check device risk
  private async checkDeviceRisk(userId: string): Promise<{
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    emulator: boolean;
    virtualMachine: boolean;
    root: boolean;
    jailbreak: boolean;
    violations: string[];
  }> {
    const violations: string[] = [];

    try {
      const { data: devices } = await supabase
        .from('device_fingerprints')
        .select('*')
        .eq('user_id', userId)
        .order('last_seen', { ascending: false })
        .limit(5);

      const device = devices?.[0];

      return {
        vpn: device?.is_vpn || false,
        proxy: device?.is_proxy || false,
        tor: device?.is_tor || false,
        emulator: device?.is_emulator || false,
        virtualMachine: false,
        root: device?.is_rooted || false,
        jailbreak: device?.is_jailbroken || false,
        violations: device?.is_vpn ? ['VPN detected'] : [],
      };
    } catch (error) {
      return {
        vpn: false,
        proxy: false,
        tor: false,
        emulator: false,
        virtualMachine: false,
        root: false,
        jailbreak: false,
        violations: [],
      };
    }
  }

  // Check behavior risk
  private async checkBehaviorRisk(userId: string): Promise<{
    rapidClicking: boolean;
    impossibleSpeed: boolean;
    automation: boolean;
    macro: boolean;
    violations: string[];
  }> {
    const violations: string[] = [];

    try {
      // Check recent task completions
      const { data: recentTasks } = await supabase
        .from('user_tasks')
        .select('completed_at, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (recentTasks && recentTasks.length > 0) {
        // Check for rapid clicking (multiple tasks in < 1 second)
        const rapidClicks = recentTasks.filter((task, index) => {
          if (index === 0) return false;
          const prev = recentTasks[index - 1];
          const timeDiff = new Date(task.completed_at).getTime() - new Date(prev.completed_at).getTime();
          return timeDiff < 1000;
        });

        if (rapidClicks.length > 10) {
          violations.push('Rapid clicking detected');
        }

        // Check for impossible speed (completing tasks too fast)
        const impossibleSpeed = recentTasks.some(task => {
          const created = new Date(task.created_at).getTime();
          const completed = new Date(task.completed_at).getTime();
          const duration = completed - created;
          return duration < 1000; // Less than 1 second
        });

        if (impossibleSpeed) {
          violations.push('Impossible completion speed');
        }
      }

      return {
        rapidClicking: violations.includes('Rapid clicking detected'),
        impossibleSpeed: violations.includes('Impossible completion speed'),
        automation: false,
        macro: false,
        violations,
      };
    } catch (error) {
      return {
        rapidClicking: false,
        impossibleSpeed: false,
        automation: false,
        macro: false,
        violations: [],
      };
    }
  }

  // Check duplicate risk
  private async checkDuplicateRisk(userId: string): Promise<{
    duplicateDevice: boolean;
    duplicateIp: boolean;
    duplicateWallet: boolean;
    multipleTelegramAccounts: boolean;
    violations: string[];
  }> {
    const violations: string[] = [];

    try {
      // Get user's device
      const { data: userDevices } = await supabase
        .from('device_fingerprints')
        .select('device_id')
        .eq('user_id', userId);

      const userDeviceIds = userDevices?.map(d => d.device_id) || [];

      // Check if device is used by other users
      if (userDeviceIds.length > 0) {
        const { count: deviceUsers } = await supabase
          .from('device_fingerprints')
          .select('user_id', { count: 'exact', head: true })
          .in('device_id', userDeviceIds)
          .neq('user_id', userId);

        if (deviceUsers && deviceUsers > 0) {
          violations.push('Device shared with other accounts');
        }
      }

      return {
        duplicateDevice: violations.includes('Device shared with other accounts'),
        duplicateIp: false,
        duplicateWallet: false,
        multipleTelegramAccounts: false,
        violations,
      };
    } catch (error) {
      return {
        duplicateDevice: false,
        duplicateIp: false,
        duplicateWallet: false,
        multipleTelegramAccounts: false,
        violations: [],
      };
    }
  }

  // Check reward abuse
  private async checkRewardAbuse(userId: string): Promise<{
    rewardAbuse: boolean;
    referralAbuse: boolean;
    fakeSurveys: boolean;
    fakeOfferwalls: boolean;
    callbackManipulation: boolean;
    violations: string[];
  }> {
    const violations: string[] = [];

    try {
      // Check for unusual reward patterns
      const { data: recentRewards } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('user_id', userId)
        .eq('type', 'reward')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const totalRewards = recentRewards?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

      // Check if rewards exceed normal limits
      if (totalRewards > 100000) {
        violations.push('Unusually high rewards');
      }

      return {
        rewardAbuse: violations.includes('Unusually high rewards'),
        referralAbuse: false,
        fakeSurveys: false,
        fakeOfferwalls: false,
        callbackManipulation: false,
        violations,
      };
    } catch (error) {
      return {
        rewardAbuse: false,
        referralAbuse: false,
        fakeSurveys: false,
        fakeOfferwalls: false,
        callbackManipulation: false,
        violations: [],
      };
    }
  }

  // Check API abuse
  private async checkApiAbuse(userId: string): Promise<{
    apiAbuse: boolean;
    cookieAbuse: boolean;
    violations: string[];
  }> {
    const violations: string[] = [];

    try {
      // Check for API rate limit violations
      const { count: recentCalls } = await supabase
        .from('api_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 60 * 1000).toISOString());

      if (recentCalls && recentCalls > 100) {
        violations.push('API rate limit exceeded');
      }

      return {
        apiAbuse: violations.includes('API rate limit exceeded'),
        cookieAbuse: false,
        violations,
      };
    } catch (error) {
      return {
        apiAbuse: false,
        cookieAbuse: false,
        violations: [],
      };
    }
  }

  // Calculate score from factors
  private calculateScore(factors: any): number {
    let score = 0;

    if (factors.vpn) score += 20;
    if (factors.proxy) score += 15;
    if (factors.tor) score += 25;
    if (factors.emulator) score += 15;
    if (factors.virtualMachine) score += 10;
    if (factors.root) score += 20;
    if (factors.jailbreak) score += 20;
    if (factors.automation) score += 25;
    if (factors.macro) score += 30;
    if (factors.rapidClicking) score += 15;
    if (factors.impossibleSpeed) score += 20;
    if (factors.duplicateDevice) score += 25;
    if (factors.duplicateIp) score += 15;
    if (factors.duplicateWallet) score += 20;
    if (factors.multipleTelegramAccounts) score += 20;
    if (factors.cookieAbuse) score += 10;
    if (factors.referralAbuse) score += 15;
    if (factors.rewardAbuse) score += 25;
    if (factors.fakeSurveys) score += 20;
    if (factors.fakeOfferwalls) score += 20;
    if (factors.callbackManipulation) score += 30;
    if (factors.apiAbuse) score += 15;

    return Math.min(score, 100);
  }

  // Get risk level
  private getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    if (score < 85) return 'high';
    return 'critical';
  }

  // Get recommended action
  private getRecommendedAction(score: number): RiskScore['recommendedAction'] {
    if (score >= this.thresholds.permanentBan) return 'permanent_ban';
    if (score >= this.thresholds.temporaryBan) return 'temporary_ban';
    if (score >= this.thresholds.shadowBan) return 'shadow_ban';
    if (score >= this.thresholds.freezeWithdrawals) return 'freeze_withdrawals';
    if (score >= this.thresholds.freezeRewards) return 'freeze_rewards';
    if (score >= this.thresholds.warning) return 'warning';
    return 'none';
  }

  // Load thresholds from remote config
  private async loadThresholds(): Promise<void> {
    try {
      const warning = await remoteConfigService.getConfig('risk_threshold_warning');
      const freezeRewards = await remoteConfigService.getConfig('risk_threshold_freeze_rewards');
      const freezeWithdrawals = await remoteConfigService.getConfig('risk_threshold_freeze_withdrawals');
      const shadowBan = await remoteConfigService.getConfig('risk_threshold_shadow_ban');
      const temporaryBan = await remoteConfigService.getConfig('risk_threshold_temporary_ban');
      const permanentBan = await remoteConfigService.getConfig('risk_threshold_permanent_ban');

      if (warning) this.thresholds.warning = warning;
      if (freezeRewards) this.thresholds.freezeRewards = freezeRewards;
      if (freezeWithdrawals) this.thresholds.freezeWithdrawals = freezeWithdrawals;
      if (shadowBan) this.thresholds.shadowBan = shadowBan;
      if (temporaryBan) this.thresholds.temporaryBan = temporaryBan;
      if (permanentBan) this.thresholds.permanentBan = permanentBan;
    } catch (error) {
      console.error('Failed to load thresholds:', error);
    }
  }

  // Store risk score
  private async storeRiskScore(riskScore: RiskScore): Promise<void> {
    try {
      await supabase.from('risk_scores').insert({
        user_id: riskScore.userId,
        score: riskScore.score,
        level: riskScore.level,
        factors: riskScore.factors,
        violations: riskScore.violations,
        recommended_action: riskScore.recommendedAction,
      });
    } catch (error) {
      console.error('Failed to store risk score:', error);
    }
  }

  // Take automatic action
  private async takeAction(userId: string, action: string, violations: string[]): Promise<void> {
    try {
      switch (action) {
        case 'warning':
          // Send warning notification
          await this.sendWarning(userId, violations);
          break;
        case 'freeze_rewards':
          await supabase.from('profiles').update({ status: 'frozen' }).eq('id', userId);
          break;
        case 'freeze_withdrawals':
          await supabase.from('wallets').update({ withdrawals_frozen: true }).eq('user_id', userId);
          break;
        case 'shadow_ban':
          await supabase.from('profiles').update({ status: 'shadow_banned' }).eq('id', userId);
          break;
        case 'temporary_ban':
          await supabase.from('profiles').update({ status: 'temporarily_banned' }).eq('id', userId);
          break;
        case 'permanent_ban':
          await supabase.from('profiles').update({ status: 'banned' }).eq('id', userId);
          break;
      }

      this.analytics.trackEvent('fraud_action_taken', { userId, action, violations: violations.length });
    } catch (error) {
      console.error('Failed to take action:', error);
    }
  }

  // Send warning
  private async sendWarning(userId: string, violations: string[]): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'system',
        title: 'Security Warning',
        message: `Suspicious activity detected: ${violations.join(', ')}`,
        data: { violations },
      });
    } catch (error) {
      console.error('Failed to send warning:', error);
    }
  }

  // Get user risk history
  async getUserRiskHistory(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('risk_scores')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch risk history:', error);
      return [];
    }
  }
}

// Singleton instance
export const riskEngineService = new RiskEngineService();