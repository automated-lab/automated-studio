"use client"

import { useEffect, useState } from "react"
import type { Snippet } from "@/libs/airtable"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Code } from "lucide-react"

interface SnippetListProps {
  selectedId: string
  onSelect: (snippet: Snippet) => void
}

export function SnippetList({ selectedId, onSelect }: SnippetListProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch('/api/snippets')
        const data = await response.json()
        setSnippets(data)
        // Initialize all groups as expanded and select first item
        const groups = data.reduce((acc: Record<string, boolean>, snippet: Snippet) => {
          const category = snippet.category || 'Other'
          acc[category] = true
          return acc
        }, {} as Record<string, boolean>)
        setExpandedGroups(groups)
        if (data.length > 0 && !selectedId) {
          onSelect(data[0])
        }
      } catch (error) {
        console.error('Error fetching snippets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSnippets()
  }, [selectedId, onSelect])

  if (loading) {
    return (
      <div className="w-[550px] border-r h-full">
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Loading snippets...
        </div>
      </div>
    )
  }

  // Group snippets by category
  const groupedSnippets = snippets.reduce((groups, snippet) => {
    const category = snippet.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(snippet)
    return groups
  }, {} as Record<string, Snippet[]>)

  return (
    <div className="w-[550px] border-r h-full">
      <div className="h-full overflow-y-auto">
        <div className="space-y-6 p-4">
          {Object.entries(groupedSnippets).map(([category, categorySnippets]) => (
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
                  {categorySnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      onClick={() => onSelect(snippet)}
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-lg border p-4",
                        selectedId === snippet.id && "bg-muted"
                      )}
                    >
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">{snippet.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {snippet.shortDescription}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{snippet.timeToImplement}</span>
                          {snippet.language && (
                            <>
                              <span>•</span>
                              <span>{snippet.language}</span>
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