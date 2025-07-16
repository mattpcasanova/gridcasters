import { calculateAccuracyScore, getMockPerformanceData } from './accuracy-scoring';

// Test data
const createTestRanking = (playerIds: string[], rankPositions: number[]) => {
  return playerIds.map((id, index) => ({
    id: `test-${index + 1}`,
    ranking_id: 'test-ranking',
    player_id: id,
    player_name: `Player ${id}`,
    team: 'TEST',
    position: 'QB',
    rank_position: rankPositions[index],
    is_starred: false,
    created_at: new Date().toISOString()
  }));
};

interface TestResult {
  name: string;
  passed: boolean;
  expected?: any;
  actual?: any;
  error?: string;
}

class AccuracyTestRunner {
  private results: TestResult[] = [];

  private assertEqual(actual: any, expected: any, name: string) {
    const passed = actual === expected;
    this.results.push({
      name,
      passed,
      expected,
      actual
    });
    
    if (!passed) {
      console.error(`❌ ${name}: Expected ${expected}, got ${actual}`);
    } else {
      console.log(`✅ ${name}: ${actual}`);
    }
  }

  private assertGreaterThan(actual: number, expected: number, name: string) {
    const passed = actual > expected;
    this.results.push({
      name,
      passed,
      expected: `> ${expected}`,
      actual
    });
    
    if (!passed) {
      console.error(`❌ ${name}: Expected > ${expected}, got ${actual}`);
    } else {
      console.log(`✅ ${name}: ${actual} > ${expected}`);
    }
  }

  private assertGreaterThanOrEqual(actual: number, expected: number, name: string) {
    const passed = actual >= expected;
    this.results.push({
      name,
      passed,
      expected: `>= ${expected}`,
      actual
    });
    
    if (!passed) {
      console.error(`❌ ${name}: Expected >= ${expected}, got ${actual}`);
    } else {
      console.log(`✅ ${name}: ${actual} >= ${expected}`);
    }
  }

  private assertLessThan(actual: number, expected: number, name: string) {
    const passed = actual < expected;
    this.results.push({
      name,
      passed,
      expected: `< ${expected}`,
      actual
    });
    
    if (!passed) {
      console.error(`❌ ${name}: Expected < ${expected}, got ${actual}`);
    } else {
      console.log(`✅ ${name}: ${actual} < ${expected}`);
    }
  }

