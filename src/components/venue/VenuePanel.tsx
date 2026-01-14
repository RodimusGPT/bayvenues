import { useState, useEffect } from 'react';
import type { Venue, Country } from '../../types/venue';
import { COUNTRY_COLORS, getCountryForRegion } from '../../types/venue';
import { formatPriceRange, formatCapacity } from '../../utils/formatters';
import { VenuePhotos } from './VenuePhotos';
import { VenueVideos } from './VenueVideos';
import { VenueReviews } from './VenueReviews';
import { FavoriteButton } from '../ui/FavoriteButton';

interface VenuePanelProps {
  venue: Venue;
  onClose: () => void;
}

// Country flag emojis
const COUNTRY_FLAGS: Record<Country, string> = {
  'USA': '🇺🇸',
  'Portugal': '🇵🇹',
  'Italy': '🇮🇹',
  'Greece': '🇬🇷',
  'Spain': '🇪🇸',
  'Switzerland': '🇨🇭',
  'France': '🇫🇷',
};

export function VenuePanel({ venue, onClose }: VenuePanelProps) {
  const country = getCountryForRegion(venue.region);
  const countryColor = COUNTRY_COLORS[country];
  const [imageError, setImageError] = useState(false);

  // Reset image error state when venue changes
  useEffect(() => {
    setImageError(false);
  }, [venue.id]);

  return (
    <aside className="fixed right-0 top-[57px] bottom-0 w-full sm:w-[420px] bg-white shadow-2xl overflow-y-auto z-40 animate-slide-in-right venue-panel">
      {/* Mobile back bar - tap anywhere to close */}
      <button
        onClick={onClose}
        className="sm:hidden w-full py-2 bg-gray-100 border-b flex items-center justify-center gap-2 text-gray-600 active:bg-gray-200"
        aria-label="Go back"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to map</span>
      </button>
      {/* Header Image */}
      {venue.headerImage && !imageError ? (
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img
            src={venue.headerImage.url}
            alt={venue.name}
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Action buttons overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <FavoriteButton
              venueId={venue.id}
              size="md"
              className="bg-black/30 hover:bg-black/50 text-white"
            />
            <button
              onClick={onClose}
              className="p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Image source badge */}
          <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/40 text-white text-xs rounded-full">
            {venue.headerImage.source === 'youtube' ? 'Video' : venue.headerImage.source === 'og_image' ? 'Official' : venue.venue_type[0]}
          </span>
          {/* Venue name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: countryColor }}
              />
              <span className="text-base">{COUNTRY_FLAGS[country]}</span>
              <span className="text-sm text-white/90">{venue.region} · {venue.subregion}</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight drop-shadow-md">
              {venue.name}
            </h2>
          </div>
        </div>
      ) : (
        /* Header without image */
        <div className="sticky top-0 bg-white border-b z-10 p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: countryColor }}
                />
                <span className="text-base">{COUNTRY_FLAGS[country]}</span>
                <span className="text-sm text-gray-500">{venue.region} · {venue.subregion}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {venue.name}
              </h2>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <FavoriteButton venueId={venue.id} size="md" />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close panel"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Info Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b flex flex-wrap gap-2">
        {venue.price_range && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {formatPriceRange(venue.price_range.min, venue.price_range.max)}
          </span>
        )}
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {formatCapacity(venue.capacity.min, venue.capacity.max)}
        </span>
        {venue.setting.map((s) => (
          <span
            key={s}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Description */}
        <div>
          <p className="text-gray-600 text-sm leading-relaxed">{venue.description}</p>
        </div>

        {/* Venue Types */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Venue Type</h3>
          <div className="flex flex-wrap gap-2">
            {venue.venue_type.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Photos */}
        <VenuePhotos venue={venue} />

        {/* Videos */}
        <VenueVideos videos={venue.videos} youtubeSearch={venue.youtubeSearch} />

        {/* Reviews */}
        {venue.reviews && <VenueReviews reviews={venue.reviews} />}

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
          <div className="space-y-2">
            {venue.phone && (
              <a
                href={`tel:${venue.phone}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-gray-700">{venue.phone}</span>
              </a>
            )}
            <a
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-sm text-gray-700">Visit Website</span>
            </a>
            <a
              href={venue.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span className="text-sm text-gray-700 block">Get Directions</span>
                <span className="text-xs text-gray-500">{venue.address}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
