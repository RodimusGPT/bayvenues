import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useFilterStore } from './stores/filterStore';
import { useVenueStore } from './stores/venueStore';
import { useSupabaseVenues, useVenueMetadata, useVenue } from './hooks/useSupabaseVenues';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useUserPreferences } from './hooks/useUserPreferences';
import { parseUrlState, clearUrlState, updateUrl } from './hooks/useUrlState';
import { Header } from './components/layout/Header';
import { FilterPanel } from './components/search/FilterPanel';
import { FavoritesPanel } from './components/layout/FavoritesPanel';
import { VenueMap, type MapBounds, type MapPosition } from './components/map/VenueMap';
import { VenueListView } from './components/venue/VenueListView';
import { VenuePanel } from './components/venue/VenuePanel';
import { AuthModal } from './components/auth/AuthModal';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const LIBRARIES: ('places' | 'marker')[] = ['places', 'marker'];

function App() {
  const [showFilters, setShowFilters] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const [searchAreaBounds, setSearchAreaBounds] = useState<MapBounds | null>(null); // Bounds set by "Search this area"
  const searchAreaBoundsRef = useRef<MapBounds | null>(null); // Ref for immediate access (avoids race with Zustand)
  const [listScrollPosition, setListScrollPosition] = useState(0); // Preserve list scroll position

  // URL state handling for deep-linking
  const [pendingVenueId, setPendingVenueId] = useState<string | null>(null);
  const hasProcessedUrl = useRef(false);

  // Auth state from context
  const { authModalOpen, closeAuthModal } = useAuth();

  // Sync user preferences between localStorage and database
  useUserPreferences();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Get filter state (using debounced filters for API calls)
  const filters = useFilterStore();
  const { selectedVenue, setSelectedVenue } = useVenueStore();

  // Fetch metadata (venue types, regions, price/capacity bounds)
  const { data: metadata } = useVenueMetadata();
  const venueTypes = metadata?.venueTypes ?? [];
  const priceBounds = metadata?.priceBounds ?? [0, 500000] as [number, number];
  const capacityBounds = metadata?.capacityBounds ?? [0, 1000] as [number, number];

  // Check if there are any active filters that might be hiding venues
  // IMPORTANT: Use debouncedFilters to stay in sync with filteredVenues (which uses debouncedFilters)
  // This prevents the intermediate state where hasActiveFilters=true but filteredVenues hasn't updated
  const debouncedFilters = filters.debouncedFilters;
  const hasActiveFilters = Boolean(
    debouncedFilters.searchQuery ||
    debouncedFilters.selectedCountries.length > 0 ||
    debouncedFilters.selectedRegions.length > 0 ||
    debouncedFilters.selectedVenueTypes.length > 0 ||
    debouncedFilters.selectedSettings.length > 0
  );

  // Parse URL on mount to extract venue ID for deep-linking
  useEffect(() => {
    if (hasProcessedUrl.current) return;
    hasProcessedUrl.current = true;

    const urlState = parseUrlState();
    if (urlState.venueId) {
      setPendingVenueId(urlState.venueId);
    }
  }, []);

  // Fetch venue by ID when there's a pending venue from URL
  const { data: venueFromUrl } = useVenue(pendingVenueId);

  // Set selected venue when it loads from URL
  useEffect(() => {
    if (venueFromUrl && pendingVenueId) {
      setSelectedVenue(venueFromUrl);
      setPendingVenueId(null); // Clear pending state
    }
  }, [venueFromUrl, pendingVenueId, setSelectedVenue]);

  // Update URL when venue selection changes
  useEffect(() => {
    if (selectedVenue) {
      updateUrl({ venueId: selectedVenue.id });
    } else if (hasProcessedUrl.current) {
      // Only clear URL if we've already processed the initial URL
      clearUrlState();
    }
  }, [selectedVenue]);

  // Fetch venues from Supabase with server-side filtering
  const { data: filteredVenues = [], isLoading: isLoadingVenues } = useSupabaseVenues({
    filters: filters.debouncedFilters,
  });

  // Handle map bounds changes
  const handleBoundsChange = useCallback((bounds: MapBounds, zoom: number) => {
    setMapBounds(bounds);
    // Calculate center from bounds and store position for map restoration
    const center = {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2,
    };
    setMapPosition({ center, zoom });
  }, []);


  // Called when user clicks "Search this area" button on map
  const handleSearchArea = useCallback((bounds: MapBounds) => {
    // Set ref for immediate access in skipFitBounds calculation
    searchAreaBoundsRef.current = bounds;

    // Reset filters so hasActiveFilters becomes false
    filters.resetFilters();

    // Set bounds state to trigger memo recomputation
    setSearchAreaBounds(bounds);
  }, [filters]);

  // Venues to display on map - filtered by searchAreaBounds ONLY if no filters are active
  // When filters are active, we ignore bounds and show filtered results (allows map to pan to new region)
  // When no filters are active and bounds are set, show only venues in the bounds area
  // NOTE: We use state (searchAreaBounds) as the source of truth for the memo
  // The ref is only for synchronous access in skipFitBounds calculation
  const venuesToDisplay = useMemo(() => {
    // If user has active filters, ignore bounds - let them see filtered results anywhere
    if (hasActiveFilters) {
      return filteredVenues;
    }

    // No filters active - filter by search area bounds if set
    if (!searchAreaBounds) {
      return filteredVenues;
    }

    // Filter venues to those within the search area bounds
    return filteredVenues.filter((venue) => {
      const { lat, lng } = venue.location;
      if (lat == null || lng == null) return false;
      return (
        lat >= searchAreaBounds.south &&
        lat <= searchAreaBounds.north &&
        lng >= searchAreaBounds.west &&
        lng <= searchAreaBounds.east
      );
    });
  }, [filteredVenues, searchAreaBounds, hasActiveFilters]);

  // Filter venues visible in current map bounds
  // Always filter by bounds when available so mobile list matches the map
  const venuesInBounds = useMemo(() => {
    // No bounds yet, show all filtered venues
    if (!mapBounds) return venuesToDisplay;

    const inBounds = venuesToDisplay.filter((venue) => {
      const { lat, lng } = venue.location;
      if (lat == null || lng == null) return false;
      return (
        lat >= mapBounds.south &&
        lat <= mapBounds.north &&
        lng >= mapBounds.west &&
        lng <= mapBounds.east
      );
    });

    return inBounds;
  }, [venuesToDisplay, mapBounds]);

  // Show list button on mobile when there are venues to display
  const showMobileListButton = venuesInBounds.length > 0;

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Maps</h1>
          <p className="text-gray-600">Please check your Google Maps API key.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Filter Panel - Left Side (Desktop) */}
        {showFilters && (
          <aside className="w-72 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0 hidden lg:block">
            <FilterPanel venueTypes={venueTypes} priceBounds={priceBounds} capacityBounds={capacityBounds} onShowFavoritesPanel={() => setShowFavorites(true)} />
          </aside>
        )}

        {/* Map - Center (always visible on desktop, toggle on mobile) */}
        <main className="flex-1 relative">
          {/* Mobile: show map or list based on viewMode */}
          <div className={`lg:block ${viewMode === 'map' ? 'block' : 'hidden'} h-full`}>
            {isLoaded ? (
              <VenueMap
                  venues={venuesToDisplay}
                  hasActiveFilters={hasActiveFilters || searchAreaBoundsRef.current !== null || searchAreaBounds !== null}
                  skipFitBounds={!hasActiveFilters && (searchAreaBoundsRef.current !== null || searchAreaBounds !== null)}
                  onVenueSelect={setSelectedVenue}
                  onBoundsChange={handleBoundsChange}
                  onSearchArea={handleSearchArea}
                  initialPosition={mapPosition || undefined}
                />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}
          </div>

          {/* Mobile only: List view when viewMode is 'list' */}
          {viewMode === 'list' && (
            <div className="lg:hidden h-full">
              <VenueListView
                venues={venuesInBounds}
                onVenueSelect={setSelectedVenue}
                onBackToMap={() => setViewMode('map')}
                isLoading={isLoadingVenues}
                scrollPosition={listScrollPosition}
                onScrollChange={setListScrollPosition}
              />
            </div>
          )}
        </main>

        {/* Right Panel - Desktop: List / Venue / Favorites */}
        <aside className="hidden lg:flex flex-col w-[480px] border-l border-gray-200 bg-white flex-shrink-0">
          {selectedVenue ? (
            <VenuePanel
              venue={selectedVenue}
              venues={venuesInBounds}
              onClose={() => setSelectedVenue(null)}
              onNavigate={setSelectedVenue}
            />
          ) : showFavorites ? (
            <FavoritesPanel
              onVenueSelect={(venue) => {
                setSelectedVenue(venue);
                setShowFavorites(false);
              }}
              onClose={() => setShowFavorites(false)}
            />
          ) : (
            <VenueListView
              venues={venuesInBounds}
              onVenueSelect={setSelectedVenue}
              isLoading={isLoadingVenues}
              scrollPosition={listScrollPosition}
              onScrollChange={setListScrollPosition}
            />
          )}
        </aside>

        {/* Mobile: Venue Panel (full overlay) */}
        {selectedVenue && (
          <div className="lg:hidden">
            <VenuePanel
              venue={selectedVenue}
              venues={venuesInBounds}
              onClose={() => setSelectedVenue(null)}
              onNavigate={setSelectedVenue}
            />
          </div>
        )}

        {/* Mobile: Favorites Panel */}
        {showFavorites && !selectedVenue && (
          <div className="lg:hidden">
            <FavoritesPanel
              onVenueSelect={(venue) => {
                setSelectedVenue(venue);
                setShowFavorites(false);
              }}
              onClose={() => setShowFavorites(false)}
            />
          </div>
        )}
      </div>

      {/* Mobile Buttons - hidden when venue panel is open */}
      {!selectedVenue && viewMode === 'map' && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-between items-end" style={{ paddingBottom: 'var(--sab, 0px)' }}>
          {/* Filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 touch-target"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>

          {/* View list button - appears when venues are on map */}
          {showMobileListButton && (
            <button
              onClick={() => {
                setViewMode('list');
                setShowFilters(false); // Close filter panel when switching to list view
              }}
              className="bg-white text-gray-900 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-gray-200 touch-target animate-fade-in"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              View {venuesInBounds.length} venue{venuesInBounds.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setShowFilters(false)}>
          <aside
            className="absolute left-0 top-[60px] bottom-0 w-80 max-w-[85vw] bg-white overflow-y-auto animate-slide-in-left rounded-tr-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterPanel
              venueTypes={venueTypes}
              priceBounds={priceBounds}
              capacityBounds={capacityBounds}
              onShowFavoritesPanel={() => {
                setShowFavorites(true);
                setShowFilters(false); // Close mobile filter drawer
              }}
            />
          </aside>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

// Wrap App with providers
function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppWithProviders;
