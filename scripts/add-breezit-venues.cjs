/**
 * Add New Venues from Breezit to Database
 *
 * Takes venues from Breezit search results that don't exist in our database
 * and adds them as new entries.
 */

const fs = require('fs');
const path = require('path');

const VENUES_PATH = path.join(__dirname, '../src/data/venues.json');
const SEARCH_PATH = path.join(__dirname, '../src/data/breezit-search-results.json');

/**
 * Normalize venue name for comparison
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity between two strings
 */
function similarity(str1, str2) {
  const words1 = new Set(normalizeName(str1).split(' ').filter(w => w.length > 2));
  const words2 = new Set(normalizeName(str2).split(' ').filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = [...words1].filter(w => words2.has(w));
  const union = new Set([...words1, ...words2]);

  return intersection.length / union.size;
}

/**
 * Parse price string to number
 */
function parsePrice(priceStr) {
  const match = priceStr.match(/\$([\d,]+)/);
  return match ? parseInt(match[1].replace(/,/g, '')) : null;
}

/**
 * Determine region from Breezit location
 */
function determineRegion(location) {
  if (!location) return 'North Bay'; // Default

  const loc = location.toLowerCase();

  // Map counties/cities to our regions
  if (loc.includes('san francisco')) return 'Peninsula';
  if (loc.includes('san mateo')) return 'Peninsula';
  if (loc.includes('santa clara')) return 'South Bay';
  if (loc.includes('alameda')) return 'South Bay';
  if (loc.includes('contra costa')) return 'North Bay';
  if (loc.includes('napa')) return 'North Bay';
  if (loc.includes('sonoma')) return 'North Bay';
  if (loc.includes('marin')) return 'North Bay';
  if (loc.includes('monterey')) return 'Monterey';
  if (loc.includes('santa cruz')) return 'Santa Cruz';
  if (loc.includes('carmel')) return 'Carmel';
  if (loc.includes('big sur')) return 'Carmel';

  return 'North Bay'; // Default for Northern California
}

/**
 * Generate venue ID
 */
function generateId(region, existingIds) {
  const prefixMap = {
    'North Bay': 'nb',
    'Peninsula': 'pen',
    'South Bay': 'sb',
    'Monterey': 'mon',
    'Santa Cruz': 'sc',
    'Carmel': 'car'
  };

  const prefix = prefixMap[region] || 'ca';

  // Find highest existing ID for this prefix
  let maxNum = 0;
  for (const id of existingIds) {
    if (id.startsWith(prefix + '-')) {
      const num = parseInt(id.split('-')[1]);
      if (num > maxNum) maxNum = num;
    }
  }

  return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
}

/**
 * Convert Breezit venue to our format
 */
function convertToVenue(breezitVenue, id, region) {
  const price = parsePrice(breezitVenue.price);

  return {
    id: id,
    name: breezitVenue.name,
    region: region,
    subregion: breezitVenue.location ? breezitVenue.location.split(',')[0].trim() : null,
    address: breezitVenue.location || null,
    description: `Wedding venue in ${breezitVenue.location || 'California'}. Starting packages from ${breezitVenue.price}.`,
    capacity: breezitVenue.capacity ? {
      min: Math.round(breezitVenue.capacity * 0.3),
      max: breezitVenue.capacity
    } : null,
    price_range: price ? {
      min: price,
      max: Math.round(price * 2.5),
      unit: 'starting_package'
    } : null,
    venue_type: ['Venue'],
    setting: ['Indoor', 'Outdoor'],
    website: null,
    phone: null,
    breezit_pricing: {
      source: 'breezit.com',
      starting_from: price
    },
    breezit_rating: breezitVenue.rating || null,
    breezit_reviews: breezitVenue.reviews || null,
    location: null, // Would need geocoding
    source: 'breezit'
  };
}

function main() {
  console.log('Adding New Venues from Breezit');
  console.log('==============================\n');

  // Load data
  const venuesData = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf-8'));
  const searchData = JSON.parse(fs.readFileSync(SEARCH_PATH, 'utf-8'));

  // Get existing venue names (normalized) and IDs
  const existingNames = new Set();
  const existingIds = new Set();

  for (const venue of venuesData.venues) {
    existingNames.add(normalizeName(venue.name));
    existingIds.add(venue.id);
  }

  console.log(`Existing venues: ${venuesData.venues.length}`);
  console.log(`Breezit venues: ${searchData.venues.length}\n`);

  // Find new venues
  const newVenues = [];
  const skipped = [];

  for (const bv of searchData.venues) {
    // Skip invalid names (parsing artifacts)
    if (!bv.name || bv.name.length < 4) continue;
    if (bv.name.match(/^(Up to|favorite|photo|local_offer|\d)/i)) continue;

    const normalized = normalizeName(bv.name);

    // Check if already exists (direct match)
    if (existingNames.has(normalized)) {
      skipped.push(bv.name + ' (exact match)');
      continue;
    }

    // Check fuzzy match
    let hasFuzzyMatch = false;
    for (const existing of existingNames) {
      if (similarity(normalized, existing) >= 0.6) {
        hasFuzzyMatch = true;
        skipped.push(bv.name + ' (fuzzy match)');
        break;
      }
    }

    if (!hasFuzzyMatch) {
      newVenues.push(bv);
    }
  }

  console.log(`New venues to add: ${newVenues.length}`);
  console.log(`Skipped (already exist): ${skipped.length}\n`);

  // Convert and add new venues
  const addedVenues = [];

  for (const bv of newVenues) {
    const region = determineRegion(bv.location);
    const id = generateId(region, [...existingIds]);
    existingIds.add(id);

    const venue = convertToVenue(bv, id, region);
    venuesData.venues.push(venue);
    addedVenues.push(venue);

    console.log(`✅ Added: ${venue.name} (${venue.id}) - ${bv.price}`);
  }

  // Update metadata
  venuesData.meta.total_venues = venuesData.venues.length;
  venuesData.meta.breezit_venues_added_at = new Date().toISOString();
  venuesData.meta.breezit_venues_added_count = addedVenues.length;

  // Save
  fs.writeFileSync(VENUES_PATH, JSON.stringify(venuesData, null, 2));

  console.log('\n==============================');
  console.log(`Total venues now: ${venuesData.venues.length}`);
  console.log(`New venues added: ${addedVenues.length}`);
}

main();
