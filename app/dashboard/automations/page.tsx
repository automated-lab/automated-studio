"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AutomationList } from "./components/automation-list"
import { AutomationContent } from "./components/automation-content"
import { useState } from "react"
import type { Automation } from "@/libs/airtable"

export default function AutomationsPage() {
  const [selectedAutomationId, setSelectedAutomationId] = useState<string>("")
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="h-screen flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center text-md font-semibold">
              Automations
            </div>
          </header>
          <div className="flex-1 flex overflow-hidden">
            <AutomationList 
              selectedId={selectedAutomationId}
              onSelect={(automation: Automation) => {
                setSelectedAutomationId(automation.id)
                setSelectedAutomation(automation)
              }}
            />
            <AutomationContent 
              automation={selectedAutomation}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 