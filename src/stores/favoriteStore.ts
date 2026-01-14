import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteStore {
  favorites: Set<string>;
  showFavoritesOnly: boolean;
  toggleFavorite: (venueId: string) => void;
  isFavorite: (venueId: string) => boolean;
  clearFavorites: () => void;
  getFavoriteCount: () => number;
  setShowFavoritesOnly: (show: boolean) => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: new Set<string>(),
      showFavoritesOnly: false,

      toggleFavorite: (venueId) =>
        set((state) => {
          const newFavorites = new Set(state.favorites);
          if (newFavorites.has(venueId)) {
            newFavorites.delete(venueId);
          } else {
            newFavorites.add(venueId);
          }
          return { favorites: newFavorites };
        }),

      isFavorite: (venueId) => get().favorites.has(venueId),

      clearFavorites: () => set({ favorites: new Set<string>() }),

      getFavoriteCount: () => get().favorites.size,

      setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
    }),
    {
      name: 'venue-favorites',
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              favorites: new Set(parsed.state.favorites || []),
            },
          };
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              favorites: Array.from(value.state.favorites),
            },
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
