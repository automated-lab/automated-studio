"use client"

import { useEffect, useState } from "react"
import type { Document } from "@/libs/airtable"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, FileText } from "lucide-react"

interface DocumentListProps {
  selectedId: string
  onSelect: (document: Document) => void
}

export function DocumentList({ selectedId, onSelect }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents')
        const data = await response.json()
        setDocuments(data)
        // Initialize all groups as expanded and select first item
        const groups = data.reduce((acc: Record<string, boolean>, document: Document) => {
          const category = document.category || 'Other'
          acc[category] = true
          return acc
        }, {})
        setExpandedGroups(groups)
        if (data.length > 0 && !selectedId) {
          onSelect(data[0])
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [selectedId, onSelect])

  if (loading) {
    return (
      <div className="w-full md:w-[350px] lg:w-[550px] border-r h-full">
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Loading documents...
        </div>
      </div>
    )
  }

  const groupedDocuments = documents.reduce((groups, document) => {
    const category = document.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(document)
    return groups
  }, {} as Record<string, Document[]>)

  return (
    <div className="w-full md:w-[350px] lg:w-[550px] border-r h-[calc(100vh-4rem)]">
      <div className="h-full overflow-y-auto">
        <div className="space-y-6 p-4">
          {Object.entries(groupedDocuments).map(([category, categoryDocuments]) => (
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
                  {categoryDocuments.map((document) => (
                    <div
                      key={document.id}
                      onClick={() => onSelect(document)}
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-lg border p-4",
                        selectedId === document.id && "bg-muted"
                      )}
                    >
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">{document.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {document.shortDescription}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{document.type}</span>
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