'use client'

import { User } from '@/types/database'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVertical, Plus } from 'lucide-react'
import { NewUserDialog } from '@/components/admin/new-user-dialog'
import { UserActionsDropdown } from '@/components/admin/user-actions-dropdown'

export function UsersTab({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers || [])
  const supabase = createClientComponentClient()

  const refreshUsers = async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    if (!Array.isArray(data)) return
    setUsers(data)
  }

  useEffect(() => {
    refreshUsers()
  }, [])

  return (
    <div className="space-y-4">
      <Card className="mt-6 mb-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Auth Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.primary_contact_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-medium">{user.company_name}</TableCell>                  
                  <TableCell>
                    <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'}>
                      {user.subscription_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.is_admin ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <UserActionsDropdown 
                      userId={user.id} 
                      userEmail={user.email}
                      onDelete={refreshUsers}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <NewUserDialog onSuccess={refreshUsers} />
      </div>
    </div>
  )
}