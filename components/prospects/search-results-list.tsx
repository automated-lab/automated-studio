'use client'

import * as React from "react"
import { Star, ArrowRight, MapPin, Phone, Globe, SearchCheck, Bot, BotOff } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getReviewPotential } from "@/lib/review-potential" // We'll create this next
import { CustomPlaceResult } from '@/src/store/useProspectStore'  // Add this import
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState, useRef, useMemo } from "react"
import { toast } from "sonner"
import { Product } from "@/types"
import type { Database } from '@/types/database'
type BotType = Database['public']['Tables']['bots']['Row']

interface SearchResultsListProps {
  searchResults: CustomPlaceResult[]
  onBusinessClick: (index: number) => void
}

interface ChatbotStatus {
  hasChatbot: boolean | null;
  status: string;
  platform?: string;
}

const platformDisplayNames = {
  webflow: 'Webflow',
  wix: 'Wix',
  squarespace: 'Squarespace',
  shopify: 'Shopify',
  duda: 'Duda',
  wordpress: 'WordPress',
  weebly: 'Weebly'
} as const

export function SearchResultsList({ searchResults, onBusinessClick }: SearchResultsListProps) {
  const [chatbotStatus, setChatbotStatus] = useState<Record<string, ChatbotStatus>>({})
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [showBotDialog, setShowBotDialog] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<CustomPlaceResult | null>(null)
  const [selectedBotType, setSelectedBotType] = useState<string>('')
  const [demoUrl, setDemoUrl] = useState<string | null>(null)
  const isGenerating = useRef(false)
  const toastShown = useRef(false)
  const [botTemplates, setBotTemplates] = useState<BotType[]>([])

  useEffect(() => {
    async function fetchBots() {
      const res = await fetch('/api/bot-templates')
      const data = await res.json()
      if (Array.isArray(data)) {
        setBotTemplates(data)
      }
    }
    fetchBots()
  }, [])

  useEffect(() => {
    const checkedUrls = new Set()
    
    searchResults.forEach(async (place) => {
      if (place.website && !chatbotStatus[place.place_id] && !checkedUrls.has(place.website)) {
        checkedUrls.add(place.website)
        setIsLoading(prev => ({ ...prev, [place.place_id]: true }))
        
        try {
          console.log('Checking website:', place.website)
          const response = await fetch('/api/check-chatbot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: place.website })
          })
          const data = await response.json()
          
          setChatbotStatus(prev => ({
            ...prev,
            [place.place_id]: {
              hasChatbot: data.hasChatbot,
              status: data.status || 'success',
              platform: data.platform,
              compatible: data.compatible
            }
          }))
        } catch (error) {
          console.error('Chatbot detection failed:', error)
          setChatbotStatus(prev => ({
            ...prev,
            [place.place_id]: {
              hasChatbot: null,
              status: 'error',
              compatible: false
            }
          }))
        } finally {
          setIsLoading(prev => ({ ...prev, [place.place_id]: false }))
        }
      }
    })
  }, [searchResults])

  return (
    <div className="space-y-4">
      {searchResults.map((place, index) => (
        <Card 
          key={index}
          className="mb-4"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold">{place.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {place.formatted_address}
                </div>
                {place.formatted_phone_number && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-1" />
                    {place.formatted_phone_number}
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  {place.website && (
                    <>
                        <Tooltip>
                          <TooltipTrigger>
                            <a 
                              href={place.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <GoogleGLogo />
                              <span className="ml-2 pl-2 border-l border-gray-200 h-4 flex items-center">
                                <span className="text-xs">GMB Profile</span>
                              </span>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Google My Business Profile</p>
                          </TooltipContent>
                        </Tooltip>
                      <a 
                        href={place.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors h-[34px] min-w-fit"
                      >
                        <Globe className="h-4 w-4 text-blue-500" />
                        <span className="ml-2 pl-2 border-l border-gray-200 h-4 flex items-center">
                          <span className="text-xs">Website</span>
                        </span>
                      </a>

                      <div 
                        className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors h-[34px] min-w-fit cursor-pointer"
                        onClick={() => {
                          console.log('Clicked!', {
                            status: chatbotStatus[place.place_id],
                            hasChatbot: chatbotStatus[place.place_id]?.hasChatbot,
                            isIncompatible: chatbotStatus[place.place_id]?.status === 'incompatible'
                          })
                          
                          if (!chatbotStatus[place.place_id]?.hasChatbot && chatbotStatus[place.place_id]?.status !== 'incompatible') {
                            setSelectedPlace(place)
                            setShowBotDialog(true)
                          }
                        }}
                        
                      >
                        {chatbotStatus[place.place_id]?.status === 'incompatible' 
                          ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <BotOff className="h-4 w-4 text-orange-500" />                              
                              <TooltipContent>
                                <p>{platformDisplayNames[chatbotStatus[place.place_id].platform as keyof typeof platformDisplayNames]} is not compatible with the showcase tool</p>
                              </TooltipContent>
                              </TooltipTrigger>
                            </Tooltip>
                          )
                          : <Bot className={`h-4 w-4 ${
                              isLoading[place.place_id]
                                ? 'text-gray-400'
                                : chatbotStatus[place.place_id]?.hasChatbot
                                  ? 'text-gray-400'
                                  : 'text-green-500'
                            }`} />
                        }
                        <div className="ml-2 pl-2 border-l border-gray-200 h-4 flex items-center">
                          <span className="text-xs">
                            {isLoading[place.place_id]
                              ? 'Checking...'
                              : chatbotStatus[place.place_id]?.status === 'incompatible'
                                ? `${platformDisplayNames[chatbotStatus[place.place_id].platform as keyof typeof platformDisplayNames]}`
                                : chatbotStatus[place.place_id]?.hasChatbot
                                  ? 'Chatbot Detected'
                                  : 'No Chatbot Detected'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {place.rating && (
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-400" />
                              <span className="text-xs">{place.rating}</span>
                              <span className="text-xs text-gray-500 ml-1">({place.user_ratings_total})</span>
                            </div>
                            
                            {(() => {
                              const potential = getReviewPotential(place.rating, place.user_ratings_total)
                              if (!potential) return null
                              
                              const Icon = potential.icon
                              return (
                                <div className="ml-2 pl-2 border-l border-gray-200">
                                  <Icon className={`h-4 w-4 ${potential.color}`} />
                                </div>
                              )
                            })()}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-[200px] p-3">
                            <p className="font-semibold mb-2">
                              {getReviewPotential(place.rating, place.user_ratings_total)?.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getReviewPotential(place.rating, place.user_ratings_total)?.description}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                  )}

                </div>
                
              </div>
              <Button
                size="sm"
                className="ml-4"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  console.log("Sending to GHL:", place)
                }}
              >
                Send to GHL
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Dialog open={showBotDialog} onOpenChange={setShowBotDialog}>
        <DialogContent className="space-y-6">
          <DialogHeader>
            <DialogTitle>Add Chatbot Demo</DialogTitle>
            <DialogDescription>
              Create a demo chatbot for {selectedPlace?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <Select
                value={selectedBotType}
                onValueChange={setSelectedBotType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a bot template" />
                </SelectTrigger>
                <SelectContent>
                  {botTemplates.map((template: BotType) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{template.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({template.description})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBotDialog(false)}>Cancel</Button>
              <Button 
                onClick={(e) => {
                  e.preventDefault()
                  
                  if (isGenerating.current) return
                  isGenerating.current = true

                  requestAnimationFrame(() => {
                    const websiteUrl = selectedPlace?.website?.replace('http://', 'https://') || ''
                    const newDemoUrl = `https://botsonyour.site/showcase.html?url=${encodeURIComponent(websiteUrl)}&botId=${selectedBotType}`
                    
                    setDemoUrl(newDemoUrl)
                    
                    if (!toastShown.current) {
                      toast.success('Demo generated successfully!', {
                        description: 'Click the link below to view your demo',
                        id: 'demo-generated'
                      })
                      toastShown.current = true
                    }

                    setTimeout(() => {
                      isGenerating.current = false
                      toastShown.current = false
                    }, 1000)
                  })
                }}
                disabled={!selectedBotType || isGenerating.current}
              >
                Generate Demo
              </Button>
            </div>

            {demoUrl && (
              <div className="pt-2 flex justify-center">
                <a 
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  View Live Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 

interface ConvertToLeadDialogProps {
  place: any;
  onConfirm: (data: any) => Promise<void>;
  onCancel: () => void;
}

function ConvertToLeadDialog({ place, onConfirm, onCancel }: ConvertToLeadDialogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: string}>({})
  
  useEffect(() => {
    // Fetch available products
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convert {place.name} to Lead</DialogTitle>
          <DialogDescription>
            Select products this lead might be interested in
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {products.map(product => (
            <div key={product.id} className="flex items-center space-x-2">
              <Select
                value={selectedProducts[product.id] || ''}
                onValueChange={(value) => setSelectedProducts(prev => ({
                  ...prev,
                  [product.id]: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Interest in ${product.name}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERESTED">Interested</SelectItem>
                  <SelectItem value="MAYBE">Maybe</SelectItem>
                  <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          
          <Textarea 
            placeholder="Additional notes..."
            className="mt-4"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onConfirm({
            place,
            productInterests: selectedProducts
          })}>
            Create Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

async function handleConvertToLead(data: any) {
  try {
    // First create the lead
    const leadResponse = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_name: data.place.name,
        source: 'PROSPECTING',
        place_id: data.place.place_id,
        address: data.place.formatted_address,
        website: data.place.website,
        phone: data.place.formatted_phone_number,
        status: 'NEW',
        productInterests: data.productInterests // Will be handled in API
      })
    })
    
    if (!leadResponse.ok) throw new Error('Failed to create lead')
    toast.success('Lead created successfully')
  } catch (error) {
    toast.error('Failed to create lead')
    console.error(error)
  }
} 

const GoogleGLogo = () => (
  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
) 

const detectChatbot = async (url: string) => {
  try {
    const response = await fetch('/api/check-chatbot', {
      method: 'POST',
      body: JSON.stringify({ url })
    })
    const data = await response.json()
    return data.hasChatbot
  } catch (error) {
    console.error('Chatbot detection failed:', error)
    return null
  }
} 
