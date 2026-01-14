import { useFilterStore } from '../../stores/filterStore';
import { COUNTRIES, SETTINGS, COUNTRY_COLORS } from '../../types/venue';
import type { Country } from '../../types/venue';
import { formatPrice } from '../../utils/formatters';

interface FilterPanelProps {
  venueTypes: string[];
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

export function FilterPanel({ venueTypes }: FilterPanelProps) {
  const {
    selectedCountries,
    selectedVenueTypes,
    selectedSettings,
    priceRange,
    capacityRange,
    toggleCountry,
    toggleVenueType,
    toggleSetting,
    setPriceRange,
    setCapacityRange,
  } = useFilterStore();

  return (
    <div className="p-4 space-y-6">
      {/* Countries */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Country</h3>
        <div className="space-y-2">
          {COUNTRIES.map((country) => (
            <label
              key={country}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() => toggleCountry(country)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COUNTRY_COLORS[country] }}
              />
              <span className="text-base mr-1">{COUNTRY_FLAGS[country]}</span>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {country}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Setting (Indoor/Outdoor) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Setting</h3>
        <div className="flex gap-2">
          {SETTINGS.map((setting) => (
            <button
              key={setting}
              onClick={() => toggleSetting(setting)}
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
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Guest Capacity
          <span className="font-normal text-gray-500 ml-2">
            {capacityRange[0]} - {capacityRange[1]} guests
          </span>
        </h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={capacityRange[0]}
            onChange={(e) => setCapacityRange([Number(e.target.value), capacityRange[1]])}
            className="w-full accent-primary-600"
          />
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={capacityRange[1]}
            onChange={(e) => setCapacityRange([capacityRange[0], Number(e.target.value)])}
            className="w-full accent-primary-600"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Price Range
          <span className="font-normal text-gray-500 ml-2">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </span>
        </h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full accent-primary-600"
          />
          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-primary-600"
          />
        </div>
      </div>

      {/* Venue Types */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Venue Type</h3>
        <div className="flex flex-wrap gap-2">
          {venueTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleVenueType(type)}
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
