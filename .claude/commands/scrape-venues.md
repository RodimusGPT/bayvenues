# Scrape Venues Command

Discover and add wedding venues from a specified location to the Supabase database.

## Usage
```
/scrape-venues <location>
/scrape-venues <location> --limit <n>
/scrape-venues <location> --dry-run
/scrape-venues <location> --skip-enrichment
/scrape-venues <location> --skip-image-validation
/scrape-venues --audit-images              # Run image audit on all existing venues
/scrape-venues --enrich-images             # Enrich venues with <3 images
```

## Arguments
- `location` (required): The location to search for venues (e.g., "Tuscany, Italy", "Napa Valley, California")
- `--limit <n>`: Maximum number of venues to discover (default: 20)
- `--dry-run`: Preview discovered venues without saving to database
- `--skip-enrichment`: Skip Google Places/YouTube enrichment phase
- `--skip-image-validation`: Skip image validation and enrichment phase
- `--audit-images`: Run broken image audit on ALL existing venues (standalone mode)
- `--enrich-images`: Enrich ALL venues with <3 images (standalone mode)

## Tools Used
- **WebSearch**: Discover venue candidates
- **WebFetch**: Scrape venue websites for details
- **Supabase MCP**: Store venues in database
  - Project ID: `tpgruvfobcgzictihwrp`
  - `mcp__supabase__execute_sql`: Query and insert data
  - `mcp__supabase__search_docs`: Reference Supabase documentation if needed

## Execution Instructions

When this command is invoked, follow this 5-phase pipeline:

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
8. **Header Images (3-5 REQUIRED)**: Extract multiple images for the venue:
   - `og:image` meta tag
   - Hero/banner images from homepage
   - Gallery images if available
   - If insufficient images found, use appropriate Unsplash fallbacks based on venue type

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

**YouTube Video Search via Playwright** (PREFERRED METHOD):
Use the Playwright-based script for reliable YouTube video discovery. This method searches YouTube directly and extracts video IDs without API limits.

1. **Run the Playwright enrichment script** after venues are inserted:
   ```bash
   npx tsx scripts/enrich-youtube-simple.ts
   ```

2. **How it works**:
   - Launches headless Chromium browser
   - Searches YouTube with multiple query strategies (in order):
     1. `<venue name>` (just the name - works best!)
     2. `<venue name> venue`
     3. `<venue name> event`
     4. `<venue name> <region>`
   - Extracts up to 3 video IDs from search results
   - Updates the `videos` jsonb column with video data

3. **Search Strategy** (IMPORTANT - simpler is better!):
   - Start with just the venue name: `"Villa San Michele"`
   - Only add qualifiers if no results found
   - Avoid adding "wedding venue" - it's too restrictive and misses many venues

4. **Video Data Stored**:
   ```json
   "videos": [
     {"title": "Villa San Michele Tour", "url": "https://www.youtube.com/watch?v=VIDEO_ID"},
     {"title": "Wedding at Villa San Michele", "url": "https://www.youtube.com/watch?v=VIDEO_ID2"}
   ]
   ```

5. **YouTube Thumbnails for header_images**:
   The script also adds YouTube thumbnails to `header_images` if empty:
   ```json
   "header_images": [
     {"url": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg", "source": "youtube"}
   ]
   ```

   YouTube thumbnail URL formats:
   - Max resolution: `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`
   - High quality: `https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg`

6. **Manual Alternative** (if Playwright unavailable):
   Use WebSearch as fallback:
   ```
   WebSearch: "<venue name> site:youtube.com"
   ```
   Extract video IDs from URLs in results.

7. **Rate Limiting**:
   - The script includes 2.5 second delays between searches
   - Processes in batches of 20 venues
   - Respects YouTube's rate limits

**Google Images Enrichment via Playwright** (PREFERRED - no API key needed):
Use the Playwright-based script for reliable Google Images scraping:

1. **Run the enrichment script**:
   ```bash
   npx tsx scripts/enrich-images-playwright.ts
   ```

