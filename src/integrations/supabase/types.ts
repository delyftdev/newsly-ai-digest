export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      announcement_analytics: {
        Row: {
          announcement_id: string
          announcement_type: string
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          source: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          announcement_id: string
          announcement_type?: string
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          announcement_id?: string
          announcement_type?: string
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      announcement_reactions: {
        Row: {
          announcement_id: string
          announcement_type: string
          created_at: string
          id: string
          reaction_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          announcement_id: string
          announcement_type?: string
          created_at?: string
          id?: string
          reaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          announcement_id?: string
          announcement_type?: string
          created_at?: string
          id?: string
          reaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      approval_chains: {
        Row: {
          chain_config: Json
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          chain_config: Json
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          chain_config?: Json
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      branding: {
        Row: {
          company_id: string | null
          created_at: string | null
          font_family: string | null
          id: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          font_family?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          font_family?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branding_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      changelog_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          changelog_id: string
          created_at: string
          description: string
          id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          changelog_id: string
          created_at?: string
          description: string
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          changelog_id?: string
          created_at?: string
          description?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "changelog_activity_changelog_id_fkey"
            columns: ["changelog_id"]
            isOneToOne: false
            referencedRelation: "changelogs"
            referencedColumns: ["id"]
          },
        ]
      }
      changelog_approvals: {
        Row: {
          approval_chain_id: string | null
          approver_user_id: string
          changelog_id: string
          created_at: string
          current_step: number
          decided_at: string | null
          decision_notes: string | null
          id: string
          status: string
          total_steps: number
          updated_at: string
        }
        Insert: {
          approval_chain_id?: string | null
          approver_user_id: string
          changelog_id: string
          created_at?: string
          current_step?: number
          decided_at?: string | null
          decision_notes?: string | null
          id?: string
          status?: string
          total_steps: number
          updated_at?: string
        }
        Update: {
          approval_chain_id?: string | null
          approver_user_id?: string
          changelog_id?: string
          created_at?: string
          current_step?: number
          decided_at?: string | null
          decision_notes?: string | null
          id?: string
          status?: string
          total_steps?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "changelog_approvals_approval_chain_id_fkey"
            columns: ["approval_chain_id"]
            isOneToOne: false
            referencedRelation: "approval_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "changelog_approvals_changelog_id_fkey"
            columns: ["changelog_id"]
            isOneToOne: false
            referencedRelation: "changelogs"
            referencedColumns: ["id"]
          },
        ]
      }
      changelog_comments: {
        Row: {
          changelog_id: string
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          position_data: Json | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          changelog_id: string
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          position_data?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          changelog_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          position_data?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "changelog_comments_changelog_id_fkey"
            columns: ["changelog_id"]
            isOneToOne: false
            referencedRelation: "changelogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "changelog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "changelog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      changelog_participants: {
        Row: {
          changelog_id: string
          created_at: string
          id: string
          invited_at: string
          invited_by: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          changelog_id: string
          created_at?: string
          id?: string
          invited_at?: string
          invited_by: string
          role?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          changelog_id?: string
          created_at?: string
          id?: string
          invited_at?: string
          invited_by?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "changelog_participants_changelog_id_fkey"
            columns: ["changelog_id"]
            isOneToOne: false
            referencedRelation: "changelogs"
            referencedColumns: ["id"]
          },
        ]
      }
      changelogs: {
        Row: {
          ai_generated: boolean | null
          auto_saved_at: string | null
          avg_time_spent: number | null
          category: string
          click_through_rate: number | null
          comment_count: number | null
          company_id: string
          content: Json | null
          created_at: string
          created_by: string
          email_open_rate: number | null
          featured_image_url: string | null
          id: string
          public_slug: string | null
          published_at: string | null
          published_by: string | null
          reaction_count: number | null
          shareable_url: string | null
          status: string
          tags: string[] | null
          title: string
          unique_views: number | null
          updated_at: string
          video_url: string | null
          view_count: number | null
          visibility: string
        }
        Insert: {
          ai_generated?: boolean | null
          auto_saved_at?: string | null
          avg_time_spent?: number | null
          category?: string
          click_through_rate?: number | null
          comment_count?: number | null
          company_id: string
          content?: Json | null
          created_at?: string
          created_by: string
          email_open_rate?: number | null
          featured_image_url?: string | null
          id?: string
          public_slug?: string | null
          published_at?: string | null
          published_by?: string | null
          reaction_count?: number | null
          shareable_url?: string | null
          status?: string
          tags?: string[] | null
          title: string
          unique_views?: number | null
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
          visibility?: string
        }
        Update: {
          ai_generated?: boolean | null
          auto_saved_at?: string | null
          avg_time_spent?: number | null
          category?: string
          click_through_rate?: number | null
          comment_count?: number | null
          company_id?: string
          content?: Json | null
          created_at?: string
          created_by?: string
          email_open_rate?: number | null
          featured_image_url?: string | null
          id?: string
          public_slug?: string | null
          published_at?: string | null
          published_by?: string | null
          reaction_count?: number | null
          shareable_url?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          unique_views?: number | null
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
          visibility?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          banner_url: string | null
          created_at: string | null
          domain: string | null
          font_family: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          slug: string | null
          subdomain: string | null
          team_size: string | null
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          domain?: string | null
          font_family?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string | null
          subdomain?: string | null
          team_size?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          domain?: string | null
          font_family?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string | null
          subdomain?: string | null
          team_size?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          email_id: string | null
          id: string
          image_url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          email_id?: string | null
          id?: string
          image_url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          email_id?: string | null
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_images_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_links: {
        Row: {
          created_at: string | null
          email_id: string | null
          id: string
          link_text: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          email_id?: string | null
          id?: string
          link_text?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          email_id?: string | null
          id?: string
          link_text?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_links_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          ai_summary: string | null
          category: string | null
          content: string | null
          created_at: string | null
          html_content: string | null
          id: string
          is_processed: boolean | null
          received_at: string | null
          sender_email: string
          sender_name: string | null
          subject: string
          user_id: string | null
        }
        Insert: {
          ai_summary?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          html_content?: string | null
          id?: string
          is_processed?: boolean | null
          received_at?: string | null
          sender_email: string
          sender_name?: string | null
          subject: string
          user_id?: string | null
        }
        Update: {
          ai_summary?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          html_content?: string | null
          id?: string
          is_processed?: boolean | null
          received_at?: string | null
          sender_email?: string
          sender_name?: string | null
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_comments: {
        Row: {
          content: string
          created_at: string
          feedback_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          feedback_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          feedback_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_comments_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_ideas: {
        Row: {
          category: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_private: boolean | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          vote_count: number
        }
        Insert: {
          category?: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          vote_count?: number
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          vote_count?: number
        }
        Relationships: []
      }
      feedback_votes: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_votes_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      inbox_emails: {
        Row: {
          created_at: string | null
          email_address: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_address: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_address?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inbox_messages: {
        Row: {
          ai_summary: string | null
          ai_tags: string[] | null
          category: string | null
          company_id: string | null
          confidence_score: number | null
          content: string | null
          created_at: string | null
          enhanced_category: string | null
          from_email: string
          from_name: string | null
          html_content: string | null
          id: string
          is_processed: boolean | null
          processed_by_ai: boolean | null
          received_at: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          ai_tags?: string[] | null
          category?: string | null
          company_id?: string | null
          confidence_score?: number | null
          content?: string | null
          created_at?: string | null
          enhanced_category?: string | null
          from_email: string
          from_name?: string | null
          html_content?: string | null
          id?: string
          is_processed?: boolean | null
          processed_by_ai?: boolean | null
          received_at?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          ai_tags?: string[] | null
          category?: string | null
          company_id?: string | null
          confidence_score?: number | null
          content?: string | null
          created_at?: string | null
          enhanced_category?: string | null
          from_email?: string
          from_name?: string | null
          html_content?: string | null
          id?: string
          is_processed?: boolean | null
          processed_by_ai?: boolean | null
          received_at?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inbox_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          branding_completed: boolean | null
          company_info_completed: boolean | null
          completed_at: string | null
          completed_steps: number[] | null
          created_at: string | null
          current_step: number | null
          domain_setup_completed: boolean | null
          id: string
          team_setup_completed: boolean | null
          updated_at: string | null
          user_id: string | null
          workspace_completed: boolean | null
        }
        Insert: {
          branding_completed?: boolean | null
          company_info_completed?: boolean | null
          completed_at?: string | null
          completed_steps?: number[] | null
          created_at?: string | null
          current_step?: number | null
          domain_setup_completed?: boolean | null
          id?: string
          team_setup_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          workspace_completed?: boolean | null
        }
        Update: {
          branding_completed?: boolean | null
          company_info_completed?: boolean | null
          completed_at?: string | null
          completed_steps?: number[] | null
          created_at?: string | null
          current_step?: number | null
          domain_setup_completed?: boolean | null
          id?: string
          team_setup_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          workspace_completed?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string | null
          full_name: string | null
          generated_email: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          full_name?: string | null
          generated_email?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          full_name?: string | null
          generated_email?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referrer_email: string
          total_credits: number | null
          total_referrals: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referrer_email: string
          total_credits?: number | null
          total_referrals?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referrer_email?: string
          total_credits?: number | null
          total_referrals?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          ai_generated: boolean | null
          ai_summary: string | null
          avg_time_spent: number | null
          category: string | null
          click_through_rate: number | null
          comment_count: number | null
          company_id: string | null
          content: Json | null
          created_at: string | null
          created_by: string | null
          email_open_rate: number | null
          featured_image_url: string | null
          id: string
          public_slug: string | null
          published_at: string | null
          published_by: string | null
          reaction_count: number | null
          release_date: string | null
          release_type: string | null
          source_document_name: string | null
          source_document_url: string | null
          source_id: string | null
          source_type: string | null
          status: string | null
          tags: string[] | null
          title: string
          unique_views: number | null
          updated_at: string | null
          version: string | null
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_summary?: string | null
          avg_time_spent?: number | null
          category?: string | null
          click_through_rate?: number | null
          comment_count?: number | null
          company_id?: string | null
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          email_open_rate?: number | null
          featured_image_url?: string | null
          id?: string
          public_slug?: string | null
          published_at?: string | null
          published_by?: string | null
          reaction_count?: number | null
          release_date?: string | null
          release_type?: string | null
          source_document_name?: string | null
          source_document_url?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          unique_views?: number | null
          updated_at?: string | null
          version?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_summary?: string | null
          avg_time_spent?: number | null
          category?: string | null
          click_through_rate?: number | null
          comment_count?: number | null
          company_id?: string | null
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          email_open_rate?: number | null
          featured_image_url?: string | null
          id?: string
          public_slug?: string | null
          published_at?: string | null
          published_by?: string | null
          reaction_count?: number | null
          release_date?: string | null
          release_type?: string | null
          source_document_name?: string | null
          source_document_url?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          unique_views?: number | null
          updated_at?: string | null
          version?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "releases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          company_id: string | null
          confirmed: boolean | null
          email: string
          id: string
          metadata: Json | null
          referral_code: string | null
          referred_by: string | null
          subscribed_at: string | null
        }
        Insert: {
          company_id?: string | null
          confirmed?: boolean | null
          email: string
          id?: string
          metadata?: Json | null
          referral_code?: string | null
          referred_by?: string | null
          subscribed_at?: string | null
        }
        Update: {
          company_id?: string | null
          confirmed?: boolean | null
          email?: string
          id?: string
          metadata?: Json | null
          referral_code?: string | null
          referred_by?: string | null
          subscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      team_activities: {
        Row: {
          activity_type: string
          company_id: string
          created_at: string
          description: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          company_id: string
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          company_id?: string
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          company_id: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          role: string
          status: string | null
          token: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role: string
          status?: string | null
          token?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role?: string
          status?: string | null
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          company_id: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_company_inbox_email: {
        Args: { company_uuid: string }
        Returns: string
      }
      generate_changelog_slug: {
        Args: { title: string; company_id: string }
        Returns: string
      }
      get_user_company_from_team_members: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_company_id: {
        Args: { user_id?: string }
        Returns: string
      }
      upsert_branding_info: {
        Args: {
          user_uuid: string
          brand_primary_color?: string
          brand_secondary_color?: string
          brand_font_family?: string
        }
        Returns: Json
      }
      upsert_company_info: {
        Args: {
          user_uuid: string
          company_name?: string
          company_domain?: string
          company_team_size?: string
          company_industry?: string
        }
        Returns: Json
      }
      upsert_profile_info: {
        Args: { user_uuid: string; user_full_name?: string; user_role?: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
