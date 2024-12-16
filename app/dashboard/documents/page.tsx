"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DocumentList } from "./components/document-list"
import { DocumentContent } from "./components/document-content"
import { useState } from "react"
import type { Document } from "@/libs/airtable"

export default function DocumentsPage() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="h-screen flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center text-md font-semibold">
              Documents
            </div>
          </header>
          <div className="flex-1 flex overflow-hidden">
            <DocumentList 
              selectedId={selectedDocumentId}
              onSelect={(document: Document) => {
                setSelectedDocumentId(document.id)
                setSelectedDocument(document)
              }}
            />
            <DocumentContent 
              document={selectedDocument}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 