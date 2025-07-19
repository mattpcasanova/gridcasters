import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Use direct client to bypass auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get all existing rankings and player_rankings (bypass auth for debugging)
    const { data: rankings, error: rankingsError } = await supabase
      .from('rankings')
      .select('*')
      .order('created_at', { ascending: true });

    if (rankingsError) {
      console.error('Error fetching rankings:', rankingsError);
      return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
    }

    console.log(`Found ${rankings?.length || 0} rankings to process`);

    if (!rankings || rankings.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No rankings found to process',
        debug: {
          totalRankings: 0,
          rankings: []
        }
      });
    }

    // Group rankings by position, season, type, and week
    const rankingGroups: Record<string, any[]> = {};
    
    rankings?.forEach(ranking => {
      const key = `${ranking.position}_${ranking.season}_${ranking.type}_${ranking.week || 'null'}`;
      if (!rankingGroups[key]) {
        rankingGroups[key] = [];
      }
      rankingGroups[key].push(ranking);
    });

    console.log(`Grouped into ${Object.keys(rankingGroups).length} unique position/season/type/week combinations`);

    // Process each group
    for (const [key, groupRankings] of Object.entries(rankingGroups)) {
      console.log(`Processing group: ${key} (${groupRankings.length} rankings)`);
      
      // Get all player rankings for this group
      const rankingIds = groupRankings.map(r => r.id);
      
      const { data: playerRankings, error: playerRankingsError } = await supabase
        .from('player_rankings')
        .select('*')
        .in('ranking_id', rankingIds);

      if (playerRankingsError) {
        console.error(`Error fetching player rankings for group ${key}:`, playerRankingsError);
        continue;
      }

      console.log(`Found ${playerRankings?.length || 0} player rankings for group ${key}`);

      // Calculate averages for each player
      const playerAverages: Record<string, { total: number; count: number; player_name: string; team: string; position: string }> = {};
      
      playerRankings?.forEach(pr => {
        if (!playerAverages[pr.player_id]) {
          playerAverages[pr.player_id] = {
            total: 0,
            count: 0,
            player_name: pr.player_name,
            team: pr.team,
            position: pr.position
          };
        }
        playerAverages[pr.player_id].total += pr.rank_position;
        playerAverages[pr.player_id].count += 1;
      });

      // Insert average rankings
      const sampleRanking = groupRankings[0];
      const averageRankingsToInsert = Object.entries(playerAverages).map(([player_id, data]) => ({
        player_id,
        player_name: data.player_name,
        team: data.team,
        position: sampleRanking.position,
        season: sampleRanking.season,
        type: sampleRanking.type,
        week: sampleRanking.week,
        average_rank: data.total / data.count,
        total_rankings: data.count
      }));

      if (averageRankingsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('player_average_rankings')
          .upsert(averageRankingsToInsert, { onConflict: 'player_id,position,season,type,week' });

        if (insertError) {
          console.error(`Error inserting average rankings for group ${key}:`, insertError);
        } else {
          console.log(`Inserted ${averageRankingsToInsert.length} average rankings for group ${key}`);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${rankings?.length || 0} rankings into average rankings`,
      debug: {
        totalRankings: rankings?.length || 0,
        groups: Object.keys(rankingGroups).length,
        sampleRankings: rankings?.slice(0, 3)
      }
    });

  } catch (error) {
    console.error('Unexpected error in populate average rankings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 