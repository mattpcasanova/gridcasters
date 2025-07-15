import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, players, position, week, season, type = 'weekly', scoringFormat = 'half_ppr' } = await request.json();

    if (!name || !players || !position || !season) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert week to proper null value for preseason rankings
    const weekValue = (type === 'preseason' || week === 'null' || week === null) ? null : parseInt(week);

    // Create aggregate ranking
    const { data: newRanking, error: createError } = await supabase
      .from('rankings')
      .insert({
        user_id: user.id,
        title: name,
        position: `AGG_${position}`, // Prefix to distinguish aggregate rankings
        type,
        week: weekValue,
        season,
        is_active: true
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating aggregate ranking:', createError);
      return NextResponse.json({ error: 'Failed to create aggregate ranking' }, { status: 500 });
    }

    // Insert player rankings
    const playerRankings = players.map((player: any, index: number) => ({
      ranking_id: newRanking.id,
      player_id: String(player.id),
      player_name: player.name,
      team: player.team,
      position: `AGG_${position}`,
      rank_position: index + 1,
      is_starred: Boolean(player.isStarred || false)
    }));

    const { error: insertError } = await supabase
      .from('player_rankings')
      .insert(playerRankings);

    if (insertError) {
      console.error('Error inserting aggregate player rankings:', insertError);
      return NextResponse.json({ error: 'Failed to save aggregate player rankings' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      rankingId: newRanking.id,
      action: 'created'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const season = searchParams.get('season') || new Date().getFullYear().toString();

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
      .like('position', 'AGG_%') // Only get aggregate rankings
      .eq('season', season)
      .order('created_at', { ascending: false });

    if (position) {
      query = query.like('position', `AGG_${position}`);
    }

    const { data: rankings, error } = await query;

    if (error) {
      console.error('Error fetching aggregate rankings:', error);
      return NextResponse.json({ error: 'Failed to fetch aggregate rankings' }, { status: 500 });
    }

    // Transform the data to remove the AGG_ prefix for display
    const transformedRankings = rankings?.map(ranking => ({
      ...ranking,
      position: ranking.position.replace('AGG_', ''),
      displayTitle: ranking.title
    })) || [];

    return NextResponse.json({ aggregateRankings: transformedRankings });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 