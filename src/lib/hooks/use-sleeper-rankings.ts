'use client';
import { useState, useEffect } from 'react';
import { SleeperAPI } from '@/lib/sleeper-api';
import { transformSleeperData } from '@/lib/sleeper-utils';
import { RankingPlayer } from '@/lib/types';
import { getCurrentSeasonInfo, getDefaultRankingType, getDefaultWeek } from '@/lib/utils/season';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { getAverageRankings } from '@/lib/average-rankings';
import { getPositionLimits } from '@/lib/constants/position-limits';

export function useSleeperRankings(positionFilter: string = 'OVR', selectedWeek?: number | 'preseason', scoringFormat: string = 'half_ppr', selectedReference?: string | null) {
  const [players, setPlayers] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [rankingType, setRankingType] = useState<'preseason' | 'weekly'>('weekly');

  const sleeperAPI = new SleeperAPI();
  const { favorites, isFavorite, toggleFavorite: toggleFavoriteDB, loading: favoritesLoading } = useFavorites();

  // Helper function to load reference ranking
  const loadReferenceRanking = async (referenceId: string, allPlayers: any, projections: any) => {
    try {
      const response = await fetch('/api/rankings/reference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceRankingId: referenceId,
          targetPosition: positionFilter,
          targetWeek: selectedWeek === 'preseason' ? null : selectedWeek,
          targetSeason: getCurrentSeasonInfo().season,
          targetType: selectedWeek === 'preseason' ? 'preseason' : 'weekly'
        })
      });

      if (response.ok) {
        const { players: referencePlayers } = await response.json();
        
        // Transform reference players to include current projections and other data
        const transformedPlayers = referencePlayers.map((player: any) => ({
          ...player,
          projectedPoints: (() => {
            const projection = projections[player.id];
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
          avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${player.id}.jpg`,
          teamLogoUrl: `https://sleepercdn.com/images/team_logos/nfl/${player.team?.toLowerCase()}.png`,
          isStarred: isFavorite(player.id),
          injuryStatus: allPlayers[player.id]?.injury_status,
          age: allPlayers[player.id]?.age,
          college: allPlayers[player.id]?.college,
          yearsExp: allPlayers[player.id]?.years_exp,

        }));

        setPlayers(transformedPlayers);
        return true;
      }
    } catch (err) {
      console.log('Could not load reference ranking:', err);
    }
    return false;
  };

  // Helper function to load default or previous ranking
  const loadDefaultOrPreviousRanking = async (
    allPlayers: any, 
    projections: any, 
    seasonInfo: any, 
    weekToLoad: number | null, 
    typeToLoad: 'preseason' | 'weekly'
  ) => {
    // First, try to load user's saved rankings for the current week
    try {
      const savedRankingsResponse = await fetch(`/api/rankings?position=${positionFilter}&season=${seasonInfo.season}&type=${typeToLoad}&scoringFormat=${scoringFormat}${weekToLoad ? `&week=${weekToLoad}` : ''}`);
      
      if (savedRankingsResponse.ok) {
        const { rankings } = await savedRankingsResponse.json();
        
        if (rankings && rankings.length > 0) {
          // Use the most recent saved ranking
          const savedRanking = rankings[0];
          const savedPlayers = savedRanking.player_rankings || [];
          
          if (savedPlayers.length > 0) {
            // Get position limits for display filtering
            const limits = getPositionLimits(positionFilter);
            
            // Transform saved rankings to player format
            let filteredPlayers = savedPlayers;
            
            if (positionFilter === 'FLX') {
              // For FLX, filter out QBs from saved OVR rankings
              filteredPlayers = savedPlayers.filter((player: any) => {
                const sleeperPlayer = allPlayers[player.player_id];
                return sleeperPlayer && sleeperPlayer.position && !['QB'].includes(sleeperPlayer.position);
              });
            } else if (positionFilter !== 'OVR') {
              // For position-specific rankings, filter by position
              filteredPlayers = savedPlayers.filter((player: any) => {
                const sleeperPlayer = allPlayers[player.player_id];
                return sleeperPlayer && sleeperPlayer.position === positionFilter;
              });
            }
            
            const savedPlayersFormatted = filteredPlayers
              .sort((a: any, b: any) => a.rank_position - b.rank_position)
              .slice(0, limits.displayLimit)
              .map((player: any, index: number) => ({
                id: player.player_id,
                name: player.player_name,
                team: player.team,
                position: allPlayers[player.player_id]?.position || positionFilter,
                rank: index + 1,
                projectedPoints: (() => {
                  const projection = (projections as any)[player.player_id];
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
                avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg`,
                teamLogoUrl: `https://sleepercdn.com/images/team_logos/nfl/${player.team?.toLowerCase()}.png`,
                isStarred: isFavorite(player.player_id),
                injuryStatus: allPlayers[player.player_id]?.injury_status || null,
                age: allPlayers[player.player_id]?.age || null,
                college: allPlayers[player.player_id]?.college || null,
                yearsExp: allPlayers[player.player_id]?.years_exp || null,
              }));
            
            setPlayers(savedPlayersFormatted);
            setError(null);
            setLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      // If loading saved rankings fails, continue to fallback
    }
    
    // If no rankings found for current week and this is a weekly ranking, try previous week
    if (typeToLoad === 'weekly' && weekToLoad && weekToLoad > 1) {
      try {
        const previousWeek = weekToLoad - 1;
        const previousWeekResponse = await fetch(`/api/rankings?position=${positionFilter}&season=${seasonInfo.season}&type=${typeToLoad}&scoringFormat=${scoringFormat}&week=${previousWeek}`);
        
        if (previousWeekResponse.ok) {
          const { rankings } = await previousWeekResponse.json();
          
          if (rankings && rankings.length > 0) {
            // Use the most recent saved ranking from previous week
            const savedRanking = rankings[0];
            const savedPlayers = savedRanking.player_rankings || [];
            
            if (savedPlayers.length > 0) {
              // Get position limits for display filtering
              const limits = getPositionLimits(positionFilter);
              
              // Transform saved rankings to player format
              let filteredPlayers = savedPlayers;
              
              if (positionFilter === 'FLX') {
                // For FLX, filter out QBs from saved OVR rankings
                filteredPlayers = savedPlayers.filter((player: any) => {
                  const sleeperPlayer = allPlayers[player.player_id];
                  return sleeperPlayer && sleeperPlayer.position && !['QB'].includes(sleeperPlayer.position);
                });
              } else if (positionFilter !== 'OVR') {
                // For position-specific rankings, filter by position
                filteredPlayers = savedPlayers.filter((player: any) => {
                  const sleeperPlayer = allPlayers[player.player_id];
                  return sleeperPlayer && sleeperPlayer.position === positionFilter;
                });
              }
              
              const savedPlayersFormatted = filteredPlayers
                .sort((a: any, b: any) => a.rank_position - b.rank_position)
                .slice(0, limits.displayLimit)
                .map((player: any, index: number) => ({
                  id: player.player_id,
                  name: player.player_name,
                  team: player.team,
                  position: allPlayers[player.player_id]?.position || positionFilter,
                  rank: index + 1,
                  projectedPoints: (() => {
                    const projection = (projections as any)[player.player_id];
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
                  avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg`,
                  teamLogoUrl: `https://sleepercdn.com/images/team_logos/nfl/${player.team?.toLowerCase()}.png`,
                  isStarred: isFavorite(player.player_id),
                  injuryStatus: allPlayers[player.player_id]?.injury_status || null,
                  age: allPlayers[player.player_id]?.age || null,
                  college: allPlayers[player.player_id]?.college || null,
                  yearsExp: allPlayers[player.player_id]?.years_exp || null,
                }));
              
              setPlayers(savedPlayersFormatted);
              setError(null);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        // If loading previous week rankings fails, continue to fallback
      }
    }
    
    // Fallback to average rankings if no saved rankings found
    let averageRankings: any[] = [];
    try {
      averageRankings = await getAverageRankings(positionFilter, seasonInfo.season, 'preseason', undefined);
      
      if (averageRankings.length > 0) {
            // Get position limits for display filtering
            const limits = getPositionLimits(positionFilter);
            
            // Transform average rankings directly to player format - NO DUPLICATES
            let filteredRankings = averageRankings;
            
            if (positionFilter === 'FLX') {
              // For FLX, use OVR rankings but exclude QBs
              filteredRankings = averageRankings
                .filter(avg => avg.position === 'OVR') // Get OVR rankings
                .filter(avg => {
                  // Get the player's actual position from allPlayers
                  const player = allPlayers[avg.player_id];
                  return player && player.position && !['QB'].includes(player.position);
                });
            } else {
              // For other positions, use position-specific rankings
              filteredRankings = averageRankings.filter(avg => avg.position === positionFilter);
            }
            
                        const averagePlayers = filteredRankings
              .sort((a, b) => a.average_rank - b.average_rank) // Sort by average_rank (lowest first)
              .slice(0, limits.displayLimit) // Apply display limit
              .map((avg, index) => ({
                id: avg.player_id,
                name: avg.player_name,
                team: avg.team,
                position: allPlayers[avg.player_id]?.position || positionFilter, // Use actual player position
                rank: index + 1, // Sequential display rank (1, 2, 3, etc.)
            projectedPoints: (() => {
              const projection = (projections as any)[avg.player_id];
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
            avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${avg.player_id}.jpg`,
            teamLogoUrl: `https://sleepercdn.com/images/team_logos/nfl/${avg.team?.toLowerCase()}.png`,
            isStarred: isFavorite(avg.player_id),
            injuryStatus: allPlayers[avg.player_id]?.injury_status || null,
            age: allPlayers[avg.player_id]?.age || null,
            college: allPlayers[avg.player_id]?.college || null,
            yearsExp: allPlayers[avg.player_id]?.years_exp || null,
          }));
        
                    setPlayers(averagePlayers);
            setError(null);
            setLoading(false);
            return;
          } else {
            setPlayers([]);
            setError('No average rankings available for this position');
            setLoading(false);
            return;
          }
        } catch (err) {
          // If no average rankings available, show empty state
          setPlayers([]);
          setError('Failed to load average rankings');
          setLoading(false);
          return;
        }
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
        
        if (typeToLoad === 'weekly' && weekToLoad) {
          try {
            projections = await sleeperAPI.getProjections(weekToLoad);
          } catch (err) {
            console.log('Failed to fetch projections, using empty object');
          }
        } else if (typeToLoad === 'preseason') {
          try {
            // For preseason, sum up all weekly projections (weeks 1-18) for accurate season totals
            const seasonProjections: Record<string, any> = {};
            let successfulWeeks = 0;
            
            // Use 2025 season projections
            let season = 2025; // Use 2025 as default since Sleeper API now has 2025 data
            
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

        // Handle reference ranking if specified
        if (selectedReference && selectedReference !== 'default') {
          const referenceLoaded = await loadReferenceRanking(selectedReference, allPlayers, projections);
          if (referenceLoaded) {
            setError(null);
            setLoading(false);
            return;
          }
        }

        // Always use average rankings as the primary source
        await loadDefaultOrPreviousRanking(allPlayers, projections, seasonInfo, weekToLoad, typeToLoad);

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
  }, [positionFilter, selectedWeek, scoringFormat, selectedReference, favorites, favoritesLoading]);

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

  const saveRankings = async (position: string): Promise<{ success: boolean; action: string; error?: string; positionRankingsUpdated?: boolean; newlyEarned?: any[] }> => {
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
          type: rankingType,
          scoringFormat: scoringFormat
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, action: 'error', error: data.error || 'Failed to save rankings' };
      }

      // Show badge notifications if any were earned
      if (data.newlyEarned && data.newlyEarned.length > 0) {
        // Import the toast function
        const { toast } = await import('sonner');
        data.newlyEarned.forEach((badge: any) => {
          toast.success(`🎉 Earned ${badge.name} badge! ${badge.description}`, {
            duration: 5000,
            action: {
              label: 'View Badges',
              onClick: () => window.location.href = '/profile'
            }
          });
        });
      }

      // After successful save, the current state is now the "saved" state
      // No need to refetch since the user's current order is already what they want
      
      return { 
        success: true, 
        action: data.action,
        positionRankingsUpdated: data.positionRankingsUpdated,
        newlyEarned: data.newlyEarned || []
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