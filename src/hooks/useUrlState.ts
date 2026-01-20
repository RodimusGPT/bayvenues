import { useEffect, useCallback, useRef } from 'react';
import type { FilterState } from '../types/venue';

export interface UrlState {
  venueId?: string;
  favoriteIds?: string[];
  filters?: Partial<FilterState>;
  mapPosition?: {
    lat: number;
    lng: number;
    zoom: number;
  };
}

/**
 * Parse URL query parameters into app state
 */
export function parseUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search);
  const state: UrlState = {};

  // Parse venue ID
  const venueId = params.get('venue');
  if (venueId) {
    state.venueId = venueId;
  }

  // Parse shared favorites
  const favorites = params.get('favorites');
  if (favorites) {
    state.favoriteIds = favorites.split(',').filter(Boolean);
  }

  // Parse filters (base64 encoded JSON)
  const filtersParam = params.get('filters');
  if (filtersParam) {
    try {
      const decoded = atob(filtersParam);
      state.filters = JSON.parse(decoded);
    } catch {
      console.warn('Failed to parse filters from URL');
    }
  }

  // Parse map position
  const lat = params.get('lat');
  const lng = params.get('lng');
  const zoom = params.get('zoom');
  if (lat && lng && zoom) {
    state.mapPosition = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      zoom: parseInt(zoom, 10),
    };
  }

  return state;
}

/**
 * Build URL with state parameters
 * Uses only the origin to ensure clean share URLs
 */
export function buildShareUrl(state: Partial<UrlState>): string {
  // Use only origin (not pathname) to ensure share URLs are clean
  const url = new URL(window.location.origin);

  if (state.venueId) {
    url.searchParams.set('venue', state.venueId);
  }

  if (state.favoriteIds && state.favoriteIds.length > 0) {
    url.searchParams.set('favorites', state.favoriteIds.join(','));
  }

  if (state.filters && Object.keys(state.filters).length > 0) {
    // Only include non-default filter values
    const filtersToEncode = { ...state.filters };
    const encoded = btoa(JSON.stringify(filtersToEncode));
    url.searchParams.set('filters', encoded);
  }

  if (state.mapPosition) {
    url.searchParams.set('lat', state.mapPosition.lat.toFixed(6));
    url.searchParams.set('lng', state.mapPosition.lng.toFixed(6));
    url.searchParams.set('zoom', state.mapPosition.zoom.toString());
  }

  return url.toString();
}

/**
 * Update URL without page reload
 */
export function updateUrl(state: Partial<UrlState>, replace = true): void {
  const url = buildShareUrl(state);
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
}

/**
 * Clear all URL parameters
 */
export function clearUrlState(): void {
  window.history.replaceState({}, '', window.location.pathname);
}

interface UseUrlStateOptions {
  onVenueFromUrl?: (venueId: string) => void;
  onFavoritesFromUrl?: (favoriteIds: string[]) => void;
  onFiltersFromUrl?: (filters: Partial<FilterState>) => void;
  onMapPositionFromUrl?: (position: { lat: number; lng: number; zoom: number }) => void;
}

/**
 * Hook to sync app state with URL parameters
 * Parses URL on mount and provides callbacks for state changes
 */
export function useUrlState(options: UseUrlStateOptions = {}) {
  const hasProcessedInitialUrl = useRef(false);

  // Parse URL on mount and call appropriate callbacks
  useEffect(() => {
    if (hasProcessedInitialUrl.current) return;
    hasProcessedInitialUrl.current = true;

    const urlState = parseUrlState();

    if (urlState.venueId && options.onVenueFromUrl) {
      options.onVenueFromUrl(urlState.venueId);
    }

    if (urlState.favoriteIds && urlState.favoriteIds.length > 0 && options.onFavoritesFromUrl) {
      options.onFavoritesFromUrl(urlState.favoriteIds);
    }

    if (urlState.filters && options.onFiltersFromUrl) {
      options.onFiltersFromUrl(urlState.filters);
    }

    if (urlState.mapPosition && options.onMapPositionFromUrl) {
      options.onMapPositionFromUrl(urlState.mapPosition);
    }
  }, [options]);

  // Update URL when venue changes
  const setVenueInUrl = useCallback((venueId: string | null) => {
    if (venueId) {
      updateUrl({ venueId });
    } else {
      clearUrlState();
    }
  }, []);

  return {
    parseUrlState,
    buildShareUrl,
    updateUrl,
    clearUrlState,
    setVenueInUrl,
  };
}
