#!/usr/bin/env npx tsx
/**
 * Smart Image Enrichment Script
 *
 * Fetches high-quality venue images using multiple sources in priority order:
 * 1. Official venue website (og:image, hero images)
 * 2. Kiwi Collection CDN (professional photography)
 * 3. Five Star Alliance (high-quality hotel images)
 * 4. Serper Google Images search (filtered for quality sources)
 * 5. YouTube thumbnails (from venue videos)
 * 6. Unsplash fallback (last resort - generic but high quality)
 *
 * Run: npx tsx scripts/enrich-images-smart.ts
 *
 * Options:
 *   --limit N      Only process first N venues
 *   --region X     Only process venues in region X
 *   --venue-id X   Only process specific venue ID
 *   --dry-run      Show what would be done without making changes
 *   --force        Re-enrich venues even if they have images (replaces unsplash)
 */

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse command line args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;
const regionIndex = args.indexOf('--region');
const region = regionIndex !== -1 ? args[regionIndex + 1] : undefined;
const venueIdIndex = args.indexOf('--venue-id');
const venueId = venueIdIndex !== -1 ? args[venueIdIndex + 1] : undefined;

const DELAY_MS = 500;
const TARGET_IMAGES = 5;

interface HeaderImage {
  url: string;
  source: string;
  description?: string;
}

interface VenueRow {
  id: string;
  name: string;
  region: string;
  website: string | null;
  videos: { title: string; url: string }[] | null;
  header_images: HeaderImage[] | null;
}

// Quality image source domains (in priority order)
const QUALITY_DOMAINS = [
  'cdn.kiwicollection.com',
  'fivestaralliance.com/files',
  'aman.com/sites/default/files',
  'fourseasons.com/alt/img-opt',
  'ritzcarlton.com',
  'marriott.com',
  'hilton.com',
  'hyatt.com',
  'terrace.co.jp',
  'halekulani.com',
  'leading hotels.com',
  'venuereport.com',
  'secret-retreats.com',
  'upload.wikimedia.org/wikipedia/commons',
];

// Domains to avoid (low quality or problematic)
const BLOCKED_DOMAINS = [
  'encrypted-tbn0.gstatic.com', // Google thumbnails - too low res
  'lookaside.instagram.com',
  'lookaside.fbsbx.com',
  'weddingwire.com',
  'theknot.com',
  'yelp.com',
  'tripadvisor.com',
  'facebook.com',
  'instagram.com',
  'pinterest.com',
  'twitter.com',
  'youtube.com', // We handle YouTube separately
];

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch og:image and hero images from venue website
 */
async function fetchFromWebsite(url: string, venueName: string): Promise<HeaderImage[]> {
  const images: HeaderImage[] = [];

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

    if (!response.ok) {
      console.log(`     ⚠️  Website returned ${response.status}`);
      return images;
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const baseUrl = new URL(url);

    // Get og:image
    const ogImage = $('meta[property="og:image"]').attr('content') ||
                    $('meta[name="og:image"]').attr('content');

    if (ogImage) {
      const fullUrl = ogImage.startsWith('http') ? ogImage : new URL(ogImage, baseUrl.origin).href;
      if (!isBlockedDomain(fullUrl)) {
        images.push({ url: fullUrl, source: 'website', description: `${venueName} - og:image` });
      }
    }

    // Look for hero/banner images
    $('img[src*="hero"], img[src*="banner"], img[src*="header"], img[class*="hero"], img[class*="banner"]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && images.length < TARGET_IMAGES) {
        const fullUrl = src.startsWith('http') ? src : new URL(src, baseUrl.origin).href;
        if (!isBlockedDomain(fullUrl) && !images.some(img => img.url === fullUrl)) {
          images.push({ url: fullUrl, source: 'website', description: `${venueName} - hero image` });
        }
      }
    });

  } catch (error) {
    console.log(`     ⚠️  Website fetch failed: ${(error as Error).message}`);
  }

  return images;
}

