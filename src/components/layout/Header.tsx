import { useFilterStore } from '../../stores/filterStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useLogoStore } from '../../stores/logoStore';
import { useAuth } from '../../contexts/AuthContext';
import { UserMenu } from '../auth/UserMenu';
import { Logo } from '../ui/Logo';
import { LogoIcon } from '../ui/LogoIcon';

interface HeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onToggleFavorites: () => void;
  showFavorites: boolean;
}

export function Header({ showFilters, onToggleFilters, onToggleFavorites, showFavorites }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const { getFavoriteCount, showFavoritesOnly, setShowFavoritesOnly } = useFavoriteStore();
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const { variant: logoVariant, iconVariant, setIconVariant } = useLogoStore();

  const favoriteCount = getFavoriteCount();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Reload page"
            aria-label="venues.cool - Reload page"
          >
            <LogoIcon
              variant={iconVariant}
              showSwitcher
              onVariantChange={setIconVariant}
            />
            <span className="hidden sm:block">
              <Logo variant={logoVariant} />
            </span>
          </button>
        </div>

        {/* Search Bar - Centered with flex-1 and mx-auto */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search venues, regions, countries..."
              value={searchQuery}
              onChange={(e) => {
                if (showFavoritesOnly && e.target.value) setShowFavoritesOnly(false);
                setSearchQuery(e.target.value);
              }}
              aria-label="Search venues, regions, and countries"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          </div>
        </div>

        {/* Right-aligned controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Filter Toggle (Desktop) */}
          <button
            onClick={onToggleFilters}
            aria-expanded={showFilters}
            aria-label={showFilters ? 'Hide filters' : 'Show filters'}
            className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showFilters
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* Favorites Button */}
          <button
            onClick={onToggleFavorites}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showFavorites
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`Favorites${favoriteCount > 0 ? ` (${favoriteCount})` : ''}`}
            aria-expanded={showFavorites}
          >
            <svg
              className="w-5 h-5"
              fill={showFavorites || favoriteCount > 0 ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={showFavorites || favoriteCount > 0 ? 0 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="hidden sm:inline">Favorites</span>
            {favoriteCount > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                showFavorites ? 'bg-red-200 text-red-800' : 'bg-red-500 text-white'
              }`}>
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Auth: User Menu or Sign In button */}
          {!authLoading && (
            user ? (
              <UserMenu />
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
