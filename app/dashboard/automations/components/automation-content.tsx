"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Automation } from "@/libs/airtable"
import { Clock, Download, ExternalLink, PlayCircle, FileText, Rocket } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AutomationContentProps {
  automation: Automation | null
}

export function AutomationContent({ automation }: AutomationContentProps) {
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

  if (!automation) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Select an automation to view details
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <header className="sticky top-0 border-b bg-background p-4">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-semibold">{automation.name}</h1>
            <p className="text-sm text-muted-foreground">{automation.shortDescription}</p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-left">
            {automation.platform && (
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={automation.platform} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {automation.platform.replace(/^https?:\/\//, '')}
                </a>
              </Button>
            )}
            {automation.videoUrl && (
              <Button variant="default" size="sm" asChild>
                <a href={automation.videoUrl} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  External Video
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Time to implement: {automation.timeToImplement}</span>
              {automation.category && (
                <>
                  <span>•</span>
                  <span>{automation.category}</span>
                </>
              )}
            </div>

            <div className="space-y-4">
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
                  {automation.content}
                </ReactMarkdown>
              </div>
            </div>

            {automation.videoUrl && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tutorial Video</h3>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={automation.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </>
            )}

            {automation.attachments && automation.attachments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-lg font-semibold mb-4">Attachments</h2>
                  <div className="grid gap-4">
                    {automation.attachments.map((attachment: any) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{attachment.filename}</span>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleDownload(attachment.url, attachment.filename)}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
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