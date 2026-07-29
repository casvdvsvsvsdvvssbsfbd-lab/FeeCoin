import { supabase } from './client'
import { logger } from './logger'
import type { RealtimeChannel } from '@supabase/supabase-js'

type RealtimeChannelOptions = {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  schema?: string
  table: string
  filter?: string
}

type SubscriptionCallback = (payload: any) => void

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()

  subscribe<T = any>(
    channelName: string,
    options: RealtimeChannelOptions,
    callback: SubscriptionCallback
  ) {
    if (this.channels.has(channelName)) {
      logger.warn(`Channel ${channelName} already exists, unsubscribing first`)
      this.unsubscribe(channelName)
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: options.schema || 'public',
          table: options.table,
          filter: options.filter,
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)
    logger.info(`Subscribed to channel: ${channelName}`)

    return channel
  }

  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
      logger.info(`Unsubscribed from channel: ${channelName}`)
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      supabase.removeChannel(channel)
      logger.info(`Unsubscribed from channel: ${name}`)
    })
    this.channels.clear()
  }

  getChannel(channelName: string) {
    return this.channels.get(channelName) || null
  }

  isSubscribed(channelName: string) {
    return this.channels.has(channelName)
  }
}

export const realtime = new RealtimeService()

export type { RealtimeChannelOptions, SubscriptionCallback }