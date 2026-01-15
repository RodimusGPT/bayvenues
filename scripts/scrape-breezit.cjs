/**
 * Breezit Venue Scraper
 *
 * Scrapes venue data from breezit.com using Playwright to handle
 * JavaScript-rendered content. Extracts pricing, capacity, and other
 * metadata to enrich our venue database.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const VENUES_PATH = path.join(__dirname, '../src/data/venues.json');
const OUTPUT_PATH = path.join(__dirname, '../src/data/breezit-data.json');
const DELAY_MS = 2000; // Delay between requests to be respectful

// California regions to scrape
const CA_REGIONS = ['North Bay', 'Peninsula', 'South Bay', 'Monterey', 'Santa Cruz', 'Carmel'];

/**
 * Convert venue name to Breezit URL slug
 * e.g., "The Mountain Terrace" -> "the-mountain-terrace"
 */
function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')  // Remove apostrophes
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')  // Spaces to hyphens
    .replace(/-+/g, '-')   // Multiple hyphens to single
    .replace(/^-|-$/g, ''); // Trim hyphens
}

/**
 * Extract venue data from Breezit page
 */
async function scrapeVenuePage(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check if page exists (not 404 or redirect to search)
    const currentUrl = page.url();
    if (currentUrl.includes('/search') || currentUrl.includes('404')) {
      return null;
    }

    // Extract pricing from title (most reliable)
    const title = await page.title();
    let priceFromTitle = null;
    const titlePriceMatch = title.match(/\$[\d,]+/);
    if (titlePriceMatch) {
      priceFromTitle = titlePriceMatch[0];
    }

    // Extract data using page.evaluate
    const data = await page.evaluate(() => {
      const result = {};

      // Get venue name from h1
      const nameEl = document.querySelector('h1');
      if (nameEl) result.name = nameEl.textContent.trim();

      const pageText = document.body.innerText;

      // Extract rating (e.g., "4.32")
      const ratingMatch = pageText.match(/(\d\.\d{1,2})\s*\([\d,]+\)/);
      if (ratingMatch) {
        result.breezit_rating = parseFloat(ratingMatch[1]);
        const reviewMatch = ratingMatch[0].match(/\(([\d,]+)\)/);
        if (reviewMatch) {
          result.breezit_reviews = parseInt(reviewMatch[1].replace(/,/g, ''));
        }
      }

      // Extract all capacity mentions
      const capacityMatches = pageText.match(/(\d{2,4})\s*(people|guests?|person)/gi);
      if (capacityMatches) {
        const capacities = capacityMatches.map(m => parseInt(m.match(/\d+/)[0]));
        result.capacity_mentions = capacities;
        result.max_capacity = Math.max(...capacities);
      }

      // Look for pricing in body text
      const pricePatterns = [
        /\$[\d,]+\s*[-–to]+\s*\$[\d,]+/g,  // $5,000 - $10,000
        /\$[\d,]+\s*per\s*(person|guest|plate)/gi,  // $150 per person
        /starting\s+(?:at|from)\s+\$[\d,]+/gi,     // Starting at $5,000
      ];

      for (const pattern of pricePatterns) {
        const matches = pageText.match(pattern);
        if (matches) {
          result.pricing_text = matches[0];
          break;
        }
      }

      // Get venue type
      const typeMatch = pageText.match(/Venue\s*\|\s*([^\n]+)/);
      if (typeMatch) {
        result.venue_type = typeMatch[1].trim();
      }

      // Get address (usually near the venue name)
      const cityPattern = /San Francisco|Oakland|Napa|Sonoma|Carmel|Monterey|Santa Cruz|Palo Alto|San Jose/i;
      const lines = pageText.split('\n');
      for (const line of lines) {
        if (cityPattern.test(line) && /CA|California/i.test(line)) {
          result.address = line.trim();
          break;
        }
      }

      return result;
    });

    // Merge title price with page data
    if (priceFromTitle) {
      data.price_from = priceFromTitle;
    }

    return data;

  } catch (error) {
    console.error(`  Error scraping ${url}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Breezit Venue Scraper');
  console.log('=====================\n');

  // Load our venues
  const venuesData = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf-8'));
  const venues = venuesData.venues;

  // Filter to California venues only
  const caVenues = venues.filter(v => CA_REGIONS.includes(v.region));
  console.log(`Found ${caVenues.length} California venues to check on Breezit\n`);

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const results = {
    scraped_at: new Date().toISOString(),
    found: [],
    not_found: [],
    errors: []
  };

  // Process each venue
  for (let i = 0; i < caVenues.length; i++) {
    const venue = caVenues[i];
    const slug = nameToSlug(venue.name);
    const url = `https://breezit.com/${slug}`;

    console.log(`[${i + 1}/${caVenues.length}] ${venue.name}`);
    console.log(`  URL: ${url}`);

    const data = await scrapeVenuePage(page, url);

    if (data && data.name) {
      console.log(`  ✅ Found! ${data.pricing_text || 'No pricing'}`);
      results.found.push({
        venue_id: venue.id,
        venue_name: venue.name,
        breezit_url: url,
        breezit_data: data
      });
    } else {
      console.log(`  ❌ Not found on Breezit`);
      results.not_found.push({
        venue_id: venue.id,
        venue_name: venue.name,
        tried_url: url
      });
    }

    // Respectful delay
    if (i < caVenues.length - 1) {
      await page.waitForTimeout(DELAY_MS);
    }
  }

  await browser.close();

  // Save results
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));

  console.log('\n=====================');
  console.log('Scraping Complete!');
  console.log(`Found: ${results.found.length} venues`);
  console.log(`Not found: ${results.not_found.length} venues`);
  console.log(`Results saved to: ${OUTPUT_PATH}`);
}

main().catch(console.error);
