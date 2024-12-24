"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Snippet } from "@/libs/airtable"
import { Clock, Download, FileText } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React from 'react'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface SnippetContentProps {
  snippet: Snippet | null
}

export function SnippetContent({ snippet }: SnippetContentProps) {
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

  if (!snippet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Select a snippet to view details
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <header className="border-b bg-background p-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{snippet.name}</h2>
          <p className="text-sm text-muted-foreground">
            {snippet.shortDescription}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Time to implement: {snippet.timeToImplement}</span>
            </div>

            <div className="space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
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
                  {snippet.content}
                </ReactMarkdown>
              </div>
            </div>

            {snippet.image && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Example</h3>
                  <div className="relative rounded-lg overflow-hidden">
                    <Image 
                      src={snippet.image[0].url} 
                      alt="Snippet image" 
                      width={1200}
                      height={800}
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}

            {snippet.attachments && snippet.attachments.length > 0 && (
              <>
                <Separator />
                <div className="pb-20">
                  <h2 className="text-lg font-semibold mb-4">Attachments</h2>
                  <div className="grid gap-4">
                    {snippet.attachments.map((attachment: any) => (
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