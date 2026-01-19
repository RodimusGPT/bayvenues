#!/usr/bin/env npx tsx
/**
 * Enrich venue data using Google Places API
 * Uses your existing VITE_GOOGLE_MAPS_API_KEY
 *
 * Run: npx tsx scripts/enrich-websites-places.ts
 *
 * Options:
 *   --limit N      Only process first N venues (default: 50)
 *   --region X     Only process venues in region X
 *   --dry-run      Preview without making changes
 *   --missing-data Target venues missing phone OR rating (not just website)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
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

// Parse command line args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const missingData = args.includes('--missing-data');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : 50;
const regionIndex = args.indexOf('--region');
const regionFilter = regionIndex !== -1 ? args[regionIndex + 1] : undefined;

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  website?: string;
  formatted_phone_number?: string;
  rating?: number;
  user_ratings_total?: number;
}

async function findPlaceAndGetDetails(
  venueName: string,
  region: string
): Promise<PlaceResult | null> {
  try {
    // Step 1: Find Place from Text
    const findUrl = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
    findUrl.searchParams.set('input', `${venueName} ${region}`);
    findUrl.searchParams.set('inputtype', 'textquery');
    findUrl.searchParams.set('fields', 'place_id,name');
    findUrl.searchParams.set('key', GOOGLE_API_KEY!);

    const findResponse = await fetch(findUrl.toString());
    const findData = await findResponse.json();

    if (findData.status !== 'OK' || !findData.candidates?.length) {
      return null;
    }

    const placeId = findData.candidates[0].place_id;

    // Step 2: Get Place Details (including website)
    const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    detailsUrl.searchParams.set('place_id', placeId);
    detailsUrl.searchParams.set('fields', 'name,website,formatted_phone_number,rating,user_ratings_total,formatted_address');
    detailsUrl.searchParams.set('key', GOOGLE_API_KEY!);

    const detailsResponse = await fetch(detailsUrl.toString());
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK' || !detailsData.result) {
      return null;
    }

    return {
      place_id: placeId,
      ...detailsData.result,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n   Error: ${message}`);
    return null;
  }
}

async function main() {
  const mode = missingData ? 'missing phone/rating' : 'missing websites';
  console.log(`🌐 Enriching venues with ${mode} via Google Places API...\n`);

  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made\n');
  }

  // Get venues based on mode
  let query = supabase
    .from('venues')
    .select('id, name, region, website, phone, google_rating, google_reviews_count')
    .order('region')
    .limit(limit);

  if (missingData) {
    // Target venues missing phone OR rating
    query = query.or('phone.is.null,google_rating.is.null');
  } else {
    // Target venues without websites
    query = query.or('website.is.null,website.eq.');
  }

  if (regionFilter) {
    query = query.eq('region', regionFilter);
    console.log(`   Filtering by region: ${regionFilter}`);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log(`✅ No venues with ${mode} found!`);
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} venues with ${mode}`);
  console.log(`   This will use ~${venues.length * 2} Places API requests\n`);

  let fixed = 0;
  let notFound = 0;
  let errors = 0;
  let bonusData = 0;

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    const progress = `[${i + 1}/${venues.length}]`;

    process.stdout.write(`${progress} ${venue.name} (${venue.region})... `);

    const place = await findPlaceAndGetDetails(venue.name, venue.region);

    if (place) {
      // Build update object with any data we can add
      const updateData: Record<string, unknown> = {};
      const updates: string[] = [];

      // Add website if missing
      if (!venue.website && place.website) {
        updateData.website = place.website;
        updates.push('website');
      }

      // Add phone if missing
      if (!venue.phone && place.formatted_phone_number) {
        updateData.phone = place.formatted_phone_number;
        updates.push('phone');
      }

      // Add rating if missing
      if (!venue.google_rating && place.rating) {
        updateData.google_rating = place.rating;
        updateData.google_reviews_count = place.user_ratings_total || 0;
        updates.push('rating');
      }

      if (Object.keys(updateData).length === 0) {
        console.log('⚠️  No new data to add');
        notFound++;
        continue;
      }

      if (dryRun) {
        console.log(`✅ Would add: ${updates.join(', ')}`);
        fixed++;
        bonusData += updates.length;
      } else {
        // Update database
        const { error: updateError } = await supabase
          .from('venues')
          .update(updateData)
          .eq('id', venue.id);

        if (updateError) {
          console.log(`❌ Update error`);
          errors++;
        } else {
          console.log(`✅ Added: ${updates.join(', ')}`);
          fixed++;
          bonusData += updates.length;
        }
      }
    } else {
      console.log('⚠️  Not found');
      notFound++;
    }

    // Rate limit: 100ms between requests (Places API allows 50 QPS)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('🌐 Website Enrichment Summary:');
  console.log(`   Websites fixed:  ${fixed}`);
  console.log(`   Not found:       ${notFound}`);
  console.log(`   Errors:          ${errors}`);
  console.log(`   Bonus data added: ${bonusData} (phone/rating)`);
  console.log('═'.repeat(50));
}

main().catch(console.error);
