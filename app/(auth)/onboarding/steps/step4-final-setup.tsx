'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  linkedin_url: z.string().optional(),
  facebook_url: z.string().optional(),
  twitter_url: z.string().optional(),
})

type Step4Props = {
  data: any
  onBack: () => void
  onComplete: (data: any) => void
}

export default function Step4FinalSetup({ data, onBack, onComplete }: Step4Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedin_url: data.linkedin_url || '',
      facebook_url: data.facebook_url || '',
      twitter_url: data.twitter_url || '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onComplete(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media Links</h3>
          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
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
                <FormLabel>Facebook</FormLabel>
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
                <FormLabel>Twitter/X</FormLabel>
                <FormControl>
                  <Input placeholder="https://twitter.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Complete Setup</Button>
        </div>
      </form>
    </Form>
  )
} 