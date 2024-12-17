'use client'

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { createClient } from "@/libs/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Contact, Globe, LinkIcon, Settings, Store } from 'lucide-react'

const formSchema = z.object({
  // Company Information
  company_name: z.string().min(2),
  business_email: z.string().email(),
  website: z.string().url().optional().or(z.literal('')),
  company_size: z.string().optional(),
  industry_type: z.string().optional(),
  founded_year: z.coerce.number().min(1800).max(new Date().getFullYear()).optional(),
  
  // Contact Information
  primary_contact_name: z.string(),
  phone: z.string().optional(),
  business_address: z.string().optional(),
  timezone: z.string().optional(),
  
  // Company Details
  company_logo: z.string().optional().or(z.literal('')),
  services_offered: z.string().optional(),
  primary_markets: z.string().optional().default(''),
  company_description: z.string().optional(),
  
  // Subscription Details - these should be read-only
  subscription_status: z.string().optional(),
  subscription_id: z.string().optional(),
  stripe_customer_id: z.string().optional(),
  settings: z.string().optional(),  // JSON string
  
  // Social Media - all optional
  linkedin_url: z.string().url().optional().or(z.literal('')),
  facebook_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  tiktok_url: z.string().url().optional().or(z.literal('')),
  youtube_url: z.string().url().optional().or(z.literal(''))
})

export default function ProfilePage() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      company_name: '',
      business_email: '',
      website: '',
      company_size: '',
      industry_type: '',
      founded_year: undefined,
      primary_contact_name: '',
      phone: '',
      business_address: '',
      timezone: '',
      company_logo: '',
      services_offered: '',
      primary_markets: '',
      company_description: '',
      subscription_status: '',
      subscription_id: '',
      stripe_customer_id: '',
      settings: '',
      linkedin_url: '',
      facebook_url: '',
      twitter_url: '',
      tiktok_url: '',
      youtube_url: ''
    }
  })

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (profile) {
          form.reset({
            ...profile,
            services_offered: profile.services_offered?.join(', ') || '',
            primary_markets: profile.primary_markets?.join(', ') || '',
            settings: JSON.stringify(profile.settings || {})
          })
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    getProfile()
  }, [supabase, form])

  if (isLoading) {
    return <div>Loading...</div>
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const formattedValues = {
        ...values,
        services_offered: values.services_offered ? values.services_offered.split(',').map(s => s.trim()) : [],
        primary_markets: values.primary_markets ? values.primary_markets.split(',').map(s => s.trim()) : [], // Convert string to array
        settings: values.settings ? JSON.parse(values.settings) : {},
        ...(values.founded_year && { founded_year: Number(values.founded_year) })
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formattedValues
        })

      if (error) throw error

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Basic information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@acme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://acme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501+">501+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="founded_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Contact className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Contact details for your company
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="primary_contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Business St, Suite 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Halifax">Atlantic Time (AT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Berlin">Central European Time (CET)</SelectItem>
                        <SelectItem value="Europe/Moscow">Moscow (MSK)</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                        <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                        <SelectItem value="Pacific/Auckland">New Zealand (NZST)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Company Details
              </CardTitle>
              <CardDescription>
                Additional information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="company_logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="services_offered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services Offered</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your services..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about your company..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="primary_markets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Markets</FormLabel>
                    <FormControl>
                      <Input placeholder="North America, Europe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media
              </CardTitle>
              <CardDescription>
                Your company&apos;s social media presence
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/company/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tiktok_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://tiktok.com/@..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtube_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/c/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

