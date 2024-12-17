'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/libs/supabase/client'
import type { Client } from '@/types/database'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from './components/OverviewTab'
import { FeaturesTab } from './components/FeaturesTab'
import { DocumentsTab } from './components/DocumentsTab'
import { Button } from "@/components/ui/button"
import { Pencil, ChevronLeft, Loader2 } from "lucide-react"
import Link from 'next/link'

export default function ClientDashboard() {
  const params = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

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
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab client={client} />
        </TabsContent>
        
        <TabsContent value="features">
          <FeaturesTab client={client} />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsTab client={client} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 