2. **Options**:
   - `--limit N`: Process only N venues
   - `--region X`: Only process venues in region X
   - `--dry-run`: Preview without making changes

3. **How it works**:
   - Launches headless Chromium browser
   - Searches Google Images for `<venue name> <region> wedding venue`
   - Extracts 5 thumbnail images from search results
   - Updates `header_images` jsonb array with source: "google"

4. **Image Data Stored**:
   ```json
   "header_images": [
     {"url": "https://encrypted-tbn0.gstatic.com/...", "thumbnail": "...", "source": "google"}
   ]
   ```

**Alternative: Serper API** (if Playwright unavailable):
```bash
node scripts/enrich-google-images.mjs
```
Requires `SERPER_API_KEY` in `.env.local` (get free key at serper.dev - 2,500 queries)

**Unsplash Fallback Images by Venue Type** (use when scraped images < 3):
```
Resort:     https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop
Beach:      https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop
Winery:     https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=800&fit=crop
Vineyard:   https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&h=800&fit=crop
Garden:     https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop
Estate:     https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop
Mansion:    https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop
Barn:       https://images.unsplash.com/photo-1510076857177-7470076d4098?w=1200&h=800&fit=crop
Waterfront: https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop
Golf:       https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=800&fit=crop
Industrial: https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop
Farmhouse:  https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&h=800&fit=crop
Historic:   https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop
Castle:     https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=1200&h=800&fit=crop
Villa:      https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop
default:    https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop
```

**Skip enrichment if**:
- `--skip-enrichment` flag is set
- Venue already exists in database with videos

**Skip image validation if**:
- `--skip-image-validation` flag is set
- Running in `--dry-run` mode

---

### PHASE 4: IMAGE VALIDATION & ENRICHMENT

After enrichment, validate and enhance header images to ensure quality.

**⚠️ CRITICAL: This phase is MANDATORY after every scrape operation!**

---

#### 4A. Logo & Problematic Image Detection (RUN FIRST!)

Many venue websites return logos, app store badges, or social media icons instead of actual venue photos. These MUST be detected and replaced.

**Run the logo detection script**:
```bash
npx tsx scripts/check-logo-images.ts
```

**Patterns that indicate LOGO/USELESS images** (auto-detected):
```
URL Pattern                    | Problem
-------------------------------|----------------------------------
/logo/i                        | Logo image
/brand/i                       | Brand asset
/icon/i                        | Icon (app store, social, etc.)
/_og\./i, /og_image/i          | Generic OG image (often logo)
/favicon/i                     | Favicon
/avatar/i                      | User avatar
/etc\/designs/i                | AEM CMS logos (Four Seasons, etc.)
/share-image/i, /opengraph/i   | Social share images (often logos)
/header.*logo/i                | Header logo assets
/App-Store/i, /Google-Play/i   | App store badges
/Instagram/i, /Facebook/i      | Social media icons
/FS_Header_Logo/i              | Four Seasons logo specifically
```

**Patterns that indicate SMALL/THUMBNAIL images** (unusable):
```
/thumb/i, /thumbnail/i         | Thumbnail version
/small/i, /_s\./i, /_xs\./i    | Small size indicator
/100x100/, /150x150/, /200x200/| Tiny dimensions
```

**Known problematic CDN paths** (always logos/badges):
```
❌ fourseasons.com/etc/designs/     → Always returns FS logo
❌ sitecore-cd.shangri-la.com/-/media/Shangri-La/header_footer/  → App badges, social icons
❌ cache.marriott.com               → Often 403 or logo
❌ FS_Header_Logo                   → Four Seasons logo
```

**How to fix logo images**:
1. Query venues with problematic first images:
   ```sql
   SELECT id, name, header_images->0->>'url' as first_image
   FROM venues
   WHERE id LIKE '<prefix>-%'
   AND (
     header_images->0->>'url' LIKE '%logo%'
     OR header_images->0->>'url' LIKE '%icon%'
     OR header_images->0->>'url' LIKE '%etc/designs%'
     OR header_images->0->>'url' LIKE '%header_footer%'
   );
   ```

