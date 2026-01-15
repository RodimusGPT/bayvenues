/**
 * Breezit Retry Scraper
 *
 * Retries venues that got "Featured vendors" page with alternative URL slugs.
 * Removes common suffixes like "Lodge", "Hotel", "Winery", "Resort", etc.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BREEZIT_PATH = path.join(__dirname, '../src/data/breezit-data.json');
const DELAY_MS = 1500;

// Common suffixes to try removing
const SUFFIXES_TO_REMOVE = [
  ' lodge', ' hotel', ' winery', ' resort', ' spa', ' inn', ' estate',
  ' vineyards', ' vineyard', ' ranch', ' club', ' center', ' house',
  ' mansion', ' villa', ' museum', ' restaurant', ' & spa', ' and spa',
  ' & resort', ' and resort', ' by wedgewood'
];

/**
 * Generate URL variations for a venue name
 */
function generateSlugs(name) {
  const slugs = new Set();

  // Original slug
  const original = nameToSlug(name);
  slugs.add(original);

  // Try removing each suffix
  let cleanName = name.toLowerCase();
  for (const suffix of SUFFIXES_TO_REMOVE) {
    if (cleanName.endsWith(suffix)) {
      const shortened = cleanName.slice(0, -suffix.length).trim();
      slugs.add(nameToSlug(shortened));
    }
  }

  // Special cases
  // "The X" -> "x"
  if (cleanName.startsWith('the ')) {
    slugs.add(nameToSlug(cleanName.slice(4)));
  }

  // Remove "the" from middle too
  slugs.add(nameToSlug(cleanName.replace(/\bthe\b/g, '')));

  return [...slugs];
}

function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function scrapeVenuePage(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const currentUrl = page.url();
    if (currentUrl.includes('/search') || currentUrl.includes('404')) {
      return null;
    }

    const title = await page.title();
    let priceFromTitle = null;
    const titlePriceMatch = title.match(/\$[\d,]+/);
    if (titlePriceMatch) {
      priceFromTitle = titlePriceMatch[0];
    }

    const data = await page.evaluate(() => {
      const result = {};
      const nameEl = document.querySelector('h1');
      if (nameEl) result.name = nameEl.textContent.trim();

      const pageText = document.body.innerText;

      const ratingMatch = pageText.match(/(\d\.\d{1,2})\s*\([\d,]+\)/);
      if (ratingMatch) {
        result.breezit_rating = parseFloat(ratingMatch[1]);
        const reviewMatch = ratingMatch[0].match(/\(([\d,]+)\)/);
        if (reviewMatch) {
          result.breezit_reviews = parseInt(reviewMatch[1].replace(/,/g, ''));
        }
      }

      const capacityMatches = pageText.match(/(\d{2,4})\s*(people|guests?|person)/gi);
      if (capacityMatches) {
        const capacities = capacityMatches.map(m => parseInt(m.match(/\d+/)[0]));
        result.capacity_mentions = capacities;
        result.max_capacity = Math.max(...capacities);
      }

      const pricePatterns = [
        /\$[\d,]+\s*[-–to]+\s*\$[\d,]+/g,
        /\$[\d,]+\s*per\s*(person|guest|plate)/gi,
        /starting\s+(?:at|from)\s+\$[\d,]+/gi,
      ];

      for (const pattern of pricePatterns) {
        const matches = pageText.match(pattern);
        if (matches) {
          result.pricing_text = matches[0];
          break;
        }
      }

      const typeMatch = pageText.match(/Venue\s*\|\s*([^\n]+)/);
      if (typeMatch) {
        result.venue_type = typeMatch[1].trim();
      }

      return result;
    });

    if (priceFromTitle) {
      data.price_from = priceFromTitle;
    }

    return data;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('Breezit Retry Scraper - Alternative URLs');
  console.log('========================================\n');

  const breezitData = JSON.parse(fs.readFileSync(BREEZIT_PATH, 'utf-8'));

  // Find venues with "Featured vendors" (generic page)
  const toRetry = breezitData.found.filter(v => v.breezit_data.name === 'Featured vendors');
  console.log(`Found ${toRetry.length} venues to retry with alternative slugs\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  let foundCount = 0;
  const updates = [];

  for (let i = 0; i < toRetry.length; i++) {
    const venue = toRetry[i];
    const slugs = generateSlugs(venue.venue_name);

    console.log(`[${i + 1}/${toRetry.length}] ${venue.venue_name}`);
    console.log(`  Trying: ${slugs.join(', ')}`);

    let found = false;
    for (const slug of slugs) {
      if (slug === nameToSlug(venue.venue_name)) continue; // Skip original, already tried

      const url = `https://breezit.com/${slug}`;
      const data = await scrapeVenuePage(page, url);

      if (data && data.name && data.name !== 'Featured vendors') {
        console.log(`  ✅ Found at: ${url}`);
        if (data.price_from) console.log(`     Price: ${data.price_from}`);

        updates.push({
          venue_id: venue.venue_id,
          venue_name: venue.venue_name,
          breezit_url: url,
          breezit_data: data
        });
        foundCount++;
        found = true;
        break;
      }

      await page.waitForTimeout(500);
    }

    if (!found) {
      console.log(`  ❌ Not found with any slug variation`);
    }

    if (i < toRetry.length - 1) {
      await page.waitForTimeout(DELAY_MS);
    }
  }

  await browser.close();

  // Update the breezit data file
  if (updates.length > 0) {
    for (const update of updates) {
      const idx = breezitData.found.findIndex(v => v.venue_id === update.venue_id);
      if (idx >= 0) {
        breezitData.found[idx] = update;
      }
    }
    breezitData.retry_at = new Date().toISOString();
    breezitData.retry_found = foundCount;

    fs.writeFileSync(BREEZIT_PATH, JSON.stringify(breezitData, null, 2));
  }

  console.log('\n========================================');
  console.log(`Retry Complete! Found ${foundCount} more venues`);
  console.log(`Updated: ${BREEZIT_PATH}`);
}

main().catch(console.error);
