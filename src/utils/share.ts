import type { Venue, FilterState } from '../types/venue';
import { buildShareUrl } from '../hooks/useUrlState';

/**
 * Share data structure for Web Share API
 */
export interface ShareData {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}

/**
 * Generate a shareable URL for a venue
 */
export function generateVenueShareUrl(venue: Venue): string {
  return buildShareUrl({ venueId: venue.id });
}

/**
 * Generate a shareable URL for a list of favorite venues
 */
export function generateFavoritesShareUrl(venueIds: string[]): string {
  return buildShareUrl({ favoriteIds: venueIds });
}

/**
 * Generate a shareable URL with current filter state
 */
export function generateFilterShareUrl(filters: Partial<FilterState>): string {
  return buildShareUrl({ filters });
}

/**
 * Get the best available image URL for a venue
 */
export function getVenueImageUrl(venue: Venue): string | undefined {
  return venue.headerImages?.[0]?.url || venue.headerImage?.url;
}

/**
 * Format venue data for social sharing
 */
export function formatVenueForSocial(venue: Venue): ShareData {
  const url = generateVenueShareUrl(venue);
  const imageUrl = getVenueImageUrl(venue);

  return {
    title: venue.name,
    text: '', // Keep text empty so only the clean URL is shared
    url,
    imageUrl,
  };
}

/**
 * Format venue data for email sharing
 */
export function formatVenueForEmail(venue: Venue): { subject: string; body: string } {
  const url = generateVenueShareUrl(venue);
  const priceInfo = venue.price_range
    ? `Price: $${venue.price_range.min.toLocaleString()} - $${venue.price_range.max.toLocaleString()}`
    : '';
  const capacityInfo = venue.capacity
    ? `Capacity: ${venue.capacity.min} - ${venue.capacity.max} guests`
    : '';

  const subject = `Check out this wedding venue: ${venue.name}`;
  const body = `
I found this beautiful wedding venue and thought you might like it!

${venue.name}
${venue.region} · ${venue.subregion}

${venue.description}

${priceInfo}
${capacityInfo}

View venue: ${url}
`.trim();

  return { subject, body };
}

/**
 * Format favorites collection for sharing
 */
export function formatFavoritesForSocial(venueIds: string[], venueCount: number): ShareData {
  const url = generateFavoritesShareUrl(venueIds);

  return {
    title: 'My Wedding Venue Shortlist',
    text: `Check out my wedding venue shortlist with ${venueCount} venue${venueCount !== 1 ? 's' : ''}!`,
    url,
  };
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch {
    console.error('Failed to copy to clipboard');
    return false;
  }
}

/**
 * Check if Web Share API is available
 */
export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Check if Web Share API can share specific data
 */
export function canShareData(data: ShareData): boolean {
  if (!canUseWebShare()) return false;

  try {
    return navigator.canShare?.({ title: data.title, text: data.text, url: data.url }) ?? true;
  } catch {
    return true; // Assume it can share if canShare isn't available
  }
}

/**
 * Share using native Web Share API
 */
export async function shareViaWebShare(data: ShareData): Promise<boolean> {
  if (!canUseWebShare()) return false;

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (err) {
    // User cancelled or share failed
    if ((err as Error).name !== 'AbortError') {
      console.error('Share failed:', err);
    }
    return false;
  }
}

/**
 * Generate WhatsApp share URL
 */
export function getWhatsAppShareUrl(text: string, url: string): string {
  // Only include text if it's not empty
  const fullText = text ? `${text}\n\n${url}` : url;
  return `https://wa.me/?text=${encodeURIComponent(fullText)}`;
}

/**
 * Generate email share URL (mailto:)
 */
export function getEmailShareUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Generate Pinterest share URL
 */
export function getPinterestShareUrl(url: string, imageUrl: string, description: string): string {
  const params = new URLSearchParams({
    url,
    media: imageUrl,
    description,
  });
  return `https://pinterest.com/pin/create/button/?${params.toString()}`;
}

/**
 * Generate Facebook share URL
 */
export function getFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

/**
 * Generate Twitter/X share URL
 */
export function getTwitterShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({ url });
  if (text) {
    params.set('text', text);
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Open a share URL in a popup window
 */
export function openSharePopup(url: string, windowName = 'share'): void {
  const width = 600;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    url,
    windowName,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );
}

export type ShareMethod = 'copy' | 'webshare' | 'whatsapp' | 'email' | 'pinterest' | 'facebook' | 'twitter';

/**
 * Execute share action based on method
 */
export async function executeShare(
  method: ShareMethod,
  data: ShareData,
  emailData?: { subject: string; body: string }
): Promise<boolean> {
  switch (method) {
    case 'copy':
      return copyToClipboard(data.url);

    case 'webshare':
      return shareViaWebShare(data);

    case 'whatsapp':
      openSharePopup(getWhatsAppShareUrl(data.text, data.url), 'whatsapp');
      return true;

    case 'email':
      if (emailData) {
        window.location.href = getEmailShareUrl(emailData.subject, emailData.body);
      } else {
        window.location.href = getEmailShareUrl(data.title, `${data.text}\n\n${data.url}`);
      }
      return true;

    case 'pinterest':
      if (data.imageUrl) {
        openSharePopup(getPinterestShareUrl(data.url, data.imageUrl, data.text), 'pinterest');
        return true;
      }
      return false;

    case 'facebook':
      openSharePopup(getFacebookShareUrl(data.url), 'facebook');
      return true;

    case 'twitter':
      openSharePopup(getTwitterShareUrl(data.text, data.url), 'twitter');
      return true;

    default:
      return false;
  }
}