2. For each affected venue, either:
   - **Reorder**: If images 2-5 are good, remove the logo and keep others
   - **Re-fetch**: Use Kiwi Collection or Five Star Alliance to get proper images:
     ```bash
     npx tsx scripts/enrich-images-smart.ts --venue-id <id> --force
     ```

3. **Verify the fix**:
   ```sql
   SELECT id, name, header_images->0->>'url' as new_first_image
   FROM venues WHERE id = '<venue_id>';
   ```

---

#### 4B. Broken Image Detection

**Image Validation** (detect broken images):
Run the audit script to find venues with broken header images:
```bash
npx tsx scripts/audit-broken-images.ts
```

**What it checks**:
- HTTP 403/404 errors (blocked hotlinks, deleted images)
- Incomplete URLs (missing parameters like `?id=`)
- Non-image content-types (video/mp4, text/html, application/octet-stream)
- YouTube maxresdefault thumbnails that don't exist (fallback to hqdefault)
- Homepage URLs instead of actual image files

**Auto-fix broken images**:
```bash
npx tsx scripts/audit-broken-images.ts --fix
```
This fetches 5 replacement images from Google via Serper API.

**Image Enrichment** (ensure 3-5 images per venue):
For venues with fewer than 3 header images, use the smart enrichment script (RECOMMENDED):
```bash
npx tsx scripts/enrich-images-smart.ts
```

This script searches multiple quality sources in priority order:
1. Official venue website (og:image, hero images)
2. Kiwi Collection CDN (professional photography)
3. Five Star Alliance (high-quality hotel images)
4. Quality image search (filtered for trusted sources)
5. YouTube thumbnails (from venue videos)
6. Unsplash fallback (last resort)

**Options**:
- `--limit N`: Process only N venues
- `--region X`: Only process venues in region X
- `--venue-id X`: Process specific venue
- `--dry-run`: Preview without making changes
- `--force`: Re-enrich venues with only Unsplash images

Requires `SERPER_API_KEY` in .env.local for travel site searches.

**Alternatives** (if Serper unavailable):
```bash
npx tsx scripts/enrich-images-playwright.ts  # Uses Playwright for Google Images
npx tsx scripts/enrich-low-image-venues.ts   # Older Serper-only approach
```

**Priority Order for Images** (CRITICAL - follow this order!):
1. **Official venue website** (og:image, hero images, gallery) - HIGHEST QUALITY
2. **Travel booking sites** with high-res CDNs:
   - Kiwi Collection: `cdn.kiwicollection.com` (professional photography)
   - Five Star Alliance: `fivestaralliance.com/files/`
   - Venue Report: `venuereport.com/defer_uploads/venue_gallery_big_without_cropping/`
   - Secret Retreats: `secret-retreats.com/wp-content/uploads/`
3. **Wikimedia Commons** for landmarks: `upload.wikimedia.org/wikipedia/commons/thumb/`
4. **YouTube thumbnails** (ONLY as fallback, use sddefault.jpg)
5. **Unsplash fallbacks** (LAST RESORT - looks generic)

**⚠️ AVOID THESE LOW-QUALITY SOURCES**:
```
❌ encrypted-tbn0.gstatic.com - Google thumbnails (150-200px, very low res!)
❌ img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg - Often returns gray placeholder
❌ img.youtube.com/vi/VIDEO_ID/hqdefault.jpg - Only 480x360 (too small for headers)
```

**YouTube Thumbnail Best Practices**:
```
✅ Use: https://img.youtube.com/vi/VIDEO_ID/sddefault.jpg (640x480, reliable)
⚠️ Avoid: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg (often gray placeholder)
⚠️ Avoid: https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg (only 480x360, too small)
```

