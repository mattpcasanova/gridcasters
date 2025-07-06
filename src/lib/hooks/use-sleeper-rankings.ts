'use client';
import { useState, useEffect } from 'react';
import { SleeperAPI } from '@/lib/sleeper-api';
import { transformSleeperData } from '@/lib/sleeper-utils';
import { RankingPlayer } from '@/lib/types';
import { getCurrentSeasonInfo, getDefaultRankingType, getDefaultWeek } from '@/lib/utils/season';

export function useSleeperRankings(positionFilter: string = 'OVR', selectedWeek?: number | 'preseason') {
  const [players, setPlayers] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starredPlayers, setStarredPlayers] = useState<Set<string>>(new Set());
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [rankingType, setRankingType] = useState<'preseason' | 'weekly'>('weekly');

  const sleeperAPI = new SleeperAPI();

  // Helper function to load default or previous ranking
  const loadDefaultOrPreviousRanking = async (
    allPlayers: any, 
    projections: any, 
    seasonInfo: any, 
    weekToLoad: number | null, 
    typeToLoad: 'preseason' | 'weekly'
  ) => {
    // For future weeks, try to find the most recent saved ranking to use as default
    if (typeToLoad === 'weekly' && weekToLoad && seasonInfo.isRegularSeason && weekToLoad > (seasonInfo.currentWeek || 0)) {
      try {
        // Look for the most recent saved ranking for this position
        const queryParams = new URLSearchParams({
          position: positionFilter,
          season: seasonInfo.season.toString(),
          type: 'weekly'
        });
        
        const recentRankingResponse = await fetch(`/api/rankings?${queryParams.toString()}`);
        
        if (recentRankingResponse.ok) {
          const { rankings } = await recentRankingResponse.json();
          
          if (rankings && rankings.length > 0) {
            // Use the most recent ranking as base, but update projected points for the new week
            const recentRanking = rankings[0];
            const baseOrder = recentRanking.player_rankings
              .sort((a: any, b: any) => a.rank_position - b.rank_position)
              .map((pr: any, index: number) => ({
                id: pr.player_id,
                name: pr.player_name,
                team: pr.team,
                position: pr.position,
                projectedPoints: (projections as any)[pr.player_id]?.pts_ppr || 0,
                avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${pr.player_id}.jpg`,
                teamLogoUrl: `https://sleepercdn.com/images/team_logos/nfl/${pr.team?.toLowerCase()}.png`,
                isStarred: pr.is_starred,
                rank: index + 1, // Maintain the previous ranking order
                injuryStatus: allPlayers[pr.player_id]?.injury_status,
                age: allPlayers[pr.player_id]?.age,
                college: allPlayers[pr.player_id]?.college,
                yearsExp: allPlayers[pr.player_id]?.years_exp
              }));
            
            setPlayers(baseOrder);
            
            // Update starred players set
            const starredIds = baseOrder.filter((p: any) => p.isStarred).map((p: any) => p.id);
            setStarredPlayers(new Set(starredIds));
            return;
          }
        }
      } catch (err) {
        console.log('Could not fetch previous ranking, falling back to default data');
      }
    }
    
    // Fall back to default Sleeper data
    const transformedPlayers = transformSleeperData(
      allPlayers,
      projections,
      starredPlayers,
      positionFilter
    );
    setPlayers(transformedPlayers);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Determine season info and week to load
        const seasonInfo = getCurrentSeasonInfo();
        const defaultType = getDefaultRankingType();
        const defaultWeek = getDefaultWeek();
        
        // Use selected week/type or defaults
        const weekToLoad = selectedWeek === 'preseason' ? null : (selectedWeek || defaultWeek);
        const typeToLoad = selectedWeek === 'preseason' ? 'preseason' : 'weekly';
        
        setCurrentWeek(weekToLoad);
        setRankingType(typeToLoad);
        
        // Fetch all required data
        const [allPlayers, nflState] = await Promise.all([
          sleeperAPI.getAllPlayers(),
          sleeperAPI.getNFLState()
        ]);

        // Get projections only for weekly rankings
        let projections = {};
        if (typeToLoad === 'weekly' && weekToLoad) {
          try {
            projections = await sleeperAPI.getProjections(weekToLoad);
          } catch (err) {
            console.log('Failed to fetch projections, using empty object');
          }
        }

        // Check if user has a saved ranking for this position/week/season
        try {
          const queryParams = new URLSearchParams({
            position: positionFilter,
            season: seasonInfo.season.toString(),
            type: typeToLoad
          });
          
          if (weekToLoad) {
            queryParams.append('week', weekToLoad.toString());
          }
          
          const savedRankingResponse = await fetch(`/api/rankings?${queryParams.toString()}`);
          
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
                projectedPoints: (projections as any)[pr.player_id]?.pts_ppr || 0,
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
              // No saved ranking - try to load previous ranking as default for future weeks
              await loadDefaultOrPreviousRanking(allPlayers, projections, seasonInfo, weekToLoad, typeToLoad);
            }
          } else {
            // API error or no saved ranking - try to load previous ranking as default
            await loadDefaultOrPreviousRanking(allPlayers, projections, seasonInfo, weekToLoad, typeToLoad);
          }
        } catch (fetchError) {
          // Error fetching saved rankings (e.g., not authenticated) - use default Sleeper data
          console.log('Could not fetch saved rankings, using default data:', fetchError);
          await loadDefaultOrPreviousRanking(allPlayers, projections, seasonInfo, weekToLoad, typeToLoad);
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
  }, [positionFilter, selectedWeek]);

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

  const saveRankings = async (position: string): Promise<{ success: boolean; action: string; error?: string; positionRankingsUpdated?: boolean }> => {
    try {
      const seasonInfo = getCurrentSeasonInfo();
      
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          players: players,
          position: position,
          week: rankingType === 'preseason' ? null : currentWeek,
          season: seasonInfo.season,
          type: rankingType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, action: 'error', error: data.error || 'Failed to save rankings' };
      }

      // After successful save, the current state is now the "saved" state
      // No need to refetch since the user's current order is already what they want
      
      return { 
        success: true, 
        action: data.action,
        positionRankingsUpdated: data.positionRankingsUpdated
      };
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
    rankingType,
    toggleStar,
    reorderPlayers,
    updatePlayerRank,
    starredPlayers: Array.from(starredPlayers),
    saveRankings
  };
} 