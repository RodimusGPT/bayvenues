const fs = require('fs');
const path = require('path');

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error('Error: YOUTUBE_API_KEY environment variable is required');
  console.error('Set it with: export YOUTUBE_API_KEY=your_key_here');
  process.exit(1);
}
const VENUES_PATH = path.join(__dirname, '../src/data/venues.json');
const BATCH_SIZE = 50; // Process 50 at a time to stay within quota

async function searchYouTube(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    console.error('API Error:', data.error.message);
    return null;
  }

  if (data.items && data.items.length > 0) {
    const video = data.items[0];
    return {
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url
    };
  }

  return null;
}

async function main() {
  // Read venues data
  const data = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf8'));

  // Find venues without videos
  const venuesNeedingVideos = data.venues.filter(v => !v.videos || v.videos.length === 0);

  console.log(`Total venues: ${data.venues.length}`);
  console.log(`Venues needing videos: ${venuesNeedingVideos.length}`);

  // Get batch to process (use command line arg or default to first batch)
  const startIndex = parseInt(process.argv[2]) || 0;
  const batch = venuesNeedingVideos.slice(startIndex, startIndex + BATCH_SIZE);

  console.log(`\nProcessing batch: ${startIndex} to ${startIndex + batch.length - 1}`);
  console.log(`This will use ~${batch.length * 100} quota units\n`);

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < batch.length; i++) {
    const venue = batch[i];
    const query = `${venue.name} wedding`;

    console.log(`[${startIndex + i + 1}/${venuesNeedingVideos.length}] Searching: ${query}`);

    try {
      const result = await searchYouTube(query);

      if (result) {
        // Find venue in original data and update
        const venueIndex = data.venues.findIndex(v => v.id === venue.id);
        if (venueIndex !== -1) {
          data.venues[venueIndex].videos = [{
            title: result.title,
            url: `https://www.youtube.com/watch?v=${result.videoId}`
          }];

          // Also set header image from YouTube if none exists
          if (!data.venues[venueIndex].headerImage) {
            data.venues[venueIndex].headerImage = {
              url: `https://img.youtube.com/vi/${result.videoId}/hqdefault.jpg`,
              source: 'youtube'
            };
          }

          console.log(`  ✓ Found: ${result.title.substring(0, 50)}...`);
          updated++;
        }
      } else {
        console.log(`  ✗ No results found`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      errors++;
    }
  }

  // Save updated data
  fs.writeFileSync(VENUES_PATH, JSON.stringify(data, null, 2));

  console.log(`\n--- Summary ---`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log(`Next batch: node scripts/fetch-youtube-videos.js ${startIndex + BATCH_SIZE}`);
}

main().catch(console.error);
