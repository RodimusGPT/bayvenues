#!/usr/bin/env npx tsx
/**
 * Audit all venues in the database to check data completeness
 *
 * Run: npx tsx scripts/audit-venues.ts
 *
 * Options:
 *   --region X      Only audit venues in region X
 *   --country X     Only audit venues in country X
 *   --verbose       Show details for each issue found
 *   --json          Output results as JSON
 *   --fix-types     Auto-fix missing venue types from name/description
 *   --fix-settings  Auto-fix missing settings (default to Indoor+Outdoor)
 *   --fix-websites  Auto-fix missing websites via Google Places API (also adds phone/rating)
 *   --limit N       Limit website fixes to N venues (default: 50)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GOOGLE_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

// Parse command line args
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const jsonOutput = args.includes('--json');
const fixTypes = args.includes('--fix-types');
const fixSettings = args.includes('--fix-settings');
const fixWebsites = args.includes('--fix-websites');
const regionIndex = args.indexOf('--region');
const regionFilter = regionIndex !== -1 ? args[regionIndex + 1] : undefined;
const countryIndex = args.indexOf('--country');
const countryFilter = countryIndex !== -1 ? args[countryIndex + 1] : undefined;
const limitIndex = args.indexOf('--limit');
const websiteFixLimit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : 50;

// Validate GOOGLE_API_KEY if --fix-websites is used
if (fixWebsites && !GOOGLE_API_KEY) {
  console.error('❌ Missing VITE_GOOGLE_MAPS_API_KEY (required for --fix-websites)');
  process.exit(1);
}

// Severity levels for issues
type Severity = 'critical' | 'high' | 'medium' | 'low';

interface AuditIssue {
  venueId: string;
  venueName: string;
  region: string;
  field: string;
  issue: string;
  severity: Severity;
  currentValue?: unknown;
}

interface AuditSummary {
  totalVenues: number;
  venuesAudited: number;
  issuesFound: number;
  issuesBySeverity: Record<Severity, number>;
  issuesByField: Record<string, number>;
  issuesByRegion: Record<string, number>;
  venuesWithIssues: number;
  completenessScore: number;
}

interface HeaderImage {
  url: string;
  source: string;
}

interface Video {
  title: string;
  url: string;
}

// Venue type detection patterns
const VENUE_TYPE_PATTERNS: Record<string, RegExp> = {
  'Winery': /\b(winery|vineyard|wine|vino|cantina)\b/i,
  'Villa': /\b(villa|manor|palazzo)\b/i,
  'Estate': /\b(estate|mansion|chateau)\b/i,
  'Castle': /\b(castle|castello|fortress|citadel|manor house)\b/i,
  'Garden': /\b(garden|botanical|arboretum)\b/i,
  'Hotel': /\b(hotel|resort|spa)\b/i,
  'Boutique Hotel': /\b(boutique hotel|inn)\b/i,
  'Barn': /\b(barn|farm|ranch|rustic)\b/i,
  'Beach': /\b(beach|waterfront|oceanfront|seaside|lakeside|coastal)\b/i,
  'Restaurant': /\b(restaurant|ristorante|dining|bistro)\b/i,
  'Historic': /\b(historic|heritage|landmark|century|ancient)\b/i,
  'Modern': /\b(modern|loft|industrial|contemporary)\b/i,
  'Country Club': /\b(country club|golf|club)\b/i,
  'Rooftop': /\b(rooftop|terrace)\b/i,
  'Vineyard': /\b(vineyard|vines|grape)\b/i,
};

function detectVenueTypes(name: string, description: string): string[] {
  const text = `${name} ${description}`.toLowerCase();
  const detected: string[] = [];

  for (const [type, pattern] of Object.entries(VENUE_TYPE_PATTERNS)) {
    if (pattern.test(text)) {
      detected.push(type);
    }
  }

  return detected;
}

async function getVenueTypes(): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('venue_types')
    .select('id, name');

  if (error) throw error;

  const map = new Map<string, number>();
  for (const row of data || []) {
    map.set(row.name, row.id);
  }
  return map;
}

async function getSettings(): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('settings')
    .select('id, name');

  if (error) throw error;

  const map = new Map<string, number>();
  for (const row of data || []) {
    map.set(row.name, row.id);
  }
  return map;
}

interface PlaceResult {
  place_id: string;
  name: string;
  website?: string;
  formatted_phone_number?: string;
  rating?: number;
  user_ratings_total?: number;
}

async function findPlaceAndGetDetails(
  venueName: string,
  region: string
): Promise<PlaceResult | null> {
  try {
    // Step 1: Find Place from Text
    const findUrl = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
    findUrl.searchParams.set('input', `${venueName} ${region}`);
    findUrl.searchParams.set('inputtype', 'textquery');
    findUrl.searchParams.set('fields', 'place_id,name');
    findUrl.searchParams.set('key', GOOGLE_API_KEY!);

    const findResponse = await fetch(findUrl.toString());
    const findData = await findResponse.json();

    if (findData.status !== 'OK' || !findData.candidates?.length) {
      return null;
    }

    const placeId = findData.candidates[0].place_id;

    // Step 2: Get Place Details (including website)
    const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    detailsUrl.searchParams.set('place_id', placeId);
    detailsUrl.searchParams.set('fields', 'name,website,formatted_phone_number,rating,user_ratings_total');
    detailsUrl.searchParams.set('key', GOOGLE_API_KEY!);

    const detailsResponse = await fetch(detailsUrl.toString());
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK' || !detailsData.result) {
      return null;
    }

    return {
      place_id: placeId,
      ...detailsData.result,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n   Error: ${message}`);
    return null;
  }
}

async function fixMissingWebsites(): Promise<number> {
  console.log('\n🌐 Finding missing venue websites via Google Places API...');

  // Get venues without websites
  let query = supabase
    .from('venues')
    .select('id, name, region, phone, google_rating, google_reviews_count')
    .or('website.is.null,website.eq.')
    .order('region')
    .limit(websiteFixLimit);

  if (regionFilter) {
    query = query.eq('region', regionFilter);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    return 0;
  }

  if (!venues || venues.length === 0) {
    console.log('   ✅ No venues with missing websites found!');
    return 0;
  }

  console.log(`   Found ${venues.length} venues without websites (limit: ${websiteFixLimit})`);
  console.log(`   This will use ~${venues.length * 2} Places API requests\n`);

  let fixed = 0;
  let notFound = 0;
  let errors = 0;
  let bonusData = 0;

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    const progress = `[${i + 1}/${venues.length}]`;

    process.stdout.write(`${progress} ${venue.name} (${venue.region})... `);

    const place = await findPlaceAndGetDetails(venue.name, venue.region);

    if (place?.website) {
      // Build update object with any bonus data we found
      const updateData: Record<string, unknown> = {
        website: place.website,
      };

      // Add phone if missing
      if (!venue.phone && place.formatted_phone_number) {
        updateData.phone = place.formatted_phone_number;
        bonusData++;
      }

      // Add rating if missing
      if (!venue.google_rating && place.rating) {
        updateData.google_rating = place.rating;
        updateData.google_reviews_count = place.user_ratings_total || 0;
        bonusData++;
      }

      // Update database
      const { error: updateError } = await supabase
        .from('venues')
        .update(updateData)
        .eq('id', venue.id);

      if (updateError) {
        console.log(`❌ Update error`);
        errors++;
      } else {
        const extras = [];
        if (updateData.phone) extras.push('phone');
        if (updateData.google_rating) extras.push('rating');
        const extraStr = extras.length > 0 ? ` (+${extras.join(', ')})` : '';
        console.log(`✅ ${place.website}${extraStr}`);
        fixed++;
      }
    } else if (place) {
      console.log('⚠️  Place found but no website');
      notFound++;
    } else {
      console.log('⚠️  Not found');
      notFound++;
    }

    // Rate limit: 100ms between requests (Places API allows 50 QPS)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '─'.repeat(40));
  console.log(`🌐 Website Fix Summary:`);
  console.log(`   Fixed:        ${fixed}`);
  console.log(`   Not found:    ${notFound}`);
  console.log(`   Errors:       ${errors}`);
  console.log(`   Bonus data:   ${bonusData} (phone/rating)`);

  return fixed;
}

async function auditVenues(): Promise<{ issues: AuditIssue[]; summary: AuditSummary }> {
  const issues: AuditIssue[] = [];

  // Build query
  let query = supabase
    .from('venues')
    .select(`
      id, name, region, subregion, address, description,
      capacity_min, capacity_max, price_min, price_max, price_unit,
      website, phone, google_maps_url, location,
      header_image, header_images, videos,
      google_rating, google_reviews_count,
      venue_venue_types (venue_type_id),
      venue_settings (setting_id)
    `);

  if (regionFilter) {
    query = query.eq('region', regionFilter);
  }

  const { data: venues, error } = await query;

  if (error) {
    console.error('❌ Error fetching venues:', error.message);
    process.exit(1);
  }

  // Get regions for country filtering
  let regionToCountry: Map<string, string> = new Map();
  if (countryFilter) {
    const { data: regions } = await supabase
      .from('regions')
      .select('name, country')
      .eq('country', countryFilter);

    for (const r of regions || []) {
      regionToCountry.set(r.name, r.country);
    }
  }

  // Get venue types and settings for fixing
  const venueTypesMap = await getVenueTypes();
  const settingsMap = await getSettings();

  const venuesWithIssues = new Set<string>();
  const issuesByField: Record<string, number> = {};
  const issuesByRegion: Record<string, number> = {};

  let fixedTypesCount = 0;
  let fixedSettingsCount = 0;

  for (const venue of venues || []) {
    // Country filter
    if (countryFilter && regionToCountry.size > 0) {
      if (!regionToCountry.has(venue.region)) continue;
    }

    const addIssue = (field: string, issue: string, severity: Severity, currentValue?: unknown) => {
      issues.push({
        venueId: venue.id,
        venueName: venue.name,
        region: venue.region,
        field,
        issue,
        severity,
        currentValue,
      });
      venuesWithIssues.add(venue.id);
      issuesByField[field] = (issuesByField[field] || 0) + 1;
      issuesByRegion[venue.region] = (issuesByRegion[venue.region] || 0) + 1;
    };

    // === CRITICAL CHECKS ===

    // Location (required for map display)
    if (!venue.location) {
      addIssue('location', 'Missing coordinates - venue won\'t appear on map', 'critical');
    }

    // === HIGH PRIORITY CHECKS ===

    // Header images (need 3+ for good gallery)
    const headerImages = venue.header_images as HeaderImage[] | null;
    if (!headerImages || headerImages.length === 0) {
      addIssue('header_images', 'No header images - venue card will show fallback', 'high');
    } else if (headerImages.length < 3) {
      addIssue('header_images', `Only ${headerImages.length} images (need 3+)`, 'medium', headerImages.length);
    }

    // Venue types (required for filtering)
    const venueTypes = venue.venue_venue_types as { venue_type_id: number }[] | null;
    if (!venueTypes || venueTypes.length === 0) {
      if (fixTypes) {
        // Auto-detect and fix
        const detected = detectVenueTypes(venue.name, venue.description || '');
        if (detected.length > 0) {
          const typeIds = detected
            .map(t => venueTypesMap.get(t))
            .filter((id): id is number => id !== undefined);

          if (typeIds.length > 0) {
            const inserts = typeIds.map(typeId => ({
              venue_id: venue.id,
              venue_type_id: typeId,
            }));

            const { error: insertError } = await supabase
              .from('venue_venue_types')
              .upsert(inserts, { onConflict: 'venue_id,venue_type_id' });

            if (!insertError) {
              fixedTypesCount++;
              if (verbose) {
                console.log(`   ✅ Fixed venue types for ${venue.name}: ${detected.join(', ')}`);
              }
            }
          }
        } else {
          addIssue('venue_types', 'No venue types assigned - filtering won\'t work', 'high');
        }
      } else {
        addIssue('venue_types', 'No venue types assigned - filtering won\'t work', 'high');
      }
    }

    // Venue settings (required for filtering)
    const venueSettings = venue.venue_settings as { setting_id: number }[] | null;
    if (!venueSettings || venueSettings.length === 0) {
      if (fixSettings) {
        // Default to Indoor + Outdoor
        const indoorId = settingsMap.get('Indoor');
        const outdoorId = settingsMap.get('Outdoor');

        if (indoorId && outdoorId) {
          const { error: insertError } = await supabase
            .from('venue_settings')
            .upsert([
              { venue_id: venue.id, setting_id: indoorId },
              { venue_id: venue.id, setting_id: outdoorId },
            ], { onConflict: 'venue_id,setting_id' });

          if (!insertError) {
            fixedSettingsCount++;
            if (verbose) {
              console.log(`   ✅ Fixed settings for ${venue.name}: Indoor, Outdoor`);
            }
          }
        }
      } else {
        addIssue('venue_settings', 'No settings assigned - filtering won\'t work', 'high');
      }
    }

    // Website
    if (!venue.website || venue.website.trim() === '') {
      addIssue('website', 'Missing website URL', 'high');
    }

    // === MEDIUM PRIORITY CHECKS ===

    // Description quality
    if (!venue.description || venue.description.length < 50) {
      addIssue('description', 'Description too short (<50 chars)', 'medium', venue.description?.length || 0);
    }

    // Capacity
    if (!venue.capacity_min || !venue.capacity_max) {
      addIssue('capacity', 'Missing capacity information', 'medium');
    } else if (venue.capacity_min > venue.capacity_max) {
      addIssue('capacity', `Invalid capacity range: ${venue.capacity_min} > ${venue.capacity_max}`, 'medium');
    }

    // Videos
    const videos = venue.videos as Video[] | null;
    if (!videos || videos.length === 0) {
      addIssue('videos', 'No videos - missing rich media content', 'medium');
    }

    // === LOW PRIORITY CHECKS ===

    // Pricing
    if (!venue.price_min && !venue.price_max) {
      addIssue('pricing', 'Missing pricing information', 'low');
    } else if (venue.price_min && venue.price_max && venue.price_min > venue.price_max) {
      addIssue('pricing', `Invalid price range: ${venue.price_min} > ${venue.price_max}`, 'medium');
    }

    // Phone
    if (!venue.phone || venue.phone.trim() === '') {
      addIssue('phone', 'Missing phone number', 'low');
    }

    // Google rating
    if (!venue.google_rating) {
      addIssue('google_rating', 'Missing Google rating', 'low');
    }

    // Subregion
    if (!venue.subregion || venue.subregion.trim() === '') {
      addIssue('subregion', 'Missing subregion', 'low');
    }
  }

  // Count issues by severity
  const issuesBySeverity: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const issue of issues) {
    issuesBySeverity[issue.severity]++;
  }

  // Calculate completeness score (0-100)
  const totalChecks = (venues?.length || 0) * 10; // 10 checks per venue
  const completenessScore = totalChecks > 0
    ? Math.round(((totalChecks - issues.length) / totalChecks) * 100)
    : 100;

  // Report fixes
  if (fixTypes && fixedTypesCount > 0) {
    console.log(`\n🔧 Auto-fixed venue types for ${fixedTypesCount} venues`);
  }
  if (fixSettings && fixedSettingsCount > 0) {
    console.log(`🔧 Auto-fixed settings for ${fixedSettingsCount} venues`);
  }

  return {
    issues,
    summary: {
      totalVenues: venues?.length || 0,
      venuesAudited: countryFilter ? [...new Set((venues || []).filter(v => regionToCountry.has(v.region)).map(v => v.id))].length : venues?.length || 0,
      issuesFound: issues.length,
      issuesBySeverity,
      issuesByField,
      issuesByRegion,
      venuesWithIssues: venuesWithIssues.size,
      completenessScore,
    },
  };
}

function printReport(issues: AuditIssue[], summary: AuditSummary) {
  if (jsonOutput) {
    console.log(JSON.stringify({ issues, summary }, null, 2));
    return;
  }

  console.log('\n' + '═'.repeat(60));
  console.log(' 🔍 VENUE DATA AUDIT REPORT');
  console.log('═'.repeat(60));

  // Summary stats
  console.log('\n📊 SUMMARY');
  console.log('─'.repeat(40));
  console.log(`  Total venues:        ${summary.totalVenues}`);
  console.log(`  Venues audited:      ${summary.venuesAudited}`);
  console.log(`  Venues with issues:  ${summary.venuesWithIssues}`);
  console.log(`  Total issues found:  ${summary.issuesFound}`);
  console.log(`  Completeness score:  ${summary.completenessScore}%`);

  // Issues by severity
  console.log('\n🚨 ISSUES BY SEVERITY');
  console.log('─'.repeat(40));
  const severityEmoji: Record<Severity, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢',
  };
  for (const [severity, count] of Object.entries(summary.issuesBySeverity)) {
    if (count > 0) {
      console.log(`  ${severityEmoji[severity as Severity]} ${severity.toUpperCase()}: ${count}`);
    }
  }

  // Issues by field
  console.log('\n📋 ISSUES BY FIELD');
  console.log('─'.repeat(40));
  const sortedFields = Object.entries(summary.issuesByField)
    .sort((a, b) => b[1] - a[1]);
  for (const [field, count] of sortedFields) {
    console.log(`  ${field}: ${count}`);
  }

  // Top regions with issues
  console.log('\n🌍 TOP REGIONS WITH ISSUES');
  console.log('─'.repeat(40));
  const sortedRegions = Object.entries(summary.issuesByRegion)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  for (const [region, count] of sortedRegions) {
    console.log(`  ${region}: ${count}`);
  }

  // Detailed issues (if verbose)
  if (verbose && issues.length > 0) {
    console.log('\n📝 DETAILED ISSUES');
    console.log('─'.repeat(40));

    // Group by venue
    const byVenue = new Map<string, AuditIssue[]>();
    for (const issue of issues) {
      const key = `${issue.venueId}|${issue.venueName}`;
      if (!byVenue.has(key)) {
        byVenue.set(key, []);
      }
      byVenue.get(key)!.push(issue);
    }

    for (const [key, venueIssues] of byVenue) {
      const [id, name] = key.split('|');
      console.log(`\n  [${id}] ${name} (${venueIssues[0].region})`);
      for (const issue of venueIssues) {
        console.log(`    ${severityEmoji[issue.severity]} ${issue.field}: ${issue.issue}`);
      }
    }
  }

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS');
  console.log('─'.repeat(40));

  if (summary.issuesByField['location'] > 0) {
    console.log(`  • Run geocoding: npx tsx scripts/geocode-venues.mjs`);
  }
  if (summary.issuesByField['header_images'] > 0) {
    console.log(`  • Enrich images: npx tsx scripts/enrich-images-playwright.ts`);
  }
  if (summary.issuesByField['videos'] > 0) {
    console.log(`  • Enrich videos: npx tsx scripts/enrich-youtube-simple.ts`);
  }
  if (summary.issuesByField['venue_types'] > 0) {
    console.log(`  • Fix venue types: npx tsx scripts/audit-venues.ts --fix-types`);
  }
  if (summary.issuesByField['venue_settings'] > 0) {
    console.log(`  • Fix settings: npx tsx scripts/audit-venues.ts --fix-settings`);
  }
  if (summary.issuesByField['website'] > 0) {
    console.log(`  • Fix websites: npx tsx scripts/audit-venues.ts --fix-websites`);
  }

  console.log('\n' + '═'.repeat(60));
}

async function main() {
  console.log('🔍 Starting venue data audit...');

  if (regionFilter) {
    console.log(`   Filtering by region: ${regionFilter}`);
  }
  if (countryFilter) {
    console.log(`   Filtering by country: ${countryFilter}`);
  }

  // Fix websites first if requested (before audit so audit shows updated results)
  if (fixWebsites) {
    await fixMissingWebsites();
  }

  const { issues, summary } = await auditVenues();
  printReport(issues, summary);
}

main().catch(console.error);
