#!/usr/bin/env npx tsx
/**
 * Verify California venue locations against Google Places API
 *
 * Run: npx tsx scripts/verify-california-locations.ts
 *
 * Options:
 *   --dry-run       Show mismatches without updating
 *   --fix           Auto-fix mismatched coordinates
 *   --region X      Only process venues in region X
 *   --limit N       Only process N venues
 *   --threshold M   Distance threshold in meters (default: 500)
 *   --max-dist M    Maximum distance to fix (skip if greater, default: 50000m/50km)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!GOOGLE_API_KEY) {
  console.error('❌ Missing VITE_GOOGLE_MAPS_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// California regions
const CALIFORNIA_REGIONS = [
  'Carmel', 'Central Coast', 'East Bay', 'Lake Tahoe', 'Marin',
  'Mendocino', 'Monterey', 'Napa Valley', 'North Bay', 'Peninsula',
  'Sacramento', 'San Francisco', 'Santa Cruz', 'Sonoma', 'South Bay'
];

// Parse command line args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fixMode = args.includes('--fix');
const regionIndex = args.indexOf('--region');
const region = regionIndex !== -1 ? args[regionIndex + 1] : undefined;
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;
const thresholdIndex = args.indexOf('--threshold');
const threshold = thresholdIndex !== -1 ? parseInt(args[thresholdIndex + 1]) : 500; // default 500m
const maxDistIndex = args.indexOf('--max-dist');
const maxDistance = maxDistIndex !== -1 ? parseInt(args[maxDistIndex + 1]) : 50000; // default 50km

const DELAY_MS = 200; // Rate limiting

interface VenueWithCoords {
  id: string;
  name: string;
  region: string;
  address: string;
  google_place_id: string | null;
  lat: number | null;
  lng: number | null;
}

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
}

interface PlaceDetails {
  place_id: string;
  website?: string;
  formatted_phone_number?: string;
  url?: string;
}

interface MismatchedVenue {
  id: string;
  name: string;
  region: string;
  currentLat: number;
  currentLng: number;
  placesLat: number;
  placesLng: number;
  distanceMeters: number;
  placeId: string;
  placeName: string;
  placeAddress: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Search for a place using Google Places Text Search API
 */
async function searchPlace(venueName: string, region: string): Promise<PlaceResult | null> {
  const query = `${venueName} ${region} California wedding venue`;
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', GOOGLE_API_KEY!);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0] as PlaceResult;
    } else if (data.status === 'ZERO_RESULTS') {
      return null;
    } else {
      console.error(`     Search error: ${data.status} - ${data.error_message || ''}`);
      return null;
    }
  } catch (error) {
    console.error(`     Network error:`, (error as Error).message);
    return null;
  }
}

/**
 * Get Place Details
 */
async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'place_id,website,formatted_phone_number,url');
  url.searchParams.set('key', GOOGLE_API_KEY!);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result as PlaceDetails;
    }
    return null;
  } catch (error) {
    console.error(`     Place details error:`, (error as Error).message);
    return null;
  }
}

/**
 * Query venues with coordinates extracted via SQL
 */
