'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Contact, BarChart, FileText, Settings, AlertTriangle, MessageSquare, Star, Share2, CheckCircle2, XCircle, ArrowRight, CheckSquare } from 'lucide-react'

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeDialog, setActiveDialog] = useState<string | null>(null)

  // Placeholder data - replace with real data in production
  const clientData = {
    name: "Acme Inc.",
    status: "active",
    contactName: "John Doe",
    contactEmail: "john@acmeinc.com",
    contactPhone: "+1 (555) 123-4567",
    website: "https://www.acmeinc.com",
    engagementScore: 75,
    ghlStatus: "active",
    reviewManagement: true,
    websiteChatbots: true,
    socialMediaChatbots: false,
    billingStatus: "Current",
    nextReviewDate: "2023-08-15",
    documents: [
      { name: "Contract.pdf", type: "PDF", date: "2023-01-15" },
      { name: "Onboarding Checklist.docx", type: "DOCX", date: "2023-01-20" },
      { name: "Marketing Strategy.pptx", type: "PPTX", date: "2023-02-05" },
    ],
    products: [
      {
        id: "ghl",
        name: "Go High Level",
        description: "All-in-one marketing platform",
        icon: <Settings className="h-6 w-6" />,
        active: true,
        price: "$297/mo",
        benefits: ["CRM Integration", "Email Marketing", "SMS Campaigns"]
      },
      {
        id: "review",
        name: "Review Management",
        description: "Boost online reputation",
        icon: <Star className="h-6 w-6" />,
        active: true,
        price: "$197/mo",
        benefits: ["Review Monitoring", "Response Management", "Rating Improvement"]
      },
      {
        id: "social",
        name: "Social Media Bots",
        description: "Automate social engagement",
        icon: <Share2 className="h-6 w-6" />,
        active: false,
        price: "$147/mo",
        benefits: ["24/7 Response", "Lead Generation", "Content Scheduling"]
      },
      {
        id: "website",
        name: "Website Chatbots",
        description: "Convert visitors to leads",
        icon: <MessageSquare className="h-6 w-6" />,
        active: false,
        price: "$147/mo",
        benefits: ["Lead Qualification", "Appointment Booking", "FAQ Automation"]
      }
    ]
  }

  const ProductActivationCard = ({ product }: { product: any } ) => (
    <Dialog open={activeDialog === product.id} onOpenChange={() => setActiveDialog(null)}>
      <DialogTrigger asChild>
        <Card className={`cursor-pointer transition-all hover:shadow-lg ${
          product.active ? 'border-green-200 bg-green-50' : 'hover:border-blue-200'
        }`}>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${
                  product.active ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  <div className="text-white">
                    {product.icon}
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </div>
              </div>
              {product.active ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => setActiveDialog(product.id)}
                >
                  Activate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Key Benefits:</p>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-lg font-bold text-muted-foreground">
                {product.price}
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Activate {product.name}</DialogTitle>
          <DialogDescription>
            Complete the form below to activate {product.name} for this client.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* This is where your activation form will be embedded */}
          <div className="rounded-lg border p-4 text-center text-muted-foreground">
            Activation form will be embedded here
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{clientData.name}</h1>
          <p className="text-muted-foreground">Client Dashboard</p>
        </div>
        <Badge variant={clientData.status === 'active' ? 'default' : 'secondary'}>
          {clientData.status.charAt(0).toUpperCase() + clientData.status.slice(1)}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products & Services</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$494/mo</div>
                <p className="text-xs text-green-600 mt-1">↑ $147 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Growth Potential
                </CardTitle>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$294/mo</div>
                <p className="text-xs text-muted-foreground mt-1">2 products available</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 of 4</div>
                <p className="text-xs text-muted-foreground mt-1">products activated</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Annual Value
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$5,928</div>
                <p className="text-xs text-muted-foreground mt-1">per year</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Contact className="h-4 w-4 mr-2" />
                        <span className="font-medium">{clientData.contactName}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                        </svg>
                        <span className="text-sm">{clientData.contactEmail}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                          <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{clientData.contactPhone}</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        <a href={clientData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                          Website
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Schedule Call
                    </Button>
                    <Button size="sm">
                      Send Proposal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {clientData.products.map((product) => (
                    <ProductActivationCard key={product.id} product={product} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {clientData.products.map((product) => (
              <ProductActivationCard key={product.id} product={product} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Opportunity</CardTitle>
              <CardDescription>
                Potential additional monthly revenue from inactive products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${clientData.products
                  .filter(p => !p.active)
                  .reduce((sum, p) => sum + parseInt(p.price.replace(/\D/g, '')), 0)
                }/mo
              </div>
              <Progress 
                value={
                  (clientData.products.filter(p => p.active).length / 
                  clientData.products.length) * 100
                } 
                className="mt-2" 
              />
              <p className="text-sm text-muted-foreground mt-2">
                {clientData.products.filter(p => p.active).length} of {clientData.products.length} products activated
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Documents</CardTitle>
              <CardDescription>Access and manage client-related documents</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {clientData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.date}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{doc.type}</Badge>
                  </div>
                ))}
              </ScrollArea>
              <div className="mt-4 flex justify-end">
                <Button>Upload New Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

