# Enrich Videos Command

Find and add YouTube wedding videos to venues that don't have them. Uses YouTube Data API to search, then Claude evaluates results to ensure videos are actually about the venue.

## Usage
```
/enrich-videos
/enrich-videos --region "Tuscany"
/enrich-videos --country "Italy"
/enrich-videos --limit 20
/enrich-videos --dry-run
/enrich-videos --venue-id "it-042"
```

## Arguments
- `--region <name>`: Only process venues in a specific region
- `--country <name>`: Only process venues in a specific country
- `--limit <n>`: Maximum number of venues to process (default: 50)
- `--dry-run`: Preview what would be updated without making changes
- `--venue-id <id>`: Process a single specific venue

## Prerequisites
- **Google API key** with YouTube Data API enabled (uses same key as Google Maps)
- Script checks: `YOUTUBE_API_KEY` → `VITE_GOOGLE_MAPS_API_KEY` → `GOOGLE_API_KEY`

## Tools Used
- **Bash**: Run `scripts/youtube-search.mjs` to get YouTube candidates
- **Supabase MCP**: Query and update venues (Project ID: `tpgruvfobcgzictihwrp`)
- **Claude**: Evaluate video relevance based on title, description, and channel

---

## Execution Instructions

### STEP 1: Verify Google API Key

```bash
# Script uses VITE_GOOGLE_MAPS_API_KEY (same as Maps)
echo $VITE_GOOGLE_MAPS_API_KEY | head -c 10
```

If empty, the Google Maps API key needs to be set and have YouTube Data API enabled in Google Cloud Console.

---

### STEP 2: Query Venues Without Videos

```sql
-- Find venues without videos (null or empty array)
SELECT id, name, region, youtube_search
FROM venues
WHERE videos IS NULL
   OR videos = '[]'::jsonb
   OR jsonb_array_length(videos) = 0
ORDER BY region, name
LIMIT <limit>;
```

If `--region` specified:
```sql
WHERE region = '<region>'
  AND (videos IS NULL OR videos = '[]'::jsonb)
```

If `--country` specified:
```sql
WHERE region IN (SELECT name FROM regions WHERE country = '<country>')
  AND (videos IS NULL OR videos = '[]'::jsonb)
```

If `--venue-id` specified:
```sql
WHERE id = '<venue_id>'
```

---

### STEP 3: For Each Venue, Search YouTube

**Run the YouTube search script**:
```bash
node scripts/youtube-search.mjs "<venue_name> <region> wedding"
```

**Example**:
```bash
node scripts/youtube-search.mjs "Villa Rufolo Ravello wedding"
```

**Script returns JSON with up to 5 candidates**:
```json
{
  "error": false,
  "query": "Villa Rufolo Ravello wedding",
  "totalResults": 5,
  "results": [
    {
      "rank": 1,
      "videoId": "abc123xyz",
      "url": "https://www.youtube.com/watch?v=abc123xyz",
      "title": "Lauren & James | Villa Rufolo Wedding Film | Ravello, Italy",
      "description": "A beautiful destination wedding at the historic Villa Rufolo gardens overlooking the Amalfi Coast...",
      "channel": "Amalfi Coast Weddings",
      "publishedAt": "2023-06-15T10:00:00Z",
      "thumbnails": {
        "maxres": "https://img.youtube.com/vi/abc123xyz/maxresdefault.jpg"
      }
    },
    ...
  ]
}
```

---

### STEP 4: Evaluate Video Relevance (CRITICAL)

**For each video result, evaluate these criteria**:

| Criteria | Weight | Check |
|----------|--------|-------|
| Venue name in title | HIGH | Does the title contain the venue name? |
| Location match | HIGH | Does it mention the correct region/city? |
| Wedding content | HIGH | Is "wedding" or "matrimonio" in title/description? |
| Actual wedding film | MEDIUM | Is this a real wedding (couple names) vs venue promo? |
| Channel credibility | MEDIUM | Is this a wedding videographer channel? |
| Recency | LOW | Prefer videos from last 3-5 years |

**Red flags - SKIP these videos**:
- Generic travel/tourism videos about the location
- Videos about a DIFFERENT venue with similar name
- Venue promotional videos without actual weddings
- Very short clips (typically <2 min based on title clues)
- Music videos or unrelated content
- Videos in wrong country/region

**Evaluation decision tree**:
```
1. Does title contain exact venue name?
   YES → Strong candidate, continue
   NO but has partial match → Weak candidate, be cautious
   NO match at all → SKIP

2. Is this a wedding video?
   Title has "wedding", "matrimonio", couple names → YES
   Only venue tour/promo → SKIP

3. Is location correct?
   Matches region/country → YES
   Different location → SKIP

4. Final decision:
   - If confident match → SELECT this video
   - If uncertain → Try next result
   - If no good matches → Mark venue as "no video found"
```

---

### STEP 5: Update Venue Record

**Only update if a relevant video was found**:

```sql
UPDATE venues
SET
  videos = '[{"title": "<video_title>", "url": "https://www.youtube.com/watch?v=<videoId>"}]'::jsonb,
  youtube_search = '<search_query_used>',
  -- Also set header_image from YouTube thumbnail if none exists
  header_image = CASE
    WHEN header_image IS NULL
    THEN '{"url": "https://img.youtube.com/vi/<videoId>/maxresdefault.jpg", "source": "youtube"}'::jsonb
    ELSE header_image
  END
WHERE id = '<venue_id>';
```

