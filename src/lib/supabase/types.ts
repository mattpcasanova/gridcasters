export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          is_private: boolean
          is_verified: boolean
          tutorial_dismissed: boolean
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_private?: boolean
          is_verified?: boolean
          tutorial_dismissed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_private?: boolean
          is_verified?: boolean
          tutorial_dismissed?: boolean
          created_at?: string
        }
      }
      rankings: {
        Row: {
          id: string
          user_id: string
          title: string
          position: string
          type: string
          week: number | null
          season: number
          accuracy_score: number | null
          percentile_rank: number | null
          total_rankings_in_period: number | null
          percentile_score: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          position: string
          type: string
          week?: number | null
          season: number
          accuracy_score?: number | null
          percentile_rank?: number | null
          total_rankings_in_period?: number | null
          percentile_score?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          position?: string
          type?: string
          week?: number | null
          season?: number
          accuracy_score?: number | null
          percentile_rank?: number | null
          total_rankings_in_period?: number | null
          percentile_score?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      player_rankings: {
        Row: {
          id: string
          ranking_id: string
          player_id: string
          player_name: string
          team: string
          position: string
          rank_position: number
          is_starred: boolean
          created_at: string
        }
        Insert: {
          id?: string
          ranking_id: string
          player_id: string
          player_name: string
          team: string
          position: string
          rank_position: number
          is_starred?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          ranking_id?: string
          player_id?: string
          player_name?: string
          team?: string
          position?: string
          rank_position?: number
          is_starred?: boolean
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          avatar_url: string | null
          is_private: boolean
          host_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          avatar_url?: string | null
          is_private?: boolean
          host_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          avatar_url?: string | null
          is_private?: boolean
          host_id?: string
          created_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          status: string
          joined_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          status?: string
          joined_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          status?: string
          joined_at?: string | null
          created_at?: string
        }
      }
      user_badge_selections: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 