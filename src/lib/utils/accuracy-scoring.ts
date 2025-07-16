import { Database } from '@/lib/supabase/types';

type PlayerRanking = Database['public']['Tables']['player_rankings']['Row'];

export interface AccuracyScoreResult {
  totalScore: number;
  maxPossibleScore: number;
  accuracyPercentage: number;
  breakdown: {
    baseScore: number;
    bonuses: number;
    penalties: number;
    details: {
      perfectMatches: number;
      closeMatches: number;
      top10Correct: number;
      top5Correct: number;
      busts: number;
      inactivePlayers: number;
    };
  };
}

export interface ActualPerformance {
  playerId: string;
  playerName: string;
  actualRank: number;
  fantasyPoints: number;
  isActive: boolean;
}

/**
 * Calculate accuracy score for a ranking against actual performance
 */
export function calculateAccuracyScore(
  playerRankings: PlayerRanking[],
  actualPerformance: ActualPerformance[],
  position: string
): AccuracyScoreResult {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let perfectMatches = 0;
  let closeMatches = 0;
  let top10Correct = 0;
  let top5Correct = 0;
  let busts = 0;
  let inactivePlayers = 0;

  // Create lookup map for actual performance
  const actualMap = new Map(
    actualPerformance.map(p => [p.playerId, p])
  );

  // Calculate scores for each ranked player
  for (const ranking of playerRankings) {
    const actual = actualMap.get(ranking.player_id);
    if (!actual) continue;

    const predictedRank = ranking.rank_position;
    const actualRank = actual.actualRank;
    const rankDifference = Math.abs(predictedRank - actualRank);

    // Base score calculation
    let baseScore = 0;
    if (rankDifference === 0) {
      baseScore = 100;
      perfectMatches++;
    } else if (rankDifference === 1) {
      baseScore = 85;
      closeMatches++;
    } else if (rankDifference === 2) {
      baseScore = 70;
      closeMatches++;
    } else if (rankDifference === 3) {
      baseScore = 55;
    } else if (rankDifference === 4) {
      baseScore = 40;
    } else if (rankDifference === 5) {
      baseScore = 25;
    } else if (rankDifference <= 10) {
      baseScore = Math.max(10, 25 - (rankDifference - 5) * 3);
    } else {
      baseScore = Math.max(0, 10 - (rankDifference - 10) * 2);
    }

    totalScore += baseScore;
    maxPossibleScore += 100;

    // Bonus points for top performers
    if (actualRank <= 10 && predictedRank <= 10) {
      totalScore += 15;
      top10Correct++;
    }
    if (actualRank <= 5 && predictedRank <= 5) {
      totalScore += 10;
      top5Correct++;
    }

    // Penalties for busts
    if (actualRank > 20 && predictedRank <= 10) {
      totalScore -= 15;
      busts++;
    }
    if (actualRank > 20 && predictedRank <= 5) {
      totalScore -= 20;
      busts++;
    }

    // Penalties for inactive players
    if (!actual.isActive) {
      totalScore -= 10;
      inactivePlayers++;
    }
  }

  // Calculate final percentage
  const accuracyPercentage = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100) 
    : 0;

  return {
    totalScore,
    maxPossibleScore,
    accuracyPercentage,
    breakdown: {
      baseScore: totalScore - (top10Correct * 15) - (top5Correct * 10) + (busts * 15) + (inactivePlayers * 10),
      bonuses: (top10Correct * 15) + (top5Correct * 10),
      penalties: (busts * 15) + (inactivePlayers * 10),
      details: {
        perfectMatches,
        closeMatches,
        top10Correct,
        top5Correct,
        busts,
        inactivePlayers,
      }
    }
  };
}

/**
 * Get mock performance data for testing
 */
