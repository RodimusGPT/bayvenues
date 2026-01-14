import { useMemo, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import venueData from './data/venues.json';
import type { Venue, VenueData } from './types/venue';
import { useFilterStore } from './stores/filterStore';
import { useVenueStore } from './stores/venueStore';
import { filterVenues, getUniqueVenueTypes } from './utils/filterVenues';
import { Header } from './components/layout/Header';
import { FilterPanel } from './components/search/FilterPanel';
import { VenueMap } from './components/map/VenueMap';
import { VenuePanel } from './components/venue/VenuePanel';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const LIBRARIES: ('places' | 'marker')[] = ['places', 'marker'];

function App() {
  const [showFilters, setShowFilters] = useState(true);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const data = venueData as VenueData;
  const venues: Venue[] = data.venues;
  const venueTypes = useMemo(() => getUniqueVenueTypes(venues), [venues]);

  // Get filter state
  const filters = useFilterStore();
  const { selectedVenue, setSelectedVenue } = useVenueStore();

  // Apply filters
  const filteredVenues = useMemo(
    () => filterVenues(venues, filters),
    [venues, filters]
  );

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
        totalVenues={venues.length}
        filteredCount={filteredVenues.length}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Filter Panel - Left Side */}
        {showFilters && (
          <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0 hidden lg:block">
            <FilterPanel venueTypes={venueTypes} />
          </aside>
        )}

        {/* Map - Center */}
        <main className="flex-1 relative">
          {isLoaded ? (
            <VenueMap
              venues={filteredVenues}
              onVenueSelect={setSelectedVenue}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}
        </main>

        {/* Venue Panel - Right Side */}
        {selectedVenue && (
          <VenuePanel
            venue={selectedVenue}
            onClose={() => setSelectedVenue(null)}
          />
        )}
      </div>

      {/* Mobile Filter Toggle - hidden when venue panel is open */}
      {!selectedVenue && (
        <div className="lg:hidden fixed bottom-4 left-4 z-50" style={{ paddingBottom: 'var(--sab, 0px)' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 touch-target"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
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
            <FilterPanel venueTypes={venueTypes} />
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
