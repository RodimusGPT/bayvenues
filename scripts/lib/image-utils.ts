/**
 * Image validation utilities for venue data
 * Use these functions to ensure images are valid before inserting into the database
 */

export interface HeaderImage {
  url: string;
  source: string;
  description?: string;
  thumbnail?: string;
}

// Reliable fallback images from Unsplash (wedding/venue themed)
export const FALLBACK_IMAGES: HeaderImage[] = [
  { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600', source: 'unsplash' },
  { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600', source: 'unsplash' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600', source: 'unsplash' },
  { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600', source: 'unsplash' },
  { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc32?w=1600', source: 'unsplash' },
  { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600', source: 'unsplash' },
];

/**
 * Ensures URL is properly encoded (spaces as %20, etc.)
 */
export function encodeImageUrl(url: string): string {
  try {
    // First decode to handle any double-encoding, then re-encode
    const decoded = decodeURI(url);
    return encodeURI(decoded);
  } catch {
    // If decode fails, just encode as-is
    return encodeURI(url);
  }
}

/**
 * Validates a single image URL by making a HEAD request
 * Returns true if image is accessible, false otherwise
 */
export async function validateImageUrl(url: string, timeoutMs: number = 10000): Promise<{
  valid: boolean;
  status?: number;
  error?: string;
  contentType?: string;
}> {
  try {
    // Ensure URL is properly encoded
    const encodedUrl = encodeImageUrl(url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(encodedUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    clearTimeout(timeout);

    const contentType = response.headers.get('content-type') || '';
    const isImage = contentType.startsWith('image/') ||
                    (response.ok && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url));

    if (response.ok && isImage) {
      return { valid: true, status: response.status, contentType };
    }

    return { valid: false, status: response.status, error: `HTTP ${response.status}`, contentType };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { valid: false, error: errorMessage };
  }
}

/**
 * Validates an array of images and returns only valid ones
 * Optionally replaces invalid images with fallbacks
 */
export async function validateImages(
  images: HeaderImage[],
  options: {
    useFallbacks?: boolean;
    minImages?: number;
    maxImages?: number;
    verbose?: boolean;
  } = {}
): Promise<{
  validImages: HeaderImage[];
  invalidImages: HeaderImage[];
  replacedCount: number;
}> {
  const {
    useFallbacks = true,
    minImages = 3,
    maxImages = 5,
    verbose = false,
  } = options;

  const validImages: HeaderImage[] = [];
  const invalidImages: HeaderImage[] = [];
  let replacedCount = 0;

  for (const img of images) {
    if (validImages.length >= maxImages) break;

    // Encode URL properly
    const encodedUrl = encodeImageUrl(img.url);
    const result = await validateImageUrl(encodedUrl);

    if (result.valid) {
      validImages.push({ ...img, url: encodedUrl });
      if (verbose) console.log(`  ✓ ${img.source}: ${encodedUrl.substring(0, 60)}...`);
    } else {
      invalidImages.push(img);
      if (verbose) console.log(`  ✗ ${img.source}: ${result.error}`);
    }
  }

  // Add fallbacks if needed
  if (useFallbacks && validImages.length < minImages) {
    const needed = minImages - validImages.length;
    for (let i = 0; i < needed && i < FALLBACK_IMAGES.length; i++) {
      validImages.push(FALLBACK_IMAGES[i]);
      replacedCount++;
      if (verbose) console.log(`  + Added fallback image ${i + 1}`);
    }
  }

  return { validImages, invalidImages, replacedCount };
}

/**
 * Prepares images for database insertion
 * - Encodes URLs properly
 * - Validates accessibility
 * - Ensures minimum image count with fallbacks
 */
export async function prepareImagesForInsert(
  images: HeaderImage[],
  venueName?: string
): Promise<HeaderImage[]> {
  if (venueName) {
    console.log(`  Validating images for ${venueName}...`);
  }

  const { validImages } = await validateImages(images, {
    useFallbacks: true,
    minImages: 3,
    maxImages: 5,
    verbose: !!venueName,
  });

  return validImages;
}

/**
 * Checks if an image URL is from a trusted CDN source
 * Trusted sources are less likely to break
 */
export function isTrustedSource(url: string): boolean {
  const trustedDomains = [
    'img.oyster.com',
    'cdn.kiwicollection.com',
    'images.unsplash.com',
    'media.cntraveler.com',
    'www.telegraph.co.uk',
    'luxecityguides.com',
  ];

  return trustedDomains.some(domain => url.includes(domain));
}

/**
 * Sorts images by source reliability (trusted sources first)
 */
export function sortByReliability(images: HeaderImage[]): HeaderImage[] {
  return [...images].sort((a, b) => {
    const aScore = isTrustedSource(a.url) ? 0 : 1;
    const bScore = isTrustedSource(b.url) ? 0 : 1;
    return aScore - bScore;
  });
}
