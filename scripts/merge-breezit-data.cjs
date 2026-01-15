/**
 * Merge Breezit Data into Venues Database
 *
 * Takes scraped Breezit data and merges pricing, capacity, and ratings
 * into our main venues.json database.
 */

const fs = require('fs');
const path = require('path');

const VENUES_PATH = path.join(__dirname, '../src/data/venues.json');
const BREEZIT_PATH = path.join(__dirname, '../src/data/breezit-data.json');

/**
 * Parse price string to number
 * e.g., "$10,523" -> 10523
 */
function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.match(/\$?([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''));
  }
  return null;
}

/**
 * Parse price range string
 * e.g., "$8,500 - $11,500" -> { min: 8500, max: 11500 }
 */
function parsePriceRange(rangeStr) {
  if (!rangeStr) return null;

  // Check for per-person pricing first
  const perPersonMatch = rangeStr.match(/\$([\d,]+)\s*per\s*(person|guest|plate)/i);
  if (perPersonMatch) {
    return {
      per_person: parseInt(perPersonMatch[1].replace(/,/g, '')),
      unit: 'per_person'
    };
  }

  // Range pricing: $X - $Y
  const rangeMatch = rangeStr.match(/\$([\d,]+)\s*[-–to]+\s*\$([\d,]+)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1].replace(/,/g, '')),
      max: parseInt(rangeMatch[2].replace(/,/g, '')),
      unit: 'event_total'
    };
  }

  return null;
}

function main() {
  console.log('Merging Breezit Data into Venues Database');
  console.log('==========================================\n');

  // Load data
  const venuesData = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf-8'));
  const breezitData = JSON.parse(fs.readFileSync(BREEZIT_PATH, 'utf-8'));

  // Create lookup by venue_id
  const breezitLookup = {};
  for (const item of breezitData.found) {
    breezitLookup[item.venue_id] = item;
  }

  let updatedCount = 0;
  let pricingAdded = 0;
  let capacityUpdated = 0;
  let ratingsAdded = 0;

  // Process each venue
  for (const venue of venuesData.venues) {
    const breezit = breezitLookup[venue.id];
    if (!breezit) continue;

    const bd = breezit.breezit_data;

    // Skip if this is a "Featured vendors" page (not actual venue data)
    if (bd.name === 'Featured vendors') {
      continue;
    }

    let updated = false;

    // Add Breezit URL
    if (!venue.breezit_url) {
      venue.breezit_url = breezit.breezit_url;
      updated = true;
    }

    // Add Breezit pricing
    if (bd.price_from || bd.pricing_text) {
      const priceFrom = parsePrice(bd.price_from);
      const priceRange = parsePriceRange(bd.pricing_text);

      venue.breezit_pricing = {
        source: 'breezit.com',
        scraped_at: breezitData.scraped_at
      };

      if (priceFrom) {
        venue.breezit_pricing.starting_from = priceFrom;
      }

      if (priceRange) {
        if (priceRange.per_person) {
          venue.breezit_pricing.per_person = priceRange.per_person;
        } else {
          venue.breezit_pricing.min = priceRange.min;
          venue.breezit_pricing.max = priceRange.max;
        }
        venue.breezit_pricing.unit = priceRange.unit;
      }

      pricingAdded++;
      updated = true;
    }

    // Update capacity if Breezit has higher max
    if (bd.max_capacity) {
      const currentMax = venue.capacity?.max || 0;
      if (bd.max_capacity > currentMax) {
        if (!venue.capacity) venue.capacity = {};
        venue.capacity.max = bd.max_capacity;
        venue.capacity.source = 'breezit';
        capacityUpdated++;
        updated = true;
      }
    }

    // Add Breezit rating (if not generic 4.5/69)
    if (bd.breezit_rating && bd.breezit_reviews && bd.breezit_reviews !== 69) {
      venue.breezit_rating = bd.breezit_rating;
      venue.breezit_reviews = bd.breezit_reviews;
      ratingsAdded++;
      updated = true;
    }

    if (updated) {
      updatedCount++;
      console.log(`✅ ${venue.name}`);
      if (venue.breezit_pricing?.starting_from) {
        console.log(`   Price: $${venue.breezit_pricing.starting_from.toLocaleString()}+`);
      }
      if (venue.breezit_pricing?.per_person) {
        console.log(`   Price: $${venue.breezit_pricing.per_person}/person`);
      }
    }
  }

  // Update metadata
  venuesData.meta.breezit_enriched_at = new Date().toISOString();
  venuesData.meta.breezit_enriched_count = updatedCount;

  // Save updated venues
  fs.writeFileSync(VENUES_PATH, JSON.stringify(venuesData, null, 2));

  console.log('\n==========================================');
  console.log('Merge Complete!');
  console.log(`Venues updated: ${updatedCount}`);
  console.log(`Pricing added: ${pricingAdded}`);
  console.log(`Capacity updated: ${capacityUpdated}`);
  console.log(`Ratings added: ${ratingsAdded}`);
}

main();
