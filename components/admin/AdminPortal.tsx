'use client'

import { useState } from 'react'
import { User, Product } from '@/types/database'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Users, Package, Settings, Search } from 'lucide-react'
import { UsersTab } from '@/components/admin/AdminUsersTab'
import { ProductsTab } from './ProductsTab'

interface AdminPortalProps {
  users: User[]
  products: Product[]
}

export default function AdminPortal({ users, products }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="flex-1">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
        <span className="font-semibold">Admin Portal</span>
          <div className="flex-1 flex justify-end">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-[300px]"
                />
              </div>
            </form>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UsersTab initialUsers={users} />
            </TabsContent>

            <TabsContent value="products">
              <ProductsTab initialProducts={products} />
            </TabsContent>

            <TabsContent value="settings">
              <div className="text-center p-4">Settings coming soon...</div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}