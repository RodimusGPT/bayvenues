#!/usr/bin/env npx tsx
/**
 * Enrich venues with YouTube videos using Playwright
 * Searches YouTube and extracts video IDs without needing API keys
 *
 * Run: npx tsx scripts/enrich-youtube-playwright.ts
 *
 * Requirements:
 * - npx playwright install chromium
 */

import { chromium, Browser, Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_SIZE = 20;
const VIDEOS_PER_VENUE = 3;
const DELAY_MS = 2000; // Be respectful to YouTube

interface VideoResult {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

async function searchYouTube(page: Page, query: string): Promise<VideoResult[]> {
  try {
    // Navigate to YouTube search
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for results to load
    await page.waitForSelector('ytd-video-renderer', { timeout: 10000 }).catch(() => null);

    // Extract video data from search results
    const videos = await page.evaluate((maxVideos: number) => {
      const results: { id: string; title: string; url: string; thumbnail: string }[] = [];
      const videoElements = document.querySelectorAll('ytd-video-renderer');

      for (let i = 0; i < Math.min(videoElements.length, maxVideos); i++) {
        const el = videoElements[i];
        const linkEl = el.querySelector('a#video-title') as HTMLAnchorElement;
        const titleEl = el.querySelector('#video-title');

        if (linkEl && titleEl) {
          const href = linkEl.href;
          const videoIdMatch = href.match(/[?&]v=([a-zA-Z0-9_-]{11})/);

          if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            results.push({
              id: videoId,
              title: titleEl.textContent?.trim() || '',
              url: `https://www.youtube.com/watch?v=${videoId}`,
              thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            });
          }
        }
      }

      return results;
    }, VIDEOS_PER_VENUE * 2);

    // Filter to top results
    return videos.slice(0, VIDEOS_PER_VENUE);
  } catch (error) {
    console.error(`   Search error: ${(error as Error).message}`);
    return [];
  }
}

async function main() {
  console.log('🎬 Enriching venues with YouTube videos via Playwright\n');

  // Get venues without videos
  const { data: venues, error } = await supabase
    .from('venues')
    .select('id, name, region')
    .or('videos.is.null,videos.eq.[]')
    .order('name')
    .limit(500);

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('✅ All venues already have videos!');
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} venues without videos\n`);

  // Get batch start from command line
  const startIndex = parseInt(process.argv[2]) || 0;
  const batch = venues.slice(startIndex, startIndex + BATCH_SIZE);

  console.log(`Processing batch: ${startIndex} to ${startIndex + batch.length - 1}\n`);

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page: Page = await context.newPage();

  let updated = 0;
  let noVideos = 0;
  let errors = 0;

  try {
    for (let i = 0; i < batch.length; i++) {
      const venue = batch[i];
      const query = `${venue.name} ${venue.region} wedding venue`;
      const progress = `[${startIndex + i + 1}/${venues.length}]`;

      console.log(`${progress} Searching: ${venue.name}`);

      const videos = await searchYouTube(page, query);

      if (videos.length > 0) {
        // Update videos column
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            videos: videos.map(v => ({ title: v.title, url: v.url })),
          })
          .eq('id', venue.id);

        if (updateError) {
          console.log(`   ❌ Update error: ${updateError.message}`);
          errors++;
        } else {
          console.log(`   ✅ Found ${videos.length} videos`);
          updated++;

          // Also update header_images with thumbnails if empty
          const { data: venueData } = await supabase
            .from('venues')
            .select('header_images')
            .eq('id', venue.id)
            .single();

          if (!venueData?.header_images || venueData.header_images.length === 0) {
            await supabase
              .from('venues')
              .update({
                header_images: videos.map(v => ({
                  url: v.thumbnail,
                  source: 'youtube',
                })),
              })
              .eq('id', venue.id);
            console.log(`   📸 Also added ${videos.length} thumbnail images`);
          }
        }
      } else {
        console.log(`   ⚠️  No videos found`);
        noVideos++;
      }

      // Delay between searches
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Updated with videos: ${updated}`);
  console.log(`   No videos found:     ${noVideos}`);
  console.log(`   Errors:              ${errors}`);
  console.log(`   Total processed:     ${batch.length}`);
  console.log('='.repeat(50));

  if (startIndex + BATCH_SIZE < venues.length) {
    console.log(`\n➡️  Next batch: npx tsx scripts/enrich-youtube-playwright.ts ${startIndex + BATCH_SIZE}`);
  } else {
    console.log('\n✅ All venues processed!');
  }
}

main().catch(console.error);
