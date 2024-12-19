import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { MainNav } from "@/components/dashboard/overview/main-nav"
import { RevenueBarChart } from "@/components/dashboard/overview/RevenueBarChart"
import { RecentSales } from "@/components/dashboard/overview/RecentSalesCard"
import { Search } from "@/components/dashboard/overview/search"
import { UserNav } from "@/components/dashboard/overview/user-nav"
import { TopCards } from "@/components/dashboard/overview/TopCards"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "An overview of your business.",
}

export default function DashboardPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
                  <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
                  <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
                </TabsList>
                <Button>Download</Button>
              </div>
              <TabsContent value="overview">
                <TopCards />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <RevenueBarChart />
                  <RecentSales />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}