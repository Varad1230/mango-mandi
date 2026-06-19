export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          variety: string
          price_per_kg: number
          stock_kg: number
          image_url: string | null
          grade: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          variety: string
          price_per_kg: number
          stock_kg: number
          image_url?: string | null
          grade: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          variety?: string
          price_per_kg?: number
          stock_kg?: number
          image_url?: string | null
          grade?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          phone: string
          city: string
          items: Json
          total: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          phone: string
          city: string
          items: Json
          total: number
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          phone?: string
          city?: string
          items?: Json
          total?: number
          status?: string
          created_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
