'use client';
import { useState, useEffect } from 'react';
import { SleeperAPI } from '@/lib/sleeper-api';
import { transformSleeperData } from '@/lib/sleeper-utils';
import { RankingPlayer } from '@/lib/types';

export function useSleeperRankings(positionFilter: string = 'OVR') {
  const [players, setPlayers] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starredPlayers, setStarredPlayers] = useState<Set<string>>(new Set());
  const [currentWeek, setCurrentWeek] = useState(8);

  const sleeperAPI = new SleeperAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data
        const [allPlayers, nflState, projections] = await Promise.all([
          sleeperAPI.getAllPlayers(),
          sleeperAPI.getNFLState(),
          sleeperAPI.getProjections(currentWeek).catch(() => ({})) // Fallback to empty object if projections fail
        ]);

        const actualWeek = nflState.week || 8;
        setCurrentWeek(actualWeek);

        // Check if user has a saved ranking for this position/week/season
        try {
          const savedRankingResponse = await fetch(`/api/rankings?position=${positionFilter}&week=${actualWeek}&season=${new Date().getFullYear()}`);
          
          if (savedRankingResponse.ok) {
            const { rankings } = await savedRankingResponse.json();
            
            if (rankings && rankings.length > 0) {
              // User has a saved ranking - use it
              const savedRanking = rankings[0];
              const savedPlayers = savedRanking.player_rankings.map((pr: any) => ({
                id: pr.player_id,
                name: pr.player_name,
                team: pr.team,
                position: pr.position,
                projectedPoints: projections[pr.player_id]?.pts_ppr || 0,
                avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${pr.player_id}.jpg`,
                teamLogoUrl: `https://sleepercdn.com/images/team_logos/nfl/${pr.team?.toLowerCase()}.png`,
                isStarred: pr.is_starred,
                rank: pr.rank_position,
                injuryStatus: allPlayers[pr.player_id]?.injury_status,
                age: allPlayers[pr.player_id]?.age,
                college: allPlayers[pr.player_id]?.college,
                yearsExp: allPlayers[pr.player_id]?.years_exp
              })).sort((a: any, b: any) => a.rank - b.rank);
              
              setPlayers(savedPlayers);
              
              // Update starred players set
              const starredIds = savedPlayers.filter((p: any) => p.isStarred).map((p: any) => p.id);
              setStarredPlayers(new Set(starredIds));
            } else {
              // No saved ranking - use default Sleeper data
              const transformedPlayers = transformSleeperData(
                allPlayers,
                projections,
                starredPlayers,
                positionFilter
              );
              setPlayers(transformedPlayers);
            }
          } else {
            // API error or no saved ranking - use default Sleeper data
            const transformedPlayers = transformSleeperData(
              allPlayers,
              projections,
              starredPlayers,
              positionFilter
            );
            setPlayers(transformedPlayers);
          }
        } catch (fetchError) {
          // Error fetching saved rankings (e.g., not authenticated) - use default Sleeper data
          console.log('Could not fetch saved rankings, using default data:', fetchError);
          const transformedPlayers = transformSleeperData(
            allPlayers,
            projections,
            starredPlayers,
            positionFilter
          );
          setPlayers(transformedPlayers);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Sleeper API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [positionFilter, currentWeek]);

  const toggleStar = (playerId: string) => {
    setStarredPlayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });

    // Update the players array
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, isStarred: !player.isStarred }
        : player
    ));
  };

  const reorderPlayers = (startIndex: number, endIndex: number) => {
    setPlayers(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update ranks
      return result.map((player, index) => ({
        ...player,
        rank: index + 1
      }));
    });
  };

  const updatePlayerRank = (playerId: string, newRank: number) => {
    setPlayers(prev => {
      const playerIndex = prev.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return prev;
      
      const newPlayers = [...prev];
      const player = newPlayers[playerIndex];
      
      // Remove player from current position
      newPlayers.splice(playerIndex, 1);
      
      // Insert at new position (newRank - 1 because ranks are 1-indexed)
      newPlayers.splice(newRank - 1, 0, player);
      
      // Update all ranks
      return newPlayers.map((p, index) => ({
        ...p,
        rank: index + 1
      }));
    });
  };

  const saveRankings = async (position: string): Promise<{ success: boolean; action: string; error?: string }> => {
    try {
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          players: players,
          position: position,
          week: currentWeek,
          season: new Date().getFullYear(),
          type: 'weekly'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, action: 'error', error: data.error || 'Failed to save rankings' };
      }

      // After successful save, the current state is now the "saved" state
      // No need to refetch since the user's current order is already what they want
      
      return { success: true, action: data.action };
    } catch (error) {
      console.error('Error saving rankings:', error);
      return { success: false, action: 'error', error: 'Network error' };
    }
  };

  return {
    players,
    loading,
    error,
    currentWeek,
    toggleStar,
    reorderPlayers,
    updatePlayerRank,
    starredPlayers: Array.from(starredPlayers),
    saveRankings
  };
} 