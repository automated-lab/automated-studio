'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/libs/supabase/client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const supabase = createClient()

type Client = {
  id: string
  company_name: string
  monthly_value: number
  created_at: string
}

export function RecentSales() {
  const [recentClients, setRecentClients] = useState<Client[]>([])

  useEffect(() => {
    async function fetchRecentClients() {
      const { data: clientProducts } = await supabase
        .from('client_products')
        .select(`
          client:clients (
            id,
            company_name,
            created_at
          ),
          price,
          product:products (
            suggested_price
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)

      if (clientProducts) {
        // Transform the data to match our Client type
        const transformedClients = clientProducts.reduce((acc: Client[], cp: any) => {
          const existingClient = acc.find(c => c.id === cp.client.id)
          const value = cp.price || cp.product.suggested_price || 0

          if (existingClient) {
            existingClient.monthly_value += value
          } else {
            acc.push({
              id: cp.client.id,
              company_name: cp.client.company_name,
              monthly_value: value,
              created_at: cp.client.created_at
            })
          }
          return acc
        }, [])

        setRecentClients(transformedClients)
      }
    }

    fetchRecentClients()
  }, [])

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made {recentClients.length} sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentClients.map((client) => (
            <div key={client.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {client.company_name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{client.company_name}</p>
              </div>
              <div className="ml-auto font-medium">
                +${client.monthly_value.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}