**How to Find High-Res Images for a Venue**:
1. WebFetch the official venue website - look for og:image, hero banners
2. If official site blocks (403), WebSearch for: `"<venue name>" site:kiwicollection.com OR site:fivestaralliance.com`
3. WebFetch the travel site listing page to extract CDN image URLs
4. For landmarks, use Wikimedia Commons: `https://upload.wikimedia.org/wikipedia/commons/thumb/<path>/1280px-<filename>`
5. YouTube thumbnails are LAST RESORT only

**Common Broken Image Sources to Avoid**:
- `cdn0.weddingwire.com` - blocks hotlinking (403)
- `lookaside.instagram.com` - returns HTML
- `lookaside.fbsbx.com` - returns HTML
- `www.fourseasons.com/etc/designs/` - returns logo instead of venue
- `breezit.s3.eu-north-1.amazonaws.com` - often returns octet-stream

---

### PHASE 5: STORAGE

**⚠️ PREREQUISITE: Run Stage 2 Deduplication BEFORE any inserts!**
See the DEDUPLICATION section below for the full algorithm.
Query existing venues in the target region and compare against scraped venues.

**Region/Country Mapping**:
Reference the existing REGION_TO_COUNTRY mapping from `src/types/venue.ts`:
```typescript
// Italy regions: Tuscany, Campania, Veneto, Sicily, Lombardy, Puglia, Lazio
// Greece regions: Santorini, Crete, Mykonos, Rhodes, Corfu, Athens Riviera, Peloponnese
// Indonesia regions: Bali, Lombok, Komodo
// Japan regions: Tokyo, Kyoto, Okinawa
// USA regions: North Bay, Peninsula, South Bay, Monterey, Santa Cruz, Carmel
// etc.
```

**⚠️ CRITICAL: The `region` field must match an entry in the `regions` table!**
- ✅ CORRECT: `region='Tokyo'` (matches regions table)
- ❌ WRONG: `region='Japan'` (country name - won't match, venues won't show in filters!)

The pattern is:
- `region` = city/island/area name (e.g., 'Bali', 'Santorini', 'Tokyo')
- `subregion` = more specific location within region (e.g., 'Ubud', 'Oia', 'Shibuya')

If the location maps to an existing region, use it. Otherwise:
1. Determine the country from the location
2. Use the city/island/area name as the region (NOT the country name)
3. Add the new region to the `regions` table with correct country
4. Add to REGION_TO_COUNTRY in `src/types/venue.ts`

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
Japan (all regions): jp-001, jp-002...
  - Tokyo, Kyoto, Okinawa
Indonesia (all regions): id-001, id-002...
  - Bali, Lombok, Komodo
Thailand (all regions): th-001, th-002...
  - Phuket, Koh Samui, Chiang Mai, Krabi, etc.
USA - Bay Area (by subregion):
  - North Bay: nb-001...
  - Peninsula: pb-001...
  - South Bay: sb-001...
  - Monterey: my-001...
  - Santa Cruz: sc-001...
  - Carmel: cm-001...
USA - Hawaii: hi-001, hi-002...
  - Regions: Oahu, Maui, Kauai, Big Island
  - ⚠️ Remember to set state='Hawaii' in regions table!
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
SELECT name, country, state FROM regions WHERE name = 'Santorini';

-- If not exists, insert it (non-USA countries)
INSERT INTO regions (name, country, continent) VALUES ('Santorini', 'Greece', 'Europe')
ON CONFLICT (name) DO NOTHING;

-- ⚠️ USA REGIONS REQUIRE STATE FIELD for proper filter grouping!
-- USA regions MUST include the state field, otherwise they won't appear
-- grouped under state headings in the filter UI.
INSERT INTO regions (name, country, state, continent) VALUES
  ('Oahu', 'USA', 'Hawaii', 'North America'),
  ('Maui', 'USA', 'Hawaii', 'North America')