/**
 * Search Kiwi Collection for venue images
 */
async function searchKiwiCollection(venueName: string): Promise<HeaderImage[]> {
  if (!SERPER_API_KEY) return [];

  const images: HeaderImage[] = [];
  const searchQuery = `${venueName} site:kiwicollection.com`;

  try {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: searchQuery, num: 10 }),
    });

    const data = await response.json();

    if (data.images) {
      for (const img of data.images) {
        const url = img.imageUrl as string;
        if (url.includes('cdn.kiwicollection.com') && images.length < TARGET_IMAGES) {
          images.push({
            url,
            source: 'kiwicollection.com',
            description: img.title || venueName,
          });
        }
      }
    }
  } catch (error) {
    console.log(`     ⚠️  Kiwi Collection search failed: ${(error as Error).message}`);
  }

  return images;
}

/**
 * Search Five Star Alliance for venue images
 */
async function searchFiveStarAlliance(venueName: string): Promise<HeaderImage[]> {
  if (!SERPER_API_KEY) return [];

  const images: HeaderImage[] = [];
  const searchQuery = `${venueName} site:fivestaralliance.com`;

  try {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: searchQuery, num: 10 }),
    });

    const data = await response.json();

    if (data.images) {
      for (const img of data.images) {
        const url = img.imageUrl as string;
        if (url.includes('fivestaralliance.com/files') && images.length < TARGET_IMAGES) {
          images.push({
            url,
            source: 'fivestaralliance.com',
            description: img.title || venueName,
          });
        }
      }
    }
  } catch (error) {
    console.log(`     ⚠️  Five Star Alliance search failed: ${(error as Error).message}`);
  }

  return images;
}

/**
 * Search for high-quality images from any trusted source
 */
