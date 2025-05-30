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
      candidate_skills: {
        Row: {
          candidate_id: string | null
          id: string
          proficiency_level: number | null
          skill_id: string | null
          years_experience: number | null
        }
        Insert: {
          candidate_id?: string | null
          id?: string
          proficiency_level?: number | null
          skill_id?: string | null
          years_experience?: number | null
        }
        Update: {
          candidate_id?: string | null
          id?: string
          proficiency_level?: number | null
          skill_id?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          availability:
            | Database["public"]["Enums"]["availability_status"]
            | null
          created_at: string
          email: string
          experience_years: number | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          name: string
          portfolio_url: string | null
          status: Database["public"]["Enums"]["candidate_status"] | null
          summary: string | null
          title: string
          updated_at: string
          verification_score: number | null
          verified: boolean | null
        }
        Insert: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          created_at?: string
          email: string
          experience_years?: number | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name: string
          portfolio_url?: string | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
          summary?: string | null
          title: string
          updated_at?: string
          verification_score?: number | null
          verified?: boolean | null
        }
        Update: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          created_at?: string
          email?: string
          experience_years?: number | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string
          portfolio_url?: string | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
          summary?: string | null
          title?: string
          updated_at?: string
          verification_score?: number | null
          verified?: boolean | null
        }
        Relationships: []
      }
      outreach_campaigns: {
        Row: {
          candidate_id: string | null
          content: string
          created_at: string
          id: string
          responded_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["outreach_status"] | null
          subject: string
          template_id: string | null
        }
        Insert: {
          candidate_id?: string | null
          content: string
          created_at?: string
          id?: string
          responded_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["outreach_status"] | null
          subject: string
          template_id?: string | null
        }
        Update: {
          candidate_id?: string | null
          content?: string
          created_at?: string
          id?: string
          responded_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["outreach_status"] | null
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_campaigns_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "outreach_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_type: string | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_type?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_type?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          candidate_id: string | null
          content_text: string | null
          file_size: number | null
          filename: string
          id: string
          parsed_data: Json | null
          parsing_confidence: number | null
          parsing_flags: string[] | null
          uploaded_at: string
        }
        Insert: {
          candidate_id?: string | null
          content_text?: string | null
          file_size?: number | null
          filename: string
          id?: string
          parsed_data?: Json | null
          parsing_confidence?: number | null
          parsing_flags?: string[] | null
          uploaded_at?: string
        }
        Update: {
          candidate_id?: string | null
          content_text?: string | null
          file_size?: number | null
          filename?: string
          id?: string
          parsed_data?: Json | null
          parsing_confidence?: number | null
          parsing_flags?: string[] | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      search_queries: {
        Row: {
          completed_at: string | null
          created_at: string
          filters: Json | null
          id: string
          query_text: string
          result_count: number | null
          status: Database["public"]["Enums"]["search_status"] | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          filters?: Json | null
          id?: string
          query_text: string
          result_count?: number | null
          status?: Database["public"]["Enums"]["search_status"] | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          filters?: Json | null
          id?: string
          query_text?: string
          result_count?: number | null
          status?: Database["public"]["Enums"]["search_status"] | null
        }
        Relationships: []
      }
      search_results: {
        Row: {
          anonymized: boolean | null
          candidate_id: string | null
          created_at: string
          id: string
          ranking_position: number | null
          relevance_score: number | null
          search_query_id: string | null
        }
        Insert: {
          anonymized?: boolean | null
          candidate_id?: string | null
          created_at?: string
          id?: string
          ranking_position?: number | null
          relevance_score?: number | null
          search_query_id?: string | null
        }
        Update: {
          anonymized?: boolean | null
          candidate_id?: string | null
          created_at?: string
          id?: string
          ranking_position?: number | null
          relevance_score?: number | null
          search_query_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_results_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_results_search_query_id_fkey"
            columns: ["search_query_id"]
            isOneToOne: false
            referencedRelation: "search_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      availability_status:
        | "actively_looking"
        | "open_to_offers"
        | "contract_only"
        | "not_available"
      candidate_status: "active" | "inactive" | "hired" | "withdrawn"
      outreach_status: "draft" | "sent" | "responded" | "no_response"
      search_status: "in_progress" | "completed" | "failed"
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
    Enums: {
      availability_status: [
        "actively_looking",
        "open_to_offers",
        "contract_only",
        "not_available",
      ],
      candidate_status: ["active", "inactive", "hired", "withdrawn"],
      outreach_status: ["draft", "sent", "responded", "no_response"],
      search_status: ["in_progress", "completed", "failed"],
    },
  },
} as const
