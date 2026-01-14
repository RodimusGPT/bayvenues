import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HiddenStore {
  hidden: Set<string>;
  toggleHidden: (venueId: string) => void;
  isHidden: (venueId: string) => boolean;
  clearHidden: () => void;
  getHiddenCount: () => number;
}

export const useHiddenStore = create<HiddenStore>()(
  persist(
    (set, get) => ({
      hidden: new Set<string>(),

      toggleHidden: (venueId) =>
        set((state) => {
          const newHidden = new Set(state.hidden);
          if (newHidden.has(venueId)) {
            newHidden.delete(venueId);
          } else {
            newHidden.add(venueId);
          }
          return { hidden: newHidden };
        }),

      isHidden: (venueId) => get().hidden.has(venueId),

      clearHidden: () => set({ hidden: new Set<string>() }),

      getHiddenCount: () => get().hidden.size,
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
