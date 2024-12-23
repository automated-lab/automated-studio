import { useEffect, useState } from 'react'
import { Star, ArrowRight,MapPin, Search, History } from "lucide-react"
import { CustomPlaceResult } from '@/src/store/useProspectStore'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getReviewPotential } from "@/lib/review-potential"
    
interface RecentSearch {
  id: string
  search_query: string
  search_location: string
  search_radius: number
  created_at: string
  prospect_results: {
    place_id: string
    business_name: string
    formatted_address: string
    rating: number
    total_ratings: number
    formatted_phone_number: string
    website: string
    location: {
      lat: number
      lng: number
    }
  }[]
}

interface DatabasePlaceResult {
  business_name: string;
  place_id: string;
  formatted_address: string;
  rating: number;
  total_ratings: number;
  formatted_phone_number: string;
  website: string;
  location: {
    lat: number;
    lng: number;
  };
}

export function RecentSearches({ 
  onSearchSelect,
  refreshTrigger
}: { 
  onSearchSelect: (search: RecentSearch) => void
  refreshTrigger?: number
}) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  
  useEffect(() => {
    async function fetchRecentSearches() {
      const response = await fetch('/api/prospects/searches')
      const data = await response.json()
      setRecentSearches(data.slice(0, 5))
    }
    fetchRecentSearches()
  }, [refreshTrigger])

  if (!recentSearches?.length) return null

  const handleSearchSelect = (search: RecentSearch) => {
    const formattedResults = search.prospect_results.map(result => ({
      business_name: result.business_name,
      place_id: result.place_id,
      formatted_address: result.formatted_address,
      rating: result.rating,
      total_ratings: result.total_ratings,
      formatted_phone_number: result.formatted_phone_number,
      website: result.website,
      location: result.location
    }))

    onSearchSelect({
      ...search,
      prospect_results: formattedResults
    })
  }

  return (
    <div className="mt-4">
      <div className="text-muted-foreground flex items-center gap-1.5 mb-2 text-sm">
        <History className="h-3.5 w-3.5" />
        Recent:
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {recentSearches.map((search) => (
          <button
            key={search.id}
            onClick={() => handleSearchSelect(search)}
            className="inline-flex items-center px-2 py-0.5 bg-accent/50 hover:bg-accent rounded-md text-xs transition-colors"
          >
            {search.search_query}
            {search.search_location && (
              <span className="text-muted-foreground ml-1">
                ({search.search_location.split(',')[0]})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
} 