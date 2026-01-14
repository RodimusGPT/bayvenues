import { useFilterStore } from '../../stores/filterStore';

interface HeaderProps {
  totalVenues: number;
  filteredCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function Header({ totalVenues, filteredCount, showFilters, onToggleFilters }: HeaderProps) {
  const { searchQuery, setSearchQuery, resetFilters } = useFilterStore();
  const hasActiveFilters = filteredCount < totalVenues;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Bay Venues</h1>
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
              placeholder="Search venues..."
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

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-primary-600">{filteredCount}</span>
          {hasActiveFilters && (
            <span className="text-gray-400"> of {totalVenues}</span>
          )}
          <span className="hidden sm:inline"> venues</span>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Reset
          </button>
        )}
      </div>
    </header>
  );
}
