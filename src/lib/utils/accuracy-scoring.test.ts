import { calculateAccuracyScore, fetchRealPerformanceData } from './accuracy-scoring';

// Test data for player rankings
const testPlayerRankings = [
  {
    id: '1',
    ranking_id: 'test-ranking-1',
    player_id: '1',
    player_name: 'Josh Allen',
    team: 'BUF',
    position: 'QB',
    rank_position: 1,
    is_starred: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    ranking_id: 'test-ranking-1',
    player_id: '2',
    player_name: 'Patrick Mahomes',
    team: 'KC',
    position: 'QB',
    rank_position: 2,
    is_starred: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    ranking_id: 'test-ranking-1',
    player_id: '3',
    player_name: 'Lamar Jackson',
    team: 'BAL',
    position: 'QB',
    rank_position: 3,
    is_starred: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    ranking_id: 'test-ranking-1',
    player_id: '4',
    player_name: 'Jalen Hurts',
    team: 'PHI',
    position: 'QB',
    rank_position: 4,
    is_starred: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    ranking_id: 'test-ranking-1',
    player_id: '5',
    player_name: 'Dak Prescott',
    team: 'DAL',
    position: 'QB',
    rank_position: 5,
    is_starred: false,
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Test actual performance data
const testActualPerformance = [
  {
    playerId: '1',
    playerName: 'Josh Allen',
    team: 'BUF',
    position: 'QB',
    actualRank: 1,
    actualPoints: 28.5,
    isActive: true
  },
  {
    playerId: '2',
    playerName: 'Patrick Mahomes',
    team: 'KC',
    position: 'QB',
    actualRank: 3,
    actualPoints: 24.8,
    isActive: true
  },
  {
    playerId: '3',
    playerName: 'Lamar Jackson',
    team: 'BAL',
    position: 'QB',
    actualRank: 2,
    actualPoints: 26.2,
    isActive: true
  },
  {
    playerId: '4',
    playerName: 'Jalen Hurts',
    team: 'PHI',
    position: 'QB',
    actualRank: 8,
    actualPoints: 19.5,
    isActive: true
  },
  {
    playerId: '5',
    playerName: 'Dak Prescott',
    team: 'DAL',
    position: 'QB',
    actualRank: 25,
    actualPoints: 12.2,
    isActive: true
  }
];

// Simple test runner
class AccuracyTestRunner {
  private results: Array<{ name: string; passed: boolean; error?: string }> = [];

  private assert(condition: boolean, name: string, error?: string) {
    this.results.push({ name, passed: condition, error });
    if (condition) {
      console.log(`✅ ${name}`);
    } else {
      console.error(`❌ ${name}${error ? `: ${error}` : ''}`);
    }
  }

  async runTests() {
    console.log('🧪 Running Accuracy Scoring Tests...\n');

    // Test 1: Basic calculation
    console.log('📋 Test 1: Basic calculation');
    const result = calculateAccuracyScore(testPlayerRankings, testActualPerformance, 'QB');
    this.assert(result.accuracyPercentage >= 0, 'Accuracy percentage should be >= 0');
    this.assert(result.accuracyPercentage <= 100, 'Accuracy percentage should be <= 100');
    this.assert(result.totalScore >= 0, 'Total score should be >= 0');
    this.assert(result.maxPossibleScore > 0, 'Max possible score should be > 0');

    // Test 2: Empty performance data
    console.log('\n📋 Test 2: Empty performance data');
    const emptyResult = calculateAccuracyScore(testPlayerRankings, [], 'QB');
    this.assert(emptyResult.totalScore === 0, 'Empty data should result in 0 total score');
    this.assert(emptyResult.maxPossibleScore === 0, 'Empty data should result in 0 max score');
    this.assert(emptyResult.accuracyPercentage === 0, 'Empty data should result in 0% accuracy');

    // Test 3: Perfect predictions
    console.log('\n📋 Test 3: Perfect predictions');
    const perfectRankings = [
      {
        id: '1',
        ranking_id: 'test-ranking-1',
        player_id: '1',
        player_name: 'Josh Allen',
        team: 'BUF',
        position: 'QB',
        rank_position: 1,
        is_starred: false,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        ranking_id: 'test-ranking-1',
        player_id: '2',
        player_name: 'Patrick Mahomes',
        team: 'KC',
        position: 'QB',
        rank_position: 2,
        is_starred: false,
        created_at: '2024-01-01T00:00:00Z'
      }
    ];

    const perfectPerformance = [
      {
        playerId: '1',
        playerName: 'Josh Allen',
        team: 'BUF',
        position: 'QB',
        actualRank: 1,
        actualPoints: 28.5,
        isActive: true
      },
      {
        playerId: '2',
        playerName: 'Patrick Mahomes',
        team: 'KC',
        position: 'QB',
        actualRank: 2,
        actualPoints: 24.8,
        isActive: true
      }
    ];

    const perfectResult = calculateAccuracyScore(perfectRankings, perfectPerformance, 'QB');
    this.assert(perfectResult.accuracyPercentage > 80, 'Perfect predictions should score > 80%');

    // Test 4: Real performance data fetching
    console.log('\n📋 Test 4: Real performance data fetching');
    try {
      const actualPerformance = await fetchRealPerformanceData('QB');
      this.assert(Array.isArray(actualPerformance), 'Should return an array');
      
      if (actualPerformance.length > 0) {
        const firstPlayer = actualPerformance[0];
        this.assert('playerId' in firstPlayer, 'Should have playerId property');
        this.assert('playerName' in firstPlayer, 'Should have playerName property');
        this.assert('team' in firstPlayer, 'Should have team property');
        this.assert('position' in firstPlayer, 'Should have position property');
        this.assert('actualRank' in firstPlayer, 'Should have actualRank property');
        this.assert('actualPoints' in firstPlayer, 'Should have actualPoints property');
        this.assert('isActive' in firstPlayer, 'Should have isActive property');
      }
    } catch (error) {
      this.assert(false, 'Real data fetching should not throw', error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 5: Different positions
    console.log('\n📋 Test 5: Different positions');
    const positions = ['QB', 'RB', 'WR', 'TE'];
    for (const position of positions) {
      try {
        const actualPerformance = await fetchRealPerformanceData(position);
        this.assert(Array.isArray(actualPerformance), `Should return array for ${position}`);
      } catch (error) {
        this.assert(false, `${position} data fetching should not throw`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Summary
    console.log('\n📊 Test Summary');
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const percentage = Math.round((passed / total) * 100);
    
    console.log(`✅ ${passed}/${total} tests passed (${percentage}%)`);
    
    if (passed < total) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  - ${result.name}${result.error ? `: ${result.error}` : ''}`);
      });
    }

    return {
      passed,
      total,
      percentage,
      results: this.results
    };
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  (window as any).AccuracyTestRunner = AccuracyTestRunner;
  (window as any).runAccuracyTests = () => {
    const runner = new AccuracyTestRunner();
    return runner.runTests();
  };
}

export { AccuracyTestRunner }; 