type PaginationOptions = {
  page: number
  limit: number
}

type PaginatedResult<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

class PaginationService {
  calculateOffset(options: PaginationOptions): number {
    return (options.page - 1) * options.limit
  }

  calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit)
  }

  hasNextPage(page: number, totalPages: number): boolean {
    return page < totalPages
  }

  hasPreviousPage(page: number): boolean {
    return page > 1
  }

  async paginate<T = any>(
    query: any,
    options: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    try {
      const offset = this.calculateOffset(options)
      
      const countQuery = query
      const { count } = await countQuery

      const dataQuery = query.range(offset, offset + options.limit - 1)
      const { data, error } = await dataQuery

      if (error) {
        throw error
      }

      const total = count || 0
      const totalPages = this.calculateTotalPages(total, options.limit)

      return {
        data: data as T[],
        total,
        page: options.page,
        limit: options.limit,
        totalPages,
        hasNextPage: this.hasNextPage(options.page, totalPages),
        hasPreviousPage: this.hasPreviousPage(options.page),
      }
    } catch (error) {
      throw error
    }
  }
}

export const pagination = new PaginationService()

export type { PaginationOptions, PaginatedResult }