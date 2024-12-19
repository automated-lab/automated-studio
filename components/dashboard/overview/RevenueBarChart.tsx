"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { createClient } from "@/libs/supabase/client"

const supabase = createClient()

type MonthlyRevenue = {
  name: string
  total: number
}

const chartConfig = {
  total: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RevenueBarChart() {
  const [data, setData] = useState<MonthlyRevenue[]>([])

  useEffect(() => {
    async function fetchRevenueData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: metrics } = await supabase
        .from('revenue_metrics')
        .select('year, month, total_revenue')
        .eq('profile_id', user.id)
        .order('year', { ascending: true })
        .order('month', { ascending: true })
        .limit(12)

      if (metrics) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        const formattedData = metrics.map(m => ({
          name: monthNames[m.month - 1],
          total: Number(m.total_revenue)
        }))

        setData(formattedData)
      }
    }

    fetchRevenueData()
  }, [])

  // Calculate trend
  const lastTwo = data.slice(-2)
  const trend = lastTwo.length === 2 
    ? ((lastTwo[1].total - lastTwo[0].total) / lastTwo[0].total) * 100 
    : 0

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Monthly revenue trends</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="total"
                fill="var(--chart-bar)"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => `$${value}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {data.length > 1 && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {trend > 0 ? 'Up' : 'Down'} by {Math.abs(trend).toFixed(1)}% this month
            {trend > 0 
              ? <TrendingUp className="h-4 w-4 text-green-500" />
              : <TrendingDown className="h-4 w-4 text-red-500" />
            }
          </div>
          <div className="leading-none text-muted-foreground">
            Showing monthly revenue for the last {data.length} months
          </div>
        </CardFooter>
      )}
    </Card>
  )
}