ON CONFLICT (name) DO NOTHING;
```

**USA State Grouping** (CRITICAL):
For USA regions, the `state` field determines how regions are grouped in the filter:
- Without state: Region appears ungrouped and may be hidden
- With state: Region appears under the state heading (e.g., "Hawaii" → Oahu, Maui, Kauai, Big Island)

Common USA states and their regions:
```
California: North Bay, Peninsula, South Bay, Napa Valley, Sonoma, etc.
Florida: Miami, Orlando, Tampa Bay, Palm Beach, Naples, Florida Keys
Hawaii: Oahu, Maui, Kauai, Big Island
Massachusetts: Boston, Cape Cod, Marthas Vineyard, Nantucket
New York: Hudson Valley, The Hamptons
```

---

### POST-INSERT CHECKLIST (MANDATORY)

⚠️ **After inserting venues, ALL of these steps are REQUIRED for venues to work properly in the app:**

#### 0. Update Frontend Country Mapping (NEW COUNTRIES ONLY)
If adding venues from a **new country** not already in the system, update `src/types/venue.ts`:

```typescript
// 1. Add to Country type
export type Country =
  | 'USA' | 'Portugal' | ... | 'NewCountry';

// 2. Add to COUNTRIES array
export const COUNTRIES: Country[] = [..., 'NewCountry'];

// 3. Add region mappings to REGION_TO_COUNTRY
export const REGION_TO_COUNTRY: Record<string, Country> = {
  // ... existing entries
  // NewCountry
  'NewCountry': 'NewCountry',  // Country-level region
  'Region1': 'NewCountry',     // Subregion
  'Region2': 'NewCountry',     // Subregion
};

// 4. Add flag emoji to COUNTRY_FLAGS
export const COUNTRY_FLAGS: Record<Country, string> = {
  // ... existing entries
  'NewCountry': '🇯🇵',  // Country flag emoji
};
```

**Why this matters**: Without this mapping, venues won't appear in country filters and won't show correctly on the map.

**IMPORTANT**: `src/types/venue.ts` is the SINGLE SOURCE OF TRUTH for `COUNTRY_FLAGS`. The filter component (`CountryRegionFilter.tsx`) imports flags from here - you do NOT need to update any other file for country flags to appear in the UI.

#### 1. Ensure Region Exists
```sql
-- Check if region exists
SELECT name, country, state, continent FROM regions WHERE name = '<subregion>';

-- If not exists, insert it with country and continent
INSERT INTO regions (name, country, continent) VALUES
  ('<subregion>', '<country>', '<continent>')
ON CONFLICT (name) DO UPDATE SET country = EXCLUDED.country, continent = EXCLUDED.continent;

-- Example for Japan:
INSERT INTO regions (name, country, continent) VALUES
  ('Tokyo', 'Japan', 'Asia'),
  ('Kyoto', 'Japan', 'Asia'),
  ('Okinawa', 'Japan', 'Asia')
ON CONFLICT (name) DO UPDATE SET country = EXCLUDED.country, continent = EXCLUDED.continent;

-- ⚠️ USA REGIONS: MUST include the `state` field!
-- Without the state field, USA regions won't appear grouped properly in the filter UI.
-- Example for Hawaii:
INSERT INTO regions (name, country, state, continent) VALUES
  ('Oahu', 'USA', 'Hawaii', 'North America'),
  ('Maui', 'USA', 'Hawaii', 'North America'),
  ('Kauai', 'USA', 'Hawaii', 'North America'),
  ('Big Island', 'USA', 'Hawaii', 'North America')
ON CONFLICT (name) DO UPDATE SET
  country = EXCLUDED.country,
  state = EXCLUDED.state,  -- Critical for USA!
  continent = EXCLUDED.continent;
```

#### 2. Link Venue Types (REQUIRED for type filters)
```sql
-- Get available venue type IDs
SELECT id, name FROM venue_types WHERE name IN ('Luxury Hotel', 'Beach Resort', 'Garden', 'Historic', 'Japanese', 'Villa', 'Castle', 'Winery');

-- Link venue to its types (2-4 types per venue recommended)
INSERT INTO venue_venue_types (venue_id, venue_type_id) VALUES
  ('<venue_id>', <type_id_1>),
  ('<venue_id>', <type_id_2>),
  ('<venue_id>', <type_id_3>)
ON CONFLICT DO NOTHING;

