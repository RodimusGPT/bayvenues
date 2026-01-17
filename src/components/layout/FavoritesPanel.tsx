import type { Venue } from '../../types/venue';
import { COUNTRY_FLAGS, getCountryForRegion } from '../../types/venue';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useFavoriteVenues } from '../../hooks/useSupabaseVenues';
import { useAuth } from '../../contexts/AuthContext';
import { formatPriceRange, formatCapacity } from '../../utils/formatters';

interface FavoritesPanelProps {
  onVenueSelect: (venue: Venue) => void;
  onClose: () => void;
}

export function FavoritesPanel({ onVenueSelect, onClose }: FavoritesPanelProps) {
  const { favorites, toggleFavorite, clearFavorites } = useFavoriteStore();
  const { data: favoriteVenues = [], isLoading } = useFavoriteVenues();
  const { user, openAuthModal } = useAuth();

  return (
    <aside className="lg:relative lg:w-full lg:h-full lg:top-auto lg:right-auto lg:shadow-none lg:z-auto fixed right-0 top-[57px] bottom-0 w-full sm:w-[380px] bg-white shadow-2xl overflow-hidden z-40 animate-slide-in-right flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-red-50 to-pink-50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="font-semibold text-gray-900">Favorites</h2>
          <span className="text-sm text-gray-500">({favoriteVenues.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {favoriteVenues.length > 0 && (
            <button
              onClick={() => clearFavorites(user?.id)}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/50 rounded-full transition-colors"
            aria-label="Close favorites"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && favorites.size > 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Sign in to save favorites</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create an account to save your favorite venues and access them from any device.
            </p>
            <button
              onClick={openAuthModal}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Sign In
            </button>
          </div>
        ) : favoriteVenues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No favorites yet</h3>
            <p className="text-sm text-gray-500">
              Click the heart icon on any venue to add it to your favorites.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {favoriteVenues.map((venue) => {
              const country = getCountryForRegion(venue.region);
              const flag = COUNTRY_FLAGS[country] || '📍';

              const handleKeyDown = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onVenueSelect(venue);
                }
              };

              return (
                <div
                  key={venue.id}
                  role="button"
                  tabIndex={0}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  onClick={() => onVenueSelect(venue)}
                  onKeyDown={handleKeyDown}
                  aria-label={`View ${venue.name}`}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {venue.headerImage ? (
                      <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={venue.headerImage.url}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm">{flag}</span>
                        <span className="text-xs text-gray-500 truncate">{venue.region}</span>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 group-hover:text-primary-600 transition-colors">
                        {venue.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {venue.price_range && (
                          <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                            {formatPriceRange(venue.price_range.min, venue.price_range.max)}
                          </span>
                        )}
                        {venue.capacity && (
                          <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {formatCapacity(venue.capacity.min, venue.capacity.max)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove Button - always visible on touch, hover to show on desktop */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user) toggleFavorite(venue.id, user.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 flex-shrink-0 self-center"
                      title="Remove from favorites"
                      aria-label="Remove from favorites"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
