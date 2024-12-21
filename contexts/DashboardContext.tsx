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

type ReviewPotential = {
  icon: any;
  color: string;
  label: string;
  description: string;
  score: number;
}

type ProspectResult = {
  name: string;
  address: string;
  rating?: number;
  totalRatings?: number;
  location: {
    lat: number;
    lng: number;
  };
  reviewPotential: ReviewPotential | null;
}

export const DashboardContext = createContext<{
  metrics: DashboardMetrics;
  setMetrics: (metrics: DashboardMetrics) => void;
  prospectsState: {
    searchResults: ProspectResult[];
    totalResults: number;
    currentQuery: string;
  };
  setProspectsState: (state: { 
    searchResults: ProspectResult[]; 
    totalResults: number; 
    currentQuery: string; 
  }) => void;
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
  setMetrics: () => {},
  prospectsState: {
    searchResults: [],
    totalResults: 0,
    currentQuery: ''
  },
  setProspectsState: () => {}
}) 