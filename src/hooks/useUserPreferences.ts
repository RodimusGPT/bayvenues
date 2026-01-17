import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFavoriteStore } from '../stores/favoriteStore';
import { useHiddenStore } from '../stores/hiddenStore';
import {
  fetchUserFavorites,
  fetchUserHidden,
  bulkAddFavorites,
  bulkAddHidden,
} from '../lib/userPreferencesApi';

/**
 * Hook that syncs user preferences (favorites/hidden) between localStorage and database.
 * On login: merges localStorage data with DB, writes new items to DB.
 * On logout: keeps current Zustand state (no data loss).
 */
export function useUserPreferences() {
  const { user, loading } = useAuth();
  const { setFavorites, getFavoriteIds } = useFavoriteStore();
  const { setHidden, getHiddenIds } = useHiddenStore();
  const hasSynced = useRef(false);

  useEffect(() => {
    // Don't sync while loading auth state
    if (loading) return;

    // Only sync once per login
    if (user && !hasSynced.current) {
      hasSynced.current = true;
      syncOnLogin(user.id);
    }

    // Reset sync flag on logout
    if (!user) {
      hasSynced.current = false;
    }
  }, [user, loading]);

  async function syncOnLogin(userId: string) {
    try {
      // Get current localStorage data
      const localFavorites = getFavoriteIds();
      const localHidden = getHiddenIds();

      // Fetch data from database
      const [dbFavorites, dbHidden] = await Promise.all([
        fetchUserFavorites(userId),
        fetchUserHidden(userId),
      ]);

      // Merge: union of localStorage and DB (no data loss)
      const mergedFavorites = [...new Set([...localFavorites, ...dbFavorites])];
      const mergedHidden = [...new Set([...localHidden, ...dbHidden])];

      // Find new items that need to be written to DB
      const newFavoritesForDb = localFavorites.filter((id) => !dbFavorites.includes(id));
      const newHiddenForDb = localHidden.filter((id) => !dbHidden.includes(id));

      // Update stores with merged data
      setFavorites(mergedFavorites);
      setHidden(mergedHidden);

      // Write new items to DB in background
      if (newFavoritesForDb.length > 0) {
        bulkAddFavorites(userId, newFavoritesForDb).catch(console.error);
      }
      if (newHiddenForDb.length > 0) {
        bulkAddHidden(userId, newHiddenForDb).catch(console.error);
      }
    } catch (error) {
      console.error('Error syncing user preferences:', error);
    }
  }
}
