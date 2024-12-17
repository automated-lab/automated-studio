'use client'

import { useEffect, useState } from 'react'
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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OnboardingData } from '@/types'

const formSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
  phone: z.string().min(5, "Phone number is required"),
  company_description: z.string().min(10, "Please provide a brief description"),
  services_offered: z.array(z.string()).min(1, "Please select at least one service"),
})

const SERVICE_OPTIONS = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Digital Marketing",
  "SEO",
  "Content Creation",
  "Social Media Management",
  "Consulting",
  "E-commerce",
  "Other"
]

type Step3Props = {
  data: Partial<OnboardingData>
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
}

export default function Step3AdditionalInfo({ data, onNext, onBack }: Step3Props) {
  const [timezones, setTimezones] = useState<string[]>([])
  
  useEffect(() => {
    setTimezones(Intl.supportedValuesOf('timeZone'))
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timezone: data.timezone || '',
      phone: data.phone || '',
      company_description: data.company_description || '',
      services_offered: data.services_offered || [],
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 000-0000" {...field} />
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
                <Textarea 
                  placeholder="Tell us about your company..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of your company and what you do
              </FormDescription>
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
              <div className="grid grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((service) => (
                  <label
                    key={service}
                    className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={field.value?.includes(service)}
                      onChange={(e) => {
                        const updatedServices = e.target.checked
                          ? [...(field.value || []), service]
                          : field.value?.filter((s) => s !== service) || []
                        field.onChange(updatedServices)
                      }}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Go Back
          </Button>
          <Button type="submit">
            Next Step
          </Button>
        </div>
      </form>
    </Form>
  )
} 