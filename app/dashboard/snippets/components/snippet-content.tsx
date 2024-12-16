"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Snippet } from "@/libs/airtable"
import { Clock, ExternalLink, PlayCircle } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface SnippetContentProps {
  snippet: Snippet | null
}

export function SnippetContent({ snippet }: SnippetContentProps) {
  if (!snippet) {
    return (
        <div className="flex-1 p-8 flex items-center justify-center text-muted-foreground overflow-hidden">
        Select a snippet to view its details
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex items-center p-6 border-b shrink-0">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{snippet.name}</h2>
            <p className="text-sm text-muted-foreground">
              {snippet.shortDescription}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {snippet.videoUrl && (
              <Button variant="default" size="sm" asChild>
                <a href={snippet.videoUrl} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  External Video
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Time to implement: {snippet.timeToImplement}</span>
                {snippet.language && (
                  <>
                    <span>•</span>
                    <span>{snippet.language}</span>
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
                    {snippet.content}
                  </ReactMarkdown>
                </div>
              </div>

              {snippet.videoUrl && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tutorial Video</h3>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={snippet.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </>
              )}

              {snippet.attachments && snippet.attachments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Attachments</h3>
                    <div className="grid gap-2">
                      {snippet.attachments.map((attachment: any, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start"
                          onClick={() => {
                            fetch(attachment.url)
                              .then(response => response.blob())
                              .then(blob => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = attachment.filename;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              });
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {attachment.filename}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 