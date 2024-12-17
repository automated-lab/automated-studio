'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/libs/supabase/client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { OnboardingData } from '@/types'

const formSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  business_email: z.string().email("Valid email is required"),
  primary_contact_name: z.string().min(2, "Contact name is required"),
  website: z.string().url("Please enter a valid URL").optional(),
})

type Step1Props = {
  data: Partial<OnboardingData>
  onNext: (data: Partial<OnboardingData>) => void
}

export default function Step1BasicInfo({ data, onNext }: Step1Props) {
  const [userEmail, setUserEmail] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUser()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: data.company_name || '',
      business_email: data.business_email || userEmail,
      primary_contact_name: data.primary_contact_name || '',
      website: data.website || 'https://',
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
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
                <Input type="email" placeholder="contact@acme.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex justify-end">
          <Button type="submit">
            Next Step
          </Button>
        </div>
      </form>
    </Form>
  )
} 