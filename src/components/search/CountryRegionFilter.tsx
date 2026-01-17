import { useState, useMemo } from 'react';
import { useFilterStore } from '../../stores/filterStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useRegionMetadata, type CountryData, type StateData, type RegionData } from '../../hooks/useRegionMetadata';

// Country flag emojis - easily extensible
const COUNTRY_FLAGS: Record<string, string> = {
  'USA': '🇺🇸',
  'Portugal': '🇵🇹',
  'Italy': '🇮🇹',
  'Greece': '🇬🇷',
  'Spain': '🇪🇸',
  'Switzerland': '🇨🇭',
  'France': '🇫🇷',
  // Add more as needed
};


function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] || '🌍';
}

// Reusable component for rendering region pills
interface RegionPillsProps {
  regions: RegionData[];
  selectedRegions: string[];
  parentCountry: string;
  onToggleRegion: (region: string, parentCountry: string) => void;
}

function RegionPills({ regions, selectedRegions, parentCountry, onToggleRegion }: RegionPillsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {regions.map((region) => {
        const isRegionSelected = selectedRegions.includes(region.name);
        return (
          <button
            key={region.name}
            onClick={() => onToggleRegion(region.name, parentCountry)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              isRegionSelected
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{region.name}</span>
            <span className={`${isRegionSelected ? 'text-primary-200' : 'text-gray-400'}`}>
              {region.venueCount}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Component for rendering a state row with its regions
interface StateRowProps {
  state: StateData;
  parentCountry: string;
  isExpanded: boolean;
  selectedRegions: string[];
  onToggleExpand: () => void;
  onToggleRegion: (region: string, parentCountry: string) => void;
  onToggleState: (state: StateData, parentCountry: string) => void;
}

function StateRow({
  state,
  parentCountry,
  isExpanded,
  selectedRegions,
  onToggleExpand,
  onToggleRegion,
  onToggleState,
}: StateRowProps) {
  const selectedRegionCount = state.regions.filter(r =>
    selectedRegions.includes(r.name)
  ).length;
  const allRegionsSelected = selectedRegionCount === state.regions.length;
  const someRegionsSelected = selectedRegionCount > 0 && !allRegionsSelected;

  return (
    <div className="border-b border-gray-50 last:border-b-0">
      {/* State Header */}
      <div className="flex items-center gap-2 py-1.5">
        {/* State checkbox */}
        <input
          type="checkbox"
          checked={allRegionsSelected}
          ref={(el) => {
            if (el) el.indeterminate = someRegionsSelected;
          }}
          onChange={() => onToggleState(state, parentCountry)}
          className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 flex-shrink-0 ml-1"
          aria-label={`Select all regions in ${state.name}`}
        />

        <button
          onClick={onToggleExpand}
          className="flex-1 flex items-center gap-2 text-left group"
        >
          <span className="text-xs text-gray-600 group-hover:text-gray-800 font-medium">
            {state.name}
          </span>
          <span className="text-xs text-gray-400">
            ({state.totalVenues})
          </span>
        </button>

        {/* Region selection indicator */}
        {selectedRegionCount > 0 && (
          <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">
            {selectedRegionCount}/{state.regions.length}
          </span>
        )}

        {/* Expand chevron */}
        <button
          onClick={onToggleExpand}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
          aria-label={isExpanded ? 'Collapse regions' : 'Expand regions'}
        >
          <svg
            className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Regions within state - expandable */}
      {isExpanded && (
        <div className="pl-6 pb-2">
          <RegionPills
            regions={state.regions}
            selectedRegions={selectedRegions}
            parentCountry={parentCountry}
            onToggleRegion={onToggleRegion}
          />
        </div>
      )}
    </div>
  );
}

interface CountryRowProps {
  country: CountryData;
  isExpanded: boolean;
  isSelected: boolean;
  selectedRegions: string[];
  expandedStates: Set<string>;
  onToggleExpand: () => void;
  onToggleCountry: () => void;
  onToggleRegion: (region: string, parentCountry: string) => void;
  onToggleState: (state: StateData, parentCountry: string) => void;
  onToggleStateExpand: (stateKey: string) => void;
}

function CountryRow({
  country,
  isExpanded,
  isSelected,
  selectedRegions,
  expandedStates,
  onToggleExpand,
  onToggleCountry,
  onToggleRegion,
  onToggleState,
  onToggleStateExpand,
}: CountryRowProps) {
  // Count selected regions across both direct regions and state-grouped regions
  const allRegions = [
    ...country.regions,
    ...country.states.flatMap(s => s.regions),
  ];
  const selectedRegionCount = allRegions.filter(r =>
    selectedRegions.includes(r.name)
  ).length;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Country Header */}
      <div className="flex items-center gap-2 py-2">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleCountry}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 flex-shrink-0"
        />

        {/* Flag and name - clickable to expand */}
        <button
          onClick={onToggleExpand}
          className="flex-1 flex items-center gap-2 text-left group"
        >
          <span className="text-base">{getCountryFlag(country.name)}</span>
          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
            {country.name}
          </span>
          <span className="text-xs text-gray-400">
            ({country.totalVenues})
          </span>
        </button>

        {/* Region selection indicator */}
        {selectedRegionCount > 0 && (
          <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">
            {selectedRegionCount}
          </span>
        )}

        {/* Expand chevron */}
        <button
          onClick={onToggleExpand}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label={isExpanded ? 'Collapse regions' : 'Expand regions'}
        >
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Regions and States - expandable */}
      {isExpanded && (
        <div className="pl-6 pb-3">
          {/* Render states if they exist */}
          {country.states.length > 0 && (
            <div className="space-y-1 mb-2">
              {country.states.map((state) => {
                const stateKey = `${country.name}-${state.name}`;
                return (
                  <StateRow
                    key={stateKey}
                    state={state}
                    parentCountry={country.name}
                    isExpanded={expandedStates.has(stateKey)}
                    selectedRegions={selectedRegions}
                    onToggleExpand={() => onToggleStateExpand(stateKey)}
                    onToggleRegion={onToggleRegion}
                    onToggleState={onToggleState}
                  />
                );
              })}
            </div>
          )}

          {/* Render direct regions (without state grouping) */}
          {country.regions.length > 0 && (
            <RegionPills
              regions={country.regions}
              selectedRegions={selectedRegions}
              parentCountry={country.name}
              onToggleRegion={onToggleRegion}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function CountryRegionFilter() {
  const { countries, isLoading, error } = useRegionMetadata();
  const {
    selectedCountries,
    selectedRegions,
    toggleCountry,
    toggleRegion,
  } = useFilterStore();
  const { showFavoritesOnly, setShowFavoritesOnly } = useFavoriteStore();

  // Wrap handlers to auto-disable favorites mode
  const handleToggleCountry = (country: string) => {
    if (showFavoritesOnly) setShowFavoritesOnly(false);
    toggleCountry(country);
  };

  const handleToggleRegion = (region: string, parentCountry: string) => {
    if (showFavoritesOnly) setShowFavoritesOnly(false);

    // If selecting a region (not deselecting), also select the parent country
    const isCurrentlySelected = selectedRegions.includes(region);
    if (!isCurrentlySelected && !selectedCountries.includes(parentCountry)) {
      toggleCountry(parentCountry);
    }

    toggleRegion(region);
  };

  // Handle state-level toggle (select/deselect all regions in state)
  const handleToggleState = (state: StateData, parentCountry: string) => {
    if (showFavoritesOnly) setShowFavoritesOnly(false);

    const stateRegionNames = state.regions.map(r => r.name);
    const allSelected = stateRegionNames.every(name => selectedRegions.includes(name));

    // Ensure country is selected when selecting state regions
    if (!allSelected && !selectedCountries.includes(parentCountry)) {
      toggleCountry(parentCountry);
    }

    // Toggle all regions in this state
    stateRegionNames.forEach(regionName => {
      const isCurrentlySelected = selectedRegions.includes(regionName);
      // If all selected, deselect all. If not all selected, select all unselected ones.
      if (allSelected && isCurrentlySelected) {
        toggleRegion(regionName);
      } else if (!allSelected && !isCurrentlySelected) {
        toggleRegion(regionName);
      }
    });
  };

  // Track which countries are expanded
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());

  // Track which states are expanded (key: "CountryName-StateName")
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

  // Search within filter
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries, states, and regions based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;

    const query = searchQuery.toLowerCase();
    return countries
      .map(country => {
        // Check if country name matches
        const countryMatches = country.name.toLowerCase().includes(query);

        // Filter direct regions that match
        const matchingRegions = country.regions.filter(r =>
          r.name.toLowerCase().includes(query)
        );

        // Filter states and their regions
        const matchingStates = country.states
          .map(state => {
            const stateMatches = state.name.toLowerCase().includes(query);
            const matchingStateRegions = state.regions.filter(r =>
              r.name.toLowerCase().includes(query)
            );

            if (stateMatches || matchingStateRegions.length > 0) {
              return {
                ...state,
                regions: stateMatches ? state.regions : matchingStateRegions,
              };
            }
            return null;
          })
          .filter((s): s is StateData => s !== null);

        // Include country if name matches OR has matching regions OR has matching states
        if (countryMatches || matchingRegions.length > 0 || matchingStates.length > 0) {
          return {
            ...country,
            regions: countryMatches ? country.regions : matchingRegions,
            states: countryMatches ? country.states : matchingStates,
          };
        }
        return null;
      })
      .filter((c): c is CountryData => c !== null);
  }, [countries, searchQuery]);

  // Auto-expand countries when searching
  const effectiveExpanded = useMemo(() => {
    if (searchQuery.trim()) {
      // When searching, expand all filtered countries
      return new Set(filteredCountries.map(c => c.name));
    }
    return expandedCountries;
  }, [searchQuery, filteredCountries, expandedCountries]);

  // Auto-expand states when searching
  const effectiveExpandedStates = useMemo(() => {
    if (searchQuery.trim()) {
      // When searching, expand all states in filtered countries
      const stateKeys = new Set<string>();
      filteredCountries.forEach(country => {
        country.states.forEach(state => {
          stateKeys.add(`${country.name}-${state.name}`);
        });
      });
      return stateKeys;
    }
    return expandedStates;
  }, [searchQuery, filteredCountries, expandedStates]);

  const toggleExpand = (countryName: string) => {
    setExpandedCountries(prev => {
      const next = new Set(prev);
      if (next.has(countryName)) {
        next.delete(countryName);
      } else {
        next.add(countryName);
      }
      return next;
    });
  };

  const toggleStateExpand = (stateKey: string) => {
    setExpandedStates(prev => {
      const next = new Set(prev);
      if (next.has(stateKey)) {
        next.delete(stateKey);
      } else {
        next.add(stateKey);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Failed to load locations
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>

      {/* Search box - shown when there are many options */}
      {countries.length > 5 && (
        <div className="relative mb-3">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search countries or regions..."
            aria-label="Search countries or regions"
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Country list */}
      <div className="space-y-0">
        {filteredCountries.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">No matching locations</p>
        ) : (
          filteredCountries.map((country) => (
            <CountryRow
              key={country.name}
              country={country}
              isExpanded={effectiveExpanded.has(country.name)}
              isSelected={selectedCountries.includes(country.name)}
              selectedRegions={selectedRegions}
              expandedStates={effectiveExpandedStates}
              onToggleExpand={() => toggleExpand(country.name)}
              onToggleCountry={() => handleToggleCountry(country.name)}
              onToggleRegion={handleToggleRegion}
              onToggleState={handleToggleState}
              onToggleStateExpand={toggleStateExpand}
            />
          ))
        )}
      </div>

      {/* Quick stats */}
      {(selectedCountries.length > 0 || selectedRegions.length > 0) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {selectedCountries.length > 0 && (
              <span>{selectedCountries.length} {selectedCountries.length === 1 ? 'country' : 'countries'}</span>
            )}
            {selectedCountries.length > 0 && selectedRegions.length > 0 && <span> · </span>}
            {selectedRegions.length > 0 && (
              <span>{selectedRegions.length} {selectedRegions.length === 1 ? 'region' : 'regions'}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
