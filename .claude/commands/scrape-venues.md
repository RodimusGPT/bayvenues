# Scrape Venues Command

Discover and add wedding venues from a specified location to the Supabase database.

## Usage
```
/scrape-venues <location>
/scrape-venues <location> --limit <n>
/scrape-venues <location> --dry-run
/scrape-venues <location> --skip-enrichment
```

## Arguments
- `location` (required): The location to search for venues (e.g., "Tuscany, Italy", "Napa Valley, California")
- `--limit <n>`: Maximum number of venues to discover (default: 20)
- `--dry-run`: Preview discovered venues without saving to database
- `--skip-enrichment`: Skip Google Places/YouTube enrichment phase

## Tools Used
- **WebSearch**: Discover venue candidates
- **WebFetch**: Scrape venue websites for details
- **Supabase MCP**: Store venues in database
  - Project ID: `tpgruvfobcgzictihwrp`
  - `mcp__supabase__execute_sql`: Query and insert data
  - `mcp__supabase__search_docs`: Reference Supabase documentation if needed

## Execution Instructions

When this command is invoked, follow this 4-phase pipeline:

---

### PHASE 1: DISCOVERY

Use WebSearch to find wedding venue candidates in the specified location.

**Search Queries to Execute** (run 3-4 searches):
1. `best wedding venues <location>`
2. `luxury wedding venues <location>`
3. `destination wedding venues <location>`
4. `top rated wedding venues <location> 2024`

**For Each Search Result**:
1. Classify URLs as:
   - **Direct venue sites**: Keep the URL and extract venue name from title
   - **Aggregator sites** (theknot.com, weddingwire.com, junebugweddings.com, brides.com): Note for potential WebFetch to extract multiple venues
   - **Irrelevant** (pinterest, instagram, youtube, yelp reviews): Skip

2. Build a candidate list with:
   - Venue name (from search result title)
   - Website URL
   - Brief description (from search snippet)

**Deduplication (Stage 1 - Within Discovery)**:
See the DEDUPLICATION section below for the full algorithm.
- Remove duplicates found across multiple searches
- Normalize and compare venue names
- Compare website domains

**Output**: Display discovered candidates in a table:
```
| # | Venue Name | Website | Source |
|---|------------|---------|--------|
| 1 | Villa San Michele | https://... | WebSearch |
```

---

### PHASE 2: SCRAPING (per venue)

For each discovered venue, use WebFetch to extract details from their website.

**Data to Extract**:
1. **Name**: Confirm/refine from page title or h1
2. **Description**: Meta description or first paragraph about the venue
3. **Capacity**: Look for numbers near "guests", "capacity", "accommodate"
4. **Pricing**: Look for "$", "€", "starting from", "per person", "venue fee"
5. **Contact**: Phone numbers, email addresses
6. **Address**: Full address, look in footer or contact page
7. **Instagram**: Extract from `<a href="instagram.com/...">` links
8. **Header Image**: Extract `og:image` meta tag or first hero image

**Venue Type Detection** (based on name + description):
```
Winery/Vineyard: winery, vineyard, wine, vino, cantina
Villa/Estate: villa, manor, palazzo, chateau, estate, mansion
Castle: castle, castello, fortress, citadel
Garden: garden, botanical, park, arboretum
Hotel/Resort: hotel, resort, spa
Barn/Rustic: barn, farm, ranch, rustic
Beach/Waterfront: beach, waterfront, oceanfront, seaside, lakeside
Restaurant: restaurant, ristorante, dining
Historic: historic, heritage, landmark, century
Modern/Industrial: modern, loft, industrial, contemporary
```

**Setting Detection**:
- "outdoor", "garden", "terrace", "patio" → Outdoor
- "indoor", "ballroom", "hall" → Indoor
- Most venues: ["Indoor", "Outdoor"]

