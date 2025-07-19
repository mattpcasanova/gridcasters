import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const week = searchParams.get('week');
    const season = searchParams.get('season') || new Date().getFullYear().toString();
    const type = searchParams.get('type') || 'weekly';

    if (!position) {
      return NextResponse.json({ error: 'Position is required' }, { status: 400 });
    }

    // Get available reference rankings (regular rankings)
    let query = supabase
      .from('rankings')
      .select(`
        id,
        title,
        position,
        type,
        week,
        season,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .eq('position', position)
      .eq('season', season)
      .order('created_at', { ascending: false });

    // Filter by type if specified
    if (type) {
      query = query.eq('type', type);
    }

    const { data: rankings, error } = await query;

    if (error) {
      console.error('Error fetching reference rankings:', error);
      return NextResponse.json({ error: 'Failed to fetch reference rankings' }, { status: 500 });
    }

    // Get aggregate rankings for this position
    const { data: aggregateRankings, error: aggregateError } = await supabase
      .from('rankings')
      .select(`
        id,
        title,
        position,
        type,
        week,
        season,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .like('position', `AGG_${position}`)
      .eq('season', season)
      .order('created_at', { ascending: false });

    if (aggregateError) {
      console.error('Error fetching aggregate rankings:', aggregateError);
    }

    // Group rankings by type and week
    const referenceOptions = {
      weekly: rankings?.filter(r => r.type === 'weekly') || [],
      preseason: rankings?.filter(r => r.type === 'preseason') || [],
      aggregate: aggregateRankings?.map(r => ({
        ...r,
        position: r.position.replace('AGG_', ''),
        displayTitle: r.title
      })) || []
    };

    return NextResponse.json({ 
      referenceOptions,
      defaultReference: getDefaultReference(referenceOptions, week, type)
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to determine the default reference ranking
function getDefaultReference(referenceOptions: any, targetWeek: string | null, targetType: string) {
  if (targetType === 'preseason') {
    // For preseason, use the most recent preseason ranking
    return referenceOptions.preseason[0] || null;
  }

  // For weekly rankings, use the previous week's ranking as default
  if (targetWeek && !isNaN(parseInt(targetWeek))) {
    const weekNum = parseInt(targetWeek);
    
    // First try to find the previous week's ranking
    const previousWeekRanking = referenceOptions.weekly.find((r: any) => r.week === weekNum - 1);
    if (previousWeekRanking) {
      return previousWeekRanking;
    }

    // If no previous week, try to find the most recent ranking
    return referenceOptions.weekly[0] || null;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referenceRankingId, targetPosition, targetWeek, targetSeason, targetType } = await request.json();

    if (!referenceRankingId || !targetPosition) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle average rankings reference
    if (referenceRankingId === 'average') {
      const { data: averageRankings, error: avgError } = await supabase
        .from('player_average_rankings')
        .select('*')
        .eq('position', targetPosition)
        .eq('season', targetSeason)
        .eq('type', targetType)
        .order('average_rank', { ascending: true });

      if (avgError) {
        console.error('Error fetching average rankings:', avgError);
        return NextResponse.json({ error: 'Failed to fetch average rankings' }, { status: 500 });
      }

      // Transform average rankings to player format
      const transformedPlayers = averageRankings?.map((avg, index) => ({
        id: avg.player_id,
        name: avg.player_name,
        team: avg.team,
        position: avg.position,
        rank: index + 1,
        isStarred: false // Average rankings don't have starred status
      })) || [];

      return NextResponse.json({ 
        success: true,
        players: transformedPlayers,
        referenceInfo: {
          title: `Average ${targetPosition} Rankings`,
          position: targetPosition,
          week: targetWeek,
          type: targetType
        }
      });
    }

    // Get the reference ranking
    const { data: referenceRanking, error: fetchError } = await supabase
      .from('rankings')
      .select(`
        *,
        player_rankings (
          player_id,
          player_name,
          team,
          position,
          rank_position,
          is_starred
        )
      `)
      .eq('id', referenceRankingId)
      .single();

    if (fetchError || !referenceRanking) {
      return NextResponse.json({ error: 'Reference ranking not found' }, { status: 404 });
    }

    // Transform the reference ranking to the target format
    const transformedPlayers = referenceRanking.player_rankings
      .sort((a: any, b: any) => a.rank_position - b.rank_position)
      .map((pr: any, index: number) => ({
        id: pr.player_id,
        name: pr.player_name,
        team: pr.team,
        position: pr.position,
        rank: index + 1,
        isStarred: pr.is_starred
      }));

    return NextResponse.json({ 
      success: true,
      players: transformedPlayers,
      referenceInfo: {
        title: referenceRanking.title,
        position: referenceRanking.position,
        week: referenceRanking.week,
        type: referenceRanking.type
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 