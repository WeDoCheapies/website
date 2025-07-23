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
      cars: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          features: string | null
          fuel_type: string
          id: string
          image_url: string | null
          image_urls: string | null
          make: string
          mileage: number
          model: string
          price: number
          status: string
          transmission: string
          updated_at: string | null
          year: number
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          features?: string | null
          fuel_type: string
          id?: string
          image_url?: string | null
          image_urls?: string | null
          make: string
          mileage: number
          model: string
          price: number
          status?: string
          transmission: string
          updated_at?: string | null
          year: number
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          features?: string | null
          fuel_type?: string
          id?: string
          image_url?: string | null
          image_urls?: string | null
          make?: string
          mileage?: number
          model?: string
          price?: number
          status?: string
          transmission?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      customers: {
        Row: {
          car_registration: string | null
          created_at: string
          created_by: string | null
          email: string
          id: string
          last_redeemed_at: string | null
          last_visit: string | null
          name: string
          phone: string
          updated_at: string
          wash_count: number
        }
        Insert: {
          car_registration?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          last_redeemed_at?: string | null
          last_visit?: string | null
          name: string
          phone: string
          updated_at?: string
          wash_count?: number
        }
        Update: {
          car_registration?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          last_redeemed_at?: string | null
          last_visit?: string | null
          name?: string
          phone?: string
          updated_at?: string
          wash_count?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          customer_id: string
          id: string
          is_primary: boolean
          make: string | null
          model: string | null
          registration: string
          updated_at: string
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_primary?: boolean
          make?: string | null
          model?: string | null
          registration: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_primary?: boolean
          make?: string | null
          model?: string | null
          registration?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      wash_types: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          price_bakkie_suv: number
          price_small_car: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          price_bakkie_suv: number
          price_small_car: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          price_bakkie_suv?: number
          price_small_car?: number
          updated_at?: string
        }
        Relationships: []
      }
      washes: {
        Row: {
          added_by: string | null
          car_type: string
          created_at: string
          customer_id: string
          id: string
          performed_at: string
          price: number
          updated_at: string
          vehicle_id: string | null
          was_free: boolean
          wash_type_id: string
        }
        Insert: {
          added_by?: string | null
          car_type: string
          created_at?: string
          customer_id: string
          id?: string
          performed_at?: string
          price: number
          updated_at?: string
          vehicle_id?: string | null
          was_free?: boolean
          wash_type_id: string
        }
        Update: {
          added_by?: string | null
          car_type?: string
          created_at?: string
          customer_id?: string
          id?: string
          performed_at?: string
          price?: number
          updated_at?: string
          vehicle_id?: string | null
          was_free?: boolean
          wash_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "washes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "washes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "washes_wash_type_id_fkey"
            columns: ["wash_type_id"]
            isOneToOne: false
            referencedRelation: "wash_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_counter: {
        Args: { row_id: string }
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
