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
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
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
        title: "Applications",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "GHL",
            url: "#",
          },
          {
            title: "Snappy Website Bots",
            url: "#",
          },
          {
            title: "Snappy Social Bots",
            url: "#",
          },
          {
            title: "Reviewr",
            url: "#",
          },
          {
            title: "Compressr",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
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
          <NavProjects projects={data.resources} />
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
