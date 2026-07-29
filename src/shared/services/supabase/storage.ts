import { supabase, adminClient } from './index'
import { logger } from './logger'

type StorageOptions = {
  bucket: string
  path?: string
  contentType?: string
  cacheControl?: string
  upsert?: boolean
}

type UploadOptions = {
  bucket: string
  path: string
  file: File | Blob
  contentType?: string
  cacheControl?: string
  upsert?: boolean
}

type DownloadOptions = {
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

class StorageService {
  async upload(options: UploadOptions): Promise<{ data: any; error: any }> {
    try {
      const { bucket, path, file, contentType, cacheControl, upsert } = options

      logger.info(`Uploading file to ${bucket}/${path}`)

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType,
          cacheControl,
          upsert,
        })

      if (error) {
        logger.error(`Upload failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Upload successful: ${data?.path}`)
      return { data, error: null }
    } catch (error) {
      logger.error('Upload error:', error)
      return { data: null, error }
    }
  }

  async download(options: DownloadOptions): Promise<{ data: Blob | null; error: any }> {
    try {
      const { bucket, path, transform } = options

      logger.info(`Downloading file from ${bucket}/${path}`)

      let url = supabase.storage.from(bucket).getPublicUrl(path)

      if (transform) {
        url = supabase.storage.from(bucket).getPublicUrl(path, {
          transform: {
            width: transform.width,
            height: transform.height,
            resize: transform.resize,
            format: transform.format as any,
            quality: transform.quality,
          },
        })
      }

      const response = await fetch(url.data.publicUrl)
      const blob = await response.blob()

      logger.info(`Download successful: ${path}`)
      return { data: blob, error: null }
    } catch (error) {
      logger.error('Download error:', error)
      return { data: null, error }
    }
  }

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async delete(bucket: string, paths: string[]): Promise<{ data: any; error: any }> {
    try {
      logger.info(`Deleting files from ${bucket}: ${paths.join(', ')}`)

      const { data, error } = await supabase.storage.from(bucket).remove(paths)

      if (error) {
        logger.error(`Delete failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Delete successful`)
      return { data, error: null }
    } catch (error) {
      logger.error('Delete error:', error)
      return { data: null, error }
    }
  }

  async list(
    bucket: string,
    options?: {
      path?: string
      limit?: number
      offset?: number
      sortBy?: { column: string; order: 'asc' | 'desc' }
    }
  ): Promise<{ data: any[]; error: any }> {
    try {
      logger.info(`Listing files in ${bucket}`)

      const { data, error } = await supabase.storage.from(bucket).list(options?.path || '', {
        limit: options?.limit || 100,
        offset: options?.offset || 0,
        sortBy: options?.sortBy || { column: 'name', order: 'asc' },
      })

      if (error) {
        logger.error(`List failed: ${error.message}`)
        return { data: [], error }
      }

      logger.info(`List successful: ${data?.length || 0} files`)
      return { data: data || [], error: null }
    } catch (error) {
      logger.error('List error:', error)
      return { data: [], error }
    }
  }

  async createSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<{ data: { signedUrl: string } | null; error: any }> {
    try {
      logger.info(`Creating signed URL for ${bucket}/${path}`)

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) {
        logger.error(`Create signed URL failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Signed URL created`)
      return { data, error: null }
    } catch (error) {
      logger.error('Create signed URL error:', error)
      return { data: null, error }
    }
  }

  async createSignedUploadUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<{ data: { signedUrl: string; path: string } | null; error: any }> {
    try {
      logger.info(`Creating signed upload URL for ${bucket}/${path}`)

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(path, { upsert: false } as any)

      if (error) {
        logger.error(`Create signed upload URL failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Signed upload URL created`)
      return { data, error: null }
    } catch (error) {
      logger.error('Create signed upload URL error:', error)
      return { data: null, error }
    }
  }

  async move(
    fromBucket: string,
    fromPath: string,
    toBucket: string,
    toPath: string
  ): Promise<{ data: any; error: any }> {
    try {
      logger.info(`Moving file from ${fromBucket}/${fromPath} to ${toBucket}/${toPath}`)

      const { data, error } = await supabase.storage
        .from(fromBucket)
        .move(fromPath, `${toBucket}/${toPath}`)

      if (error) {
        logger.error(`Move failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Move successful`)
      return { data, error: null }
    } catch (error) {
      logger.error('Move error:', error)
      return { data: null, error }
    }
  }

  async copy(
    fromBucket: string,
    fromPath: string,
    toBucket: string,
    toPath: string
  ): Promise<{ data: any; error: any }> {
    try {
      logger.info(`Copying file from ${fromBucket}/${fromPath} to ${toBucket}/${toPath}`)

      const { data, error } = await supabase.storage
        .from(fromBucket)
        .copy(fromPath, `${toBucket}/${toPath}`)

      if (error) {
        logger.error(`Copy failed: ${error.message}`)
        return { data: null, error }
      }

      logger.info(`Copy successful`)
      return { data, error: null }
    } catch (error) {
      logger.error('Copy error:', error)
      return { data: null, error }
    }
  }
}

export const storage = new StorageService()

export type { StorageOptions, UploadOptions, DownloadOptions }