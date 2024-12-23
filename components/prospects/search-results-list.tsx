'use client'

import * as React from "react"
import { Star, ArrowRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from 'lucide-react'
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
  searchResults: CustomPlaceResult[]  // Changed from PlaceResult[]
  onBusinessClick: (index: number) => void
}

export function SearchResultsList({ searchResults, onBusinessClick }: SearchResultsListProps) {
  return (
    <div className="space-y-4">
      {searchResults.map((place, index) => (
        <Card 
          key={index}
          className="cursor-pointer hover:bg-muted/50 mb-4"
          onClick={() => onBusinessClick(index)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold">{place.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {place.formatted_address}
                </div>
                {place.rating && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{place.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({place.user_ratings_total})</span>
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