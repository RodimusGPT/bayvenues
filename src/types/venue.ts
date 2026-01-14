export type Region =
  | 'North Bay'
  | 'Peninsula'
  | 'South Bay'
  | 'Monterey'
  | 'Santa Cruz'
  | 'Carmel';

export type VenueType =
  | 'Winery'
  | 'Historic'
  | 'Garden'
  | 'Estate'
  | 'Restaurant'
  | 'Hotel'
  | 'Beach'
  | 'Barn'
  | 'Golf Course'
  | 'Museum'
  | 'Ranch'
  | 'Brewery'
  | 'Mansion'
  | 'Club'
  | 'Waterfront'
  | 'Vineyard'
  | 'Redwood'
  | 'Modern'
  | 'Industrial'
  | 'Castle'
  | 'Amphitheater';

export type Setting = 'Indoor' | 'Outdoor';

export interface Video {
  title: string;
  url: string;
}

export interface HeaderImage {
  url: string;
  source: 'youtube' | 'og_image' | 'fallback';
}

export interface Venue {
  id: string;
  name: string;
  region: Region;
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
}

export interface VenueData {
  meta: {
    title: string;
    description: string;
    last_updated: string;
    total_venues: number;
    regions: Region[];
  };
  venues: Venue[];
}

export interface FilterState {
  searchQuery: string;
  selectedRegions: Region[];
  selectedVenueTypes: string[];
  selectedSettings: Setting[];
  priceRange: [number, number];
  capacityRange: [number, number];
}

export const REGIONS: Region[] = ['North Bay', 'Peninsula', 'South Bay', 'Monterey', 'Santa Cruz', 'Carmel'];
export const SETTINGS: Setting[] = ['Indoor', 'Outdoor'];

export const REGION_COLORS: Record<Region, string> = {
  'North Bay': '#8B5CF6',
  'Peninsula': '#3B82F6',
  'South Bay': '#10B981',
  'Monterey': '#F59E0B',
  'Santa Cruz': '#EF4444',
  'Carmel': '#EC4899',
};
