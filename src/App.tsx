import { useMemo, useState, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useFilterStore } from './stores/filterStore';
import { useVenueStore } from './stores/venueStore';
import { useSupabaseVenues, useVenueMetadata } from './hooks/useSupabaseVenues';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useUserPreferences } from './hooks/useUserPreferences';
import { Header } from './components/layout/Header';
import { FilterPanel } from './components/search/FilterPanel';
import { FavoritesPanel } from './components/layout/FavoritesPanel';
import { VenueMap, type MapBounds, type MapPosition } from './components/map/VenueMap';
import { VenueListView } from './components/venue/VenueListView';
import { VenuePanel } from './components/venue/VenuePanel';
import { AuthModal } from './components/auth/AuthModal';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const LIBRARIES: ('places' | 'marker')[] = ['places', 'marker'];

// Zoom threshold for showing list view button on mobile
const MOBILE_LIST_ZOOM_THRESHOLD = 8;

function App() {
  const [showFilters, setShowFilters] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);

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

  // Fetch venues from Supabase with server-side filtering
  const { data: filteredVenues = [], isLoading: isLoadingVenues } = useSupabaseVenues({
    filters: filters.debouncedFilters,
  });

  // Fetch metadata (venue types, regions, price/capacity bounds)
  const { data: metadata } = useVenueMetadata();
  const venueTypes = metadata?.venueTypes ?? [];

  // Handle map bounds changes
  const handleBoundsChange = useCallback((bounds: MapBounds, zoom: number) => {
    setMapBounds(bounds);
    setMapZoom(zoom);
    // Calculate center from bounds
    const center = {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2,
    };
    setMapPosition({ center, zoom });
  }, []);

  // Filter venues visible in current map bounds
  const venuesInBounds = useMemo(() => {
    if (!mapBounds) return filteredVenues;

    return filteredVenues.filter((venue) => {
      const { lat, lng } = venue.location;
      if (lat == null || lng == null) return false;
      return (
        lat >= mapBounds.south &&
        lat <= mapBounds.north &&
        lng >= mapBounds.west &&
        lng <= mapBounds.east
      );
    });
  }, [filteredVenues, mapBounds]);

  // Show list button on mobile when zoomed in enough
  const showMobileListButton = mapZoom >= MOBILE_LIST_ZOOM_THRESHOLD && venuesInBounds.length > 0;

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
        filteredCount={filteredVenues.length}
        isLoading={isLoadingVenues}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Filter Panel - Left Side (Desktop) */}
        {showFilters && (
          <aside className="w-72 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0 hidden lg:block">
            <FilterPanel venueTypes={venueTypes} onShowFavoritesPanel={() => setShowFavorites(true)} />
          </aside>
        )}

        {/* Map - Center (always visible on desktop, toggle on mobile) */}
        <main className="flex-1 relative">
          {/* Mobile: show map or list based on viewMode */}
          <div className={`lg:block ${viewMode === 'map' ? 'block' : 'hidden'} h-full`}>
            {isLoaded ? (
              <VenueMap
                venues={filteredVenues}
                onVenueSelect={setSelectedVenue}
                onBoundsChange={handleBoundsChange}
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

          {/* View list button - appears when zoomed in */}
          {showMobileListButton && (
            <button
              onClick={() => setViewMode('list')}
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
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white overflow-y-auto animate-slide-in-left"
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
