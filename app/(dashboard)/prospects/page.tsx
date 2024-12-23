'use client'
export const dynamic = 'force-dynamic'

import * as React from "react"
import { Search, MapPin } from 'lucide-react'
import { useLoadScript, Libraries } from '@react-google-maps/api'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapView } from "@/components/prospects/map-view"
import { SearchResultsList } from "@/components/prospects/search-results-list"
import { useProspectStore, LocationType } from "@/src/store/useProspectStore"
import { useContext } from 'react'
import { DashboardContext } from '@/contexts/DashboardContext'
import { useEffect, useState } from 'react'
import { getReviewPotential } from "@/lib/review-potential"
import { RecentSearches } from "@/components/prospects/recent-searches"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const libraries: Libraries = ['places'] as const
const mapNode = typeof document !== 'undefined' ? document.createElement('div') : null

// Utility functions
const getLatLngValue = (location: any): {lat: number, lng: number} => {
  if (!location) return { lat: 0, lng: 0 }

  // Case 1: location has function properties
  if (typeof location.lat === 'function') {
    return {
      lat: location.lat(),
      lng: location.lng()
    }
  }
  
  // Case 2: location is a plain object with number properties
  if (typeof location.lat === 'number') {
    return {
      lat: location.lat,
      lng: location.lng
    }
  }

  // Case 3: fallback for when location is a toJSON()-able object
  if (location.toJSON) {
    const { lat, lng } = location.toJSON()
    return { lat, lng }
  }

  // Last resort: try to parse numbers from whatever we got
  return {
    lat: Number(location.lat || 0),
    lng: Number(location.lng || 0)
  }
}

