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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          id: string
          slug: string
          brand: string
          model: string
          year: number
          transmission: string
          mileage_km: number
          category_id: string | null
          status: 'available' | 'sold'
          description: string | null
          featured: boolean
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          brand: string
          model: string
          year: number
          transmission: string
          mileage_km: number
          category_id?: string | null
          status?: 'available' | 'sold'
          description?: string | null
          featured?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          brand?: string
          model?: string
          year?: number
          transmission?: string
          mileage_km?: number
          category_id?: string | null
          status?: 'available' | 'sold'
          description?: string | null
          featured?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vehicles_category_id_fkey'
            columns: ['category_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      vehicle_images: {
        Row: {
          id: string
          vehicle_id: string
          storage_path: string
          alt_text: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          storage_path: string
          alt_text?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          storage_path?: string
          alt_text?: string | null
          position?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vehicle_images_vehicle_id_fkey'
            columns: ['vehicle_id']
            referencedRelation: 'vehicles'
            referencedColumns: ['id']
          },
        ]
      }
      testimonials: {
        Row: {
          id: string
          display_name: string
          quote: string
          rating: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          display_name: string
          quote: string
          rating: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          quote?: string
          rating?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables = Database['public']['Tables']
export type VehicleRow = Tables['vehicles']['Row']
export type CategoryRow = Tables['categories']['Row']
export type TestimonialRow = Tables['testimonials']['Row']
export type VehicleImageRow = Tables['vehicle_images']['Row']
export type ProfileRow = Tables['profiles']['Row']
