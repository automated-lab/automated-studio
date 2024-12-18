'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from 'lucide-react'

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  suggested_price: z.coerce.number().min(0, "Suggested price must be positive"),
  features: z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
  is_active: z.boolean().default(true)
})

type ProductFormValues = {
  name: string
  description: string
  suggested_price: number
  features: string
  is_active: boolean
}

interface NewProductDialogProps {
  onSuccess?: () => void
}

export function NewProductDialog({ onSuccess }: NewProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      suggested_price: 0,
      features: "",
      is_active: true,
    },
  })

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) throw new Error('Failed to create product')

      toast.success("Product created successfully")
      setOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to create product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="suggested_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggested Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Feature 1, Feature 2, Feature 3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 