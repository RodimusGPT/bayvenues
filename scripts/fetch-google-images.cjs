const fs = require('fs');
const path = require('path');

// Serper API for Google Image Search
// Get your API key at https://serper.dev
const SERPER_API_KEY = process.env.SERPER_API_KEY;
if (!SERPER_API_KEY) {
  console.error('Error: SERPER_API_KEY environment variable is required');
  console.error('Get your API key at https://serper.dev');
  console.error('Set it with: export SERPER_API_KEY=your_key_here');
  process.exit(1);
}

const VENUES_PATH = path.join(__dirname, '../src/data/venues.json');
const BATCH_SIZE = 50; // Serper has 2,500 free queries
const IMAGES_PER_VENUE = 5;

async function searchImages(query) {
  const response = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: query,
      num: IMAGES_PER_VENUE * 2 // Request more to filter
    })
  });

  const data = await response.json();

  if (data.error) {
    console.error('API Error:', data.error);
    return null;
  }

  if (data.images && data.images.length > 0) {
    // Filter and take top images
    return data.images
      .slice(0, IMAGES_PER_VENUE)
      .map(img => ({
        url: img.imageUrl,
        thumbnail: img.thumbnailUrl,
        source: 'google'
      }));
  }

  return [];
}

async function main() {
  // Read venues data
  const data = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf8'));

  // Find venues without images or with fewer than 3 images
  const venuesNeedingImages = data.venues.filter(v =>
    !v.headerImages || v.headerImages.length < 3
  );

  console.log(`Total venues: ${data.venues.length}`);
  console.log(`Venues needing images: ${venuesNeedingImages.length}`);

  // Get batch to process
  const startIndex = parseInt(process.argv[2]) || 0;
  const batch = venuesNeedingImages.slice(startIndex, startIndex + BATCH_SIZE);

  console.log(`\nProcessing batch: ${startIndex} to ${startIndex + batch.length - 1}`);
  console.log(`This will use ~${batch.length} queries (2,500 free)\n`);

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < batch.length; i++) {
    const venue = batch[i];
    const query = `${venue.name} ${venue.region} wedding venue`;

    console.log(`[${startIndex + i + 1}/${venuesNeedingImages.length}] Searching: ${query}`);

    try {
      const images = await searchImages(query);

      if (images && images.length > 0) {
        const venueIndex = data.venues.findIndex(v => v.id === venue.id);
        if (venueIndex !== -1) {
          data.venues[venueIndex].headerImages = images;
          console.log(`  ✓ Found ${images.length} images`);
          updated++;
        }
      } else if (images === null) {
        console.log(`  ✗ API error`);
        errors++;
        break;
      } else {
        console.log(`  ✗ No images found`);
      }

      // Small delay
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
  if (startIndex + BATCH_SIZE < venuesNeedingImages.length) {
    console.log(`Next batch: node scripts/fetch-google-images.cjs ${startIndex + BATCH_SIZE}`);
  } else {
    console.log(`All venues processed!`);
  }
}

main().catch(console.error);
