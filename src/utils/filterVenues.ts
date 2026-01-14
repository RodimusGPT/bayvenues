import type { Venue, FilterState } from '../types/venue';

export function filterVenues(venues: Venue[], filters: FilterState): Venue[] {
  return venues.filter((venue) => {
    // Text search (name, subregion, description, address)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        venue.name,
        venue.subregion,
        venue.description,
        venue.address,
      ]
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(query)) return false;
    }

    // Region filter
    if (filters.selectedRegions.length > 0) {
      if (!filters.selectedRegions.includes(venue.region)) return false;
    }

    // Venue type filter (OR logic within type)
    if (filters.selectedVenueTypes.length > 0) {
      const hasMatchingType = venue.venue_type.some((type) =>
        filters.selectedVenueTypes.includes(type)
      );
      if (!hasMatchingType) return false;
    }

    // Setting filter (Indoor/Outdoor)
    if (filters.selectedSettings.length > 0) {
      const hasMatchingSetting = venue.setting.some((s) =>
        filters.selectedSettings.includes(s)
      );
      if (!hasMatchingSetting) return false;
    }

    // Price range filter
    if (venue.price_range) {
      if (venue.price_range.min > filters.priceRange[1]) return false;
      if (venue.price_range.max < filters.priceRange[0]) return false;
    }

    // Capacity filter
    if (venue.capacity.max < filters.capacityRange[0]) return false;
    if (venue.capacity.min > filters.capacityRange[1]) return false;

    return true;
  });
}

export function getUniqueVenueTypes(venues: Venue[]): string[] {
  const types = new Set<string>();
  venues.forEach((venue) => {
    venue.venue_type.forEach((type) => types.add(type));
  });
  return Array.from(types).sort();
}

export function getPriceBounds(venues: Venue[]): [number, number] {
  let min = Infinity;
  let max = 0;

  venues.forEach((venue) => {
    if (venue.price_range) {
      min = Math.min(min, venue.price_range.min);
      max = Math.max(max, venue.price_range.max);
    }
  });

  return [min === Infinity ? 0 : min, max];
}

export function getCapacityBounds(venues: Venue[]): [number, number] {
  let min = Infinity;
  let max = 0;

  venues.forEach((venue) => {
    min = Math.min(min, venue.capacity.min);
    max = Math.max(max, venue.capacity.max);
  });

  return [min === Infinity ? 0 : min, max];
}
