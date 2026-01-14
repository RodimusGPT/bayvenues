/**
 * Add Google Images search URLs and YouTube search capability to European venues
 *
 * Run: npx tsx scripts/add-european-media.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Venue {
  id: string;
  name: string;
  region: string;
  country?: string;
  photos: {
    instagram?: string;
    google?: string;
  };
  videos?: Array<{ title: string; url: string }>;
  [key: string]: any;
}

interface VenueData {
  meta: any;
  venues: Venue[];
}

// Bay Area regions (USA)
const US_REGIONS = ['North Bay', 'Peninsula', 'South Bay', 'Monterey', 'Santa Cruz', 'Carmel'];

function isEuropeanVenue(venue: Venue): boolean {
  return !US_REGIONS.includes(venue.region);
}

function generateGoogleImagesUrl(venueName: string, region: string): string {
  const searchQuery = `${venueName} ${region} wedding venue`;
  return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`;
}

function generateYouTubeSearchUrl(venueName: string, region: string): string {
  const searchQuery = `${venueName} ${region} wedding`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
}

async function main() {
  console.log('🎬 Adding media links to European venues...\n');

  // Read venues JSON
  const dataPath = path.join(__dirname, '../src/data/venues.json');
  const data: VenueData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const stats = {
    googleAdded: 0,
    youtubeAdded: 0,
    totalEuropean: 0,
  };

  // Process each venue
  for (const venue of data.venues) {
    if (!isEuropeanVenue(venue)) continue;

    stats.totalEuropean++;

    // Add Google Images search URL if missing
    if (!venue.photos.google) {
      venue.photos.google = generateGoogleImagesUrl(venue.name, venue.region);
      stats.googleAdded++;
    }

    // Add YouTube search as a placeholder video if no videos exist
    if (!venue.videos || venue.videos.length === 0) {
      // We'll store the search URL in a special format that the UI can detect
      venue.youtubeSearch = generateYouTubeSearchUrl(venue.name, venue.region);
      stats.youtubeAdded++;
    }

    console.log(`✅ ${venue.name} (${venue.region})`);
  }

  // Write updated JSON
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   European venues:     ${stats.totalEuropean}`);
  console.log(`   Google Images added: ${stats.googleAdded}`);
  console.log(`   YouTube search added: ${stats.youtubeAdded}`);
  console.log('='.repeat(50));
  console.log('\n✅ Done! venues.json updated.');
}

main().catch(console.error);
