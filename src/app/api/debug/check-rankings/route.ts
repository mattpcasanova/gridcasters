import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get all rankings without user filter
    const { data: rankings, error: rankingsError } = await supabase
      .from('rankings')
      .select(`
        id,
        title,
        position,
        type,
        week,
        season,
        user_id,
        created_at,
        player_rankings (
          player_id,
          player_name,
          team,
          position,
          rank_position
        )
      `)
      .order('created_at', { ascending: false });

    if (rankingsError) {
      console.error('Error fetching rankings:', rankingsError);
      return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
    }

    // Count total rankings and player rankings
    const totalRankings = rankings?.length || 0;
    const totalPlayerRankings = rankings?.reduce((sum, r) => sum + (r.player_rankings?.length || 0), 0) || 0;

    // Group by position/season/type/week
    const groups: Record<string, any[]> = {};
    rankings?.forEach(ranking => {
      const key = `${ranking.position}_${ranking.season}_${ranking.type}_${ranking.week || 'null'}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(ranking);
    });

    return NextResponse.json({ 
      totalRankings,
      totalPlayerRankings,
      groupCount: Object.keys(groups).length,
      rankings: rankings?.slice(0, 5), // Show first 5 for debugging
      groups: Object.entries(groups).map(([key, group]) => ({
        key,
        count: group.length,
        sample: group[0]
      }))
    });

  } catch (error) {
    console.error('Unexpected error in check rankings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 