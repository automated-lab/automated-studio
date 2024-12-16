"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { AutomationList } from "./components/automation-list"
import { AutomationContent } from "./components/automation-content"
import { useState } from "react"
import type { Automation } from "@/libs/airtable"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AutomationsPage() {
  const [selectedAutomationId, setSelectedAutomationId] = useState<string>("")
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null)
  const [showMobileContent, setShowMobileContent] = useState(false)

  return (
    <SidebarInset>
      <div className="h-screen flex flex-col">
        <header className="flex flex-col shrink-0 border-b">
          <div className="flex h-16 items-center gap-2 px-6">
            <div className="flex items-center text-md font-semibold">
              Automations
            </div>
          </div>
          {showMobileContent && (
            <div className="flex items-center px-6 pb-4 md:hidden">
              <Button
                variant="ghost"
                onClick={() => setShowMobileContent(false)}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to list
              </Button>
            </div>
          )}
        </header>
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