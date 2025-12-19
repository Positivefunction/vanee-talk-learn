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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assignment_words: {
        Row: {
          assignment_id: string
          audio_url: string | null
          created_at: string
          id: string
          image_url: string | null
          order_index: number | null
          phoneme: string
          symbol: string | null
          word: string
        }
        Insert: {
          assignment_id: string
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          order_index?: number | null
          phoneme: string
          symbol?: string | null
          word: string
        }
        Update: {
          assignment_id?: string
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          order_index?: number | null
          phoneme?: string
          symbol?: string | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_words_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          child_id: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          due_date: string | null
          id: string
          is_active: boolean | null
          target_phonemes: string[] | null
          therapist_id: string
          title: string
          topic: string
          updated_at: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          id?: string
          is_active?: boolean | null
          target_phonemes?: string[] | null
          therapist_id: string
          title: string
          topic: string
          updated_at?: string
        }
        Update: {
          child_id?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          id?: string
          is_active?: boolean | null
          target_phonemes?: string[] | null
          therapist_id?: string
          title?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attempts: {
        Row: {
          accuracy: number | null
          audio_url: string | null
          created_at: string
          feedback: string | null
          id: string
          is_correct: boolean | null
          phoneme: string
          session_id: string
          transcript: string | null
          word: string
        }
        Insert: {
          accuracy?: number | null
          audio_url?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          is_correct?: boolean | null
          phoneme: string
          session_id: string
          transcript?: string | null
          word: string
        }
        Update: {
          accuracy?: number | null
          audio_url?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          is_correct?: boolean | null
          phoneme?: string
          session_id?: string
          transcript?: string | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      child_profiles: {
        Row: {
          age: number | null
          avatar: string | null
          created_at: string
          current_level: number | null
          display_name: string
          hearts: number | null
          id: string
          parent_id: string | null
          primary_language: string | null
          streak: number | null
          therapist_id: string | null
          updated_at: string
          user_id: string
          xp: number | null
        }
        Insert: {
          age?: number | null
          avatar?: string | null
          created_at?: string
          current_level?: number | null
          display_name: string
          hearts?: number | null
          id?: string
          parent_id?: string | null
          primary_language?: string | null
          streak?: number | null
          therapist_id?: string | null
          updated_at?: string
          user_id: string
          xp?: number | null
        }
        Update: {
          age?: number | null
          avatar?: string | null
          created_at?: string
          current_level?: number | null
          display_name?: string
          hearts?: number | null
          id?: string
          parent_id?: string | null
          primary_language?: string | null
          streak?: number | null
          therapist_id?: string | null
          updated_at?: string
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          child_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          is_public: boolean | null
          therapist_id: string
          title: string
          type: string | null
          video_url: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          therapist_id: string
          title: string
          type?: string | null
          video_url?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          therapist_id?: string
          title?: string
          type?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          accuracy: number | null
          assignment_id: string | null
          child_id: string
          correct_count: number | null
          ended_at: string | null
          id: string
          language: string
          started_at: string
          status: string | null
          strong_phonemes: string[] | null
          total_questions: number | null
          weak_phonemes: string[] | null
          xp_earned: number | null
        }
        Insert: {
          accuracy?: number | null
          assignment_id?: string | null
          child_id: string
          correct_count?: number | null
          ended_at?: string | null
          id?: string
          language: string
          started_at?: string
          status?: string | null
          strong_phonemes?: string[] | null
          total_questions?: number | null
          weak_phonemes?: string[] | null
          xp_earned?: number | null
        }
        Update: {
          accuracy?: number | null
          assignment_id?: string | null
          child_id?: string
          correct_count?: number | null
          ended_at?: string | null
          id?: string
          language?: string
          started_at?: string
          status?: string | null
          strong_phonemes?: string[] | null
          total_questions?: number | null
          weak_phonemes?: string[] | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      soap_notes: {
        Row: {
          assessment: string | null
          child_id: string
          created_at: string
          generated_by_ai: boolean | null
          id: string
          objective: string | null
          plan: string | null
          session_id: string | null
          subjective: string | null
          teletherapy_id: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          assessment?: string | null
          child_id: string
          created_at?: string
          generated_by_ai?: boolean | null
          id?: string
          objective?: string | null
          plan?: string | null
          session_id?: string | null
          subjective?: string | null
          teletherapy_id?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          assessment?: string | null
          child_id?: string
          created_at?: string
          generated_by_ai?: boolean | null
          id?: string
          objective?: string | null
          plan?: string | null
          session_id?: string | null
          subjective?: string | null
          teletherapy_id?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "soap_notes_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soap_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soap_notes_teletherapy_id_fkey"
            columns: ["teletherapy_id"]
            isOneToOne: false
            referencedRelation: "teletherapy_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          child_id: string
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          updated_at: string
        }
        Insert: {
          child_id: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string
        }
        Update: {
          child_id?: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teletherapy_sessions: {
        Row: {
          child_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          meeting_link: string | null
          notes: string | null
          scheduled_at: string
          status: string | null
          therapist_id: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          child_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string | null
          therapist_id: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string | null
          therapist_id?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teletherapy_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "child" | "therapist" | "parent"
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
      app_role: ["child", "therapist", "parent"],
    },
  },
} as const
