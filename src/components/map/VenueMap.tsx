import { useCallback, useRef, useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Venue } from '../../types/venue';
import { COUNTRY_FLAGS, getCountryForRegion, CLUSTER_COLOR } from '../../types/venue';
import { useVenueStore } from '../../stores/venueStore';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapPosition {
  center: { lat: number; lng: number };
  zoom: number;
}

interface VenueMapProps {
  venues: Venue[];
  onVenueSelect: (venue: Venue) => void;
  onBoundsChange?: (bounds: MapBounds, zoom: number) => void;
  initialPosition?: MapPosition;
}

// Default to world view
const WORLD_CENTER = { lat: 40, lng: -20 };
const DEFAULT_ZOOM = 3;

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  gestureHandling: 'greedy',
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Cache for marker icons by flag to avoid regenerating SVGs
const markerIconCache = new Map<string, google.maps.Icon>();
const highlightIconCache = new Map<string, google.maps.Icon>();

// Create SVG marker icon with flag emoji inside teardrop (cached)
function createMarkerIcon(flag: string): google.maps.Icon {
  const cached = markerIconCache.get(flag);
  if (cached) return cached;

  // Teardrop pin with flag emoji inside
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path filter="url(#shadow)" fill="white" stroke="#9ca3af" stroke-width="1.5" d="M18 2C9.716 2 3 8.716 3 17c0 12 15 26 15 26s15-14 15-26c0-8.284-6.716-15-15-15z"/>
      <text x="18" y="20" text-anchor="middle" font-size="16" dominant-baseline="central">${flag}</text>
    </svg>
  `;
  const icon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(36, 46),
    anchor: new google.maps.Point(18, 46),
  };
  markerIconCache.set(flag, icon);
  return icon;
}

// Create highlighted marker icon with flag (larger, with pulsing ring effect) (cached)
function createHighlightMarkerIcon(flag: string): google.maps.Icon {
  const cached = highlightIconCache.get(flag);
  if (cached) return cached;

  // Golden highlight color for better visibility
  const highlightColor = '#FFD700'; // Gold
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="95" viewBox="0 0 80 95">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
        </filter>
      </defs>
      <!-- Pulsing rings -->
      <circle cx="40" cy="32" r="20" fill="none" stroke="${highlightColor}" stroke-width="3" opacity="0">
        <animate attributeName="r" from="18" to="38" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="40" cy="32" r="20" fill="none" stroke="${highlightColor}" stroke-width="2" opacity="0">
        <animate attributeName="r" from="18" to="38" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
      </circle>
      <!-- Main marker pin - larger teardrop with flag -->
      <path filter="url(#shadow2)" fill="white" stroke="${highlightColor}" stroke-width="3" d="M40 6C27.85 6 18 15.85 18 28c0 16.5 22 38 22 38s22-21.5 22-38c0-12.15-9.85-22-22-22z"/>
      <text x="40" y="32" text-anchor="middle" font-size="24" dominant-baseline="central">${flag}</text>
    </svg>
  `;
  const icon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(80, 95),
    anchor: new google.maps.Point(40, 95),
  };
  highlightIconCache.set(flag, icon);
  return icon;
}

