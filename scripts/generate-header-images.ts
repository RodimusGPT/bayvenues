/**
 * Generate header images for all venues
 *
 * Strategy:
 * 1. YouTube thumbnails for venues with videos (highest quality)
 * 2. og:image scraping from venue websites
 * 3. Fallback images by venue type
 *
 * Run: npx tsx scripts/generate-header-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Video {
  title: string;
  url: string;
}

interface HeaderImage {
  url: string;
  source: 'youtube' | 'og_image' | 'fallback';
}

interface Venue {
  id: string;
  name: string;
  venue_type: string[];
  website: string;
  videos: Video[];
  headerImage?: HeaderImage;
}

interface VenueData {
  meta: any;
  venues: Venue[];
}

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
  'default': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
};

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Get YouTube thumbnail URL (try high quality first)
function getYouTubeThumbnail(videoId: string): string {
  // maxresdefault.jpg is 1280x720 but may not exist for all videos
  // hqdefault.jpg is 480x360 and always exists
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

    // Try different og:image selectors
    let ogImage = $('meta[property="og:image"]').attr('content') ||
                  $('meta[name="og:image"]').attr('content') ||
                  $('meta[property="twitter:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content');

    // If relative URL, make it absolute
    if (ogImage && !ogImage.startsWith('http')) {
      const baseUrl = new URL(url);
      ogImage = new URL(ogImage, baseUrl.origin).href;
    }

    return ogImage || null;
  } catch (error) {
    return null;
  }
}

// Get fallback image based on venue type
function getFallbackImage(venueTypes: string[]): string {
  for (const type of venueTypes) {
    if (FALLBACK_IMAGES[type]) {
      return FALLBACK_IMAGES[type];
    }
  }
  return FALLBACK_IMAGES['default'];
}

async function main() {
  console.log('🖼️  Generating header images for venues...\n');

  // Read venues JSON
  const dataPath = path.join(__dirname, '../src/data/venues.json');
  const data: VenueData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const stats = {
    youtube: 0,
    ogImage: 0,
    fallback: 0,
    total: data.venues.length,
  };

  // Process each venue
  for (let i = 0; i < data.venues.length; i++) {
    const venue = data.venues[i];
    const progress = `[${i + 1}/${data.venues.length}]`;

    // Strategy 1: YouTube thumbnail
    if (venue.videos && venue.videos.length > 0) {
      const videoId = extractVideoId(venue.videos[0].url);
      if (videoId) {
        venue.headerImage = {
          url: getYouTubeThumbnail(videoId),
          source: 'youtube',
        };
        stats.youtube++;
        console.log(`${progress} ✅ ${venue.name} - YouTube thumbnail`);
        continue;
      }
    }

    // Strategy 2: og:image from website
    console.log(`${progress} 🔍 ${venue.name} - Fetching og:image...`);
    const ogImage = await fetchOgImage(venue.website);

    if (ogImage) {
      venue.headerImage = {
        url: ogImage,
        source: 'og_image',
      };
      stats.ogImage++;
      console.log(`${progress} ✅ ${venue.name} - og:image found`);
      continue;
    }

    // Strategy 3: Fallback image by venue type
    venue.headerImage = {
      url: getFallbackImage(venue.venue_type),
      source: 'fallback',
    };
    stats.fallback++;
    console.log(`${progress} 📦 ${venue.name} - Using fallback (${venue.venue_type[0]})`);
  }

  // Write updated JSON
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   YouTube thumbnails: ${stats.youtube}`);
  console.log(`   og:image scraped:   ${stats.ogImage}`);
  console.log(`   Fallback images:    ${stats.fallback}`);
  console.log(`   Total venues:       ${stats.total}`);
  console.log('='.repeat(50));
  console.log('\n✅ Done! venues.json updated with header images.');
}

main().catch(console.error);
