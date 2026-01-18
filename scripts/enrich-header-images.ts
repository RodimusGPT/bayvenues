/**
 * Enrich venues without header images in Supabase
 *
 * Strategy (in priority order):
 * 1. YouTube thumbnails for venues with videos
 * 2. og:image scraping from venue websites
 * 3. Fallback images by venue type
 *
 * Run: npx tsx scripts/enrich-header-images.ts
 *
 * Environment variables required:
 * - SUPABASE_URL (or VITE_SUPABASE_URL)
 * - SUPABASE_SERVICE_ROLE_KEY (for write access)
 */

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import 'dotenv/config';

// Initialize Supabase with service role key for write access
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  console.error('   Required: SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error('   Required: SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nSet these in your .env file or environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fallback images by venue type (Unsplash URLs)
const FALLBACK_IMAGES: Record<string, string> = {
  'Winery': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=800&fit=crop',
  'Vineyard': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&h=800&fit=crop',
  'Historic': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop',
  'Garden': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop',
  'Estate': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
  'Mansion': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
  'Restaurant': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
  'Hotel': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop',
  'Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
  'Waterfront': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
  'Barn': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=1200&h=800&fit=crop',
  'Ranch': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop',
  'Golf Course': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=800&fit=crop',
  'Club': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop',
  'Museum': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200&h=800&fit=crop',
  'Brewery': 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&h=800&fit=crop',
  'Redwood': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=800&fit=crop',
  'Modern': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
  'Industrial': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
  'Castle': 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=1200&h=800&fit=crop',
  'Amphitheater': 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&h=800&fit=crop',
  'Villa': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
  'Chateau': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200&h=800&fit=crop',
  'Palazzo': 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1200&h=800&fit=crop',
  'Resort': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
  'Farmhouse': 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&h=800&fit=crop',
  'default': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
};

interface Video {
  title: string;
  url: string;
}

interface HeaderImage {
  url: string;
  source: 'youtube' | 'og_image' | 'fallback';
}

interface VenueRow {
  id: string;
  name: string;
  website: string | null;
  videos: Video[] | null;
  venue_types: string[];
}

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Fetch og:image from website
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    let ogImage = $('meta[property="og:image"]').attr('content') ||
                  $('meta[name="og:image"]').attr('content') ||
                  $('meta[property="twitter:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content');

    // Make relative URLs absolute
    if (ogImage && !ogImage.startsWith('http')) {
      const baseUrl = new URL(url);
      ogImage = new URL(ogImage, baseUrl.origin).href;
    }

    return ogImage || null;
  } catch {
    return null;
  }
}

// Get fallback image based on venue types
function getFallbackImage(venueTypes: string[]): string {
  for (const type of venueTypes) {
    if (FALLBACK_IMAGES[type]) {
      return FALLBACK_IMAGES[type];
    }
  }
  return FALLBACK_IMAGES['default'];
}

// Get header image for a venue - returns null if no real image found
async function getHeaderImage(venue: VenueRow): Promise<HeaderImage | null> {
  // Strategy 1: YouTube thumbnail
  if (venue.videos && venue.videos.length > 0) {
    const videoId = extractVideoId(venue.videos[0].url);
    if (videoId) {
      return {
        url: getYouTubeThumbnail(videoId),
        source: 'youtube',
      };
    }
  }

  // Strategy 2: og:image from website
  if (venue.website) {
    const ogImage = await fetchOgImage(venue.website);
    if (ogImage) {
      return {
        url: ogImage,
        source: 'og_image',
      };
    }
  }

  // No fallback - return null if no real image found
  return null;
}

async function main() {
  console.log('🖼️  Enriching header images for venues without images...\n');

  // Step 1: Fetch venues without header_images
  const { data: venues, error } = await supabase
    .from('venues')
    .select(`
      id,
      name,
      website,
      videos,
      venue_venue_types(venue_types(name))
    `)
    .or('header_images.is.null,header_images.eq.[]');

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('✅ All venues already have header images!');
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} venues without header images\n`);

  const stats = {
    youtube: 0,
    ogImage: 0,
    fallback: 0,
    errors: 0,
  };

  // Step 2: Process each venue
  for (let i = 0; i < venues.length; i++) {
    const rawVenue = venues[i];
    const progress = `[${i + 1}/${venues.length}]`;

    // Extract venue types from nested structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const venueTypes = (rawVenue.venue_venue_types as any[])
      ?.map((vt: { venue_types: { name: string } }) => vt.venue_types?.name)
      .filter(Boolean) ?? [];

    const venue: VenueRow = {
      id: rawVenue.id,
      name: rawVenue.name,
      website: rawVenue.website,
      videos: rawVenue.videos,
      venue_types: venueTypes,
    };

    try {
      // Get header image
      const headerImage = await getHeaderImage(venue);

      if (!headerImage) {
        stats.fallback++;
        console.log(`${progress} ⏭️  ${venue.name} - No real image found, skipping`);
        continue;
      }

      // Update database - store as array in header_images (plural)
      const { error: updateError } = await supabase
        .from('venues')
        .update({ header_images: [headerImage] })
        .eq('id', venue.id);

      if (updateError) {
        throw updateError;
      }

      // Track stats
      if (headerImage.source === 'youtube') {
        stats.youtube++;
        console.log(`${progress} ✅ ${venue.name} - YouTube thumbnail`);
      } else if (headerImage.source === 'og_image') {
        stats.ogImage++;
        console.log(`${progress} ✅ ${venue.name} - og:image`);
      }
    } catch (err) {
      stats.errors++;
      console.error(`${progress} ❌ ${venue.name} - Error:`, err);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Step 3: Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   YouTube thumbnails: ${stats.youtube}`);
  console.log(`   og:image scraped:   ${stats.ogImage}`);
  console.log(`   Skipped (no image): ${stats.fallback}`);
  console.log(`   Errors:             ${stats.errors}`);
  console.log(`   Total processed:    ${venues.length}`);
  console.log('='.repeat(50));
  console.log('\n✅ Done! Venues with real images have been updated.');
}

main().catch(console.error);
