import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabase();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scoringFormat = searchParams.get('scoringFormat') || 'half_ppr';

    // Get the ranking details first
    const { data: ranking, error: rankingError } = await supabase
      .from('rankings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (rankingError || !ranking) {
      return NextResponse.json(
        { error: 'Ranking not found' },
        { status: 404 }
      );
    }

    // Get player rankings for this ranking
    const { data: playerRankings, error: playersError } = await supabase
      .from('player_rankings')
      .select('*')
      .eq('ranking_id', params.id)
      .order('rank_position', { ascending: true });

    if (playersError) {
      console.error('Error fetching player rankings:', playersError);
      return NextResponse.json(
        { error: 'Failed to fetch player rankings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ranking,
      players: playerRankings || []
    });

  } catch (error) {
    console.error('Error in players API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 