export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) {
    return formatPrice(min);
  }
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

export function formatCapacity(min: number, max: number): string {
  if (min === max) {
    return `${min} guests`;
  }
  return `${min} - ${max} guests`;
}

export function extractVideoId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : '';
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Fallback images by venue type (Unsplash URLs with stable IDs)
const VENUE_TYPE_FALLBACK_IMAGES: Record<string, string> = {
  'Winery': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=800&fit=crop',
  'Vineyard': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&h=800&fit=crop',
  'Historic': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop',
  'Garden': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop',
  'Estate': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
  'Mansion': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
  'Restaurant': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
  'Hotel': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop',
  'Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
  'Waterfront': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
  'Barn': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=1200&h=800&fit=crop',
  'Ranch': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop',
  'Golf Course': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=800&fit=crop',
  'Club': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop',
  'Museum': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200&h=800&fit=crop',
  'Brewery': 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&h=800&fit=crop',
  'Redwood': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=800&fit=crop',
  'Modern': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
  'Industrial': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
  'Castle': 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=1200&h=800&fit=crop',
  'Amphitheater': 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&h=800&fit=crop',
  'Villa': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
  'Chateau': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200&h=800&fit=crop',
  'Palazzo': 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1200&h=800&fit=crop',
  'Resort': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
  'Farmhouse': 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&h=800&fit=crop',
  'default': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
};

/**
 * Get a fallback header image URL based on venue types.
 * Returns the first matching venue type image, or default if none match.
 */
export function getFallbackHeaderImage(venueTypes: string[]): { url: string; source: 'fallback' } {
  for (const type of venueTypes) {
    if (VENUE_TYPE_FALLBACK_IMAGES[type]) {
      return { url: VENUE_TYPE_FALLBACK_IMAGES[type], source: 'fallback' };
    }
  }
  return { url: VENUE_TYPE_FALLBACK_IMAGES['default'], source: 'fallback' };
}

/**
 * Sanitize URL to prevent XSS attacks from javascript: or data: schemes.
 * Returns undefined for invalid/unsafe URLs.
 */
const SAFE_URL_SCHEMES = ['http:', 'https:', 'tel:', 'mailto:'];

export function sanitizeUrl(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined;

  try {
    const parsed = new URL(url, 'https://example.com'); // Base URL for relative paths
    if (SAFE_URL_SCHEMES.includes(parsed.protocol)) {
      return url;
    }
    return undefined;
  } catch {
    // URL parsing failed - could be a relative path or invalid
    // Only allow if it starts with / or is clearly a relative path
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return url;
    }
    return undefined;
  }
}
