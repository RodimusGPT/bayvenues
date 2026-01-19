#!/usr/bin/env npx tsx
/**
 * Enrich remaining venues with YouTube videos using simpler search queries
 * Tries multiple search strategies for venues that failed the first pass
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

const VIDEOS_PER_VENUE = 3;
const DELAY_MS = 2500;

interface VideoResult {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

async function searchYouTube(page: Page, query: string): Promise<VideoResult[]> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Wait for results
    await page.waitForSelector('ytd-video-renderer', { timeout: 8000 }).catch(() => null);

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

    return videos.slice(0, VIDEOS_PER_VENUE);
  } catch {
    return [];
  }
}

// Generate multiple search queries to try
function getSearchQueries(name: string, region: string): string[] {
  return [
    `${name}`,                              // Just venue name
    `${name} venue`,                        // Venue name + venue
    `${name} event`,                        // Venue name + event
    `${name} ${region}`,                    // Venue + region
  ];
}

async function main() {
  console.log('🎬 Enriching remaining venues with alternate search strategies\n');

  // Get venues without videos
  const { data: venues, error } = await supabase
    .from('venues')
    .select('id, name, region')
    .or('videos.is.null,videos.eq.[]')
    .order('name');

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('✅ All venues already have videos!');
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} venues without videos\n`);

  // Launch browser
  console.log('🌐 Launching browser...\n');
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });
  const page: Page = await context.newPage();

  let updated = 0;
  let noVideos = 0;

  try {
    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      const progress = `[${i + 1}/${venues.length}]`;
      const queries = getSearchQueries(venue.name, venue.region);

      console.log(`${progress} ${venue.name}`);

      let videos: VideoResult[] = [];

      // Try each query until we find videos
      for (const query of queries) {
        console.log(`   Trying: "${query}"`);
        videos = await searchYouTube(page, query);

        if (videos.length > 0) {
          break;
        }
        await new Promise(r => setTimeout(r, 1000));
      }

      if (videos.length > 0) {
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            videos: videos.map(v => ({ title: v.title, url: v.url })),
          })
          .eq('id', venue.id);

        if (!updateError) {
          console.log(`   ✅ Found ${videos.length} videos\n`);
          updated++;
        }
      } else {
        console.log(`   ❌ No videos found with any query\n`);
        noVideos++;
      }

      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  } finally {
    await browser.close();
  }

  console.log('='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Updated with videos: ${updated}`);
  console.log(`   No videos found:     ${noVideos}`);
  console.log(`   Total processed:     ${venues.length}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
