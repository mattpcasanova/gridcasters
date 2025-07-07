'use client';
import { useState, useEffect } from 'react';
import { SleeperAPI } from '@/lib/sleeper-api';
import { transformSleeperData } from '@/lib/sleeper-utils';
import { RankingPlayer } from '@/lib/types';
import { getCurrentSeasonInfo, getDefaultRankingType, getDefaultWeek } from '@/lib/utils/season';
import { useFavorites } from '@/lib/hooks/use-favorites';

export function useSleeperRankings(positionFilter: string = 'OVR', selectedWeek?: number | 'preseason', scoringFormat: string = 'half_ppr') {
  const [players, setPlayers] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [rankingType, setRankingType] = useState<'preseason' | 'weekly'>('weekly');

  const sleeperAPI = new SleeperAPI();
  const { favorites, isFavorite, toggleFavorite: toggleFavoriteDB, loading: favoritesLoading } = useFavorites();

  // Helper function to load default or previous ranking
  const loadDefaultOrPreviousRanking = async (
    allPlayers: any, 
    projections: any, 
    seasonInfo: any, 
    weekToLoad: number | null, 
    typeToLoad: 'preseason' | 'weekly',
    matchups: any = {}
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
                position: allPlayers[pr.player_id]?.position || pr.position, // Use actual player position
                projectedPoints: (() => {
                  const projection = (projections as any)[pr.player_id];
                  if (!projection) return 0;
                  
                  switch (scoringFormat) {
                    case 'std':
                      return projection.pts_std || 0;
                    case 'ppr':
                      return projection.pts_ppr || 0;
                    case 'half_ppr':
                    default:
                      return projection.pts_half_ppr || (projection.pts_ppr ? projection.pts_ppr * 0.95 : 0);
                  }
                })(),
                avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${pr.player_id}.jpg`,
                teamLogoUrl: `https://sleepercdn.com/images/team_logos/nfl/${pr.team?.toLowerCase()}.png`,
                isStarred: isFavorite(pr.player_id),
                rank: index + 1, // Maintain the previous ranking order
                injuryStatus: allPlayers[pr.player_id]?.injury_status,
                age: allPlayers[pr.player_id]?.age,
                college: allPlayers[pr.player_id]?.college,
                yearsExp: allPlayers[pr.player_id]?.years_exp,
                matchup: undefined // Not needed for fallback rankings
              }));
            
            setPlayers(baseOrder);
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
      new Set(favorites.map(f => f.player_id)),
      positionFilter,
      matchups,
      scoringFormat
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

        // Get projections based on ranking type
        let projections = {};
        let matchups = {};
        
        if (typeToLoad === 'weekly' && weekToLoad) {
          try {
            projections = await sleeperAPI.getProjections(weekToLoad);
            // Get matchups for weekly rankings
            matchups = await sleeperAPI.getMatchups(weekToLoad);
          } catch (err) {
            console.log('Failed to fetch projections/matchups, using empty object');
          }
        } else if (typeToLoad === 'preseason') {
          try {
            // For preseason, sum up all weekly projections (weeks 1-18) for accurate season totals
            const seasonProjections: Record<string, any> = {};
            let successfulWeeks = 0;
            
            // Try current season first, then fall back to 2024
            let season = 2025;
            let hasValidData = false;
            
            // Test if we can get data from current season
            try {
              const testProjections = await sleeperAPI.getProjections(1, season);
              const validProjections = Object.values(testProjections).filter((p: any) => p && p.pts_ppr && p.pts_ppr > 0);
              if (validProjections.length > 100) {
                hasValidData = true;
              }
            } catch {
              // Current season failed
            }
            
            if (!hasValidData) {
              console.log('Current season projections insufficient, using 2024...');
              season = 2024;
            }
            
            // Fetch projections for all 18 weeks in parallel for speed
            const weekPromises = [];
            for (let week = 1; week <= 18; week++) {
              weekPromises.push(
                sleeperAPI.getProjections(week, season).catch((error) => {
                  console.warn(`Failed to fetch projections for week ${week}:`, error);
                  return null;
                })
              );
            }
            
            const weeklyProjectionsArray = await Promise.all(weekPromises);
            
            // Sum up all the weekly projections
            weeklyProjectionsArray.forEach((weeklyProjections, index) => {
              if (weeklyProjections && Object.keys(weeklyProjections).length > 0) {
                successfulWeeks++;
                
                Object.entries(weeklyProjections).forEach(([playerId, projection]: [string, any]) => {
                  if (projection && projection.pts_ppr && projection.pts_ppr > 0) {
                    if (!seasonProjections[playerId]) {
                      seasonProjections[playerId] = { pts_ppr: 0, pts_half_ppr: 0, pts_std: 0 };
                    }
                    seasonProjections[playerId].pts_ppr += projection.pts_ppr || 0;
                    seasonProjections[playerId].pts_half_ppr += projection.pts_half_ppr || projection.pts_ppr * 0.9 || 0;
                    seasonProjections[playerId].pts_std += projection.pts_std || projection.pts_ppr * 0.8 || 0;
                  }
                });
              }
            });
            
            console.log(`Season projections created from ${successfulWeeks} weeks of data (${season} season)`);
            projections = seasonProjections;
          } catch (err) {
            console.log('Failed to fetch season projections, using empty object');
          }
        }

        // For preseason rankings, always use fresh data to ensure we get the latest projections
        if (typeToLoad === 'preseason') {
          await loadDefaultOrPreviousRanking(allPlayers, projections, seasonInfo, weekToLoad, typeToLoad, matchups);
        } else {
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
                  position: allPlayers[pr.player_id]?.position || pr.position, // Use actual player position from Sleeper data
                  projectedPoints: (() => {
                    const projection = (projections as any)[pr.player_id];
                    if (!projection) return 0;
                    
                    switch (scoringFormat) {
                      case 'std':
                        return projection.pts_std || 0;
                      case 'ppr':
                        return projection.pts_ppr || 0;
                      case 'half_ppr':
                      default:
                        return projection.pts_half_ppr || (projection.pts_ppr ? projection.pts_ppr * 0.95 : 0);
                    }
                  })(),
                  avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${pr.player_id}.jpg`,
                  teamLogoUrl: `https://sleepercdn.com/images/team_logos/nfl/${pr.team?.toLowerCase()}.png`,
                  isStarred: isFavorite(pr.player_id),
                  rank: pr.rank_position,
                  injuryStatus: allPlayers[pr.player_id]?.injury_status,
                  age: allPlayers[pr.player_id]?.age,
                  college: allPlayers[pr.player_id]?.college,
                  yearsExp: allPlayers[pr.player_id]?.years_exp,
                  matchup: matchups && (matchups as any)[pr.team] ? {
                    opponent: (matchups as any)[pr.team].opponent,
                    isHome: (matchups as any)[pr.team].isHome,
                    week: (matchups as any)[pr.team].week
                  } : undefined
                })).sort((a: any, b: any) => a.rank - b.rank);
                
                setPlayers(savedPlayers);
              } else {
                // No saved ranking - try to load previous ranking as default for future weeks
                await loadDefaultOrPreviousRanking(allPlayers, projections, seasonInfo, weekToLoad, typeToLoad, matchups);
              }
            } else {
              // API error or no saved ranking - try to load previous ranking as default
              await loadDefaultOrPreviousRanking(allPlayers, projections, seasonInfo, weekToLoad, typeToLoad, matchups);
            }
          } catch (fetchError) {
            // Error fetching saved rankings (e.g., not authenticated) - use default Sleeper data
            console.log('Could not fetch saved rankings, using default data:', fetchError);
            await loadDefaultOrPreviousRanking(allPlayers, projections, seasonInfo, weekToLoad, typeToLoad, matchups);
          }
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Sleeper API error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when favorites are loaded
    if (!favoritesLoading) {
      fetchData();
    }
  }, [positionFilter, selectedWeek, scoringFormat, favorites, favoritesLoading]);

  const toggleStar = async (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    // Update the database
    await toggleFavoriteDB({
      id: player.id,
      name: player.name,
      team: player.team,
      position: player.position
    });

    // Update the players array
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { ...p, isStarred: !p.isStarred }
        : p
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
    loading: loading || favoritesLoading,
    error,
    currentWeek,
    rankingType,
    toggleStar,
    reorderPlayers,
    updatePlayerRank,
    starredPlayers: favorites.map(f => f.player_id),
    saveRankings
  };
} 