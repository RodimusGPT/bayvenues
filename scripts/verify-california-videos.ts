#!/usr/bin/env npx tsx
/**
 * Verify California venue YouTube videos
 *
 * Run: npx tsx scripts/verify-california-videos.ts
 *
 * Options:
 *   --dry-run       Show issues without updating
 *   --fix           Auto-fix invalid/mismatched videos
 *   --region X      Only process venues in region X
 *   --limit N       Only process N venues
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

// California regions
const CALIFORNIA_REGIONS = [
  'Carmel', 'Central Coast', 'East Bay', 'Lake Tahoe', 'Marin',
  'Mendocino', 'Monterey', 'Napa Valley', 'North Bay', 'Peninsula',
  'Sacramento', 'San Francisco', 'Santa Cruz', 'Sonoma', 'South Bay'
];

// Parse command line args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fixMode = args.includes('--fix');
const regionIndex = args.indexOf('--region');
const region = regionIndex !== -1 ? args[regionIndex + 1] : undefined;
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;

const DELAY_MS = 500; // Rate limiting

interface VideoEntry {
  url: string;
  title: string;
}

interface VenueWithVideos {
  id: string;
  name: string;
  region: string;
  videos: VideoEntry[] | null;
}

interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  thumbnail_url: string;
}


async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract YouTube video ID from URL
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Check if a YouTube video exists and is public using oEmbed API
 */