const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
  const R = 6371 // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180
  const dLon = (point2.lng - point1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export default function ProspectingInterface() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  })

  const { 
    searchQuery, 
    setSearchQuery, 
    locationSearch: storedLocation, 
    setLocationSearch, 
    location, 
    setLocation,
    searchResults,
    setSearchResults 
  } = useProspectStore()

  const [mapRef, setMapRef] = React.useState<google.maps.Map | null>(null)
  const [selectedBusinessId, setSelectedBusinessId] = React.useState<number>()
  const [shouldPanTo, setShouldPanTo] = React.useState(false)
  const [preparedLocation, setPreparedLocation] = React.useState<{ lat: number; lng: number } | null>(null)
  const [refreshSearches, setRefreshSearches] = useState(0)

  const placesAutocomplete = usePlacesAutocomplete({
    requestOptions: { 
      types: ['(cities)']
    },
    debounce: 300,
    initOnMount: isLoaded
  })

  const {
    ready: locationReady,
    value: locationSearch,
    suggestions: { status: locationStatus, data: locationSuggestions },
    setValue: setLocationValue,
    clearSuggestions: clearLocationSuggestions
  } = placesAutocomplete

  const { setProspectsState } = useContext(DashboardContext)

  // Type definitions
  interface Business {
    id: number
    name: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
    rating?: number
    totalRatings?: number
  }

  interface CustomPlaceResult extends google.maps.places.PlaceResult {
    geometry: {
      location: google.maps.LatLng
    }
  }

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
      location: {
        lat: number
        lng: number
      }
    }[]
  }

  interface RecentSearchResult {
    place_id: string;
    business_name: string;
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

  // Event handlers
  const handleSearch = React.useCallback(() => {
    if (!isLoaded || !searchQuery || typeof google === 'undefined') return
    
    setShouldPanTo(true)
    const locationForSearch = preparedLocation || getLatLngValue(location)
    
    const service = new google.maps.places.PlacesService(mapNode!)
    const request = {
      query: searchQuery,
      radius: 5000,
      type: 'establishment',
      location: new google.maps.LatLng(locationForSearch.lat, locationForSearch.lng),
    }

    service.textSearch(request, async (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const filteredResults = results.filter(place => {
          if (!place.geometry?.location) return false
          const distance = calculateDistance(
            locationForSearch,
            {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          )
          return distance <= 5
        })
        
        const convertedResults = await Promise.all(filteredResults.map(async place => {
          // Get additional details including phone number and website
          const details = await new Promise<google.maps.places.PlaceResult>((resolve) => {
            service.getDetails(
              { placeId: place.place_id!, fields: ['formatted_phone_number', 'website'] },
              (result) => resolve(result || place)
            )
          })

          return {
            ...place,
            formatted_phone_number: details.formatted_phone_number,
            website: details.website,
            geometry: {
              location: new google.maps.LatLng(
                place.geometry!.location!.lat(),
                place.geometry!.location!.lng()
              )
            }
          }
        })) as CustomPlaceResult[]

        // Save search via API route
        try {
          await fetch('/api/prospects/searches', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              searchQuery,
              searchLocation: storedLocation,
              searchRadius: 5,
              results: convertedResults.map(result => ({
                name: result.name,
                place_id: result.place_id,
                formatted_address: result.formatted_address,
                rating: result.rating,
                user_ratings_total: result.user_ratings_total,
                formatted_phone_number: result.formatted_phone_number,
                website: result.website,
                location: getLatLngValue(result.geometry.location)
              }))
            })
          })
        } catch (error) {
          console.error('Error saving search:', error)
        }

        setSearchResults(convertedResults)
        setLocation({ 
          lat: locationForSearch.lat, 
          lng: locationForSearch.lng 
        })
        setPreparedLocation(null)
        setRefreshSearches(prev => prev + 1)
      }
    })
  }, [isLoaded, searchQuery, preparedLocation, location, setLocation, setSearchResults])

  const handleLocationSelect = async (description: string) => {
    setLocationValue(description, false)
    setLocationSearch(description)
    clearLocationSuggestions()

    try {
      const results = await getGeocode({ address: description })
      const { lat, lng } = await getLatLng(results[0])
      setPreparedLocation({ lat, lng })
    } catch (error) {
      console.error('Error selecting location:', error)
    }
  }

  const handleReset = () => {
    setSearchQuery('')
    setLocationSearch('')
    setSearchResults([])
  }

  const handleSearchSelect = (search: RecentSearch) => {
    const transformedResults = search.prospect_results.map((result: RecentSearchResult) => ({
      name: result.business_name,
      place_id: result.place_id,
      formatted_address: result.formatted_address,
      rating: result.rating,
      user_ratings_total: result.total_ratings,
      formatted_phone_number: result.formatted_phone_number,
      website: result.website,
      geometry: {
        location: new google.maps.LatLng(
          result.location.lat,
          result.location.lng
        )
      }
    })) as CustomPlaceResult[]
    
    setSearchResults(transformedResults)
  }

  const handleBusinessClick = (index: number) => {
    setSelectedBusinessId(index)
  }

  // Effects
  React.useEffect(() => {
    if (!isLoaded || !searchResults?.length || typeof google === 'undefined') return

    const needsConversion = searchResults.some(result => 
      !(result.geometry?.location instanceof google.maps.LatLng)
    )
    
    if (needsConversion) {
      const convertedResults = searchResults.map(result => ({
        ...result,
        geometry: {
          location: new google.maps.LatLng(
            getLatLngValue(result.geometry?.location).lat,
            getLatLngValue(result.geometry?.location).lng
          )
        }
      }))
      setSearchResults(convertedResults)
    }
  }, [isLoaded, searchResults, setSearchResults])

  useEffect(() => {
    if (!searchResults?.length) return
    
    setProspectsState({
      searchResults: searchResults.map(result => ({
        name: result.name,
        address: result.formatted_address,
        rating: result.rating,
        totalRatings: result.user_ratings_total,
        location: result.geometry?.location ? getLatLngValue(result.geometry.location) : { lat: 0, lng: 0 },
        phone: result.formatted_phone_number,
        website: result.website,
        reviewPotential: getReviewPotential(result.rating, result.user_ratings_total)
      })),
      totalResults: searchResults.length,
      currentQuery: searchQuery
    })
  }, [searchResults, searchQuery, setProspectsState])

  // Derived state
  const mapBusinesses = React.useMemo(() => searchResults.map((result, index) => ({
    id: index,
    name: result.name || '',
    address: result.formatted_address || '',
    coordinates: result.geometry?.location ? getLatLngValue(result.geometry.location) : undefined,
    rating: result.rating,
    totalRatings: result.user_ratings_total
  })), [searchResults])

  return (
    <div className="h-[calc(100vh-10rem)]">
      <div className="flex h-full">
        <div className="w-1/2 flex flex-col min-h-0">
          <div className="p-6 pb-0">
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="search-what">What</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-what"
                      placeholder="gyms, restaurants, etc."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={!isLoaded}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <Label htmlFor="search-where">Where</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-where"
                      placeholder="suburb or postcode"
                      className="pl-8"
                      value={storedLocation}
                      onChange={(e) => {
                        setLocationValue(e.target.value)
                        setLocationSearch(e.target.value)
                      }}
                      disabled={!locationReady}
                    />
                    {locationStatus === "OK" && (
                      <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                        {locationSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleLocationSelect(suggestion.description)}
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit" disabled={!isLoaded}>
                    Search
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={!isLoaded}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </form>
            
            <RecentSearches 
              onSearchSelect={handleSearchSelect} 
              refreshTrigger={refreshSearches}
            />
          </div>

          <div className="flex-1 overflow-auto p-6 pt-4">
            <SearchResultsList 
              searchResults={searchResults}
              onBusinessClick={handleBusinessClick}
            />
          </div>
        </div>

        <div className="w-1/2 p-6">
          {isLoaded ? (
            <MapView 
              businesses={mapBusinesses}
              center={location}
              selectedBusinessId={selectedBusinessId}
              onMarkerClick={handleBusinessClick}
              shouldPanTo={shouldPanTo}
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
              Loading map...
            </div>
          )}
        </div>
      </div>

      <div className="h-16 border-t bg-background px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {searchResults.length} results found
          </span>
        </div>
      </div>
    </div>
  )
}

// Add this type guard function
const isLatLngLiteral = (location: any): location is google.maps.LatLngLiteral => {
  return location && typeof location.lat === 'function' && typeof location.lng === 'function';
};

