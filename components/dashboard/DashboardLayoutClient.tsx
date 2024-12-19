'use client'

import { ReactNode, useContext, useState } from "react"
import { usePathname } from "next/navigation"
import { User } from '@supabase/auth-helpers-nextjs'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/dashboard/MainSidebar"
import { Toaster } from "@/components/ui/toaster"
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
    mrrGrowth: 0
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
    <DashboardContext.Provider value={{ metrics, setMetrics }}>
      <SidebarProvider>
        <MainSidebar />
        <SidebarInset>
          <div className="hidden flex-col md:flex">
            <div className="border-b">
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
          </div>
          {children}
          <CopilotPopup
            instructions={`You are assisting the user as best as you can. You have access to the following dashboard metrics:
      - Total Monthly Recurring Revenue: $${metrics.totalRevenue}/mo
      - Active Clients: ${metrics.clientCount}
      - Active Products: ${metrics.activeProducts}
      - MRR Growth: $${metrics.mrrGrowth}/mo`}
            labels={{
              title: "Popup Assistant",
              initial: "Need any help?",
            }}
          />
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </DashboardContext.Provider>
  )
} 