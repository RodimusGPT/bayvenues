/**
 * Check for logo images in venue header_images
 * Usage:
 *   npx tsx scripts/check-logo-images.ts                    # Check ALL venues
 *   npx tsx scripts/check-logo-images.ts --prefix cn-       # Check China venues only
 *   npx tsx scripts/check-logo-images.ts --region Shanghai  # Check Shanghai region only
 *   npx tsx scripts/check-logo-images.ts --prefix ca- --region Vancouver  # Combined
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Patterns that suggest an image is a logo
const logoPatterns = [
  /logo/i,
  /brand/i,
  /icon/i,
  /_og\./i,
  /og_image/i,
  /og-image/i,
  /favicon/i,
  /avatar/i,
  /\/static\/.*\/images\/.*\.(png|svg)$/i, // Often logos
  /header.*logo/i,
  /etc\/designs/i, // AEM logos
  /share-image/i,
  /social-share/i,
  /opengraph/i,
];

// Patterns that suggest small/thumbnail images (not useful)
const smallImagePatterns = [
  /thumb/i,
  /thumbnail/i,
  /small/i,
  /_s\./i,
  /_xs\./i,
  /100x100/i,
  /150x150/i,
  /200x200/i,
];

// Known bad image sources
const badSources = [
  'fourseasons.com/etc/designs', // FS logo path
  'cache.marriott.com', // Often 403
  'FS_Header_Logo',
];

async function checkLogoImages() {
  const args = process.argv.slice(2);
  const regionIndex = args.indexOf('--region');
  const region = regionIndex !== -1 ? args[regionIndex + 1] : null;
  const prefixIndex = args.indexOf('--prefix');
  const prefix = prefixIndex !== -1 ? args[prefixIndex + 1] : null;

  console.log('🔍 Checking for logo/small images in venue headers...\n');

  let query = supabase
    .from('venues')
    .select('id, name, region, header_images');

  // Filter by ID prefix if provided (e.g., 'cn-' for China, 'ca-' for Canada)
  if (prefix) {
    query = query.like('id', `${prefix}%`);
    console.log(`   Filtering by ID prefix: ${prefix}%\n`);
  }

  if (region) {
    query = query.eq('region', region);
    console.log(`   Filtering by region: ${region}\n`);
  }

  // If neither prefix nor region specified, check all venues
  if (!prefix && !region) {
    console.log('   Checking ALL venues (use --prefix or --region to filter)\n');
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('Error fetching venues:', error);
    return;
  }

  interface Issue {
    venue: string;
    id: string;
    imageUrl: string;
    reason: string;
    position: number;
  }

  const issues: Issue[] = [];

  for (const venue of venues || []) {
    const images = venue.header_images as { url: string; source?: string }[] | null;

    if (!images || images.length === 0) continue;

    images.forEach((img, idx) => {
      const url = img.url;

      // Check logo patterns
      for (const pattern of logoPatterns) {
        if (pattern.test(url)) {
          issues.push({
            venue: venue.name,
            id: venue.id,
            imageUrl: url,
            reason: `Matches logo pattern: ${pattern}`,
            position: idx + 1,
          });
          break;
        }
      }

      // Check small image patterns
      for (const pattern of smallImagePatterns) {
        if (pattern.test(url)) {
          issues.push({
            venue: venue.name,
            id: venue.id,
            imageUrl: url,
            reason: `Matches small/thumbnail pattern: ${pattern}`,
            position: idx + 1,
          });
          break;
        }
      }

      // Check known bad sources
      for (const badSource of badSources) {
        if (url.includes(badSource)) {
          issues.push({
            venue: venue.name,
            id: venue.id,
            imageUrl: url,
            reason: `Known problematic source: ${badSource}`,
            position: idx + 1,
          });
          break;
        }
      }
    });
  }

  if (issues.length === 0) {
    console.log('✅ No logo/small images detected!\n');
    return;
  }

  // Group by venue
  const byVenue = new Map<string, Issue[]>();
  for (const issue of issues) {
    const key = `${issue.venue} (${issue.id})`;
    if (!byVenue.has(key)) {
      byVenue.set(key, []);
    }
    byVenue.get(key)!.push(issue);
  }

  console.log(`🚨 Found ${issues.length} potential logo/small images across ${byVenue.size} venues:\n`);

  for (const [venueName, venueIssues] of byVenue) {
    console.log(`📍 ${venueName}:`);
    for (const issue of venueIssues) {
      const posLabel = issue.position === 1 ? '⚠️  FIRST IMAGE' : `Image #${issue.position}`;
      console.log(`   ${posLabel}: ${issue.reason}`);
      console.log(`      URL: ${issue.imageUrl.substring(0, 100)}${issue.imageUrl.length > 100 ? '...' : ''}`);
    }
    console.log('');
  }

  // Summary
  const firstImageIssues = issues.filter(i => i.position === 1);
  console.log('════════════════════════════════════════════════════');
  console.log(`📊 Summary:`);
  console.log(`   Total issues: ${issues.length}`);
  console.log(`   First image issues: ${firstImageIssues.length} (most critical)`);
  console.log(`   Venues affected: ${byVenue.size}`);
  console.log('════════════════════════════════════════════════════');
}

checkLogoImages().catch(console.error);
