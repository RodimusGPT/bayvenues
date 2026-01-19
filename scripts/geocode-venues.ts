#!/usr/bin/env npx tsx
/**
 * Geocode venues missing coordinates using Google Places API
 * Falls back to Serper for website lookup if Places API doesn't return one
 *
 * Run: npx tsx scripts/geocode-venues.ts
 *
 * Options:
 *   --region X     Only process venues in region X
 *   --dry-run      Show what would be done without making changes
 *   --limit N      Only process N venues
 *   --enrich       Also process venues that have coordinates but missing website
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!GOOGLE_API_KEY) {
  console.error('❌ Missing VITE_GOOGLE_MAPS_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse command line args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const enrichMode = args.includes('--enrich');
const regionIndex = args.indexOf('--region');
const region = regionIndex !== -1 ? args[regionIndex + 1] : undefined;
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;

const DELAY_MS = 200; // Rate limiting for APIs

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
  url?: string; // Google Maps URL
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search for a place using Google Places Text Search API
 */
async function searchPlace(venueName: string, region: string): Promise<PlaceResult | null> {
  const query = `${venueName} ${region}`;
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', GOOGLE_API_KEY!);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0] as PlaceResult;
    } else if (data.status === 'ZERO_RESULTS') {
      console.log(`     No results found`);
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
 * Get Place Details to retrieve website
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
 * Search for venue website using Serper API (fallback)
 */
async function searchWebsiteWithSerper(venueName: string, region: string): Promise<string | null> {
  if (!SERPER_API_KEY) {
    return null;
  }

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: `${venueName} ${region} wedding venue official website`,
        num: 5,
      }),
    });

    const data = await response.json();

    if (data.organic && data.organic.length > 0) {
      // Filter out aggregator sites and find official website
      const excludeDomains = [
        'weddingwire.com', 'theknot.com', 'yelp.com', 'facebook.com',
        'instagram.com', 'tripadvisor.com', 'google.com', 'pinterest.com',
        'youtube.com', 'twitter.com', 'linkedin.com', 'brides.com',
        'herecomestheguide.com', 'junebugweddings.com', 'wedding-spot.com'
      ];

      for (const result of data.organic) {
        const url = result.link as string;
        const domain = new URL(url).hostname.replace('www.', '');

        // Skip aggregator sites
        if (excludeDomains.some(d => domain.includes(d))) {
          continue;
        }

        // Check if venue name appears in domain or title
        const venueWords = venueName.toLowerCase().split(' ').filter(w => w.length > 3);
        const matchesVenue = venueWords.some(word =>
          domain.toLowerCase().includes(word) ||
          (result.title as string).toLowerCase().includes(word)
        );

        if (matchesVenue) {
          return url;
        }
      }

      // If no perfect match, return first non-aggregator result
      for (const result of data.organic) {
        const url = result.link as string;
        const domain = new URL(url).hostname.replace('www.', '');
        if (!excludeDomains.some(d => domain.includes(d))) {
          return url;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`     Serper error:`, (error as Error).message);
    return null;
  }
}

async function main() {
  console.log('🗺️  Geocoding venues with Google Places API\n');

  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made\n');
  }

  if (!SERPER_API_KEY) {
    console.log('⚠️  SERPER_API_KEY not set - website fallback disabled\n');
  }

  // Build query for venues without coordinates (or without website if --enrich)
  let query = supabase
    .from('venues')
    .select('id, name, region, address, website')
    .order('region')
    .order('name');

  if (enrichMode) {
    // Process venues missing website
    query = query.or('location.is.null,website.is.null');
  } else {
    // Only process venues missing coordinates
    query = query.is('location', null);
  }

  if (region) {
    query = query.eq('region', region);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('✅ All venues already have coordinates' + (enrichMode ? ' and websites' : '') + '!');
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} venues to process`);
  if (region) console.log(`   Filtered to region: ${region}`);
  console.log('');

  let geocoded = 0;
  let websitesFound = 0;
  let failed = 0;

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    const progress = `[${i + 1}/${venues.length}]`;

    console.log(`${progress} ${venue.name} (${venue.region})`);

    if (dryRun) {
      console.log(`     🔧 Would search for coordinates and website\n`);
      continue;
    }

    const result = await searchPlace(venue.name, venue.region);

    if (result && result.geometry?.location) {
      const { lat, lng } = result.geometry.location;

      // Get place details for website
      await sleep(DELAY_MS);
      const details = await getPlaceDetails(result.place_id);

      let website = details?.website || null;
      let websiteSource = 'google';

      // If no website from Google, try Serper
      if (!website && !venue.website && SERPER_API_KEY) {
        await sleep(DELAY_MS);
        website = await searchWebsiteWithSerper(venue.name, venue.region);
        websiteSource = 'serper';
      }

      // Build update object
      const updateData: Record<string, unknown> = {
        location: `POINT(${lng} ${lat})`,
        google_place_id: result.place_id,
        google_rating: result.rating || null,
        google_reviews_count: result.user_ratings_total || null,
        google_formatted_address: result.formatted_address || null,
      };

      // Only update website if venue doesn't have one and we found one
      if (website && !venue.website) {
        updateData.website = website;
      }

      if (details?.formatted_phone_number) {
        updateData.google_phone = details.formatted_phone_number;
      }

      if (details?.url) {
        updateData.google_maps_url = details.url;
      }

      // Update venue
      const { error: updateError } = await supabase
        .from('venues')
        .update(updateData)
        .eq('id', venue.id);

      if (updateError) {
        console.log(`     ❌ Update failed: ${updateError.message}`);
        failed++;
      } else {
        console.log(`     ✅ ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        if (result.rating) {
          console.log(`     ⭐ Rating: ${result.rating} (${result.user_ratings_total} reviews)`);
        }
        if (website && !venue.website) {
          console.log(`     🌐 Website: ${website} (via ${websiteSource})`);
          websitesFound++;
        }
        geocoded++;
      }
    } else {
      console.log(`     ⚠️ Could not geocode`);
      failed++;
    }

    console.log('');
    await sleep(DELAY_MS);
  }

  // Summary
  console.log('='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Venues geocoded:     ${geocoded}`);
  console.log(`   Websites found:      ${websitesFound}`);
  console.log(`   Failed:              ${failed}`);
  console.log(`   Total processed:     ${venues.length}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
