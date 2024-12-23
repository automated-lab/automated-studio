'use client'

import { useState, useEffect } from 'react'
import { Bot } from '@/types/database'
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from 'lucide-react'

interface BotsTabProps {
  initialBots: Bot[]
}

export function BotsTab({ initialBots }: BotsTabProps) {
  const [bots, setBots] = useState<Bot[]>(initialBots)
  const [newBot, setNewBot] = useState({ id: '', name: '', description: '' })
  const [botToDelete, setBotToDelete] = useState<Bot | null>(null)

  const refreshBots = async () => {
    const res = await fetch('/api/bots')
    const data = await res.json()
    if (!Array.isArray(data)) return
    setBots(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBot)
      })
      
      if (!res.ok) throw new Error('Failed to create bot')
      
      await refreshBots()
      setNewBot({ id: '', name: '', description: '' })
      toast.success('Bot created successfully')
    } catch (error) {
      toast.error('Failed to create bot')
    }
  }

  const handleDelete = async () => {
    if (!botToDelete) return

    try {
      const res = await fetch(`/api/bots/${botToDelete.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete bot')
      
      setBots(bots.filter(bot => bot.id !== botToDelete.id))
      toast.success('Bot deleted successfully')
    } catch (error) {
      toast.error('Failed to delete bot')
    } finally {
      setBotToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Bot ID"
          value={newBot.id}
          onChange={(e) => setNewBot({ ...newBot, id: e.target.value })}
          required
        />
        <Input
          placeholder="Bot Name"
          value={newBot.name}
          onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
          required
        />
        <Textarea
          placeholder="Bot Description"
          value={newBot.description}
          onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
          required
        />
        <Button type="submit">Add Bot</Button>
      </form>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-mono">{bot.id}</TableCell>
                  <TableCell>{bot.name}</TableCell>
                  <TableCell>{bot.description}</TableCell>
                  <TableCell>{new Date(bot.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setBotToDelete(bot)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!botToDelete} onOpenChange={() => setBotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the bot template &quot;{botToDelete?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
