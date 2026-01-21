import { create } from 'zustand';
import type { Venue } from '../types/venue';

interface VenueStore {
  selectedVenue: Venue | null;
  hoveredVenueId: string | null;
  showHighlightMarker: boolean; // Whether to show the animated highlight marker
  setSelectedVenue: (venue: Venue | null, options?: { showHighlight?: boolean }) => void;
  setHoveredVenue: (id: string | null) => void;
}

export const useVenueStore = create<VenueStore>((set) => ({
  selectedVenue: null,
  hoveredVenueId: null,
  showHighlightMarker: false,
  setSelectedVenue: (venue, options = {}) => set({
    selectedVenue: venue,
    showHighlightMarker: options.showHighlight ?? true, // Default to showing highlight on click
  }),
  setHoveredVenue: (id) => set({ hoveredVenueId: id }),
}));
