import { useCallback, useRef, useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Venue } from '../../types/venue';
import { COUNTRY_COLORS, getCountryForRegion } from '../../types/venue';
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

// Create SVG marker icon with custom color
function createMarkerIcon(color: string): google.maps.Icon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path fill="${color}" stroke="white" stroke-width="2" d="M16 1C8.268 1 2 7.268 2 15c0 10.5 14 23 14 23s14-12.5 14-23c0-7.732-6.268-14-14-14z"/>
      <circle fill="white" cx="16" cy="14" r="5"/>
    </svg>
  `;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(32, 40),
    anchor: new google.maps.Point(16, 40),
  };
}

// Create highlighted marker icon (larger, with glow effect)
function createHighlightMarkerIcon(color: string): google.maps.Icon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path filter="url(#glow)" fill="${color}" stroke="white" stroke-width="3" d="M24 2C12.402 2 3 11.402 3 23c0 15.75 21 34.5 21 34.5s21-18.75 21-34.5c0-11.598-9.402-21-21-21z"/>
      <circle fill="white" cx="24" cy="21" r="7"/>
    </svg>
  `;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(48, 60),
    anchor: new google.maps.Point(24, 60),
  };
}

export function VenueMap({ venues, onVenueSelect, onBoundsChange, initialPosition }: VenueMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const highlightMarkerRef = useRef<google.maps.Marker | null>(null);
  const prevVenueIdsRef = useRef<string>('');
  const isRestoringPositionRef = useRef(!!initialPosition); // Track if we're restoring a saved position
  const { hoveredVenueId, selectedVenue } = useVenueStore();
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isMapReady, setIsMapReady] = useState(false); // Track when map is loaded
  const hasInitializedMarkersRef = useRef(false); // Track if initial markers/fitBounds done

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

  // Report bounds changes (only after markers have been initialized)
  const reportBounds = useCallback(() => {
    if (!mapRef.current || !onBoundsChange || !hasInitializedMarkersRef.current) return;
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
  }, [onBoundsChange]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapReady(true); // Signal that map is ready for markers

    // Listen for bounds changes
    map.addListener('idle', reportBounds);
  }, [reportBounds]);

  const onUnmount = useCallback(() => {
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
    const venuesWithLocation = venues.filter(v => v.location?.lat != null && v.location?.lng != null);

    // Create new markers
    const markers = venuesWithLocation.map((venue) => {
      const country = getCountryForRegion(venue.region);
      const color = COUNTRY_COLORS[country];

      const marker = new google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        icon: createMarkerIcon(color),
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
              <circle fill="#c27555" stroke="white" stroke-width="3" cx="${size/2}" cy="${size/2}" r="${size/2-2}"/>
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

    // Only fit bounds when the set of venue IDs actually changes
    // This prevents zoom reset when toggling favorites or other state changes
    const currentVenueIds = venues.map(v => v.id).sort().join(',');
    if (currentVenueIds !== prevVenueIdsRef.current) {
      prevVenueIdsRef.current = currentVenueIds;

      // Skip fitBounds if we're restoring a saved position (e.g., returning from list view)
      if (isRestoringPositionRef.current) {
        isRestoringPositionRef.current = false;
        // Mark as initialized and report current bounds
        hasInitializedMarkersRef.current = true;
        // Small delay to ensure map is settled
        setTimeout(() => reportBounds(), 100);
        return;
      }

      if (venuesWithLocation.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        venuesWithLocation.forEach((venue) => {
          bounds.extend({ lat: venue.location.lat, lng: venue.location.lng });
        });
        mapRef.current.fitBounds(bounds, 50);
      }
      // Mark as initialized after a delay to let fitBounds complete
      setTimeout(() => {
        hasInitializedMarkersRef.current = true;
      }, 500);
    }
  }, [venues, onVenueSelect, isMapReady]);

  // Highlight hovered marker
  useEffect(() => {
    if (!hoveredVenueId) return;

    markersRef.current.forEach((marker) => {
      // Use venueId stored on marker instead of array index
      if ((marker as any).venueId === hoveredVenueId) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 700);
      }
    });
  }, [hoveredVenueId]);

  // Highlight selected venue with a temporary marker (visible even when clustered)
  useEffect(() => {
    // Clean up previous highlight marker
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.setMap(null);
      highlightMarkerRef.current = null;
    }

    if (!selectedVenue?.location || !mapRef.current) return;

    const country = getCountryForRegion(selectedVenue.region);
    const color = COUNTRY_COLORS[country];

    // Create a highlighted marker directly on the map (bypasses clustering)
    const highlightMarker = new google.maps.Marker({
      position: { lat: selectedVenue.location.lat, lng: selectedVenue.location.lng },
      map: mapRef.current,
      icon: createHighlightMarkerIcon(color),
      title: selectedVenue.name,
      animation: google.maps.Animation.BOUNCE,
      zIndex: 9999, // Ensure it's on top
    });

    highlightMarkerRef.current = highlightMarker;

    // Stop bouncing after a bit, then remove after longer delay
    setTimeout(() => {
      if (highlightMarkerRef.current) {
        highlightMarkerRef.current.setAnimation(null);
      }
    }, 2100); // 3 bounces

    // Remove highlight marker after 4 seconds
    setTimeout(() => {
      if (highlightMarkerRef.current) {
        highlightMarkerRef.current.setMap(null);
        highlightMarkerRef.current = null;
      }
    }, 4000);
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
