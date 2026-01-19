import { create } from 'zustand';
import type { Setting, FilterState } from '../types/venue';

interface FilterStore extends FilterState {
  // Debounced filters for API calls
  debouncedFilters: FilterState;

  // Actions
  setSearchQuery: (query: string) => void;
  toggleCountry: (country: string) => void;  // Dynamic - supports any country
  toggleRegion: (region: string) => void;
  toggleVenueType: (type: string) => void;
  toggleSetting: (setting: Setting) => void;
  setPriceRange: (range: [number, number]) => void;
  setCapacityRange: (range: [number, number]) => void;
  resetFilters: () => void;
}

// Debounce timer for filter updates
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 300;

// Use high initial max values to ensure no venues are excluded before metadata loads
// These will be constrained by the actual bounds from the database in the UI
const initialState: FilterState = {
  searchQuery: '',
  selectedCountries: [],
  selectedRegions: [],
  selectedVenueTypes: [],
  selectedSettings: [],
  priceRange: [0, 10000000], // 10M - high enough to include all venues
  capacityRange: [0, 10000],  // 10K - high enough to include all venues
};

// Helper to update debounced filters after a delay
function updateDebouncedFilters(set: (partial: Partial<FilterStore>) => void, get: () => FilterStore) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    const state = get();
    set({
      debouncedFilters: {
        searchQuery: state.searchQuery,
        selectedCountries: state.selectedCountries,
        selectedRegions: state.selectedRegions,
        selectedVenueTypes: state.selectedVenueTypes,
        selectedSettings: state.selectedSettings,
        priceRange: state.priceRange,
        capacityRange: state.capacityRange,
      },
    });
  }, DEBOUNCE_MS);
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...initialState,
  debouncedFilters: initialState,

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    updateDebouncedFilters(set, get);
  },

  toggleCountry: (country) => {
    set((state) => ({
      selectedCountries: state.selectedCountries.includes(country)
        ? state.selectedCountries.filter((c) => c !== country)
        : [...state.selectedCountries, country],
    }));
    updateDebouncedFilters(set, get);
  },

  toggleRegion: (region) => {
    set((state) => ({
      selectedRegions: state.selectedRegions.includes(region)
        ? state.selectedRegions.filter((r) => r !== region)
        : [...state.selectedRegions, region],
    }));
    updateDebouncedFilters(set, get);
  },

  toggleVenueType: (type) => {
    set((state) => ({
      selectedVenueTypes: state.selectedVenueTypes.includes(type)
        ? state.selectedVenueTypes.filter((t) => t !== type)
        : [...state.selectedVenueTypes, type],
    }));
    updateDebouncedFilters(set, get);
  },

  toggleSetting: (setting) => {
    set((state) => ({
      selectedSettings: state.selectedSettings.includes(setting)
        ? state.selectedSettings.filter((s) => s !== setting)
        : [...state.selectedSettings, setting],
    }));
    updateDebouncedFilters(set, get);
  },

  setPriceRange: (range) => {
    set({ priceRange: range });
    updateDebouncedFilters(set, get);
  },

  setCapacityRange: (range) => {
    set({ capacityRange: range });
    updateDebouncedFilters(set, get);
  },

  resetFilters: () => {
    set({ ...initialState, debouncedFilters: initialState });
  },
}));
