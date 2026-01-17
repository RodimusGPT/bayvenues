import { supabase } from './supabase';

// Favorites API

export async function fetchUserFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('venue_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data.map((row) => row.venue_id);
}

export async function addUserFavorite(userId: string, venueId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, venue_id: venueId });

  if (error) {
    // Ignore duplicate key errors (user already has this favorite)
    if (error.code === '23505') return true;
    console.error('Error adding favorite:', error);
    return false;
  }

  return true;
}

export async function removeUserFavorite(userId: string, venueId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('venue_id', venueId);

  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }

  return true;
}

export async function bulkAddFavorites(userId: string, venueIds: string[]): Promise<boolean> {
  if (venueIds.length === 0) return true;

  const rows = venueIds.map((venueId) => ({ user_id: userId, venue_id: venueId }));

  const { error } = await supabase
    .from('user_favorites')
    .upsert(rows, { onConflict: 'user_id,venue_id' });

  if (error) {
    console.error('Error bulk adding favorites:', error);
    return false;
  }

  return true;
}

// Hidden API

export async function fetchUserHidden(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_hidden')
    .select('venue_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching hidden:', error);
    return [];
  }

  return data.map((row) => row.venue_id);
}

export async function addUserHidden(userId: string, venueId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_hidden')
    .insert({ user_id: userId, venue_id: venueId });

  if (error) {
    // Ignore duplicate key errors
    if (error.code === '23505') return true;
    console.error('Error adding hidden:', error);
    return false;
  }

  return true;
}

export async function removeUserHidden(userId: string, venueId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_hidden')
    .delete()
    .eq('user_id', userId)
    .eq('venue_id', venueId);

  if (error) {
    console.error('Error removing hidden:', error);
    return false;
  }

  return true;
}

export async function bulkAddHidden(userId: string, venueIds: string[]): Promise<boolean> {
  if (venueIds.length === 0) return true;

  const rows = venueIds.map((venueId) => ({ user_id: userId, venue_id: venueId }));

  const { error } = await supabase
    .from('user_hidden')
    .upsert(rows, { onConflict: 'user_id,venue_id' });

  if (error) {
    console.error('Error bulk adding hidden:', error);
    return false;
  }

  return true;
}

// Clear all favorites for a user
export async function clearAllUserFavorites(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }

  return true;
}

// Clear all hidden for a user
export async function clearAllUserHidden(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_hidden')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing hidden:', error);
    return false;
  }

  return true;
}
