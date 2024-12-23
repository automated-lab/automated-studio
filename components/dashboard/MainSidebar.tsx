"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Code,
  FileText,
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
  Brain,
  Search,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/shipfast/nav-main";
import { NavProjects } from "@/components/shipfast/nav-projects";
import { NavUser } from "@/components/shipfast/nav-user";

const supabase = createClient();

export function MainSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User & { is_admin?: boolean }>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser({
          ...user,
          is_admin: profile?.is_admin || false,
        });
      }
    };
    getUser();
  }, []);

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: pathname === "/dashboard",
      },
      {
        title: "Clients",
        url: "/clients",
        icon: Users,
        isActive: pathname.startsWith("/clients"),
      },
      {
        title: "Discounts",
        url: "/discounts",
        icon: DollarSign,
        isActive: pathname.startsWith("/discounts"),
      },
    ],
    applications: [
      {
        name: "GHL",
        url: "/ghl",
        icon: SquareArrowUp,
        isActive: pathname.startsWith("/ghl"),
      },
      {
        name: "Website Chatbots",
        url: "#",
        icon: Bot,
        isActive: false,
      },
      {
        name: "Social Media Bots",
        url: "#",
        icon: Bot,
        isActive: false,
      },
      {
        name: "Reputation Management",
        url: "#",
        icon: Star,
        isActive: false,
      },
    ],
    resources: [
      {
        name: "Automations",
        url: "/automations",
        icon: Bot,
        isActive: pathname.startsWith("/automations"),
      },
      {
        name: "Code Snippets",
        url: "/snippets",
        icon: Code,
        isActive: pathname.startsWith("/snippets"),
      },
      {
        name: "Documents",
        url: "/documents",
        icon: FileStack,
        isActive: pathname.startsWith("/documents"),
      },
    ],
    tools: [
      {
        name: "Prospecting",
        url: "/prospects",
        icon: Search,
        isActive: pathname.startsWith("/prospects"),
      },
      {
        name: "Proposal Generator",
        url: "/proposals",
        icon: FileText,
        isActive: pathname === "/proposals",
      },
      {
        name: "Bot Prompt Generator",
        url: "/dashboard/bot-prompting",
        icon: Bot,
        isActive: pathname === "/dashboard/bot-prompting",
      },
      {
        name: "Bot Showcase Tool",
        url: "/dashboard/bot-showcase",
        icon: Bot,
        isActive: pathname === "/dashboard/bot-showcase",
      },
      {
        name: "Link Analytics",
        url: "#",
        icon: Link,
        isActive: false,
      },
      {
        name: "Calendar Scheduling",
        url: "#",
        icon: Calendar1,
        isActive: false,
      },
      {
        name: "AI Content",
        url: "#",
        icon: Brain,
        isActive: false,
      },
      {
        name: "Social Media Scheduling",
        url: "#",
        icon: Calendar1,
        isActive: false,
      },
    ],
    bottomNav: [
      {
        name: "AI Copilot",
        url: "/chat",
        icon: Bot,
        isActive: pathname.startsWith("/chat"),
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
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
          <NavProjects projects={data.tools} label="Tools" />
          <NavProjects
            projects={data.applications}
            label="White-label Applications"
          />
          <NavProjects projects={data.resources} label="Resources" />
        </nav>
        {/* <div className="mt-auto pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavProjects projects={data.bottomNav} label="Copilot" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div> */}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarTrigger />
      <SidebarRail />
    </Sidebar>
  );
}