export function VenueMap({ venues, onVenueSelect, onBoundsChange, initialPosition }: VenueMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const highlightMarkerRef = useRef<google.maps.Marker | null>(null);
  const highlightTimeoutsRef = useRef<NodeJS.Timeout[]>([]); // Track timeouts for cleanup
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track hover animation timeout
  const idleListenerRef = useRef<google.maps.MapsEventListener | null>(null); // Track idle listener
  const prevVenueIdsRef = useRef<string>('');
  const isRestoringPositionRef = useRef(!!initialPosition); // Track if we're restoring a saved position
  const { hoveredVenueId, selectedVenue } = useVenueStore();
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isMapReady, setIsMapReady] = useState(false); // Track when map is loaded
  const [markersReady, setMarkersReady] = useState(false); // Track when markers are created

  // Store initial position in ref so it doesn't change on re-renders
  // This prevents the map from continuously trying to re-center
  const initialCenterRef = useRef(initialPosition?.center || WORLD_CENTER);
  const initialZoomRef = useRef(initialPosition?.zoom || DEFAULT_ZOOM);

  const toggleMapType = useCallback(() => {
    const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newType);
    if (mapRef.current) {
      mapRef.current.setMapTypeId(newType);
    }
  }, [mapType]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    // Wait for tiles to load before signaling ready - this ensures map is fully rendered
    google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
      setIsMapReady(true);
    });

    // Listen for bounds changes (store reference for cleanup)
    idleListenerRef.current = map.addListener('idle', () => {
      if (!mapRef.current || !onBoundsChange) return;
      const bounds = mapRef.current.getBounds();
      const zoom = mapRef.current.getZoom();
      if (bounds && zoom !== undefined) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        onBoundsChange({
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng(),
        }, zoom);
      }
    });
  }, [onBoundsChange]);

  const onUnmount = useCallback(() => {
    // Clean up idle listener
    if (idleListenerRef.current) {
      google.maps.event.removeListener(idleListenerRef.current);
      idleListenerRef.current = null;
    }

    // Clean up all timeouts
    highlightTimeoutsRef.current.forEach(clearTimeout);
    highlightTimeoutsRef.current = [];
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Clean up highlight marker
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.setMap(null);
      highlightMarkerRef.current = null;
    }

    // Clean up markers
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];

    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }

    mapRef.current = null;
  }, []);

  // Update markers when venues change or map becomes ready
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];

    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    // Filter venues with valid locations (use != null to allow lat/lng of 0)
    // Type guard ensures lat/lng are numbers after filtering
    const venuesWithLocation = venues.filter(
      (v): v is Venue & { location: { lat: number; lng: number } } =>
        v.location?.lat != null && v.location?.lng != null
    );

    // Create new markers
    const markers = venuesWithLocation.map((venue) => {
      const country = getCountryForRegion(venue.region);
      const flag = COUNTRY_FLAGS[country] || '📍';

      const marker = new google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        icon: createMarkerIcon(flag),
        title: venue.name,
        optimized: true,
      });

      // Store venue ID for hover matching
      (marker as any).venueId = venue.id;

      marker.addListener('click', () => {
        onVenueSelect(venue);
      });

      return marker;
    });

    markersRef.current = markers;

    // Create clusterer
    clustererRef.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
      renderer: {
        render: ({ count, position }) => {
          const size = count < 10 ? 40 : count < 50 ? 50 : 60;
          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
              <circle fill="${CLUSTER_COLOR}" stroke="white" stroke-width="3" cx="${size/2}" cy="${size/2}" r="${size/2-2}"/>
              <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-weight="bold" font-size="${count < 10 ? 14 : 16}">${count}</text>
            </svg>
          `;

          return new google.maps.Marker({
            position,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size/2, size/2),
            },
          });
        },
      },
    });

    // Signal that markers are ready
    setMarkersReady(true);

    // Only fit bounds when the set of venue IDs actually changes
    // This prevents zoom reset when toggling favorites or other state changes
    const currentVenueIds = venues.map(v => v.id).sort().join(',');
    if (currentVenueIds !== prevVenueIdsRef.current) {
      prevVenueIdsRef.current = currentVenueIds;

      // Skip fitBounds if we're restoring a saved position (e.g., returning from list view)
      if (isRestoringPositionRef.current) {
        isRestoringPositionRef.current = false;
        return;
      }

      if (venuesWithLocation.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        venuesWithLocation.forEach((venue) => {
          bounds.extend({ lat: venue.location.lat, lng: venue.location.lng });
        });
        mapRef.current.fitBounds(bounds, 50);
      }
    }
  }, [venues, onVenueSelect, isMapReady]);

  // Highlight hovered marker
  useEffect(() => {
    // Clear previous hover animation timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Stop any currently bouncing markers
    markersRef.current.forEach((marker) => {
      if (marker.getAnimation()) {
        marker.setAnimation(null);
      }
    });

    if (!hoveredVenueId) return;

    const hoveredMarker = markersRef.current.find(
      (marker) => (marker as any).venueId === hoveredVenueId
    );

    if (hoveredMarker) {
      hoveredMarker.setAnimation(google.maps.Animation.BOUNCE);
      hoverTimeoutRef.current = setTimeout(() => {
        hoveredMarker.setAnimation(null);
      }, 700);
    }
  }, [hoveredVenueId]);

  // Highlight selected venue with a temporary marker (visible even when clustered)
  const hiddenOriginalMarkerRef = useRef<google.maps.Marker | null>(null);
  useEffect(() => {
    // Clear any pending timeouts from previous selection
    highlightTimeoutsRef.current.forEach(clearTimeout);
    highlightTimeoutsRef.current = [];

    // Restore previously hidden original marker
    if (hiddenOriginalMarkerRef.current) {
      hiddenOriginalMarkerRef.current.setVisible(true);
      hiddenOriginalMarkerRef.current = null;
    }

    // Clean up previous highlight marker immediately
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.setMap(null);
      highlightMarkerRef.current = null;
    }

    if (!selectedVenue?.location || selectedVenue.location.lat == null || selectedVenue.location.lng == null || !mapRef.current) return;

    // Hide the original marker so it doesn't show under the highlight
    const originalMarker = markersRef.current.find(
      (marker) => (marker as any).venueId === selectedVenue.id
    );
    if (originalMarker) {
      originalMarker.setVisible(false);
      hiddenOriginalMarkerRef.current = originalMarker;
    }

    const country = getCountryForRegion(selectedVenue.region);
    const flag = COUNTRY_FLAGS[country] || '📍';

    // Create a highlighted marker directly on the map (bypasses clustering)
    // Uses animated SVG with pulsing rings instead of bounce animation
    const highlightMarker = new google.maps.Marker({
      position: { lat: selectedVenue.location.lat, lng: selectedVenue.location.lng },
      map: mapRef.current,
      icon: createHighlightMarkerIcon(flag),
      title: selectedVenue.name,
      zIndex: 9999, // Ensure it's on top
    });

    highlightMarkerRef.current = highlightMarker;

    // Remove highlight marker after 5 seconds and restore original
    const removeTimeout = setTimeout(() => {
      if (highlightMarkerRef.current === highlightMarker) {
        highlightMarker.setMap(null);
        highlightMarkerRef.current = null;
        // Restore original marker visibility
        if (hiddenOriginalMarkerRef.current === originalMarker && originalMarker) {
          originalMarker.setVisible(true);
          hiddenOriginalMarkerRef.current = null;
        }
      }
    }, 5000);

    highlightTimeoutsRef.current = [removeTimeout];
  }, [selectedVenue]);

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialCenterRef.current}
        zoom={initialZoomRef.current}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      />
      {/* Loading indicator while markers are being created */}
      {!markersReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-600 border-t-transparent"></div>
            <span className="text-sm text-gray-600 font-medium">Loading venues...</span>
          </div>
        </div>
      )}
      {/* Map Type Toggle Button */}
      <button
        onClick={toggleMapType}
        className="absolute top-3 left-3 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors z-10 border border-gray-200"
        title={mapType === 'roadmap' ? 'Switch to satellite view' : 'Switch to map view'}
      >
        {mapType === 'roadmap' ? (
          <>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Satellite</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Map</span>
          </>
        )}
      </button>
    </div>
  );
}
