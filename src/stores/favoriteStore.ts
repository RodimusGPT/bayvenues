import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addUserFavorite, removeUserFavorite, clearAllUserFavorites } from '../lib/userPreferencesApi';

interface FavoriteStore {
  favorites: Set<string>;
  showFavoritesOnly: boolean;
  toggleFavorite: (venueId: string, userId?: string) => void;
  isFavorite: (venueId: string) => boolean;
  clearFavorites: (userId?: string) => void;
  getFavoriteCount: () => number;
  setShowFavoritesOnly: (show: boolean) => void;
  setFavorites: (ids: string[]) => void;
  getFavoriteIds: () => string[];
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: new Set<string>(),
      showFavoritesOnly: false,

      toggleFavorite: (venueId, userId) =>
        set((state) => {
          const newFavorites = new Set(state.favorites);
          const wasAdded = !newFavorites.has(venueId);

          if (wasAdded) {
            newFavorites.add(venueId);
          } else {
            newFavorites.delete(venueId);
          }

          // Fire API call in background if user is logged in
          if (userId) {
            if (wasAdded) {
              addUserFavorite(userId, venueId).catch(console.error);
            } else {
              removeUserFavorite(userId, venueId).catch(console.error);
            }
          }

          return { favorites: newFavorites };
        }),

      isFavorite: (venueId) => get().favorites.has(venueId),

      clearFavorites: (userId) => {
        set({ favorites: new Set<string>() });
        // Clear server-side data if user is logged in
        if (userId) {
          clearAllUserFavorites(userId).catch(console.error);
        }
      },

      getFavoriteCount: () => get().favorites.size,

      setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),

      setFavorites: (ids) => set({ favorites: new Set(ids) }),

      getFavoriteIds: () => Array.from(get().favorites),
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
