import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { position, type, week, season } = await request.json();

    if (!position || !type || !season) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Call the database function to update percentiles
    const { data: result, error } = await supabase.rpc('update_percentiles_for_period', {
      position_param: position,
      type_param: type,
      week_param: week || null,
      season_param: season
    });

    if (error) {
      console.error('Error updating percentiles:', error);
      return NextResponse.json({ error: 'Failed to update percentiles' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      updatedCount: result,
      message: `Updated percentiles for ${result} rankings`
    });

  } catch (error) {
    console.error('Error in percentile calculation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const type = searchParams.get('type');
    const week = searchParams.get('week');
    const season = searchParams.get('season');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!position || !type || !season) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get leaderboard for the specified period
    const { data: leaderboard, error } = await supabase.rpc('get_period_leaderboard', {
      position_param: position,
      type_param: type,
      week_param: week ? parseInt(week) : null,
      season_param: parseInt(season),
      limit_count: limit
    });

    if (error) {
      console.error('Error getting leaderboard:', error);
      return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      leaderboard,
      period: {
        position,
        type,
        week: week ? parseInt(week) : null,
        season: parseInt(season)
      }
    });

  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 