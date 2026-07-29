// Auth Feature - Public API
// This file exports the public API for the auth feature

export { LoginForm } from './components/login-form'
export { useAuth } from './hooks/use-auth'
export { authService } from './services/auth.service'
export type { User, LoginCredentials, AuthState } from './types'

// Re-export constants
export { AUTH_CONFIG } from './constants/config'