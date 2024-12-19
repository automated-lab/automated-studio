'use client'

import React, { createContext } from 'react'

type DashboardMetrics = {
  totalRevenue: number;
  clientCount: number;
  activeProducts: number;
  mrrGrowth: number;
  revenueChange: number;
  clientChange: number;
  productsChange: number;
  newCustomers: number;
  churnedCustomers: number;
  historicalRevenue: Array<{
    month: number;
    year: number;
    revenue: number;
  }>;
}

export const DashboardContext = createContext<{
  metrics: DashboardMetrics;
  setMetrics: (metrics: DashboardMetrics) => void;
}>({
  metrics: {
    totalRevenue: 0,
    clientCount: 0,
    activeProducts: 0,
    mrrGrowth: 0,
    revenueChange: 0,
    clientChange: 0,
    productsChange: 0,
    newCustomers: 0,
    churnedCustomers: 0,
    historicalRevenue: []
  },
  setMetrics: () => {}
}) 