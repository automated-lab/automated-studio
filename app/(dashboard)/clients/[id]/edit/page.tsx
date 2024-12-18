'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/libs/supabase/client'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Contact, Globe, BarChart, Settings } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Client } from '@/types/database'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

const formSchema = z.object({
  // Required fields
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  business_type: z.enum(["agency", "local_business", "enterprise", "other"]),
  status: z.enum(["active", "inactive", "paused"]),
  
  // Optional fields with proper handling
  contact_name: z.string().min(2, "Contact name must be at least 2 characters").nullish().transform(val => val || ''),
  contact_email: z.string().email("Invalid email address").nullish().transform(val => val || ''),
  contact_phone: z.string().nullish().transform(val => val || ''),
  website: z.string().url("Invalid URL").optional().or(z.literal('')),
  ghl_account_id: z.string().nullish().transform(val => val || ''),
  ghl_location_id: z.string().nullish().transform(val => val || ''),
  ghl_status: z.enum(["none", "pending", "active"]).default("none"),
  
  // Boolean fields with defaults
  reviewr_active: z.boolean().default(false),
  website_bot_active: z.boolean().default(false),
  social_bot_active: z.boolean().default(false),
  onboarding_completed: z.boolean().default(false),
  
  // Optional fields that can be null
  next_review_date: z.string().nullish().transform(val => val || ''),
  engagement_score: z.coerce.number().min(0).max(100).nullish().transform(val => val || null),
  products_activated: z.string().or(z.array(z.string())).transform(val => 
    Array.isArray(val) ? val.join(', ') : val
  ).nullish().transform(val => val || ''),
  products_available: z.string().or(z.array(z.string())).transform(val => 
    Array.isArray(val) ? val.join(', ') : val
  ).nullish().transform(val => val || ''),
  notes: z.string().nullish().transform(val => val || ''),
  billing_status: z.string().nullish().transform(val => val || '')
})

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  })

  useEffect(() => {
    async function fetchClient() {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) throw error

        // Transform the data for the form
        const formattedData = {
          ...data,
          business_type: data.business_type
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1)
        }
        
        setClient(data)
        form.reset(formattedData)
      } catch (error) {
        setError('Failed to load client')
        console.error(error)
      }
    }
    fetchClient()
  }, [params.id, form])

  if (error) return <div className="p-4">{error}</div>
  if (!client) return <div className="p-4">Loading...</div>

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      // Create a new object with formatted values
      const formattedValues = {
        ...values,
        // Remove next_review_date if it's empty
        next_review_date: values.next_review_date || null,
        // Convert engagement_score to number if it exists
        engagement_score: values.engagement_score ? Number(values.engagement_score) : null
      }

      console.log('Submitting values:', formattedValues)
      
      const { error } = await supabase
        .from('clients')
        .update(formattedValues)
        .eq('id', params.id)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      toast.success('Client updated successfully')
      router.push(`/clients/${params.id}`)
      router.refresh()
    } catch (error) {
      toast.error('Failed to update client')
      console.error('Update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      console.log('Sending delete request for client:', params.id)
      
      const res = await fetch(`/api/clients?id=${params.id}`, {
        method: 'DELETE',
      })
      
      const data = await res.json()
      console.log('Delete response:', data)
      
      if (!res.ok) throw new Error(data.error || 'Failed to delete client')
      
      toast.success('Client deleted successfully')
      router.push('/clients')
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete client')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editing {client.company_name}</h1>
        <Link href={`/clients/${params.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           {/* Basic Information */}
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the basic details about the client
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
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
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="business_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="agency">Agency</SelectItem>
                          <SelectItem value="local_business">Local Business</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.example.com" {...field} />
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
                Enter the contact details for the client
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </CardContent>
          </Card>

          {/* Products and Services Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Products and Services
              </CardTitle>
              <CardDescription>
                Enter the products and services for the client
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="ghl_account_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GHL Account ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ghl_location_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GHL Location ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="ghl_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GHL Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select GHL status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reviewr_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Review Management</FormLabel>
                      <FormDescription>
                        Enable review management for this client
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website_bot_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Website Chatbots</FormLabel>
                      <FormDescription>
                        Enable website chatbots for this client
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="social_bot_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Social Media Chatbots</FormLabel>
                      <FormDescription>
                        Enable social media chatbots for this client
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Smart Fields for Upselling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Smart Fields for Upselling
              </CardTitle>
              <CardDescription>
                Enter information to help with upselling opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="next_review_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Review Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="engagement_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engagement Score (0-100)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="products_activated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products Activated</FormLabel>
                    <FormControl>
                      <Input placeholder="Product1, Product2, Product3" {...field} />
                    </FormControl>
                    <FormDescription>Enter comma-separated list of activated products</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="products_available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products Available</FormLabel>
                    <FormControl>
                      <Input placeholder="Product4, Product5, Product6" {...field} />
                    </FormControl>
                    <FormDescription>Enter comma-separated list of available products</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Additional Information
              </CardTitle>
              <CardDescription>
                Enter any additional details about the client
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional notes here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billing_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Status</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="onboarding_completed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Onboarding Completed</FormLabel>
                      <FormDescription>
                        Mark if the client has completed onboarding
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Client
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the client
                    and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Client"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
