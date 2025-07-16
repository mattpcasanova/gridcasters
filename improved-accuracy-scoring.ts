// Improved Accuracy Scoring System based on simulation results

interface PlayerPerformance {
  player_id: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  team: string;
  projected_points: number;
  actual_points: number;
  week: number;
  season: number;
}

interface UserRanking {
  user_id: string;
  week: number;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  rankings: Array<{
    player_id: string;
    rank: number;
  }>;
}

interface AccuracyResult {
  user_id: string;
  week: number;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  accuracy_score: number;
  breakdown: {
    perfect_matches: number;
    close_predictions: number;
    total_players: number;
    bonus_points: number;
    penalty_points: number;
  };
}

class ImprovedAccuracyScorer {
  // IMPROVED scoring algorithm with better discrimination
  calculateRankDifferenceScore(predicted: number, actual: number): number {
    const difference = Math.abs(predicted - actual);
    
    // More granular scoring with exponential decay
    if (difference === 0) return 100; // Perfect match
    if (difference === 1) return 85;  // Very close
    if (difference === 2) return 70;  // Close
    if (difference === 3) return 55;  // Moderate
    if (difference === 4) return 40;  // Poor
    if (difference === 5) return 25;  // Very poor
    if (difference <= 10) return Math.max(10, 25 - (difference - 5) * 3); // 25-10 linear
    if (difference <= 20) return Math.max(5, 10 - (difference - 10) * 0.5); // 10-5 linear
    
    // For 6+ ranks off: minimal credit that approaches 0
    return Math.max(0, 5 - (difference - 20) * 0.25); // 5-0 linear for 20+ rank differences
  }

  calculatePositionAccuracy(
    userRanking: UserRanking,
    actualPerformance: PlayerPerformance[]
  ): AccuracyResult {
    // Sort actual performance by points (descending) to get actual rankings
    const actualRankings = actualPerformance
      .filter(p => p.position === userRanking.position && p.week === userRanking.week)
      .sort((a, b) => b.actual_points - a.actual_points)
      .map((player, index) => ({
        player_id: player.player_id,
        actual_rank: index + 1,
        points: player.actual_points
      }));

    let totalScore = 0;
    let perfectMatches = 0;
    let closePredictions = 0;
    let bonusPoints = 0;
    let penaltyPoints = 0;
    let processedPlayers = 0;

    // Score each player in user's ranking
    for (const prediction of userRanking.rankings) {
      const actualPlayer = actualRankings.find(a => a.player_id === prediction.player_id);
      
      if (!actualPlayer) {
        // Player didn't perform this week (injury, DNP, etc.)
        // Neutral score but with slight penalty for ranking inactive players
        totalScore += 40; // Reduced from 50
        penaltyPoints += 10; // This is a PENALTY (negative impact)
        processedPlayers++;
        continue;
      }

      // Calculate base score
      const baseScore = this.calculateRankDifferenceScore(
        prediction.rank,
        actualPlayer.actual_rank
      );
      totalScore += baseScore;
      processedPlayers++;

      // Track accuracy categories
      const difference = Math.abs(prediction.rank - actualPlayer.actual_rank);
      if (difference === 0) perfectMatches++;
      if (difference <= 2) closePredictions++;

      // IMPROVED bonus/penalty system
      // BONUSES (positive points for good predictions)
      if (prediction.rank <= 10 && actualPlayer.actual_rank <= 10) {
        bonusPoints += 15; // Bonus for correctly identifying top 10 performers
      }
      if (prediction.rank <= 5 && actualPlayer.actual_rank <= 5) {
        bonusPoints += 10; // Extra bonus for top 5 accuracy
      }
      
      // PENALTIES (negative points for bad predictions)
      if (prediction.rank <= 10 && actualPlayer.actual_rank > 20) {
        penaltyPoints += 15; // Penalty for ranking a bust in top 10
      }
      if (prediction.rank <= 5 && actualPlayer.actual_rank > 15) {
        penaltyPoints += 20; // Extra penalty for ranking a bust in top 5
      }
      
      // BUST DEFINITION: Player ranked in top 10-15 but finishes outside top 20
      // This represents a significant prediction failure
    }

    const averageScore = processedPlayers > 0 ? totalScore / processedPlayers : 0;
    const netBonus = bonusPoints - penaltyPoints; // Bonuses minus penalties
    const finalScore = Math.max(0, Math.min(100, averageScore + (netBonus / processedPlayers)));

    return {
      user_id: userRanking.user_id,
      week: userRanking.week,
      position: userRanking.position,
      accuracy_score: Math.round(finalScore * 100) / 100,
      breakdown: {
        perfect_matches: perfectMatches,
        close_predictions: closePredictions,
        total_players: processedPlayers,
        bonus_points: bonusPoints,
        penalty_points: penaltyPoints
      }
    };
  }
}

