'use client'
export const dynamic = 'force-dynamic'

import * as React from "react"
import { Search, Filter, MapPin, Star, MessageSquare, Share2, Building2, ArrowRight } from 'lucide-react'
import { useLoadScript, Libraries, GoogleMap, Marker } from '@react-google-maps/api'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'

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
import { MapView } from "@/components/prospects/map-view"

// Add this outside your component
const libraries: Libraries = ['places'] as const

// Create a div for PlacesService
const mapNode = typeof document !== 'undefined' ? document.createElement('div') : null;

// Add this helper function outside your component
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export default function ProspectingInterface() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  })

  // Add state for search query and results
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<google.maps.places.PlaceResult[]>([])
  const [location, setLocation] = React.useState({ lat: -33.8688, lng: 151.2093 }) // Default to Sydney
  const [mapRef, setMapRef] = React.useState<google.maps.Map | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = React.useState<number>()

  // Update Places Autocomplete to remove country restriction
  const {
    ready: locationReady,
    value: locationSearch,
    suggestions: { status: locationStatus, data: locationSuggestions },
    setValue: setLocationSearch,
    clearSuggestions: clearLocationSuggestions
  } = usePlacesAutocomplete({
    requestOptions: { 
      types: ['(cities)'] // Remove the country restriction
    },
    debounce: 300,
    initOnMount: isLoaded
  })

  // Add some console logs to debug
  console.log('Script loaded:', isLoaded, 'Location ready:', locationReady)

  // Handle search
  const handleSearch = React.useCallback(() => {
    if (!isLoaded || !searchQuery) return

    const service = new google.maps.places.PlacesService(mapNode!)
    
    const request = {
      query: searchQuery,
      radius: 5000,
      type: 'business',
      location: new google.maps.LatLng(location.lat, location.lng)
    }

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Sort results by distance
        const sortedResults = results.sort((a, b) => {
          if (!a.geometry?.location || !b.geometry?.location) return 0;
          
          const distanceA = calculateDistance(
            location,
            { 
              lat: a.geometry.location.lat(), 
              lng: a.geometry.location.lng() 
            }
          );
          
          const distanceB = calculateDistance(
            location,
            { 
              lat: b.geometry.location.lat(), 
              lng: b.geometry.location.lng() 
            }
          );
          
          return distanceA - distanceB;
        });

        setSearchResults(sortedResults);
      }
    })
  }, [isLoaded, searchQuery, location])

  // Handle map load
  const onMapLoad = React.useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // Handle location selection
  const handleLocationSelect = async (description: string) => {
    setLocationSearch(description, false);
    clearLocationSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      setLocation({ lat, lng });
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };

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

  // Convert search results to the format MapView expects
  const mapBusinesses = searchResults.map((place, index) => ({
    id: index,
    name: place.name || '',
    address: place.formatted_address || '',
    coordinates: place.geometry?.location 
      ? { 
          lat: place.geometry.location.lat(), 
          lng: place.geometry.location.lng() 
        }
      : undefined
  }))

  // Add click handler for the business cards
  const handleBusinessClick = (index: number) => {
    setSelectedBusinessId(index)
  }

  // Add reset handler
  const handleReset = () => {
    setSearchQuery('')
    setLocationSearch('')
    setSearchResults([])
    setSelectedBusinessId(undefined)
    // Reset to default location (Sydney)
    setLocation({ lat: -33.8688, lng: 151.2093 })
  }

  const handleMarkerClick = async (id: number) => {
    if (id === -1) {
      // Search this area clicked
      if (mapRef) {
        const newCenter = mapRef.getCenter()
        if (newCenter) {
          const newLocation = {
            lat: newCenter.lat(),
            lng: newCenter.lng()
          }
          
          const service = new google.maps.places.PlacesService(mapNode!)
          const request = {
            query: searchQuery,
            radius: 5000,
            type: 'business',
            location: new google.maps.LatLng(newLocation.lat, newLocation.lng)
          }

          service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              setLocation(newLocation) // Update the location state
              setSearchResults(results) // Update the results
              setSelectedBusinessId(undefined) // Clear selected business
            }
          })
        }
      }
    } else {
      setSelectedBusinessId(id)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Panel - Search & Results */}
      <div className="w-1/2 p-6 border-r overflow-auto">
        <div className="space-y-4">
          {/* Search Inputs */}
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
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    disabled={!locationReady}
                  />
                  {/* Location Suggestions Dropdown */}
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

          {/* Results */}
          <div className="space-y-4">
            {searchResults.map((place, index) => (
              <Card 
                key={place.place_id} 
                className="cursor-pointer hover:bg-muted/50 mb-4"
                onClick={() => handleBusinessClick(index)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{place.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {place.formatted_address}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          {place.rating} ({place.user_ratings_total})
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="ml-4"
                      onClick={() => {
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
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="w-1/2 p-6">
        <Tabs defaultValue="map" className="h-full">
          <TabsList>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="details">Business Details</TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="h-[calc(100%-40px)]">
            {isLoaded ? (
              <MapView 
                businesses={mapBusinesses}
                center={location}
                selectedBusinessId={selectedBusinessId}
                onMarkerClick={handleMarkerClick}
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </TabsContent>
          <TabsContent value="details" className="h-[calc(100%-40px)]">
            {/* Add detailed business information here */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

