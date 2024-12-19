'use client'

import { ReactNode, useContext, useState } from "react"
import { User } from '@supabase/auth-helpers-nextjs'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { CopilotPopup } from "@copilotkit/react-ui"
import { DashboardContext } from "@/contexts/DashboardContext"

export default function DashboardLayoutClient({
  children,
  user
}: {
  children: ReactNode;
  user: User;
}) {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    clientCount: 0,
    activeProducts: 0,
    mrrGrowth: 0
  })

  return (
    <DashboardContext.Provider value={{ metrics, setMetrics }}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
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