class ImprovedDataSimulator {
  // IMPROVED user skill simulation with more realistic error patterns
  generateSimulatedRankings(
    projectedData: PlayerPerformance[],
    numUsers: number = 1000
  ): UserRanking[] {
    const rankings: UserRanking[] = [];
    const positions: Array<'QB' | 'RB' | 'WR' | 'TE'> = ['QB', 'RB', 'WR', 'TE'];

    for (let userId = 1; userId <= numUsers; userId++) {
      for (const week of [1, 2, 3, 4, 5, 6, 7, 8]) {
        for (const position of positions) {
          const positionPlayers = projectedData
            .filter(p => p.position === position && p.week === week)
            .sort((a, b) => b.projected_points - a.projected_points)
            .slice(0, 36);

          const userSkill = this.generateUserSkill(userId);
          const userRanking = this.simulateUserRanking(
            positionPlayers,
            userId,
            week,
            position,
            userSkill
          );

          rankings.push(userRanking);
        }
      }
    }

    return rankings;
  }

  generateUserSkill(userId: number): number {
    // IMPROVED skill distribution with more realistic spread
    const random = Math.random();
    if (random < 0.05) return 0.9 + Math.random() * 0.1; // Elite (5%)
    if (random < 0.15) return 0.7 + Math.random() * 0.2; // Excellent (10%)
    if (random < 0.35) return 0.5 + Math.random() * 0.2; // Good (20%)
    if (random < 0.65) return 0.3 + Math.random() * 0.2; // Average (30%)
    if (random < 0.85) return 0.1 + Math.random() * 0.2; // Below Average (20%)
    return Math.random() * 0.1; // Poor (15%)
  }

  simulateUserRanking(
    projectedPlayers: PlayerPerformance[],
    userId: number,
    week: number,
    position: 'QB' | 'RB' | 'WR' | 'TE',
    skill: number
  ): UserRanking {
    const rankings = projectedPlayers.map((player, index) => {
      const projectedRank = index + 1;
      
      // IMPROVED error simulation with more realistic patterns
      const baseErrorRange = Math.round((1 - skill) * 15); // Increased error range
      const error = Math.floor(Math.random() * (baseErrorRange * 2 + 1)) - baseErrorRange;
      
      // Add position-specific error patterns
      let positionError = 0;
      if (position === 'QB') positionError = Math.floor(Math.random() * 3) - 1; // QBs more predictable
      if (position === 'WR') positionError = Math.floor(Math.random() * 5) - 2; // WRs more volatile
      if (position === 'RB') positionError = Math.floor(Math.random() * 4) - 2; // RBs moderate volatility
      if (position === 'TE') positionError = Math.floor(Math.random() * 6) - 3; // TEs most volatile
      
      const adjustedRank = Math.max(1, Math.min(36, projectedRank + error + positionError));

      return {
        player_id: player.player_id,
        rank: adjustedRank
      };
    });

    // Sort and re-assign sequential ranks
    rankings.sort((a, b) => a.rank - b.rank);
    rankings.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });

    return {
      user_id: userId.toString(),
      week,
      position,
      rankings: rankings.slice(0, 36)
    };
  }
}

class ImprovedSimulationRunner {
  private scorer = new ImprovedAccuracyScorer();
  private simulator = new ImprovedDataSimulator();

  async runFullSimulation(
    projectedData: PlayerPerformance[],
    actualData: PlayerPerformance[]
  ) {
    console.log('🔄 Generating simulated user rankings...');
    const userRankings = this.simulator.generateSimulatedRankings(projectedData, 1000);
    console.log(`📊 Generated ${userRankings.length} ranking sets`);

    console.log('🎯 Calculating accuracy scores...');
    const results: AccuracyResult[] = [];
    
    for (const ranking of userRankings) {
      const result = this.scorer.calculatePositionAccuracy(ranking, actualData);
      results.push(result);
    }

    console.log(`✅ Calculated ${results.length} accuracy scores`);
    
    // Analyze and display results
    this.analyzeResults(results);
    
    return results;
  }

  analyzeResults(results: AccuracyResult[]) {
    const analysis = {
      overall: this.calculateOverallStats(results),
      byPosition: this.calculatePositionStats(results),
      byWeek: this.calculateWeeklyStats(results),
      distributionAnalysis: this.calculateDistribution(results),
      systemValidation: this.validateScoringSystem(results)
    };

    this.printAnalysis(analysis);
    return analysis;
  }

