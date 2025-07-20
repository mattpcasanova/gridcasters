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
    // For FLX, we need to fetch OVR rankings and filter out QBs later
    const queryPosition = position === 'FLX' ? 'OVR' : position;

    // Use a more specific query to avoid duplicates by selecting distinct player_id
    let query = supabase
      .from('player_average_rankings')
      .select('*')
      .eq('position', queryPosition)
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
      console.error('Error fetching average rankings:', error);
      return [];
    }

    // Deduplicate by player_id - keep the first occurrence (lowest average_rank due to ordering)
    const uniqueData = data ? data.filter((ranking, index, self) => 
      index === self.findIndex(r => r.player_id === ranking.player_id)
    ) : [];

    return uniqueData;
  } catch (error) {
    console.error('Unexpected error fetching average rankings:', error);
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