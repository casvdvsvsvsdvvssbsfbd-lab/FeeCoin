import { createClient } from '@supabase/supabase-js'
import { getEnvConfig } from './env-validation'

const env = getEnvConfig()

export const adminClient = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export type AdminSupabaseClient = typeof adminClient
