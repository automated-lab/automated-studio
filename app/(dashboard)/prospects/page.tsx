'use client'
export const dynamic = 'force-dynamic'

import * as React from "react"
import { Search, Filter, MapPin, Star, MessageSquare, Share2, Building2, ArrowRight } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProspectingInterface() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedBusiness, setSelectedBusiness] = React.useState<any>(null)

  // Mock data for demonstration
  const businesses = [
    {
      id: 1,
      name: "Tech Solutions Inc",
      address: "123 Main St, Boston, MA",
      website: "techsolutions.com",
      socialMedia: {
        facebook: true,
        twitter: true,
        instagram: true,
      },
      metrics: {
        reviews: 45,
        rating: 4.2,
        monthlyWebVisits: "12K",
        chatbotStatus: "No chatbot",
        socialEngagement: "Medium",
      },
    },
    {
      id: 2,
      name: "Digital Marketing Pro",
      address: "456 Oak Ave, Boston, MA",
      website: "digitalmarketingpro.com",
      socialMedia: {
        facebook: true,
        twitter: false,
        instagram: true,
      },
      metrics: {
        reviews: 28,
        rating: 4.5,
        monthlyWebVisits: "8K",
        chatbotStatus: "Basic chatbot",
        socialEngagement: "High",
      },
    },
  ]

  return (
    <div className="flex h-screen">
      {/* Left Panel - Search & Results */}
      <div className="w-1/2 p-6 border-r overflow-auto">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search businesses or locations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search with specific criteria
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="radius">Search Radius</Label>
                    <Select>
                      <SelectTrigger id="radius">
                        <SelectValue placeholder="Select distance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 miles</SelectItem>
                        <SelectItem value="10">10 miles</SelectItem>
                        <SelectItem value="25">25 miles</SelectItem>
                        <SelectItem value="50">50 miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-type">Business Type</Label>
                    <Select>
                      <SelectTrigger id="business-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue</Label>
                    <Select>
                      <SelectTrigger id="revenue">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100k">$100K - $500K</SelectItem>
                        <SelectItem value="500k">$500K - $1M</SelectItem>
                        <SelectItem value="1m">$1M - $5M</SelectItem>
                        <SelectItem value="5m">$5M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {businesses.map((business) => (
              <Card key={business.id} className="cursor-pointer hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{business.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {business.address}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          {business.metrics.rating} ({business.metrics.reviews})
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {business.metrics.chatbotStatus}
                        </div>
                        <div className="flex items-center">
                          <Share2 className="h-4 w-4 mr-1" />
                          {business.metrics.socialEngagement}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="ml-4"
                      onClick={() => {
                        // Handle GHL integration
                        console.log("Sending to GHL:", business)
                      }}
                    >
                      Send to GHL
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Map & Details */}
      <div className="w-1/2 p-6">
        <Tabs defaultValue="map" className="h-full">
          <TabsList>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="details">Business Details</TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="h-[calc(100%-40px)]">
            <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </TabsContent>
          <TabsContent value="details" className="h-[calc(100%-40px)]">
            {selectedBusiness ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedBusiness.name}</h2>
                {/* Add detailed business information here */}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a business to view details
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