-- Common type IDs for reference:
-- 87: Luxury Hotel, 88: Luxury Resort, 18: Beach Resort, 113: Resort
-- 57: Garden, 66: Historic, 83: Japanese, 131: Villa, 25: Castle
-- 140: Winery, 103: Oceanfront, 128: Urban, 120: Spa
```

#### 3. Link Venue Settings (REQUIRED for setting filters)
```sql
-- Get available setting IDs
SELECT id, name FROM settings WHERE name IN ('Indoor', 'Outdoor', 'Garden', 'Chapel', 'Beach', 'Sea View', 'City View', 'Riverside');

-- Link venue to its settings (2-4 settings per venue recommended)
INSERT INTO venue_settings (venue_id, setting_id) VALUES
  ('<venue_id>', <setting_id_1>),
  ('<venue_id>', <setting_id_2>),
  ('<venue_id>', <setting_id_3>)
ON CONFLICT DO NOTHING;

-- Common setting IDs for reference:
-- 50: Indoor, 81: Outdoor, 35: Garden, 20: Chapel, 10: Beach
-- 98: Sea View, 23: City View, 93: Riverside, 95: Rooftop
```

#### 4. Geocode Venues (REQUIRED for map pins)
```bash
npx tsx scripts/geocode-venues.ts --region <region_name>
```
This uses Google Places API to:
- Add lat/lng coordinates for map markers
- Enrich with google_place_id, google_rating, google_reviews_count
- Update google_formatted_address, google_phone, google_maps_url
- **Find website via Serper** if Google Places doesn't return one (requires `SERPER_API_KEY`)

Options:
- `--enrich`: Also process venues missing website (not just coordinates)
- `--dry-run`: Preview without making changes

#### 5. Verify All Data is Complete
```sql
-- Verify venues have all required data
SELECT
  v.id, v.name, v.subregion,
  v.location IS NOT NULL as has_coords,
  (SELECT COUNT(*) FROM venue_venue_types vvt WHERE vvt.venue_id = v.id) as type_count,
  (SELECT COUNT(*) FROM venue_settings vs WHERE vs.venue_id = v.id) as setting_count,
  (SELECT EXISTS(SELECT 1 FROM regions r WHERE r.name = v.subregion)) as region_exists
FROM venues v
WHERE v.region = '<region>'
ORDER BY v.subregion, v.name;

