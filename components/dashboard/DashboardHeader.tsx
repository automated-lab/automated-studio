'use client'
export const dynamic = 'force-dynamic'

import { Search } from "./overview/search"
import { UserNav } from "./overview/user-nav"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface DashboardHeaderProps {
  showMobileBack?: boolean
  onMobileBack?: () => void
}

export function DashboardHeader({ showMobileBack, onMobileBack }: DashboardHeaderProps) {
  const pathname = usePathname()
  
  const getTitleFromPath = (path: string) => {
    const routes: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/clients': 'Clients',
      '/automations': 'Automations',
      '/discounts': 'Discounts',
      // Add more routes as needed
    }
    return routes[path] || 'Dashboard'
  }

  return (
    <header className="flex flex-col shrink-0 border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center text-md font-semibold">
          {getTitleFromPath(pathname)}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <UserNav />
        </div>
      </div>
      {showMobileBack && (
        <div className="flex items-center px-6 pb-4 md:hidden">
          <Button
            variant="ghost"
            onClick={onMobileBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to list
          </Button>
        </div>
      )}
    </header>
  )
} 