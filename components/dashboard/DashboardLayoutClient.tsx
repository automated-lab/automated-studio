'use client'

import { ReactNode, useContext, useState } from "react"
import { usePathname } from "next/navigation"
import { User } from '@supabase/auth-helpers-nextjs'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/dashboard/MainSidebar"
import { Toaster } from "@/components/ui/toaster"
import { useCopilotReadable } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import { DashboardContext } from "@/contexts/DashboardContext"
import { Search } from "@/components/dashboard/overview/search"
import { UserNav } from "@/components/dashboard/overview/user-nav"

export default function DashboardLayoutClient({
  children,
  user
}: {
  children: ReactNode;
  user: User;
}) {
  const pathname = usePathname()
  const [metrics, setMetrics] = useState({
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
  })

  const [prospects, setProspects] = useState({
    searchResults: [],
    totalResults: 0,
    currentQuery: ''
  })

  useCopilotReadable({
    description: "Dashboard metrics and user information",
    value: { metrics, prospects, user }
  })

  const getPageTitle = (path: string) => {
    const routes: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/clients': 'Clients',
      '/automations': 'Automations',
      '/settings': 'Settings',
      '/admin': 'Admin Portal',
      '/prospects': 'Prospecting',
      // Add more routes as needed
    }
    return routes[path] || 'Dashboard'
  }

  return (
    <DashboardContext.Provider value={{ 
      metrics, 
      setMetrics,
      prospectsState: prospects,
      setProspectsState: setProspects 
    }}>
      <SidebarProvider>
        <MainSidebar />
        <SidebarInset>
          <div className="flex h-screen flex-col">
            {/* Fixed header */}
            <div className="sticky top-0 z-10 bg-background border-b">
              <div className="flex h-16 items-center px-4">
                <div className="text-lg font-semibold">
                  {getPageTitle(pathname)}
                </div>
                <div className="ml-auto flex items-center space-x-4">
                  <Search />
                  <UserNav />
                </div>
              </div>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </SidebarInset>
          <CopilotPopup defaultOpen={false} />
        <Toaster />
      </SidebarProvider>
    </DashboardContext.Provider>
  )
} 