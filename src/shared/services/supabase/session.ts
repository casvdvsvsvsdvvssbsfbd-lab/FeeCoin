import { supabase, adminClient } from './index'
import { logger } from './logger'
import { handleSupabaseError } from './error-handler'

type SessionData = {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: {
    id: string
    email?: string
    phone?: string
    user_metadata?: Record<string, any>
  }
}

class SessionService {
  async getSession(): Promise<{ data: SessionData | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        logger.error(`Get session failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      if (!data.session) {
        return { data: null, error: null }
      }

      return {
        data: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at,
          token_type: data.session.token_type,
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            phone: data.session.user.phone,
            user_metadata: data.session.user.user_metadata,
          },
        },
        error: null,
      }
    } catch (error) {
      logger.error('Get session error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async refreshSession(): Promise<{ data: SessionData | null; error: any }> {
    try {
      logger.info('Refreshing session')

      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        logger.error(`Refresh session failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      if (!data.session) {
        return { data: null, error: null }
      }

      logger.info('Refresh session successful')
      return {
        data: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at,
          token_type: data.session.token_type,
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            phone: data.session.user.phone,
            user_metadata: data.session.user.user_metadata,
          },
        },
        error: null,
      }
    } catch (error) {
      logger.error('Refresh session error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async setSession(accessToken: string, refreshToken: string): Promise<{ data: SessionData | null; error: any }> {
    try {
      logger.info('Setting session')

      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (error) {
        logger.error(`Set session failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      if (!data.session) {
        return { data: null, error: null }
      }

      logger.info('Set session successful')
      return {
        data: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at,
          token_type: data.session.token_type,
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            phone: data.session.user.phone,
            user_metadata: data.session.user.user_metadata,
          },
        },
        error: null,
      }
    } catch (error) {
      logger.error('Set session error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async getUserFromSession(accessToken: string): Promise<{ data: any | null; error: any }> {
    try {
      logger.info('Getting user from session')

      const { data, error } = await supabase.auth.getUser(accessToken)

      if (error) {
        logger.error(`Get user from session failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      logger.info('Get user from session successful')
      return { data: data.user, error: null }
    } catch (error) {
      logger.error('Get user from session error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async adminGetSession(refreshToken: string): Promise<{ data: SessionData | null; error: any }> {
    try {
      logger.info('Admin getting session')

      const { data, error } = await (adminClient.auth.admin as any).getSession(refreshToken)

      if (error) {
        logger.error(`Admin get session failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      if (!data.session) {
        return { data: null, error: null }
      }

      logger.info('Admin get session successful')
      return {
        data: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at,
          token_type: data.session.token_type,
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            phone: data.session.user.phone,
            user_metadata: data.session.user.user_metadata,
          },
        },
        error: null,
      }
    } catch (error) {
      logger.error('Admin get session error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  isSessionValid(session: SessionData | null): boolean {
    if (!session) return false

    const now = Math.floor(Date.now() / 1000)
    const expiresAt = session.expires_at || (session.expires_in + Math.floor(Date.now() / 1000))

    return now < expiresAt
  }

  getTimeUntilExpiry(session: SessionData | null): number {
    if (!session) return 0

    const now = Math.floor(Date.now() / 1000)
    const expiresAt = session.expires_at || (session.expires_in + now)

    return Math.max(0, expiresAt - now)
  }
}

export const session = new SessionService()

export type { SessionData }