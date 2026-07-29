import { supabase, adminClient } from './index'
import { logger } from './logger'

type QueryBuilderOptions<T = any> = {
  table: string
  select?: string[]
  filter?: Record<string, any>
  order?: { column: string; ascending?: boolean }
  limit?: number
  offset?: number
}

class QueryBuilder {
  private client: typeof supabase
  private options: QueryBuilderOptions

  constructor(options: QueryBuilderOptions, useAdmin = false) {
    this.options = options
    this.client = useAdmin ? adminClient : supabase
  }

  build() {
    const client = this.client as any
    let query = client.from(this.options.table)

    if (this.options.select) {
      query = query.select(this.options.select.join(','))
    }

    if (this.options.filter) {
      Object.entries(this.options.filter).forEach(([key, value]) => {
        if (value === null) {
          query = query.is(key, null)
        } else if (Array.isArray(value)) {
          query = query.in(key, value)
        } else if (typeof value === 'object' && value !== null) {
          if (value.gt !== undefined) query = query.gt(key, value.gt)
          if (value.gte !== undefined) query = query.gte(key, value.gte)
          if (value.lt !== undefined) query = query.lt(key, value.lt)
          if (value.lte !== undefined) query = query.lte(key, value.lte)
          if (value.neq !== undefined) query = query.neq(key, value.neq)
          if (value.like !== undefined) query = query.like(key, value.like)
          if (value.ilike !== undefined) query = query.ilike(key, value.ilike)
        } else {
          query = query.eq(key, value)
        }
      })
    }

    if (this.options.order) {
      query = query.order(this.options.order.column, {
        ascending: this.options.order.ascending ?? true,
      })
    }

    if (this.options.limit) {
      query = query.limit(this.options.limit)
    }

    if (this.options.offset) {
      query = query.range(this.options.offset, this.options.offset + (this.options.limit || 10) - 1)
    }

    return query
  }

  async execute<T = any>(): Promise<{ data: T[] | null; error: any }> {
    try {
      logger.info(`Executing query on ${this.options.table}`)
      const query = this.build() as any
      const { data, error } = await query

      if (error) {
        logger.error(`Query failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Query successful: ${data?.length || 0} results`)
      return { data: data as T[], error: null }
    } catch (error) {
      logger.error('Query error:', error)
      return { data: null, error }
    }
  }
}

export const queryBuilder = {
  create: <T = any>(options: QueryBuilderOptions<T>, useAdmin = false) => {
    return new QueryBuilder(options, useAdmin)
  },
}

export type { QueryBuilderOptions }