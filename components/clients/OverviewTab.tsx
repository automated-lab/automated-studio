import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Building2, Contact, Settings, AlertTriangle, FileText, Crown, TrendingUp } from 'lucide-react'
import type { Client } from "@/types/database"
import { formatDistanceToNow, differenceInMonths, differenceInDays } from 'date-fns'
import { motion } from 'framer-motion'

interface OverviewTabProps {
  client: Client
  clientProducts: any[]
}

// Helper functions at the top of the file
const getLoyaltyTier = (createdAt: string) => {
  const months = differenceInMonths(new Date(), new Date(createdAt))
  if (months >= 12) return 'Annual Review Due'
  if (months >= 6) return 'Schedule 6-Month Check-in'
  if (months >= 3) return 'Quarterly Call Due'
  if (months >= 1) return 'First Month Check-in'
  return 'New Client - High Priority'
}

const getLoyaltyColor = (tier: string) => {
  switch (tier) {
    case 'Annual Review Due': return 'text-orange-600 font-semibold'
    case 'Schedule 6-Month Check-in': return 'text-yellow-600 font-semibold'
    case 'Quarterly Call Due': return 'text-blue-500 font-semibold'
    case 'First Month Check-in': return 'text-green-500 font-semibold'
    default: return 'text-purple-600 font-semibold'
  }
}

const formatJoinDate = (date: string) => {
  const months = differenceInMonths(new Date(), new Date(date))
  if (months === 0) {
    const days = differenceInDays(new Date(), new Date(date))
    if (days === 0) return 'Joined today'
    if (days === 1) return 'Joined yesterday'
    return `Joined ${days} days ago`
  }
  if (months === 1) return 'Joined last month'
  return `Joined ${months} months ago`
}

const calculateLTV = (createdAt: string, monthlyRevenue: number) => {
  const months = differenceInMonths(new Date(), new Date(createdAt))
  const totalRevenue = monthlyRevenue * (months || 1)
  return Math.round(totalRevenue)
}

export function OverviewTab({ client, clientProducts }: OverviewTabProps) {
  // Calculate total revenue from activated products
  const activeRevenue = clientProducts
    ?.filter(cp => cp.is_active)
    .reduce((sum, cp) => sum + (cp.product.suggested_price || 0), 0)

  console.log('Active Revenue Calculation:', {
    clientProducts,
    filtered: clientProducts?.filter(cp => cp.is_active),
    prices: clientProducts?.filter(cp => cp.is_active).map(cp => cp.product.suggested_price),
    activeRevenue
  })

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${activeRevenue || 0}/mo</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {clientProducts?.filter(cp => cp.is_active).length || 0} active products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upsell Opportunities
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientProducts?.filter(cp => !cp.is_active).length || 0} Products
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Potential +${clientProducts
                ?.filter(cp => !cp.is_active)
                .reduce((sum, cp) => sum + (cp.product.suggested_price || 0), 0)}/mo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lifetime Value
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${calculateLTV(client.created_at, activeRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {formatDistanceToNow(new Date(client.created_at))} of activity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Loyalty</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatJoinDate(client.created_at)}
            </div>
            {getLoyaltyTier(client.created_at) === 'New Client - High Priority' ? (
              <motion.div
                className={`text-sm mt-1 ${getLoyaltyColor(getLoyaltyTier(client.created_at))}`}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {getLoyaltyTier(client.created_at)}
              </motion.div>
            ) : (
              <div className={`text-sm mt-1 ${getLoyaltyColor(getLoyaltyTier(client.created_at))}`}>
                {getLoyaltyTier(client.created_at)}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Contact className="h-4 w-4 mr-2" />
                <span className="font-medium">{client.contact_name}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
                <span>{client.contact_email}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                </svg>
                <span>{client.contact_phone}</span>
              </div>
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {client.website}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Activated</h4>
                <div className="flex flex-wrap gap-2">
                  {clientProducts
                    ?.filter(cp => cp.is_active)
                    .map((cp, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40"
                      >
                        {cp.product.name}
                      </Badge>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Available</h4>
                <div className="flex flex-wrap gap-2">
                  {clientProducts
                    ?.filter(cp => !cp.is_active)
                    .map((cp, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="text-gray-500 dark:text-gray-400"
                      >
                        {cp.product.name}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
