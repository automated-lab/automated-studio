export type BusinessType = 'agency' | 'local_business' | 'enterprise' | 'other'
export type ClientStatus = 'active' | 'inactive' | 'paused'
export type GHLStatus = 'none' | 'pending' | 'active'

// Represents a user in our system (from auth.users in Supabase)
export interface User {
  id: string
  created_at: string
  email: string
  company_name: string | null
  business_email: string | null
  website: string | null
  company_size: string | null
  industry_type: string | null
  founded_year: number | null
  primary_contact_name: string | null
  phone: string | null
  business_address: string | null
  timezone: string | null
  company_logo: string | null
  services_offered: string[] | null
  primary_markets: string[] | null
  company_description: string | null
  subscription_status?: string
  stripe_customer_id?: string
}

// Represents a client in our system
export interface Client {
  id: string
  created_at: string
  updated_at: string
  created_by: string // References User.id
  company_name: string
  business_type: BusinessType
  status: ClientStatus
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  
  // GHL fields
  ghl_account_id?: string
  ghl_location_id?: string
  ghl_status: GHLStatus
  ghl_activated_at?: string
  
  // Tracking fields
  last_contact_date?: string
  next_review_date?: string
  engagement_score: number
  products_activated: any[] // jsonb
  products_available: any[] // jsonb
  notes?: string
  billing_status?: string
  onboarding_completed_at?: string
  last_success_metric?: Record<string, any> // jsonb
  
  // Bot and review fields
  reviewr_active: boolean
  reviewr_link?: string
  website_bot_active: boolean
  website_bot_link?: string
  social_bot_active: boolean
  social_bot_link?: string
}

// Database schema type for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: User  // Our user profile data
        Insert: Omit<User, 'id' | 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      clients: {
        Row: Client
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
} 