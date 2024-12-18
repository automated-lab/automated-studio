"use client"

import {
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"

interface NavProjectsProps {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
  label: string
}

export function NavProjects({ projects, label }: NavProjectsProps) {
  const sidebar = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton 
              asChild 
              variant={item.isActive ? "default" : "ghost"}
              tooltip={item.name}
            >
              <Link href={item.url}>
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
