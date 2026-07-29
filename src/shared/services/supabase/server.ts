import { createClient } from '@supabase/supabase-js'
import { getEnvConfig } from './env-validation'

const env = getEnvConfig()

export const serverClient = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export type ServerSupabaseClient = typeof serverClient
