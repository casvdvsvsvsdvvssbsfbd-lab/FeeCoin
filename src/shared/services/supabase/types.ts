export type { Database } from '@/types/supabase'

export interface SupabaseServiceOptions {
  enabled?: boolean
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
}

export interface QueryOptions {
  table: string
  filter?: Record<string, any>
  order?: { column: string; ascending?: boolean }
  limit?: number
  offset?: number
}

export interface InsertOptions {
  table: string
  data: any
}

export interface UpdateOptions {
  table: string
  data: any
  filter: Record<string, any>
}

export interface DeleteOptions {
  table: string
  filter: Record<string, any>
}

export interface UploadOptions {
  bucket: string
  path: string
  file: File | Blob
  contentType?: string
  cacheControl?: string
  upsert?: boolean
}

export interface DownloadOptions {
  bucket: string
  path: string
  transform?: {
    width?: number
    height?: number
    resize?: 'cover' | 'contain' | 'fill'
    format?: 'origin' | 'avif' | 'webp'
    quality?: number
  }
}

export interface RealtimeOptions {
  channelName: string
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  callback: (payload: any) => void
}

export interface EdgeFunctionOptions {
  functionName: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
}

export interface AuthOptions {
  email: string
  password: string
  metadata?: Record<string, any>
}

export interface OAuthProviderOptions {
  provider: 'google' | 'github' | 'gitlab' | 'bitbucket' | 'facebook' | 'twitter' | 'apple'
  redirectTo?: string
  scopes?: string
}

export interface PolicyOptions {
  name: string
  table: string
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  using?: string
  check?: string
  description?: string
}

export interface PaginationQueryOptions {
  page: number
  limit: number
  filter?: Record<string, any>
  order?: { column: string; ascending?: boolean }
}