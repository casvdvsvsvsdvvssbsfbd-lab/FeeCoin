// Shared Types
// Common type definitions used across multiple features

export type { Database } from '@/types/supabase'

export interface ApiResponse<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}