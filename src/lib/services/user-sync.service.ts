// ============================================
// User Synchronization Service
// Production-ready Telegram user sync
// ============================================

import { supabase } from '../supabase';
import { telegramSDK } from '../telegram';
import type { TelegramUser } from '../telegram/types';

class UserSyncService {
  private static instance: UserSyncService;
  private currentUser: any = null;
  private syncPromise: Promise<any> | null = null;

  private constructor() {}

  public static getInstance(): UserSyncService {
    if (!UserSyncService.instance) {
      UserSyncService.instance = new UserSyncService();
    }
    return UserSyncService.instance;
  }

  public async syncUser(): Promise<any> {
    if (this.currentUser) return this.currentUser;
    if (this.syncPromise) return this.syncPromise;

    this.syncPromise = this.performSync();
    return this.syncPromise;
  }

  private async performSync(): Promise<any> {
    try {
      const telegramUser = telegramSDK.getUser();

      if (!telegramUser) {
        throw new Error('No Telegram user data available');
      }

      // Try to get existing user by telegram_id
      let { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        // Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            email: existingUser.email, // Keep existing email
            phone: existingUser.phone, // Keep existing phone
            last_login_at: new Date().toISOString(),
            last_active_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        this.currentUser = updatedUser;
        return updatedUser;
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            status: 'active',
            email_verified: false,
            phone_verified: false,
            last_login_at: new Date().toISOString(),
            last_active_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        // Create profile
        await this.createProfile(newUser.id);

        // Create wallet
        await this.createWallet(newUser.id);

        // Create streak
        await this.createStreak(newUser.id);

        // Create device record
        await this.registerDevice(newUser.id);

        this.currentUser = newUser;
        return newUser;
      }
    } catch (error) {
      console.error('User sync failed:', error);
      throw error;
    }
  }

  private async createProfile(userId: string): Promise<void> {
    const telegramUser = telegramSDK.getUser();
    const deviceInfo = this.getDeviceInfo();

    const { error } = await supabase.from('profiles').insert({
      user_id: userId,
      language_code: telegramUser?.language_code || deviceInfo?.languageCode || 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      level: 1,
      rank: 'bronze',
      total_earned: 0,
      total_withdrawn: 0,
      tasks_completed: 0,
      ads_watched: 0,
      apps_installed: 0,
      referrals_count: 0,
      current_streak: 0,
      longest_streak: 0,
      is_public: true,
      show_on_leaderboard: true,
    });

    if (error) {
      console.error('Failed to create profile:', error);
      throw error;
    }
  }

  private async createWallet(userId: string): Promise<void> {
    const { error } = await supabase.from('wallets').insert({
      user_id: userId,
      balance: 0,
      pending_balance: 0,
      withdrawable_balance: 0,
      total_earned: 0,
      total_withdrawn: 0,
    });

    if (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    }
  }

  private async createStreak(userId: string): Promise<void> {
    const { error } = await supabase.from('streaks').insert({
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      freeze_available: false,
    });

    if (error) {
      console.error('Failed to create streak:', error);
      throw error;
    }
  }

  private async registerDevice(userId: string): Promise<void> {
    const telegramUser = telegramSDK.getUser();
    const deviceInfo = this.getDeviceInfo();
    const userAgent = navigator.userAgent;

    // Generate device ID
    const deviceId = this.generateDeviceId();

    // Register device
    const { error: deviceError } = await supabase.from('user_devices').upsert({
      user_id: userId,
      device_id: deviceId,
      device_type: this.detectDeviceType(userAgent),
      device_name: this.getDeviceName(userAgent),
      is_trusted: true,
      first_seen_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    });

    if (deviceError) {
      console.error('Failed to register device:', deviceError);
    }

    // Create session
    const sessionExpiry = new Date();
    sessionExpiry.setDate(sessionExpiry.getDate() + 30); // 30 days

    const { error: sessionError } = await supabase.from('device_sessions').insert({
      user_id: userId,
      device_id: deviceId,
      device_type: this.detectDeviceType(userAgent),
      device_name: this.getDeviceName(userAgent),
      ip_address: await this.getIpAddress(),
      user_agent: userAgent,
      location: deviceInfo?.viewport || {},
      status: 'active',
      last_active_at: new Date().toISOString(),
      expires_at: sessionExpiry.toISOString(),
    });

    if (sessionError) {
      console.error('Failed to create session:', sessionError);
    }
  }

  private generateDeviceId(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const raw = `${userAgent}-${platform}-${language}-${timezone}`;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return `device_${Math.abs(hash).toString(16)}`;
  }

  private detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const ua = userAgent.toLowerCase();

    if (ua.includes('tablet') || (ua.includes('ipad') && !ua.includes('iphone'))) {
      return 'tablet';
    }

    if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
      return 'mobile';
    }

    return 'desktop';
  }

  private getDeviceName(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (ua.includes('iphone')) return 'iPhone';
    if (ua.includes('ipad')) return 'iPad';
    if (ua.includes('android')) return 'Android Device';
    if (ua.includes('windows')) return 'Windows PC';
    if (ua.includes('mac')) return 'Mac';
    if (ua.includes('linux')) return 'Linux PC';

    return 'Unknown Device';
  }

  private async getIpAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
      return '0.0.0.0';
    }
  }

  private getDeviceInfo(): any {
    const stored = localStorage.getItem('fee_device_info');
    return stored ? JSON.parse(stored) : null;
  }

  public async updateUser(data: Partial<any>): Promise<any> {
    if (!this.currentUser) {
      throw new Error('User not synced');
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.currentUser.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    this.currentUser = updatedUser;
    return updatedUser;
  }

  public async updateProfile(data: Partial<any>): Promise<any> {
    if (!this.currentUser) {
      throw new Error('User not synced');
    }

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', this.currentUser.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return updatedProfile;
  }

  public async updateAvatar(avatarUrl: string): Promise<void> {
    await this.updateProfile({
      avatar_url: avatarUrl,
    });
  }

  public async updateUsername(username: string): Promise<void> {
    await this.updateUser({
      username,
    });
  }

  public getCurrentUser(): any {
    return this.currentUser;
  }

  public async refreshUser(): Promise<any> {
    if (!this.currentUser) {
      return this.syncUser();
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', this.currentUser.id)
      .single();

    if (error) {
      throw error;
    }

    this.currentUser = data;
    return data;
  }

  public async isPremium(): Promise<boolean> {
    const user = telegramSDK.getUser();
    return user?.is_premium || false;
  }

  public async getLanguageCode(): Promise<string> {
    const user = telegramSDK.getUser();
    return user?.language_code || 'en';
  }

  public async getColorScheme(): Promise<'light' | 'dark'> {
    return telegramSDK.isDarkMode() ? 'dark' : 'light';
  }

  public async getViewportInfo(): Promise<any> {
    return {
      height: telegramSDK.getViewportHeight(),
      stableHeight: telegramSDK.getViewportStableHeight(),
      width: window.innerWidth,
    };
  }

  public async getSafeAreaInsets(): Promise<any> {
    return (telegramSDK.getWebApp() as any)?.safeAreaInsets || {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }
}

// Singleton instance
export const userSyncService = UserSyncService.getInstance();