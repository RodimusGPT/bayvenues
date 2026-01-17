import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export interface RegionData {
  name: string;
  country: string;
  state: string | null;
  venueCount: number;
}

export interface StateData {
  name: string;
  regions: RegionData[];
  totalVenues: number;
}

export interface CountryData {
  name: string;
  regions: RegionData[];
  states: StateData[];  // For USA, regions are grouped by state
  totalVenues: number;
}

export interface RegionMetadata {
  countries: CountryData[];
  isLoading: boolean;
  error: string | null;
}

// Country display order (can be extended as new countries are added)
const COUNTRY_ORDER: Record<string, number> = {
  'USA': 1,
  'Italy': 2,
  'France': 3,
  'Spain': 4,
  'Greece': 5,
  'Portugal': 6,
  'Switzerland': 7,
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
        const regions: RegionData[] = (regionCounts || []).map((r: { region_name: string; country_name: string; state_name: string | null; venue_count: number }) => ({
          name: r.region_name,
          country: r.country_name,
          state: r.state_name,
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

  // Group regions by country, then by state for USA
  const countries = useMemo(() => {
    const grouped = data.reduce<Record<string, RegionData[]>>((acc, region) => {
      if (!acc[region.country]) {
        acc[region.country] = [];
      }
      acc[region.country].push(region);
      return acc;
    }, {});

    // Convert to array and sort
    return Object.entries(grouped)
      .map(([name, regions]) => {
        // For USA, group regions by state
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
          regions: regionsWithoutState.sort((a, b) => b.venueCount - a.venueCount),
          states,
          totalVenues: regions.reduce((sum, r) => sum + r.venueCount, 0),
        };
      })
      .sort((a, b) => {
        // Sort by predefined order, then alphabetically for new countries
        const orderA = COUNTRY_ORDER[a.name] ?? 999;
        const orderB = COUNTRY_ORDER[b.name] ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
  }, [data]);

  return { countries, isLoading, error };
}
