import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProspectState {
  searchQuery: string;
  locationSearch: string;
  location: { lat: number; lng: number };
  setSearchQuery: (term: string) => void;
  setLocationSearch: (location: string) => void;
  setLocation: (location: { lat: number; lng: number }) => void;
}

export const useProspectStore = create<ProspectState>()(
  persist(
    (set) => ({
      searchQuery: '',
      locationSearch: '',
      location: { lat: -33.8688, lng: 151.2093 }, // Default Sydney
      setSearchQuery: (term) => set({ searchQuery: term }),
      setLocationSearch: (location) => set({ locationSearch: location }),
      setLocation: (location) => set({ location }),
    }),
    {
      name: 'prospect-storage',
    }
  )
); 