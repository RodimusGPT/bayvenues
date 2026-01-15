/**
 * Breezit Search Page Scraper
 *
 * Scrapes venue cards from Breezit wedding venues pages.
 * Each card shows: name, price, rating, capacity, location
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../src/data/breezit-search-results.json');

// Search pages for Bay Area and nearby regions
const SEARCH_URLS = [
  'https://breezit.com/wedding-venues/northern-california',
  'https://breezit.com/wedding-venues/san-francisco',
  'https://breezit.com/wedding-venues/napa-valley',
  'https://breezit.com/wedding-venues/sonoma',
  'https://breezit.com/wedding-venues/monterey',
  'https://breezit.com/wedding-venues/carmel',
  'https://breezit.com/wedding-venues/santa-cruz',
  'https://breezit.com/wedding-venues/san-jose',
  'https://breezit.com/wedding-venues/oakland',
  'https://breezit.com/wedding-venues/palo-alto',
  'https://breezit.com/wedding-venues/half-moon-bay',
  'https://breezit.com/wedding-venues/sausalito',
  'https://breezit.com/wedding-venues/big-sur',
  'https://breezit.com/wedding-venues/los-gatos',
  'https://breezit.com/wedding-venues/saratoga',
  'https://breezit.com/wedding-venues/woodside',
];

async function scrapeSearchPage(page, url) {
  console.log(`\nScraping: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Scroll to load all venues
  console.log('Scrolling to load all venues...');
  let previousCount = 0;
  let sameCountTimes = 0;

  for (let i = 0; i < 100; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    // Count venues by counting "Starting package" occurrences
    const currentCount = await page.evaluate(() => {
      return (document.body.innerText.match(/Starting package/g) || []).length;
    });

    if (i % 5 === 0) {
      console.log(`  Scroll ${i + 1}: ${currentCount} venues loaded`);
    }

    if (currentCount === previousCount) {
      sameCountTimes++;
      if (sameCountTimes >= 3) {
        console.log(`  Done loading: ${currentCount} venues`);
        break;
      }
    } else {
      sameCountTimes = 0;
    }
    previousCount = currentCount;
  }

  // Extract venue data
  const venues = await page.evaluate(() => {
    const results = [];
    const text = document.body.innerText;

    // Split by "Starting package" which appears on each card
    const chunks = text.split('Starting package');

    for (let i = 1; i < chunks.length; i++) {
      const beforePrice = chunks[i - 1];
      const afterPrice = chunks[i];

      // Extract price (right after "Starting package")
      const priceMatch = afterPrice.match(/^\s*\$[\d,]+/);
      if (!priceMatch) continue;

      const venue = {
        price: priceMatch[0].trim()
      };

      // Extract capacity (after price, "Up to XXX")
      const capacityMatch = afterPrice.match(/Up to\s+(\d+)/);
      if (capacityMatch) {
        venue.capacity = parseInt(capacityMatch[1]);
      }

      // Look at lines before "Starting package" for venue info
      const lines = beforePrice.split('\n').map(l => l.trim()).filter(l => l);
      const lastLines = lines.slice(-15);

      // Find location (City, County pattern)
      for (const line of lastLines) {
        const locMatch = line.match(/^([A-Za-z\s-]+),\s+([A-Za-z\s]+County)$/);
        if (locMatch) {
          venue.location = line;
          break;
        }
      }

      // Find rating (X.XX (XXX) pattern)
      for (const line of lastLines) {
        const ratingMatch = line.match(/^(\d\.\d{1,2})\s*\((\d+)\)$/);
        if (ratingMatch) {
          venue.rating = parseFloat(ratingMatch[1]);
          venue.reviews = parseInt(ratingMatch[2]);
          break;
        }
      }

      // Find venue name - it's usually the line before "Starting package" that isn't
      // a location, rating, or venue type
      for (let j = lastLines.length - 1; j >= 0; j--) {
        const line = lastLines[j];
        // Skip if it's a venue type, rating, location, number, icon text
        if (line.match(/^(Outdoor venue|Estate|Restaurant|Winery|Hotel|Ranch|Farm|Banquet Hall|Vineyard|Garden|Other|Museum|Villa|Club|Historic|Mansion|Forest|Beach|Rooftop|Loft)/i)) continue;
        if (line.match(/County$/)) continue;
        if (line.match(/^\d\.\d/)) continue;
        if (line.match(/^(favorite|photo|local_offer|Negotiable|location_on|★|\d+|camera|arrow|expand|close|clear|outline|favorite_outline|photo_camera)$/i)) continue;
        if (line.length < 3 || line.length > 100) continue;

        venue.name = line;
        break;
      }

      if (venue.name && venue.price) {
        results.push(venue);
      }
    }

    return results;
  });

  console.log(`  Extracted ${venues.length} venues`);
  return venues;
}

async function main() {
  console.log('Breezit Wedding Venues Scraper');
  console.log('==============================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const allVenues = [];
  const seenNames = new Set();

  for (const url of SEARCH_URLS) {
    const venues = await scrapeSearchPage(page, url);

    for (const venue of venues) {
      if (!seenNames.has(venue.name)) {
        seenNames.add(venue.name);
        allVenues.push(venue);
      }
    }
  }

  await browser.close();

  // Save results
  const results = {
    scraped_at: new Date().toISOString(),
    total_venues: allVenues.length,
    venues: allVenues
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));

  console.log('\n==============================');
  console.log(`Total unique venues: ${allVenues.length}`);
  console.log(`Saved to: ${OUTPUT_PATH}`);

  // Show samples
  console.log('\nSample venues:');
  for (const v of allVenues.slice(0, 15)) {
    console.log(`  ${v.name}: ${v.price} (${v.rating || 'N/A'}★, up to ${v.capacity || '?'} guests)`);
  }
}

main().catch(console.error);
