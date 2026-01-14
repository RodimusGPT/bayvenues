import { useState, useRef, useEffect } from 'react';
import { useFilterStore } from '../../stores/filterStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useHiddenStore } from '../../stores/hiddenStore';

interface HeaderProps {
  totalVenues: number;
  filteredCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  onToggleFavorites: () => void;
  showFavorites: boolean;
}

export function Header({ totalVenues, filteredCount, showFilters, onToggleFilters, onToggleFavorites, showFavorites }: HeaderProps) {
  const { searchQuery, setSearchQuery, resetFilters } = useFilterStore();
  const { getFavoriteCount, showFavoritesOnly, setShowFavoritesOnly } = useFavoriteStore();
  const { getHiddenCount, clearHidden } = useHiddenStore();
  const [showResetMenu, setShowResetMenu] = useState(false);
  const resetMenuRef = useRef<HTMLDivElement>(null);

  const favoriteCount = getFavoriteCount();
  const hiddenCount = getHiddenCount();
  const hasActiveFilters = filteredCount < totalVenues;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resetMenuRef.current && !resetMenuRef.current.contains(event.target as Node)) {
        setShowResetMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetClick = () => {
    // If there are hidden venues, show confirmation menu
    if (hiddenCount > 0) {
      setShowResetMenu(true);
    } else {
      // No hidden venues, just reset filters
      resetFilters();
      if (showFavoritesOnly) setShowFavoritesOnly(false);
    }
  };

  const handleResetFiltersOnly = () => {
    resetFilters();
    if (showFavoritesOnly) setShowFavoritesOnly(false);
    setShowResetMenu(false);
  };

  const handleResetAll = () => {
    resetFilters();
    clearHidden();
    if (showFavoritesOnly) setShowFavoritesOnly(false);
    setShowResetMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h1 className="text-lg font-bold text-gray-900 hidden sm:block">VenueFinder</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Toggle (Desktop) */}
        <button
          onClick={onToggleFilters}
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
          <span className="hidden xl:inline">Filters</span>
        </button>

        {/* Favorites Button */}
        <button
          onClick={onToggleFavorites}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showFavorites
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="View favorites"
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
          {favoriteCount > 0 && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
              showFavorites ? 'bg-red-200 text-red-800' : 'bg-red-500 text-white'
            }`}>
              {favoriteCount}
            </span>
          )}
        </button>

        {/* Results Count - Clear explanation of what's shown */}
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {!hasActiveFilters ? (
            // No filters - show simple count
            <span>
              <span className="font-semibold text-primary-600">{totalVenues}</span>
              <span className="hidden sm:inline"> venues</span>
            </span>
          ) : (
            // Filters active - explain why count differs
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-primary-600">{filteredCount}</span>
              <span className="hidden sm:inline">shown</span>
              <span className="text-gray-400 text-xs hidden sm:inline">
                {showFavoritesOnly && `(favorites only)`}
                {!showFavoritesOnly && hiddenCount > 0 && `(${hiddenCount} hidden)`}
                {!showFavoritesOnly && hiddenCount === 0 && `(filtered)`}
              </span>
            </div>
          )}

          {/* Reset button with confirmation menu */}
          {hasActiveFilters && (
            <div className="relative" ref={resetMenuRef}>
              <button
                onClick={handleResetClick}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-0.5 bg-primary-50 rounded-full"
              >
                Reset
              </button>

              {/* Confirmation dropdown when hidden venues exist */}
              {showResetMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">
                      You have {hiddenCount} hidden venue{hiddenCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={handleResetFiltersOnly}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Reset filters only
                  </button>
                  <button
                    onClick={handleResetAll}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Reset all & show {hiddenCount} hidden
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