**Output**: Show scraped data per venue:
```
[2/15] Scraping: Villa San Michele
  ✓ Capacity: 80-150 guests
  ✓ Instagram: @villasanmichele
  ✓ Type: Villa, Garden
  ✗ Pricing: Not found
```

---

### PHASE 3: ENRICHMENT (unless --skip-enrichment)

**Google Places Enrichment**:
Use the Supabase MCP to check if venue already exists, then use WebSearch to find Google Maps listing:
- Search: `<venue name> <location> site:google.com/maps`
- Extract: rating, review count from search snippet if visible

**YouTube Video Search** (IMPORTANT):
For each venue, search YouTube to find a relevant wedding video:

1. **Search Query**: `<venue name> wedding` (e.g., "Villa San Michele wedding")

2. **Use WebSearch** to find the best YouTube video:
   ```
   WebSearch: "<venue name> wedding site:youtube.com"
   ```

3. **Evaluate Results** - Pick the FIRST result that:
   - Is an actual wedding video (not a tour/promo if possible)
   - Shows the venue clearly
   - Has decent quality (prefer videos with high view counts)
   - Is from a reputable channel (wedding videographer, venue official)

4. **Extract Video Data**:
   - `videoId`: Extract from URL (e.g., `dQw4w9WgXcQ` from `youtube.com/watch?v=dQw4w9WgXcQ`)
   - `title`: Video title from search result
   - `url`: Full YouTube URL

5. **Store in venue record**:
   ```json
   "videos": [{"title": "Beautiful Wedding at Villa San Michele", "url": "https://www.youtube.com/watch?v=VIDEO_ID"}]
   ```

6. **Use thumbnail as header image** (if no better image exists):
   ```json
   "header_image": {"url": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg", "source": "youtube"}
   ```

   Thumbnail URL formats:
   - Max resolution: `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`
   - High quality: `https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg`
   - Medium: `https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg`

7. **Store search query for future updates**:
   ```sql
   youtube_search = '<venue name> wedding'
   ```

**Skip enrichment if**:
- `--skip-enrichment` flag is set
- Venue already exists in database with videos

---

### PHASE 4: STORAGE

**⚠️ PREREQUISITE: Run Stage 2 Deduplication BEFORE any inserts!**
See the DEDUPLICATION section below for the full algorithm.
Query existing venues in the target region and compare against scraped venues.

**Region/Country Mapping**:
Reference the existing REGION_TO_COUNTRY mapping from `src/types/venue.ts`:
```typescript
// Italy regions: Tuscany, Campania, Veneto, Sicily, Lombardy, Puglia, Lazio
// Greece regions: Santorini, Crete, Mykonos, Rhodes, Corfu, Athens Riviera, Peloponnese
// USA regions: North Bay, Peninsula, South Bay, Monterey, Santa Cruz, Carmel
// etc.
```

If the location maps to an existing region, use it. Otherwise:
1. Determine the country from the location
2. Use the location name as a new region
3. Note: New regions may need to be added to REGION_TO_COUNTRY

**ID Generation**:
Match existing pattern based on region. Query existing venues first:
```sql
SELECT id FROM venues WHERE region = 'Santorini' ORDER BY id DESC LIMIT 1;
```

**Region Prefix Mapping**:
```
Italy (all regions): it-001, it-002...
  - Tuscany, Campania, Veneto, Sicily, Lombardy, Puglia, Lazio
Greece (all regions): gr-001, gr-002...
  - Santorini, Crete, Mykonos, Rhodes, Corfu, Athens Riviera, Peloponnese
Portugal (all regions): pt-001, pt-002...
  - Algarve, Sintra, Lisbon, Alentejo, Douro Valley, Porto, Dao
Spain (all regions): es-001, es-002...
  - Mallorca, Catalonia, Ibiza, Andalucia, Madrid, Basque Country
France (all regions): fr-001, fr-002...
  - Provence, Loire Valley, French Riviera, Champagne, Normandy, Paris Area, Bordeaux, Southwest France, Beaujolais
Switzerland (all regions): ch-001, ch-002...
  - Lugano/Ticino, Lucerne, Interlaken, St. Moritz/Engadine, Lake Geneva, Zermatt/Alps, Zurich
USA - Bay Area (by subregion):
  - North Bay: nb-001...
  - Peninsula: pb-001...
  - South Bay: sb-001...
  - Monterey: my-001...
  - Santa Cruz: sc-001...
  - Carmel: cm-001...
```

