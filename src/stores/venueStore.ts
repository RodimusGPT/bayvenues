import { create } from 'zustand';
import type { Venue } from '../types/venue';

interface VenueStore {
  selectedVenue: Venue | null;
  hoveredVenueId: string | null;
  setSelectedVenue: (venue: Venue | null) => void;
  setHoveredVenue: (id: string | null) => void;
}

export const useVenueStore = create<VenueStore>((set) => ({
  selectedVenue: null,
  hoveredVenueId: null,
  setSelectedVenue: (venue) => set({ selectedVenue: venue }),
  setHoveredVenue: (id) => set({ hoveredVenueId: id }),
}));
