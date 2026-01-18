#!/usr/bin/env npx tsx
/**
 * Audit venues for broken header images
 *
 * Checks for:
 * - Incomplete URLs (missing parameters, truncated)
 * - Non-image URLs (website homepages instead of images)
 * - URLs returning 404 or other errors
 * - URLs not returning image content-type
 *
 * Run: npx tsx scripts/audit-broken-images.ts
 *
 * Options:
 *   --fix       Attempt to fix broken images by fetching new ones
 *   --dry-run   Show what would be fixed without making changes
 *   --limit N   Only check first N venues
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

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse command line args
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const dryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;

interface HeaderImage {
  url: string;
  source: string;
  thumbnail?: string;
}

interface BrokenVenue {
  id: string;
  name: string;
  region: string;
  url: string;
  reason: string;
}

// Patterns that indicate a broken/invalid image URL
const BROKEN_URL_PATTERNS = [
  /\?id=$/, // Missing ID parameter
  /\?.*=$/, // Any empty query parameter at end
  /^https?:\/\/[^/]+\/?$/, // Just a domain with no path (homepage)
  /^https?:\/\/www\.[^/]+\/?$/, // www homepage
];

// Known non-image file extensions to flag
const NON_IMAGE_EXTENSIONS = ['.html', '.htm', '.php', '.aspx', '.jsp'];

function isUrlStructurallyBroken(url: string): string | null {
  // Check for broken patterns
  for (const pattern of BROKEN_URL_PATTERNS) {
    if (pattern.test(url)) {
      return 'Incomplete or homepage URL';
    }
  }

  // Check for non-image extensions
  const urlPath = new URL(url).pathname.toLowerCase();
  for (const ext of NON_IMAGE_EXTENSIONS) {
    if (urlPath.endsWith(ext)) {
      return `Non-image file extension: ${ext}`;
    }
  }

  return null;
}

async function checkImageUrl(url: string): Promise<{ valid: boolean; reason?: string }> {
  // First check structural issues
  const structuralIssue = isUrlStructurallyBroken(url);
  if (structuralIssue) {
    return { valid: false, reason: structuralIssue };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { valid: false, reason: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      // Some CDNs don't return proper content-type for HEAD, try GET
      const getResponse = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-100' },
      });
      const getContentType = getResponse.headers.get('content-type') || '';
      if (!getContentType.startsWith('image/') && !url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i)) {
        return { valid: false, reason: `Non-image content-type: ${contentType || getContentType}` };
      }
    }

    return { valid: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('abort')) {
      return { valid: false, reason: 'Timeout (10s)' };
    }
    return { valid: false, reason: message };
  }
}

async function searchNewImages(venueName: string, region: string): Promise<HeaderImage[] | null> {
  if (!SERPER_API_KEY) {
    return null;
  }

  try {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: `${venueName} ${region} wedding venue`,
        num: 10,
      }),
    });

    const data = await response.json();

    if (data.images && data.images.length > 0) {
      return data.images.slice(0, 5).map((img: { imageUrl: string; thumbnailUrl: string }) => ({
        url: img.imageUrl,
        thumbnail: img.thumbnailUrl,
        source: 'google',
      }));
    }

    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log('🔍 Auditing venue header images for broken links...\n');

  if (shouldFix && !SERPER_API_KEY) {
    console.warn('⚠️  --fix requires SERPER_API_KEY to fetch replacement images\n');
  }

  // Fetch all venues with header_images
  let query = supabase
    .from('venues')
    .select('id, name, region, header_images')
    .not('header_images', 'is', null);

  if (limit) {
    query = query.limit(limit);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('No venues with header images found.');
    process.exit(0);
  }

  console.log(`📋 Checking ${venues.length} venues...\n`);

  const brokenVenues: BrokenVenue[] = [];
  let checked = 0;
  let fixed = 0;

  for (const venue of venues) {
    checked++;
    const images = venue.header_images as HeaderImage[];

    if (!images || images.length === 0) continue;

    const firstImage = images[0];
    if (!firstImage?.url) continue;

    const progress = `[${checked}/${venues.length}]`;

    // Quick structural check first (no network)
    const structuralIssue = isUrlStructurallyBroken(firstImage.url);

    if (structuralIssue) {
      console.log(`${progress} ❌ ${venue.name}`);
      console.log(`       ${structuralIssue}`);
      console.log(`       URL: ${firstImage.url.substring(0, 80)}...`);

      brokenVenues.push({
        id: venue.id,
        name: venue.name,
        region: venue.region,
        url: firstImage.url,
        reason: structuralIssue,
      });

      // Attempt fix if requested
      if ((shouldFix || dryRun) && SERPER_API_KEY) {
        const newImages = await searchNewImages(venue.name, venue.region);
        if (newImages && newImages.length > 0) {
          if (dryRun) {
            console.log(`       🔧 Would replace with: ${newImages[0].url.substring(0, 60)}...`);
          } else {
            const { error: updateError } = await supabase
              .from('venues')
              .update({
                header_images: newImages,
                header_image: newImages[0]
              })
              .eq('id', venue.id);

            if (!updateError) {
              console.log(`       ✅ Fixed with ${newImages.length} new images`);
              fixed++;
            }
          }
        }
      }
      console.log('');
      continue;
    }

    // Full network check (slower, but thorough)
    const result = await checkImageUrl(firstImage.url);

    if (!result.valid) {
      console.log(`${progress} ❌ ${venue.name}`);
      console.log(`       ${result.reason}`);
      console.log(`       URL: ${firstImage.url.substring(0, 80)}${firstImage.url.length > 80 ? '...' : ''}`);

      brokenVenues.push({
        id: venue.id,
        name: venue.name,
        region: venue.region,
        url: firstImage.url,
        reason: result.reason || 'Unknown',
      });

      // Attempt fix if requested
      if ((shouldFix || dryRun) && SERPER_API_KEY) {
        const newImages = await searchNewImages(venue.name, venue.region);
        if (newImages && newImages.length > 0) {
          if (dryRun) {
            console.log(`       🔧 Would replace with: ${newImages[0].url.substring(0, 60)}...`);
          } else {
            const { error: updateError } = await supabase
              .from('venues')
              .update({
                header_images: newImages,
                header_image: newImages[0]
              })
              .eq('id', venue.id);

            if (!updateError) {
              console.log(`       ✅ Fixed with ${newImages.length} new images`);
              fixed++;
            }
          }
        }
      }
      console.log('');
    }

    // Small delay between network requests
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Audit Summary:');
  console.log(`   Total venues checked:  ${checked}`);
  console.log(`   Broken images found:   ${brokenVenues.length}`);
  if (shouldFix) {
    console.log(`   Images fixed:          ${fixed}`);
  }
  console.log('='.repeat(60));

  if (brokenVenues.length > 0) {
    console.log('\n📋 Broken venues by region:');
    const byRegion = brokenVenues.reduce((acc, v) => {
      acc[v.region] = acc[v.region] || [];
      acc[v.region].push(v);
      return acc;
    }, {} as Record<string, BrokenVenue[]>);

    Object.entries(byRegion)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([region, venues]) => {
        console.log(`\n   ${region} (${venues.length}):`);
        venues.forEach(v => {
          console.log(`     - ${v.name}: ${v.reason}`);
        });
      });

    if (!shouldFix && !dryRun) {
      console.log('\n💡 To fix these issues, run:');
      console.log('   npx tsx scripts/audit-broken-images.ts --fix');
      console.log('\n   Or preview fixes first:');
      console.log('   npx tsx scripts/audit-broken-images.ts --dry-run');
    }
  } else {
    console.log('\n✅ All venue images are valid!');
  }
}

main().catch(console.error);
