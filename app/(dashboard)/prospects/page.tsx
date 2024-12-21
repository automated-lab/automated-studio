'use client'

import * as React from "react"
import { Search, MapPin } from 'lucide-react'
import { useLoadScript, Libraries } from '@react-google-maps/api'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapView } from "@/components/prospects/map-view"
import { SearchResultsList } from "@/components/prospects/search-results-list"
import { useProspectStore } from "@/src/store/useProspectStore"
import { useContext } from 'react'
import { DashboardContext } from '@/contexts/DashboardContext'
import { useEffect } from 'react'
import { getReviewPotential } from "@/lib/review-potential"

const libraries: Libraries = ['places'] as const
const mapNode = typeof document !== 'undefined' ? document.createElement('div') : null

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

  const {
    ready: locationReady,
    value: locationSearch,
    suggestions: { status: locationStatus, data: locationSuggestions },
    setValue: setLocationValue,
    clearSuggestions: clearLocationSuggestions
  } = usePlacesAutocomplete({
    requestOptions: { 
      types: ['(cities)']
    },
    debounce: 300,
    initOnMount: isLoaded
  })

  const { setProspectsState } = useContext(DashboardContext)

  React.useEffect(() => {
    if (searchResults?.length > 0 && isLoaded) {
      // Convert stored results back to proper Google Maps objects
      const convertedResults = searchResults.map(result => ({
        ...result,
        geometry: {
          ...result.geometry,
          location: {
            lat: typeof result.geometry?.location.lat === 'function' 
              ? (result.geometry?.location.lat as () => number)() 
              : result.geometry?.location.lat,
            lng: typeof result.geometry?.location.lng === 'function' 
              ? (result.geometry?.location.lng as () => number)() 
              : result.geometry?.location.lng,
            toJSON: () => ({ 
              lat: result.geometry?.location.lat,
              lng: result.geometry?.location.lng 
            })
          }
        }
      }))
      setSearchResults(convertedResults)
    }
  }, [isLoaded]) // Only run when maps is loaded

  // Add useEffect to update global state when search results change
  useEffect(() => {
    if (searchResults?.length > 0) {
      setProspectsState({
        searchResults: searchResults.map(result => ({
          name: result.name,
          address: result.formatted_address,
          rating: result.rating,
          totalRatings: result.user_ratings_total,
          location: {
            lat: result.geometry?.location.lat,
            lng: result.geometry?.location.lng
          },
          reviewPotential: getReviewPotential(result.rating, result.user_ratings_total)
        })),
        totalResults: searchResults.length,
        currentQuery: searchQuery
      })
    }
  }, [searchResults, searchQuery, setProspectsState])

  const handleSearch = React.useCallback(() => {
    if (!isLoaded || !searchQuery) return
    
    setShouldPanTo(true)
    const locationForSearch = preparedLocation || location
    
    const service = new google.maps.places.PlacesService(mapNode!)
    const request = {
      query: searchQuery,
      radius: 5000,
      type: 'establishment',
      location: new google.maps.LatLng(locationForSearch.lat, locationForSearch.lng),
    }

    service.textSearch(request, (results, status) => {
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
        
        const resultsToStore = filteredResults.map(place => ({
          ...place,
          geometry: {
            ...place.geometry,
            location: {
              lat: place.geometry?.location.lat(),
              lng: place.geometry?.location.lng()
            }
          }
        }));
        setSearchResults(resultsToStore);
        setLocation(locationForSearch);
        setPreparedLocation(null);
      }
    })
  }, [isLoaded, searchQuery, preparedLocation, location, mapRef])

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

  const handleBusinessClick = (index: number) => {
    setSelectedBusinessId(index)
  }

  const mapBusinesses = searchResults.map((result, index) => ({
    id: index,
    name: result.name || '',
    address: result.formatted_address || '',
    coordinates: result.geometry?.location ? {
      lat: Number(result.geometry.location.lat),
      lng: Number(result.geometry.location.lng)
    } : undefined,
    rating: result.rating,
    totalRatings: result.user_ratings_total
  }))

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

// Helper function
function calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
  const R = 6371
  const dLat = (point2.lat - point1.lat) * Math.PI / 180
  const dLon = (point2.lng - point1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

