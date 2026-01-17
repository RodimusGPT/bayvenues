#!/usr/bin/env node
/**
 * Geocode venues using Google Places API
 * Updates venues in Supabase with accurate lat/lng coordinates
 */

import { createClient } from '@supabase/supabase-js';

const GOOGLE_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyArD-Nkkatm7uItD7YKRhI6jjbInpW-1no';
const SUPABASE_URL = 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY or VITE_SUPABASE_ANON_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Rate limiting - Google allows 50 requests per second
const BATCH_SIZE = 10;
const DELAY_MS = 250; // 4 requests per second to be safe

async function geocodeAddress(address, name) {
  // Try Places API first (better for business names)
  const query = `${name}, ${address}`;
  const placesUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=geometry,formatted_address,name&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(placesUrl);
    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const location = data.candidates[0].geometry.location;
      return { lat: location.lat, lng: location.lng, source: 'places' };
    }

    // Fallback to Geocoding API for address-only lookup
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();

    if (geoData.results && geoData.results.length > 0) {
      const location = geoData.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng, source: 'geocode' };
    }

    return null;
  } catch (error) {
    console.error(`Error geocoding ${name}:`, error.message);
    return null;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateVenueLocation(id, lat, lng) {
  const { error } = await supabase.rpc('update_venue_location', {
    venue_id: id,
    venue_lat: lat,
    venue_lng: lng
  });

  if (error) {
    // Fallback to direct update if RPC doesn't exist
    const { error: updateError } = await supabase
      .from('venues')
      .update({
        lat: lat,
        lng: lng,
        location: `SRID=4326;POINT(${lng} ${lat})`
      })
      .eq('id', id);

    if (updateError) {
      console.error(`Failed to update ${id}:`, updateError.message);
      return false;
    }
  }
  return true;
}

async function main() {
  console.log('Fetching venues without coordinates...\n');

  // Get venues without location
  const { data: venues, error } = await supabase
    .from('venues')
    .select('id, name, address, region')
    .is('location', null)
    .order('id');

  if (error) {
    console.error('Error fetching venues:', error.message);
    process.exit(1);
  }

  console.log(`Found ${venues.length} venues without coordinates\n`);

  let successCount = 0;
  let failCount = 0;

  // Process in batches
  for (let i = 0; i < venues.length; i += BATCH_SIZE) {
    const batch = venues.slice(i, i + BATCH_SIZE);

    console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(venues.length / BATCH_SIZE)}...`);

    for (const venue of batch) {
      if (!venue.address) {
        console.log(`  ⚠️  ${venue.id}: No address, skipping`);
        failCount++;
        continue;
      }

      const coords = await geocodeAddress(venue.address, venue.name);

      if (coords) {
        const updated = await updateVenueLocation(venue.id, coords.lat, coords.lng);
        if (updated) {
          console.log(`  ✅ ${venue.id}: ${venue.name} → ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} (${coords.source})`);
          successCount++;
        } else {
          console.log(`  ❌ ${venue.id}: Update failed`);
          failCount++;
        }
      } else {
        console.log(`  ❌ ${venue.id}: ${venue.name} - geocoding failed`);
        failCount++;
      }

      await sleep(DELAY_MS);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Successfully geocoded: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`${'='.repeat(50)}`);
}

main().catch(console.error);
