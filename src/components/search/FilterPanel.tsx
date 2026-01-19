import { useFilterStore } from '../../stores/filterStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useHiddenStore } from '../../stores/hiddenStore';
import { useAuth } from '../../contexts/AuthContext';
import { SETTINGS, type Setting } from '../../types/venue';
import { formatPrice } from '../../utils/formatters';
import { CountryRegionFilter } from './CountryRegionFilter';
import { RangeSlider } from '../ui/RangeSlider';

interface FilterPanelProps {
  venueTypes: string[];
  priceBounds: [number, number];
  capacityBounds: [number, number];
  onShowFavoritesPanel?: () => void;
}

export function FilterPanel({ venueTypes, priceBounds, capacityBounds, onShowFavoritesPanel }: FilterPanelProps) {
  const {
    searchQuery,
    selectedCountries,
    selectedRegions,
    selectedVenueTypes,
    selectedSettings,
    priceRange,
    capacityRange,
    toggleVenueType,
    toggleSetting,
    setPriceRange,
    setCapacityRange,
    resetFilters,
  } = useFilterStore();

  // Check if any filters are active (for showing reset button)
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCountries.length > 0 ||
    selectedRegions.length > 0 ||
    selectedVenueTypes.length > 0 ||
    selectedSettings.length > 0 ||
    priceRange[0] > priceBounds[0] ||
    priceRange[1] < priceBounds[1] ||
    capacityRange[0] > capacityBounds[0] ||
    capacityRange[1] < capacityBounds[1]
  );

  const { showFavoritesOnly, setShowFavoritesOnly, getFavoriteCount } = useFavoriteStore();

  // Wrap filter handlers to auto-disable favorites mode
  const handleToggleVenueType = (type: string) => {
    if (showFavoritesOnly) setShowFavoritesOnly(false);
    toggleVenueType(type);
  };

  const handleToggleSetting = (setting: Setting) => {
    if (showFavoritesOnly) setShowFavoritesOnly(false);
    toggleSetting(setting);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    if (showFavoritesOnly) setShowFavoritesOnly(false);
    setPriceRange(range);
  };

  const handleCapacityRangeChange = (range: [number, number]) => {
    if (showFavoritesOnly) setShowFavoritesOnly(false);
    setCapacityRange(range);
  };
  const { getHiddenCount, clearHidden } = useHiddenStore();
  const { user } = useAuth();
  const favoriteCount = getFavoriteCount();
  const hiddenCount = getHiddenCount();

  return (
    <div className="p-4 space-y-6">
      {/* Reset Filters Button - only shows when filters are active */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            resetFilters();
            if (showFavoritesOnly) setShowFavoritesOnly(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Filters
        </button>
      )}

      {/* Favorites Toggle */}
      <div>
        <button
          onClick={() => {
            const newValue = !showFavoritesOnly;
            setShowFavoritesOnly(newValue);
            // When enabling favorites, clear other filters so user sees all their favorites
            if (newValue) {
              resetFilters();
              if (onShowFavoritesPanel) onShowFavoritesPanel();
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
            showFavoritesOnly
              ? 'bg-red-50 border-2 border-red-200'
              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-5 h-5 ${showFavoritesOnly ? 'text-red-500' : 'text-gray-400'}`}
              fill={showFavoritesOnly ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={showFavoritesOnly ? 0 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className={`text-sm font-medium ${showFavoritesOnly ? 'text-red-700' : 'text-gray-700'}`}>
              Show Favorites Only
            </span>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            showFavoritesOnly ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-600'
          }`}>
            {favoriteCount}
          </span>
        </button>
      </div>

      {/* Hidden Venues Info */}
      {hiddenCount > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {hiddenCount} hidden venue{hiddenCount !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => clearHidden(user?.id)}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            Show all
          </button>
        </div>
      )}

      {/* Location - Countries & Regions */}
      <CountryRegionFilter />

      {/* Setting (Indoor/Outdoor) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Setting</h3>
        <div className="flex gap-2" role="group" aria-label="Venue setting filter">
          {SETTINGS.map((setting) => (
            <button
              key={setting}
              onClick={() => handleToggleSetting(setting)}
              aria-pressed={selectedSettings.includes(setting)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSettings.includes(setting)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {setting}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Capacity */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Guest Capacity</h3>
        <RangeSlider
          min={capacityBounds[0]}
          max={capacityBounds[1]}
          step={10}
          value={capacityRange}
          onChange={handleCapacityRangeChange}
          formatLabel={(v) => `${v} guests`}
          label="guest capacity"
        />
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Price Range</h3>
        <RangeSlider
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={Math.max(1000, Math.round((priceBounds[1] - priceBounds[0]) / 100))}
          value={priceRange}
          onChange={handlePriceRangeChange}
          formatLabel={formatPrice}
          label="price"
        />
      </div>

      {/* Venue Types */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Venue Type</h3>
        <div className="flex flex-wrap gap-2">
          {venueTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleToggleVenueType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedVenueTypes.includes(type)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
