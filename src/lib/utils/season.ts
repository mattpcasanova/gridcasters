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
  
  // NFL season typically starts in early September and ends in early January
  // Pre-season starts in August, regular season in September
  const seasonStartDate = new Date(currentYear, 8, 5); // September 5th (approximate)
  const seasonEndDate = new Date(currentYear + 1, 0, 15); // January 15th next year (approximate)
  
  // If we're past January, we're in the next season's pre-season period
  const season = now.getMonth() >= 8 || now.getMonth() <= 1 ? currentYear : currentYear - 1;
  
  const isPreSeason = now < seasonStartDate;
  const isPostSeason = now > seasonEndDate;
  const isRegularSeason = !isPreSeason && !isPostSeason;
  
  // Calculate current week (1-18 for regular season)
  let currentWeek: number | null = null;
  if (isRegularSeason) {
    const weeksSinceStart = Math.floor((now.getTime() - seasonStartDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    currentWeek = Math.min(Math.max(weeksSinceStart + 1, 1), 18);
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
    isCurrent: seasonInfo.isPreSeason,
    isFuture: false
  });
  
  // Add weekly options
  for (let week = 1; week <= 18; week++) {
    const isCurrent = seasonInfo.currentWeek === week;
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