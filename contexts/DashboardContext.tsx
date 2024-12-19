'use client'

import React, { createContext } from 'react'

type DashboardContextType = {
  metrics: {
    totalRevenue: number
    clientCount: number
    activeProducts: number
    mrrGrowth: number
  }
  setMetrics: (metrics: DashboardContextType['metrics']) => void
}

export const DashboardContext = createContext<DashboardContextType>({
  metrics: {
    totalRevenue: 0,
    clientCount: 0,
    activeProducts: 0,
    mrrGrowth: 0
  },
  setMetrics: () => {}
}) 