export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          criteria: Json
          description: string | null
          icon_url: string | null
          id: string
          is_hidden: boolean
          name: string
          rewards: Json
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          is_hidden?: boolean
          name: string
          rewards?: Json
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          is_hidden?: boolean
          name?: string
          rewards?: Json
        }
        Relationships: []
      }
      ad_networks: {
        Row: {
          api_key: string | null
          api_secret: string | null
          created_at: string
          ecpm: number | null
          fill_rate: number | null
          id: string
          is_active: boolean
          name: string
          priority: number
          settings: Json | null
          type: Database["public"]["Enums"]["ad_network"]
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          ecpm?: number | null
          fill_rate?: number | null
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          settings?: Json | null
          type: Database["public"]["Enums"]["ad_network"]
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          ecpm?: number | null
          fill_rate?: number | null
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          settings?: Json | null
          type?: Database["public"]["Enums"]["ad_network"]
          updated_at?: string
        }
        Relationships: []
      }
      ad_rewards: {
        Row: {
          ad_view_id: string
          amount: number
          created_at: string
          currency: string
          id: string
          processed_at: string | null
          reward_pool_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          ad_view_id: string
          amount: number
          created_at?: string
          currency?: string
          id?: string
          processed_at?: string | null
          reward_pool_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          ad_view_id?: string
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          processed_at?: string | null
          reward_pool_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_rewards_ad_view_id_fkey"
            columns: ["ad_view_id"]
            isOneToOne: false
            referencedRelation: "ad_views"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_rewards_reward_pool_id_fkey"
            columns: ["reward_pool_id"]
            isOneToOne: false
            referencedRelation: "reward_pool"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_rewards_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ad_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ad_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_views: {
        Row: {
          ad_network_id: string | null
          ad_type: Database["public"]["Enums"]["ad_type"]
          ad_unit_id: string | null
          created_at: string
          currency: string
          device_fingerprint: string | null
          fraud_score: number | null
          id: string
          ip_address: unknown
          is_completed: boolean
          is_skipped: boolean
          metadata: Json | null
          placement: string | null
          reward_amount: number
          user_agent: string | null
          user_id: string
          watch_time: number | null
        }
        Insert: {
          ad_network_id?: string | null
          ad_type: Database["public"]["Enums"]["ad_type"]
          ad_unit_id?: string | null
          created_at?: string
          currency?: string
          device_fingerprint?: string | null
          fraud_score?: number | null
          id?: string
          ip_address?: unknown
          is_completed?: boolean
          is_skipped?: boolean
          metadata?: Json | null
          placement?: string | null
          reward_amount: number
          user_agent?: string | null
          user_id: string
          watch_time?: number | null
        }
        Update: {
          ad_network_id?: string | null
          ad_type?: Database["public"]["Enums"]["ad_type"]
          ad_unit_id?: string | null
          created_at?: string
          currency?: string
          device_fingerprint?: string | null
          fraud_score?: number | null
          id?: string
          ip_address?: unknown
          is_completed?: boolean
          is_skipped?: boolean
          metadata?: Json | null
          placement?: string | null
          reward_amount?: number
          user_agent?: string | null
          user_id?: string
          watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_views_ad_network_id_fkey"
            columns: ["ad_network_id"]
            isOneToOne: false
            referencedRelation: "ad_networks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ad_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ad_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          description: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_login_at: string | null
          permissions: Json
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          permissions?: Json
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          permissions?: Json
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          device_id: string | null
          event_category: string | null
          event_name: string
          id: string
          ip_address: unknown
          properties: Json | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          event_category?: string | null
          event_name: string
          id?: string
          ip_address?: unknown
          properties?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          event_category?: string | null
          event_name?: string
          id?: string
          ip_address?: unknown
          properties?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "device_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_installs: {
        Row: {
          app_name: string
          app_store_url: string | null
          completed_at: string | null
          created_at: string
          currency: string
          device_id: string
          failed_reason: string | null
          id: string
          ip_address: unknown
          package_name: string | null
          reward_amount: number
          screenshot_url: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
          user_agent: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          app_name: string
          app_store_url?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          device_id: string
          failed_reason?: string | null
          id?: string
          ip_address?: unknown
          package_name?: string | null
          reward_amount: number
          screenshot_url?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_agent?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          app_name?: string
          app_store_url?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          device_id?: string
          failed_reason?: string | null
          id?: string
          ip_address?: unknown
          package_name?: string | null
          reward_amount?: number
          screenshot_url?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_agent?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_installs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_installs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_installs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_statistics: {
        Row: {
          active_users: number
          ad_views_count: number
          created_at: string
          date: string
          id: string
          new_users: number
          offerwalls_completed: number
          referrals_count: number
          surveys_completed: number
          total_rewards: number
          total_transactions: number
          total_users: number
          total_volume: number
          total_withdrawals: number
          updated_at: string
        }
        Insert: {
          active_users?: number
          ad_views_count?: number
          created_at?: string
          date: string
          id?: string
          new_users?: number
          offerwalls_completed?: number
          referrals_count?: number
          surveys_completed?: number
          total_rewards?: number
          total_transactions?: number
          total_users?: number
          total_volume?: number
          total_withdrawals?: number
          updated_at?: string
        }
        Update: {
          active_users?: number
          ad_views_count?: number
          created_at?: string
          date?: string
          id?: string
          new_users?: number
          offerwalls_completed?: number
          referrals_count?: number
          surveys_completed?: number
          total_rewards?: number
          total_transactions?: number
          total_users?: number
          total_volume?: number
          total_withdrawals?: number
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string
          criteria: Json
          description: string | null
          icon_url: string | null
          id: string
          name: string
          rarity: Database["public"]["Enums"]["badge_rarity"]
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          rarity?: Database["public"]["Enums"]["badge_rarity"]
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          rarity?: Database["public"]["Enums"]["badge_rarity"]
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          name: string
          phone_code: string | null
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          name: string
          phone_code?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          name?: string
          phone_code?: string | null
        }
        Relationships: []
      }
      daily_bonus: {
        Row: {
          claimed_at: string
          currency: string
          day_number: number
          id: string
          reward_amount: number
          user_id: string
        }
        Insert: {
          claimed_at?: string
          currency?: string
          day_number: number
          id?: string
          reward_amount: number
          user_id: string
        }
        Update: {
          claimed_at?: string
          currency?: string
          day_number?: number
          id?: string
          reward_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_bonus_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "daily_bonus_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "daily_bonus_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      device_sessions: {
        Row: {
          created_at: string
          device_id: string
          device_name: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          expires_at: string
          id: string
          ip_address: unknown
          last_active_at: string
          location: Json | null
          status: Database["public"]["Enums"]["session_status"]
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          device_name?: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          expires_at: string
          id?: string
          ip_address: unknown
          last_active_at?: string
          location?: Json | null
          status?: Database["public"]["Enums"]["session_status"]
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          device_name?: string | null
          device_type?: Database["public"]["Enums"]["device_type"]
          expires_at?: string
          id?: string
          ip_address?: unknown
          last_active_at?: string
          location?: Json | null
          status?: Database["public"]["Enums"]["session_status"]
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "device_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "device_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string
          currency: string
          event_id: string
          id: string
          rank_position: number | null
          reward_amount: number
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          rank_position?: number | null
          reward_amount: number
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          rank_position?: number | null
          reward_amount?: number
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rewards_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rewards_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          ends_at: string
          id: string
          is_public: boolean
          max_participants: number | null
          name: string
          rewards: Json
          rules: Json
          starts_at: string
          status: Database["public"]["Enums"]["event_status"]
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ends_at: string
          id?: string
          is_public?: boolean
          max_participants?: number | null
          name: string
          rewards?: Json
          rules?: Json
          starts_at: string
          status?: Database["public"]["Enums"]["event_status"]
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ends_at?: string
          id?: string
          is_public?: boolean
          max_participants?: number | null
          name?: string
          rewards?: Json
          rules?: Json
          starts_at?: string
          status?: Database["public"]["Enums"]["event_status"]
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string
        }
        Relationships: []
      }
      fc_ledger: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_agent: string | null
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_agent?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fc_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fc_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fc_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_enabled: boolean
          key: string
          name: string
          rollout_percentage: number
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          key: string
          name: string
          rollout_percentage?: number
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          key?: string
          name?: string
          rollout_percentage?: number
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      fraud_detection: {
        Row: {
          created_at: string
          detection_type: string
          evidence: Json
          id: string
          resolution_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_level: Database["public"]["Enums"]["fraud_risk_level"]
          score: number
          status: Database["public"]["Enums"]["fraud_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detection_type: string
          evidence?: Json
          id?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: Database["public"]["Enums"]["fraud_risk_level"]
          score: number
          status?: Database["public"]["Enums"]["fraud_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          detection_type?: string
          evidence?: Json
          id?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: Database["public"]["Enums"]["fraud_risk_level"]
          score?: number
          status?: Database["public"]["Enums"]["fraud_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_detection_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_detection_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fraud_detection_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fraud_detection_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_reports: {
        Row: {
          created_at: string
          evidence: Json | null
          fraud_detection_id: string
          id: string
          reason: string
          reported_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["fraud_status"]
        }
        Insert: {
          created_at?: string
          evidence?: Json | null
          fraud_detection_id: string
          id?: string
          reason: string
          reported_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["fraud_status"]
        }
        Update: {
          created_at?: string
          evidence?: Json | null
          fraud_detection_id?: string
          id?: string
          reason?: string
          reported_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["fraud_status"]
        }
        Relationships: [
          {
            foreignKeyName: "fraud_reports_fraud_detection_id_fkey"
            columns: ["fraud_detection_id"]
            isOneToOne: false
            referencedRelation: "fraud_detection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fraud_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fraud_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          name: string
          native_name: string
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          name: string
          native_name: string
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          name?: string
          native_name?: string
        }
        Relationships: []
      }
      leaderboard_all_time: {
        Row: {
          created_at: string
          id: string
          rank: number
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rank: number
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rank?: number
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_all_time_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leaderboard_all_time_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leaderboard_all_time_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_daily: {
        Row: {
          created_at: string
          id: string
          period_date: string
          rank: number
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_date: string
          rank: number
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_date?: string
          rank?: number
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_daily_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leaderboard_daily_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leaderboard_daily_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_monthly: {
        Row: {
          created_at: string
          id: string
          period_month: number
          period_year: number
          rank: number
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_month: number
          period_year: number
          rank: number
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_month?: number
          period_year?: number
          rank?: number
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_monthly_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leaderboard_monthly_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leaderboard_monthly_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_weekly: {
        Row: {
          created_at: string
          id: string
          period_end: string
          period_start: string
          rank: number
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          rank: number
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          rank?: number
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_weekly_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leaderboard_weekly_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leaderboard_weekly_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          benefits: Json | null
          created_at: string
          level: number
          rewards: Json | null
          title: string
          updated_at: string
          xp_required: number
        }
        Insert: {
          benefits?: Json | null
          created_at?: string
          level: number
          rewards?: Json | null
          title: string
          updated_at?: string
          xp_required: number
        }
        Update: {
          benefits?: Json | null
          created_at?: string
          level?: number
          rewards?: Json | null
          title?: string
          updated_at?: string
          xp_required?: number
        }
        Relationships: []
      }
      mission_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_value: number
          expires_at: string | null
          id: string
          mission_id: string
          progress: Json
          started_at: string
          status: Database["public"]["Enums"]["mission_status"]
          target_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_value?: number
          expires_at?: string | null
          id?: string
          mission_id: string
          progress?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["mission_status"]
          target_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_value?: number
          expires_at?: string | null
          id?: string
          mission_id?: string
          progress?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["mission_status"]
          target_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mission_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mission_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          available_from: string | null
          available_until: string | null
          created_at: string
          description: string | null
          difficulty: number
          id: string
          is_active: boolean
          is_repeatable: boolean
          max_completions: number
          requirements: Json
          rewards: Json
          title: string
          type: Database["public"]["Enums"]["mission_type"]
          updated_at: string
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          description?: string | null
          difficulty?: number
          id?: string
          is_active?: boolean
          is_repeatable?: boolean
          max_completions?: number
          requirements?: Json
          rewards?: Json
          title: string
          type: Database["public"]["Enums"]["mission_type"]
          updated_at?: string
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          description?: string | null
          difficulty?: number
          id?: string
          is_active?: boolean
          is_repeatable?: boolean
          max_completions?: number
          requirements?: Json
          rewards?: Json
          title?: string
          type?: Database["public"]["Enums"]["mission_type"]
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offerwall_history: {
        Row: {
          completed_at: string | null
          created_at: string
          currency: string | null
          id: string
          metadata: Json | null
          offer_id: string
          offer_name: string
          offerwall_id: string
          provider_transaction_id: string | null
          reward_amount: number | null
          started_at: string
          status: Database["public"]["Enums"]["offerwall_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          offer_id: string
          offer_name: string
          offerwall_id: string
          provider_transaction_id?: string | null
          reward_amount?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["offerwall_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          offer_id?: string
          offer_name?: string
          offerwall_id?: string
          provider_transaction_id?: string | null
          reward_amount?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["offerwall_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offerwall_history_offerwall_id_fkey"
            columns: ["offerwall_id"]
            isOneToOne: false
            referencedRelation: "offerwalls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offerwall_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "offerwall_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "offerwall_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offerwalls: {
        Row: {
          api_key: string | null
          api_secret: string | null
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          priority: number
          provider: string
          settings: Json | null
          type: Database["public"]["Enums"]["offerwall_type"]
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          provider: string
          settings?: Json | null
          type: Database["public"]["Enums"]["offerwall_type"]
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          provider?: string
          settings?: Json | null
          type?: Database["public"]["Enums"]["offerwall_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ads_watched: number
          apps_installed: number
          avatar_url: string | null
          bio: string | null
          country_code: string | null
          created_at: string
          current_streak: number
          experience_points: number
          id: string
          is_public: boolean
          language_code: string
          level: number
          longest_streak: number
          rank: string
          referrals_count: number
          show_on_leaderboard: boolean
          tasks_completed: number
          timezone: string
          total_earned: number
          total_withdrawn: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ads_watched?: number
          apps_installed?: number
          avatar_url?: string | null
          bio?: string | null
          country_code?: string | null
          created_at?: string
          current_streak?: number
          experience_points?: number
          id?: string
          is_public?: boolean
          language_code?: string
          level?: number
          longest_streak?: number
          rank?: string
          referrals_count?: number
          show_on_leaderboard?: boolean
          tasks_completed?: number
          timezone?: string
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ads_watched?: number
          apps_installed?: number
          avatar_url?: string | null
          bio?: string | null
          country_code?: string | null
          created_at?: string
          current_streak?: number
          experience_points?: number
          id?: string
          is_public?: boolean
          language_code?: string
          level?: number
          longest_streak?: number
          rank?: string
          referrals_count?: number
          show_on_leaderboard?: boolean
          tasks_completed?: number
          timezone?: string
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          benefits: Json | null
          created_at: string
          icon_url: string | null
          id: string
          max_fc: number
          min_fc: number
          name: string
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          created_at?: string
          icon_url?: string | null
          id?: string
          max_fc: number
          min_fc: number
          name: string
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          created_at?: string
          icon_url?: string | null
          id?: string
          max_fc?: number
          min_fc?: number
          name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referral_links: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          updated_at: string
          user_id: string
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
          user_id: string
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
          user_id?: string
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "referral_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referral_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referral_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_rewards: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          referral_id: string
          reward_type: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          referral_id: string
          reward_type: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          referral_id?: string
          reward_type?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_rewards_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referral_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referral_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          referee_id: string
          referee_verified: boolean
          referee_verified_at: string | null
          referral_link_id: string
          referrer_id: string
          reward_amount: number
          reward_paid_at: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          referee_id: string
          referee_verified?: boolean
          referee_verified_at?: string | null
          referral_link_id: string
          referrer_id: string
          reward_amount?: number
          reward_paid_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          referee_id?: string
          referee_verified?: boolean
          referee_verified_at?: string | null
          referral_link_id?: string
          referrer_id?: string
          reward_amount?: number
          reward_paid_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referral_link_id_fkey"
            columns: ["referral_link_id"]
            isOneToOne: false
            referencedRelation: "referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      remote_configs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      reward_pool: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          distributed_amount: number
          ends_at: string | null
          id: string
          is_active: boolean
          name: string
          remaining_amount: number | null
          starts_at: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          distributed_amount?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          remaining_amount?: number | null
          starts_at?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          distributed_amount?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          remaining_amount?: number | null
          starts_at?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      settlement_cycles: {
        Row: {
          created_at: string
          id: string
          name: string
          period_end: string
          period_start: string
          processed_at: string | null
          status: Database["public"]["Enums"]["settlement_status"]
          total_amount: number
          total_users: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          period_end: string
          period_start: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["settlement_status"]
          total_amount: number
          total_users?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          period_end?: string
          period_start?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["settlement_status"]
          total_amount?: number
          total_users?: number
          updated_at?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          amount: number
          created_at: string
          currency: string
          failed_reason: string | null
          id: string
          payment_details: Json | null
          payment_method: string | null
          processed_at: string | null
          settlement_cycle_id: string | null
          status: Database["public"]["Enums"]["settlement_status"]
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          failed_reason?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          settlement_cycle_id?: string | null
          status?: Database["public"]["Enums"]["settlement_status"]
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          failed_reason?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          settlement_cycle_id?: string | null
          status?: Database["public"]["Enums"]["settlement_status"]
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_settlement_cycle_id_fkey"
            columns: ["settlement_cycle_id"]
            isOneToOne: false
            referencedRelation: "settlement_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlements_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "settlements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "settlements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          created_at: string
          current_streak: number
          freeze_available: boolean
          freeze_count: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          freeze_available?: boolean
          freeze_count?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          freeze_available?: boolean
          freeze_count?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_internal: boolean
          message: string
          sender_type: string
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_internal?: boolean
          message: string
          sender_type: string
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_internal?: boolean
          message?: string
          sender_type?: string
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "support_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "support_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_history: {
        Row: {
          completed_at: string | null
          created_at: string
          currency: string | null
          id: string
          metadata: Json | null
          provider_response_id: string | null
          reward_amount: number | null
          started_at: string
          status: Database["public"]["Enums"]["survey_status"]
          survey_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          provider_response_id?: string | null
          reward_amount?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["survey_status"]
          survey_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          provider_response_id?: string | null
          reward_amount?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["survey_status"]
          survey_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_history_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "survey_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "survey_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          available_from: string | null
          available_until: string | null
          created_at: string
          currency: string
          current_completions: number
          description: string | null
          difficulty: string | null
          estimated_time: number | null
          id: string
          is_active: boolean
          max_completions: number | null
          metadata: Json | null
          provider: string
          provider_survey_id: string
          reward_amount: number
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          currency?: string
          current_completions?: number
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          id?: string
          is_active?: boolean
          max_completions?: number | null
          metadata?: Json | null
          provider: string
          provider_survey_id: string
          reward_amount: number
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          currency?: string
          current_completions?: number
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          id?: string
          is_active?: boolean
          max_completions?: number | null
          metadata?: Json | null
          provider?: string
          provider_survey_id?: string
          reward_amount?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          ip_address: unknown
          level: Database["public"]["Enums"]["log_level"]
          logger: string
          message: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown
          level: Database["public"]["Enums"]["log_level"]
          logger: string
          message: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown
          level?: Database["public"]["Enums"]["log_level"]
          logger?: string
          message?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          failed_reason: string | null
          fee: number
          id: string
          metadata: Json | null
          net_amount: number | null
          processed_at: string | null
          reference_id: string | null
          reference_type: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          failed_reason?: string | null
          fee?: number
          id?: string
          metadata?: Json | null
          net_amount?: number | null
          processed_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          failed_reason?: string | null
          fee?: number
          id?: string
          metadata?: Json | null
          net_amount?: number | null
          processed_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_devices: {
        Row: {
          app_version: string | null
          device_id: string
          device_model: string | null
          device_name: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          first_seen_at: string
          id: string
          is_trusted: boolean
          last_seen_at: string
          os_version: string | null
          user_id: string
        }
        Insert: {
          app_version?: string | null
          device_id: string
          device_model?: string | null
          device_name?: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          first_seen_at?: string
          id?: string
          is_trusted?: boolean
          last_seen_at?: string
          os_version?: string | null
          user_id: string
        }
        Update: {
          app_version?: string | null
          device_id?: string
          device_model?: string | null
          device_name?: string | null
          device_type?: Database["public"]["Enums"]["device_type"]
          first_seen_at?: string
          id?: string
          is_trusted?: boolean
          last_seen_at?: string
          os_version?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string | null
          email_verified: boolean
          first_name: string | null
          id: string
          is_premium: boolean
          last_active_at: string
          last_login_at: string | null
          last_name: string | null
          phone: string | null
          phone_verified: boolean
          registered_at: string
          status: Database["public"]["Enums"]["user_status"]
          telegram_id: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          email_verified?: boolean
          first_name?: string | null
          id?: string
          is_premium?: boolean
          last_active_at?: string
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          phone_verified?: boolean
          registered_at?: string
          status?: Database["public"]["Enums"]["user_status"]
          telegram_id?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          email_verified?: boolean
          first_name?: string | null
          id?: string
          is_premium?: boolean
          last_active_at?: string
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          phone_verified?: boolean
          registered_at?: string
          status?: Database["public"]["Enums"]["user_status"]
          telegram_id?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          pending_balance: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
          user_id: string
          withdrawable_balance: number
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
          withdrawable_balance?: number
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
          withdrawable_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_leaderboard_all_time"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mv_user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_leaderboard_all_time: {
        Row: {
          avatar_url: string | null
          display_rank: number | null
          first_name: string | null
          last_name: string | null
          level: number | null
          rank: number | null
          score: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: []
      }
      mv_user_statistics: {
        Row: {
          ads_watched: number | null
          apps_installed: number | null
          balance: number | null
          experience_points: number | null
          last_active_at: string | null
          last_activity_at: string | null
          level: number | null
          referrals_count: number | null
          status: Database["public"]["Enums"]["user_status"] | null
          tasks_completed: number | null
          total_activities: number | null
          total_earned: number | null
          total_withdrawn: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_user_statistics: {
        Args: { target_date?: string }
        Returns: undefined
      }
      get_user_rank: {
        Args: { user_uuid: string }
        Returns: {
          rank_position: number
          score: number
        }[]
      }
      refresh_leaderboard_view: { Args: never; Returns: undefined }
      refresh_user_statistics_view: { Args: never; Returns: undefined }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      update_leaderboard: {
        Args: { period_type: string; score_increase: number; user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      ad_network:
        | "google_admob"
        | "unity_ads"
        | "iron_source"
        | "applovin"
        | "facebook_audience"
        | "custom"
      ad_type: "video" | "banner" | "interstitial" | "native"
      badge_rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
      device_type: "mobile" | "tablet" | "desktop"
      event_status: "upcoming" | "active" | "completed" | "cancelled"
      event_type: "seasonal" | "special" | "tournament" | "community"
      fraud_risk_level: "low" | "medium" | "high" | "critical"
      fraud_status:
        | "pending"
        | "investigating"
        | "confirmed"
        | "false_positive"
        | "resolved"
      leaderboard_period: "daily" | "weekly" | "monthly" | "all_time"
      log_level: "debug" | "info" | "warning" | "error" | "critical"
      mission_status: "active" | "completed" | "expired" | "locked"
      mission_type: "daily" | "weekly" | "achievement" | "special" | "referral"
      notification_type:
        | "reward"
        | "mission"
        | "achievement"
        | "system"
        | "promotion"
        | "referral"
      offerwall_status:
        | "available"
        | "in_progress"
        | "completed"
        | "rejected"
        | "expired"
      offerwall_type: "cpi" | "cpa" | "cpl" | "survey"
      session_status: "active" | "expired" | "revoked"
      settlement_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      survey_status:
        | "available"
        | "in_progress"
        | "completed"
        | "disqualified"
        | "expired"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_for_user"
        | "resolved"
        | "closed"
      transaction_status:
        | "pending"
        | "completed"
        | "failed"
        | "cancelled"
        | "reversed"
      transaction_type:
        | "credit"
        | "debit"
        | "transfer"
        | "withdrawal"
        | "refund"
        | "bonus"
        | "penalty"
      user_status: "active" | "suspended" | "banned" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ad_network: [
        "google_admob",
        "unity_ads",
        "iron_source",
        "applovin",
        "facebook_audience",
        "custom",
      ],
      ad_type: ["video", "banner", "interstitial", "native"],
      badge_rarity: ["common", "uncommon", "rare", "epic", "legendary"],
      device_type: ["mobile", "tablet", "desktop"],
      event_status: ["upcoming", "active", "completed", "cancelled"],
      event_type: ["seasonal", "special", "tournament", "community"],
      fraud_risk_level: ["low", "medium", "high", "critical"],
      fraud_status: [
        "pending",
        "investigating",
        "confirmed",
        "false_positive",
        "resolved",
      ],
      leaderboard_period: ["daily", "weekly", "monthly", "all_time"],
      log_level: ["debug", "info", "warning", "error", "critical"],
      mission_status: ["active", "completed", "expired", "locked"],
      mission_type: ["daily", "weekly", "achievement", "special", "referral"],
      notification_type: [
        "reward",
        "mission",
        "achievement",
        "system",
        "promotion",
        "referral",
      ],
      offerwall_status: [
        "available",
        "in_progress",
        "completed",
        "rejected",
        "expired",
      ],
      offerwall_type: ["cpi", "cpa", "cpl", "survey"],
      session_status: ["active", "expired", "revoked"],
      settlement_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      survey_status: [
        "available",
        "in_progress",
        "completed",
        "disqualified",
        "expired",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_for_user",
        "resolved",
        "closed",
      ],
      transaction_status: [
        "pending",
        "completed",
        "failed",
        "cancelled",
        "reversed",
      ],
      transaction_type: [
        "credit",
        "debit",
        "transfer",
        "withdrawal",
        "refund",
        "bonus",
        "penalty",
      ],
      user_status: ["active", "suspended", "banned", "pending"],
    },
  },
} as const
