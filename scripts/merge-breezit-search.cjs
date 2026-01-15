/**
 * Merge Breezit Search Results into Venues Database
 *
 * Matches venue names from Breezit search results with our database
 * and updates pricing information.
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
 * Calculate similarity between two strings (simple word overlap)
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

function main() {
  console.log('Merging Breezit Search Results');
  console.log('==============================\n');

  // Load data
  const venuesData = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf-8'));
  const searchData = JSON.parse(fs.readFileSync(SEARCH_PATH, 'utf-8'));

  console.log(`Our venues: ${venuesData.venues.length}`);
  console.log(`Breezit search results: ${searchData.venues.length}\n`);

  // Create normalized lookup for Breezit venues
  const breezitLookup = {};
  for (const bv of searchData.venues) {
    const normalized = normalizeName(bv.name);
    breezitLookup[normalized] = bv;
  }

  let matchCount = 0;
  let updatedCount = 0;
  const matches = [];
  const noMatch = [];

  // Try to match each of our venues
  for (const venue of venuesData.venues) {
    const normalizedOurs = normalizeName(venue.name);

    // Direct match first
    let breezitMatch = breezitLookup[normalizedOurs];

    // Fuzzy match if no direct match
    if (!breezitMatch) {
      let bestSim = 0;
      let bestMatch = null;

      for (const bv of searchData.venues) {
        const sim = similarity(venue.name, bv.name);
        if (sim > bestSim && sim >= 0.6) {
          bestSim = sim;
          bestMatch = bv;
        }
      }

      if (bestMatch) {
        breezitMatch = bestMatch;
      }
    }

    if (breezitMatch) {
      matchCount++;
      matches.push({
        our_name: venue.name,
        breezit_name: breezitMatch.name,
        price: breezitMatch.price
      });

      // Update venue with Breezit data if not already enriched
      const price = parsePrice(breezitMatch.price);
      if (price && (!venue.breezit_pricing || !venue.breezit_pricing.starting_from)) {
        venue.breezit_pricing = venue.breezit_pricing || {};
        venue.breezit_pricing.source = 'breezit.com';
        venue.breezit_pricing.scraped_at = searchData.scraped_at;
        venue.breezit_pricing.starting_from = price;

        if (breezitMatch.capacity && (!venue.capacity || !venue.capacity.max)) {
          venue.capacity = venue.capacity || {};
          venue.capacity.max = breezitMatch.capacity;
        }

        if (breezitMatch.rating) {
          venue.breezit_rating = breezitMatch.rating;
        }
        if (breezitMatch.reviews) {
          venue.breezit_reviews = breezitMatch.reviews;
        }

        updatedCount++;
        console.log(`✅ ${venue.name} -> ${breezitMatch.price}`);
      } else if (venue.breezit_pricing?.starting_from) {
        console.log(`⏭️  ${venue.name} (already has pricing)`);
      }
    } else {
      noMatch.push(venue.name);
    }
  }

  // Update metadata
  venuesData.meta.breezit_search_merged_at = new Date().toISOString();
  venuesData.meta.breezit_search_matches = matchCount;

  // Save
  fs.writeFileSync(VENUES_PATH, JSON.stringify(venuesData, null, 2));

  console.log('\n==============================');
  console.log(`Matches found: ${matchCount}`);
  console.log(`Newly updated: ${updatedCount}`);
  console.log(`No match: ${noMatch.length}`);

  if (noMatch.length > 0 && noMatch.length < 50) {
    console.log('\nVenues without Breezit match:');
    for (const name of noMatch.slice(0, 30)) {
      console.log(`  - ${name}`);
    }
  }
}

main();
