import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const venuesPath = path.join(__dirname, '..', 'src', 'data', 'venues.json');
const data = JSON.parse(fs.readFileSync(venuesPath, 'utf-8'));

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return 'NULL';
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

// Generate venue INSERT statements - smaller batches for MCP
const venues = data.venues;
const BATCH_SIZE = 5;

// Clean up old batch files
fs.readdirSync(__dirname).filter(f => f.startsWith('venue-batch-')).forEach(f => {
  fs.unlinkSync(path.join(__dirname, f));
});

for (let batch = 0; batch * BATCH_SIZE < venues.length; batch++) {
  const start = batch * BATCH_SIZE;
  const end = Math.min(start + BATCH_SIZE, venues.length);
  const batchVenues = venues.slice(start, end);

  const values = batchVenues.map(v => {
    const loc = v.location?.lat != null && v.location?.lng != null
      ? `ST_GeogFromText('POINT(${v.location.lng} ${v.location.lat})')::geography`
      : 'NULL';

    return `(
      ${escapeSql(v.id)}, ${escapeSql(v.name)}, ${escapeSql(v.region)}, ${escapeSql(v.subregion)},
      ${escapeSql(v.address)}, ${escapeSql(v.description)},
      ${v.capacity?.min ?? 'NULL'}, ${v.capacity?.max ?? 'NULL'},
      ${v.price_range?.min ?? 'NULL'}, ${v.price_range?.max ?? 'NULL'}, ${escapeSql(v.price_range?.unit)},
      ${escapeSql(v.website || null)}, ${escapeSql(v.phone || null)}, ${escapeSql(v.google_maps_url || null)},
      ${loc},
      ${escapeJson(v.photos)}, ${escapeJson(v.videos)}, ${escapeJson(v.reviews)},
      ${escapeJson(v.headerImage)}, ${escapeJson(v.headerImages)}, ${escapeSql(v.youtubeSearch || null)},
      ${escapeSql(v.google_place_id || null)}, ${v.google_rating ?? 'NULL'}, ${v.google_reviews_count ?? 'NULL'},
      ${escapeSql(v.google_formatted_address || null)}, ${escapeSql(v.google_phone || null)},
      ${escapeSql(v.google_website || null)}, ${escapeSql(v.google_business_status || null)},
      ${escapeJson(v.google_types)}, ${escapeJson(v.google_opening_hours)},
      ${escapeJson(v.google_photos)}, ${escapeJson(v.google_reviews)},
      ${v.google_wheelchair_accessible ?? 'NULL'},
      ${escapeJson(v.breezit_pricing)}, ${v.breezit_rating ?? 'NULL'}, ${v.breezit_reviews ?? 'NULL'},
      ${escapeSql(v.source || null)}
    )`;
  }).join(',\n');

  const sql = `INSERT INTO venues (id, name, region, subregion, address, description, capacity_min, capacity_max, price_min, price_max, price_unit, website, phone, google_maps_url, location, photos, videos, reviews, header_image, header_images, youtube_search, google_place_id, google_rating, google_reviews_count, google_formatted_address, google_phone, google_website, google_business_status, google_types, google_opening_hours, google_photos, google_reviews, google_wheelchair_accessible, breezit_pricing, breezit_rating, breezit_reviews, source) VALUES ${values} ON CONFLICT (id) DO NOTHING;`;

  fs.writeFileSync(path.join(__dirname, `venue-batch-${String(batch).padStart(3, '0')}.sql`), sql);
}

console.log(`Generated ${Math.ceil(venues.length / BATCH_SIZE)} batches of ${BATCH_SIZE} venues each`);