async function getVenuesWithCoords(regions: string[], maxLimit?: number): Promise<VenueWithCoords[]> {
  const regionList = regions.map(r => `'${r}'`).join(',');
  const limitClause = maxLimit ? `LIMIT ${maxLimit}` : '';

  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT
        id, name, region, address, google_place_id,
        extensions.ST_Y(location::extensions.geometry) as lat,
        extensions.ST_X(location::extensions.geometry) as lng
      FROM venues
      WHERE region IN (${regionList})
        AND location IS NOT NULL
      ORDER BY region, name
      ${limitClause}
    `
  });

  if (error) {
    // If RPC doesn't exist, try a direct approach
    console.log('Using direct query approach...');

    // Call the search_venues function which already extracts lat/lng
    const { data: searchData, error: searchError } = await supabase.rpc('search_venues', {
      filter_regions: regions,
      page_limit: maxLimit || 1000
    });

    if (searchError) {
      throw searchError;
    }

    return (searchData || []).map((v: { id: string; name: string; region: string; address: string; google_place_id?: string; lat: number | null; lng: number | null }) => ({
      id: v.id,
      name: v.name,
      region: v.region,
      address: v.address,
      google_place_id: v.google_place_id || null,
      lat: v.lat,
      lng: v.lng
    }));
  }

  return data || [];
}

async function main() {
  console.log('🔍 Verifying California venue locations against Google Places API\n');
  console.log(`   Distance threshold: ${threshold}m`);

  if (dryRun) {
    console.log('   Mode: DRY RUN (no changes will be made)\n');
  } else if (fixMode) {
    console.log(`   Mode: FIX (will update mismatched coordinates)`);
    console.log(`   Max fix distance: ${maxDistance / 1000}km (venues further away will be skipped)\n`);
  } else {
    console.log('   Mode: REPORT ONLY (use --fix to update)\n');
  }

  const targetRegions = region ? [region] : CALIFORNIA_REGIONS;

  let venues: VenueWithCoords[];
  try {
    venues = await getVenuesWithCoords(targetRegions, limit);
  } catch (error) {
    console.error('❌ Error fetching venues:', (error as Error).message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('✅ No venues found to verify');
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} California venues to verify`);
  if (region) console.log(`   Filtered to region: ${region}`);
  console.log('');

  const mismatches: MismatchedVenue[] = [];
  const notFound: { id: string; name: string; region: string }[] = [];
  let verified = 0;
  let skipped = 0;

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    const progress = `[${i + 1}/${venues.length}]`;

    // Check if venue has coordinates
    if (venue.lat === null || venue.lng === null) {
      console.log(`${progress} ${venue.name} - ⚠️ No coordinates`);
      skipped++;
      continue;
    }

    process.stdout.write(`${progress} ${venue.name} (${venue.region})... `);

    // Search for venue in Places API
    const result = await searchPlace(venue.name, venue.region);

    if (!result || !result.geometry?.location) {
      console.log('⚠️ Not found in Places');
      notFound.push({ id: venue.id, name: venue.name, region: venue.region });
      await sleep(DELAY_MS);
      continue;
    }

    const placesCoords = result.geometry.location;
    const distance = calculateDistance(
      venue.lat, venue.lng,
      placesCoords.lat, placesCoords.lng
    );

    if (distance > threshold) {
      console.log(`❌ MISMATCH (${Math.round(distance)}m away)`);
      console.log(`     Current:  ${venue.lat.toFixed(6)}, ${venue.lng.toFixed(6)}`);
      console.log(`     Places:   ${placesCoords.lat.toFixed(6)}, ${placesCoords.lng.toFixed(6)}`);
      console.log(`     Address:  ${result.formatted_address}`);

      mismatches.push({
        id: venue.id,
        name: venue.name,
        region: venue.region,
        currentLat: venue.lat,
        currentLng: venue.lng,
        placesLat: placesCoords.lat,
        placesLng: placesCoords.lng,
        distanceMeters: distance,
        placeId: result.place_id,
        placeName: result.name,
        placeAddress: result.formatted_address,
      });

      // Fix if requested
      if (fixMode && !dryRun) {
        // Skip if distance is too large (likely wrong venue match)
        if (distance > maxDistance) {
          console.log(`     ⏭️ SKIPPED - Distance ${Math.round(distance / 1000)}km exceeds max ${maxDistance / 1000}km (likely wrong match)`);
        } else {
          await sleep(DELAY_MS);
          const details = await getPlaceDetails(result.place_id);

          const { error: updateError } = await supabase
            .from('venues')
            .update({
              location: `POINT(${placesCoords.lng} ${placesCoords.lat})`,
              google_place_id: result.place_id,
              google_formatted_address: result.formatted_address,
              google_rating: result.rating || null,
              google_reviews_count: result.user_ratings_total || null,
              google_maps_url: details?.url || null,
            })
            .eq('id', venue.id);

          if (updateError) {
            console.log(`     ❌ Update failed: ${updateError.message}`);
          } else {
            console.log(`     ✅ FIXED - Updated to Places coordinates`);
          }
        }
      }
    } else {
      console.log(`✅ OK (${Math.round(distance)}m)`);
      verified++;
    }

    await sleep(DELAY_MS);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`   Total venues checked:   ${venues.length}`);
  console.log(`   Verified (within ${threshold}m):  ${verified}`);
  console.log(`   Mismatches found:       ${mismatches.length}`);
  console.log(`   Not found in Places:    ${notFound.length}`);
  console.log(`   Skipped (no coords):    ${skipped}`);

  if (mismatches.length > 0) {
    console.log('\n📍 MISMATCHED VENUES:');
    console.log('-'.repeat(60));

    // Group by region
    const byRegion = new Map<string, MismatchedVenue[]>();
    for (const m of mismatches) {
      if (!byRegion.has(m.region)) {
        byRegion.set(m.region, []);
      }
      byRegion.get(m.region)!.push(m);
    }

    for (const [regionName, regionMismatches] of byRegion) {
      console.log(`\n  ${regionName} (${regionMismatches.length}):`);
      for (const m of regionMismatches) {
        console.log(`    • ${m.name} - ${Math.round(m.distanceMeters)}m off`);
        console.log(`      Places says: ${m.placeAddress}`);
      }
    }

    if (!fixMode && !dryRun) {
      console.log('\n💡 Run with --fix to update mismatched coordinates');
    }
  }

  if (notFound.length > 0 && notFound.length <= 20) {
    console.log('\n⚠️ VENUES NOT FOUND IN PLACES:');
    for (const v of notFound) {
      console.log(`    • ${v.name} (${v.region})`);
    }
  }

  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
