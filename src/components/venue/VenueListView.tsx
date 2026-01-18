import type { Venue } from '../../types/venue';
import { COUNTRY_FLAGS, getCountryForRegion } from '../../types/venue';
import { formatPriceRange, formatCapacity } from '../../utils/formatters';
import { FavoriteButton } from '../ui/FavoriteButton';
import { ShareButton } from '../ui/ShareButton';

interface VenueListViewProps {
  venues: Venue[];
  onVenueSelect: (venue: Venue) => void;
  onBackToMap?: () => void;
  isLoading?: boolean;
}

function VenueCard({ venue, onSelect }: { venue: Venue; onSelect: () => void }) {
  const country = getCountryForRegion(venue.region);
  const flag = COUNTRY_FLAGS[country] || '📍';

  // Get thumbnail image
  const thumbnailUrl = venue.headerImages?.[0]?.thumbnail
    || venue.headerImages?.[0]?.url
    || venue.headerImage?.url;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-200 transition-all group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={`View details for ${venue.name}`}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-52 bg-gray-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Action buttons - always visible on touch, hover to show on desktop */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity">
          <ShareButton
            type="venue"
            venue={venue}
            size="sm"
            className="bg-white/90 hover:bg-white shadow-sm"
          />
          <FavoriteButton
            venueId={venue.id}
            size="sm"
            className="bg-white/90 hover:bg-white shadow-sm"
          />
        </div>

        {/* Country flag */}
        <div className="absolute bottom-2 left-2 flex items-center px-2 py-1 bg-black/50 rounded-full">
          <span className="text-sm">{flag}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
          {venue.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          {venue.region} · {venue.subregion}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {venue.price_range && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
              {formatPriceRange(venue.price_range.min, venue.price_range.max)}
            </span>
          )}
          {venue.capacity && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {formatCapacity(venue.capacity.min, venue.capacity.max)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function VenueListView({ venues, onVenueSelect, onBackToMap, isLoading }: VenueListViewProps) {
  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-600 border-t-transparent"></div>
          <span className="text-sm text-gray-600 font-medium">Loading venues...</span>
        </div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-500 mb-4">No venues in this area</p>
          <p className="text-gray-400 text-sm">Pan or zoom the map to see venues</p>
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to map
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to map"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="font-semibold text-gray-900">
            {venues.length} venue{venues.length !== 1 ? 's' : ''} in view
          </h2>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onSelect={() => onVenueSelect(venue)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
