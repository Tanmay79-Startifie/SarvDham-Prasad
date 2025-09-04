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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          last_used_at: string | null
          name: string
          permissions: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          last_used_at?: string | null
          name: string
          permissions?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string
          content: string
          created_at: string
          error_message: string | null
          id: string
          order_id: string | null
          recipient: string
          sent_at: string | null
          status: string | null
          subject: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          channel: string
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          order_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          order_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          special_instructions: string | null
          total_price_cents: number
          unit_price_cents: number
          weight: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          special_instructions?: string | null
          total_price_cents: number
          unit_price_cents: number
          weight?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          special_instructions?: string | null
          total_price_cents?: number
          unit_price_cents?: number
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          city: string
          created_at: string
          currency: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_address_json: Json | null
          delivery_date: string | null
          delivery_fee: number | null
          delivery_instructions: string | null
          discount_amount: number | null
          estimated_delivery_time: string | null
          id: string
          notes: string | null
          order_date: string
          order_status: string | null
          payment_id: string | null
          payment_status: string | null
          pincode: string
          product_id: string
          quantity: number
          rider_id: string | null
          tax_amount: number | null
          tip_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
          weight: string
        }
        Insert: {
          city: string
          created_at?: string
          currency?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_address_json?: Json | null
          delivery_date?: string | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          discount_amount?: number | null
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          order_status?: string | null
          payment_id?: string | null
          payment_status?: string | null
          pincode: string
          product_id: string
          quantity?: number
          rider_id?: string | null
          tax_amount?: number | null
          tip_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
          weight: string
        }
        Update: {
          city?: string
          created_at?: string
          currency?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          delivery_address_json?: Json | null
          delivery_date?: string | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          discount_amount?: number | null
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          order_status?: string | null
          payment_id?: string | null
          payment_status?: string | null
          pincode?: string
          product_id?: string
          quantity?: number
          rider_id?: string | null
          tax_amount?: number | null
          tip_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
          weight?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          gateway: Database["public"]["Enums"]["payment_gateway"]
          gateway_customer_id: string | null
          gateway_fee_cents: number | null
          gateway_payment_id: string
          id: string
          order_id: string
          payment_method_details: Json | null
          receipt_url: string | null
          refund_reason: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          gateway: Database["public"]["Enums"]["payment_gateway"]
          gateway_customer_id?: string | null
          gateway_fee_cents?: number | null
          gateway_payment_id: string
          id?: string
          order_id: string
          payment_method_details?: Json | null
          receipt_url?: string | null
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          gateway?: Database["public"]["Enums"]["payment_gateway"]
          gateway_customer_id?: string | null
          gateway_fee_cents?: number | null
          gateway_payment_id?: string
          id?: string
          order_id?: string
          payment_method_details?: Json | null
          receipt_url?: string | null
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          prep_time_minutes: number | null
          sku: string | null
          stock_quantity: number | null
          tax_rate: number | null
          temple_id: string | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string
          weights: Json | null
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          prep_time_minutes?: number | null
          sku?: string | null
          stock_quantity?: number | null
          tax_rate?: number | null
          temple_id?: string | null
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string
          weights?: Json | null
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          prep_time_minutes?: number | null
          sku?: string | null
          stock_quantity?: number | null
          tax_rate?: number | null
          temple_id?: string | null
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string
          weights?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          addresses: Json | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          addresses?: Json | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          addresses?: Json | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount_cents: number
          created_at: string
          gateway_refund_id: string | null
          id: string
          order_id: string
          payment_id: string
          processed_by: string | null
          reason: string | null
          status: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          gateway_refund_id?: string | null
          id?: string
          order_id: string
          payment_id: string
          processed_by?: string | null
          reason?: string | null
          status?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          gateway_refund_id?: string | null
          id?: string
          order_id?: string
          payment_id?: string
          processed_by?: string | null
          reason?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      temples: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location_id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location_id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "temples_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      user_exists: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      order_status:
        | "CREATED"
        | "PAID"
        | "PREPARING"
        | "OUT_FOR_DELIVERY"
        | "DELIVERED"
        | "CANCELLED"
        | "REFUNDED"
      payment_gateway: "stripe" | "razorpay" | "paypal"
      payment_status:
        | "pending"
        | "succeeded"
        | "failed"
        | "refunded"
        | "partially_refunded"
      product_type: "prasad" | "spiritual_products"
      user_role: "user" | "admin" | "rider"
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
      order_status: [
        "CREATED",
        "PAID",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ],
      payment_gateway: ["stripe", "razorpay", "paypal"],
      payment_status: [
        "pending",
        "succeeded",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      product_type: ["prasad", "spiritual_products"],
      user_role: ["user", "admin", "rider"],
    },
  },
} as const
