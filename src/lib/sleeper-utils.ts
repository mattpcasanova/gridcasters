import { SleeperPlayer, PlayerProjections, RankingPlayer } from '@/lib/types';
import { getPositionLimits } from '@/lib/constants/position-limits';
import { getSavedPreseasonRankings, createSavedRankingsMap } from '@/lib/saved-rankings-fallback';
import { AveragePlayerRanking } from '@/lib/average-rankings';

export const getPlayerAvatarURL = (playerId: string): string => {
  return `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`;
};

export const getTeamLogoURL = (teamAbbr: string): string => {
  return `https://sleepercdn.com/images/team_logos/nfl/${teamAbbr?.toLowerCase()}.png`;
};

// No longer need position mapping since we only use QB, RB, WR, TE

export const transformSleeperData = (
  players: Record<string, SleeperPlayer>,
  projections: PlayerProjections,
  starredPlayers: Set<string>,
  positionFilter: string = 'OVR',
  scoringFormat: string = 'half_ppr',
  savedRankings?: Record<string, number>,
  averageRankings?: AveragePlayerRanking[]
): RankingPlayer[] => {
  const playerArray = Object.values(players);
  
  console.log(`TransformSleeperData Debug - Total players from API: ${playerArray.length}`);
  
  // Filter by position - only include relevant fantasy positions
  let filteredPlayers = playerArray.filter(player => {
    // Only include fantasy-relevant positions: QB, RB, WR, TE
    const validPositions = ['QB', 'RB', 'WR', 'TE'];
    if (!validPositions.includes(player.position)) {
      return false;
    }
    
    if (positionFilter === 'OVR') {
      // OVR includes QB, RB, WR, TE
      return ['QB', 'RB', 'WR', 'TE'].includes(player.position);
    }
    if (positionFilter === 'FLX') {
      // FLX includes RB, WR, TE
      return ['RB', 'WR', 'TE'].includes(player.position);
    }
    // For specific positions (QB, RB, WR, TE)
    return player.position === positionFilter;
  });

  console.log(`TransformSleeperData Debug - After position filter (${positionFilter}): ${filteredPlayers.length} players`);

  // Filter active players with teams
  filteredPlayers = filteredPlayers.filter(player => 
    player.status === 'Active' && 
    player.team && 
    player.team !== 'null' &&
    player.team !== null
  );

  console.log(`TransformSleeperData Debug - After active/team filter: ${filteredPlayers.length} players`);

  // Get position limits
  const limits = getPositionLimits(positionFilter);
  console.log(`TransformSleeperData Debug - Position limits for ${positionFilter}:`, limits);

  // Transform players
  let transformedPlayers: RankingPlayer[] = filteredPlayers
    .map(player => {
      return {
        id: player.player_id,
        name: `${player.first_name} ${player.last_name}`,
        team: player.team,
        position: player.position, // Use position directly since we only allow QB, RB, WR, TE
        projectedPoints: (() => {
          // Try to find projection by Sleeper ID first
          let projection = projections[player.player_id];
          
          // If not found, try to find by name (for ESPN data)
          if (!projection) {
            const playerName = `${player.first_name} ${player.last_name}`.toLowerCase();
            Object.entries(projections).forEach(([key, proj]: [string, any]) => {
              if (proj.player_name && proj.player_name.toLowerCase() === playerName) {
                projection = proj;
              }
            });
          }
          
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
        avatarUrl: getPlayerAvatarURL(player.player_id),
        teamLogoUrl: getTeamLogoURL(player.team),
        isStarred: starredPlayers.has(player.player_id),
        rank: 0, // Will be set after sorting
        injuryStatus: player.injury_status,
        age: player.age,
        college: player.college,
        yearsExp: player.years_exp,

      };
    })
    // Sort by projected points (descending), fallback to average rankings, then saved rankings, then ESPN rankings
    .sort((a, b) => {
      // If both have projections, sort by projections
      if (a.projectedPoints > 0 && b.projectedPoints > 0) {
        return b.projectedPoints - a.projectedPoints;
      }
      
      // If only one has projections, prioritize the one with projections
      if (a.projectedPoints > 0 && b.projectedPoints === 0) {
        return -1;
      }
      if (a.projectedPoints === 0 && b.projectedPoints > 0) {
        return 1;
      }
      
      // If neither has projections, use average rankings first, then saved rankings, then ESPN rankings
      if (averageRankings && averageRankings.length > 0) {
        const aAvgRanking = averageRankings.find(avg => avg.player_id === a.id);
        const bAvgRanking = averageRankings.find(avg => avg.player_id === b.id);
        
        // If both have average rankings, sort by average rank
        if (aAvgRanking && bAvgRanking) {
          return aAvgRanking.average_rank - bAvgRanking.average_rank;
        }
        
        // If only one has average ranking, prioritize the one with average ranking
        if (aAvgRanking && !bAvgRanking) {
          return -1;
        }
        if (!aAvgRanking && bAvgRanking) {
          return 1;
        }
      }
      
      // If no average rankings, use saved rankings
      if (savedRankings) {
        const aSavedRank = savedRankings[a.id];
        const bSavedRank = savedRankings[b.id];
        
        // If both have saved rankings, sort by saved rank
        if (aSavedRank && bSavedRank) {
          return aSavedRank - bSavedRank;
        }
        
        // If only one has saved ranking, prioritize the one with saved ranking
        if (aSavedRank && !bSavedRank) {
          return -1;
        }
        if (!aSavedRank && bSavedRank) {
          return 1;
        }
      }
      
      // No final fallback - if no average rankings, maintain current order
      return 0;
    });

  console.log(`TransformSleeperData Debug - After transformation and sorting: ${transformedPlayers.length} players`);

  // Only apply position-specific display limit if we don't have saved or average rankings
  // This ensures all players from saved rankings are shown
  if (!savedRankings && (!averageRankings || averageRankings.length === 0)) {
    transformedPlayers = transformedPlayers.slice(0, limits.displayLimit);
    console.log(`TransformSleeperData Debug - Applied display limit (${limits.displayLimit}): ${transformedPlayers.length} players`);
  } else {
    console.log(`TransformSleeperData Debug - Skipped display limit due to saved/average rankings: ${transformedPlayers.length} players`);
  }

  // Set ranks after filtering and sorting
  transformedPlayers = transformedPlayers.map((player, index) => ({
    ...player,
    rank: index + 1
  }));

  console.log(`TransformSleeperData: ${positionFilter} - Found ${filteredPlayers.length} players, returning ${transformedPlayers.length} (limit: ${limits.displayLimit})`);

  return transformedPlayers;
};

export const getInjuryStatusColor = (status?: string): string => {
  if (!status) return '';
  
  switch (status.toLowerCase()) {
    case 'questionable':
      return 'text-yellow-600 bg-yellow-50';
    case 'doubtful':
      return 'text-orange-600 bg-orange-50';
    case 'out':
    case 'ir':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getPositionColor = (position: string): string => {
  const colors = {
    QB: 'bg-red-100 text-red-800',
    RB: 'bg-green-100 text-green-800',
    WR: 'bg-blue-100 text-blue-800',
    TE: 'bg-yellow-100 text-yellow-800'
  };
  return colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}; 