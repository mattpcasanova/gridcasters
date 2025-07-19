import { BADGES, type Badge } from '@/lib/constants/badges';

export interface PlayerRanking {
  id: string;
  ranking_id: string;
  player_id: string;
  player_name: string;
  team: string;
  position: string;
  rank_position: number;
  is_starred: boolean;
  created_at: string;
}

export interface ActualPerformance {
  playerId: string;
  playerName: string;
  team: string;
  position: string;
  actualRank: number;
  actualPoints: number;
  isActive: boolean;
  week?: number;
  season?: number;
}

export interface AccuracyScoreResult {
  totalScore: number;
  maxPossibleScore: number;
  accuracyPercentage: number;
  breakdown: {
    baseScore: number;
    bonuses: number;
    penalties: number;
    details: {
      perfectMatches: number;
      closeMatches: number;
      top10Correct: number;
      top5Correct: number;
      busts: number;
      inactivePlayers: number;
    };
  };
}

/**
 * Fetch real performance data from Sleeper API only
 */
export async function fetchRealPerformanceData(
  position: string, 
  week?: number, 
  season?: number
): Promise<ActualPerformance[]> {
  try {
    // Try to fetch from Sleeper API
    const data = await fetchFromSleeperAPI(position, week, season);
    if (data && data.length > 0) {
      return data;
    }

    // If Sleeper API fails, return empty array
    console.warn('Sleeper API failed, no performance data available');
    return [];
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return [];
  }
}

async function fetchFromSleeperAPI(position: string, week?: number, season?: number): Promise<ActualPerformance[]> {
  try {
    const currentSeason = season || new Date().getFullYear();
    const currentWeek = week || getCurrentWeek();
    
    // Fetch player stats from Sleeper API
    const response = await fetch(`https://api.sleeper.app/v1/stats/nfl/${currentSeason}/${currentWeek}`);
    if (!response.ok) throw new Error('Sleeper API failed');
    
    const stats = await response.json();
    
    // Filter by position and convert to our format
    const positionStats = Object.entries(stats)
      .filter(([playerId, playerStats]: [string, any]) => {
        // Get player info to check position
        const player = getPlayerInfo(playerId);
        return player?.position === position;
      })
      .map(([playerId, playerStats]: [string, any]) => {
        const player = getPlayerInfo(playerId);
        const points = calculateFantasyPoints(playerStats, 'half_ppr'); // Default to half PPR
        
        return {
          playerId,
          playerName: player?.name || 'Unknown Player',
          team: player?.team || 'Unknown',
          position: player?.position || position,
          actualPoints: points,
          isActive: points > 0,
          week: currentWeek,
          season: currentSeason
        };
      })
      .filter(player => player.isActive)
      .sort((a, b) => b.actualPoints - a.actualPoints)
      .map((player, index) => ({
        ...player,
        actualRank: index + 1
      }));

    return positionStats;
  } catch (error) {
    console.error('Sleeper API error:', error);
    throw error;
  }
}

function getCurrentWeek(): number {
  const now = new Date();
  const seasonStart = new Date(now.getFullYear(), 8, 5); // September 5th
  const weekDiff = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, Math.min(18, weekDiff + 1)); // NFL season is 18 weeks
}

function getPlayerInfo(playerId: string): any {
  // This would fetch from a cached player database
  // For now, return mock data
  return {
    name: `Player ${playerId}`,
    team: 'TEAM',
    position: 'QB'
  };
}

function calculateFantasyPoints(stats: any, scoringFormat: string): number {
  // Calculate fantasy points based on scoring format
  let points = 0;
  
  // Passing
  points += (stats.pass_yd || 0) * 0.04;
  points += (stats.pass_td || 0) * 4;
  points -= (stats.pass_int || 0) * 2;
  
  // Rushing
  points += (stats.rush_yd || 0) * 0.1;
  points += (stats.rush_td || 0) * 6;
  
  // Receiving
  points += (stats.rec_yd || 0) * 0.1;
  points += (stats.rec_td || 0) * 6;
  
  // PPR adjustments
  if (scoringFormat === 'ppr') {
    points += (stats.rec || 0) * 1;
  } else if (scoringFormat === 'half_ppr') {
    points += (stats.rec || 0) * 0.5;
  }
  
  return Math.round(points * 100) / 100;
}

/**
 * Calculate accuracy score for a ranking against actual performance
 */
export function calculateAccuracyScore(
  playerRankings: PlayerRanking[],
  actualPerformance: ActualPerformance[],
  position: string
): AccuracyScoreResult {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let perfectMatches = 0;
  let closeMatches = 0;
  let top10Correct = 0;
  let top5Correct = 0;
  let busts = 0;
  let inactivePlayers = 0;

  // If no actual performance data, return zero score
  if (!actualPerformance || actualPerformance.length === 0) {
    return {
      totalScore: 0,
      maxPossibleScore: 0,
      accuracyPercentage: 0,
      breakdown: {
        baseScore: 0,
        bonuses: 0,
        penalties: 0,
        details: {
          perfectMatches: 0,
          closeMatches: 0,
          top10Correct: 0,
          top5Correct: 0,
          busts: 0,
          inactivePlayers: 0,
        }
      }
    };
  }

  // Create lookup map for actual performance
  const actualMap = new Map(
    actualPerformance.map(p => [p.playerId, p])
  );

  // Calculate scores for each ranked player
  for (const ranking of playerRankings) {
    const actual = actualMap.get(ranking.player_id);
    if (!actual) continue;

    const predictedRank = ranking.rank_position;
    const actualRank = actual.actualRank;
    const rankDifference = Math.abs(predictedRank - actualRank);

    // Base score calculation
    let baseScore = 0;
    if (rankDifference === 0) {
      baseScore = 100;
      perfectMatches++;
    } else if (rankDifference === 1) {
      baseScore = 85;
      closeMatches++;
    } else if (rankDifference === 2) {
      baseScore = 70;
      closeMatches++;
    } else if (rankDifference === 3) {
      baseScore = 55;
    } else if (rankDifference === 4) {
      baseScore = 40;
    } else if (rankDifference === 5) {
      baseScore = 25;
    } else if (rankDifference <= 10) {
      baseScore = Math.max(10, 25 - (rankDifference - 5) * 3);
    } else {
      baseScore = Math.max(0, 10 - (rankDifference - 10) * 2);
    }

    totalScore += baseScore;
    maxPossibleScore += 100;

    // Bonus points for top performers
    if (actualRank <= 10 && predictedRank <= 10) {
      totalScore += 15;
      top10Correct++;
    }
    if (actualRank <= 5 && predictedRank <= 5) {
      totalScore += 10;
      top5Correct++;
    }

    // Penalties for busts
    if (actualRank > 20 && predictedRank <= 10) {
      totalScore -= 15;
      busts++;
    }
    if (actualRank > 20 && predictedRank <= 5) {
      totalScore -= 20;
      busts++;
    }

    // Penalties for inactive players
    if (!actual.isActive) {
      totalScore -= 10;
      inactivePlayers++;
    }
  }

  // Calculate final percentage
  const accuracyPercentage = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100) 
    : 0;

  return {
    totalScore,
    maxPossibleScore,
    accuracyPercentage,
    breakdown: {
      baseScore: totalScore - (top10Correct * 15) - (top5Correct * 10) + (busts * 15) + (inactivePlayers * 10),
      bonuses: (top10Correct * 15) + (top5Correct * 10),
      penalties: (busts * 15) + (inactivePlayers * 10),
      details: {
        perfectMatches,
        closeMatches,
        top10Correct,
        top5Correct,
        busts,
        inactivePlayers,
      }
    }
  };
} 