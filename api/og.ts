import type { VercelRequest, VercelResponse } from '@vercel/node';

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

interface VenueData {
  id: string;
  name: string;
  region: string;
  subregion: string;
  description: string;
  header_image: { url: string; source: string } | null;
  header_images: { url: string; source: string }[] | null;
  capacity_min: number | null;
  capacity_max: number | null;
  price_min: number | null;
  price_max: number | null;
}

async function fetchVenue(venueId: string): Promise<VenueData | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase configuration');
    return null;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/venues?id=eq.${encodeURIComponent(venueId)}&select=id,name,region,subregion,description,header_image,header_images,capacity_min,capacity_max,price_min,price_max`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Supabase fetch error:', response.status);
      return null;
    }

    const venues = await response.json();
    return venues[0] || null;
  } catch (error) {
    console.error('Error fetching venue:', error);
    return null;
  }
}

function getVenueImageUrl(venue: VenueData): string | null {
  // Try header_images first, then header_image
  if (venue.header_images && venue.header_images.length > 0) {
    return venue.header_images[0].url;
  }
  if (venue.header_image?.url) {
    return venue.header_image.url;
  }
  // No image available
  return null;
}

function formatPrice(min: number | null, max: number | null): string {
  if (min == null || max == null) return '';
  const formatNum = (n: number) => {
    if (n >= 1000) return `$${Math.round(n / 1000)}K`;
    return `$${n}`;
  };
  return `${formatNum(min)} - ${formatNum(max)}`;
}

function formatCapacity(min: number | null, max: number | null): string {
  if (min == null || max == null) return '';
  return `${min} - ${max} guests`;
}

function generateOGHtml(venue: VenueData): string {
  const title = `${venue.name} | Wedding Venue in ${venue.region}`;
  const imageUrl = getVenueImageUrl(venue);
  const url = `https://venues.cool/?venue=${venue.id}`;

  // Build description with available info
  const parts: string[] = [];
  if (venue.subregion) parts.push(venue.subregion);
  const priceStr = formatPrice(venue.price_min, venue.price_max);
  if (priceStr) parts.push(priceStr);
  const capacityStr = formatCapacity(venue.capacity_min, venue.capacity_max);
  if (capacityStr) parts.push(capacityStr);

  const shortDesc = venue.description?.slice(0, 150) || '';
  const description = parts.length > 0
    ? `${parts.join(' · ')}. ${shortDesc}${shortDesc.length >= 150 ? '...' : ''}`
    : shortDesc;

  // Build image meta tags only if we have an image
  const imageTags = imageUrl ? `
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:site_name" content="venues.cool">${imageTags}

  <!-- Twitter -->
  <meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}">
  <meta name="twitter:url" content="${escapeHtml(url)}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">

  <!-- Additional SEO -->
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(url)}">

  <!-- Redirect for non-crawlers that somehow get here -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(url)}">
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(url)}">${escapeHtml(venue.name)}</a>...</p>
</body>
</html>`;
}

function generateDefaultOGHtml(): string {
  const title = 'venues.cool | Discover Beautiful Wedding Venues';
  const description = 'Find your perfect wedding venue. Browse stunning locations across the Bay Area, Europe, Hawaii, and destinations worldwide.';
  const url = 'https://venues.cool';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:site_name" content="venues.cool">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">

  <!-- Additional SEO -->
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(url)}">

  <!-- Redirect for non-crawlers -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(url)}">
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(url)}">venues.cool</a>...</p>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { venue: venueId } = req.query;

  // If venue ID is provided, fetch and render venue-specific OG tags
  if (venueId && typeof venueId === 'string') {
    const venue = await fetchVenue(venueId);

    if (venue) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      return res.status(200).send(generateOGHtml(venue));
    }
  }

  // Default OG tags for homepage or invalid venue
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(generateDefaultOGHtml());
}
