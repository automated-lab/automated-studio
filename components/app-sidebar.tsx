"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Code,
  Command,
  FileStack,
  GalleryVerticalEnd,
  Map,
  Settings2,
  SquareTerminal,
  Zap,
  LayoutDashboard,
  LayoutGrid,
  Atom,
  SquareArrowUp,
  Star,
  Link,
  Calendar1,
  Percent,
  DollarSign,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/libs/supabase/client"
import { useState, useEffect } from "react"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const supabase = createClient()

export function AppSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      }
    }
    getUser()
  }, [])

  const data = {
    user: {
      name: user?.user_metadata?.name || user?.email?.split("@")[0] || "",
      email: user?.email || "",
      avatar: user?.user_metadata?.avatar_url || "",
      initials: (user?.email?.[0] || "").toUpperCase()
    },
    navMain: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          isActive: pathname === "/dashboard"
        },
        {
          title: "Discounts",
          url: "/discounts",
          icon: DollarSign,
          isActive: pathname === "/discounts"
        }        
    ],
    applications: [
      {
        name: "GHL",
        url: "#",
        icon: SquareArrowUp,
        isActive: false
      },
      {
        name: "Snappy Website Bots",
        url: "#",
        icon: Bot,
        isActive: false
      },
      {
        name: "Snappy Social Bots",
        url: "#",
        icon: Bot,
        isActive: false
      },
      {
        name: "Reviewr",
        url: "#",
        icon: Star,
        isActive: false
      },
      {
        name: "Compressr",
        url: "#",
        icon: Link,
        isActive: false
      },
      {
        name: "Book Me",
        url: "#",
        icon: Calendar1,
        isActive: false
      }
    ],
    resources: [
      {
        name: "Automations",
        url: "/dashboard/automations",
        icon: Bot,
        isActive: pathname === "/dashboard/automations"
      },
      {
        name: "Code Snippets",
        url: "/dashboard/snippets",
        icon: Code,
        isActive: pathname === "/dashboard/snippets"
      },
      {
        name: "Documents",
        url: "/dashboard/documents",
        icon: FileStack,
        isActive: pathname === "/dashboard/documents" || pathname.startsWith("/dashboard/documents/") 
      },
    ],
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-[52px] items-center justify-center px-4">
          <Image
            src="/logo.png"
            width={150}
            height={150}
            alt="Logo"
            className="dark:invert"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <nav className="grid gap-1">
          <NavMain items={data.navMain} />
          <NavProjects projects={data.applications} label="Applications" />
          <NavProjects projects={data.resources} label="Resources" />
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
