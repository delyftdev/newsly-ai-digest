export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          category: string | null
          content: string | null
          created_at: string | null
          from_email: string
          from_name: string | null
          html_content: string | null
          id: string
          is_processed: boolean | null
          received_at: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          from_email: string
          from_name?: string | null
          html_content?: string | null
          id?: string
          is_processed?: boolean | null
          received_at?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          from_email?: string
          from_name?: string | null
          html_content?: string | null
          id?: string
          is_processed?: boolean | null
          received_at?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: []
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
      releases: {
        Row: {
          ai_summary: string | null
          category: string | null
          company_id: string | null
          content: Json | null
          created_at: string | null
          created_by: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          release_date: string | null
          release_type: string | null
          source_id: string | null
          source_type: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          version: string | null
          visibility: string | null
        }
        Insert: {
          ai_summary?: string | null
          category?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          release_date?: string | null
          release_type?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          version?: string | null
          visibility?: string | null
        }
        Update: {
          ai_summary?: string | null
          category?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          release_date?: string | null
          release_type?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          version?: string | null
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
          subscribed_at: string | null
        }
        Insert: {
          company_id?: string | null
          confirmed?: boolean | null
          email: string
          id?: string
          subscribed_at?: string | null
        }
        Update: {
          company_id?: string | null
          confirmed?: boolean | null
          email?: string
          id?: string
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
      get_user_company_id: {
        Args: { user_id?: string }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
