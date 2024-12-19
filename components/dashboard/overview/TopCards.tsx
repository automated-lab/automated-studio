'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useContext, useEffect, useState } from "react"
import { createClient } from "@/libs/supabase/client"
import { DashboardContext } from "@/contexts/DashboardContext"
const supabase = createClient()

type ClientProduct = {
  is_active: boolean;
  price: number | null;
  product: {
    suggested_price: number;
  };
}

export function TopCards() {
  const { setMetrics } = useContext(DashboardContext)
  const [clientCount, setClientCount] = useState(0)
  const [clientChange, setClientChange] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [revenueChange, setRevenueChange] = useState(0)
  const [activeProducts, setActiveProducts] = useState(0)
  const [productsChange, setProductsChange] = useState(0)
  const [activeNow, setActiveNow] = useState(0)

  useEffect(() => {
    async function fetchClients() {
      const { count } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      if (count !== null) {
        setClientCount(count)
      }
    }

    fetchClients()
  }, [])

  useEffect(() => {
    async function fetchRevenue() {
      const { data: clientProducts } = await supabase
        .from('client_products')
        .select<any, ClientProduct>(`
          is_active,
          price,
          product:products (suggested_price)
        `)
        .eq('is_active', true)

      if (clientProducts) {
        const total = clientProducts.reduce((sum, cp) => 
          sum + (cp.price || cp.product.suggested_price || 0), 0)
        setTotalRevenue(total)
      }
    }

    fetchRevenue()
  }, [])

  useEffect(() => {
    async function fetchActiveProducts() {
      const { count } = await supabase
        .from('client_products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      if (count !== null) {
        setActiveProducts(count)
      }
    }

    fetchActiveProducts()
  }, [])

  useEffect(() => {
    async function fetchRevenueGrowth() {
      const firstDayLastMonth = new Date()
      firstDayLastMonth.setMonth(firstDayLastMonth.getMonth() - 1)
      firstDayLastMonth.setDate(1)

      const { data: currentProducts } = await supabase
        .from('client_products')
        .select<any, ClientProduct>(`
          is_active,
          price,
          product:products (suggested_price),
          created_at
        `)
        .eq('is_active', true)

      const { data: lastMonthProducts } = await supabase
        .from('client_products')
        .select<any, ClientProduct>(`
          is_active,
          price,
          product:products (suggested_price),
          created_at
        `)
        .eq('is_active', true)
        .lt('created_at', firstDayLastMonth.toISOString())

      if (currentProducts && lastMonthProducts) {
        const currentRevenue = currentProducts.reduce((sum, cp) => 
          sum + (cp.price || cp.product.suggested_price || 0), 0)
        const lastMonthRevenue = lastMonthProducts.reduce((sum, cp) => 
          sum + (cp.price || cp.product.suggested_price || 0), 0)
        const growth = currentRevenue - lastMonthRevenue

        setActiveNow(growth)
      }
    }

    fetchRevenueGrowth()
  }, [])

  useEffect(() => {
    setMetrics({
      totalRevenue,
      clientCount,
      activeProducts,
      mrrGrowth: activeNow
    })
  }, [totalRevenue, clientCount, activeProducts, activeNow])

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(0)}/mo</div>
          <p className="text-xs text-muted-foreground">
            {revenueChange > 0 ? '+' : ''}{revenueChange}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clientCount}</div>
          <p className="text-xs text-muted-foreground">
            {clientChange > 0 ? '+' : ''}{clientChange}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProducts}</div>
          <p className="text-xs text-muted-foreground">
            {productsChange > 0 ? '+' : ''}{productsChange}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            MRR Growth
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+${activeNow.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">
            MRR growth this month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}