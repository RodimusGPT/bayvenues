#!/usr/bin/env npx tsx
/**
 * Validate venue images - checks for broken links and fixes them
 *
 * Run: npx tsx scripts/validate-images.ts
 *
 * Options:
 *   --fix          Automatically fix broken images with Unsplash fallbacks
 *   --region X     Only check venues in region X
 *   --id X         Only check specific venue ID
 *   --dry-run      Show what would be done without making changes
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse command line args
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const dryRun = args.includes('--dry-run');
const regionIndex = args.indexOf('--region');
const region = regionIndex !== -1 ? args[regionIndex + 1] : undefined;
const idIndex = args.indexOf('--id');
const venueId = idIndex !== -1 ? args[idIndex + 1] : undefined;

// Reliable fallback images from Unsplash (wedding/venue themed)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600', // Wedding venue
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600', // Elegant venue
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600', // Resort pool
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600', // Bali temple
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc32?w=1600', // Bali rice terraces
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600', // Tropical resort
];

interface HeaderImage {
  url: string;
  source: string;
  description?: string;
}

/**
 * Validates a single image URL by making a HEAD request
 * Returns true if image is accessible, false otherwise
 */
async function validateImageUrl(url: string): Promise<{ valid: boolean; status?: number; error?: string }> {
  try {
    // Ensure URL is properly encoded
    const encodedUrl = encodeURI(decodeURI(url));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(encodedUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    clearTimeout(timeout);

    // Check if response is an image
    const contentType = response.headers.get('content-type') || '';
    const isImage = contentType.startsWith('image/') ||
                    response.ok && (url.includes('.jpg') || url.includes('.jpeg') ||
                                   url.includes('.png') || url.includes('.webp'));

    if (response.ok && isImage) {
      return { valid: true, status: response.status };
    }

    return { valid: false, status: response.status, error: `HTTP ${response.status}` };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { valid: false, error: errorMessage };
  }
}

/**
 * Ensures URL is properly encoded (spaces as %20, etc.)
 */
function ensureUrlEncoded(url: string): string {
  try {
    // First decode to handle any double-encoding, then re-encode
    const decoded = decodeURI(url);
    return encodeURI(decoded);
  } catch {
    // If decode fails, just encode as-is
    return encodeURI(url);
  }
}

/**
 * Gets a random fallback image
 */
function getFallbackImage(index: number = 0): HeaderImage {
  const url = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  return { url, source: 'unsplash' };
}

async function main() {
  console.log('🔍 Validating venue images...\n');

  if (dryRun) {
    console.log('🔧 DRY RUN - No changes will be made\n');
  }

  // Build query
  let query = supabase
    .from('venues')
    .select('id, name, region, header_images, header_image')
    .order('region')
    .order('name');

  if (region) {
    query = query.eq('region', region);
  }

  if (venueId) {
    query = query.eq('id', venueId);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('No venues found matching criteria');
    process.exit(0);
  }

  console.log(`📋 Checking ${venues.length} venues...\n`);

  let totalImages = 0;
  let brokenImages = 0;
  let fixedImages = 0;
  const brokenVenues: { id: string; name: string; brokenUrls: string[] }[] = [];

  for (const venue of venues) {
    const images = (venue.header_images as HeaderImage[] | null) || [];
    const venueBroken: string[] = [];
    let needsUpdate = false;
    const updatedImages: HeaderImage[] = [];

    process.stdout.write(`[${venue.region}] ${venue.name}: `);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      totalImages++;

      // First ensure URL is properly encoded
      const encodedUrl = ensureUrlEncoded(img.url);
      const urlChanged = encodedUrl !== img.url;

      const result = await validateImageUrl(encodedUrl);

      if (result.valid) {
        // URL works - use encoded version if it changed
        if (urlChanged) {
          updatedImages.push({ ...img, url: encodedUrl });
          needsUpdate = true;
        } else {
          updatedImages.push(img);
        }
        process.stdout.write('✓');
      } else {
        brokenImages++;
        venueBroken.push(img.url);
        process.stdout.write('✗');

        if (shouldFix) {
          // Replace with fallback
          const fallback = getFallbackImage(i);
          updatedImages.push(fallback);
          needsUpdate = true;
          fixedImages++;
        } else {
          updatedImages.push(img);
        }
      }
    }

    console.log(images.length === 0 ? ' (no images)' : '');

    if (venueBroken.length > 0) {
      brokenVenues.push({ id: venue.id, name: venue.name, brokenUrls: venueBroken });
    }

    // Update database if needed
    if (needsUpdate && !dryRun) {
      const { error: updateError } = await supabase
        .from('venues')
        .update({
          header_images: updatedImages,
          header_image: updatedImages[0] || null,
        })
        .eq('id', venue.id);

      if (updateError) {
        console.error(`   ❌ Update failed: ${updateError.message}`);
      }
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Total images checked:  ${totalImages}`);
  console.log(`   Broken images found:   ${brokenImages}`);
  if (shouldFix) {
    console.log(`   Images fixed:          ${fixedImages}`);
  }
  console.log(`   Venues with issues:    ${brokenVenues.length}`);
  console.log('='.repeat(60));

  if (brokenVenues.length > 0 && !shouldFix) {
    console.log('\n🔴 Venues with broken images:');
    for (const v of brokenVenues) {
      console.log(`\n   ${v.name} (${v.id}):`);
      for (const url of v.brokenUrls) {
        console.log(`      - ${url.substring(0, 80)}...`);
      }
    }
    console.log('\n💡 Run with --fix to replace broken images with fallbacks');
  }
}

main().catch(console.error);

// Export for use as a module
export { validateImageUrl, ensureUrlEncoded };
