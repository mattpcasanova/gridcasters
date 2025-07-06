import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

// Helper function to update individual position rankings based on OVR ranking
async function updatePositionRankingsFromOVR(supabase: any, userId: string, ovrPlayers: any[], week: number, season: number, type: string) {
  // Group players by position from the OVR ranking
  const playersByPosition: Record<string, any[]> = {};
  
  ovrPlayers.forEach(player => {
    if (!playersByPosition[player.position]) {
      playersByPosition[player.position] = [];
    }
    playersByPosition[player.position].push(player);
  });

  // Update each position's ranking to match the OVR order
  for (const [pos, positionPlayers] of Object.entries(playersByPosition)) {
    // Sort players by their rank in the OVR ranking
    const sortedPlayers = positionPlayers.sort((a, b) => a.rank - b.rank);
    
    // Check if a ranking already exists for this position
    const { data: existingPositionRanking, error: fetchError } = await supabase
      .from('rankings')
      .select('id')
      .eq('user_id', userId)
      .eq('position', pos)
      .eq('week', week)
      .eq('season', season)
      .eq('type', type)
      .single();

    let positionRankingId: string;

    if (existingPositionRanking) {
      // Update existing position ranking
      positionRankingId = existingPositionRanking.id;
      
      await supabase
        .from('rankings')
        .update({
          title: `Week ${week} ${pos} Rankings`,
          updated_at: new Date().toISOString()
        })
        .eq('id', positionRankingId);

      // Delete existing player rankings for this position
      await supabase
        .from('player_rankings')
        .delete()
        .eq('ranking_id', positionRankingId);
    } else {
      // Create new position ranking
      const { data: newPositionRanking, error: createError } = await supabase
        .from('rankings')
        .insert({
          user_id: userId,
          title: `Week ${week} ${pos} Rankings`,
          position: pos,
          type,
          week,
          season,
          is_active: true
        })
        .select('id')
        .single();

      if (createError) {
        console.error(`Error creating ${pos} ranking:`, createError);
        continue;
      }

      positionRankingId = newPositionRanking.id;
    }

    // Insert player rankings for this position with new ranks (1, 2, 3, etc.)
    const positionPlayerRankings = sortedPlayers.map((player, index) => ({
      ranking_id: positionRankingId,
      player_id: player.id,
      player_name: player.name,
      team: player.team,
      position: player.position,
      rank_position: index + 1, // Re-rank starting from 1 for each position
      is_starred: player.isStarred || false
    }));

    const { error: insertError } = await supabase
      .from('player_rankings')
      .insert(positionPlayerRankings);

    if (insertError) {
      console.error(`Error inserting ${pos} player rankings:`, insertError);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { players, position, week, season, type = 'weekly' } = await request.json();

    if (!players || !position || !season) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if a ranking already exists for this user, position, week, and season
    const { data: existingRanking, error: fetchError } = await supabase
      .from('rankings')
      .select('id')
      .eq('user_id', user.id)
      .eq('position', position)
      .eq('week', week)
      .eq('season', season)
      .eq('type', type)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing ranking:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let rankingId: string;

    if (existingRanking) {
      // Update existing ranking
      rankingId = existingRanking.id;
      
      const { error: updateError } = await supabase
        .from('rankings')
        .update({
          title: `Week ${week} ${position} Rankings`,
          updated_at: new Date().toISOString()
        })
        .eq('id', rankingId);

      if (updateError) {
        console.error('Error updating ranking:', updateError);
        return NextResponse.json({ error: 'Failed to update ranking' }, { status: 500 });
      }

      // Delete existing player rankings for this ranking
      const { error: deleteError } = await supabase
        .from('player_rankings')
        .delete()
        .eq('ranking_id', rankingId);

      if (deleteError) {
        console.error('Error deleting existing player rankings:', deleteError);
        return NextResponse.json({ error: 'Failed to update player rankings' }, { status: 500 });
      }
    } else {
      // Create new ranking
      const { data: newRanking, error: createError } = await supabase
        .from('rankings')
        .insert({
          user_id: user.id,
          title: `Week ${week} ${position} Rankings`,
          position,
          type,
          week,
          season,
          is_active: true
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating ranking:', createError);
        return NextResponse.json({ error: 'Failed to create ranking' }, { status: 500 });
      }

      rankingId = newRanking.id;
    }

    // Insert player rankings
    const playerRankings = players.map((player: any) => ({
      ranking_id: rankingId,
      player_id: player.id,
      player_name: player.name,
      team: player.team,
      position: player.position,
      rank_position: player.rank,
      is_starred: player.isStarred || false
    }));

    const { error: insertError } = await supabase
      .from('player_rankings')
      .insert(playerRankings);

    if (insertError) {
      console.error('Error inserting player rankings:', insertError);
      return NextResponse.json({ error: 'Failed to save player rankings' }, { status: 500 });
    }

    // If this is an OVR ranking, update individual position rankings to maintain consistency
    if (position === 'OVR') {
      await updatePositionRankingsFromOVR(supabase, user.id, players, week, season, type);
    }

    return NextResponse.json({ 
      success: true, 
      rankingId,
      action: existingRanking ? 'updated' : 'created',
      positionRankingsUpdated: position === 'OVR' // Let the UI know if position rankings were updated
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
    const week = searchParams.get('week');
    const season = searchParams.get('season');
    const type = searchParams.get('type') || 'weekly';

    let query = supabase
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
      .eq('user_id', user.id)
      .eq('type', type)
      .eq('season', season || new Date().getFullYear())
      .order('created_at', { ascending: false });

    if (position) {
      query = query.eq('position', position);
    }

    if (week) {
      query = query.eq('week', parseInt(week));
    }

    const { data: rankings, error } = await query;

    if (error) {
      console.error('Error fetching rankings:', error);
      return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
    }

    return NextResponse.json({ rankings });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 