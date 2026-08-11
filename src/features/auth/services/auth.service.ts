// Auth Feature - Service Layer
// Handles all authentication business logic

import { supabase } from '@/lib/supabase/client'
import { telegramService } from '@/lib/telegram/telegram.service'
import { authenticateWithTelegram } from '@/lib/telegram/init-data-auth'
import type { User, LoginCredentials, AuthError } from '../types'
import { AUTH_CONFIG } from '../constants/config'

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Prefer server-validated Telegram auth (Edge Function) when possible.
      // This validates initData HMAC-SHA256 server-side and returns a
      // matching Supabase user (auto-created/found by telegram_id).
      const profile = await authenticateWithTelegram();

      return {
        id: profile.userId,
        telegram_id: String(profile.telegramId),
        username: profile.username,
        first_name: profile.firstName,
        last_name: profile.lastName,
        photo_url: null,
        created_at: '',
        updated_at: '',
      };
    } catch (error) {
      // Fallback: legacy local initData path (dev-only compatibility).
      try {
        const initData = telegramService.getInitData()

        if (!initData || !initData.user) {
          throw this.handleError({
            code: 'NO_TELEGRAM_DATA',
            message: 'Telegram initialization data not found',
          })
        }

        const telegramUser = initData.user

        const { data, error } = await supabase.auth.signInWithPassword({
          email: `telegram_${telegramUser.id}@telegram.user`,
          password: credentials.telegram_token,
        })

        if (error) {
          throw this.handleError({
            code: error.code || 'AUTH_ERROR',
            message: error.message || 'Telegram authentication failed',
          })
        }

        if (!data.user) {
          throw this.handleError({
            code: 'NO_USER',
            message: 'Authentication failed',
          })
        }

        await supabase.auth.updateUser({
          data: {
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.firstName,
            last_name: telegramUser.lastName,
            photo_url: telegramUser.photoUrl,
            is_premium: telegramUser.isPremium,
            language_code: telegramUser.languageCode,
          },
        })

        return this.mapSupabaseUser(data.user)
      } catch (innerError) {
        throw this.handleError(innerError as AuthError);
      }
    }
  },

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw this.handleError(error)
      }
    } catch (error) {
      throw this.handleError(error as AuthError)
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser()
      
      if (error || !data.user) {
        return null
      }

      return this.mapSupabaseUser(data.user)
    } catch (error) {
      console.error('Error fetching current user:', error)
      return null
    }
  },

  async refreshToken(): Promise<string | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error || !data.session) {
        return null
      }

      return data.session.access_token
    } catch (error) {
      console.error('Error refreshing token:', error)
      return null
    }
  },

  mapSupabaseUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      telegram_id: supabaseUser.user_metadata?.telegram_id || '',
      username: supabaseUser.user_metadata?.username || '',
      first_name: supabaseUser.user_metadata?.first_name || '',
      last_name: supabaseUser.user_metadata?.last_name || '',
      photo_url: supabaseUser.user_metadata?.photo_url || null,
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at || supabaseUser.created_at,
    }
  },

  handleError(error: any): AuthError {
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
    }
  },
}