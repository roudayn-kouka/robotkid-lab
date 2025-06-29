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
      analytics: {
        Row: {
          avg_duration: unknown | null
          avg_moves: number | null
          date: string
          game_id: string | null
          id: string
          plays: number | null
          success_rate: number | null
        }
        Insert: {
          avg_duration?: unknown | null
          avg_moves?: number | null
          date: string
          game_id?: string | null
          id?: string
          plays?: number | null
          success_rate?: number | null
        }
        Update: {
          avg_duration?: unknown | null
          avg_moves?: number | null
          date?: string
          game_id?: string | null
          id?: string
          plays?: number | null
          success_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      circuit_cells: {
        Row: {
          cell_type: string
          content: string | null
          game_id: string | null
          id: string
          image_url: string | null
          position_x: number
          position_y: number
        }
        Insert: {
          cell_type: string
          content?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
          position_x: number
          position_y: number
        }
        Update: {
          cell_type?: string
          content?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
          position_x?: number
          position_y?: number
        }
        Relationships: [
          {
            foreignKeyName: "circuit_cells_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          duration: unknown | null
          end_time: string | null
          game_id: string | null
          id: string
          moves: number | null
          start_time: string | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          duration?: unknown | null
          end_time?: string | null
          game_id?: string | null
          id?: string
          moves?: number | null
          start_time?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          duration?: unknown | null
          end_time?: string | null
          game_id?: string | null
          id?: string
          moves?: number | null
          start_time?: string | null
          success?: boolean | null
          user_id?: string | null
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
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          circuit_path_cells: number
          columns: number
          created_at: string | null
          id: string
          informative_cells: number
          max_moves: number
          name: string
          rows: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          circuit_path_cells: number
          columns: number
          created_at?: string | null
          id?: string
          informative_cells: number
          max_moves: number
          name: string
          rows: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          circuit_path_cells?: number
          columns?: number
          created_at?: string | null
          id?: string
          informative_cells?: number
          max_moves?: number
          name?: string
          rows?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          created_at: string | null
          id: number
          is_complete: boolean | null
          task: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_complete?: boolean | null
          task: string
        }
        Update: {
          created_at?: string | null
          id?: number
          is_complete?: boolean | null
          task?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
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
