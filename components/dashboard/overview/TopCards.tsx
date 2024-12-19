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

type HistoricalMetric = {
  month: number;
  year: number;
  total_revenue: number;
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
  const [currentMetrics, setCurrentMetrics] = useState(null)
  const [historicalMetrics, setHistoricalMetrics] = useState(null)

  useEffect(() => {
    async function fetchRevenue() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: currentMetrics } = await supabase
        .from('revenue_metrics')
        .select('total_revenue, total_customers, total_active_products, new_customers, churned_customers')
        .eq('profile_id', user.id)
        .eq('year', new Date().getFullYear())
        .eq('month', new Date().getMonth() + 1)
        .single()

      const { data: lastMonthMetrics } = await supabase
        .from('revenue_metrics')
        .select('total_revenue, total_customers, total_active_products')
        .eq('profile_id', user.id)
        .eq('year', new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear())
        .eq('month', new Date().getMonth() === 0 ? 12 : new Date().getMonth())
        .single()

      const { data: historicalMetrics } = await supabase
        .from('revenue_metrics')
        .select('total_revenue, year, month')
        .eq('profile_id', user.id)
        .order('year', { ascending: true })
        .order('month', { ascending: true })
        .limit(12)

      if (currentMetrics) {
        setTotalRevenue(currentMetrics.total_revenue)
        setClientCount(currentMetrics.total_customers)
        setActiveProducts(currentMetrics.total_active_products)

        // Calculate percentage changes
        if (lastMonthMetrics) {
          const revChange = Number((((currentMetrics.total_revenue - lastMonthMetrics.total_revenue) / lastMonthMetrics.total_revenue) * 100).toFixed(1))
          const clientChg = Number((((currentMetrics.total_customers - lastMonthMetrics.total_customers) / lastMonthMetrics.total_customers) * 100).toFixed(1))
          const prodChg = Number((((currentMetrics.total_active_products - lastMonthMetrics.total_active_products) / lastMonthMetrics.total_active_products) * 100).toFixed(1))
          
          setRevenueChange(revChange)
          setClientChange(clientChg)
          setProductsChange(prodChg)
          setActiveNow(currentMetrics.total_revenue - lastMonthMetrics.total_revenue)
        }

        setCurrentMetrics(currentMetrics)
      }

      if (historicalMetrics) {
        setHistoricalMetrics(historicalMetrics)
      }
    }

    fetchRevenue()
  }, [])

  useEffect(() => {
    setMetrics({
      totalRevenue,
      clientCount,
      activeProducts,
      mrrGrowth: activeNow,
      revenueChange,
      clientChange,
      productsChange,
      newCustomers: currentMetrics?.new_customers || 0,
      churnedCustomers: currentMetrics?.churned_customers || 0,
      historicalRevenue: historicalMetrics?.map((m: HistoricalMetric) => ({
        month: m.month,
        year: m.year,
        revenue: m.total_revenue
      })) || []
    })
  }, [totalRevenue, clientCount, activeProducts, activeNow, revenueChange, clientChange, productsChange, currentMetrics, historicalMetrics])

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
            {activeNow > 0 ? '+' : ''}{((activeNow / (totalRevenue - activeNow)) * 100).toFixed(1)}% this month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}