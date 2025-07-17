export interface SeasonInfo {
  season: number;
  isPreSeason: boolean;
  isRegularSeason: boolean;
  isPostSeason: boolean;
  currentWeek: number | null;
  seasonStartDate: Date;
  seasonEndDate: Date;
}

export function getCurrentSeasonInfo(): SeasonInfo {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // 2025 NFL Season Schedule (approximate dates)
  // Week 1: September 4-8, 2025 (Thursday to Monday)
  // Week 2: September 11-15, 2025
  // Week 3: September 18-22, 2025
  // ... and so on
  
  const season = 2025;
  
  // Define key dates for the 2025 season
  const week1Start = new Date(2025, 8, 4); // September 4, 2025 (Thursday)
  const week1End = new Date(2025, 8, 8, 23, 59, 59); // September 8, 2025 (Monday Night Football ends)
  const seasonStartDate = week1Start;
  const seasonEndDate = new Date(2026, 0, 15); // January 15, 2026 (approximate)
  
  const isPreSeason = now < seasonStartDate;
  const isPostSeason = now > seasonEndDate;
  const isRegularSeason = !isPreSeason && !isPostSeason;
  
  // Calculate current week (1-18 for regular season)
  let currentWeek: number | null = null;
  if (isRegularSeason) {
    // Week 1 is special - it's current until Monday Night Football ends
    if (now <= week1End) {
      currentWeek = 1;
    } else {
      // For subsequent weeks, calculate based on time since Week 1 ended
      const weeksSinceWeek1 = Math.floor((now.getTime() - week1End.getTime()) / (7 * 24 * 60 * 60 * 1000));
      currentWeek = Math.min(Math.max(weeksSinceWeek1 + 2, 2), 18); // +2 because we're starting from Week 2
    }
  }
  
  return {
    season,
    isPreSeason,
    isRegularSeason,
    isPostSeason,
    currentWeek,
    seasonStartDate,
    seasonEndDate
  };
}

export function getDefaultRankingType(): 'preseason' | 'weekly' {
  const seasonInfo = getCurrentSeasonInfo();
  return seasonInfo.isPreSeason ? 'preseason' : 'weekly';
}

export function getDefaultWeek(hasPreseasonRankings: boolean = false): number | null {
  const seasonInfo = getCurrentSeasonInfo();
  
  // If user has saved preseason rankings and we're still in preseason, default to week 1
  if (seasonInfo.isPreSeason && hasPreseasonRankings) {
    return 1;
  }
  
  if (seasonInfo.isPreSeason) {
    return null; // Pre-season doesn't have weeks
  }
  return seasonInfo.currentWeek || 1; // Default to week 1 if season hasn't started
}

export function getAvailableWeeks(): Array<{ value: string; label: string; isCurrent: boolean; isFuture: boolean }> {
  const seasonInfo = getCurrentSeasonInfo();
  const weeks = [];
  
  // Add pre-season option
  weeks.push({
    value: 'preseason',
    label: 'Pre-Season',
    isCurrent: seasonInfo.isPreSeason, // Current during preseason
    isFuture: false
  });
  
  // Add weekly options
  for (let week = 1; week <= 18; week++) {
    // During preseason, both preseason and week 1 are "current"
    // During regular season, only the actual current week is "current"
    const isCurrent = seasonInfo.isPreSeason 
      ? week === 1 // Week 1 is also current during preseason
      : seasonInfo.currentWeek === week; // Normal current week logic during season
      
    const isFuture = seasonInfo.isRegularSeason && week > (seasonInfo.currentWeek || 0);
    
    weeks.push({
      value: week.toString(),
      label: `Week ${week}`,
      isCurrent,
      isFuture
    });
  }
  
  return weeks;
}

// Helper function to check if a specific week is complete
export function isWeekComplete(week: number): boolean {
  const seasonInfo = getCurrentSeasonInfo();
  
  if (seasonInfo.isPreSeason) {
    return false; // No weeks are complete during preseason
  }
  
  if (!seasonInfo.currentWeek) {
    return false; // Season hasn't started
  }
  
  // Week is complete if current week is greater than the specified week
  return seasonInfo.currentWeek > week;
}

// Helper function to get the most recent completed week
export function getMostRecentCompletedWeek(): number | null {
  const seasonInfo = getCurrentSeasonInfo();
  
  if (seasonInfo.isPreSeason) {
    return null; // No completed weeks during preseason
  }
  
  if (!seasonInfo.currentWeek || seasonInfo.currentWeek <= 1) {
    return null; // No completed weeks yet
  }
  
  return seasonInfo.currentWeek - 1;
} 