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
