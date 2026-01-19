#!/usr/bin/env npx tsx
/**
 * Enrich venues that have fewer than 3 header images
 * Uses Serper API to fetch Google Images
 *
 * Run: npx tsx scripts/enrich-low-image-venues.ts
 *
 * Options:
 *   --limit N       Only process first N venues
 *   --start N       Start from index N (for resuming)
 *   --country NAME  Only process venues in this country (e.g., Ireland)
 *   --dry-run       Show what would be done without making changes
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!SERPER_API_KEY) {
  console.error('❌ Missing SERPER_API_KEY');
  console.error('   Get your API key at https://serper.dev');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse command line args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;
const startIndex = args.indexOf('--start');
const start = startIndex !== -1 ? parseInt(args[startIndex + 1]) : 0;
const countryIndex = args.indexOf('--country');
const country = countryIndex !== -1 ? args[countryIndex + 1] : undefined;

const IMAGES_PER_VENUE = 5;
const DELAY_MS = 200; // Delay between API calls

interface HeaderImage {
  url: string;
  source: string;
  thumbnail?: string;
}

async function searchImages(venueName: string, region: string): Promise<HeaderImage[] | null> {
  try {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: `${venueName} ${region} wedding venue`,
        num: IMAGES_PER_VENUE * 2, // Get extra in case some fail
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('   API Error:', data.error);
      return null;
    }

    if (data.images && data.images.length > 0) {
      return data.images
        .slice(0, IMAGES_PER_VENUE)
        .map((img: { imageUrl: string; thumbnailUrl: string }) => ({
          url: img.imageUrl,
          thumbnail: img.thumbnailUrl,
          source: 'google',
        }));
    }

    return [];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('   Fetch error:', message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Enriching venues with fewer than 3 header images...\n');

  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made\n');
  }

  if (country) {
    console.log(`🌍 Filtering by country: ${country}\n`);
  }

  // If filtering by country, first get the regions for that country
  let regionNames: string[] = [];
  if (country) {
    const { data: regions, error: regionError } = await supabase
      .from('regions')
      .select('name')
      .eq('country', country);

    if (regionError) {
      console.error('❌ Error fetching regions:', regionError.message);
      process.exit(1);
    }

    regionNames = regions?.map(r => r.name) || [];
    console.log(`   Found ${regionNames.length} regions: ${regionNames.join(', ')}\n`);
  }

  // Get venues with < 3 images (with optional country filter)
  let query = supabase
    .from('venues')
    .select('id, name, region, header_images')
    .order('region')
    .order('name');

  if (country && regionNames.length > 0) {
    query = query.in('region', regionNames);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  // Filter to venues with < 3 images
  const lowImageVenues = venues?.filter(v => {
    const images = v.header_images as HeaderImage[] | null;
    return !images || images.length < 3;
  }) || [];

  if (lowImageVenues.length === 0) {
    console.log('✅ All venues have at least 3 images!');
    process.exit(0);
  }

  console.log(`📋 Found ${lowImageVenues.length} venues with fewer than 3 images\n`);

  // Apply start/limit
  const batch = limit
    ? lowImageVenues.slice(start, start + limit)
    : lowImageVenues.slice(start);

  console.log(`Processing ${batch.length} venues (starting at index ${start})`);
  console.log(`This will use ~${batch.length} Serper API queries\n`);

  let enriched = 0;
  let noImages = 0;
  let errors = 0;

  for (let i = 0; i < batch.length; i++) {
    const venue = batch[i];
    const progress = `[${start + i + 1}/${lowImageVenues.length}]`;
    const currentImages = (venue.header_images as HeaderImage[] | null) || [];

    console.log(`${progress} ${venue.name} (${venue.region})`);
    console.log(`       Current images: ${currentImages.length}`);

    if (dryRun) {
      console.log(`       🔧 Would fetch 5 new images\n`);
      continue;
    }

    const newImages = await searchImages(venue.name, venue.region);

    if (newImages === null) {
      console.log(`       ❌ API error`);
      errors++;
      continue;
    }

    if (newImages.length === 0) {
      console.log(`       ⚠️  No images found`);
      noImages++;
      continue;
    }

    // Update database
    const { error: updateError } = await supabase
      .from('venues')
      .update({
        header_images: newImages,
        header_image: newImages[0],
      })
      .eq('id', venue.id);

    if (updateError) {
      console.log(`       ❌ Update error: ${updateError.message}`);
      errors++;
    } else {
      console.log(`       ✅ Updated with ${newImages.length} images`);
      enriched++;
    }

    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Enrichment Summary:');
  console.log(`   Venues enriched:     ${enriched}`);
  console.log(`   No images found:     ${noImages}`);
  console.log(`   Errors:              ${errors}`);
  console.log(`   Total processed:     ${batch.length}`);
  console.log('='.repeat(60));

  if (start + batch.length < lowImageVenues.length) {
    const nextStart = start + batch.length;
    console.log(`\n➡️  To continue: npx tsx scripts/enrich-low-image-venues.ts --start ${nextStart}`);
  } else {
    console.log('\n✅ All low-image venues processed!');
  }
}

main().catch(console.error);
