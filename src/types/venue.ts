import { getFallbackHeaderImage } from '../utils/formatters';

export type Country =
  | 'USA'
  | 'Portugal'
  | 'Italy'
  | 'Greece'
  | 'Spain'
  | 'Switzerland'
  | 'France';

export type Setting = 'Indoor' | 'Outdoor';

export interface Video {
  title: string;
  url: string;
}

export interface HeaderImage {
  url: string;
  source: 'youtube' | 'og_image' | 'fallback' | 'google';
}

export interface GalleryImage {
  url: string;
  thumbnail?: string;
  source: 'google' | 'venue' | 'fallback';
}

export interface Venue {
  id: string;
  name: string;
  region: string;
  subregion: string;
  address: string;
  description: string;
  capacity: {
    min: number;
    max: number;
  };
  price_range: {
    min: number;
    max: number;
    unit: 'venue_fee' | 'per_person';
  } | null;
  venue_type: string[];
  setting: Setting[];
  website: string;
  phone: string;
  photos: {
    instagram: string;
    google: string;
  };
  videos: Video[];
  reviews: {
    summary: string;
    pros: string[];
    cons: string[];
  };
  location: {
    lat: number | null;
    lng: number | null;
  };
  google_maps_url: string;
  headerImage?: HeaderImage;
  headerImages?: GalleryImage[];
  youtubeSearch?: string;
}

export interface VenueData {
  meta: {
    title: string;
    description: string;
    last_updated: string;
    total_venues: number;
    regions: string[];
  };
  venues: Venue[];
}

export interface FilterState {
  searchQuery: string;
  selectedCountries: string[];  // Dynamic - supports any country from DB
  selectedRegions: string[];
  selectedVenueTypes: string[];
  selectedSettings: Setting[];
  priceRange: [number, number];
  capacityRange: [number, number];
}

export const COUNTRIES: Country[] = ['USA', 'Portugal', 'Italy', 'Greece', 'Spain', 'Switzerland', 'France'];
export const SETTINGS: Setting[] = ['Indoor', 'Outdoor'];

// Map regions to countries
export const REGION_TO_COUNTRY: Record<string, Country> = {
  // USA - Bay Area
  'North Bay': 'USA',
  'Peninsula': 'USA',
  'South Bay': 'USA',
  'Monterey': 'USA',
  'Santa Cruz': 'USA',
  'Carmel': 'USA',
  // Portugal
  'Algarve': 'Portugal',
  'Sintra': 'Portugal',
  'Lisbon': 'Portugal',
  'Alentejo': 'Portugal',
  'Douro Valley': 'Portugal',
  'Porto': 'Portugal',
  'Dao': 'Portugal',
  // Italy
  'Campania': 'Italy',
  'Tuscany': 'Italy',
  'Veneto': 'Italy',
  'Sicily': 'Italy',
  'Lombardy': 'Italy',
  'Puglia': 'Italy',
  'Lazio': 'Italy',
  // Greece
  'Santorini': 'Greece',
  'Crete': 'Greece',
  'Mykonos': 'Greece',
  'Rhodes': 'Greece',
  'Corfu': 'Greece',
  'Athens Riviera': 'Greece',
  'Peloponnese': 'Greece',
  // Spain
  'Mallorca': 'Spain',
  'Catalonia': 'Spain',
  'Ibiza': 'Spain',
  'Andalucia': 'Spain',
  'Madrid': 'Spain',
  'Basque Country': 'Spain',
  // Switzerland
  'Lugano/Ticino': 'Switzerland',
  'Lucerne': 'Switzerland',
  'Interlaken': 'Switzerland',
  'St. Moritz/Engadine': 'Switzerland',
  'Lake Geneva': 'Switzerland',
  'Zermatt/Alps': 'Switzerland',
  'Zurich': 'Switzerland',
  // France
  'Provence': 'France',
  'Loire Valley': 'France',
  'French Riviera': 'France',
  'Champagne': 'France',
  'Normandy': 'France',
  'Paris Area': 'France',
  'Bordeaux': 'France',
  'Southwest France': 'France',
  'Beaujolais': 'France',
};

