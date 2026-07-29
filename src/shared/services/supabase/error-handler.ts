export interface SupabaseError {
  code: string
  message: string
  details?: string
  hint?: string
  status?: number
  originalError?: Error
}

export function handleSupabaseError(error: any): SupabaseError {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    }
  }

  const supabaseError = error as {
    code?: string
    message?: string
    details?: string
    hint?: string
    status?: number
  }

  return {
    code: supabaseError.code || 'UNKNOWN_ERROR',
    message: supabaseError.message || 'An error occurred',
    details: supabaseError.details,
    hint: supabaseError.hint,
    status: supabaseError.status,
    originalError: error instanceof Error ? error : new Error(JSON.stringify(error)),
  }
}

export function isSupabaseError(error: any): error is SupabaseError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error
}

export function getErrorMessage(error: any): string {
  if (isSupabaseError(error)) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unknown error occurred'
}