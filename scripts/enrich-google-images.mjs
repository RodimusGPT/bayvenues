#!/usr/bin/env node
/**
 * Enrich venues with Google Images via Serper API
 * Updates header_images in Supabase with real venue photos
 *
 * Run: node scripts/enrich-google-images.mjs
 *
 * Environment variables:
 * - SERPER_API_KEY: Get at https://serper.dev (2,500 free queries)
 * - SUPABASE_SERVICE_ROLE_KEY: For database writes
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERPER_API_KEY) {
  console.error('❌ Missing SERPER_API_KEY environment variable');
  console.error('   Get your API key at https://serper.dev');
  process.exit(1);
}

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_SIZE = 50;
const IMAGES_PER_VENUE = 5;
const DELAY_MS = 150;

async function searchImages(query) {
  try {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num: IMAGES_PER_VENUE * 2
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('   API Error:', data.error);
      return null;
    }

    if (data.images && data.images.length > 0) {
      return data.images
        .slice(0, IMAGES_PER_VENUE)
        .map(img => ({
          url: img.imageUrl,
          thumbnail: img.thumbnailUrl,
          source: 'google'
        }));
    }

    return [];
  } catch (error) {
    console.error('   Fetch error:', error.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Enriching venues with Google Images via Serper API\n');

  // Get venues without header_images
  const { data: venues, error } = await supabase
    .from('venues')
    .select('id, name, region')
    .or('header_images.is.null,header_images.eq.[]')
    .order('name');

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('✅ All venues already have header images!');
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} venues without header images\n`);

  // Get batch start from command line arg
  const startIndex = parseInt(process.argv[2]) || 0;
  const batch = venues.slice(startIndex, startIndex + BATCH_SIZE);

  console.log(`Processing batch: ${startIndex} to ${startIndex + batch.length - 1}`);
  console.log(`This will use ~${batch.length} Serper queries\n`);

  let updated = 0;
  let errors = 0;
  let noImages = 0;

  for (let i = 0; i < batch.length; i++) {
    const venue = batch[i];
    const query = `${venue.name} ${venue.region} wedding venue`;
    const progress = `[${startIndex + i + 1}/${venues.length}]`;

    console.log(`${progress} Searching: ${venue.name}`);

    const images = await searchImages(query);

    if (images === null) {
      console.log(`   ❌ API error - stopping`);
      errors++;
      break;
    }

    if (images.length > 0) {
      const { error: updateError } = await supabase
        .from('venues')
        .update({ header_images: images })
        .eq('id', venue.id);

      if (updateError) {
        console.log(`   ❌ Update error: ${updateError.message}`);
        errors++;
      } else {
        console.log(`   ✅ Found ${images.length} images`);
        updated++;
      }
    } else {
      console.log(`   ⚠️  No images found`);
      noImages++;
    }

    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Updated with images: ${updated}`);
  console.log(`   No images found:     ${noImages}`);
  console.log(`   Errors:              ${errors}`);
  console.log(`   Total processed:     ${batch.length}`);
  console.log('='.repeat(50));

  if (startIndex + BATCH_SIZE < venues.length) {
    console.log(`\n➡️  Next batch: node scripts/enrich-google-images.mjs ${startIndex + BATCH_SIZE}`);
  } else {
    console.log('\n✅ All venues processed!');
  }
}

main().catch(console.error);
