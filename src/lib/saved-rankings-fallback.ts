import { supabase } from '@/lib/supabase/client';

export interface SavedPlayerRanking {
  player_id: string;
  player_name: string;
  team: string;
  position: string;
  rank_position: number;
  is_starred: boolean;
}

export async function getSavedPreseasonRankings(position: string, season: number = 2025): Promise<SavedPlayerRanking[]> {
  try {
    // Use the imported supabase client directly
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('No authenticated user found for saved rankings fallback');
      return [];
    }

    console.log(`🔄 Fetching saved preseason rankings for ${position}, season ${season}...`);

    // Get the user's preseason ranking for this position
    const { data: ranking, error: rankingError } = await supabase
      .from('rankings')
      .select('id')
      .eq('user_id', user.id)
      .eq('position', position)
      .eq('type', 'preseason')
      .eq('season', season)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (rankingError || !ranking) {
      console.log(`No saved preseason ranking found for ${position}`);
      return [];
    }

    // Get the player rankings for this ranking
    const { data: playerRankings, error: playerError } = await supabase
      .from('player_rankings')
      .select('player_id, player_name, team, position, rank_position, is_starred')
      .eq('ranking_id', ranking.id)
      .order('rank_position', { ascending: true });

    if (playerError) {
      console.error('Error fetching player rankings:', playerError);
      return [];
    }

    console.log(`✅ Found ${playerRankings?.length || 0} saved preseason rankings for ${position}`);
    return playerRankings || [];
  } catch (error) {
    console.error('Error fetching saved preseason rankings:', error);
    return [];
  }
}

export function createSavedRankingsMap(savedRankings: SavedPlayerRanking[]): Record<string, number> {
  const rankingsMap: Record<string, number> = {};
  
  savedRankings.forEach(player => {
    rankingsMap[player.player_id] = player.rank_position;
  });
  
  return rankingsMap;
} 