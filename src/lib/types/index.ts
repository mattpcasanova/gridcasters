// Sleeper API Types
export interface SleeperPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  team: string;
  status: string;
  injury_status?: string;
  age?: number;
  height?: string;
  weight?: string;
  years_exp?: number;
  college?: string;
}

export interface PlayerProjections {
  [playerId: string]: {
    pts_ppr?: number;
    pts_std?: number;
    pts_half_ppr?: number;
    rush_yds?: number;
    rec_yds?: number;
    pass_yds?: number;
    rush_td?: number;
    rec_td?: number;
    pass_td?: number;
  };
}

export interface RankingPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  projectedPoints: number;
  avatarUrl: string;
  teamLogoUrl: string;
  isStarred: boolean;
  rank: number;
  injuryStatus?: string;
  age?: number;
  college?: string;
  yearsExp?: number;
}

export interface NFLState {
  week: number;
  season: number;
  season_type: 'regular' | 'post' | 'pre';
  leg: number;
} 