import * as z from "zod"

export const newUserSchema = z.object({
  email: z.string().email(),
  primary_contact_name: z.string().min(2),
  company_name: z.string().min(2),
  phone: z.string().optional(),
  industry_type: z.string().optional(),
  company_size: z.string().optional(),
  is_admin: z.boolean().default(false),
  business_email: z.string().email().optional(),
  website: z.string().optional(),
  founded_year: z.number().optional(),
  business_address: z.string().optional(),
  timezone: z.string().optional(),
  services_offered: z.array(z.string()).optional(),
  primary_markets: z.array(z.string()).optional(),
  company_description: z.string().optional(),
})

export type NewUserFormValues = z.infer<typeof newUserSchema> 