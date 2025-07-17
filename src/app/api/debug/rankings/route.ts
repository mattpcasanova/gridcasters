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

    // Get all rankings for the user
    const { data: allRankings, error: allError } = await supabase
      .from('rankings')
      .select('id, title, position, type, week, season, is_active, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (allError) {
      return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
    }

    // Get count of all rankings
    const { count: totalCount } = await supabase
      .from('rankings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get count excluding aggregate rankings
    const { count: nonAggregateCount } = await supabase
      .from('rankings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('position', 'like', 'AGG_%');

    // Get count of active rankings only
    const { count: activeCount } = await supabase
      .from('rankings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Get count by position
    const positionCounts = { QB: 0, RB: 0, WR: 0, TE: 0, OVR: 0, FLX: 0, AGG: 0 };
    allRankings?.forEach((ranking: any) => {
      if (ranking.position.startsWith('AGG_')) {
        positionCounts.AGG++;
      } else if (ranking.position in positionCounts) {
        positionCounts[ranking.position as keyof typeof positionCounts]++;
      }
    });

    return NextResponse.json({
      success: true,
      counts: {
        total: totalCount || 0,
        nonAggregate: nonAggregateCount || 0,
        active: activeCount || 0
      },
      positionCounts,
      rankings: allRankings?.slice(0, 10) // Show first 10 for debugging
    });

  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 