// Generate batch SQL for all missing venues
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

function toInt(val) {
  if (val === null || val === undefined) return 'NULL';
  return Math.round(val);
}

function toNum(val) {
  if (val === null || val === undefined) return 'NULL';
  return val;
}

// Generate minimal INSERT (essential columns only)
function generateMinimalInsert(v) {
  const lat = v.location?.lat ?? v.google_location?.lat;
  const lng = v.location?.lng ?? v.google_location?.lng;
  const locationSQL = (lat && lng)
    ? `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`
    : 'NULL';

  return `(${escapeStr(v.id)}, ${escapeStr(v.name)}, ${escapeStr(v.region)}, ${escapeStr(v.subregion)}, ${escapeStr(v.address)}, ${escapeStr(v.description?.substring(0, 500))}, ${toInt(v.capacity?.min)}, ${toInt(v.capacity?.max)}, ${toInt(v.price_range?.min)}, ${toInt(v.price_range?.max)}, ${escapeStr(v.price_range?.currency || 'EUR')}, ${escapeStr(v.website)}, ${escapeStr(v.google_maps_url)}, ${locationSQL}, ${escapeStr(v.google_place_id)}, ${toNum(v.google_rating)}, ${toInt(v.google_reviews_count)}, 'json_migration')`;
}

// Generate batch SQL in groups of 10
const batchSize = 10;
const batches = [];

for (let i = 0; i < missingVenues.length; i += batchSize) {
  const batch = missingVenues.slice(i, i + batchSize);
  const values = batch.map(generateMinimalInsert).join(',\n  ');
  const sql = `INSERT INTO venues (id, name, region, subregion, address, description, capacity_min, capacity_max, price_min, price_max, price_unit, website, google_maps_url, location, google_place_id, google_rating, google_reviews_count, source) VALUES
  ${values}
ON CONFLICT (id) DO NOTHING;`;

  batches.push({
    batchNum: Math.floor(i / batchSize) + 1,
    count: batch.length,
    ids: batch.map(v => v.id),
    sql
  });
}

// Write batches to files
batches.forEach((batch, idx) => {
  fs.writeFileSync(
    path.join(__dirname, `venue-batch-${idx}.sql`),
    batch.sql
  );
});

console.log(`Generated ${batches.length} batch files`);
console.log('\nBatch summary:');
batches.forEach(b => {
  console.log(`  Batch ${b.batchNum}: ${b.count} venues (${b.ids.join(', ')})`);
});
