/**
 * Generate minimal SQL for MCP migration
 * Usage: node scripts/mcp-batch.mjs <start> <count>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const venuesPath = path.join(__dirname, '..', 'src', 'data', 'venues.json');
const data = JSON.parse(fs.readFileSync(venuesPath, 'utf-8'));

function e(str) {
  if (str === null || str === undefined || str === '') return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function j(obj) {
  if (obj === null || obj === undefined) return 'NULL';
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

const start = parseInt(process.argv[2] || '0', 10);
const count = parseInt(process.argv[3] || '10', 10);
const venues = data.venues.slice(start, start + count);

if (venues.length === 0) {
  console.log('DONE');
  process.exit(0);
}

const values = venues.map(v => {
  const loc = v.location?.lat != null && v.location?.lng != null
    ? `ST_GeogFromText('POINT(${v.location.lng} ${v.location.lat})')::geography`
    : 'NULL';

  // Minimal data - just what's needed for the app
  const headerImg = v.headerImage ? j(v.headerImage) : (v.headerImages?.[0] ? j(v.headerImages[0]) : 'NULL');
  const reviews = v.reviews ? j({summary: v.reviews.summary?.substring(0, 200), pros: v.reviews.pros?.slice(0,2), cons: v.reviews.cons?.slice(0,2)}) : 'NULL';

  return `(${e(v.id)},${e(v.name)},${e(v.region)},${e(v.subregion)},${e(v.address)},${e(v.description?.substring(0,500))},${v.capacity?.min??'NULL'},${v.capacity?.max??'NULL'},${v.price_range?.min??'NULL'},${v.price_range?.max??'NULL'},${e(v.price_range?.unit)},${e(v.website)},${e(v.phone)},${e(v.google_maps_url)},${loc},${j(v.photos)},${j(v.videos?.slice(0,2))},${reviews},${headerImg},NULL,${e(v.youtubeSearch)},${e(v.google_place_id)},${v.google_rating??'NULL'},${v.google_reviews_count??'NULL'},${e(v.google_formatted_address)},${e(v.google_phone)},${e(v.google_website)},${e(v.google_business_status)},${j(v.google_types)},${j(v.google_opening_hours)},NULL,NULL,${v.google_wheelchair_accessible??'NULL'},${j(v.breezit_pricing)},${v.breezit_rating??'NULL'},${v.breezit_reviews??'NULL'},${e(v.source)})`;
}).join(',');

console.log(`INSERT INTO venues (id,name,region,subregion,address,description,capacity_min,capacity_max,price_min,price_max,price_unit,website,phone,google_maps_url,location,photos,videos,reviews,header_image,header_images,youtube_search,google_place_id,google_rating,google_reviews_count,google_formatted_address,google_phone,google_website,google_business_status,google_types,google_opening_hours,google_photos,google_reviews,google_wheelchair_accessible,breezit_pricing,breezit_rating,breezit_reviews,source) VALUES ${values} ON CONFLICT (id) DO NOTHING;`);
