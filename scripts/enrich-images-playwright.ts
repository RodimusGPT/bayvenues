#!/usr/bin/env npx tsx
/**
 * Enrich venues with header images using Playwright
 * Scrapes Google Images directly - no API key needed
 *
 * Run: npx tsx scripts/enrich-images-playwright.ts
 *
 * Options:
 *   --limit N      Only process first N venues
 *   --dry-run      Show what would be done without making changes
 *   --region X     Only process venues in region X
 *
 * Requirements:
 *   npx playwright install chromium
 */

import { chromium, Browser, Page } from 'playwright';
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
const dryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;
const regionIndex = args.indexOf('--region');
const region = regionIndex !== -1 ? args[regionIndex + 1] : undefined;

const IMAGES_PER_VENUE = 5;
const DELAY_MS = 2500; // Be respectful to Google

interface HeaderImage {
  url: string;
  source: string;
  thumbnail?: string;
}

async function searchGoogleImages(page: Page, query: string): Promise<HeaderImage[]> {
  try {
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for images to load
    await page.waitForSelector('img[data-src], img[src*="encrypted"]', { timeout: 10000 }).catch(() => null);

    // Give a moment for lazy loading
    await page.waitForTimeout(1500);

    // Extract image URLs from Google Images results
    const images = await page.evaluate((maxImages: number) => {
      const results: { url: string; thumbnail: string }[] = [];

      // Google Images uses various selectors - try multiple approaches
      // Method 1: Look for data-src attributes (lazy loaded images)
      const imgElements = document.querySelectorAll('img[data-src]');
      imgElements.forEach((img) => {
        const src = img.getAttribute('data-src');
        if (src && src.startsWith('http') && !src.includes('google.com/images') && results.length < maxImages) {
          results.push({ url: src, thumbnail: src });
        }
      });

      // Method 2: Look for encrypted-tbn images (Google's thumbnail proxy)
      if (results.length < maxImages) {
        const encryptedImgs = document.querySelectorAll('img[src*="encrypted-tbn"]');
        encryptedImgs.forEach((img) => {
          const src = img.getAttribute('src');
          if (src && results.length < maxImages) {
            // These are thumbnails but can work as fallback
            results.push({ url: src, thumbnail: src });
          }
        });
      }

      // Method 3: Click on first image to get full-size URL
      // This is handled separately below

      return results;
    }, IMAGES_PER_VENUE * 2);

    // If we didn't get enough images, try clicking on thumbnails to get full URLs
    if (images.length < IMAGES_PER_VENUE) {
      try {
        // Click on the first few image results to reveal full-size URLs
        const thumbnails = await page.$$('div[data-ri] img, g-img img');

        for (let i = 0; i < Math.min(thumbnails.length, IMAGES_PER_VENUE); i++) {
          try {
            await thumbnails[i].click();
            await page.waitForTimeout(500);

            // Look for the full-size image in the side panel
            const fullSizeImg = await page.$('img[src*="http"][style*="max-width"], c-wiz img[src^="http"]');
            if (fullSizeImg) {
              const src = await fullSizeImg.getAttribute('src');
              if (src && src.startsWith('http') && !src.includes('google.com')) {
                images.push({ url: src, thumbnail: src });
              }
            }
          } catch {
            // Continue to next thumbnail
          }
        }
      } catch {
        // Fallback approach didn't work
      }
    }

    // Filter and dedupe
    const seen = new Set<string>();
    const uniqueImages: HeaderImage[] = [];

    for (const img of images) {
      if (!seen.has(img.url) && uniqueImages.length < IMAGES_PER_VENUE) {
        seen.add(img.url);
        uniqueImages.push({
          url: img.url,
          thumbnail: img.thumbnail,
          source: 'google',
        });
      }
    }

    return uniqueImages;
  } catch (error) {
    console.error(`   Search error: ${(error as Error).message}`);
    return [];
  }
}

async function main() {
  console.log('🖼️  Enriching venues with Google Images via Playwright\n');

  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made\n');
  }

  // Build query for venues with < 3 images
  let query = supabase
    .from('venues')
    .select('id, name, region, header_images')
    .order('region')
    .order('name');

  if (region) {
    query = query.eq('region', region);
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

  console.log(`📋 Found ${lowImageVenues.length} venues with fewer than 3 images`);
  if (region) console.log(`   Filtered to region: ${region}`);

  // Apply limit
  const batch = limit ? lowImageVenues.slice(0, limit) : lowImageVenues;
  console.log(`   Processing: ${batch.length} venues\n`);

  // Launch browser
  console.log('🌐 Launching browser...\n');
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page: Page = await context.newPage();

  let enriched = 0;
  let noImages = 0;
  let errors = 0;

  try {
    for (let i = 0; i < batch.length; i++) {
      const venue = batch[i];
      const progress = `[${i + 1}/${batch.length}]`;
      const currentImages = (venue.header_images as HeaderImage[] | null) || [];
      const query = `${venue.name} ${venue.region} wedding venue`;

      console.log(`${progress} ${venue.name} (${venue.region})`);
      console.log(`       Current images: ${currentImages.length}`);
      console.log(`       Searching: "${query}"`);

      if (dryRun) {
        console.log(`       🔧 Would fetch ${IMAGES_PER_VENUE} images\n`);
        continue;
      }

      const newImages = await searchGoogleImages(page, query);

      if (newImages.length === 0) {
        console.log(`       ⚠️  No images found`);
        noImages++;
      } else {
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
          console.log(`       ✅ Added ${newImages.length} images`);
          enriched++;
        }
      }

      console.log('');

      // Delay between searches
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  } finally {
    await browser.close();
  }

  // Summary
  console.log('='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Venues enriched:     ${enriched}`);
  console.log(`   No images found:     ${noImages}`);
  console.log(`   Errors:              ${errors}`);
  console.log(`   Total processed:     ${batch.length}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