export function getMockPerformanceData(position: string): ActualPerformance[] {
  const mockData: Record<string, ActualPerformance[]> = {
    QB: [
      { playerId: '1', playerName: 'Josh Allen', actualRank: 1, fantasyPoints: 28.5, isActive: true },
      { playerId: '2', playerName: 'Lamar Jackson', actualRank: 2, fantasyPoints: 26.2, isActive: true },
      { playerId: '3', playerName: 'Patrick Mahomes', actualRank: 3, fantasyPoints: 24.8, isActive: true },
      { playerId: '4', playerName: 'Jalen Hurts', actualRank: 4, fantasyPoints: 23.1, isActive: true },
      { playerId: '5', playerName: 'Dak Prescott', actualRank: 5, fantasyPoints: 22.7, isActive: true },
      { playerId: '6', playerName: 'Justin Herbert', actualRank: 6, fantasyPoints: 21.9, isActive: true },
      { playerId: '7', playerName: 'Kyler Murray', actualRank: 7, fantasyPoints: 20.8, isActive: true },
      { playerId: '8', playerName: 'Tua Tagovailoa', actualRank: 8, fantasyPoints: 19.5, isActive: true },
      { playerId: '9', playerName: 'Kirk Cousins', actualRank: 9, fantasyPoints: 18.9, isActive: true },
      { playerId: '10', playerName: 'Russell Wilson', actualRank: 10, fantasyPoints: 18.2, isActive: true },
      { playerId: '11', playerName: 'Baker Mayfield', actualRank: 11, fantasyPoints: 17.8, isActive: true },
      { playerId: '12', playerName: 'Jared Goff', actualRank: 12, fantasyPoints: 17.1, isActive: true },
      { playerId: '13', playerName: 'Sam Howell', actualRank: 13, fantasyPoints: 16.5, isActive: true },
      { playerId: '14', playerName: 'Geno Smith', actualRank: 14, fantasyPoints: 15.9, isActive: true },
      { playerId: '15', playerName: 'Derek Carr', actualRank: 15, fantasyPoints: 15.2, isActive: true },
      { playerId: '16', playerName: 'Daniel Jones', actualRank: 16, fantasyPoints: 14.8, isActive: true },
      { playerId: '17', playerName: 'Mac Jones', actualRank: 17, fantasyPoints: 14.1, isActive: true },
      { playerId: '18', playerName: 'Kenny Pickett', actualRank: 18, fantasyPoints: 13.5, isActive: true },
      { playerId: '19', playerName: 'Desmond Ridder', actualRank: 19, fantasyPoints: 12.9, isActive: true },
      { playerId: '20', playerName: 'Zach Wilson', actualRank: 20, fantasyPoints: 12.2, isActive: true },
      { playerId: '21', playerName: 'Carson Wentz', actualRank: 21, fantasyPoints: 11.8, isActive: true },
      { playerId: '22', playerName: 'Mitch Trubisky', actualRank: 22, fantasyPoints: 11.1, isActive: true },
      { playerId: '23', playerName: 'Davis Mills', actualRank: 23, fantasyPoints: 10.5, isActive: true },
      { playerId: '24', playerName: 'Taylor Heinicke', actualRank: 24, fantasyPoints: 9.9, isActive: true },
      { playerId: '25', playerName: 'Gardner Minshew', actualRank: 25, fantasyPoints: 9.2, isActive: true },
      { playerId: '26', playerName: 'Tyler Huntley', actualRank: 26, fantasyPoints: 8.8, isActive: true },
      { playerId: '27', playerName: 'Cooper Rush', actualRank: 27, fantasyPoints: 8.1, isActive: true },
      { playerId: '28', playerName: 'Jameis Winston', actualRank: 28, fantasyPoints: 7.5, isActive: true },
      { playerId: '29', playerName: 'Andy Dalton', actualRank: 29, fantasyPoints: 6.9, isActive: true },
      { playerId: '30', playerName: 'Marcus Mariota', actualRank: 30, fantasyPoints: 6.2, isActive: true },
      { playerId: '31', playerName: 'Joe Flacco', actualRank: 31, fantasyPoints: 5.8, isActive: true },
      { playerId: '32', playerName: 'Blaine Gabbert', actualRank: 32, fantasyPoints: 5.1, isActive: true },
      { playerId: '33', playerName: 'Chase Daniel', actualRank: 33, fantasyPoints: 4.5, isActive: true },
      { playerId: '34', playerName: 'Nate Sudfeld', actualRank: 34, fantasyPoints: 3.9, isActive: true },
      { playerId: '35', playerName: 'Kyle Trask', actualRank: 35, fantasyPoints: 3.2, isActive: true },
      { playerId: '36', playerName: 'Jake Browning', actualRank: 36, fantasyPoints: 2.8, isActive: true },
    ],
    RB: [
      { playerId: 'rb1', playerName: 'Christian McCaffrey', actualRank: 1, fantasyPoints: 25.8, isActive: true },
      { playerId: 'rb2', playerName: 'Austin Ekeler', actualRank: 2, fantasyPoints: 24.2, isActive: true },
      { playerId: 'rb3', playerName: 'Saquon Barkley', actualRank: 3, fantasyPoints: 22.7, isActive: true },
      { playerId: 'rb4', playerName: 'Derrick Henry', actualRank: 4, fantasyPoints: 21.9, isActive: true },
      { playerId: 'rb5', playerName: 'Nick Chubb', actualRank: 5, fantasyPoints: 20.8, isActive: true },
      { playerId: 'rb6', playerName: 'Alvin Kamara', actualRank: 6, fantasyPoints: 19.5, isActive: true },
      { playerId: 'rb7', playerName: 'Dalvin Cook', actualRank: 7, fantasyPoints: 18.9, isActive: true },
      { playerId: 'rb8', playerName: 'Joe Mixon', actualRank: 8, fantasyPoints: 18.2, isActive: true },
      { playerId: 'rb9', playerName: 'Aaron Jones', actualRank: 9, fantasyPoints: 17.8, isActive: true },
      { playerId: 'rb10', playerName: 'Josh Jacobs', actualRank: 10, fantasyPoints: 17.1, isActive: true },
      { playerId: 'rb11', playerName: 'Ezekiel Elliott', actualRank: 11, fantasyPoints: 16.5, isActive: true },
      { playerId: 'rb12', playerName: 'James Conner', actualRank: 12, fantasyPoints: 15.9, isActive: true },
      { playerId: 'rb13', playerName: 'Miles Sanders', actualRank: 13, fantasyPoints: 15.2, isActive: true },
      { playerId: 'rb14', playerName: 'Rhamondre Stevenson', actualRank: 14, fantasyPoints: 14.8, isActive: true },
      { playerId: 'rb15', playerName: 'Tony Pollard', actualRank: 15, fantasyPoints: 14.1, isActive: true },
      { playerId: 'rb16', playerName: 'J.K. Dobbins', actualRank: 16, fantasyPoints: 13.5, isActive: true },
      { playerId: 'rb17', playerName: 'David Montgomery', actualRank: 17, fantasyPoints: 12.9, isActive: true },
      { playerId: 'rb18', playerName: 'Damien Harris', actualRank: 18, fantasyPoints: 12.2, isActive: true },
      { playerId: 'rb19', playerName: 'Clyde Edwards-Helaire', actualRank: 19, fantasyPoints: 11.8, isActive: true },
      { playerId: 'rb20', playerName: 'Cam Akers', actualRank: 20, fantasyPoints: 11.1, isActive: true },
      { playerId: 'rb21', playerName: 'Kareem Hunt', actualRank: 21, fantasyPoints: 10.5, isActive: true },
      { playerId: 'rb22', playerName: 'Melvin Gordon', actualRank: 22, fantasyPoints: 9.9, isActive: true },
      { playerId: 'rb23', playerName: 'Chase Edmonds', actualRank: 23, fantasyPoints: 9.2, isActive: true },
      { playerId: 'rb24', playerName: 'Rashaad Penny', actualRank: 24, fantasyPoints: 8.8, isActive: true },
      { playerId: 'rb25', playerName: 'Alexander Mattison', actualRank: 25, fantasyPoints: 8.1, isActive: true },
      { playerId: 'rb26', playerName: 'Devin Singletary', actualRank: 26, fantasyPoints: 7.5, isActive: true },
      { playerId: 'rb27', playerName: 'Raheem Mostert', actualRank: 27, fantasyPoints: 6.9, isActive: true },
      { playerId: 'rb28', playerName: 'Jeff Wilson Jr.', actualRank: 28, fantasyPoints: 6.2, isActive: true },
      { playerId: 'rb29', playerName: 'Nyheim Hines', actualRank: 29, fantasyPoints: 5.8, isActive: true },
      { playerId: 'rb30', playerName: 'James Robinson', actualRank: 30, fantasyPoints: 5.1, isActive: true },
      { playerId: 'rb31', playerName: 'Cordarrelle Patterson', actualRank: 31, fantasyPoints: 4.5, isActive: true },
      { playerId: 'rb32', playerName: 'Tyler Allgeier', actualRank: 32, fantasyPoints: 3.9, isActive: true },
      { playerId: 'rb33', playerName: 'Kenneth Walker III', actualRank: 33, fantasyPoints: 3.2, isActive: true },
      { playerId: 'rb34', playerName: 'Breece Hall', actualRank: 34, fantasyPoints: 2.8, isActive: true },
      { playerId: 'rb35', playerName: 'Dameon Pierce', actualRank: 35, fantasyPoints: 2.1, isActive: true },
      { playerId: 'rb36', playerName: 'Brian Robinson Jr.', actualRank: 36, fantasyPoints: 1.5, isActive: true },
    ],
    WR: [
      { playerId: 'wr1', playerName: 'Justin Jefferson', actualRank: 1, fantasyPoints: 24.8, isActive: true },
      { playerId: 'wr2', playerName: 'Davante Adams', actualRank: 2, fantasyPoints: 23.5, isActive: true },
      { playerId: 'wr3', playerName: 'Tyreek Hill', actualRank: 3, fantasyPoints: 22.9, isActive: true },
      { playerId: 'wr4', playerName: 'Stefon Diggs', actualRank: 4, fantasyPoints: 21.7, isActive: true },
      { playerId: 'wr5', playerName: 'CeeDee Lamb', actualRank: 5, fantasyPoints: 20.8, isActive: true },
      { playerId: 'wr6', playerName: 'A.J. Brown', actualRank: 6, fantasyPoints: 19.9, isActive: true },
      { playerId: 'wr7', playerName: 'Ja\'Marr Chase', actualRank: 7, fantasyPoints: 19.2, isActive: true },
      { playerId: 'wr8', playerName: 'DeAndre Hopkins', actualRank: 8, fantasyPoints: 18.5, isActive: true },
      { playerId: 'wr9', playerName: 'Mike Evans', actualRank: 9, fantasyPoints: 17.8, isActive: true },
      { playerId: 'wr10', playerName: 'Keenan Allen', actualRank: 10, fantasyPoints: 17.1, isActive: true },
      { playerId: 'wr11', playerName: 'Amari Cooper', actualRank: 11, fantasyPoints: 16.5, isActive: true },
      { playerId: 'wr12', playerName: 'Tyler Lockett', actualRank: 12, fantasyPoints: 15.9, isActive: true },
      { playerId: 'wr13', playerName: 'Brandin Cooks', actualRank: 13, fantasyPoints: 15.2, isActive: true },
      { playerId: 'wr14', playerName: 'Terry McLaurin', actualRank: 14, fantasyPoints: 14.8, isActive: true },
      { playerId: 'wr15', playerName: 'Diontae Johnson', actualRank: 15, fantasyPoints: 14.1, isActive: true },
      { playerId: 'wr16', playerName: 'Chris Godwin', actualRank: 16, fantasyPoints: 13.5, isActive: true },
      { playerId: 'wr17', playerName: 'Michael Pittman Jr.', actualRank: 17, fantasyPoints: 12.9, isActive: true },
      { playerId: 'wr18', playerName: 'Jerry Jeudy', actualRank: 18, fantasyPoints: 12.2, isActive: true },
      { playerId: 'wr19', playerName: 'Drake London', actualRank: 19, fantasyPoints: 11.8, isActive: true },
      { playerId: 'wr20', playerName: 'Garrett Wilson', actualRank: 20, fantasyPoints: 11.1, isActive: true },
      { playerId: 'wr21', playerName: 'Christian Watson', actualRank: 21, fantasyPoints: 10.5, isActive: true },
      { playerId: 'wr22', playerName: 'Jahan Dotson', actualRank: 22, fantasyPoints: 9.9, isActive: true },
      { playerId: 'wr23', playerName: 'Treylon Burks', actualRank: 23, fantasyPoints: 9.2, isActive: true },
      { playerId: 'wr24', playerName: 'George Pickens', actualRank: 24, fantasyPoints: 8.8, isActive: true },
      { playerId: 'wr25', playerName: 'Skyy Moore', actualRank: 25, fantasyPoints: 8.1, isActive: true },
      { playerId: 'wr26', playerName: 'Wan\'Dale Robinson', actualRank: 26, fantasyPoints: 7.5, isActive: true },
      { playerId: 'wr27', playerName: 'Alec Pierce', actualRank: 27, fantasyPoints: 6.9, isActive: true },
      { playerId: 'wr28', playerName: 'Romeo Doubs', actualRank: 28, fantasyPoints: 6.2, isActive: true },
      { playerId: 'wr29', playerName: 'Kadarius Toney', actualRank: 29, fantasyPoints: 5.8, isActive: true },
      { playerId: 'wr30', playerName: 'Jalen Tolbert', actualRank: 30, fantasyPoints: 5.1, isActive: true },
      { playerId: 'wr31', playerName: 'Kyle Philips', actualRank: 31, fantasyPoints: 4.5, isActive: true },
      { playerId: 'wr32', playerName: 'Calvin Austin III', actualRank: 32, fantasyPoints: 3.9, isActive: true },
      { playerId: 'wr33', playerName: 'Tyquan Thornton', actualRank: 33, fantasyPoints: 3.2, isActive: true },
      { playerId: 'wr34', playerName: 'Velus Jones Jr.', actualRank: 34, fantasyPoints: 2.8, isActive: true },
      { playerId: 'wr35', playerName: 'Danny Gray', actualRank: 35, fantasyPoints: 2.1, isActive: true },
      { playerId: 'wr36', playerName: 'John Metchie III', actualRank: 36, fantasyPoints: 1.5, isActive: true },
    ],
    TE: [
      { playerId: 'te1', playerName: 'Travis Kelce', actualRank: 1, fantasyPoints: 22.5, isActive: true },
      { playerId: 'te2', playerName: 'Mark Andrews', actualRank: 2, fantasyPoints: 20.8, isActive: true },
      { playerId: 'te3', playerName: 'Kyle Pitts', actualRank: 3, fantasyPoints: 19.2, isActive: true },
      { playerId: 'te4', playerName: 'George Kittle', actualRank: 4, fantasyPoints: 17.9, isActive: true },
      { playerId: 'te5', playerName: 'Darren Waller', actualRank: 5, fantasyPoints: 16.8, isActive: true },
      { playerId: 'te6', playerName: 'T.J. Hockenson', actualRank: 6, fantasyPoints: 15.7, isActive: true },
      { playerId: 'te7', playerName: 'Dallas Goedert', actualRank: 7, fantasyPoints: 14.9, isActive: true },
      { playerId: 'te8', playerName: 'Pat Freiermuth', actualRank: 8, fantasyPoints: 14.2, isActive: true },
      { playerId: 'te9', playerName: 'Cole Kmet', actualRank: 9, fantasyPoints: 13.5, isActive: true },
      { playerId: 'te10', playerName: 'Evan Engram', actualRank: 10, fantasyPoints: 12.8, isActive: true },
      { playerId: 'te11', playerName: 'Gerald Everett', actualRank: 11, fantasyPoints: 12.1, isActive: true },
      { playerId: 'te12', playerName: 'Tyler Higbee', actualRank: 12, fantasyPoints: 11.5, isActive: true },
      { playerId: 'te13', playerName: 'Hayden Hurst', actualRank: 13, fantasyPoints: 10.9, isActive: true },
      { playerId: 'te14', playerName: 'Robert Tonyan', actualRank: 14, fantasyPoints: 10.2, isActive: true },
      { playerId: 'te15', playerName: 'Noah Fant', actualRank: 15, fantasyPoints: 9.8, isActive: true },
      { playerId: 'te16', playerName: 'Mike Gesicki', actualRank: 16, fantasyPoints: 9.1, isActive: true },
      { playerId: 'te17', playerName: 'Hunter Henry', actualRank: 17, fantasyPoints: 8.5, isActive: true },
      { playerId: 'te18', playerName: 'Austin Hooper', actualRank: 18, fantasyPoints: 7.9, isActive: true },
      { playerId: 'te19', playerName: 'Cameron Brate', actualRank: 19, fantasyPoints: 7.2, isActive: true },
      { playerId: 'te20', playerName: 'Mo Alie-Cox', actualRank: 20, fantasyPoints: 6.8, isActive: true },
      { playerId: 'te21', playerName: 'Tyler Conklin', actualRank: 21, fantasyPoints: 6.1, isActive: true },
      { playerId: 'te22', playerName: 'Jonnu Smith', actualRank: 22, fantasyPoints: 5.5, isActive: true },
      { playerId: 'te23', playerName: 'Irv Smith Jr.', actualRank: 23, fantasyPoints: 4.9, isActive: true },
      { playerId: 'te24', playerName: 'Albert Okwuegbunam', actualRank: 24, fantasyPoints: 4.2, isActive: true },
      { playerId: 'te25', playerName: 'Brevin Jordan', actualRank: 25, fantasyPoints: 3.8, isActive: true },
      { playerId: 'te26', playerName: 'Jelani Woods', actualRank: 26, fantasyPoints: 3.1, isActive: true },
      { playerId: 'te27', playerName: 'Greg Dulcich', actualRank: 27, fantasyPoints: 2.5, isActive: true },
      { playerId: 'te28', playerName: 'Trey McBride', actualRank: 28, fantasyPoints: 1.9, isActive: true },
      { playerId: 'te29', playerName: 'Jake Ferguson', actualRank: 29, fantasyPoints: 1.2, isActive: true },
      { playerId: 'te30', playerName: 'Isaiah Likely', actualRank: 30, fantasyPoints: 0.8, isActive: true },
      { playerId: 'te31', playerName: 'Cade Otton', actualRank: 31, fantasyPoints: 0.1, isActive: true },
      { playerId: 'te32', playerName: 'Daniel Bellinger', actualRank: 32, fantasyPoints: 0.0, isActive: true },
      { playerId: 'te33', playerName: 'Jeremy Ruckert', actualRank: 33, fantasyPoints: 0.0, isActive: true },
      { playerId: 'te34', playerName: 'Charlie Kolar', actualRank: 34, fantasyPoints: 0.0, isActive: true },
      { playerId: 'te35', playerName: 'Jalen Wydermyer', actualRank: 35, fantasyPoints: 0.0, isActive: true },
      { playerId: 'te36', playerName: 'James Mitchell', actualRank: 36, fantasyPoints: 0.0, isActive: true },
    ]
  };

  return mockData[position] || mockData.QB;
} 