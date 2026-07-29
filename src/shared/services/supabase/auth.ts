import { supabase, adminClient } from './index'
import { logger } from './logger'
import { handleSupabaseError } from './error-handler'

type AuthUser = {
  id: string
  email?: string
  phone?: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
}

type AuthSession = {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: AuthUser
}

type SignUpOptions = {
  email: string
  password: string
  metadata?: Record<string, any>
}

type SignInOptions = {
  email: string
  password: string
}

type OAuthOptions = {
  provider: 'google' | 'github' | 'gitlab' | 'bitbucket' | 'facebook' | 'twitter' | 'apple'
  redirectTo?: string
  scopes?: string
}

class AuthService {
  async signUp(options: SignUpOptions): Promise<{ data: AuthUser | null; error: any }> {
    try {
      logger.info(`Signing up user: ${options.email}`)

      const { data, error } = await supabase.auth.signUp({
        email: options.email,
        password: options.password,
        options: {
          data: options.metadata,
        },
      })

      if (error) {
        logger.error(`Sign up failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      logger.info(`Sign up successful: ${data.user?.id}`)
      return { data: data.user as AuthUser, error: null }
    } catch (error) {
      logger.error('Sign up error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async signIn(options: SignInOptions): Promise<{ data: AuthSession | null; error: any }> {
    try {
      logger.info(`Signing in user: ${options.email}`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: options.email,
        password: options.password,
      })

      if (error) {
        logger.error(`Sign in failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      logger.info(`Sign in successful: ${data.user?.id}`)
      return { data: data.session as AuthSession, error: null }
    } catch (error) {
      logger.error('Sign in error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async signOut(): Promise<{ error: any }> {
    try {
      logger.info('Signing out user')

      const { error } = await supabase.auth.signOut()

      if (error) {
        logger.error(`Sign out failed: ${error.message}`)
        return { error: handleSupabaseError(error) }
      }

      logger.info('Sign out successful')
      return { error: null }
    } catch (error) {
      logger.error('Sign out error:', error)
      return { error: handleSupabaseError(error) }
    }
  }

  async getSession(): Promise<{ data: AuthSession | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        logger.error(`Get session failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      return { data: data.session as AuthSession, error: null }
    } catch (error) {
      logger.error('Get session error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async getUser(): Promise<{ data: AuthUser | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        logger.error(`Get user failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      return { data: data.user as AuthUser, error: null }
    } catch (error) {
      logger.error('Get user error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async updateUser(updates: {
    email?: string
    password?: string
    metadata?: Record<string, any>
  }): Promise<{ data: AuthUser | null; error: any }> {
    try {
      logger.info('Updating user')

      const { data, error } = await supabase.auth.updateUser({
        email: updates.email,
        password: updates.password,
        data: updates.metadata,
      })

      if (error) {
        logger.error(`Update user failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      logger.info('Update user successful')
      return { data: data.user as AuthUser, error: null }
    } catch (error) {
      logger.error('Update user error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async resetPassword(email: string): Promise<{ error: any }> {
    try {
      logger.info(`Resetting password for: ${email}`)

      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        logger.error(`Reset password failed: ${error.message}`)
        return { error: handleSupabaseError(error) }
      }

      logger.info('Reset password successful')
      return { error: null }
    } catch (error) {
      logger.error('Reset password error:', error)
      return { error: handleSupabaseError(error) }
    }
  }

  async oauthSignIn(options: OAuthOptions): Promise<{ data: any; error: any }> {
    try {
      logger.info(`OAuth sign in with: ${options.provider}`)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: options.provider,
        options: {
          redirectTo: options.redirectTo,
          scopes: options.scopes,
        },
      })

      if (error) {
        logger.error(`OAuth sign in failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      logger.info(`OAuth sign in successful: ${options.provider}`)
      return { data, error: null }
    } catch (error) {
      logger.error('OAuth sign in error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async adminCreateUser(options: {
    email: string
    password: string
    metadata?: Record<string, any>
  }): Promise<{ data: AuthUser | null; error: any }> {
    try {
      logger.info(`Admin creating user: ${options.email}`)

      const { data, error } = await adminClient.auth.admin.createUser({
        email: options.email,
        password: options.password,
        user_metadata: options.metadata,
      })

      if (error) {
        logger.error(`Admin create user failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      logger.info(`Admin create user successful: ${data.user?.id}`)
      return { data: data.user as AuthUser, error: null }
    } catch (error) {
      logger.error('Admin create user error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  async adminDeleteUser(userId: string): Promise<{ error: any }> {
    try {
      logger.info(`Admin deleting user: ${userId}`)

      const { error } = await adminClient.auth.admin.deleteUser(userId)

      if (error) {
        logger.error(`Admin delete user failed: ${error.message}`)
        return { error: handleSupabaseError(error) }
      }

      logger.info('Admin delete user successful')
      return { error: null }
    } catch (error) {
      logger.error('Admin delete user error:', error)
      return { error: handleSupabaseError(error) }
    }
  }

  async adminListUsers(options?: {
    page?: number
    perPage?: number
  }): Promise<{ data: AuthUser[] | null; error: any }> {
    try {
      logger.info('Admin listing users')

      const { data, error } = await adminClient.auth.admin.listUsers({
        page: options?.page || 1,
        perPage: options?.perPage || 50,
      })

      if (error) {
        logger.error(`Admin list users failed: ${error.message}`)
        return { data: null, error: handleSupabaseError(error) }
      }

      logger.info(`Admin list users successful: ${data.users?.length || 0} users`)
      return { data: data.users as AuthUser[], error: null }
    } catch (error) {
      logger.error('Admin list users error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  }
}

export const auth = new AuthService()

export type { AuthUser, AuthSession, SignUpOptions, SignInOptions, OAuthOptions }