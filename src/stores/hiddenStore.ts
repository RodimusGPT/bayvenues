import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addUserHidden, removeUserHidden, clearAllUserHidden } from '../lib/userPreferencesApi';

interface HiddenStore {
  hidden: Set<string>;
  toggleHidden: (venueId: string, userId?: string) => void;
  isHidden: (venueId: string) => boolean;
  clearHidden: (userId?: string) => void;
  getHiddenCount: () => number;
  setHidden: (ids: string[]) => void;
  getHiddenIds: () => string[];
}

export const useHiddenStore = create<HiddenStore>()(
  persist(
    (set, get) => ({
      hidden: new Set<string>(),

      toggleHidden: (venueId, userId) =>
        set((state) => {
          const newHidden = new Set(state.hidden);
          const wasAdded = !newHidden.has(venueId);

          if (wasAdded) {
            newHidden.add(venueId);
          } else {
            newHidden.delete(venueId);
          }

          // Fire API call in background if user is logged in
          if (userId) {
            if (wasAdded) {
              addUserHidden(userId, venueId).catch(console.error);
            } else {
              removeUserHidden(userId, venueId).catch(console.error);
            }
          }

          return { hidden: newHidden };
        }),

      isHidden: (venueId) => get().hidden.has(venueId),

      clearHidden: (userId) => {
        set({ hidden: new Set<string>() });
        // Clear server-side data if user is logged in
        if (userId) {
          clearAllUserHidden(userId).catch(console.error);
        }
      },

      getHiddenCount: () => get().hidden.size,

      setHidden: (ids) => set({ hidden: new Set(ids) }),

      getHiddenIds: () => Array.from(get().hidden),
    }),
    {
      name: 'venue-hidden',
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
              hidden: new Set(parsed.state.hidden || []),
            },
          };
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              hidden: Array.from(value.state.hidden),
            },
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
