import { SleeperPlayer, PlayerProjections, RankingPlayer } from '@/lib/types';

export const getPlayerAvatarURL = (playerId: string): string => {
  return `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`;
};

export const getTeamLogoURL = (teamAbbr: string): string => {
  return `https://sleepercdn.com/images/team_logos/nfl/${teamAbbr?.toLowerCase()}.png`;
};

export const transformSleeperData = (
  players: Record<string, SleeperPlayer>,
  projections: PlayerProjections,
  starredPlayers: Set<string>,
  positionFilter: string = 'OVR'
): RankingPlayer[] => {
  const playerArray = Object.values(players);
  
  // Filter by position
  let filteredPlayers = playerArray.filter(player => {
    if (positionFilter === 'OVR') return true;
    if (positionFilter === 'FLX') return ['RB', 'WR', 'TE'].includes(player.position);
    return player.position === positionFilter;
  });

  // Filter active players with teams
  filteredPlayers = filteredPlayers.filter(player => 
    player.status === 'Active' && 
    player.team && 
    player.team !== 'null' &&
    player.team !== null
  );

  // Transform and sort by projected points
  const transformedPlayers: RankingPlayer[] = filteredPlayers
    .map(player => ({
      id: player.player_id,
      name: `${player.first_name} ${player.last_name}`,
      team: player.team,
      position: player.position,
      projectedPoints: projections[player.player_id]?.pts_ppr || 0,
      avatarUrl: getPlayerAvatarURL(player.player_id),
      teamLogoUrl: getTeamLogoURL(player.team),
      isStarred: starredPlayers.has(player.player_id),
      rank: 0, // Will be set after sorting
      injuryStatus: player.injury_status,
      age: player.age,
      college: player.college,
      yearsExp: player.years_exp
    }))
    .sort((a, b) => b.projectedPoints - a.projectedPoints)
    .slice(0, 50) // Top 50 players for performance
    .map((player, index) => ({
      ...player,
      rank: index + 1
    }));

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
    TE: 'bg-yellow-100 text-yellow-800',
    K: 'bg-purple-100 text-purple-800',
    DEF: 'bg-gray-100 text-gray-800'
  };
  return colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}; 