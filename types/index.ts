export * from "./config";
export * from "./database";

// Onboarding specific types
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

// We can remove the Profile type since it's now covered by User in database.ts
