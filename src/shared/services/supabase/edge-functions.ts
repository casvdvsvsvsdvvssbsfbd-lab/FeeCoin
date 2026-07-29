import { supabase } from './client'
import { logger } from './logger'

type EdgeFunctionOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
}

class EdgeFunctionsService {
  async invoke<T = any>(
    functionName: string,
    options: EdgeFunctionOptions = {}
  ): Promise<{ data: T | null; error: any }> {
    try {
      const { method = 'POST', headers = {}, body } = options

      logger.info(`Invoking edge function: ${functionName}`)

      const { data, error } = await supabase.functions.invoke(functionName, {
        method,
        headers,
        body,
      })

      if (error) {
        logger.error(`Edge function ${functionName} failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Edge function ${functionName} succeeded`)
      return { data, error: null }
    } catch (error) {
      logger.error(`Edge function ${functionName} error:`, error)
      return { data: null, error }
    }
  }

  async invokeWithAuth<T = any>(
    functionName: string,
    options: EdgeFunctionOptions = {},
    accessToken: string
  ): Promise<{ data: T | null; error: any }> {
    try {
      const { method = 'POST', headers = {}, body } = options

      logger.info(`Invoking edge function with auth: ${functionName}`)

      const { data, error } = await supabase.functions.invoke(functionName, {
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      })

      if (error) {
        logger.error(`Edge function ${functionName} failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Edge function ${functionName} succeeded`)
      return { data, error: null }
    } catch (error) {
      logger.error(`Edge function ${functionName} error:`, error)
      return { data: null, error }
    }
  }
}

export const edgeFunctions = new EdgeFunctionsService()

export type { EdgeFunctionOptions }