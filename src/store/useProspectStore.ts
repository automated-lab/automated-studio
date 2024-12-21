import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LocationType = google.maps.LatLng | {
  lat: () => number;
  lng: () => number;
};

export interface CustomPlaceResult {
  name?: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    } | google.maps.LatLng;
  } | undefined;
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
      searchResults: [] as CustomPlaceResult[],
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