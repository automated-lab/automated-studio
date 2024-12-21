"use client"
export const dynamic = 'force-dynamic'

import { SidebarInset } from "@/components/ui/sidebar"
import { AutomationList } from "../../../components/automations/automation-list"
import { AutomationContent } from "../../../components/automations/automation-content"
import { useState } from "react"
import type { Automation } from "@/libs/airtable"

export default function AutomationsPage() {
  const [selectedAutomationId, setSelectedAutomationId] = useState<string>("")
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null)
  const [showMobileContent, setShowMobileContent] = useState(false)

  return (
    <SidebarInset className="h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex overflow-hidden">
          <div className={`${showMobileContent ? 'hidden md:block' : 'block'} flex-1 md:flex-none overflow-y-auto`}>
            <AutomationList 
              selectedId={selectedAutomationId}
              onSelect={(automation: Automation) => {
                setSelectedAutomationId(automation.id)
                setSelectedAutomation(automation)
                setShowMobileContent(true)
              }}
            />
          </div>
          <div className={`${!showMobileContent ? 'hidden md:block' : 'block'} flex-1 overflow-y-auto`}>
            <AutomationContent 
              automation={selectedAutomation}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
} 