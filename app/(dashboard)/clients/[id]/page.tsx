'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/libs/supabase/client'
import type { Client, ClientProduct } from '@/types/database'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from '../../../../components/clients/OverviewTab'
import { DocumentsTab } from '../../../../components/clients/DocumentsTab'
import { Button } from "@/components/ui/button"
import { Pencil, ChevronLeft, Loader2 } from "lucide-react"
import Link from 'next/link'
import { ProductsTab } from '@/components/clients/ProductsTab'
import { Product } from '@/types/database'

export default function ClientPage() {
  const params = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const [clientProducts, setClientProducts] = useState<ClientProduct[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [])

  useEffect(() => {
    async function fetchClient() {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setClient(data)
      } catch (e) {
        setError('Failed to load client')
        console.error(e)
      }
    }
    fetchClient()
  }, [params.id])

  useEffect(() => {
    const fetchClientProducts = async () => {
      console.log('Fetching client products for:', params.id)
      const res = await fetch(`/api/client-products?clientId=${params.id}`)
      const data = await res.json()
      console.log('Received client products:', data)
      setClientProducts(data)
    }
    
    if (params.id) {
      fetchClientProducts()
    }
  }, [params.id])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL without refresh
    const newUrl = `${window.location.pathname}${value === 'overview' ? '' : `?tab=${value}`}`
    window.history.pushState({}, '', newUrl)
  }

  const refreshClientProducts = async () => {
    const res = await fetch(`/api/client-products?clientId=${params.id}`)
    const data = await res.json()
    setClientProducts(data)
  }

  if (error) return <div className="p-4">{error}</div>
  if (!client) return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{client.company_name}</h1>
        <div className="flex items-center gap-2">
          <Link href="/clients">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </Link>
          <Link href={`/clients/${params.id}/edit`}>
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Client
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products and Services</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab client={client} clientProducts={clientProducts} />
        </TabsContent>
        
        <TabsContent value="products">
          <ProductsTab 
            clientId={client.id} 
            clientProducts={clientProducts} 
            onUpdate={refreshClientProducts}
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsTab client={client} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 