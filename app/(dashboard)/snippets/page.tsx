"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { SnippetList } from "../../../components/snippets/snippet-list"
import { SnippetContent } from "../../../components/snippets/snippet-content"
import { useState } from "react"
import type { Snippet } from "@/libs/airtable"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function SnippetsPage() {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>("")
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [showMobileContent, setShowMobileContent] = useState(false)

  return (
    <SidebarInset>
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          <div className={`${showMobileContent ? 'hidden md:block' : 'block'} flex-1 md:flex-none`}>
            <SnippetList 
              selectedId={selectedSnippetId}
              onSelect={(snippet: Snippet) => {
                setSelectedSnippetId(snippet.id)
                setSelectedSnippet(snippet)
                setShowMobileContent(true)
              }}
            />
          </div>
          <div className={`${!showMobileContent ? 'hidden md:block' : 'block'} flex-1`}>
            <SnippetContent 
              snippet={selectedSnippet}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
