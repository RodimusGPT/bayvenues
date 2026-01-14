import { useCallback, useRef, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Venue } from '../../types/venue';
import { REGION_COLORS } from '../../types/venue';
import { useVenueStore } from '../../stores/venueStore';

interface VenueMapProps {
  venues: Venue[];
  onVenueSelect: (venue: Venue) => void;
}

const BAY_AREA_CENTER = { lat: 37.5, lng: -122.2 };
const DEFAULT_ZOOM = 9;

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

export function VenueMap({ venues, onVenueSelect }: VenueMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const { hoveredVenueId } = useVenueStore();

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

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

  // Update markers when venues change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];

    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    // Create new markers
    const markers = venues.map((venue) => {
      const color = REGION_COLORS[venue.region];

      const marker = new google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        icon: createMarkerIcon(color),
        title: venue.name,
        optimized: true,
      });

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

    // Fit bounds to show all markers
    if (venues.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      venues.forEach((venue) => {
        bounds.extend({ lat: venue.location.lat, lng: venue.location.lng });
      });
      mapRef.current.fitBounds(bounds, 50);
    }
  }, [venues, onVenueSelect]);

  // Highlight hovered marker
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const venue = venues[index];
      if (venue?.id === hoveredVenueId) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 700);
      }
    });
  }, [hoveredVenueId, venues]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={BAY_AREA_CENTER}
      zoom={DEFAULT_ZOOM}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    />
  );
}