  calculateOverallStats(results: AccuracyResult[]) {
    const scores = results.map(r => r.accuracy_score);
    return {
      mean: scores.reduce((a, b) => a + b, 0) / scores.length,
      median: this.calculateMedian(scores),
      min: Math.min(...scores),
      max: Math.max(...scores),
      stdDev: this.calculateStdDev(scores)
    };
  }

  calculatePositionStats(results: AccuracyResult[]) {
    const positions = ['QB', 'RB', 'WR', 'TE'];
    const stats: Record<string, any> = {};

    for (const position of positions) {
      const positionResults = results.filter(r => r.position === position);
      const scores = positionResults.map(r => r.accuracy_score);
      
      stats[position] = {
        mean: scores.reduce((a, b) => a + b, 0) / scores.length,
        median: this.calculateMedian(scores),
        perfectMatches: positionResults.reduce((sum, r) => sum + r.breakdown.perfect_matches, 0),
        totalPredictions: positionResults.reduce((sum, r) => sum + r.breakdown.total_players, 0)
      };
    }

    return stats;
  }

  calculateWeeklyStats(results: AccuracyResult[]) {
    const weeks = [1, 2, 3, 4, 5, 6, 7, 8];
    const stats: Record<number, any> = {};

    for (const week of weeks) {
      const weekResults = results.filter(r => r.week === week);
      const scores = weekResults.map(r => r.accuracy_score);
      
      stats[week] = {
        mean: scores.reduce((a, b) => a + b, 0) / scores.length,
        sampleSize: scores.length
      };
    }

    return stats;
  }

  calculateDistribution(results: AccuracyResult[]) {
    const scores = results.map(r => r.accuracy_score);
    const buckets = {
      '90-100': scores.filter(s => s >= 90).length,
      '80-89': scores.filter(s => s >= 80 && s < 90).length,
      '70-79': scores.filter(s => s >= 70 && s < 80).length,
      '60-69': scores.filter(s => s >= 60 && s < 70).length,
      '50-59': scores.filter(s => s >= 50 && s < 60).length,
      '40-49': scores.filter(s => s >= 40 && s < 50).length,
      'Below 40': scores.filter(s => s < 40).length
    };

    const total = results.length;
    const percentages: Record<string, number> = {};
    
    for (const [bucket, count] of Object.entries(buckets)) {
      percentages[bucket] = Math.round((count / total) * 100 * 100) / 100;
    }

    return { counts: buckets, percentages };
  }

  validateScoringSystem(results: AccuracyResult[]) {
    return {
      fairness: this.checkPositionFairness(results),
      discrimination: this.checkScoreDiscrimination(results),
      stability: this.checkWeeklyStability(results)
    };
  }

  checkPositionFairness(results: AccuracyResult[]) {
    const positionMeans = this.calculatePositionStats(results);
    const means = Object.values(positionMeans).map((p: any) => p.mean);
    const variance = this.calculateStdDev(means);
    
    return {
      variance,
      isFair: variance < 5,
      breakdown: positionMeans
    };
  }

  checkScoreDiscrimination(results: AccuracyResult[]) {
    const scores = results.map(r => r.accuracy_score);
    const uniqueScores = new Set(scores).size;
    const discriminationRatio = uniqueScores / scores.length;
    
    return {
      uniqueScores,
      totalScores: scores.length,
      discriminationRatio,
      goodDiscrimination: discriminationRatio > 0.15 // Increased threshold
    };
  }

  checkWeeklyStability(results: AccuracyResult[]) {
    const weeklyStats = this.calculateWeeklyStats(results);
    const weeklyMeans = Object.values(weeklyStats).map((w: any) => w.mean);
    const stability = this.calculateStdDev(weeklyMeans);
    
    return {
      weeklyVariance: stability,
      isStable: stability < 3,
      breakdown: weeklyStats
    };
  }

  calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  calculateStdDev(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }

  printAnalysis(analysis: any) {
    console.log('\n📈 IMPROVED GRIDCASTERS ACCURACY SIMULATION RESULTS\n');
    
    console.log('🎯 Overall Statistics:');
    console.log(`   Mean Accuracy: ${analysis.overall.mean.toFixed(2)}%`);
    console.log(`   Median Accuracy: ${analysis.overall.median.toFixed(2)}%`);
    console.log(`   Range: ${analysis.overall.min.toFixed(2)}% - ${analysis.overall.max.toFixed(2)}%`);
    console.log(`   Standard Deviation: ${analysis.overall.stdDev.toFixed(2)}`);
    
    console.log('\n🏈 Position Breakdown:');
    for (const [position, stats] of Object.entries(analysis.byPosition)) {
      const s = stats as any;
      console.log(`   ${position}: ${s.mean.toFixed(2)}% avg (${s.perfectMatches} perfect matches)`);
    }
    
    console.log('\n📊 Score Distribution:');
    for (const [bucket, percentage] of Object.entries(analysis.distributionAnalysis.percentages)) {
      console.log(`   ${bucket}: ${percentage}%`);
    }
    
    console.log('\n✅ System Validation:');
    console.log(`   Position Fairness: ${analysis.systemValidation.fairness.isFair ? '✅' : '❌'}`);
    console.log(`   Score Discrimination: ${analysis.systemValidation.discrimination.goodDiscrimination ? '✅' : '❌'}`);
    console.log(`   Weekly Stability: ${analysis.systemValidation.stability.isStable ? '✅' : '❌'}`);
    
    console.log('\n📋 Scoring System Details:');
    console.log('• Perfect match: 100 points');
    console.log('• 1 rank off: 85 points');
    console.log('• 2 ranks off: 70 points');
    console.log('• 3 ranks off: 55 points');
    console.log('• 4 ranks off: 40 points');
    console.log('• 5 ranks off: 25 points');
    console.log('• 6-10 ranks off: 25-10 points (linear)');
    console.log('• 11-20 ranks off: 10-5 points (linear)');
    console.log('• 20+ ranks off: 5-0 points (linear)');
    console.log('• BUST definition: Top 10-15 ranked player finishes outside top 20');
    console.log('• Bonuses: +15 for top 10 accuracy, +10 for top 5 accuracy');
    console.log('• Penalties: -15 for top 10 busts, -20 for top 5 busts, -10 for inactive players');
  }
}