**For multiple good videos (up to 3)**:
```sql
UPDATE venues
SET
  videos = '[
    {"title": "<video1_title>", "url": "https://www.youtube.com/watch?v=<videoId1>"},
    {"title": "<video2_title>", "url": "https://www.youtube.com/watch?v=<videoId2>"},
    {"title": "<video3_title>", "url": "https://www.youtube.com/watch?v=<videoId3>"}
  ]'::jsonb
WHERE id = '<venue_id>';
```

---

### STEP 6: Progress Reporting

Display progress with evaluation reasoning:

```
════════════════════════════════════════════════════════════════
 ENRICH VIDEOS - Processing venues without videos
════════════════════════════════════════════════════════════════

YouTube API: ✓ Configured

Found 45 venues without videos

────────────────────────────────────────────────────────────────
[1/45] Villa Rufolo (Campania)
────────────────────────────────────────────────────────────────
  Search: "Villa Rufolo Ravello wedding"

  Candidate 1: "Lauren & James | Villa Rufolo Wedding | Ravello"
    Channel: Amalfi Coast Weddings
    ✓ Venue name in title: YES
    ✓ Wedding content: YES (couple names + "wedding")
    ✓ Location match: Ravello = Campania region
    → SELECTED

  ✓ Updated with: "Lauren & James | Villa Rufolo Wedding | Ravello"
    URL: https://www.youtube.com/watch?v=abc123

────────────────────────────────────────────────────────────────
[2/45] Le Sirenuse (Campania)
────────────────────────────────────────────────────────────────
  Search: "Le Sirenuse Positano wedding"

  Candidate 1: "Positano Travel Guide 2024"
    ✗ No wedding content, travel video → SKIP

  Candidate 2: "Wedding at Le Sirenuse Hotel | Sarah & Michael"
    Channel: Italian Wedding Films
    ✓ Venue name in title: YES
    ✓ Wedding content: YES
    ✓ Location match: Positano
    → SELECTED

  ✓ Updated with: "Wedding at Le Sirenuse Hotel | Sarah & Michael"

────────────────────────────────────────────────────────────────
[3/45] Borgo Santo Pietro (Tuscany)
────────────────────────────────────────────────────────────────
  Search: "Borgo Santo Pietro Tuscany wedding"

  Candidate 1: "Tuscany Countryside Tour"
    ✗ No venue name, travel video → SKIP

  Candidate 2: "Best Tuscany Wedding Venues"
    ✗ Compilation video, not specific → SKIP

  Candidate 3-5: No relevant matches

  ✗ No relevant video found

────────────────────────────────────────────────────────────────
...

════════════════════════════════════════════════════════════════
 COMPLETE
   Processed: 45 venues
   Videos added: 38
   No video found: 7
════════════════════════════════════════════════════════════════

Venues without videos (for manual review):
  - Borgo Santo Pietro (it-023) - Tuscany
  - La Badia di Orvieto (it-067) - Tuscany
  ...
```

---

### DRY RUN MODE

If `--dry-run` is specified:
1. Query venues without videos
2. Run YouTube searches
3. Evaluate and show what WOULD be selected
4. Do NOT execute any UPDATE statements

```
[DRY RUN] Would update it-042 with video:
  Title: "Magical Wedding at Villa San Michele"
  URL: https://www.youtube.com/watch?v=abc123
  Reason: Exact venue name match + wedding content + correct region
```

---

### ALTERNATIVE SEARCH STRATEGIES

If primary search returns no good results, try these variations:

1. **Without region**: `"<venue_name> wedding"`
2. **With country**: `"<venue_name> <country> wedding"`
3. **Italian term**: `"<venue_name> matrimonio"`
4. **Just venue**: `"<venue_name>"` (check if wedding content)

```bash
# Try broader search
node scripts/youtube-search.mjs "Le Sirenuse wedding"

# Try Italian
node scripts/youtube-search.mjs "Le Sirenuse matrimonio"
```

---

### RATE LIMITING

- YouTube API quota: 10,000 units/day
- Each search costs ~100 units
- Max ~100 searches per day
- Add 200ms delay between searches to be safe

```bash
# Check remaining quota at: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
```

---

### ERROR HANDLING

| Error | Action |
|-------|--------|
| YOUTUBE_API_KEY not set | Stop, ask user to configure |
| API quota exceeded | Stop for today, resume tomorrow |
| No results for venue | Log for manual review, continue |
| Invalid JSON from script | Log error, skip venue, continue |
| Database update fails | Log error, continue with next |

---

### EXAMPLE EXECUTIONS

**Process all venues without videos (up to 50)**:
```
/enrich-videos
```

**Process only Italian venues**:
```
/enrich-videos --country "Italy"
```

**Process a specific region**:
```
/enrich-videos --region "Santorini" --limit 10
```

**Preview what would be updated**:
```
/enrich-videos --region "Tuscany" --dry-run
```

**Fix a single venue**:
```
/enrich-videos --venue-id "gr-025"
```
