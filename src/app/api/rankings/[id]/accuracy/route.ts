import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { calculateAccuracyScore, getMockPerformanceData } from '@/lib/utils/accuracy-scoring';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabase();
    
    // Get the ranking and its player rankings
    const { data: ranking, error: rankingError } = await supabase
      .from('rankings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (rankingError || !ranking) {
      return NextResponse.json({ error: 'Ranking not found' }, { status: 404 });
    }

    const { data: playerRankings, error: playerError } = await supabase
      .from('player_rankings')
      .select('*')
      .eq('ranking_id', params.id)
      .order('rank_position');

    if (playerError) {
      return NextResponse.json({ error: 'Failed to fetch player rankings' }, { status: 500 });
    }

    // Get mock performance data for the position
    const actualPerformance = getMockPerformanceData(ranking.position);

    // Calculate accuracy score
    const accuracyResult = calculateAccuracyScore(playerRankings, actualPerformance, ranking.position);

    // Update the ranking with the accuracy score
    const { error: updateError } = await supabase
      .from('rankings')
      .update({ 
        accuracy_score: accuracyResult.accuracyPercentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update accuracy score' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      accuracyScore: accuracyResult.accuracyPercentage,
      breakdown: accuracyResult.breakdown
    });

  } catch (error) {
    console.error('Error calculating accuracy score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabase();
    
    // Get the ranking
    const { data: ranking, error: rankingError } = await supabase
      .from('rankings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (rankingError || !ranking) {
      return NextResponse.json({ error: 'Ranking not found' }, { status: 404 });
    }

    // If no accuracy score exists, calculate it
    if (!ranking.accuracy_score) {
      const { data: playerRankings, error: playerError } = await supabase
        .from('player_rankings')
        .select('*')
        .eq('ranking_id', params.id)
        .order('rank_position');

      if (playerError) {
        return NextResponse.json({ error: 'Failed to fetch player rankings' }, { status: 500 });
      }

      const actualPerformance = getMockPerformanceData(ranking.position);
      const accuracyResult = calculateAccuracyScore(playerRankings, actualPerformance, ranking.position);

      // Update the ranking with the accuracy score
      await supabase
        .from('rankings')
        .update({ 
          accuracy_score: accuracyResult.accuracyPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);

      return NextResponse.json({
        accuracyScore: accuracyResult.accuracyPercentage,
        breakdown: accuracyResult.breakdown,
        calculated: true
      });
    }

    return NextResponse.json({
      accuracyScore: ranking.accuracy_score,
      calculated: false
    });

  } catch (error) {
    console.error('Error getting accuracy score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 