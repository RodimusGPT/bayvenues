# Audit Venues Command

Audit all venues in the database to verify data completeness and quality.

## Usage
```
/audit-venues                           # Audit all venues
/audit-venues --region "Tuscany"        # Audit specific region
/audit-venues --country "Italy"         # Audit specific country
/audit-venues --verbose                 # Show detailed issues per venue
/audit-venues --fix                     # Auto-fix venue types, settings, and websites
/audit-venues --fix-websites            # Only fix missing websites
/audit-venues --fix-websites --limit 20 # Fix websites with limit
/audit-venues --json                    # Output as JSON for processing
```

## Arguments
- `--region <name>`: Only audit venues in specified region
- `--country <name>`: Only audit venues in specified country
- `--verbose`: Show detailed breakdown of issues per venue
- `--fix`: Auto-fix missing venue types, settings, AND websites
- `--fix-types`: Only fix missing venue types (from name/description)
- `--fix-settings`: Only fix missing settings (default Indoor+Outdoor)
- `--fix-websites`: Only fix missing websites via web search (requires SERPER_API_KEY)
- `--limit <n>`: Limit website fixes to N venues (default: 50)
- `--json`: Output results as JSON instead of formatted report

## What Gets Audited

### Critical Issues (🔴)
These prevent core functionality from working:
- **Missing location**: Venue won't appear on map

### High Priority Issues (🟠)
These significantly impact user experience:
- **No header images**: Venue cards show fallback placeholder
- **No venue types**: Venue won't appear in type filters
- **No venue settings**: Venue won't appear in Indoor/Outdoor filters
- **Missing website**: Users can't visit venue site

### Medium Priority Issues (🟡)
These reduce data quality:
- **Few header images**: Less than 3 images (need 3+ for gallery)
- **Short description**: Less than 50 characters
- **No videos**: Missing rich media content
- **Missing capacity**: Can't show guest capacity range
- **Invalid capacity**: Min > max (data error)

### Low Priority Issues (🟢)
Nice to have:
- **Missing pricing**: No price range available
- **Missing phone**: No contact number
- **No Google rating**: Missing review score
- **Missing subregion**: No neighborhood/area specified

## Execution Instructions

When this command is invoked:

### Step 1: Run the Audit Script

Execute the audit script with appropriate flags:
```bash
npx tsx scripts/audit-venues.ts [OPTIONS]
```

Options to pass through:
- `--region X` if user specified a region
- `--country X` if user specified a country
- `--verbose` if user wants detailed output
- `--json` if user wants JSON output
- `--fix-types --fix-settings` if user specified `--fix`

### Step 2: Review Results

The script outputs:
1. **Summary stats**: Total venues, issues found, completeness score
2. **Issues by severity**: Count of critical/high/medium/low issues
3. **Issues by field**: Which data fields have the most problems
4. **Top regions**: Which regions need the most attention
5. **Recommendations**: Suggested scripts to run to fix issues

### Step 3: Take Action

Based on the audit results, suggest appropriate remediation:

| Issue Type | Fix Command |
|------------|-------------|
| Missing location | `npx tsx scripts/geocode-venues.mjs` |
| Missing/few images | `npx tsx scripts/enrich-images-playwright.ts` |
| Missing videos | `npx tsx scripts/enrich-youtube-simple.ts` |
| Missing venue types | `npx tsx scripts/audit-venues.ts --fix-types` |
| Missing settings | `npx tsx scripts/audit-venues.ts --fix-settings` |
| Missing websites | `npx tsx scripts/audit-venues.ts --fix-websites` |

### Step 4: Report Summary

Present results in this format:
```
═══════════════════════════════════════════════════════════
 🔍 VENUE DATA AUDIT REPORT
═══════════════════════════════════════════════════════════

📊 SUMMARY
────────────────────────────────────
  Total venues:        980
  Venues with issues:  245
  Completeness score:  87%

🚨 ISSUES BY SEVERITY
────────────────────────────────────
  🔴 CRITICAL: 12
  🟠 HIGH: 89
  🟡 MEDIUM: 156
  🟢 LOW: 234

📋 TOP ISSUES
────────────────────────────────────
  header_images: 156 venues
  videos: 134 venues
  pricing: 98 venues

💡 RECOMMENDATIONS
────────────────────────────────────
  • Run: npx tsx scripts/enrich-images-playwright.ts
  • Run: npx tsx scripts/enrich-youtube-simple.ts
═══════════════════════════════════════════════════════════
```

## Database Tables Queried

- **venues**: Main venue data
- **venue_venue_types**: Junction table for venue types
- **venue_settings**: Junction table for settings (Indoor/Outdoor)
- **regions**: For country-based filtering

## Auto-Fix Capabilities

When `--fix` is specified:

### Venue Type Detection
Scans venue name and description for keywords:
- "winery", "vineyard", "wine" → Winery
- "villa", "manor", "palazzo" → Villa
- "castle", "castello", "fortress" → Castle
- "garden", "botanical" → Garden
- "hotel", "resort", "spa" → Hotel
- "barn", "farm", "ranch" → Barn
- "beach", "waterfront" → Beach
- etc.

### Settings Default
Assigns both "Indoor" and "Outdoor" settings to venues without any settings (most venues support both).

### Website Search (--fix-websites)
Uses Google Places API to find venue websites (preferred method):

1. Searches for venue using Places API "Find Place from Text"
2. Retrieves place details including website, phone, and rating
3. Updates venue with website and any missing bonus data (phone, rating)

**Requires**: `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` (already configured)

**Bonus**: Also fills in missing phone numbers and Google ratings!

**Rate limiting**: 100ms delay between requests (Places API allows 50 QPS)

**Script**: `npx tsx scripts/enrich-websites-places.ts`

## Example Executions

**Full audit with verbose output:**
```
/audit-venues --verbose
```

**Audit Italy only and fix issues:**
```
/audit-venues --country "Italy" --fix
```

**Get JSON output for further processing:**
```
/audit-venues --json
```

**Check a specific region:**
```
/audit-venues --region "Santorini" --verbose
```

## Notes

- The Supabase project ID is `tpgruvfobcgzictihwrp`
- Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Completeness score = (total_checks - issues) / total_checks * 100
- Each venue has ~10 data quality checks applied