-- All venues should have:
-- has_coords = true
-- type_count >= 2
-- setting_count >= 2
-- region_exists = true
```

⚠️ **Never skip these steps** - venues without coordinates won't appear on the map, and venues without types/settings won't appear in filtered searches!

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

[PHASE 1/5] Discovery
  Searching: "best wedding venues Tuscany Italy"
  Searching: "luxury wedding venues Tuscany Italy"
  Searching: "destination wedding venues Tuscany Italy"
  Raw candidates: 45

  [DEDUP Stage 1] Removing duplicates within discovery...
    - "Villa San Michele" = "The Villa San Michele" (name match)
    - "Borgo Stomennano" duplicate from search 2
    - "Il Borro" = "Il Borro Relais" (name match)
  After dedup: 28 unique candidates

[PHASE 2/5] Scraping Websites
  [1/28] Villa San Michele... ✓ (capacity: 80-150, type: Villa)
  [2/28] Castello di Vincigliata... ✓ (capacity: 100-200, type: Castle)
  [3/28] Borgo Santo Pietro... ✗ (timeout - will retry)
  ...
  Completed: 25/28, Failed: 3

[PHASE 3/5] Enrichment
  Google ratings: 22/25 found
  YouTube videos: 18/25 found

[PHASE 4/5] Image Validation & Enrichment
  Checking header images...
    ❌ Villa Rosa: HTTP 403 (weddingwire hotlink blocked)
    ❌ Il Borro: Incomplete URL (missing ?id= parameter)
    ✓ 23/25 images valid

  Fixing broken images...
    ✅ Villa Rosa: Fixed with 5 Google Images
    ✅ Il Borro: Fixed with 5 Google Images

  Enriching low-image venues...
    [1/3] Castello Banfi: 1 → 5 images
    [2/3] Borgo Santo Pietro: 1 → 5 images
    [3/3] Villa Medicea: 1 → 5 images

  Image Summary:
    ├─ Broken images fixed: 2
    ├─ Low-image venues enriched: 3
    └─ All venues now have 5 images ✓

[PHASE 5/5] Storage
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
   All venues have 5 header images ✓
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

1. **HEADER IMAGES (3-5 REQUIRED)**: Every venue MUST have 3-5 header images stored in the `header_images` jsonb array. Sources in priority order:
   - **Google Images** via Serper API (best quality) - `node scripts/enrich-google-images.mjs`
   - Scraped from venue website (og:image, hero images, gallery)
   - YouTube video thumbnails
   - Unsplash fallbacks (LAST RESORT ONLY - looks too generic)

2. **YOUTUBE VIDEOS (REQUIRED)**: Every venue should have 1-3 YouTube videos. Use the Playwright script:
   ```bash
   npx tsx scripts/enrich-youtube-simple.ts
   ```
   Key insight: Simpler search queries work better (just venue name, not "venue name wedding venue")

3. **Rate Limiting**: Add 1-2 second delays between WebFetch calls to avoid being blocked
4. **Supabase Project ID**: Always use `tpgruvfobcgzictihwrp` for all MCP calls
5. **Respect robots.txt**: Skip sites that block scraping
6. **Quality over quantity**: Better to have 10 well-scraped venues than 50 incomplete ones
7. **Manual verification**: For venues where data couldn't be extracted, note them for manual review
8. **Coordinates (MANDATORY)**: Every venue MUST have coordinates for map pins. Run `npx tsx scripts/geocode-venues.ts` after inserting venues to geocode any missing coordinates via Google Places API. Never insert venues without running geocoding - map pins are critical for UX.
9. **Filters (MANDATORY)**: Every venue MUST have:
   - Region entry in `regions` table (for location filters)
   - Venue types linked in `venue_venue_types` (for type filters)
   - Settings linked in `venue_settings` (for Indoor/Outdoor filters)
   See POST-INSERT CHECKLIST in Phase 5 for exact SQL commands.
10. **Frontend Country Mapping (NEW COUNTRIES)**: When adding a new country, ONLY update `src/types/venue.ts`:
   - Add country to `Country` type union
   - Add country to `COUNTRIES` array
   - Add region mappings to `REGION_TO_COUNTRY`
   - Add flag emoji to `COUNTRY_FLAGS`
   This is the SINGLE SOURCE OF TRUTH - `CountryRegionFilter.tsx` imports from here automatically.
   Without this, venues won't appear in country filters or show correctly on the map.
11. **USA State Grouping (CRITICAL)**: When adding USA regions, you MUST set the `state` field in the `regions` table:
   - `INSERT INTO regions (name, country, state, continent) VALUES ('Oahu', 'USA', 'Hawaii', 'North America')`
   - Without `state`, regions won't appear grouped under state headings in the filter UI
   - Common states: California, Florida, Hawaii, Massachusetts, New York, Georgia, South Carolina, Virginia
12. **Data validation**: Ensure capacity_min < capacity_max and price_min < price_max
13. **Logo/Broken Image Check (MANDATORY)**: After EVERY scrape operation, run:
    ```bash
    npx tsx scripts/check-logo-images.ts --region <region>  # Check for logos
    npx tsx scripts/audit-broken-images.ts                   # Check for broken images
    ```
    Common issues: Four Seasons logo, Shangri-La app badges, Marriott 403 errors, small thumbnails.
    Fix by re-fetching from Kiwi Collection or Five Star Alliance.
14. **Database Country Table**: When adding a NEW country, you must ALSO add it to the `countries` database table:
    ```sql
    INSERT INTO countries (name, flag_emoji) VALUES ('Canada', '🇨🇦');
    ```
    Without this, the country flag won't appear in the filter UI (the filter reads from the database, not venue.ts).

### ENRICHMENT SCRIPTS REFERENCE

| Script | Purpose | Requires |
|--------|---------|----------|
| `scripts/enrich-images-smart.ts` | **RECOMMENDED: Smart image enrichment with travel site fallbacks** | `SERPER_API_KEY` |
| `scripts/enrich-youtube-simple.ts` | Find YouTube videos via Playwright | Playwright |
| `scripts/enrich-images-playwright.ts` | Get Google Images via Playwright | Playwright |
| `scripts/enrich-google-images.mjs` | Get Google Images via Serper API | `SERPER_API_KEY` |
| `scripts/enrich-header-images.ts` | Scrape og:image from websites | None |
| `scripts/geocode-venues.ts` | **Geocode venues + find websites (REQUIRED)** | `VITE_GOOGLE_MAPS_API_KEY`, `SERPER_API_KEY` (optional) |
| `scripts/audit-broken-images.ts` | Find & fix broken header images | `SERPER_API_KEY` for --fix |
| `scripts/enrich-low-image-venues.ts` | Add images to venues with <3 | `SERPER_API_KEY` |

**Smart Image Enrichment** (`enrich-images-smart.ts`):
```bash
# Enrich all venues with <3 images
npx tsx scripts/enrich-images-smart.ts

