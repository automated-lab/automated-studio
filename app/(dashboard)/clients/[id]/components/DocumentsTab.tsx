import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Client, ClientDocument } from "@/types/database"
import { FileText, Upload, Loader2, Download, Eye, Trash2 } from "lucide-react"
import { createClient } from "@/libs/supabase/client"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface DocumentsTabProps {
  client: Client
}

export function DocumentsTab({ client }: DocumentsTabProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const supabase = createClient()

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return
    }

    setDocuments(data)
  }

  useEffect(() => {
    fetchDocuments()
  }, [client.id])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      // Create a safe filename
      const fileExt = file.name.split('.').pop()
      const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      // Ensure client.id is a string and create a clean path
      const filePath = `${client.id.toString()}/${safeFileName}`.replace(/\/{2,}/g, '/')
      
      // Upload file
      const { data, error } = await supabase.storage
        .from('client-documents')
        .upload(filePath, file)

      if (error) throw error

      // Add document reference to the database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          client_id: client.id,
          name: file.name,
          type: file.type,
          size: file.size,
          path: data.path
        })

      if (dbError) throw dbError

      // Refresh the documents list
      await fetchDocuments()
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })
    } catch (error) {
      console.error('Upload error details:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewDocument = async (doc: ClientDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(doc.path, 60) // URL valid for 60 seconds

      if (error) throw error

      // For PDFs, images, and text files - open in new tab
      if (doc.type.includes('pdf') || 
          doc.type.includes('image') || 
          doc.type.includes('text')) {
        window.open(data.signedUrl, '_blank')
      } else {
        // For other files - trigger download
        handleDownload(data.signedUrl, doc.name)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error accessing document",
      })
      console.error('Error:', error)
    }
  }

  const handleDownload = async (url: string, fileName: string) => {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  }

  const handleDeleteDocument = async (doc: ClientDocument) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('client-documents')
        .remove([doc.path])

      if (storageError) throw storageError

      // Delete from database - fix table name from 'client_documents' to 'documents'
      const { error: dbError } = await supabase
        .from('documents')  // Changed from 'client_documents' to 'documents'
        .delete()
        .eq('id', doc.id)

      if (dbError) throw dbError

      // Update local state
      setDocuments(documents.filter(d => d.id !== doc.id))
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting document",
      })
      console.error('Error:', error)
    }
  }

  const getSimpleFileType = (mimeType: string) => {
    if (mimeType.includes('word')) return 'DOCX'
    if (mimeType.includes('sheet')) return 'XLSX'
    if (mimeType.includes('pdf')) return 'PDF'
    if (mimeType.includes('image')) return 'Image'
    if (mimeType.includes('text')) return 'Text'
    if (mimeType.includes('presentation')) return 'PPTX'
    return 'File'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Documents</CardTitle>
        <CardDescription>Access and manage client-related documents</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {documents.map((doc: ClientDocument) => (
            <div key={doc.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{getSimpleFileType(doc.type)}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDocument(doc)}
                >
                  {doc.type.includes('pdf') || 
                   doc.type.includes('image') || 
                   doc.type.includes('text') ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {doc.name}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteDocument(doc)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button disabled={isUploading} asChild>
            <label className="cursor-pointer">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
