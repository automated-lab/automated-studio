"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Document } from "@/libs/airtable"
import { Clock, Download, FileText } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface DocumentContentProps {
  document: Document | null
}

export function DocumentContent({ document }: DocumentContentProps) {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (!document) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Select a document to view details
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <header className="border-b bg-background p-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{document.name}</h2>
          <p className="text-sm text-muted-foreground">
            {document.shortDescription}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {document.content}
              </ReactMarkdown>
            </div>

            {document.attachments && document.attachments.length > 0 && (
              <>
                <Separator />
                <div className="pb-20">
                  <h2 className="text-lg font-semibold mb-4">Attachments</h2>
                  <div className="grid gap-4">
                    {document.attachments.map((attachment: any) => (
                       <Card key={attachment.id}>
                       <CardContent className="flex items-center justify-between p-4">
                         <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-muted">
                             <FileText className="w-4 h-4 text-muted-foreground" />
                           </div>
                           <div className="space-y-1">
                             <p className="text-sm font-medium">{attachment.filename}</p>
                             <p className="text-xs text-muted-foreground">
                               {attachment.type || 'Document'}
                             </p>
                           </div>
                         </div>
                         <Button 
                           size="sm"
                           variant="secondary"
                           onClick={() => handleDownload(attachment.url, attachment.filename)}
                           className="ml-4"
                         >
                           <Download className="w-4 h-4 mr-2" />
                           Download
                         </Button>
                       </CardContent>
                     </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 