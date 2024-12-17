'use client'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OnboardingData } from '@/types'

const formSchema = z.object({
  company_size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']),
  industry_type: z.string().min(2, "Industry type is required"),
  founded_year: z.string().min(4, "Please enter a valid year"),
  business_address: z.string().min(5, "Business address is required"),
})

type Step2Props = {
  data: Partial<OnboardingData>
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
}

export default function Step2CompanyDetails({ data, onNext, onBack }: Step2Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_size: data.company_size || '1-10',
      industry_type: data.industry_type || '',
      founded_year: data.founded_year?.toString() || '',
      business_address: data.business_address || '',
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        onNext({
          ...data,
          founded_year: data.founded_year ? parseInt(data.founded_year) : undefined
        })
      })} className="space-y-8">
        <FormField
          control={form.control}
          name="company_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <SelectItem value="500+">500+ employees</SelectItem>
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
              <FormLabel>Industry/Agency Type</FormLabel>
              <FormControl>
                <Input placeholder="Digital Marketing Agency" {...field} />
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
                <Input 
                  type="number" 
                  placeholder={new Date().getFullYear().toString()} 
                  min="1900"
                  max={new Date().getFullYear()}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="business_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Business St, City, Country" {...field} />
              </FormControl>
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