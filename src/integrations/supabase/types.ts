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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      classes: {
        Row: {
          class_code: string
          created_at: string | null
          establishment_id: string | null
          id: string
          name: string
          teacher_id: string | null
        }
        Insert: {
          class_code?: string
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          name: string
          teacher_id?: string | null
        }
        Update: {
          class_code?: string
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          name?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          city: string
          created_at: string | null
          id: string
          name: string
          region: string
          user_count: number | null
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          name: string
          region: string
          user_count?: number | null
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          name?: string
          region?: string
          user_count?: number | null
        }
        Relationships: []
      }
      game_cells: {
        Row: {
          audio_url: string | null
          cell_type: Database["public"]["Enums"]["cell_type"]
          column_index: number
          content: string | null
          created_at: string | null
          game_id: string | null
          id: string
          image_url: string | null
          is_obstacle: boolean | null
          row_index: number
        }
        Insert: {
          audio_url?: string | null
          cell_type: Database["public"]["Enums"]["cell_type"]
          column_index: number
          content?: string | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
          is_obstacle?: boolean | null
          row_index: number
        }
        Update: {
          audio_url?: string | null
          cell_type?: Database["public"]["Enums"]["cell_type"]
          column_index?: number
          content?: string | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
          is_obstacle?: boolean | null
          row_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_cells_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          completed_at: string | null
          completion_time: unknown | null
          game_id: string | null
          id: string
          is_completed: boolean | null
          is_successful: boolean | null
          moves_used: number
          started_at: string | null
          student_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_time?: unknown | null
          game_id?: string | null
          id?: string
          is_completed?: boolean | null
          is_successful?: boolean | null
          moves_used: number
          started_at?: string | null
          student_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_time?: unknown | null
          game_id?: string | null
          id?: string
          is_completed?: boolean | null
          is_successful?: boolean | null
          moves_used?: number
          started_at?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          columns: number
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_published: boolean | null
          max_moves: number
          name: string
          rows: number
          updated_at: string | null
        }
        Insert: {
          columns?: number
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          max_moves?: number
          name: string
          rows?: number
          updated_at?: string | null
        }
        Update: {
          columns?: number
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          max_moves?: number
          name?: string
          rows?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_student_relations: {
        Row: {
          created_at: string | null
          id: string
          parent_id: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          parent_id?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          parent_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_student_relations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_student_relations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_game_cells: {
        Row: {
          audio_url: string | null
          cell_type: string
          content: string | null
          created_at: string | null
          game_id: string | null
          id: string
          image_url: string | null
          path_order: number | null
          x: number
          y: number
        }
        Insert: {
          audio_url?: string | null
          cell_type: string
          content?: string | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
          path_order?: number | null
          x: number
          y: number
        }
        Update: {
          audio_url?: string | null
          cell_type?: string
          content?: string | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
          path_order?: number | null
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "saved_game_cells_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "saved_games"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_games: {
        Row: {
          created_at: string | null
          creator_id: string | null
          description: string | null
          grid_columns: number
          grid_rows: number
          id: string
          is_published: boolean | null
          max_moves: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          grid_columns?: number
          grid_rows?: number
          id?: string
          is_published?: boolean | null
          max_moves?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          grid_columns?: number
          grid_rows?: number
          id?: string
          is_published?: boolean | null
          max_moves?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_games_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_informative_cells: {
        Row: {
          audio_url: string | null
          cell_id: string
          content: string | null
          created_at: string | null
          game_id: string | null
          id: string
          image_url: string | null
        }
        Insert: {
          audio_url?: string | null
          cell_id: string
          content?: string | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
        }
        Update: {
          audio_url?: string | null
          cell_id?: string
          content?: string | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_informative_cells_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "saved_games"
            referencedColumns: ["id"]
          },
        ]
      }
      student_game_log: {
        Row: {
          class_code: string
          created_at: string
          event_data: Json
          event_type: string
          log_id: string
          student_id: string | null
          student_name: string
        }
        Insert: {
          class_code: string
          created_at?: string
          event_data: Json
          event_type: string
          log_id?: string
          student_id?: string | null
          student_name: string
        }
        Update: {
          class_code?: string
          created_at?: string
          event_data?: Json
          event_type?: string
          log_id?: string
          student_id?: string | null
          student_name?: string
        }
        Relationships: []
      }
      student_performances: {
        Row: {
          average_completion_time: unknown | null
          best_score: number | null
          created_at: string | null
          game_id: string | null
          id: string
          last_played_at: string | null
          student_id: string | null
          successful_attempts: number | null
          total_attempts: number | null
          updated_at: string | null
        }
        Insert: {
          average_completion_time?: unknown | null
          best_score?: number | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          last_played_at?: string | null
          student_id?: string | null
          successful_attempts?: number | null
          total_attempts?: number | null
          updated_at?: string | null
        }
        Update: {
          average_completion_time?: unknown | null
          best_score?: number | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          last_played_at?: string | null
          student_id?: string | null
          successful_attempts?: number | null
          total_attempts?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_performances_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_performances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          class_id: string | null
          created_at: string | null
          full_name: string
          id: string
          student_code: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          student_code?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          student_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_new_game: {
        Args: {
          game_name: string
          max_moves: number
          circuit_cells: number
          info_cells: number
          rows: number
          cols: number
        }
        Returns: string
      }
      generate_class_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_student_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_code: {
        Args: { prefix: string; length?: number }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_game_performance: {
        Args: { days_param: number }
        Returns: {
          game_id: string
          game_name: string
          total_plays: number
          success_rate: number
          avg_moves: number
        }[]
      }
      record_game_session: {
        Args: {
          game_id: string
          is_success: boolean
          move_count: number
          session_duration: unknown
        }
        Returns: undefined
      }
      save_complete_game: {
        Args: {
          game_name: string
          game_description: string
          max_moves_count: number
          grid_rows: number
          grid_cols: number
          grid_cells: Json
          info_cells: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "parent"
      cell_type: "start" | "end" | "obstacle" | "circuit" | "informative"
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
      app_role: ["admin", "teacher", "parent"],
      cell_type: ["start", "end", "obstacle", "circuit", "informative"],
    },
  },
} as const
