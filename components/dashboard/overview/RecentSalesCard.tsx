'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/libs/supabase/client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

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
        .from('clients')
        .select(`
          id,
          company_name,
          created_at,
          client_products!inner(
            price,
            product:products (
              suggested_price
            )
          )
        `)
        .eq('client_products.is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)


      if (clientProducts) {
        // Transform the data to match our Client type
        const transformedClients = clientProducts.reduce((acc: Client[], cp: any) => {
          const existingClient = acc.find(c => c.id === cp.id)
          const totalValue = cp.client_products.reduce((sum: number, product: any) => {
            return sum + (product.price || product.product.suggested_price || 0)
          }, 0)

          if (existingClient) {
            existingClient.monthly_value += totalValue
          } else {
            acc.push({
              id: cp.id,
              company_name: cp.company_name,
              monthly_value: totalValue,
              created_at: cp.created_at
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
        <div className="space-y-4">
          {recentClients.map((client) => (
            <Link 
              href={`/clients/${client.id}`} 
              key={client.id}
              className="flex items-center hover:bg-muted rounded-md p-2 transition-colors"
            >
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
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}