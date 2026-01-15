/**
 * Enrich venue data with Google Places API
 *
 * This script:
 * 1. Searches for each venue using name + location
 * 2. Gets detailed place information
 * 3. Saves enriched data back to venues.json
 *
 * Run with: node scripts/enrich-places-api.cjs
 */

const fs = require('fs');
const path = require('path');

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('Error: GOOGLE_PLACES_API_KEY environment variable is required');
  console.error('Set it with: export GOOGLE_PLACES_API_KEY=your_key_here');
  process.exit(1);
}
const VENUES_PATH = path.join(__dirname, '../src/data/venues.json');

// Rate limiting - Google allows 100 QPS but let's be conservative
const DELAY_MS = 200;
const BATCH_SIZE = 50;

// Fields to request from Place Details
const DETAIL_FIELDS = [
  'place_id',
  'name',
  'formatted_address',
  'formatted_phone_number',
  'international_phone_number',
  'website',
  'url', // Google Maps URL
  'rating',
  'user_ratings_total',
  'price_level',
  'opening_hours',
  'business_status',
  'types',
  'geometry',
  'photos',
  'reviews',
  'wheelchair_accessible_entrance',
].join(',');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search for a place using Text Search API
 */
async function searchPlace(venue) {
  const query = `${venue.name} ${venue.subregion || venue.region}`;
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', GOOGLE_API_KEY);

  // Use location bias to prefer results near our known coordinates
  if (venue.location) {
    url.searchParams.set('location', `${venue.location.lat},${venue.location.lng}`);
    url.searchParams.set('radius', '5000'); // 5km radius
  }

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      // Return the first result (most relevant)
      return data.results[0];
    } else if (data.status === 'ZERO_RESULTS') {
      console.log(`  No results for: ${venue.name}`);
      return null;
    } else {
      console.error(`  Search error for ${venue.name}: ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error(`  Network error searching ${venue.name}:`, error.message);
    return null;
  }
}

/**
 * Get detailed place information
 */
async function getPlaceDetails(placeId) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', DETAIL_FIELDS);
  url.searchParams.set('key', GOOGLE_API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'OK') {
      return data.result;
    } else {
      console.error(`  Details error: ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error(`  Network error getting details:`, error.message);
    return null;
  }
}

/**
 * Calculate distance between two coordinates in km
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Enrich a single venue with Google Places data
 */
async function enrichVenue(venue) {
  // Skip if already enriched
  if (venue.google_place_id) {
    console.log(`  Skipping ${venue.name} (already enriched)`);
    return venue;
  }

  // Search for the place
  const searchResult = await searchPlace(venue);
  if (!searchResult) {
    return { ...venue, google_place_id: null, google_enrichment_status: 'not_found' };
  }

  await sleep(DELAY_MS);

  // Get detailed information
  const details = await getPlaceDetails(searchResult.place_id);
  if (!details) {
    return { ...venue, google_place_id: searchResult.place_id, google_enrichment_status: 'details_failed' };
  }

  // Calculate distance between our coordinates and Google's
  let locationDistance = null;
  let locationVerified = false;
  if (venue.location && details.geometry?.location) {
    locationDistance = calculateDistance(
      venue.location.lat,
      venue.location.lng,
      details.geometry.location.lat,
      details.geometry.location.lng
    );
    locationVerified = locationDistance < 1; // Within 1km
  }

  // Build enriched venue object
  const enrichedVenue = {
    ...venue,
    // Google Place ID
    google_place_id: details.place_id,

    // Ratings
    google_rating: details.rating || null,
    google_reviews_count: details.user_ratings_total || 0,
    google_price_level: details.price_level || null,

    // Contact (only update if we don't have it or Google's is different)
    google_formatted_address: details.formatted_address || null,
    google_phone: details.formatted_phone_number || details.international_phone_number || null,
    google_website: details.website || null,
    google_maps_url: details.url || venue.google_maps_url,

    // Business info
    google_business_status: details.business_status || null,
    google_types: details.types || [],

    // Opening hours
    google_opening_hours: details.opening_hours ? {
      weekday_text: details.opening_hours.weekday_text || [],
      open_now: details.opening_hours.open_now
    } : null,

    // Photos (store references, not actual photos)
    google_photos: details.photos ? details.photos.slice(0, 10).map(p => ({
      photo_reference: p.photo_reference,
      width: p.width,
      height: p.height,
      attributions: p.html_attributions
    })) : [],

    // Reviews from Google (top 5)
    google_reviews: details.reviews ? details.reviews.slice(0, 5).map(r => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.relative_time_description
    })) : [],

    // Accessibility
    google_wheelchair_accessible: details.wheelchair_accessible_entrance || null,

    // Location verification
    google_location: details.geometry?.location || null,
    google_location_distance_km: locationDistance ? Math.round(locationDistance * 100) / 100 : null,
    google_location_verified: locationVerified,

    // Enrichment metadata
    google_enrichment_status: 'success',
    google_enriched_at: new Date().toISOString()
  };

  // Update our location if Google's is more accurate and within reasonable distance
  if (locationVerified && details.geometry?.location) {
    enrichedVenue.location = {
      lat: details.geometry.location.lat,
      lng: details.geometry.location.lng
    };
  }

  return enrichedVenue;
}

