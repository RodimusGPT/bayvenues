/**
 * Migration script to load venue data from JSON into Supabase
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/migrate-to-supabase.ts
 *
 * Or add to .env.local:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key
 *
 * Get the service role key from:
 *   https://supabase.com/dashboard/project/tpgruvfobcgzictihwrp/settings/api
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// ES modules don't have __dirname, so derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('You can find this in the Supabase dashboard under Settings > API');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Region to country mapping
const REGION_TO_COUNTRY: Record<string, string> = {
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

interface VenueJson {
  id: string;
  name: string;
  region: string;
  subregion: string;
  address: string;
  description: string;
  capacity: { min: number; max: number };
  price_range: { min: number; max: number; unit: string } | null;
  venue_type: string[];
  setting: string[];
  website: string;
  phone: string;
  photos: { instagram: string; google: string };
  videos: { title: string; url: string }[];
  reviews: { summary: string; pros: string[]; cons: string[] };
  location: { lat: number; lng: number };
  google_maps_url: string;
  headerImage?: { url: string; source: string };
  headerImages?: { url: string; thumbnail?: string; source: string }[];
  youtubeSearch?: string;
  // Google enrichment fields
  google_place_id?: string;
  google_rating?: number;
  google_reviews_count?: number;
  google_formatted_address?: string;
  google_phone?: string;
  google_website?: string;
  google_business_status?: string;
  google_types?: string[];
  google_opening_hours?: object;
  google_photos?: object[];
  google_reviews?: object[];
  google_wheelchair_accessible?: boolean;
  // Breezit fields
  breezit_pricing?: object;
  breezit_rating?: number;
  breezit_reviews?: number;
  source?: string;
}

interface VenueData {
  meta: {
    title: string;
    description: string;
    last_updated: string;
    total_venues: number;
    regions: string[];
  };
  venues: VenueJson[];
}

async function migrate() {
  console.log('Starting migration to Supabase...\n');

  // Read venues.json
  const venuesPath = path.join(__dirname, '..', 'src', 'data', 'venues.json');
  console.log(`Reading venues from: ${venuesPath}`);

  const venueData: VenueData = JSON.parse(fs.readFileSync(venuesPath, 'utf-8'));
  console.log(`Found ${venueData.venues.length} venues\n`);

  // 1. Insert settings (Indoor/Outdoor)
  console.log('Step 1: Inserting settings...');
  const { error: settingsError } = await supabase
    .from('settings')
    .upsert([{ name: 'Indoor' }, { name: 'Outdoor' }], { onConflict: 'name' });

  if (settingsError) {
    console.error('Error inserting settings:', settingsError);
    throw settingsError;
  }
  console.log('  Settings inserted\n');

  // 2. Collect and insert unique venue types
  console.log('Step 2: Collecting and inserting venue types...');
  const venueTypes = new Set<string>();
  venueData.venues.forEach(v => v.venue_type.forEach(t => venueTypes.add(t)));

  const venueTypeRecords = Array.from(venueTypes).map(name => ({ name }));
  console.log(`  Found ${venueTypeRecords.length} unique venue types`);

  const { error: typesError } = await supabase
    .from('venue_types')
    .upsert(venueTypeRecords, { onConflict: 'name' });

  if (typesError) {
    console.error('Error inserting venue types:', typesError);
    throw typesError;
  }
  console.log('  Venue types inserted\n');

  // 3. Insert regions with country mapping
  console.log('Step 3: Inserting regions...');
  const regionsFromVenues = new Set<string>();
  venueData.venues.forEach(v => regionsFromVenues.add(v.region));

  const regionRecords = Array.from(regionsFromVenues).map(name => ({
    name,
    country: REGION_TO_COUNTRY[name] || 'USA',
  }));
  console.log(`  Found ${regionRecords.length} unique regions`);

  const { error: regionsError } = await supabase
    .from('regions')
    .upsert(regionRecords, { onConflict: 'name' });

  if (regionsError) {
    console.error('Error inserting regions:', regionsError);
    throw regionsError;
  }
  console.log('  Regions inserted\n');

  // 4. Get lookup maps for junction tables
  console.log('Step 4: Getting lookup maps...');
  const { data: typeRows } = await supabase.from('venue_types').select('id, name');
  const typeMap = new Map(typeRows?.map(r => [r.name, r.id]) || []);
  console.log(`  Type map: ${typeMap.size} entries`);

  const { data: settingRows } = await supabase.from('settings').select('id, name');
  const settingMap = new Map(settingRows?.map(r => [r.name, r.id]) || []);
  console.log(`  Setting map: ${settingMap.size} entries\n`);

  // 5. Insert venues in batches
  console.log('Step 5: Inserting venues...');
  const BATCH_SIZE = 50;
  const venues = venueData.venues;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < venues.length; i += BATCH_SIZE) {
    const batch = venues.slice(i, i + BATCH_SIZE);

    const venueRecords = batch.map(v => ({
      id: v.id,
      name: v.name,
      region: v.region,
      subregion: v.subregion,
      address: v.address,
      description: v.description,
      capacity_min: v.capacity?.min || null,
      capacity_max: v.capacity?.max || null,
      price_min: v.price_range?.min || null,
      price_max: v.price_range?.max || null,
      price_unit: v.price_range?.unit || null,
      website: v.website || null,
      phone: v.phone || null,
      google_maps_url: v.google_maps_url || null,
      // PostGIS point format: POINT(lng lat)
      location: v.location?.lat != null && v.location?.lng != null
        ? `POINT(${v.location.lng} ${v.location.lat})`
        : null,
      photos: v.photos || null,
      videos: v.videos || null,
      reviews: v.reviews || null,
      header_image: v.headerImage || null,
      header_images: v.headerImages || null,
      youtube_search: v.youtubeSearch || null,
      google_place_id: v.google_place_id || null,
      google_rating: v.google_rating || null,
      google_reviews_count: v.google_reviews_count || null,
      google_formatted_address: v.google_formatted_address || null,
      google_phone: v.google_phone || null,
      google_website: v.google_website || null,
      google_business_status: v.google_business_status || null,
      google_types: v.google_types || null,
      google_opening_hours: v.google_opening_hours || null,
      google_photos: v.google_photos || null,
      google_reviews: v.google_reviews || null,
      google_wheelchair_accessible: v.google_wheelchair_accessible || null,
      breezit_pricing: v.breezit_pricing || null,
      breezit_rating: v.breezit_rating || null,
      breezit_reviews: v.breezit_reviews || null,
      source: v.source || null,
    }));

    const { error: venueError } = await supabase
      .from('venues')
      .upsert(venueRecords, { onConflict: 'id' });

    if (venueError) {
      console.error(`  Error inserting batch ${i}-${i + batch.length}:`, venueError);
      errorCount += batch.length;
      continue;
    }

    // Insert junction table records for this batch
    for (const v of batch) {
      // Venue types junction
      const typeJunctions = v.venue_type
        .filter(t => typeMap.has(t))
        .map(t => ({ venue_id: v.id, venue_type_id: typeMap.get(t)! }));

      if (typeJunctions.length > 0) {
        const { error: typeJuncError } = await supabase
          .from('venue_venue_types')
          .upsert(typeJunctions, { onConflict: 'venue_id,venue_type_id' });

        if (typeJuncError) {
          console.error(`  Error inserting venue types for ${v.id}:`, typeJuncError);
        }
      }

      // Settings junction
      const settingJunctions = v.setting
        .filter(s => settingMap.has(s))
        .map(s => ({ venue_id: v.id, setting_id: settingMap.get(s)! }));

      if (settingJunctions.length > 0) {
        const { error: settingJuncError } = await supabase
          .from('venue_settings')
          .upsert(settingJunctions, { onConflict: 'venue_id,setting_id' });

        if (settingJuncError) {
          console.error(`  Error inserting settings for ${v.id}:`, settingJuncError);
        }
      }
    }

    successCount += batch.length;
    console.log(`  Migrated ${Math.min(i + BATCH_SIZE, venues.length)}/${venues.length} venues`);
  }

  console.log(`\nMigration complete!`);
  console.log(`  Success: ${successCount} venues`);
  console.log(`  Errors: ${errorCount} venues`);

  // 6. Verify counts
  console.log('\nVerifying migration...');
  const { count: venueCount } = await supabase.from('venues').select('*', { count: 'exact', head: true });
  const { count: typeJuncCount } = await supabase.from('venue_venue_types').select('*', { count: 'exact', head: true });
  const { count: settingJuncCount } = await supabase.from('venue_settings').select('*', { count: 'exact', head: true });

  console.log(`  Venues in database: ${venueCount}`);
  console.log(`  Venue-type relationships: ${typeJuncCount}`);
  console.log(`  Venue-setting relationships: ${settingJuncCount}`);
}

migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
