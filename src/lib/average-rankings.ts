import { supabase } from './supabase/client';

export interface AveragePlayerRanking {
  id: string;
  player_id: string;
  player_name: string;
  team: string;
  position: string;
  season: number;
  type: string;
  week: number | null;
  average_rank: number;
  total_rankings: number;
  last_updated: string;
}

export async function getAverageRankings(
  position: string,
  season: number = 2025,
  type: string = 'preseason',
  week?: number
): Promise<AveragePlayerRanking[]> {
  try {
    console.log(`getAverageRankings Debug - Fetching for position=${position}, season=${season}, type=${type}, week=${week}`);

    // Use a more specific query to avoid duplicates by selecting distinct player_id
    let query = supabase
      .from('player_average_rankings')
      .select('*')
      .eq('position', position)
      .eq('season', season)
      .eq('type', type)
      .order('average_rank', { ascending: true });

    if (week !== undefined) {
      query = query.eq('week', week);
    } else {
      query = query.is('week', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('getAverageRankings Debug - Error fetching average rankings:', error);
      return [];
    }

    console.log(`getAverageRankings Debug - Found ${data?.length || 0} average rankings for ${position}`);
    if (data && data.length > 0) {
      console.log(`getAverageRankings Debug - First 3 rankings:`, data.slice(0, 3).map(r => ({ player_id: r.player_id, player_name: r.player_name, average_rank: r.average_rank })));
    }

    // Deduplicate by player_id - keep the first occurrence (lowest average_rank due to ordering)
    const uniqueData = data ? data.filter((ranking, index, self) => 
      index === self.findIndex(r => r.player_id === ranking.player_id)
    ) : [];

    console.log(`getAverageRankings Debug - After deduplication: ${uniqueData.length} unique rankings for ${position}`);
    if (uniqueData.length > 0) {
      console.log(`getAverageRankings Debug - First 3 unique rankings:`, uniqueData.slice(0, 3).map(r => ({ player_id: r.player_id, player_name: r.player_name, average_rank: r.average_rank })));
    }

    return uniqueData;
  } catch (error) {
    console.error('getAverageRankings Debug - Unexpected error fetching average rankings:', error);
    return [];
  }
}

export function createAverageRankingsMap(
  averageRankings: AveragePlayerRanking[]
): Record<string, number> {
  const rankingsMap: Record<string, number> = {};
  
  averageRankings.forEach((ranking) => {
    rankingsMap[ranking.player_id] = ranking.average_rank;
  });
  
  return rankingsMap;
} 