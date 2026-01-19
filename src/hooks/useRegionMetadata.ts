import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export interface RegionData {
  name: string;
  country: string;
  continent: string | null;
  state: string | null;
  flag: string;
  venueCount: number;
}

export interface StateData {
  name: string;
  regions: RegionData[];
  totalVenues: number;
}

export interface CountryData {
  name: string;
  continent: string | null;
  flag: string;
  regions: RegionData[];
  states: StateData[];  // For USA/Mexico, regions are grouped by state
  totalVenues: number;
}

export interface RegionMetadata {
  countries: CountryData[];
  countryFlags: Record<string, string>;  // country name -> flag emoji
  regionToCountry: Record<string, string>;  // region name -> country name
  isLoading: boolean;
  error: string | null;
}

// Continent display order
const CONTINENT_ORDER: Record<string, number> = {
  'North America': 1,
  'Europe': 2,
  'Asia': 3,
  'South America': 4,
  'Oceania': 5,
  'Africa': 6,
};

export function useRegionMetadata(): RegionMetadata {
  const [data, setData] = useState<RegionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        // Use optimized server-side aggregate function
        const { data: regionCounts, error: err } = await supabase.rpc('get_region_counts');

        if (err) throw err;

        // Transform to RegionData format
        const regions: RegionData[] = (regionCounts || []).map((r: { region_name: string; country_name: string; continent_name: string | null; state_name: string | null; country_flag: string; venue_count: number }) => ({
          name: r.region_name,
          country: r.country_name,
          continent: r.continent_name,
          state: r.state_name,
          flag: r.country_flag || '🌍',
          venueCount: r.venue_count,
        }));

        setData(regions);
      } catch (err) {
        console.error('Region metadata fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch region metadata');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetadata();
  }, []);

  // Build lookup maps for flags and region-to-country mapping
  const { countryFlags, regionToCountry } = useMemo(() => {
    const flags: Record<string, string> = {};
    const regionMap: Record<string, string> = {};

    data.forEach(region => {
      // Map country name to flag emoji
      if (!flags[region.country]) {
        flags[region.country] = region.flag;
      }
      // Map region name to country name
      regionMap[region.name] = region.country;
    });

    return { countryFlags: flags, regionToCountry: regionMap };
  }, [data]);

  // Group regions by country, then by state for countries with states
  const countries = useMemo(() => {
    const grouped = data.reduce<Record<string, { regions: RegionData[]; continent: string | null; flag: string }>>((acc, region) => {
      if (!acc[region.country]) {
        acc[region.country] = { regions: [], continent: region.continent, flag: region.flag };
      }
      acc[region.country].regions.push(region);
      return acc;
    }, {});

    // Convert to array and sort
    return Object.entries(grouped)
      .map(([name, { regions, continent, flag }]) => {
        // Group regions by state (for USA, Mexico, etc.)
        const stateGroups: Record<string, RegionData[]> = {};
        const regionsWithoutState: RegionData[] = [];

        regions.forEach(region => {
          if (region.state) {
            if (!stateGroups[region.state]) {
              stateGroups[region.state] = [];
            }
            stateGroups[region.state].push(region);
          } else {
            regionsWithoutState.push(region);
          }
        });

        // Convert state groups to StateData array
        const states: StateData[] = Object.entries(stateGroups)
          .map(([stateName, stateRegions]) => ({
            name: stateName,
            regions: stateRegions.sort((a, b) => b.venueCount - a.venueCount),
            totalVenues: stateRegions.reduce((sum, r) => sum + r.venueCount, 0),
          }))
          .sort((a, b) => b.totalVenues - a.totalVenues); // Sort states by venue count

        return {
          name,
          continent,
          flag,
          regions: regionsWithoutState.sort((a, b) => b.venueCount - a.venueCount),
          states,
          totalVenues: regions.reduce((sum, r) => sum + r.venueCount, 0),
        };
      })
      .sort((a, b) => {
        // Sort by continent order first, then alphabetically by country name
        const continentA = CONTINENT_ORDER[a.continent ?? ''] ?? 999;
        const continentB = CONTINENT_ORDER[b.continent ?? ''] ?? 999;
        if (continentA !== continentB) return continentA - continentB;
        return a.name.localeCompare(b.name);
      });
  }, [data]);

  return { countries, countryFlags, regionToCountry, isLoading, error };
}
