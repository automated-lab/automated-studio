export * from "./config";

export type Profile = {
  id: string
  company_name: string | null
  business_email: string | null
  website: string | null
  company_size: '1-10' | '11-50' | '51-200' | '201-500' | '500+' | null
  industry_type: string | null
  founded_year: number | null
  primary_contact_name: string | null
  phone: string | null
  business_address: string | null
  timezone: string | null
  company_logo: string | null
  social_media: {
    linkedin?: string
    twitter?: string
  } | null
  services_offered: string[] | null
  primary_markets: string[] | null
  company_description: string | null
}

export type OnboardingData = {
  // Step 1: Basic Info
  company_name: string
  business_email: string
  primary_contact_name: string
  website: string

  // Step 2: Company Details
  company_size: '1-10' | '11-50' | '51-200' | '201-500' | '500+'
  industry_type: string
  founded_year: number
  business_address: string

  // Step 3: Additional Info
  timezone: string
  phone: string
  company_description: string
  services_offered: string[]

  // Step 4: Final Setup
  primary_markets: string[]
  company_logo: string
  linkedin_url?: string
  facebook_url?: string
  twitter_url?: string
  tiktok_url?: string
  youtube_url?: string
}
