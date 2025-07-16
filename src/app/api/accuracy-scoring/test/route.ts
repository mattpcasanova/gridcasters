import { NextResponse } from 'next/server';
import { calculateAccuracyScore, getMockPerformanceData } from '@/lib/utils/accuracy-scoring';

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

    // Get mock performance data
    const actualPerformance = getMockPerformanceData(position);

    // Calculate accuracy
    const result = calculateAccuracyScore(playerRankings, actualPerformance, position);

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Accuracy scoring test error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate accuracy score' },
      { status: 500 }
    );
  }
}

// Example usage endpoint
export async function GET() {
  // Sample data for demonstration
  const sampleUserRankings = {
    'QB': [
      { player_id: 'qb1', rank: 1 },
      { player_id: 'qb2', rank: 2 },
      { player_id: 'qb3', rank: 3 },
      { player_id: 'qb4', rank: 4 },
      { player_id: 'qb5', rank: 5 }
    ]
  };

  const sampleActualRankings = {
    'QB': [
      { player_id: 'qb1', rank: 1, name: 'Josh Allen', team: 'BUF', position: 'QB' },
      { player_id: 'qb2', rank: 3, name: 'Patrick Mahomes', team: 'KC', position: 'QB' },
      { player_id: 'qb3', rank: 8, name: 'Jalen Hurts', team: 'PHI', position: 'QB' },
      { player_id: 'qb4', rank: 2, name: 'Lamar Jackson', team: 'BAL', position: 'QB' },
      { player_id: 'qb5', rank: 25, name: 'Justin Herbert', team: 'LAC', position: 'QB' }
    ]
  };

  try {
    // Create sample player rankings with matching IDs from mock data
    const samplePlayerRankings = [
      { id: '1', ranking_id: 'test', player_id: '1', player_name: 'Josh Allen', team: 'BUF', position: 'QB', rank_position: 1, is_starred: false, created_at: new Date().toISOString() },
      { id: '2', ranking_id: 'test', player_id: '3', player_name: 'Patrick Mahomes', team: 'KC', position: 'QB', rank_position: 2, is_starred: false, created_at: new Date().toISOString() },
      { id: '3', ranking_id: 'test', player_id: '4', player_name: 'Jalen Hurts', team: 'PHI', position: 'QB', rank_position: 3, is_starred: false, created_at: new Date().toISOString() },
      { id: '4', ranking_id: 'test', player_id: '2', player_name: 'Lamar Jackson', team: 'BAL', position: 'QB', rank_position: 4, is_starred: false, created_at: new Date().toISOString() },
      { id: '5', ranking_id: 'test', player_id: '6', player_name: 'Justin Herbert', team: 'LAC', position: 'QB', rank_position: 5, is_starred: false, created_at: new Date().toISOString() }
    ];

    const actualPerformance = getMockPerformanceData('QB');
    const result = calculateAccuracyScore(samplePlayerRankings, actualPerformance, 'QB');
    
    return NextResponse.json({
      success: true,
      sampleData: {
        playerRankings: samplePlayerRankings,
        actualPerformance
      },
      result
    });

  } catch (error) {
    console.error('Accuracy scoring sample error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate sample accuracy score' },
      { status: 500 }
    );
  }
} 