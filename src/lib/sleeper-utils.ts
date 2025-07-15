import { SleeperPlayer, PlayerProjections, RankingPlayer } from '@/lib/types';
import { getPositionLimits } from '@/lib/constants/position-limits';

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
  matchups?: Record<string, any>,
  scoringFormat: string = 'half_ppr'
): RankingPlayer[] => {
  const playerArray = Object.values(players);
  
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

  // Filter active players with teams
  filteredPlayers = filteredPlayers.filter(player => 
    player.status === 'Active' && 
    player.team && 
    player.team !== 'null' &&
    player.team !== null
  );

  // Get position limits
  const limits = getPositionLimits(positionFilter);

  // Transform players
  let transformedPlayers: RankingPlayer[] = filteredPlayers
    .map(player => {
      return {
        id: player.player_id,
        name: `${player.first_name} ${player.last_name}`,
        team: player.team,
        position: player.position, // Use position directly since we only allow QB, RB, WR, TE
        projectedPoints: (() => {
          const projection = projections[player.player_id];
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
        matchup: matchups && matchups[player.team] ? {
          opponent: matchups[player.team].opponent,
          isHome: matchups[player.team].isHome,
          week: matchups[player.team].week
        } : undefined
      };
    })
    // Sort by projected points (descending)
    .sort((a, b) => b.projectedPoints - a.projectedPoints);

  // Apply position-specific display limit
  transformedPlayers = transformedPlayers.slice(0, limits.displayLimit);

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