/**
 * Main function
 */
async function main() {
  console.log('Loading venues...');
  const data = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf-8'));
  const venues = data.venues;

  console.log(`Found ${venues.length} venues`);

  // Count already enriched
  const alreadyEnriched = venues.filter(v => v.google_place_id).length;
  const toEnrich = venues.filter(v => !v.google_place_id);

  console.log(`Already enriched: ${alreadyEnriched}`);
  console.log(`To enrich: ${toEnrich.length}`);

  if (toEnrich.length === 0) {
    console.log('All venues already enriched!');
    return;
  }

  // Process in batches
  const enrichedVenues = [...venues];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];

    if (venue.google_place_id) {
      continue; // Skip already enriched
    }

    console.log(`[${i + 1}/${venues.length}] Enriching: ${venue.name}`);

    try {
      const enrichedVenue = await enrichVenue(venue);
      enrichedVenues[i] = enrichedVenue;

      if (enrichedVenue.google_enrichment_status === 'success') {
        successCount++;
        console.log(`  ✓ Rating: ${enrichedVenue.google_rating || 'N/A'}, Reviews: ${enrichedVenue.google_reviews_count}`);
      } else {
        failCount++;
        console.log(`  ✗ Status: ${enrichedVenue.google_enrichment_status}`);
      }
    } catch (error) {
      failCount++;
      console.error(`  ✗ Error: ${error.message}`);
      enrichedVenues[i] = { ...venue, google_enrichment_status: 'error', google_error: error.message };
    }

    // Save progress every batch
    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`\nSaving progress (${i + 1} venues processed)...`);
      const updatedData = {
        ...data,
        meta: {
          ...data.meta,
          google_enriched_at: new Date().toISOString(),
          google_enriched_count: enrichedVenues.filter(v => v.google_enrichment_status === 'success').length
        },
        venues: enrichedVenues
      };
      fs.writeFileSync(VENUES_PATH, JSON.stringify(updatedData, null, 2));
      console.log('Progress saved.\n');
    }

    await sleep(DELAY_MS);
  }

  // Final save
  console.log('\nSaving final results...');
  const finalData = {
    ...data,
    meta: {
      ...data.meta,
      google_enriched_at: new Date().toISOString(),
      google_enriched_count: enrichedVenues.filter(v => v.google_enrichment_status === 'success').length
    },
    venues: enrichedVenues
  };
  fs.writeFileSync(VENUES_PATH, JSON.stringify(finalData, null, 2));

  console.log('\n=== Enrichment Complete ===');
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${venues.length}`);
}

// Run
main().catch(console.error);
