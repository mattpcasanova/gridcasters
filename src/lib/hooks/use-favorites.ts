'use client';
import { useState, useEffect } from 'react';

interface PlayerFavorite {
  id: string;
  player_id: string;
  player_name: string;
  team: string;
  position: string;
  created_at: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<PlayerFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorites from API
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites');
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      
      const data = await response.json();
      setFavorites(data.favorites || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  // Add a player to favorites
  const addFavorite = async (player: { id: string; name: string; team: string; position: string }) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: player.id,
          player_name: player.name,
          team: player.team,
          position: player.position
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add favorite');
      }

      const data = await response.json();
      setFavorites(prev => [...prev, data.favorite]);
      return { success: true };
    } catch (err) {
      console.error('Error adding favorite:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add favorite' };
    }
  };

  // Remove a player from favorites
  const removeFavorite = async (playerId: string) => {
    try {
      const response = await fetch(`/api/favorites?player_id=${playerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove favorite');
      }

      setFavorites(prev => prev.filter(fav => fav.player_id !== playerId));
      return { success: true };
    } catch (err) {
      console.error('Error removing favorite:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to remove favorite' };
    }
  };

  // Check if a player is favorited
  const isFavorite = (playerId: string) => {
    return favorites.some(fav => fav.player_id === playerId);
  };

  // Toggle favorite status
  const toggleFavorite = async (player: { id: string; name: string; team: string; position: string }) => {
    if (isFavorite(player.id)) {
      return await removeFavorite(player.id);
    } else {
      return await addFavorite(player);
    }
  };

  // Get favorites by position
  const getFavoritesByPosition = (position: string) => {
    return favorites.filter(fav => fav.position === position);
  };

  // Load favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    getFavoritesByPosition,
    refetchFavorites: fetchFavorites
  };
} 