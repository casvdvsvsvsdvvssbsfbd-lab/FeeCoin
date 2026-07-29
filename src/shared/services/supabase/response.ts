export type ApiResponse<T = any> = {
  data: T | null
  error: any
  success: boolean
  message?: string
}

export type PaginatedResponse<T = any> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  success: boolean
  error: any
  message?: string
}

export function formatResponse<T = any>(
  data: T | null,
  error: any = null,
  message?: string
): ApiResponse<T> {
  return {
    data,
    error,
    success: !error,
    message,
  }
}

export function formatPaginatedResponse<T = any>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  error: any = null,
  message?: string
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    success: !error,
    error,
    message,
  }
}

export function formatSuccess<T = any>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    error: null,
    success: true,
    message,
  }
}

export function formatError(error: any, message?: string): ApiResponse<null> {
  return {
    data: null,
    error,
    success: false,
    message: message || error?.message || 'An error occurred',
  }
}