/**
 * Generate ultra-minimal SQL for MCP migration
 * Usage: node scripts/mcp-mini.mjs <start> <count>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'venues.json'), 'utf-8'));

const e = s => s == null || s === '' ? 'NULL' : "'" + String(s).replace(/'/g, "''") + "'";
const j = o => o == null ? 'NULL' : "'" + JSON.stringify(o).replace(/'/g, "''") + "'::jsonb";

const start = parseInt(process.argv[2] || '0', 10);
const count = parseInt(process.argv[3] || '20', 10);
const venues = data.venues.slice(start, start + count);

if (!venues.length) { console.log('DONE'); process.exit(0); }

const vals = venues.map(v => {
  const loc = v.location?.lat != null ? `ST_GeogFromText('POINT(${v.location.lng} ${v.location.lat})')::geography` : 'NULL';
  return `(${e(v.id)},${e(v.name)},${e(v.region)},${e(v.subregion)},${e(v.address)},${e(v.description?.substring(0,300))},${v.capacity?.min??'NULL'},${v.capacity?.max??'NULL'},${v.price_range?.min??'NULL'},${v.price_range?.max??'NULL'},${e(v.price_range?.unit)},${e(v.website)},${e(v.phone)},${e(v.google_maps_url)},${loc},${j(v.photos)},NULL,${j(v.reviews?{summary:v.reviews.summary?.substring(0,150)}:null)},${j(v.headerImage||v.headerImages?.[0])},NULL,NULL,${e(v.google_place_id)},${v.google_rating??'NULL'},${v.google_reviews_count??'NULL'},${e(v.google_formatted_address)},${e(v.google_phone)},${e(v.google_website)},${e(v.google_business_status)},NULL,NULL,NULL,NULL,${v.google_wheelchair_accessible??'NULL'},${j(v.breezit_pricing)},${v.breezit_rating??'NULL'},${v.breezit_reviews??'NULL'},${e(v.source)})`;
}).join(',');

console.log(`INSERT INTO venues (id,name,region,subregion,address,description,capacity_min,capacity_max,price_min,price_max,price_unit,website,phone,google_maps_url,location,photos,videos,reviews,header_image,header_images,youtube_search,google_place_id,google_rating,google_reviews_count,google_formatted_address,google_phone,google_website,google_business_status,google_types,google_opening_hours,google_photos,google_reviews,google_wheelchair_accessible,breezit_pricing,breezit_rating,breezit_reviews,source) VALUES ${vals} ON CONFLICT (id) DO NOTHING;`);
