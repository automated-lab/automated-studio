'use client'

import * as React from "react"
import { Star, ArrowRight, MapPin, Phone, Globe, SearchCheck, Bot } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getReviewPotential } from "@/lib/review-potential" // We'll create this next
import { CustomPlaceResult } from '@/src/store/useProspectStore'  // Add this import
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Product } from "@/types"

interface SearchResultsListProps {
  searchResults: CustomPlaceResult[]
  onBusinessClick: (index: number) => void
}

export function SearchResultsList({ searchResults, onBusinessClick }: SearchResultsListProps) {
  const [chatbotStatus, setChatbotStatus] = useState<Record<string, boolean | null>>({})
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    searchResults.forEach(async (place) => {
      if (place.website && !chatbotStatus[place.place_id]) {
        setIsLoading(prev => ({ ...prev, [place.place_id]: true }))
        
        try {
          // Add timeout to the fetch
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 10000)
          })
          
          const result = await Promise.race([
            detectChatbot(place.website),
            timeoutPromise
          ])

          setChatbotStatus(prev => ({
            ...prev,
            [place.place_id]: result
          }))
        } catch (error) {
          console.error('Chatbot detection failed:', error)
          setChatbotStatus(prev => ({
            ...prev,
            [place.place_id]: null
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
                {place.rating && (
                  <div className="flex items-center gap-2">
                    <a 
                      href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors h-[34px] min-w-fit"
                    >
                      <GoogleGLogo />
                      <div className="ml-2 pl-2 border-l border-gray-200 h-4 flex items-center">
                        <span className="text-xs">GMB Profile</span>
                      </div>
                    </a>

                    <div className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors h-[34px] min-w-fit">
                      {place.website ? (
                        <a 
                          href={place.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center"
                        >
                          <Globe className="h-4 w-4 text-blue-500" />
                          <div className="ml-2 pl-2 border-l border-gray-200 h-4 flex items-center">
                            <span className="text-xs">Website</span>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <div className="ml-2 pl-2 border-l border-gray-200 h-4 flex items-center">
                            <span className="text-xs text-gray-400">No Website</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors h-[34px] min-w-fit">
                      <Bot className={`h-4 w-4 ${
                        isLoading[place.place_id]
                          ? 'text-gray-400'
                          : chatbotStatus[place.place_id] === null 
                            ? 'text-gray-400' 
                            : chatbotStatus[place.place_id] 
                              ? 'text-gray-400'
                              : 'text-green-500'
                      }`} />
                      <div className="ml-2 pl-2 border-l border-gray-200 h-4 flex items-center">
                        <span className="text-sm">
                          {isLoading[place.place_id]
                            ? 'Checking...'
                            : chatbotStatus[place.place_id] === null 
                              ? 'Check Failed' 
                              : chatbotStatus[place.place_id] 
                                ? 'Has Chatbot' 
                                : 'No Chatbot'}
                        </span>
                      </div>
                    </div>
                    
                    <TooltipProvider>
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
                    </TooltipProvider>
                    
                  </div>
                )}
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