  runTests() {
    console.log('🧪 Running Accuracy Scoring Tests...\n');

    // Test 1: Perfect Predictions
    console.log('📋 Test 1: Perfect Predictions');
    const perfectRanking = createTestRanking(['1', '2', '3', '4', '5'], [1, 2, 3, 4, 5]);
    const actualPerformance = getMockPerformanceData('QB');
    const perfectResult = calculateAccuracyScore(perfectRanking, actualPerformance, 'QB');
    
    this.assertEqual(perfectResult.accuracyPercentage, 100, 'Perfect predictions should score 100%');
    this.assertEqual(perfectResult.breakdown.details.perfectMatches, 5, 'Should have 5 perfect matches');
    this.assertEqual(perfectResult.breakdown.details.closeMatches, 0, 'Should have 0 close matches');
    this.assertGreaterThan(perfectResult.breakdown.bonuses, 0, 'Should have bonus points for top performers');

    // Test 2: Close Predictions
    console.log('\n📋 Test 2: Close Predictions');
    const closeRanking = createTestRanking(['1', '2', '3', '4', '5'], [1, 3, 2, 4, 5]);
    const closeResult = calculateAccuracyScore(closeRanking, actualPerformance, 'QB');
    
    this.assertGreaterThan(closeResult.accuracyPercentage, 90, 'Close predictions should score > 90%');
    this.assertEqual(closeResult.breakdown.details.perfectMatches, 3, 'Should have 3 perfect matches');
    this.assertEqual(closeResult.breakdown.details.closeMatches, 2, 'Should have 2 close matches');

    // Test 3: Bust Penalties
    console.log('\n📋 Test 3: Bust Penalties');
    const bustRanking = createTestRanking(['1', '25', '3', '4', '5'], [1, 2, 3, 4, 5]);
    const bustResult = calculateAccuracyScore(bustRanking, actualPerformance, 'QB');
    
    this.assertEqual(bustResult.breakdown.details.busts, 1, 'Should detect 1 bust');
    this.assertGreaterThan(bustResult.breakdown.penalties, 0, 'Should have penalty points');
    this.assertLessThan(bustResult.accuracyPercentage, 100, 'Bust predictions should score < 100%');

    // Test 4: Top 5 Bust Penalty
    console.log('\n📋 Test 4: Top 5 Bust Penalty');
    const top5BustRanking = createTestRanking(['1', '2', '25', '4', '5'], [1, 2, 3, 4, 5]);
    const top5BustResult = calculateAccuracyScore(top5BustRanking, actualPerformance, 'QB');
    
    this.assertEqual(top5BustResult.breakdown.details.busts, 1, 'Should detect 1 bust');
    this.assertGreaterThanOrEqual(top5BustResult.breakdown.penalties, 20, 'Top 5 bust should have >= 20 penalty points');

    // Test 5: Bonus Points
    console.log('\n📋 Test 5: Bonus Points');
    this.assertGreaterThan(perfectResult.breakdown.details.top10Correct, 0, 'Should have top 10 correct bonuses');
    this.assertGreaterThanOrEqual(perfectResult.breakdown.details.top5Correct, 5, 'Should have 5 top 5 correct bonuses');

    // Test 6: Score Ranges
    console.log('\n📋 Test 6: Score Ranges');
    const allBustRanking = createTestRanking(['25', '26', '27', '28', '29'], [1, 2, 3, 4, 5]);
    const allBustResult = calculateAccuracyScore(allBustRanking, actualPerformance, 'QB');
    
    this.assertGreaterThanOrEqual(allBustResult.accuracyPercentage, 0, 'Scores should never be negative');
    this.assertLessThan(perfectResult.accuracyPercentage + 0.1, 100.1, 'Scores should never exceed 100%');

    // Test 7: Different Positions
    console.log('\n📋 Test 7: Different Positions');
    const rbRanking = createTestRanking(['rb1', 'rb2', 'rb3', 'rb4', 'rb5'], [1, 2, 3, 4, 5]);
    const rbPerformance = getMockPerformanceData('RB');
    const rbResult = calculateAccuracyScore(rbRanking, rbPerformance, 'RB');
    
    this.assertGreaterThan(rbResult.accuracyPercentage, 0, 'RB rankings should work');
    this.assertEqual(rbResult.breakdown.details.perfectMatches, 5, 'RB should have 5 perfect matches');

    // Test 8: Edge Cases
    console.log('\n📋 Test 8: Edge Cases');
    const emptyRanking: any[] = [];
    const emptyResult = calculateAccuracyScore(emptyRanking, actualPerformance, 'QB');
    
    this.assertEqual(emptyResult.accuracyPercentage, 0, 'Empty rankings should score 0%');
    this.assertEqual(emptyResult.totalScore, 0, 'Empty rankings should have 0 total score');

    // Test 9: Partial Matches
    console.log('\n📋 Test 9: Partial Matches');
    const partialRanking = createTestRanking(['1', 'nonexistent', '3', '4', '5'], [1, 2, 3, 4, 5]);
    const partialResult = calculateAccuracyScore(partialRanking, actualPerformance, 'QB');
    
    this.assertGreaterThan(partialResult.accuracyPercentage, 0, 'Partial matches should score > 0%');
    this.assertEqual(partialResult.breakdown.details.perfectMatches, 4, 'Should have 4 perfect matches');

    // Test 10: Score Distribution
    console.log('\n📋 Test 10: Score Distribution');
    const scenarios = [
      { ranking: [1, 2, 3, 4, 5], expectedMin: 95, description: 'Perfect' },
      { ranking: [1, 3, 2, 4, 5], expectedMin: 85, description: 'Close' },
      { ranking: [1, 5, 3, 4, 2], expectedMin: 70, description: 'Mixed' },
      { ranking: [1, 10, 3, 4, 5], expectedMin: 60, description: 'One bust' },
      { ranking: [25, 26, 27, 28, 29], expectedMin: 0, description: 'All busts' }
    ];

    scenarios.forEach(({ ranking: rankPositions, expectedMin, description }) => {
      const playerIds = rankPositions.map(pos => pos.toString());
      const testRanking = createTestRanking(playerIds, rankPositions);
      const result = calculateAccuracyScore(testRanking, actualPerformance, 'QB');
      
      this.assertGreaterThanOrEqual(result.accuracyPercentage, expectedMin, 
        `${description} scenario should score >= ${expectedMin}%`);
    });

    // Summary
    console.log('\n📊 Test Summary');
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const percentage = Math.round((passed / total) * 100);
    
    console.log(`✅ ${passed}/${total} tests passed (${percentage}%)`);
    
    if (passed < total) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  - ${result.name}: Expected ${result.expected}, got ${result.actual}`);
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