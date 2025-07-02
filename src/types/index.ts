export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'OVR' | 'FLX';

export type RankingType = 'weekly' | 'preseason';

export interface Profile {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  isPrivate: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Ranking {
  id: string;
  userId: string;
  title: string;
  position: Position;
  type: RankingType;
  week?: number;
  season: number;
  accuracyScore?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerRanking {
  id: string;
  rankingId: string;
  playerId: string;
  playerName: string;
  team: string;
  position: Position;
  rankPosition: number;
  isStarred: boolean;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  isPrivate: boolean;
  hostId: string;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  joinedAt?: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface RankingPreview {
  id: string;
  title: string;
  position: Position;
  type: RankingType;
  accuracyScore?: number;
  createdAt: string;
}

export interface User {
  id: string;
  profile: Profile;
  rankings: RankingPreview[];
  followers: number;
  following: number;
} 