For new regions/countries, generate a 2-letter prefix from the country code.

**Supabase Insert**:
Use `mcp__supabase__apply_migration` for DDL or `mcp__supabase__execute_sql` for inserts.

**Venue Record Structure** (based on existing schema):
```sql
INSERT INTO venues (
  id, name, region, subregion, address, description,
  capacity_min, capacity_max, price_min, price_max, price_unit,
  website, phone, google_maps_url,
  location,  -- PostGIS POINT format: POINT(lng lat)
  photos, videos, reviews, header_image, header_images, youtube_search,
  google_place_id, google_rating, google_reviews_count,
  google_formatted_address, google_phone, google_website,
  source
) VALUES (
  'gr-025',                          -- id: prefix + 3-digit number
  'Rocabella Santorini',             -- name
  'Santorini',                       -- region (must exist in regions table)
  'Imerovigli',                      -- subregion
  'Imerovigli, Santorini 847 00',    -- address
  'Luxury boutique hotel...',        -- description
  50, 150,                           -- capacity_min, capacity_max (null if unknown)
  15000, 35000, 'venue_fee',         -- price_min, price_max, price_unit (null if unknown)
  'https://rocabella.com',           -- website
  '+30 22860 24568',                 -- phone
  'https://maps.google.com/...',     -- google_maps_url
  ST_SetSRID(ST_MakePoint(25.4234, 36.4308), 4326),  -- location as PostGIS point
  '{"instagram": "@rocabella", "google": ""}',       -- photos JSON
  '[{"title": "Wedding at Rocabella", "url": "https://youtube.com/..."}]',  -- videos JSON
  '{"summary": "", "pros": [], "cons": []}',         -- reviews JSON
  '{"url": "https://...", "source": "og_image"}',    -- header_image JSON
  '[{"url": "...", "source": "google"}]',            -- header_images JSON array
  'Rocabella Santorini wedding',     -- youtube_search query
  NULL,                              -- google_place_id (from enrichment)
  4.8, 245,                          -- google_rating, google_reviews_count
  NULL, NULL, NULL,                  -- google_formatted_address, google_phone, google_website
  'scraper'                          -- source identifier
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  capacity_min = COALESCE(EXCLUDED.capacity_min, venues.capacity_min),
  capacity_max = COALESCE(EXCLUDED.capacity_max, venues.capacity_max),
  header_image = COALESCE(EXCLUDED.header_image, venues.header_image),
  header_images = COALESCE(EXCLUDED.header_images, venues.header_images),
  videos = COALESCE(EXCLUDED.videos, venues.videos),
  google_rating = COALESCE(EXCLUDED.google_rating, venues.google_rating),
  google_reviews_count = COALESCE(EXCLUDED.google_reviews_count, venues.google_reviews_count);
```

**Junction Tables**:
After inserting venue, link venue types and settings:

```sql
-- First, get the venue_type IDs for the detected types
-- Available venue types: Winery, Villa, Castle, Garden, Hotel, Barn, Beach, Restaurant, Historic, Modern, Estate, Boutique Hotel, Country Club, etc.

-- Insert venue type relationships
INSERT INTO venue_venue_types (venue_id, venue_type_id)
SELECT 'gr-025', id FROM venue_types WHERE name IN ('Villa', 'Boutique Hotel')
ON CONFLICT (venue_id, venue_type_id) DO NOTHING;

-- Insert setting relationships (Indoor, Outdoor, or both)
INSERT INTO venue_settings (venue_id, setting_id)
SELECT 'gr-025', id FROM settings WHERE name IN ('Indoor', 'Outdoor')
ON CONFLICT (venue_id, setting_id) DO NOTHING;
```

