export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          joined_at: string
          reputation_points: number
          role: string
          updated_at: string
          onboarding_completed: boolean
          interests: string[] | null
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          joined_at?: string
          reputation_points?: number
          role?: string
          updated_at?: string
          onboarding_completed?: boolean
          interests?: string[] | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          joined_at?: string
          reputation_points?: number
          role?: string
          updated_at?: string
          onboarding_completed?: boolean
          interests?: string[] | null
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          description: string
          creator_id: string
          image_url: string | null
          is_private: boolean
          category: string
          created_at: string
          updated_at: string
          member_count: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          creator_id: string
          image_url?: string | null
          is_private?: boolean
          category: string
          created_at?: string
          updated_at?: string
          member_count?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          creator_id?: string
          image_url?: string | null
          is_private?: boolean
          category?: string
          created_at?: string
          updated_at?: string
          member_count?: number
        }
      }
      community_members: {
        Row: {
          id: string
          community_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          tags: string[] | null
          upvotes: number
          downvotes: number
          created_at: string
          updated_at: string
          community_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          tags?: string[] | null
          upvotes?: number
          downvotes?: number
          created_at?: string
          updated_at?: string
          community_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          tags?: string[] | null
          upvotes?: number
          downvotes?: number
          created_at?: string
          updated_at?: string
          community_id?: string | null
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string
          location: string | null
          is_virtual: boolean
          start_time: string
          end_time: string
          max_attendees: number | null
          category: string
          tags: string[] | null
          image_url: string | null
          is_recurring: boolean
          recurring_pattern: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description: string
          location?: string | null
          is_virtual?: boolean
          start_time: string
          end_time: string
          max_attendees?: number | null
          category: string
          tags?: string[] | null
          image_url?: string | null
          is_recurring?: boolean
          recurring_pattern?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string
          location?: string | null
          is_virtual?: boolean
          start_time?: string
          end_time?: string
          max_attendees?: number | null
          category?: string
          tags?: string[] | null
          image_url?: string | null
          is_recurring?: boolean
          recurring_pattern?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      impact_history: {
        Row: {
          id: string
          user_id: string
          event_id: string | null
          activity_type: string
          points_earned: number
          description: string | null
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id?: string | null
          activity_type: string
          points_earned?: number
          description?: string | null
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string | null
          activity_type?: string
          points_earned?: number
          description?: string | null
          verified?: boolean
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string | null
          points_required: number
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url?: string | null
          points_required?: number
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string | null
          points_required?: number
          category?: string
          created_at?: string
        }
      }
    }
  }
}
