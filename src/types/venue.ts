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
    lat: number;
    lng: number;
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
  selectedCountries: Country[];
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

// Country colors for map markers
export const COUNTRY_COLORS: Record<Country, string> = {
  'USA': '#3B82F6',        // Blue
  'Portugal': '#10B981',   // Green
  'Italy': '#EF4444',      // Red
  'Greece': '#06B6D4',     // Cyan
  'Spain': '#F59E0B',      // Amber
  'Switzerland': '#8B5CF6', // Purple
  'France': '#EC4899',     // Pink
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