**Ensure Region Exists**:
Before inserting venues, check/create the region:
```sql
-- Check if region exists
SELECT name, country FROM regions WHERE name = 'Santorini';

-- If not exists, insert it
INSERT INTO regions (name, country) VALUES ('Santorini', 'Greece')
ON CONFLICT (name) DO NOTHING;
```

---

### DRY RUN MODE

If `--dry-run` is specified:
1. Execute Phase 1 (Discovery) and Phase 2 (Scraping)
2. Display all collected data in a formatted table
3. Show what WOULD be inserted but don't execute SQL
4. Useful for previewing before committing to database

---

### PROGRESS REPORTING

Display progress throughout execution:

```
════════════════════════════════════════════════════
 VENUE SCRAPER - Tuscany, Italy
════════════════════════════════════════════════════

[PHASE 1/4] Discovery
  Searching: "best wedding venues Tuscany Italy"
  Searching: "luxury wedding venues Tuscany Italy"
  Searching: "destination wedding venues Tuscany Italy"
  Raw candidates: 45

  [DEDUP Stage 1] Removing duplicates within discovery...
    - "Villa San Michele" = "The Villa San Michele" (name match)
    - "Borgo Stomennano" duplicate from search 2
    - "Il Borro" = "Il Borro Relais" (name match)
  After dedup: 28 unique candidates

[PHASE 2/4] Scraping Websites
  [1/28] Villa San Michele... ✓ (capacity: 80-150, type: Villa)
  [2/28] Castello di Vincigliata... ✓ (capacity: 100-200, type: Castle)
  [3/28] Borgo Santo Pietro... ✗ (timeout - will retry)
  ...
  Completed: 25/28, Failed: 3

[PHASE 3/4] Enrichment
  Google ratings: 22/25 found
  YouTube videos: 18/25 found

[PHASE 4/4] Storage
  [DEDUP Stage 2] Checking against existing database...
  Existing Tuscany venues in DB: 15

  Comparison results:
    - Villa San Michele: EXISTS (id: it-042) → SKIP
    - Castello di Vincigliata: EXISTS (it-038) → UPDATE (new images)
    - Borgo Stomennano: NOT FOUND → INSERT as it-089
    ...

  Final Results:
    ├─ New venues inserted: 18
    ├─ Existing venues updated: 4
    └─ Skipped (duplicates): 3

════════════════════════════════════════════════════
 COMPLETE
   Tuscany now has 33 venues (+18 new)
   Dedup prevented 3 duplicates
════════════════════════════════════════════════════
```

---

### ERROR HANDLING

- **WebFetch timeout**: Skip venue, log for manual review
- **No capacity/pricing found**: Store with null values, flag as incomplete
- **Duplicate venue**: Skip if name+region already exists in database
- **Invalid location**: Ask user to clarify (e.g., "Did you mean Tuscany, Italy?")

---

### DEDUPLICATION (CRITICAL)

Deduplication happens at TWO stages and is MANDATORY before any database writes.

---

#### Stage 1: Within Discovery (before scraping)

After collecting candidates from multiple WebSearch queries, deduplicate the list:

**Normalization Algorithm**:
```
function normalizeVenueName(name):
  1. Convert to lowercase
  2. Remove common prefixes: "the ", "hotel ", "villa ", "castello "
  3. Remove special characters: apostrophes, hyphens, accents
  4. Remove common suffixes: " hotel", " resort", " venue", " weddings"
  5. Collapse multiple spaces to single space
  6. Trim whitespace

  Example: "The Villa San Michele Resort" → "san michele"
```

**Domain Extraction**:
```
function extractDomain(url):
  1. Parse URL to get hostname
  2. Remove "www." prefix
  3. Return base domain

  Example: "https://www.villasanmichele.com/weddings" → "villasanmichele.com"
```

