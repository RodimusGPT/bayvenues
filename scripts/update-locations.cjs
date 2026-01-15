/**
 * Update venue locations based on Google Places API data
 *
 * Strategy:
 * - < 50km: Update location (trust Google, even for large properties)
 * - > 50km: Skip (likely a mismatch, e.g., wrong city/country)
 *
 * Run with: node scripts/update-locations.cjs
 */

const fs = require('fs');
const path = require('path');

const VENUES_PATH = path.join(__dirname, '../src/data/venues.json');
const MAX_DISTANCE_KM = 50; // Don't update if discrepancy > 50km

function main() {
  console.log('Loading venues...');
  const data = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf-8'));
  const venues = data.venues;

  console.log(`Found ${venues.length} venues\n`);

  const stats = {
    updated: 0,
    skippedNoGoogle: 0,
    skippedMismatch: 0,
    skippedSameLocation: 0,
  };

  const skippedVenues = [];
  const updatedVenues = [];

  venues.forEach((venue, i) => {
    // Skip if no Google location
    if (!venue.google_location) {
      stats.skippedNoGoogle++;
      return;
    }

    const distance = venue.google_location_distance_km;
    const oldLat = venue.location?.lat;
    const oldLng = venue.location?.lng;
    const newLat = venue.google_location.lat;
    const newLng = venue.google_location.lng;

    // Skip if distance is too large (likely mismatch)
    if (distance && distance > MAX_DISTANCE_KM) {
      stats.skippedMismatch++;
      skippedVenues.push({
        name: venue.name,
        region: venue.region,
        distance_km: distance,
        reason: `Distance ${distance.toFixed(1)}km > ${MAX_DISTANCE_KM}km threshold`
      });
      return;
    }

    // Skip if location is already the same
    if (oldLat === newLat && oldLng === newLng) {
      stats.skippedSameLocation++;
      return;
    }

    // Update the location
    venue.location = {
      lat: newLat,
      lng: newLng
    };

    // Also mark as location updated
    venue.location_source = 'google_places';
    venue.location_updated_at = new Date().toISOString();

    stats.updated++;
    updatedVenues.push({
      name: venue.name,
      region: venue.region,
      distance_km: distance || 0,
      old: { lat: oldLat, lng: oldLng },
      new: { lat: newLat, lng: newLng }
    });
  });

  // Save updated data
  console.log('Saving updated venues...');
  const updatedData = {
    ...data,
    meta: {
      ...data.meta,
      locations_updated_at: new Date().toISOString(),
      locations_updated_count: stats.updated
    },
    venues
  };
  fs.writeFileSync(VENUES_PATH, JSON.stringify(updatedData, null, 2));

  // Print summary
  console.log('\n=== Location Update Complete ===');
  console.log(`Updated: ${stats.updated}`);
  console.log(`Skipped (no Google data): ${stats.skippedNoGoogle}`);
  console.log(`Skipped (mismatch > ${MAX_DISTANCE_KM}km): ${stats.skippedMismatch}`);
  console.log(`Skipped (already same): ${stats.skippedSameLocation}`);

  if (skippedVenues.length > 0) {
    console.log('\n=== Skipped Venues (Potential Mismatches) ===');
    skippedVenues.forEach(v => {
      console.log(`  - ${v.name} (${v.region}): ${v.reason}`);
    });
  }

  // Show sample of updated venues by distance
  console.log('\n=== Sample Updates by Distance ===');

  const byDistance = {
    'Large (10-50km)': updatedVenues.filter(v => v.distance_km >= 10).slice(0, 5),
    'Medium (5-10km)': updatedVenues.filter(v => v.distance_km >= 5 && v.distance_km < 10).slice(0, 5),
    'Small (1-5km)': updatedVenues.filter(v => v.distance_km >= 1 && v.distance_km < 5).slice(0, 5),
  };

  Object.entries(byDistance).forEach(([category, venues]) => {
    if (venues.length > 0) {
      console.log(`\n${category}:`);
      venues.forEach(v => {
        console.log(`  ${v.name} (${v.distance_km.toFixed(1)}km)`);
        console.log(`    ${v.old.lat?.toFixed(4)}, ${v.old.lng?.toFixed(4)} → ${v.new.lat.toFixed(4)}, ${v.new.lng.toFixed(4)}`);
      });
    }
  });
}

main();
