"use client"
export const dynamic = 'force-dynamic'

import { SidebarInset } from "@/components/ui/sidebar"
import { DocumentList } from "../../../components/documents/document-list"
import { DocumentContent } from "../../../components/documents/document-content"
import { useState } from "react"
import type { Document } from "@/libs/airtable"

export default function DocumentsPage() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showMobileContent, setShowMobileContent] = useState(false)

  return (
    <SidebarInset>
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          <div className={`${showMobileContent ? 'hidden md:block' : 'block'} flex-1 md:flex-none overflow-y-auto`}>
            <DocumentList 
              selectedId={selectedDocumentId}
              onSelect={(document: Document) => {
                setSelectedDocumentId(document.id)
                setSelectedDocument(document)
                setShowMobileContent(true)
              }}
            />
          </div>
          <div className={`${!showMobileContent ? 'hidden md:block' : 'block'} flex-1 overflow-y-auto`}>
            <DocumentContent 
              document={selectedDocument}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
} 