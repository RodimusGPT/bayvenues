#!/usr/bin/env npx tsx
/**
 * Find missing venue websites using Playwright + Google Search
 * No API key required!
 *
 * Run: npx tsx scripts/enrich-websites-playwright.ts
 *
 * Options:
 *   --limit N      Only process first N venues (default: 50)
 *   --region X     Only process venues in region X
 *   --dry-run      Preview without making changes
 */

import { chromium, Browser, Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse command line args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : 50;
const regionIndex = args.indexOf('--region');
const regionFilter = regionIndex !== -1 ? args[regionIndex + 1] : undefined;

// Domains to skip (aggregators, social media, etc.)
const SKIP_DOMAINS = [
  'facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com', 'x.com',
  'youtube.com', 'pinterest.com', 'tiktok.com',
  'theknot.com', 'weddingwire.com', 'yelp.com', 'tripadvisor.com',
  'google.com', 'maps.google.com', 'goo.gl',
  'junebugweddings.com', 'brides.com', 'marthastewartweddings.com',
  'wikipedia.org', 'wikimedia.org',
  'reddit.com', 'quora.com',
  'eventbrite.com', 'meetup.com',
];

function isValidVenueWebsite(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace('www.', '').toLowerCase();
    return !SKIP_DOMAINS.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
}

function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function searchGoogleForWebsite(
  page: Page,
  venueName: string,
  region: string
): Promise<string | null> {
  try {
    // Build search query - simpler query often works better
    const query = `${venueName} ${region} wedding venue`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 20000 });

    // Wait a bit for dynamic content
    await page.waitForTimeout(1000);

    // Extract search result links using multiple selector strategies
    const results = await page.evaluate(() => {
      const links: { url: string; title: string }[] = [];

      // Strategy 1: Main search result links (cite elements contain the URL display)
      document.querySelectorAll('a[href^="http"]').forEach((a) => {
        const href = a.getAttribute('href');
        const title = a.textContent || '';

        // Skip Google internal links
        if (href &&
            !href.includes('google.com') &&
            !href.includes('webcache') &&
            !href.includes('translate.google') &&
            !href.startsWith('/')) {
          links.push({ url: href, title });
        }
      });

      // Deduplicate by URL
      const seen = new Set<string>();
      return links.filter(link => {
        if (seen.has(link.url)) return false;
        seen.add(link.url);
        return true;
      }).slice(0, 15);
    });

    const venueNameNormalized = normalizeForMatch(venueName);

    // First pass: look for exact matches in title or URL
    for (const result of results) {
      if (!isValidVenueWebsite(result.url)) continue;

      const titleNormalized = normalizeForMatch(result.title);
      const urlNormalized = normalizeForMatch(result.url);

      // Check if venue name appears in title or URL
      if (titleNormalized.includes(venueNameNormalized) ||
          urlNormalized.includes(venueNameNormalized)) {
        return result.url;
      }
    }

    // Second pass: return first valid non-aggregator result
    for (const result of results) {
      if (isValidVenueWebsite(result.url)) {
        return result.url;
      }
    }

    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (!message.includes('timeout')) {
      console.error(`\n   Error: ${message}`);
    }
    return null;
  }
}

async function main() {
  console.log('🌐 Finding missing venue websites via Google Search...\n');

  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made\n');
  }

  // Get venues without websites
  let query = supabase
    .from('venues')
    .select('id, name, region')
    .or('website.is.null,website.eq.')
    .order('region')
    .limit(limit);

  if (regionFilter) {
    query = query.eq('region', regionFilter);
    console.log(`   Filtering by region: ${regionFilter}`);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log('✅ No venues with missing websites found!');
    process.exit(0);
  }

  console.log(`📋 Found ${venues.length} venues without websites\n`);

  // Launch browser
  console.log('🚀 Launching browser...');
  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page: Page = await context.newPage();

  let fixed = 0;
  let notFound = 0;
  let errors = 0;

  try {
    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      const progress = `[${i + 1}/${venues.length}]`;

      process.stdout.write(`${progress} ${venue.name} (${venue.region})... `);

      const website = await searchGoogleForWebsite(page, venue.name, venue.region);

      if (website) {
        if (dryRun) {
          console.log(`✅ Would set: ${website}`);
          fixed++;
        } else {
          // Update database
          const { error: updateError } = await supabase
            .from('venues')
            .update({ website })
            .eq('id', venue.id);

          if (updateError) {
            console.log(`❌ Update error`);
            errors++;
          } else {
            console.log(`✅ ${website}`);
            fixed++;
          }
        }
      } else {
        console.log('⚠️  Not found');
        notFound++;
      }

      // Rate limit: 2 seconds between searches to avoid captchas
      if (i < venues.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('🌐 Website Enrichment Summary:');
  console.log(`   Fixed:     ${fixed}`);
  console.log(`   Not found: ${notFound}`);
  console.log(`   Errors:    ${errors}`);
  console.log('═'.repeat(50));
}

main().catch(console.error);
