'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Phone, Mail, Globe } from 'lucide-react'
import type { Client, ClientStatus } from '@/types/database'

const formatBusinessType = (type: string) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await fetch('/api/clients')
        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error('Failed to load clients:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link href="/clients/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link href={`/clients/${client.id}`} key={client.id}>
              <Card className="hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {client.company_name}
                  </CardTitle>
                  <div className={`px-2 py-1 rounded text-xs ${
                    client.status === ('active' as ClientStatus) ? 'bg-green-100 text-green-800' :
                    client.status === ('paused' as ClientStatus) ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {formatStatus(client.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    {client.contact_name}
                  </div>
                  
                  {client.contact_phone && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                      <Phone className="h-3 w-3" />
                      {client.contact_phone}
                    </div>
                  )}
                  
                  {client.contact_email && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                      <Mail className="h-3 w-3" />
                      {client.contact_email}
                    </div>
                  )}
                  
                  {client.website && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <Globe className="h-3 w-3" />
                      {client.website.replace(/^https?:\/\//, '')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 