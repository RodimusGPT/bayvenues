/**
 * Generate SQL for MCP migration - streamlined data to fit size limits
 * Run: node scripts/mcp-migrate.mjs [startIndex] [batchSize]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const venuesPath = path.join(__dirname, '..', 'src', 'data', 'venues.json');
const data = JSON.parse(fs.readFileSync(venuesPath, 'utf-8'));

function escapeSql(str) {
  if (str === null || str === undefined || str === '') return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return 'NULL';
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

const startIdx = parseInt(process.argv[2] || '0', 10);
const batchSize = parseInt(process.argv[3] || '10', 10);
const venues = data.venues.slice(startIdx, startIdx + batchSize);

if (venues.length === 0) {
  console.log('NO_MORE_VENUES');
  process.exit(0);
}

const values = venues.map(v => {
  const loc = v.location?.lat != null && v.location?.lng != null
    ? `ST_GeogFromText('POINT(${v.location.lng} ${v.location.lat})')::geography`
    : 'NULL';

  // Simplified photos - just keep first 3 header images
  const headerImages = v.headerImages?.slice(0, 3) || null;

  // Simplified reviews - just keep summary and first 2 pros/cons
  const reviews = v.reviews ? {
    summary: v.reviews.summary,
    pros: v.reviews.pros?.slice(0, 2),
    cons: v.reviews.cons?.slice(0, 2)
  } : null;

  return `(${escapeSql(v.id)}, ${escapeSql(v.name)}, ${escapeSql(v.region)}, ${escapeSql(v.subregion)}, ${escapeSql(v.address)}, ${escapeSql(v.description)}, ${v.capacity?.min ?? 'NULL'}, ${v.capacity?.max ?? 'NULL'}, ${v.price_range?.min ?? 'NULL'}, ${v.price_range?.max ?? 'NULL'}, ${escapeSql(v.price_range?.unit)}, ${escapeSql(v.website || null)}, ${escapeSql(v.phone || null)}, ${escapeSql(v.google_maps_url || null)}, ${loc}, ${escapeJson(v.photos)}, ${escapeJson(v.videos)}, ${escapeJson(reviews)}, ${escapeJson(v.headerImage)}, ${escapeJson(headerImages)}, ${escapeSql(v.youtubeSearch || null)}, ${escapeSql(v.google_place_id || null)}, ${v.google_rating ?? 'NULL'}, ${v.google_reviews_count ?? 'NULL'}, ${escapeSql(v.google_formatted_address || null)}, ${escapeSql(v.google_phone || null)}, ${escapeSql(v.google_website || null)}, ${escapeSql(v.google_business_status || null)}, ${escapeJson(v.google_types)}, ${escapeJson(v.google_opening_hours)}, NULL, NULL, ${v.google_wheelchair_accessible ?? 'NULL'}, ${escapeJson(v.breezit_pricing)}, ${v.breezit_rating ?? 'NULL'}, ${v.breezit_reviews ?? 'NULL'}, ${escapeSql(v.source || null)})`;
}).join(',\n');

console.log(`INSERT INTO venues (id, name, region, subregion, address, description, capacity_min, capacity_max, price_min, price_max, price_unit, website, phone, google_maps_url, location, photos, videos, reviews, header_image, header_images, youtube_search, google_place_id, google_rating, google_reviews_count, google_formatted_address, google_phone, google_website, google_business_status, google_types, google_opening_hours, google_photos, google_reviews, google_wheelchair_accessible, breezit_pricing, breezit_rating, breezit_reviews, source) VALUES ${values} ON CONFLICT (id) DO NOTHING;`);
