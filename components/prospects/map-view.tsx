'use client'
export const dynamic = 'force-dynamic'

import * as React from "react"
import { MapPin, Building2, Star, ArrowRight, Flame, ThumbsDown, Medal, AlertCircle } from 'lucide-react'
import { useLoadScript, GoogleMap, InfoWindow, Marker, Libraries } from '@react-google-maps/api'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CustomPlaceResult } from '@/src/store/useProspectStore'

const libraries: Libraries = ['places'] as const

const mapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
}

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

interface MapViewProps {
  businesses: Business[]
  center: { lat: number; lng: number }
  selectedBusinessId?: number
  onMarkerClick?: (index: number) => void
  shouldPanTo: boolean
}

const getReviewPotential = (rating?: number, totalRatings?: number) => {
  if (!rating || !totalRatings) return null
  
  // High potential scenarios
  if (totalRatings < 50) return {
    icon: Flame,
    color: 'text-orange-500',
    label: 'High Potential',
    description: 'Low review count - perfect candidate for review management'
  }
  
  if (rating < 4.0) return {
    icon: AlertCircle,
    color: 'text-red-500',
    label: 'Urgent Need',
    description: 'Low rating indicates critical need for review management'
  }
  
  if (totalRatings < 100 && rating > 4.0) return {
    icon: Medal,
    color: 'text-blue-500',
    label: 'Growth Potential',
    description: 'Good rating but could benefit from more reviews'
  }
  
  // Low potential
  return {
    icon: ThumbsDown,
    color: 'text-gray-400',
    label: 'Low Potential',
    description: 'Established review presence'
  }
}

export function MapView({ businesses, center, selectedBusinessId, onMarkerClick, shouldPanTo }: MapViewProps) {
  const [map, setMap] = React.useState<google.maps.Map | null>(null)
  const [selectedBusiness, setSelectedBusiness] = React.useState<Business | null>(null)
  const initialCenter = React.useRef(center)

  React.useEffect(() => {
    if (map && center && shouldPanTo) {
      map.panTo(center)
      map.setZoom(13)
    }
  }, [center, map, shouldPanTo])

  React.useEffect(() => {
    setSelectedBusiness(null)
  }, [businesses])

  React.useEffect(() => {
    if (selectedBusinessId !== undefined) {
      const business = businesses.find(b => b.id === selectedBusinessId)
      if (business && map && business.coordinates) {
        setSelectedBusiness({
          id: business.id || 0,
          name: business.name || '',
          address: business.address || '',
          coordinates: {
            lat: business.coordinates.lat,
            lng: business.coordinates.lng
          },
          rating: business.rating,
          totalRatings: business.totalRatings
        })
        map.panTo({
          lat: business.coordinates.lat,
          lng: business.coordinates.lng
        })
        map.setZoom(14)
      }
    }
  }, [selectedBusinessId, businesses, map])

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [onMarkerClick])

  const onUnmount = React.useCallback(() => {
    setMap(null)
  }, [])

  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .gm-style-iw-d {
        overflow: hidden !important;
        max-height: none !important;
      }
      .gm-style-iw {
        padding: 12px !important;
      }
      .gm-style-iw-c {
        padding: 16px !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerClassName="w-full h-full rounded-lg"
        center={initialCenter.current}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {businesses.map((business, index) => (
          business.coordinates && (
            <Marker
              key={index}
              position={new google.maps.LatLng(
                Number(business.coordinates.lat),
                Number(business.coordinates.lng)
              )}
              onClick={() => onMarkerClick?.(business.id)}
            />
          )
        ))}
        
        {selectedBusiness && selectedBusiness.coordinates && (
          <InfoWindow
            position={selectedBusiness.coordinates}
            onCloseClick={() => setSelectedBusiness(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -35),
              maxWidth: 400,
              disableAutoPan: false
            }}
          >
            <div className="p-2 min-w-[250px] max-w-[400px]">
              <h3 className="text-xl font-semibold mb-2 truncate">{selectedBusiness.name}</h3>
              <div className="text-sm text-muted-foreground mb-2">
                <div className="flex items-start">
                  <MapPin className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                  <span className="break-words">{selectedBusiness.address}</span>
                </div>
                {selectedBusiness.rating && (
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 mr-1 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm">{selectedBusiness.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({selectedBusiness.totalRatings})</span>
                  </div>
                )}
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => onMarkerClick?.(selectedBusiness.id)}
              >
                Send to GHL
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}

