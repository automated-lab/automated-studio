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
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function SnippetsPage() {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>("")
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [showMobileContent, setShowMobileContent] = useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="h-screen flex flex-col">
          <header className="flex flex-col shrink-0 border-b">
            <div className="flex h-16 items-center gap-2 px-6">
              <SidebarTrigger className="-ml-2" />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center text-md font-semibold">
                Code Snippets
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
    </SidebarProvider>
  )
}
