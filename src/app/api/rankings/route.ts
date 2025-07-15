import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

// Helper function to convert scoring format to readable string
function getScoringFormatText(scoringFormat: string): string {
  switch (scoringFormat) {
    case 'std':
      return 'Standard';
    case 'ppr':
      return 'Full PPR';
    case 'half_ppr':
    default:
      return 'Half PPR';
  }
}

// Helper function to update individual position rankings based on OVR ranking
async function updatePositionRankingsFromOVR(supabase: any, userId: string, ovrPlayers: any[], week: number | null, season: number, type: string, scoringFormat?: string) {
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
    let positionQuery = supabase
      .from('rankings')
      .select('id')
      .eq('user_id', userId)
      .eq('position', pos)
      .eq('season', season)
      .eq('type', type);

    // Handle week parameter - use is() for null values, eq() for integers
    if (week === null) {
      positionQuery = positionQuery.is('week', null);
    } else {
      positionQuery = positionQuery.eq('week', week);
    }

    const { data: existingPositionRanking, error: fetchError } = await positionQuery.single();

    let positionRankingId: string;

    if (existingPositionRanking) {
      // Update existing position ranking
      positionRankingId = existingPositionRanking.id;
      
      const scoringText = scoringFormat ? getScoringFormatText(scoringFormat) : 'Half PPR';
      
      await supabase
        .from('rankings')
        .update({
          title: type === 'preseason' ? `Pre-Season ${pos} ${scoringText} Rankings` : `Week ${week} ${pos} ${scoringText} Rankings`,
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
      const scoringText = scoringFormat ? getScoringFormatText(scoringFormat) : 'Half PPR';
      
      const { data: newPositionRanking, error: createError } = await supabase
        .from('rankings')
        .insert({
          user_id: userId,
          title: type === 'preseason' ? `Pre-Season ${pos} ${scoringText} Rankings` : `Week ${week} ${pos} ${scoringText} Rankings`,
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
      position: pos, // Use the ranking position (QB, RB, WR, TE) instead of individual player position
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

// Helper function to update individual position rankings based on FLX ranking
async function updatePositionRankingsFromFLX(supabase: any, userId: string, flxPlayers: any[], week: number | null, season: number, type: string, scoringFormat?: string) {
  // Group players by position from the FLX ranking (RB, WR, TE only)
  const playersByPosition: Record<string, any[]> = {};
  
  flxPlayers.forEach(player => {
    // FLX only includes RB, WR, TE
    if (['RB', 'WR', 'TE'].includes(player.position)) {
      if (!playersByPosition[player.position]) {
        playersByPosition[player.position] = [];
      }
      playersByPosition[player.position].push(player);
    }
  });

  // Update each position's ranking to match the FLX order
  for (const [pos, positionPlayers] of Object.entries(playersByPosition)) {
    // Sort players by their rank in the FLX ranking
    const sortedPlayers = positionPlayers.sort((a, b) => a.rank - b.rank);
    
    // Check if a ranking already exists for this position
    let positionQuery = supabase
      .from('rankings')
      .select('id')
      .eq('user_id', userId)
      .eq('position', pos)
      .eq('season', season)
      .eq('type', type);

    // Handle week parameter - use is() for null values, eq() for integers
    if (week === null) {
      positionQuery = positionQuery.is('week', null);
    } else {
      positionQuery = positionQuery.eq('week', week);
    }

    const { data: existingPositionRanking, error: fetchError } = await positionQuery.single();

    let positionRankingId: string;

    if (existingPositionRanking) {
      // Update existing position ranking
      positionRankingId = existingPositionRanking.id;
      
      const scoringText = scoringFormat ? getScoringFormatText(scoringFormat) : 'Half PPR';
      
      await supabase
        .from('rankings')
        .update({
          title: type === 'preseason' ? `Pre-Season ${pos} ${scoringText} Rankings` : `Week ${week} ${pos} ${scoringText} Rankings`,
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
      const scoringText = scoringFormat ? getScoringFormatText(scoringFormat) : 'Half PPR';
      
      const { data: newPositionRanking, error: createError } = await supabase
        .from('rankings')
        .insert({
          user_id: userId,
          title: type === 'preseason' ? `Pre-Season ${pos} ${scoringText} Rankings` : `Week ${week} ${pos} ${scoringText} Rankings`,
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
      position: pos, // Use the ranking position (RB, WR, TE) instead of individual player position
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
    
    console.log('Auth check:', { user: user?.id, authError });
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Authenticated user ID:', user.id);

    const { players, position, week, season, type = 'weekly', scoringFormat = 'half_ppr' } = await request.json();

    if (!players || !position || !season) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert week to proper null value for preseason rankings
    const weekValue = (type === 'preseason' || week === 'null' || week === null) ? null : parseInt(week);

    // Check if a ranking already exists for this user, position, week, and season
    let query = supabase
      .from('rankings')
      .select('id')
      .eq('user_id', user.id)
      .eq('position', position)
      .eq('season', season)
      .eq('type', type);

    // Handle week parameter - use is() for null values, eq() for integers
    if (weekValue === null) {
      query = query.is('week', null);
    } else {
      query = query.eq('week', weekValue);
    }

    const { data: existingRanking, error: fetchError } = await query.single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing ranking:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let rankingId: string;

    if (existingRanking) {
      // Update existing ranking
      rankingId = existingRanking.id;
      console.log('Found existing ranking with ID:', rankingId);
      
      const scoringText = getScoringFormatText(scoringFormat);
      
      const { error: updateError } = await supabase
        .from('rankings')
        .update({
          title: type === 'preseason' ? `Pre-Season ${position} ${scoringText} Rankings` : `Week ${weekValue} ${position} ${scoringText} Rankings`,
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
      const scoringText = getScoringFormatText(scoringFormat);
      
      const { data: newRanking, error: createError } = await supabase
        .from('rankings')
        .insert({
          user_id: user.id,
          title: type === 'preseason' ? `Pre-Season ${position} ${scoringText} Rankings` : `Week ${weekValue} ${position} ${scoringText} Rankings`,
          position,
          type,
          week: weekValue,
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
      console.log('Successfully created ranking with ID:', rankingId);
    }

    // Insert player rankings with validation
    const playerRankings = players.map((player: any, index: number) => {
      // Validate required fields
      if (!player.id || !player.name || !player.team || !player.position || !player.rank) {
        console.error(`Player at index ${index} missing required fields:`, player);
        throw new Error(`Player at index ${index} missing required fields`);
      }

      // For player rankings, use the ranking position, not the individual player's NFL position
      // This ensures consistency with our fantasy position constraints
      const playerPosition = position; // Use the ranking position (QB, RB, WR, TE, OVR, FLX)
      
      console.log(`Player ${player.name}: NFL position="${player.position}", Using ranking position="${playerPosition}"`);

      return {
        ranking_id: rankingId,
        player_id: String(player.id), // Ensure player_id is a string
        player_name: player.name,
        team: player.team,
        position: playerPosition, // Use the ranking position instead of individual player position
        rank_position: parseInt(player.rank), // Ensure rank_position is an integer
        is_starred: Boolean(player.isStarred || false)
      };
    });

    console.log('Attempting to insert player rankings:', JSON.stringify(playerRankings.slice(0, 2), null, 2)); // Log first 2 for debugging

    // Verify ranking exists before inserting player rankings
    const { data: rankingExists, error: verifyError } = await supabase
      .from('rankings')
      .select('id')
      .eq('id', rankingId)
      .single();

    if (verifyError || !rankingExists) {
      console.error('Ranking verification failed:', verifyError);
      return NextResponse.json({ error: 'Ranking does not exist before inserting players' }, { status: 500 });
    }

    console.log('Ranking verified, proceeding with player rankings insertion');

    const { error: insertError } = await supabase
      .from('player_rankings')
      .insert(playerRankings);

    if (insertError) {
      console.error('Error inserting player rankings:', insertError);
      console.error('Sample player ranking data:', JSON.stringify(playerRankings[0], null, 2));
      
      // If it's a constraint violation, let's try to fix it by creating a new constraint
      if (insertError.code === '23514') {
        console.log('Constraint violation detected. The allowed positions might be different than expected.');
        console.log('Expected positions: QB, RB, WR, TE, OVR, FLX');
        console.log('Actual position in data:', playerRankings[0]?.position);
        
        // Try to provide more helpful error message
        return NextResponse.json({ 
          error: 'Database constraint violation: The position field has restrictions that do not match our expected values.',
          details: `Position '${playerRankings[0]?.position}' is not allowed by database constraint. Expected: QB, RB, WR, TE, OVR, FLX`,
          constraintCode: insertError.code
        }, { status: 500 });
      }
      
      return NextResponse.json({ error: 'Failed to save player rankings', details: insertError.message }, { status: 500 });
    }

    // If this is an OVR ranking, update individual position rankings to maintain consistency
    if (position === 'OVR') {
      await updatePositionRankingsFromOVR(supabase, user.id, players, weekValue, season, type, scoringFormat);
    }

    // If this is a FLX ranking, update individual position rankings (RB, WR, TE) to maintain consistency
    if (position === 'FLX') {
      await updatePositionRankingsFromFLX(supabase, user.id, players, weekValue, season, type, scoringFormat);
    }

    return NextResponse.json({ 
      success: true, 
      rankingId,
      action: existingRanking ? 'updated' : 'created',
      positionRankingsUpdated: position === 'OVR' || position === 'FLX' // Let the UI know if position rankings were updated
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
      .not('position', 'like', 'AGG_%') // Exclude aggregate rankings
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