import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Venue, VenueFromAPI, Setting } from '../types/venue';
import { transformVenueFromAPI } from '../types/venue';
import { useFavoriteStore } from '../stores/favoriteStore';
import { useHiddenStore } from '../stores/hiddenStore';

interface UseVenuesFilters {
  searchQuery: string;
  selectedCountries: string[];  // Dynamic - supports any country from DB
  selectedRegions: string[];
  selectedVenueTypes: string[];
  selectedSettings: Setting[];
  priceRange: [number, number];
  capacityRange: [number, number];
}

interface UseVenuesOptions {
  filters: UseVenuesFilters;
  enabled?: boolean;
}

export function useSupabaseVenues({ filters, enabled = true }: UseVenuesOptions) {
  const { favorites, showFavoritesOnly } = useFavoriteStore();
  const { hidden } = useHiddenStore();

  return useQuery({
    queryKey: [
      'venues',
      filters.searchQuery,
      filters.selectedCountries,
      filters.selectedRegions,
      filters.selectedVenueTypes,
      filters.selectedSettings,
      filters.priceRange,
      filters.capacityRange,
      showFavoritesOnly,
      Array.from(favorites),
      Array.from(hidden),
    ],
    queryFn: async (): Promise<Venue[]> => {
      const { data, error } = await supabase.rpc('search_venues', {
        search_query: filters.searchQuery || null,
        countries: filters.selectedCountries.length > 0 ? filters.selectedCountries : null,
        filter_regions: filters.selectedRegions.length > 0 ? filters.selectedRegions : null,
        filter_venue_types: filters.selectedVenueTypes.length > 0 ? filters.selectedVenueTypes : null,
        filter_settings: filters.selectedSettings.length > 0 ? filters.selectedSettings : null,
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1],
        min_capacity: filters.capacityRange[0],
        max_capacity: filters.capacityRange[1],
        excluded_ids: hidden.size > 0 ? Array.from(hidden) : null,
        favorite_ids: favorites.size > 0 ? Array.from(favorites) : null,
        favorites_only: showFavoritesOnly,
      });

      if (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }

      // Transform API response to Venue type
      return (data as VenueFromAPI[]).map(transformVenueFromAPI);
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook to get a single venue by ID
export function useVenue(venueId: string | null) {
  return useQuery({
    queryKey: ['venue', venueId],
    queryFn: async (): Promise<Venue | null> => {
      if (!venueId) return null;

      const { data, error } = await supabase.rpc('get_venue', {
        venue_id: venueId,
      });

      if (error) {
        console.error('Error fetching venue:', error);
        throw error;
      }

      if (!data || data.length === 0) return null;

      return transformVenueFromAPI(data[0] as VenueFromAPI);
    },
    enabled: !!venueId,
  });
}

// Minimal venue data for map markers
interface MapMarkerVenue {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  header_image: { url: string; source: string } | null;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function useVenuesInBounds(bounds: MapBounds | null) {
  const { hidden } = useHiddenStore();

  return useQuery({
    queryKey: ['venuesInBounds', bounds, Array.from(hidden)],
    queryFn: async (): Promise<MapMarkerVenue[]> => {
      if (!bounds) return [];

      const { data, error } = await supabase.rpc('venues_in_bounds', {
        min_lat: bounds.south,
        min_lng: bounds.west,
        max_lat: bounds.north,
        max_lng: bounds.east,
        excluded_ids: hidden.size > 0 ? Array.from(hidden) : null,
      });

      if (error) {
        console.error('Error fetching venues in bounds:', error);
        throw error;
      }

      return data as MapMarkerVenue[];
    },
    enabled: !!bounds,
    staleTime: 30 * 1000, // 30 seconds for map data
  });
}

// Hook to fetch favorite venues by IDs (for FavoritesPanel)
export function useFavoriteVenues() {
  const { favorites } = useFavoriteStore();

  return useQuery({
    queryKey: ['favoriteVenues', Array.from(favorites)],
    queryFn: async (): Promise<Venue[]> => {
      if (favorites.size === 0) return [];

      const { data, error } = await supabase
        .from('venues')
        .select(`
          id, name, region, subregion, address, description,
          capacity_min, capacity_max, price_min, price_max, price_unit,
          website, phone, google_maps_url, lat, lng,
          photos, videos, reviews, header_image, header_images, youtube_search,
          google_rating, google_reviews_count, breezit_pricing, breezit_rating,
          venue_venue_types!inner(venue_types!inner(name)),
          venue_settings!inner(settings!inner(name))
        `)
        .in('id', Array.from(favorites));

      if (error) {
        console.error('Error fetching favorite venues:', error);
        throw error;
      }

      // Transform the nested response to match VenueFromAPI
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data ?? []).map((v: any) => {
        const venueTypes = v.venue_venue_types?.map((vt: { venue_types: { name: string } }) => vt.venue_types?.name).filter(Boolean) ?? [];
        const venueSettings = v.venue_settings?.map((vs: { settings: { name: string } }) => vs.settings?.name).filter(Boolean) ?? [];

        return transformVenueFromAPI({
          ...v,
          venue_types: venueTypes,
          venue_settings: venueSettings,
        } as VenueFromAPI);
      });
    },
    enabled: favorites.size > 0,
    staleTime: 30 * 1000,
  });
}

// Hook to get filter metadata (venue types, regions, price/capacity bounds)
export function useVenueMetadata() {
  return useQuery({
    queryKey: ['venueMetadata'],
    queryFn: async () => {
      // Fetch all metadata in parallel using optimized server-side functions
      const [typesResult, regionsResult, boundsResult] = await Promise.all([
        supabase.from('venue_types').select('name').order('name'),
        supabase.from('regions').select('name, country').order('name'),
        supabase.rpc('get_venue_bounds'),
      ]);

      if (typesResult.error) throw typesResult.error;
      if (regionsResult.error) throw regionsResult.error;
      if (boundsResult.error) throw boundsResult.error;

      const bounds = boundsResult.data?.[0] ?? {
        min_price: 0,
        max_price: 100000,
        min_capacity: 0,
        max_capacity: 1000,
      };

      return {
        venueTypes: typesResult.data?.map(t => t.name) ?? [],
        regions: regionsResult.data ?? [],
        priceBounds: [bounds.min_price, bounds.max_price] as [number, number],
        capacityBounds: [bounds.min_capacity, bounds.max_capacity] as [number, number],
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - metadata doesn't change often
  });
}
