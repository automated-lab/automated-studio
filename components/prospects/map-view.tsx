'use client'

import * as React from "react"
import { MapPin, Building2, Star, ArrowRight } from 'lucide-react'
import { useLoadScript, GoogleMap, InfoWindow, Marker, Libraries } from '@react-google-maps/api'
import { Button } from "@/components/ui/button"

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
  onMarkerClick?: (businessId: number, mapInstance?: google.maps.Map) => void
}

export function MapView({ businesses, center, selectedBusinessId, onMarkerClick }: MapViewProps) {
  const [map, setMap] = React.useState<google.maps.Map | null>(null)
  const [selectedBusiness, setSelectedBusiness] = React.useState<Business | null>(null)
  const initialCenter = React.useRef(center)

  React.useEffect(() => {
    if (selectedBusinessId !== undefined) {
      const business = businesses.find(b => b.id === selectedBusinessId)
      if (business && map && business.coordinates) {
        setSelectedBusiness(business)
        map.panTo(business.coordinates)
        map.setZoom(15)
      }
    }
  }, [selectedBusinessId, businesses, map])

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map)
    onMarkerClick?.(-2, map)
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
        {businesses.map((business) => (
          business.coordinates && (
            <Marker
              key={business.id}
              position={business.coordinates}
              title={business.name}
              onClick={() => setSelectedBusiness(business)}
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
            <div 
              style={{ 
                overflow: 'hidden',
                maxHeight: 'none',
                padding: '4px'
              }} 
              className="min-w-[250px] max-w-[400px]"
            >
              <h3 className="text-xl font-semibold mb-2 truncate">{selectedBusiness.name}</h3>
              <div className="text-sm text-muted-foreground mb-2">
                <div className="flex items-start">
                  <MapPin className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                  <span className="break-words">{selectedBusiness.address}</span>
                </div>
                {selectedBusiness.rating && (
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 mr-1 text-yellow-400 flex-shrink-0" />
                    {selectedBusiness.rating} ({selectedBusiness.totalRatings})
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

