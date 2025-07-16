import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = createServerSupabase();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's percentile statistics
    const { data: stats, error } = await supabase.rpc('get_user_percentile_stats', {
      user_uuid: params.userId
    });

    if (error) {
      console.error('Error getting user percentile stats:', error);
      return NextResponse.json({ error: 'Failed to get percentile statistics' }, { status: 500 });
    }

    // Get recent rankings with percentiles
    const { data: recentRankings, error: rankingsError } = await supabase
      .from('rankings')
      .select(`
        id,
        title,
        position,
        type,
        week,
        season,
        accuracy_score,
        percentile_score,
        percentile_rank,
        total_rankings_in_period,
        created_at
      `)
      .eq('user_id', params.userId)
      .not('percentile_score', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    if (rankingsError) {
      console.error('Error getting recent rankings:', rankingsError);
      return NextResponse.json({ error: 'Failed to get recent rankings' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      stats: stats[0] || {
        total_rankings: 0,
        avg_percentile: 0,
        top_10_percentile_count: 0,
        top_25_percentile_count: 0,
        top_50_percentile_count: 0,
        best_percentile: 0,
        recent_percentile_trend: 0
      },
      recentRankings
    });

  } catch (error) {
    console.error('Error getting user percentiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 