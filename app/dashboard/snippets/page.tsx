"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SnippetList } from "@/app/dashboard/snippets/components/snippet-list"
import { SnippetContent } from "@/app/dashboard/snippets/components/snippet-content"
import { useState } from "react"
import type { Snippet } from "@/libs/airtable"

export default function SnippetsPage() {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>("")
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="h-screen flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center text-md font-semibold">
              Code Snippets
            </div>
          </header>
          <div className="flex-1 flex overflow-hidden">
            <SnippetList 
              selectedId={selectedSnippetId}
              onSelect={(snippet: Snippet) => {
                setSelectedSnippetId(snippet.id)
                setSelectedSnippet(snippet)
              }}
            />
            <SnippetContent 
              snippet={selectedSnippet}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
