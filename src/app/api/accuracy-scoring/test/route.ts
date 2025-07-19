import { NextResponse } from 'next/server';
import { calculateAccuracyScore, fetchRealPerformanceData } from '@/lib/utils/accuracy-scoring';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerRankings, position } = body;

    if (!playerRankings || !position) {
      return NextResponse.json(
        { error: 'Missing playerRankings or position' },
        { status: 400 }
      );
    }

    // Fetch real performance data
    const actualPerformance = await fetchRealPerformanceData(position);

    // Calculate accuracy
    const result = calculateAccuracyScore(playerRankings, actualPerformance, position);

    return NextResponse.json({
      success: true,
      result,
      dataSource: actualPerformance.length > 0 ? 'real' : 'no_data'
    });

  } catch (error) {
    console.error('Accuracy scoring test error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate accuracy score' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Create sample player rankings for testing
    const samplePlayerRankings = [
      { id: '1', ranking_id: 'test', player_id: '1', player_name: 'Josh Allen', team: 'BUF', position: 'QB', rank_position: 1, is_starred: false, created_at: new Date().toISOString() },
      { id: '2', ranking_id: 'test', player_id: '3', player_name: 'Patrick Mahomes', team: 'KC', position: 'QB', rank_position: 2, is_starred: false, created_at: new Date().toISOString() },
      { id: '3', ranking_id: 'test', player_id: '4', player_name: 'Jalen Hurts', team: 'PHI', position: 'QB', rank_position: 3, is_starred: false, created_at: new Date().toISOString() },
      { id: '4', ranking_id: 'test', player_id: '2', player_name: 'Lamar Jackson', team: 'BAL', position: 'QB', rank_position: 4, is_starred: false, created_at: new Date().toISOString() },
      { id: '5', ranking_id: 'test', player_id: '6', player_name: 'Justin Herbert', team: 'LAC', position: 'QB', rank_position: 5, is_starred: false, created_at: new Date().toISOString() }
    ];

    const actualPerformance = await fetchRealPerformanceData('QB');
    const result = calculateAccuracyScore(samplePlayerRankings, actualPerformance, 'QB');
    
    return NextResponse.json({
      success: true,
      sampleData: {
        playerRankings: samplePlayerRankings,
        actualPerformance
      },
      result,
      dataSource: actualPerformance.length > 0 ? 'real' : 'no_data'
    });

  } catch (error) {
    console.error('Accuracy scoring sample error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate sample accuracy score' },
      { status: 500 }
    );
  }
} 