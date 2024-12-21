'use client'

import * as React from "react"
import { Star, ArrowRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getReviewPotential } from "@/lib/review-potential" // We'll create this next
import { CustomPlaceResult } from '@/src/store/useProspectStore'  // Add this import

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