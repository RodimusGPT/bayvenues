// Script to generate SQL for missing venues
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/venues.json')));
const missingIds = new Set([
  'fr-040','fr-041','fr-042','fr-043','fr-044','fr-045','fr-046','es-047',
  'nb-023','nb-024','mon-018','nb-025','nb-026','nb-027','nb-028','nb-029',
  'pen-022','pen-023','nb-030','nb-031','pen-024','nb-032','nb-033','nb-034',
  'nb-035','nb-036','pen-025','pen-026','pen-027','pen-028','pen-029','pen-030',
  'pen-031','pen-032','pen-033','pen-034','pen-035','pen-036','pen-037','pen-038',
  'pen-039','pen-040','pen-041','pen-042','pen-043','pen-044','pen-045','nb-037',
  'nb-038','nb-039'
]);

const missingVenues = data.venues.filter(v => missingIds.has(v.id));

function escapeStr(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function toJson(obj) {
  if (obj === null || obj === undefined) return 'NULL';
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function toNum(val) {
  if (val === null || val === undefined) return 'NULL';
  return val;
}

function toInt(val) {
  if (val === null || val === undefined) return 'NULL';
  return Math.round(val);
}

function toBool(val) {
  if (val === null || val === undefined) return 'NULL';
  return val ? 'TRUE' : 'FALSE';
}

function generateInsertSQL(v) {
  const lat = v.location?.lat ?? v.google_location?.lat;
  const lng = v.location?.lng ?? v.google_location?.lng;
  const locationSQL = (lat && lng)
    ? `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`
    : 'NULL';

  return `INSERT INTO venues (
    id, name, region, subregion, address, description,
    capacity_min, capacity_max, price_min, price_max, price_unit,
    website, phone, google_maps_url, location,
    photos, videos, reviews, header_image, header_images,
    youtube_search, google_place_id, google_rating, google_reviews_count,
    google_formatted_address, google_phone, google_website, google_business_status,
    google_types, google_opening_hours, google_photos, google_reviews,
    google_wheelchair_accessible, source
  ) VALUES (
    ${escapeStr(v.id)}, ${escapeStr(v.name)}, ${escapeStr(v.region)}, ${escapeStr(v.subregion)}, ${escapeStr(v.address)}, ${escapeStr(v.description)},
    ${toInt(v.capacity?.min)}, ${toInt(v.capacity?.max)}, ${toInt(v.price_range?.min)}, ${toInt(v.price_range?.max)}, ${escapeStr(v.price_range?.currency || 'EUR')},
    ${escapeStr(v.website)}, ${escapeStr(v.phone)}, ${escapeStr(v.google_maps_url)}, ${locationSQL},
    ${toJson(v.photos)}, ${toJson(v.videos || null)}, ${toJson(v.reviews || null)}, ${toJson(v.headerImage || null)}, ${toJson(v.headerImages || null)},
    ${escapeStr(v.youtubeSearch)}, ${escapeStr(v.google_place_id)}, ${toNum(v.google_rating)}, ${toInt(v.google_reviews_count)},
    ${escapeStr(v.google_formatted_address)}, ${escapeStr(v.google_phone)}, ${escapeStr(v.google_website)}, ${escapeStr(v.google_business_status)},
    ${toJson(v.google_types)}, ${toJson(v.google_opening_hours)}, ${toJson(v.google_photos)}, ${toJson(v.google_reviews)},
    ${toBool(v.google_wheelchair_accessible)}, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;`;
}

// Output each venue's SQL to a separate file
const outputDir = path.join(__dirname, 'venue-inserts');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

missingVenues.forEach((v, i) => {
  const sql = generateInsertSQL(v);
  fs.writeFileSync(path.join(outputDir, `${i.toString().padStart(2, '0')}-${v.id}.sql`), sql);
});

// Also output a combined SQL file with all inserts
const allSQL = missingVenues.map(generateInsertSQL).join('\n\n');
fs.writeFileSync(path.join(outputDir, 'all-missing-venues.sql'), allSQL);

console.log(`Generated ${missingVenues.length} SQL files in scripts/venue-inserts/`);

// Output the first SQL for verification
console.log('\n--- First INSERT (for verification) ---\n');
console.log(generateInsertSQL(missingVenues[0]));