// Generate realistic 2024 data
function generateRealistic2024Data(): { projected: PlayerPerformance[], actual: PlayerPerformance[] } {
  const projected: PlayerPerformance[] = [];
  const actual: PlayerPerformance[] = [];
  
  // Realistic 2024 player data
  const players = [
    // QBs
    { id: 'qb1', name: 'Josh Allen', team: 'BUF', position: 'QB' as const },
    { id: 'qb2', name: 'Patrick Mahomes', team: 'KC', position: 'QB' as const },
    { id: 'qb3', name: 'Jalen Hurts', team: 'PHI', position: 'QB' as const },
    { id: 'qb4', name: 'Lamar Jackson', team: 'BAL', position: 'QB' as const },
    { id: 'qb5', name: 'Justin Herbert', team: 'LAC', position: 'QB' as const },
    { id: 'qb6', name: 'Dak Prescott', team: 'DAL', position: 'QB' as const },
    { id: 'qb7', name: 'Tua Tagovailoa', team: 'MIA', position: 'QB' as const },
    { id: 'qb8', name: 'Kirk Cousins', team: 'MIN', position: 'QB' as const },
    { id: 'qb9', name: 'Russell Wilson', team: 'DEN', position: 'QB' as const },
    { id: 'qb10', name: 'Geno Smith', team: 'SEA', position: 'QB' as const },
    
    // RBs
    { id: 'rb1', name: 'Christian McCaffrey', team: 'SF', position: 'RB' as const },
    { id: 'rb2', name: 'Austin Ekeler', team: 'LAC', position: 'RB' as const },
    { id: 'rb3', name: 'Saquon Barkley', team: 'NYG', position: 'RB' as const },
    { id: 'rb4', name: 'Derrick Henry', team: 'TEN', position: 'RB' as const },
    { id: 'rb5', name: 'Nick Chubb', team: 'CLE', position: 'RB' as const },
    { id: 'rb6', name: 'Alvin Kamara', team: 'NO', position: 'RB' as const },
    { id: 'rb7', name: 'Joe Mixon', team: 'CIN', position: 'RB' as const },
    { id: 'rb8', name: 'Aaron Jones', team: 'GB', position: 'RB' as const },
    { id: 'rb9', name: 'Dalvin Cook', team: 'NYJ', position: 'RB' as const },
    { id: 'rb10', name: 'Breece Hall', team: 'NYJ', position: 'RB' as const },
    
    // WRs
    { id: 'wr1', name: 'Justin Jefferson', team: 'MIN', position: 'WR' as const },
    { id: 'wr2', name: 'Tyreek Hill', team: 'MIA', position: 'WR' as const },
    { id: 'wr3', name: 'Ja\'Marr Chase', team: 'CIN', position: 'WR' as const },
    { id: 'wr4', name: 'Stefon Diggs', team: 'BUF', position: 'WR' as const },
    { id: 'wr5', name: 'CeeDee Lamb', team: 'DAL', position: 'WR' as const },
    { id: 'wr6', name: 'A.J. Brown', team: 'PHI', position: 'WR' as const },
    { id: 'wr7', name: 'Davante Adams', team: 'LV', position: 'WR' as const },
    { id: 'wr8', name: 'Cooper Kupp', team: 'LAR', position: 'WR' as const },
    { id: 'wr9', name: 'Jaylen Waddle', team: 'MIA', position: 'WR' as const },
    { id: 'wr10', name: 'DeVonta Smith', team: 'PHI', position: 'WR' as const },
    
    // TEs
    { id: 'te1', name: 'Travis Kelce', team: 'KC', position: 'TE' as const },
    { id: 'te2', name: 'Mark Andrews', team: 'BAL', position: 'TE' as const },
    { id: 'te3', name: 'T.J. Hockenson', team: 'MIN', position: 'TE' as const },
    { id: 'te4', name: 'George Kittle', team: 'SF', position: 'TE' as const },
    { id: 'te5', name: 'Dallas Goedert', team: 'PHI', position: 'TE' as const },
    { id: 'te6', name: 'Darren Waller', team: 'NYG', position: 'TE' as const },
    { id: 'te7', name: 'Evan Engram', team: 'JAX', position: 'TE' as const },
    { id: 'te8', name: 'Kyle Pitts', team: 'ATL', position: 'TE' as const },
    { id: 'te9', name: 'Pat Freiermuth', team: 'PIT', position: 'TE' as const },
    { id: 'te10', name: 'Cole Kmet', team: 'CHI', position: 'TE' as const },
  ];

  // Generate 8 weeks of data
  for (let week = 1; week <= 8; week++) {
    for (const player of players) {
      // Generate projected points (more predictable for QBs, more volatile for TEs)
      let projectedPoints = 0;
      let volatility = 0;
      
      switch (player.position) {
        case 'QB':
          projectedPoints = 18 + Math.random() * 12; // 18-30 range
          volatility = 0.3; // Lower volatility
          break;
        case 'RB':
          projectedPoints = 12 + Math.random() * 10; // 12-22 range
          volatility = 0.4; // Medium volatility
          break;
        case 'WR':
          projectedPoints = 10 + Math.random() * 8; // 10-18 range
          volatility = 0.5; // Higher volatility
          break;
        case 'TE':
          projectedPoints = 8 + Math.random() * 6; // 8-14 range
          volatility = 0.6; // Highest volatility
          break;
      }

      // Add some week-to-week variation
      projectedPoints += (Math.random() - 0.5) * 4;

      // Generate actual points with realistic variance
      const actualPoints = Math.max(0, projectedPoints + (Math.random() - 0.5) * projectedPoints * volatility * 2);

      projected.push({
        player_id: player.id,
        name: player.name,
        position: player.position,
        team: player.team,
        projected_points: Math.round(projectedPoints * 10) / 10,
        actual_points: Math.round(actualPoints * 10) / 10,
        week,
        season: 2024
      });

      actual.push({
        player_id: player.id,
        name: player.name,
        position: player.position,
        team: player.team,
        projected_points: Math.round(projectedPoints * 10) / 10,
        actual_points: Math.round(actualPoints * 10) / 10,
        week,
        season: 2024
      });
    }
  }

  return { projected, actual };
}

// Run improved simulation
async function runImprovedSimulation() {
  console.log('🚀 Starting IMPROVED GridCasters Accuracy Simulation...\n');
  
  // Generate realistic 2024 data
  const { projected, actual } = generateRealistic2024Data();
  console.log(`📊 Generated data for ${projected.length / 8} players across 8 weeks`);
  
  // Run improved simulation
  const simulation = new ImprovedSimulationRunner();
  const results = await simulation.runFullSimulation(projected, actual);
  
  console.log('\n🎉 IMPROVED Simulation Complete!');
  console.log('\n📋 Key Improvements:');
  console.log('• More granular scoring tiers (0, 1, 2, 3, 4, 5+ rank differences)');
  console.log('• Increased penalties for ranking inactive players');
  console.log('• Enhanced bonus/penalty system for top performers');
  console.log('• More realistic user skill distribution');
  console.log('• Position-specific error patterns');
  
  return results;
}

// Run the simulation if this file is executed directly
if (require.main === module) {
  runImprovedSimulation().catch(console.error);
}

export { ImprovedSimulationRunner, ImprovedAccuracyScorer, ImprovedDataSimulator, runImprovedSimulation };
export type { PlayerPerformance, UserRanking, AccuracyResult }; 