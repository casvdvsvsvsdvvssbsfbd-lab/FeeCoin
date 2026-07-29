import { supabase, adminClient } from './index'
import { logger } from './logger'

type RLSOptions = {
  table: string
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  condition: string
  role?: 'authenticated' | 'anon' | 'service_role'
}

type PolicyOptions = {
  name: string
  table: string
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  using?: string
  check?: string
  description?: string
}

class RLSService {
  async enableRLS(table: string): Promise<{ success: boolean; error: any }> {
    try {
      logger.info(`Enabling RLS on table: ${table}`)

      const { error } = await ((adminClient as any).rpc('exec_sql', {
        sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`,
      }) as any)

      if (error) {
        logger.error(`Enable RLS failed: ${error.message}`)
        return { success: false, error }
      }

      logger.info(`Enable RLS successful: ${table}`)
      return { success: true, error: null }
    } catch (error) {
      logger.error('Enable RLS error:', error)
      return { success: false, error }
    }
  }

  async disableRLS(table: string): Promise<{ success: boolean; error: any }> {
    try {
      logger.info(`Disabling RLS on table: ${table}`)

      const { error } = await ((adminClient as any).rpc('exec_sql', {
        sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`,
      }) as any)

      if (error) {
        logger.error(`Disable RLS failed: ${error.message}`)
        return { success: false, error }
      }

      logger.info(`Disable RLS successful: ${table}`)
      return { success: true, error: null }
    } catch (error) {
      logger.error('Disable RLS error:', error)
      return { success: false, error }
    }
  }

  async createPolicy(options: PolicyOptions): Promise<{ success: boolean; error: any }> {
    try {
      logger.info(`Creating policy: ${options.name} on ${options.table}`)

      let sql = `CREATE POLICY ${options.name} ON ${options.table} FOR ${options.operation}`

      if (options.using) {
        sql += ` USING (${options.using})`
      }

      if (options.check) {
        sql += ` WITH CHECK (${options.check})`
      }

      if (options.description) {
        sql += `; COMMENT ON POLICY ${options.name} ON ${options.table} IS '${options.description}';`
      } else {
        sql += ';'
      }

      const { error } = await ((adminClient as any).rpc('exec_sql', { sql }) as any)

      if (error) {
        logger.error(`Create policy failed: ${error.message}`)
        return { success: false, error }
      }

      logger.info(`Create policy successful: ${options.name}`)
      return { success: true, error: null }
    } catch (error) {
      logger.error('Create policy error:', error)
      return { success: false, error }
    }
  }

  async dropPolicy(name: string, table: string): Promise<{ success: boolean; error: any }> {
    try {
      logger.info(`Dropping policy: ${name} from ${table}`)

      const { error } = await ((adminClient as any).rpc('exec_sql', {
        sql: `DROP POLICY IF EXISTS ${name} ON ${table};`,
      }) as any)

      if (error) {
        logger.error(`Drop policy failed: ${error.message}`)
        return { success: false, error }
      }

      logger.info(`Drop policy successful: ${name}`)
      return { success: true, error: null }
    } catch (error) {
      logger.error('Drop policy error:', error)
      return { success: false, error }
    }
  }

  async listPolicies(table: string): Promise<{ data: any[] | null; error: any }> {
    try {
      logger.info(`Listing policies for table: ${table}`)

      const { data, error } = await adminClient
        .from('pg_policies')
        .select('*')
        .eq('tablename', table)

      if (error) {
        logger.error(`List policies failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`List policies successful: ${data?.length || 0} policies`)
      return { data: data || [], error: null }
    } catch (error) {
      logger.error('List policies error:', error)
      return { data: null, error }
    }
  }

  async checkAccess(options: RLSOptions): Promise<{ allowed: boolean; error: any }> {
    try {
      logger.info(`Checking access: ${options.operation} on ${options.table}`)

      let query: any = (supabase as any).from(options.table)

      switch (options.operation) {
        case 'SELECT':
          query = query.select('*').limit(1)
          break
        case 'INSERT':
          query = query.insert({}).select()
          break
        case 'UPDATE':
          query = query.update({}).eq('id', '00000000-0000-0000-0000-000000000000')
          break
        case 'DELETE':
          query = query.delete().eq('id', '00000000-0000-0000-0000-000000000000')
          break
      }

      const { error } = await query

      if (error) {
        logger.error(`Access check failed: ${error.message}`)
        return { allowed: false, error }
      }

      logger.info(`Access check successful: ${options.operation} on ${options.table}`)
      return { allowed: true, error: null }
    } catch (error) {
      logger.error('Access check error:', error)
      return { allowed: false, error }
    }
  }

  async grantAccess(
    table: string,
    role: string,
    grants: string[]
  ): Promise<{ success: boolean; error: any }> {
    try {
      logger.info(`Granting access on ${table} to ${role}`)

      const grantsSql = grants.join(', ')
      const { error } = await ((adminClient as any).rpc('exec_sql', {
        sql: `GRANT ${grantsSql} ON ${table} TO ${role};`,
      }) as any)

      if (error) {
        logger.error(`Grant access failed: ${error.message}`)
        return { success: false, error }
      }

      logger.info(`Grant access successful: ${table} to ${role}`)
      return { success: true, error: null }
    } catch (error) {
      logger.error('Grant access error:', error)
      return { success: false, error }
    }
  }

  async revokeAccess(
    table: string,
    role: string,
    grants: string[]
  ): Promise<{ success: boolean; error: any }> {
    try {
      logger.info(`Revoking access on ${table} from ${role}`)

      const grantsSql = grants.join(', ')
      const { error } = await ((adminClient as any).rpc('exec_sql', {
        sql: `REVOKE ${grantsSql} ON ${table} FROM ${role};`,
      }) as any)

      if (error) {
        logger.error(`Revoke access failed: ${error.message}`)
        return { success: false, error }
      }

      logger.info(`Revoke access successful: ${table} from ${role}`)
      return { success: true, error: null }
    } catch (error) {
      logger.error('Revoke access error:', error)
      return { success: false, error }
    }
  }
}

export const rls = new RLSService()

export type { RLSOptions, PolicyOptions }