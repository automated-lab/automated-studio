"use client"

import { useEffect, useState } from "react"
import type { Automation } from "@/libs/airtable"
import { cn } from "@/lib/utils"
import { Bot, ChevronDown, ChevronRight } from "lucide-react"

interface AutomationListProps {
  selectedId: string
  onSelect: (automation: Automation) => void
}

export function AutomationList({ selectedId, onSelect }: AutomationListProps) {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        const response = await fetch('/api/automations')
        const data = await response.json()
        setAutomations(data)
        // Initialize all groups as expanded and select first item
        const groups = data.reduce((acc: Record<string, boolean>, automation: Automation) => {
          const category = automation.category || 'Other'
          acc[category] = true
          return acc
        }, {} as Record<string, boolean>)
        setExpandedGroups(groups)
        if (data.length > 0 && !selectedId) {
          onSelect(data[0])
        }
      } catch (error) {
        console.error('Error fetching automations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAutomations()
  }, [selectedId, onSelect])

  if (loading) {
    return (
      <div className="w-[550px] border-r h-full">
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Loading automations...
        </div>
      </div>
    )
  }

  const groupedAutomations = automations.reduce((groups, automation) => {
    const category = automation.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(automation)
    return groups
  }, {} as Record<string, Automation[]>)

  return (
    <div className="w-[550px] border-r h-full">
      <div className="h-full overflow-y-auto">
        <div className="space-y-6 p-4">
          {Object.entries(groupedAutomations).map(([category, categoryAutomations]) => (
            <div key={category} className="space-y-4">
              <button
                onClick={() => setExpandedGroups(prev => ({
                  ...prev,
                  [category]: !prev[category]
                }))}
                className="flex items-center gap-2 w-full px-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                {expandedGroups[category] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                {category}
              </button>
              {expandedGroups[category] && (
                <div className="space-y-4">
                  {categoryAutomations.map((automation) => (
                    <div
                      key={automation.id}
                      onClick={() => onSelect(automation)}
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-lg border p-4",
                        selectedId === automation.id && "bg-muted"
                      )}
                    >
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">{automation.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {automation.shortDescription}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{automation.timeToImplement}</span>
                          {automation.platform && (
                            <>
                              <span>•</span>
                              <span>{automation.platform}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 