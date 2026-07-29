// Auth Feature Types

export interface User {
  id: string
  telegram_id: string
  username: string
  first_name: string
  last_name: string
  photo_url: string | null
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  telegram_token: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export type AuthError = {
  code: string
  message: string
}