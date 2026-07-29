// Auth Feature - Login Form Component
// Telegram authentication component

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/use-auth'
import { telegramService } from '@/lib/telegram/telegram.service'
import { Button } from '../../../shared/components/ui/button/button'

export function LoginForm() {
  const { login, isLoading, isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize Telegram service
    const initTelegram = async () => {
      await telegramService.initialize()
      setIsInitialized(true)
    }
    initTelegram()
  }, [])

  const handleTelegramLogin = async () => {
    try {
      setError(null)

      if (!isInitialized) {
        throw new Error('Telegram not initialized')
      }

      // Get Telegram init data
      const initData = telegramService.getInitData()
      
      if (!initData || !initData.user) {
        throw new Error('Telegram user data not found')
      }

      // Use the auth hash as the token
      // In production, this would be validated server-side
      await login({
        telegram_token: initData.hash,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  // If already authenticated, don't show login form
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        onClick={handleTelegramLogin}
        isLoading={isLoading || !isInitialized}
        disabled={!isInitialized}
        className="w-full"
      >
        Login with Telegram
      </Button>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
