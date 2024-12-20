import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomPlaceResult extends Omit<google.maps.places.PlaceResult, 'geometry'> {
  id?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: google.maps.LatLngBounds;
  };
}

interface ProspectState {
  searchQuery: string;
  locationSearch: string;
  location: { lat: number; lng: number };
  searchResults: CustomPlaceResult[];
  setSearchQuery: (term: string) => void;
  setLocationSearch: (location: string) => void;
  setLocation: (location: { lat: number; lng: number }) => void;
  setSearchResults: (results: CustomPlaceResult[]) => void;
}

export const useProspectStore = create<ProspectState>()(
  persist(
    (set) => ({
      searchQuery: '',
      locationSearch: '',
      location: { lat: -33.8688, lng: 151.2093 }, // Default Sydney
      searchResults: [],
      setSearchQuery: (term) => set({ searchQuery: term }),
      setLocationSearch: (location) => set({ locationSearch: location }),
      setLocation: (location) => set({ location }),
      setSearchResults: (results) => set({ searchResults: results }),
    }),
    {
      name: 'prospect-storage',
    }
  )
); 