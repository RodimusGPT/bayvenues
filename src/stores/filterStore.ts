import { create } from 'zustand';
import type { Region, Setting, FilterState } from '../types/venue';

interface FilterStore extends FilterState {
  setSearchQuery: (query: string) => void;
  toggleRegion: (region: Region) => void;
  toggleVenueType: (type: string) => void;
  toggleSetting: (setting: Setting) => void;
  setPriceRange: (range: [number, number]) => void;
  setCapacityRange: (range: [number, number]) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  searchQuery: '',
  selectedRegions: [],
  selectedVenueTypes: [],
  selectedSettings: [],
  priceRange: [0, 100000],
  capacityRange: [0, 1000],
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleRegion: (region) =>
    set((state) => ({
      selectedRegions: state.selectedRegions.includes(region)
        ? state.selectedRegions.filter((r) => r !== region)
        : [...state.selectedRegions, region],
    })),

  toggleVenueType: (type) =>
    set((state) => ({
      selectedVenueTypes: state.selectedVenueTypes.includes(type)
        ? state.selectedVenueTypes.filter((t) => t !== type)
        : [...state.selectedVenueTypes, type],
    })),

  toggleSetting: (setting) =>
    set((state) => ({
      selectedSettings: state.selectedSettings.includes(setting)
        ? state.selectedSettings.filter((s) => s !== setting)
        : [...state.selectedSettings, setting],
    })),

  setPriceRange: (range) => set({ priceRange: range }),

  setCapacityRange: (range) => set({ capacityRange: range }),

  resetFilters: () => set(initialState),
}));
