#!/usr/bin/env node
/**
 * Enrich venues with YouTube wedding videos
 *
 * Usage:
 *   node scripts/enrich-youtube-videos.mjs
 *   node scripts/enrich-youtube-videos.mjs --limit 10
 *   node scripts/enrich-youtube-videos.mjs --dry-run
 *   node scripts/enrich-youtube-videos.mjs --region "Tuscany"
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env file
const envPath = resolve(__dirname, '../.env');
let envVars = {};
try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (e) {
  // .env not found
}

// Also try .env.local
try {
  const envLocalContent = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
  envLocalContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (e) {
  // .env.local not found
}

// Get API keys
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
  || process.env.VITE_GOOGLE_MAPS_API_KEY
  || envVars.YOUTUBE_API_KEY
  || envVars.VITE_GOOGLE_MAPS_API_KEY;

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
  || envVars.VITE_SUPABASE_URL
  || 'https://zcriusmtfknqgvxrllwa.supabase.co';

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!YOUTUBE_API_KEY) {
  console.error('Error: No YouTube API key found');
  console.error('Set YOUTUBE_API_KEY or VITE_GOOGLE_MAPS_API_KEY in .env');
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY not found');
  console.error('Add it to .env.local file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Parse arguments
const args = process.argv.slice(2);
let limit = 50;
let dryRun = false;
let region = null;
let country = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) {
    limit = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--dry-run') {
    dryRun = true;
  } else if (args[i] === '--region' && args[i + 1]) {
    region = args[i + 1];
    i++;
  } else if (args[i] === '--country' && args[i + 1]) {
    country = args[i + 1];
    i++;
  }
}

// Search YouTube
async function searchYouTube(query, maxResults = 5) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', maxResults.toString());
  url.searchParams.set('order', 'relevance');
  url.searchParams.set('key', YOUTUBE_API_KEY);

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item, index) => ({
    rank: index + 1,
    videoId: item.id.videoId,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    title: item.snippet.title,
    description: item.snippet.description,
    channel: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnail: `https://img.youtube.com/vi/${item.id.videoId}/maxresdefault.jpg`
  }));
}

// Evaluate if video is relevant to venue
function evaluateVideo(video, venueName, venueRegion) {
  const title = video.title.toLowerCase();
  const desc = video.description.toLowerCase();
  const venueNameLower = venueName.toLowerCase();
  const regionLower = venueRegion.toLowerCase();

  // Check for venue name in title (most important)
  const hasVenueName = title.includes(venueNameLower) ||
    venueNameLower.split(' ').filter(w => w.length > 3).every(word => title.includes(word));

  // Check for wedding content
  const hasWeddingContent = title.includes('wedding') ||
    title.includes('matrimonio') ||
    desc.includes('wedding') ||
    title.includes('nozze');

  // Check for location
  const hasLocation = title.includes(regionLower) || desc.includes(regionLower);

  // Red flags
  const isTravel = title.includes('travel') || title.includes('tour') || title.includes('guide');
  const isCompilation = title.includes('top 10') || title.includes('best venues');

  if (isTravel || isCompilation) return { relevant: false, reason: 'Travel/compilation video' };
  if (!hasVenueName) return { relevant: false, reason: 'Venue name not in title' };
  if (!hasWeddingContent) return { relevant: false, reason: 'Not wedding content' };

  return {
    relevant: true,
    reason: `Venue name: ${hasVenueName ? 'YES' : 'partial'}, Wedding: YES, Location: ${hasLocation ? 'YES' : 'unclear'}`,
    score: (hasVenueName ? 3 : 1) + (hasWeddingContent ? 2 : 0) + (hasLocation ? 1 : 0)
  };
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log(' ENRICH VIDEOS - Processing venues without videos');
  console.log('════════════════════════════════════════════════════════════════\n');

  console.log(`YouTube API: ✓ Configured`);
  console.log(`Mode: ${dryRun ? 'DRY RUN (no updates)' : 'LIVE'}`);
  if (region) console.log(`Region filter: ${region}`);
  if (country) console.log(`Country filter: ${country}`);
  console.log(`Limit: ${limit}\n`);

  // Build query
  let query = supabase
    .from('venues')
    .select('id, name, region, subregion, youtube_search')
    .or('videos.is.null,videos.eq.[]')
    .order('region')
    .order('name')
    .limit(limit);

  if (region) {
    query = query.eq('region', region);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('Error fetching venues:', error.message);
    process.exit(1);
  }

  console.log(`Found ${venues.length} venues without videos\n`);

  if (venues.length === 0) {
    console.log('No venues need video enrichment!');
    return;
  }

  let updated = 0;
  let noVideoFound = 0;
  let errors = 0;
  const noVideoList = [];

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`[${i + 1}/${venues.length}] ${venue.name} (${venue.region})`);
    console.log('────────────────────────────────────────────────────────────────');

    const searchQuery = `${venue.name} ${venue.subregion || venue.region} wedding`;
    console.log(`  Search: "${searchQuery}"`);

    try {
      const results = await searchYouTube(searchQuery);

      if (results.length === 0) {
        console.log('  ✗ No YouTube results found');
        noVideoFound++;
        noVideoList.push({ id: venue.id, name: venue.name, region: venue.region });
        continue;
      }

      // Evaluate each result
      let selectedVideo = null;
      for (const video of results) {
        const evaluation = evaluateVideo(video, venue.name, venue.region);
        console.log(`\n  Candidate ${video.rank}: "${video.title.substring(0, 60)}..."`);
        console.log(`    Channel: ${video.channel}`);

        if (evaluation.relevant) {
          console.log(`    ✓ ${evaluation.reason}`);
          console.log('    → SELECTED');
          selectedVideo = video;
          break;
        } else {
          console.log(`    ✗ ${evaluation.reason} → SKIP`);
        }
      }

      if (selectedVideo) {
        if (dryRun) {
          console.log(`\n  [DRY RUN] Would update with: "${selectedVideo.title}"`);
          console.log(`    URL: ${selectedVideo.url}`);
        } else {
          // Update the venue
          const { error: updateError } = await supabase
            .from('venues')
            .update({
              videos: [{ title: selectedVideo.title, url: selectedVideo.url }],
              youtube_search: searchQuery,
              // Set header_image if not set
              ...(venue.header_image ? {} : {
                header_image: { url: selectedVideo.thumbnail, source: 'youtube' }
              })
            })
            .eq('id', venue.id);

          if (updateError) {
            console.log(`\n  ✗ Update failed: ${updateError.message}`);
            errors++;
          } else {
            console.log(`\n  ✓ Updated with: "${selectedVideo.title}"`);
            console.log(`    URL: ${selectedVideo.url}`);
            updated++;
          }
        }
      } else {
        console.log('\n  ✗ No relevant video found');
        noVideoFound++;
        noVideoList.push({ id: venue.id, name: venue.name, region: venue.region });
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (err) {
      console.log(`\n  ✗ Error: ${err.message}`);
      errors++;

      if (err.message.includes('quota')) {
        console.log('\n⚠️  YouTube API quota exceeded. Try again tomorrow.');
        break;
      }
    }
  }

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(' COMPLETE');
  console.log(`   Processed: ${venues.length} venues`);
  console.log(`   Videos added: ${updated}`);
  console.log(`   No video found: ${noVideoFound}`);
  console.log(`   Errors: ${errors}`);
  console.log('════════════════════════════════════════════════════════════════\n');

  if (noVideoList.length > 0) {
    console.log('Venues without videos (for manual review):');
    noVideoList.forEach(v => console.log(`  - ${v.name} (${v.id}) - ${v.region}`));
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
