// Auth Feature - Custom Hook
// Provides authentication state and methods

import { useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth.service'
import type { User, AuthState, LoginCredentials } from '../types'

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        setState({
          user,
          isLoading: false,
          isAuthenticated: !!user,
        })
      } catch (error) {
        console.error('Auth check failed:', error)
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev: AuthState) => ({ ...prev, isLoading: true }))
    
    try {
      const user = await authService.login(credentials)
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
      return user
    } catch (error) {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    setState((prev: AuthState) => ({ ...prev, isLoading: true }))
    
    try {
      await authService.logout()
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  return {
    ...state,
    login,
    logout,
  }
}