async function verifyYouTubeVideo(videoUrl: string): Promise<{ valid: boolean; title?: string; error?: string }> {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    return { valid: false, error: 'Invalid YouTube URL' };
  }

  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  try {
    const response = await fetch(oembedUrl);

    if (response.status === 404 || response.status === 401) {
      return { valid: false, error: 'Video not found or private' };
    }

    if (!response.ok) {
      return { valid: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json() as YouTubeOEmbedResponse;
    return { valid: true, title: data.title };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
}

/**
 * Check if video title is relevant to venue name
 */
function isVideoRelevant(videoTitle: string, venueName: string): boolean {
  const normalizedTitle = videoTitle.toLowerCase();
  const normalizedVenue = venueName.toLowerCase();

  // Check if venue name appears in video title
  if (normalizedTitle.includes(normalizedVenue)) return true;

  // Check for significant words from venue name (3+ chars)
  const venueWords = normalizedVenue.split(/\s+/).filter(w => w.length >= 3);
  const matchedWords = venueWords.filter(word => normalizedTitle.includes(word));

  // At least 50% of significant words should match, or at least 2 words
  return matchedWords.length >= Math.min(2, Math.ceil(venueWords.length * 0.5));
}

/**
 * Search for a wedding video for a venue using YouTube search page scraping
 */
async function searchYouTubeVideo(venueName: string, region: string): Promise<VideoEntry | null> {
  const query = `${venueName} ${region} wedding`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      console.error(`     YouTube search error: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract video IDs from the YouTube search results page
    // Look for patterns like "videoId":"VIDEO_ID" or /watch?v=VIDEO_ID
    const videoIdMatches = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/g);

    if (!videoIdMatches || videoIdMatches.length === 0) {
      return null;
    }

    // Get unique video IDs
    const videoIds = [...new Set(videoIdMatches.map(m => m.match(/"videoId":"([a-zA-Z0-9_-]{11})"/)?.[1]).filter(Boolean))] as string[];

    // Try each video until we find a valid one
    for (const videoId of videoIds.slice(0, 5)) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const verification = await verifyYouTubeVideo(videoUrl);

      if (verification.valid && verification.title) {
        // Check if video is somewhat relevant (has wedding-related content)
        const titleLower = verification.title.toLowerCase();
        const venueWords = venueName.toLowerCase().split(/\s+/).filter(w => w.length >= 3);
        const hasVenueWord = venueWords.some(word => titleLower.includes(word));
        const hasWeddingWord = titleLower.includes('wedding') || titleLower.includes('bride') || titleLower.includes('ceremony');

        if (hasVenueWord || hasWeddingWord) {
          return {
            url: videoUrl,
            title: verification.title,
          };
        }
      }

      await sleep(200); // Rate limit
    }

    return null;
  } catch (error) {
    console.error(`     Search error:`, (error as Error).message);
    return null;
  }
}

async function main() {
  console.log('🎬 Verifying California venue YouTube videos\n');

  if (dryRun) {
    console.log('   Mode: DRY RUN (no changes will be made)\n');
  } else if (fixMode) {
    console.log('   Mode: FIX (will update invalid/mismatched videos)\n');
  } else {
    console.log('   Mode: REPORT ONLY (use --fix to update)\n');
  }

  const targetRegions = region ? [region] : CALIFORNIA_REGIONS;
  const regionList = targetRegions.map(r => `'${r}'`).join(',');
  const limitClause = limit ? `LIMIT ${limit}` : '';

  // Fetch venues with videos
  const { data: venues, error } = await supabase
    .from('venues')
    .select('id, name, region, videos')
    .in('region', targetRegions)
    .not('videos', 'is', null)
    .order('region')
    .order('name');

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  let venuesToProcess = venues as VenueWithVideos[];
  if (limit) {
    venuesToProcess = venuesToProcess.slice(0, limit);
  }

  if (!venuesToProcess || venuesToProcess.length === 0) {
    console.log('✅ No venues found to verify');
    process.exit(0);
  }

  console.log(`📋 Found ${venuesToProcess.length} California venues with videos to verify`);
  if (region) console.log(`   Filtered to region: ${region}`);
  console.log('');

  let verified = 0;
  let invalid = 0;
  let irrelevant = 0;
  let fixed = 0;
  let noReplacement = 0;

  const issues: { venue: string; region: string; issue: string; oldVideo?: string; newVideo?: string }[] = [];

  for (let i = 0; i < venuesToProcess.length; i++) {
    const venue = venuesToProcess[i];
    const progress = `[${i + 1}/${venuesToProcess.length}]`;

    if (!venue.videos || venue.videos.length === 0) {
      console.log(`${progress} ${venue.name} - ⚠️ No videos`);
      continue;
    }

    const video = venue.videos[0]; // Check first video
    process.stdout.write(`${progress} ${venue.name} (${venue.region})... `);

    // Verify video exists
    const verification = await verifyYouTubeVideo(video.url);

    if (!verification.valid) {
      console.log(`❌ INVALID - ${verification.error}`);
      console.log(`     URL: ${video.url}`);
      invalid++;

      if (fixMode && !dryRun) {
        // Search for replacement
        await sleep(DELAY_MS);
        const newVideo = await searchYouTubeVideo(venue.name, venue.region);

        if (newVideo) {
          const { error: updateError } = await supabase
            .from('venues')
            .update({ videos: [newVideo] })
            .eq('id', venue.id);

          if (updateError) {
            console.log(`     ❌ Update failed: ${updateError.message}`);
            noReplacement++;
          } else {
            console.log(`     ✅ FIXED - Replaced with: ${newVideo.title}`);
            fixed++;
            issues.push({ venue: venue.name, region: venue.region, issue: 'Invalid video replaced', oldVideo: video.url, newVideo: newVideo.url });
          }
        } else {
          console.log(`     ⚠️ No replacement found`);
          noReplacement++;
          issues.push({ venue: venue.name, region: venue.region, issue: 'Invalid - no replacement found', oldVideo: video.url });
        }
      } else {
        issues.push({ venue: venue.name, region: venue.region, issue: verification.error || 'Invalid', oldVideo: video.url });
      }
    } else if (!isVideoRelevant(verification.title || '', venue.name)) {
      console.log(`⚠️ POSSIBLY WRONG`);
      console.log(`     Video: "${verification.title}"`);
      console.log(`     Venue: "${venue.name}"`);
      irrelevant++;

      if (fixMode && !dryRun) {
        // Search for better video
        await sleep(DELAY_MS);
        const newVideo = await searchYouTubeVideo(venue.name, venue.region);

        if (newVideo && isVideoRelevant(newVideo.title, venue.name)) {
          const { error: updateError } = await supabase
            .from('venues')
            .update({ videos: [newVideo] })
            .eq('id', venue.id);

          if (updateError) {
            console.log(`     ❌ Update failed: ${updateError.message}`);
          } else {
            console.log(`     ✅ FIXED - Replaced with: ${newVideo.title}`);
            fixed++;
            issues.push({ venue: venue.name, region: venue.region, issue: 'Wrong video replaced', oldVideo: video.url, newVideo: newVideo.url });
          }
        } else {
          console.log(`     ⚠️ No better video found, keeping current`);
          issues.push({ venue: venue.name, region: venue.region, issue: 'Possibly wrong - no better match', oldVideo: video.url });
        }
      } else {
        issues.push({ venue: venue.name, region: venue.region, issue: 'Possibly wrong video', oldVideo: video.url });
      }
    } else {
      console.log(`✅ OK`);
      verified++;
    }

    await sleep(DELAY_MS);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`   Total venues checked:    ${venuesToProcess.length}`);
  console.log(`   Videos verified OK:      ${verified}`);
  console.log(`   Invalid videos:          ${invalid}`);
  console.log(`   Possibly wrong videos:   ${irrelevant}`);
  if (fixMode) {
    console.log(`   Fixed:                   ${fixed}`);
    console.log(`   Could not fix:           ${noReplacement}`);
  }

  if (issues.length > 0 && !fixMode) {
    console.log('\n📍 ISSUES FOUND:');
    console.log('-'.repeat(60));

    for (const issue of issues) {
      console.log(`\n  ${issue.venue} (${issue.region}):`);
      console.log(`    Issue: ${issue.issue}`);
      if (issue.oldVideo) console.log(`    URL: ${issue.oldVideo}`);
    }

    console.log('\n💡 Run with --fix to update invalid/wrong videos');
  }

  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
