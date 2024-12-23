export type BusinessType = 'RESTAURANT' | 'RETAIL' | 'SERVICE' | 'OTHER'
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'CHURNED'
export type GHLStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'

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
  is_admin?: boolean
}

export interface ClientDocument {
  id: string
  client_id: string
  name: string
  type: string
  size: number
  path: string
  created_at: string
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
  contact_name: string
  contact_email: string
  contact_phone: string
  website: string
  
  // GHL fields
  ghl_account_id: string
  ghl_location_id: string
  ghl_status: GHLStatus
  ghl_activated_at: string | null
  
  // Tracking fields
  last_contact_date: string | null
  next_review_date: string | null
  engagement_score: number
  products_activated: {
    [key: string]: any
  }
  products_available: {
    [key: string]: any
  }
  notes: string
  billing_status: string
  onboarding_completed_at: string | null
  last_success_metric: {
    [key: string]: any
  }
  
  // Bot and review fields
  reviewr_active: boolean
  reviewr_link: string
  website_bot_active: boolean
  website_bot_link: string
  social_bot_active: boolean
  social_bot_link: string
  onboarding_completed: boolean
  documents?: ClientDocument[];
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
      bots: {
        Row: Bot
        Insert: Omit<Bot, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Bot, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
} 

export interface Product {
  id: string
  name: string
  description: string
  type: string
  features: string[]
  suggested_price: number
  platform_url: string
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
  fillout_form_id?: string
} 

export interface ClientProduct {
  id: string
  client_id: string
  product_id: string
  is_active: boolean
  price: number | null
  created_at: string
  updated_at: string
  product?: Product // For joined queries
} 

export interface Bot {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
} 