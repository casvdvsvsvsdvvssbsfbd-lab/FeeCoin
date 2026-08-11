import { supabase, adminClient } from './index'

export const db = {
  select: <T = any>(
    table: string,
    options?: {
      columns?: string[]
      filter?: Record<string, any>
      order?: { column: string; ascending?: boolean }
      limit?: number
      offset?: number
    }
  ) => {
    let query = (supabase as any).from(table).select(options?.columns?.join(',') || '*')

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options?.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending ?? true,
      })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    return query
  },

  insert: <T = any>(
    table: string,
    data: T
  ) => {
    const client = supabase as any
    return client.from(table).insert(data)
  },

  update: <T = any>(
    table: string,
    data: T,
    filter: Record<string, any>
  ) => {
    const q = (supabase as any).from(table)
    let query = q.update(data as any)

    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    return query
  },

  delete: (
    table: string,
    filter: Record<string, any>
  ) => {
    let query = (supabase as any).from(table).delete()

    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    return query
  },

  upsert: <T = any>(
    table: string,
    data: T[]
  ) => {
    const client = supabase as any
    return client.from(table).upsert(data)
  },

  rpc: <T = any>(
    fn: string,
    params?: Record<string, any>
  ) => {
    const client = supabase as any
    return client.rpc(fn, params) as unknown as Promise<{ data: T | null; error: any }>
  },

  admin: {
    select: <T = any>(
      table: string,
      options?: {
        columns?: string[]
        filter?: Record<string, any>
        order?: { column: string; ascending?: boolean }
        limit?: number
        offset?: number
      }
    ) => {
      let query = adminClient.from(table).select(options?.columns?.join(',') || '*')

      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      if (options?.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        })
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      return query
    },

    insert: <T = any>(
      table: string,
      data: T
    ) => {
      const client = adminClient as any
      return client.from(table).insert(data)
    },

    update: <T = any>(
      table: string,
      data: T,
      filter: Record<string, any>
    ) => {
      const q = (adminClient as any).from(table)
      let query = q.update(data as any)

      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })

      return query
    },

    delete: (
      table: string,
      filter: Record<string, any>
    ) => {
      let query = adminClient.from(table).delete()

      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })

      return query
    },
  },
}