// Single marker color for all venues (warm terracotta - matches cluster style)
export const MARKER_COLOR = '#c27555';

// Country colors for map markers (unified for cleaner look)
export const COUNTRY_COLORS: Record<Country, string> = {
  'USA': MARKER_COLOR,
  'Portugal': MARKER_COLOR,
  'Italy': MARKER_COLOR,
  'Greece': MARKER_COLOR,
  'Spain': MARKER_COLOR,
  'Switzerland': MARKER_COLOR,
  'France': MARKER_COLOR,
};

// Get country for a venue based on its region
export function getCountryForRegion(region: string): Country {
  return REGION_TO_COUNTRY[region] || 'USA';
}

// Get all unique regions for a country
export function getRegionsForCountry(country: Country): string[] {
  return Object.entries(REGION_TO_COUNTRY)
    .filter(([_, c]) => c === country)
    .map(([region]) => region);
}

// API Response types from Supabase
export interface VenueFromAPI {
  id: string;
  name: string;
  region: string;
  subregion: string;
  address: string;
  description: string;
  capacity_min: number | null;
  capacity_max: number | null;
  price_min: number | null;
  price_max: number | null;
  price_unit: string | null;
  website: string | null;
  phone: string | null;
  google_maps_url: string | null;
  lat: number | null;
  lng: number | null;
  photos: { instagram: string; google: string } | null;
  videos: Video[] | null;
  reviews: { summary: string; pros: string[]; cons: string[] } | null;
  header_image: HeaderImage | null;
  header_images: GalleryImage[] | null;
  youtube_search: string | null;
  google_rating: number | null;
  google_reviews_count: number | null;
  breezit_pricing: { source?: string; starting_from?: number } | null;
  breezit_rating: number | null;
  venue_types: string[];
  venue_settings: string[];
  total_count?: number;
}

// Transform API response to existing Venue type for compatibility
export function transformVenueFromAPI(apiVenue: VenueFromAPI): Venue {
  const venueTypes = apiVenue.venue_types ?? [];

  // Determine header image: use existing, or generate fallback based on venue type
  const headerImage = apiVenue.header_image
    ?? (apiVenue.header_images && apiVenue.header_images.length > 0 ? undefined : getFallbackHeaderImage(venueTypes));

  return {
    id: apiVenue.id,
    name: apiVenue.name,
    region: apiVenue.region,
    subregion: apiVenue.subregion,
    address: apiVenue.address,
    description: apiVenue.description,
    capacity: {
      min: apiVenue.capacity_min ?? 0,
      max: apiVenue.capacity_max ?? 0,
    },
    price_range: apiVenue.price_min != null && apiVenue.price_max != null
      ? {
          min: apiVenue.price_min,
          max: apiVenue.price_max,
          unit: (apiVenue.price_unit as 'venue_fee' | 'per_person') ?? 'venue_fee',
        }
      : null,
    venue_type: venueTypes,
    setting: (apiVenue.venue_settings ?? []) as Setting[],
    website: apiVenue.website ?? '',
    phone: apiVenue.phone ?? '',
    photos: apiVenue.photos ?? { instagram: '', google: '' },
    videos: apiVenue.videos ?? [],
    reviews: apiVenue.reviews ?? { summary: '', pros: [], cons: [] },
    location: {
      lat: apiVenue.lat,  // Keep null if missing - don't default to 0 (Null Island)
      lng: apiVenue.lng,
    },
    google_maps_url: apiVenue.google_maps_url ?? '',
    headerImage,
    headerImages: apiVenue.header_images ?? undefined,
    youtubeSearch: apiVenue.youtube_search ?? undefined,
  };
}