async function searchQualityImages(venueName: string, region: string): Promise<HeaderImage[]> {
  if (!SERPER_API_KEY) return [];

  const images: HeaderImage[] = [];
  const searchQuery = `${venueName} ${region} hotel venue high resolution`;

  try {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: searchQuery, num: 20 }),
    });

    const data = await response.json();

    if (data.images) {
      // First pass: prefer quality domains
      for (const img of data.images) {
        const url = img.imageUrl as string;
        if (isQualityDomain(url) && !isBlockedDomain(url) && images.length < TARGET_IMAGES) {
          images.push({
            url,
            source: extractDomain(url),
            description: img.title || venueName,
          });
        }
      }

      // Second pass: any non-blocked high-res image
      if (images.length < TARGET_IMAGES) {
        for (const img of data.images) {
          const url = img.imageUrl as string;
          const width = img.imageWidth || 0;
          const height = img.imageHeight || 0;

          // Only accept reasonably sized images
          if (!isBlockedDomain(url) &&
              width >= 800 && height >= 500 &&
              !images.some(i => i.url === url) &&
              images.length < TARGET_IMAGES) {
            images.push({
              url,
              source: extractDomain(url),
              description: img.title || venueName,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(`     ⚠️  Quality image search failed: ${(error as Error).message}`);
  }

  return images;
}

/**
 * Get YouTube thumbnail from video URL
 */
function getYouTubeThumbnail(videoUrl: string): HeaderImage | null {
  const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) {
    // Use sddefault (640x480) - more reliable than maxresdefault
    return {
      url: `https://img.youtube.com/vi/${match[1]}/sddefault.jpg`,
      source: 'youtube',
      description: 'Video thumbnail',
    };
  }
  return null;
}

/**
 * Get Unsplash fallback based on venue type/region
 */
function getUnsplashFallback(venueName: string, region: string): HeaderImage[] {
  // Determine fallback type based on name/region
  const nameLower = venueName.toLowerCase();
  const regionLower = region.toLowerCase();

  let fallbackImages: string[] = [];

  if (regionLower.includes('okinawa') || nameLower.includes('beach') || nameLower.includes('resort')) {
    fallbackImages = [
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600',
    ];
  } else if (regionLower.includes('kyoto') || nameLower.includes('traditional')) {
    fallbackImages = [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600',
    ];
  } else if (regionLower.includes('tokyo')) {
    fallbackImages = [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600', // Luxury hotel room
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600', // Resort
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600', // Hotel lobby
    ];
  } else if (nameLower.includes('winery') || nameLower.includes('vineyard')) {
    fallbackImages = [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600',
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600',
    ];
  } else if (nameLower.includes('castle') || nameLower.includes('palazzo')) {
    fallbackImages = [
      'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=1600',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600',
    ];
  } else {
    // Generic luxury venue fallback
    fallbackImages = [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600',
    ];
  }

  return fallbackImages.map((url, i) => ({
    url,
    source: 'unsplash',
    description: `${venueName} fallback ${i + 1}`,
  }));
}

function isQualityDomain(url: string): boolean {
  return QUALITY_DOMAINS.some(domain => url.includes(domain));
}

function isBlockedDomain(url: string): boolean {
  return BLOCKED_DOMAINS.some(domain => url.includes(domain));
}

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Main enrichment function for a single venue
 */
async function enrichVenueImages(venue: VenueRow): Promise<HeaderImage[]> {
  const allImages: HeaderImage[] = [];

  console.log(`     🔍 Searching for images...`);

  // Strategy 1: Official website
  if (venue.website) {
    console.log(`     📄 Checking website...`);
    const websiteImages = await fetchFromWebsite(venue.website, venue.name);
    allImages.push(...websiteImages);
    if (websiteImages.length > 0) {
      console.log(`        Found ${websiteImages.length} from website`);
    }
    await sleep(DELAY_MS);
  }

  // Strategy 2: Kiwi Collection (if we need more images)
  if (allImages.length < TARGET_IMAGES && SERPER_API_KEY) {
    console.log(`     🥝 Searching Kiwi Collection...`);
    const kiwiImages = await searchKiwiCollection(venue.name);
    for (const img of kiwiImages) {
      if (!allImages.some(i => i.url === img.url) && allImages.length < TARGET_IMAGES) {
        allImages.push(img);
      }
    }
    if (kiwiImages.length > 0) {
      console.log(`        Found ${kiwiImages.length} from Kiwi Collection`);
    }
    await sleep(DELAY_MS);
  }

  // Strategy 3: Five Star Alliance (if we need more images)
  if (allImages.length < TARGET_IMAGES && SERPER_API_KEY) {
    console.log(`     ⭐ Searching Five Star Alliance...`);
    const fsaImages = await searchFiveStarAlliance(venue.name);
    for (const img of fsaImages) {
      if (!allImages.some(i => i.url === img.url) && allImages.length < TARGET_IMAGES) {
        allImages.push(img);
      }
    }
    if (fsaImages.length > 0) {
      console.log(`        Found ${fsaImages.length} from Five Star Alliance`);
    }
    await sleep(DELAY_MS);
  }

  // Strategy 4: General quality image search (if we need more images)
  if (allImages.length < TARGET_IMAGES && SERPER_API_KEY) {
    console.log(`     🔎 Searching quality image sources...`);
    const qualityImages = await searchQualityImages(venue.name, venue.region);
    for (const img of qualityImages) {
      if (!allImages.some(i => i.url === img.url) && allImages.length < TARGET_IMAGES) {
        allImages.push(img);
      }
    }
    if (qualityImages.length > 0) {
      console.log(`        Found ${qualityImages.length} from quality sources`);
    }
    await sleep(DELAY_MS);
  }

  // Strategy 5: YouTube thumbnails (if we need more images)
  if (allImages.length < TARGET_IMAGES && venue.videos && venue.videos.length > 0) {
    console.log(`     📺 Extracting YouTube thumbnails...`);
    for (const video of venue.videos) {
      const thumbnail = getYouTubeThumbnail(video.url);
      if (thumbnail && !allImages.some(i => i.url === thumbnail.url) && allImages.length < TARGET_IMAGES) {
        allImages.push(thumbnail);
      }
    }
  }

  // Strategy 6: Unsplash fallback (last resort)
  if (allImages.length < 3) {
    console.log(`     🖼️  Adding Unsplash fallbacks...`);
    const fallbacks = getUnsplashFallback(venue.name, venue.region);
    for (const img of fallbacks) {
      if (allImages.length < TARGET_IMAGES) {
        allImages.push(img);
      }
    }
  }

  return allImages.slice(0, TARGET_IMAGES);
}

async function main() {
  console.log('🖼️  Smart Image Enrichment\n');
  console.log('Priority order:');
  console.log('  1. Official website (og:image, hero images)');
  console.log('  2. Kiwi Collection CDN');
  console.log('  3. Five Star Alliance');
  console.log('  4. Quality image search');
  console.log('  5. YouTube thumbnails');
  console.log('  6. Unsplash fallback\n');

  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made\n');
  }

  if (!SERPER_API_KEY) {
    console.log('⚠️  SERPER_API_KEY not set - travel site search disabled\n');
  }

  // Build query
  let query = supabase
    .from('venues')
    .select('id, name, region, website, videos, header_images')
    .order('region')
    .order('name');

  if (venueId) {
    query = query.eq('id', venueId);
  } else if (region) {
    query = query.eq('region', region);
  }

  // Filter for venues needing images (unless --force)
  if (!force && !venueId) {
    // Get venues with < 3 images or only unsplash images
    query = query.or('header_images.is.null,header_images.eq.[]');
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data: allVenues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  // Filter venues that need enrichment
  let venues = allVenues?.filter(v => {
    if (venueId) return true; // Always process specific venue
    if (!v.header_images || v.header_images.length === 0) return true;
    if (v.header_images.length < 3) return true;
    if (force) {
      // In force mode, re-enrich venues with only unsplash images
      const hasOnlyUnsplash = v.header_images.every((img: HeaderImage) =>
        img.source === 'unsplash' || img.url?.includes('unsplash.com')
      );
      return hasOnlyUnsplash;
    }
    return false;
  }) || [];

  if (venues.length === 0) {
    console.log('✅ All venues have quality images!');
    if (!force) {
      console.log('   Use --force to re-enrich venues with only Unsplash images');
    }
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} venues to enrich`);
  if (region) console.log(`   Filtered to region: ${region}`);
  console.log('');

  let enriched = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i] as VenueRow;
    const progress = `[${i + 1}/${venues.length}]`;
    const currentCount = venue.header_images?.length || 0;

    console.log(`${progress} ${venue.name} (${venue.region})`);
    console.log(`     Current: ${currentCount} images`);

    if (dryRun) {
      console.log(`     🔧 Would search for images\n`);
      continue;
    }

    try {
      const images = await enrichVenueImages(venue);

      if (images.length === 0) {
        console.log(`     ⚠️  No images found`);
        skipped++;
      } else {
        // Update database
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            header_images: images,
            header_image: images[0],
          })
          .eq('id', venue.id);

        if (updateError) {
          throw updateError;
        }

        const sources = [...new Set(images.map(img => img.source))].join(', ');
        console.log(`     ✅ Updated with ${images.length} images (${sources})`);
        enriched++;
      }
    } catch (err) {
      console.log(`     ❌ Error: ${(err as Error).message}`);
      errors++;
    }

    console.log('');
    await sleep(DELAY_MS);
  }

  // Summary
  console.log('='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Venues enriched:     ${enriched}`);
  console.log(`   Skipped:             ${skipped}`);
  console.log(`   Errors:              ${errors}`);
  console.log(`   Total processed:     ${venues.length}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
