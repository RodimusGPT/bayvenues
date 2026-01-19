import { getFallbackHeaderImage } from '../utils/formatters';

export type Country =
  | 'USA'
  | 'Portugal'
  | 'Italy'
  | 'Greece'
  | 'Spain'
  | 'Switzerland'
  | 'France'
  | 'Indonesia'
  | 'Thailand'
  | 'Mexico'
  | 'Japan'
  | 'Taiwan'
  | 'Caribbean Islands'
  | 'Australia'
  | 'South Korea'
  | 'Singapore'
  | 'China'
  | 'Canada'
  | 'Ireland'
  | 'United Kingdom'
  | 'Luxembourg'
  | 'Germany';

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

export const COUNTRIES: Country[] = ['USA', 'Portugal', 'Italy', 'Greece', 'Spain', 'Switzerland', 'France', 'Indonesia', 'Thailand', 'Mexico', 'Japan', 'Taiwan', 'Caribbean Islands', 'Australia', 'South Korea', 'Singapore', 'China', 'Canada', 'Ireland', 'United Kingdom', 'Luxembourg', 'Germany'];
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
  // Indonesia
  'Bali': 'Indonesia',
  'Komodo': 'Indonesia',
  'Lombok': 'Indonesia',
  // Thailand
  'Chiang Mai': 'Thailand',
  'Khao Lak': 'Thailand',
  'Koh Kood': 'Thailand',
  'Koh Samui': 'Thailand',
  'Krabi': 'Thailand',
  'Phuket': 'Thailand',
  // Mexico
  'Cancun, Mexico': 'Mexico',
  'Los Cabos, Mexico': 'Mexico',
  'Mexico City, Mexico': 'Mexico',
  'Riviera Maya, Mexico': 'Mexico',
  'Riviera Nayarit, Mexico': 'Mexico',
  'San Miguel de Allende, Mexico': 'Mexico',
  // Japan
  'Japan': 'Japan',
  'Tokyo': 'Japan',
  'Kyoto': 'Japan',
  'Okinawa': 'Japan',
  // Taiwan
  'Taipei': 'Taiwan',
  'Sun Moon Lake': 'Taiwan',
  'Kenting': 'Taiwan',
  'Beitou': 'Taiwan',
  // USA - Hawaii
  'Oahu': 'USA',
  'Maui': 'USA',
  'Kauai': 'USA',
  'Big Island': 'USA',
  // USA - Additional regions
  'Atlanta': 'USA',
  'Bluffton': 'USA',
  'Boston': 'USA',
  'Cape Cod': 'USA',
  'Central Coast': 'USA',
  'Charleston': 'USA',
  'Coastal Georgia': 'USA',
  'Connecticut': 'USA',
  'East Bay': 'USA',
  'Florida Keys': 'USA',
  'Greenville': 'USA',
  'Hilton Head': 'USA',
  'Hudson Valley': 'USA',
  'Lake Tahoe': 'USA',
  'Maine Coast': 'USA',
  'Marin': 'USA',
  'Marthas Vineyard': 'USA',
  'Mendocino': 'USA',
  'Miami': 'USA',
  'Nantucket': 'USA',
  'Napa Valley': 'USA',
  'Naples': 'USA',
  'Newport': 'USA',
  'North Georgia': 'USA',
  'Northern Virginia': 'USA',
  'Orlando': 'USA',
  'Palm Beach': 'USA',
  'Philadelphia': 'USA',
  'Richmond': 'USA',
  'Sacramento': 'USA',
  'San Francisco': 'USA',
  'Savannah': 'USA',
  'Shenandoah Valley': 'USA',
  'Sonoma': 'USA',
  'Tampa Bay': 'USA',
  'The Hamptons': 'USA',
  'Virginia Wine Country': 'USA',
  'Washington DC': 'USA',
  // Caribbean Islands (all islands grouped under one country)
  'Montego Bay, Jamaica': 'Caribbean Islands',
  'Negril, Jamaica': 'Caribbean Islands',
  'Nassau, Bahamas': 'Caribbean Islands',
  'Eleuthera, Bahamas': 'Caribbean Islands',
  'Exuma, Bahamas': 'Caribbean Islands',
  'Soufriere, St Lucia': 'Caribbean Islands',
  'West Coast, Barbados': 'Caribbean Islands',
  'Providenciales, Turks and Caicos': 'Caribbean Islands',
  'Palm Beach, Aruba': 'Caribbean Islands',
  'Antigua': 'Caribbean Islands',
  'Anguilla': 'Caribbean Islands',
  'San Juan, Puerto Rico': 'Caribbean Islands',
  'Dorado, Puerto Rico': 'Caribbean Islands',
  'Willemstad, Curacao': 'Caribbean Islands',
  'Cap Cana, Dominican Republic': 'Caribbean Islands',
  'La Romana, Dominican Republic': 'Caribbean Islands',
  // Australia
  'Sydney': 'Australia',
  'Yarra Valley': 'Australia',
  'Hunter Valley': 'Australia',
  'Byron Bay': 'Australia',
  'Gold Coast Hinterland': 'Australia',
  'Southern Highlands': 'Australia',
  'South Coast NSW': 'Australia',
  'Mornington Peninsula': 'Australia',
  'Queensland': 'Australia',
  'Toowoomba': 'Australia',
  'Tweed Coast': 'Australia',
  // South Korea
  'Seoul': 'South Korea',
  'Jeju': 'South Korea',
  'Busan': 'South Korea',
  // Singapore
  'Singapore': 'Singapore',
  'Sentosa': 'Singapore',
  // China
  'Beijing': 'China',
  'Shanghai': 'China',
  'Hangzhou': 'China',
  'Sanya': 'China',
  'Guangzhou': 'China',
  'Shenzhen': 'China',
  // Canada
  'Vancouver': 'Canada',
  'Toronto': 'Canada',
  'Banff': 'Canada',
  'Lake Louise': 'Canada',
  'Whistler': 'Canada',
  'Montreal': 'Canada',
  // Ireland
  'Dublin': 'Ireland',
  'Mayo': 'Ireland',
  'Clare': 'Ireland',
  'Limerick': 'Ireland',
  'Monaghan': 'Ireland',
  'Roscommon': 'Ireland',
  'Leitrim': 'Ireland',
  'Meath': 'Ireland',
  'Cork': 'Ireland',
  'Kerry': 'Ireland',
  // United Kingdom
  'London': 'United Kingdom',
  'Cotswolds': 'United Kingdom',
  'Yorkshire': 'United Kingdom',
  'Lake District': 'United Kingdom',
  'Scottish Lowlands': 'United Kingdom',
  'Scottish Highlands': 'United Kingdom',
  'Cornwall': 'United Kingdom',
  'Devon': 'United Kingdom',
  'Berkshire': 'United Kingdom',
  'Buckinghamshire': 'United Kingdom',
  'Oxfordshire': 'United Kingdom',
  'Gloucestershire': 'United Kingdom',
  'Hampshire': 'United Kingdom',
  'Midlands': 'United Kingdom',
  // Luxembourg
  'Luxembourg City': 'Luxembourg',
  'Moselle Valley': 'Luxembourg',
  'Northern Luxembourg': 'Luxembourg',
  'Countryside': 'Luxembourg',
  // Germany
  'Berlin': 'Germany',
  'Bavaria': 'Germany',
  'Hamburg': 'Germany',
  'Hessen': 'Germany',
  'Rheingau': 'Germany',
  'Schleswig-Holstein': 'Germany',
  'North Rhine-Westphalia': 'Germany',
  'Baden-Württemberg': 'Germany',
};

// Primary color for clusters (matches UI primary-600)
export const CLUSTER_COLOR = '#527291';

// Country flag emojis for map markers
export const COUNTRY_FLAGS: Record<Country, string> = {
  'USA': '🇺🇸',
  'Portugal': '🇵🇹',
  'Italy': '🇮🇹',
  'Greece': '🇬🇷',
  'Spain': '🇪🇸',
  'Switzerland': '🇨🇭',
  'France': '🇫🇷',
  'Indonesia': '🇮🇩',
  'Thailand': '🇹🇭',
  'Mexico': '🇲🇽',
  'Japan': '🇯🇵',
  'Taiwan': '🇹🇼',
  'Caribbean Islands': '🏝️',
  'Australia': '🇦🇺',
  'South Korea': '🇰🇷',
  'Singapore': '🇸🇬',
  'China': '🇨🇳',
  'Canada': '🇨🇦',
  'Ireland': '🇮🇪',
  'United Kingdom': '🇬🇧',
  'Luxembourg': '🇱🇺',
  'Germany': '🇩🇪',
};

// Get flag emoji for a country (with fallback)
export function getFlagForCountry(country: Country): string {
  return COUNTRY_FLAGS[country] || '📍';
}

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
