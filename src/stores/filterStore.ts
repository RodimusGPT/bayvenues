import { create } from 'zustand';
import type { Country, Setting, FilterState } from '../types/venue';

interface FilterStore extends FilterState {
  setSearchQuery: (query: string) => void;
  toggleCountry: (country: Country) => void;
  toggleRegion: (region: string) => void;
  toggleVenueType: (type: string) => void;
  toggleSetting: (setting: Setting) => void;
  setPriceRange: (range: [number, number]) => void;
  setCapacityRange: (range: [number, number]) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  searchQuery: '',
  selectedCountries: [],
  selectedRegions: [],
  selectedVenueTypes: [],
  selectedSettings: [],
  priceRange: [0, 100000],
  capacityRange: [0, 1000],
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleCountry: (country) =>
    set((state) => ({
      selectedCountries: state.selectedCountries.includes(country)
        ? state.selectedCountries.filter((c) => c !== country)
        : [...state.selectedCountries, country],
    })),

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