# Enrich specific region
npx tsx scripts/enrich-images-smart.ts --region Tokyo

# Re-enrich venues with only Unsplash fallbacks
npx tsx scripts/enrich-images-smart.ts --force --region Japan

# Enrich specific venue
npx tsx scripts/enrich-images-smart.ts --venue-id jp-004
```

Priority order for image sources:
1. Official venue website (og:image, hero images)
2. Kiwi Collection CDN (professional photography)
3. Five Star Alliance (high-quality hotel images)
4. Quality image search (filtered for trusted sources)
5. YouTube thumbnails (from venue videos)
6. Unsplash fallback (last resort - generic but high quality)

**Playwright requirement**: `npx playwright install chromium`

---

### EXAMPLE EXECUTION

User: `/scrape-venues "Santorini, Greece" --limit 10`

1. Search for Santorini wedding venues
2. Find ~15 candidates, dedupe to 10
3. Scrape each venue website for details
4. Enrich with Google Places data
5. Validate and fix broken images
6. Enrich venues with <3 images
7. Generate IDs: gr-xxx (check existing Santorini venues)
8. Insert venues into Supabase
9. **POST-INSERT CHECKLIST (MANDATORY)**:
   - Ensure region exists: `INSERT INTO regions (name, country, continent) VALUES ('Santorini', 'Greece', 'Europe') ON CONFLICT...`
   - Link venue types: `INSERT INTO venue_venue_types (venue_id, venue_type_id) VALUES ...`
   - Link settings: `INSERT INTO venue_settings (venue_id, setting_id) VALUES ...`
   - Geocode: `npx tsx scripts/geocode-venues.ts --region Santorini`
   - Verify: Run verification SQL to confirm all venues have coords + types + settings
10. Report: "10 venues added to Santorini, all with coordinates, types, settings, and 5 images"

---

### STANDALONE IMAGE MODES

These modes operate on ALL existing venues, not just newly scraped ones.

**Audit all images**:
```
/scrape-venues --audit-images
```
This runs the broken image audit across all 942+ venues:
1. Checks each venue's header_image URL
2. Detects 403/404 errors, non-image content types, incomplete URLs
3. Reports broken images by region
4. Optionally fixes with `--fix` flag

**Enrich low-image venues**:
```
/scrape-venues --enrich-images
```
This enriches all venues with fewer than 3 header images:
1. Queries venues where `jsonb_array_length(header_images) < 3`
2. Fetches 5 Google Images per venue via Serper API
3. Updates `header_images` and `header_image` columns

**Combined audit + enrich**:
```
/scrape-venues --audit-images --enrich-images
```
First fixes broken images, then enriches any still-low venues.