**Dedup Logic**:
```
For each candidate in discovered_list:
  normalized_name = normalizeVenueName(candidate.name)
  domain = extractDomain(candidate.website)

  Check if ANY existing candidate has:
    - Same normalized_name (fuzzy match, >80% similarity)
    - OR same domain

  If match found: SKIP (it's a duplicate)
  If no match: ADD to unique_candidates list
```

**Output After Stage 1**:
```
Discovery Results:
  Raw candidates: 45
  After dedup: 28
  Removed duplicates:
    - "Villa San Michele" = "The Villa San Michele Resort" (name match)
    - "Castello Banfi" duplicate from different search
```

---

#### Stage 2: Against Existing Database (before storage)

**CRITICAL**: Before inserting ANY venue, query the database to check for existing matches.

**Step 1 - Query existing venues in region**:
```sql
SELECT id, name, website,
       LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '', 'g')) as normalized_name
FROM venues
WHERE region = '<target_region>';
```

**Step 2 - For each scraped venue, check for matches**:
```sql
-- Check by normalized name similarity
SELECT id, name, website FROM venues
WHERE region = 'Santorini'
AND (
  -- Exact normalized match
  LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '', 'g'))
    = LOWER(REGEXP_REPLACE('<venue_name>', '[^a-zA-Z0-9]', '', 'g'))
  -- Or partial match (venue name contains or is contained)
  OR LOWER(name) LIKE '%<key_words>%'
  -- Or same website domain
  OR website LIKE '%<domain>%'
);
```

**Step 3 - Decision Matrix**:

| Condition | Action | Reason |
|-----------|--------|--------|
| Exact name + same region | SKIP | Already exists |
| Similar name (>80%) + same region | SKIP or UPDATE | Likely same venue |
| Same website domain | UPDATE existing | Same venue, maybe rebranded |
| Same name, different region | INSERT as new | Different location |
| No match found | INSERT as new | New venue |

**Example Check**:
```sql
-- Before inserting "Rocabella Santorini Hotel"
SELECT id, name, website FROM venues
WHERE region = 'Santorini'
AND (
  LOWER(name) LIKE '%rocabella%'
  OR website LIKE '%rocabella%'
);

-- If returns: id='gr-012', name='Rocabella Santorini'
-- Decision: SKIP (duplicate) or UPDATE existing record
```

---

#### Dedup Summary Report

At end of Phase 4, always report deduplication results:
```
Deduplication Summary:
  ├─ Stage 1 (Discovery): 45 → 28 candidates (-17 duplicates)
  ├─ Stage 2 (vs Database):
  │   ├─ New venues: 22
  │   ├─ Updated existing: 4
  │   └─ Skipped (exact duplicates): 2
  └─ Final: 22 inserted, 4 updated, 2 skipped
```

---

### IMPORTANT NOTES

1. **Rate Limiting**: Add 1-2 second delays between WebFetch calls to avoid being blocked
2. **Supabase Project ID**: Always use `tpgruvfobcgzictihwrp` for all MCP calls
3. **Respect robots.txt**: Skip sites that block scraping
4. **Quality over quantity**: Better to have 10 well-scraped venues than 50 incomplete ones
5. **Manual verification**: For venues where data couldn't be extracted, note them for manual review
6. **Coordinates**: Try to extract lat/lng from venue website or use Google Maps search. If unavailable, use approximate region center.
7. **Data validation**: Ensure capacity_min < capacity_max and price_min < price_max

---

### EXAMPLE EXECUTION

User: `/scrape-venues "Santorini, Greece" --limit 10`

1. Search for Santorini wedding venues
2. Find ~15 candidates, dedupe to 10
3. Scrape each venue website for details
4. Enrich with Google Places data
5. Generate IDs: gr-xxx (check existing Santorini venues)
6. Insert into Supabase
7. Report: "10 venues added to Santorini"
