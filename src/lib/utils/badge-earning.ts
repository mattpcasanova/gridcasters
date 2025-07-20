import { toast } from 'sonner';
import { BADGES, type Badge } from '@/lib/constants/badges';
import Image from 'next/image';

export interface BadgeProgress {
  [badgeId: string]: {
    earned: boolean;
    progress: number;
    lastChecked: number;
    notification_shown: boolean;
  };
}

export interface UserStats {
  totalRankings: number;
  rankingsByPosition: { QB: number; RB: number; WR: number; TE: number };
  topPercentileRankings: number; // Rankings in top 10th percentile
  consecutiveTopPercentile: number; // Consecutive top percentile rankings
  followers: number;
  groupsJoined: number;
  groupsCreated: number;
  daysSinceJoined: number;
  isVerified: boolean;
  isBetaTester: boolean;
  isFoundingMember: boolean;
  // New fields for percentile-based badges
  percentileRankings: {
    [position: string]: {
      total: number;
      top10: number; // Top 10th percentile
      top5: number;  // Top 5th percentile
      top1: number;  // Top 1st percentile
    };
  };
  weeklyPerformance: {
    [week: string]: {
      totalRankings: number;
      topPercentileCount: number;
    };
  };
  seasonPerformance: {
    totalRankings: number;
    averagePercentile: number;
    topPercentileCount: number;
  };
}

// Badge earning logic with real percentile data
export const checkBadgeEarning = (
  currentStats: UserStats,
  previousProgress: BadgeProgress,
  userId: string
): { newProgress: BadgeProgress; newlyEarned: Badge[] } => {
  const newProgress: BadgeProgress = { ...previousProgress };
  const newlyEarned: Badge[] = [];

  BADGES.forEach(badge => {
    const current = newProgress[badge.id] || { earned: false, progress: 0, lastChecked: 0 };
    const wasEarned = current.earned;
    
    // Calculate current progress based on badge requirements
    let progress = 0;
    let earned = false;

    switch (badge.id) {
      // Ranking Creation Badges
      case 'rookie_forecaster':
        progress = Math.min(100, (currentStats.totalRankings / 1) * 100);
        earned = currentStats.totalRankings >= 1;
        break;
      case 'active_forecaster':
        progress = Math.min(100, (currentStats.totalRankings / 20) * 100);
        earned = currentStats.totalRankings >= 20;
        break;
      case 'seasoned_forecaster':
        progress = Math.min(100, (currentStats.totalRankings / 50) * 100);
        earned = currentStats.totalRankings >= 50;
        break;
      case 'elite_forecaster':
        progress = Math.min(100, (currentStats.totalRankings / 100) * 100);
        earned = currentStats.totalRankings >= 100;
        break;

      // Performance Badges - Now using real percentile data
      case 'rising_forecaster':
        const top20Count = Object.values(currentStats.percentileRankings || {})
          .reduce((sum, pos) => sum + pos.total, 0);
        progress = Math.min(100, (top20Count / 5) * 100); // Need 5 top 20th percentile rankings
        earned = top20Count >= 5;
        break;
      case 'top_performer':
        const top10Count = Object.values(currentStats.percentileRankings || {})
          .reduce((sum, pos) => sum + pos.top10, 0);
        progress = Math.min(100, (top10Count / 3) * 100); // Need 3 top 10th percentile rankings
        earned = top10Count >= 3;
        break;
      case 'super_forecaster':
        const top5Count = Object.values(currentStats.percentileRankings || {})
          .reduce((sum, pos) => sum + pos.top5, 0);
        progress = Math.min(100, (top5Count / 2) * 100); // Need 2 top 5th percentile rankings
        earned = top5Count >= 2;
        break;
      case 'grid_genius':
        const top1Count = Object.values(currentStats.percentileRankings || {})
          .reduce((sum, pos) => sum + pos.top1, 0);
        progress = Math.min(100, (top1Count / 1) * 100); // Need 1 top 1st percentile ranking
        earned = top1Count >= 1;
        break;

      // Consistency Badges - Using consecutive top percentile performance
      case 'steady_eddie':
        progress = Math.min(100, (currentStats.consecutiveTopPercentile / 3) * 100);
        earned = currentStats.consecutiveTopPercentile >= 3;
        break;
      case 'consistency_king':
        progress = Math.min(100, (currentStats.consecutiveTopPercentile / 5) * 100);
        earned = currentStats.consecutiveTopPercentile >= 5;
        break;
      case 'reliability_master':
        progress = Math.min(100, (currentStats.consecutiveTopPercentile / 10) * 100);
        earned = currentStats.consecutiveTopPercentile >= 10;
        break;
      case 'forecasting_machine':
        progress = Math.min(100, (currentStats.consecutiveTopPercentile / 20) * 100);
        earned = currentStats.consecutiveTopPercentile >= 20;
        break;

      // Social Badges
      case 'team_player':
        progress = currentStats.groupsJoined >= 1 ? 100 : 0;
        earned = currentStats.groupsJoined >= 1;
        break;
      case 'group_leader':
        progress = Math.min(100, (currentStats.groupsCreated / 1) * 100);
        earned = currentStats.groupsCreated >= 1;
        break;
      case 'influencer':
        progress = Math.min(100, (currentStats.followers / 100) * 100);
        earned = currentStats.followers >= 100;
        break;
      case 'grid_celebrity':
        progress = Math.min(100, (currentStats.followers / 500) * 100);
        earned = currentStats.followers >= 500;
        break;

      // Position Badges - Using position-specific percentile data
      case 'qb_whisperer':
        const qbTop10 = currentStats.percentileRankings.QB?.top10 || 0;
        progress = Math.min(100, (qbTop10 / 3) * 100);
        earned = qbTop10 >= 3;
        break;
      case 'rb_oracle':
        const rbTop10 = currentStats.percentileRankings.RB?.top10 || 0;
        progress = Math.min(100, (rbTop10 / 3) * 100);
        earned = rbTop10 >= 3;
        break;
      case 'wr_savant':
        const wrTop10 = currentStats.percentileRankings.WR?.top10 || 0;
        progress = Math.min(100, (wrTop10 / 3) * 100);
        earned = wrTop10 >= 3;
        break;
      case 'te_expert':
        const teTop10 = currentStats.percentileRankings.TE?.top10 || 0;
        progress = Math.min(100, (teTop10 / 3) * 100);
        earned = teTop10 >= 3;
        break;
      case 'position_master':
        const allPositionsTop10 = ['QB', 'RB', 'WR', 'TE'].every(pos => 
          (currentStats.percentileRankings[pos]?.top10 || 0) >= 3
        );
        progress = allPositionsTop10 ? 100 : 0;
        earned = allPositionsTop10;
        break;

      // Special Badges
      case 'expert_analyst':
        progress = currentStats.isVerified ? 100 : 0;
        earned = currentStats.isVerified;
        break;
      case 'founding_forecaster':
        progress = currentStats.isFoundingMember ? 100 : 0;
        earned = currentStats.isFoundingMember;
        break;

      // Seasonal Badges - Using weekly performance data
      case 'week_1_prophet':
        const week1Performance = currentStats.weeklyPerformance['1'];
        if (week1Performance) {
          const week1Percentile = week1Performance.topPercentileCount / week1Performance.totalRankings;
          progress = Math.min(100, (week1Percentile / 0.85) * 100); // Top 15th percentile
          earned = week1Percentile >= 0.85;
        }
        break;
      case 'playoff_predictor':
        const playoffWeeks = ['18', '19', '20', '21']; // Playoff weeks
        const playoffPerformance = playoffWeeks.reduce((sum, week) => {
          const weekData = currentStats.weeklyPerformance[week];
          return sum + (weekData?.topPercentileCount || 0);
        }, 0);
        const playoffTotal = playoffWeeks.reduce((sum, week) => {
          const weekData = currentStats.weeklyPerformance[week];
          return sum + (weekData?.totalRankings || 0);
        }, 0);
        if (playoffTotal > 0) {
          const playoffPercentile = playoffPerformance / playoffTotal;
          progress = Math.min(100, (playoffPercentile / 0.90) * 100); // Top 10th percentile
          earned = playoffPercentile >= 0.90;
        }
        break;
      case 'season_sage':
        const seasonPercentile = currentStats.seasonPerformance.averagePercentile;
        progress = Math.min(100, (seasonPercentile / 95) * 100); // Top 5th percentile
        earned = seasonPercentile >= 95;
        break;

      // Milestone Badges
      case 'perfect_prophet':
        const top1Total = Object.values(currentStats.percentileRankings || {})
          .reduce((sum, pos) => sum + pos.top1, 0);
        progress = Math.min(100, (top1Total / 1) * 100);
        earned = top1Total >= 1;
        break;
      case 'triple_threat':
        const differentTypes = ['QB', 'RB', 'WR', 'TE'].filter(pos => 
          (currentStats.percentileRankings[pos]?.top10 || 0) >= 3
        ).length;
        progress = Math.min(100, (differentTypes / 3) * 100);
        earned = differentTypes >= 3;
        break;
      case 'gridcasters_veteran':
        const daysAndRankings = currentStats.daysSinceJoined >= 365 && currentStats.totalRankings >= 50;
        progress = daysAndRankings ? 100 : 0;
        earned = daysAndRankings;
        break;

      // Default case for badges not yet implemented
      default:
        progress = current.progress;
        earned = current.earned;
        break;
    }

    // Update progress
    newProgress[badge.id] = {
      earned,
      progress: Math.round(progress),
      lastChecked: Date.now(),
      notification_shown: current.notification_shown || false
    };

    // Check if newly earned and notification hasn't been shown
    if (earned && !wasEarned && !current.notification_shown) {
      newlyEarned.push(badge);
      // Mark notification as shown
      newProgress[badge.id].notification_shown = true;
    }
  });

  return { newProgress, newlyEarned };
};

// Toast notification for newly earned badges
export const showBadgeEarnedToast = (badge: Badge) => {
  // Check if we've already shown this badge notification in this session
  const shownBadges = JSON.parse(localStorage.getItem('shownBadgeNotifications') || '[]');
  if (shownBadges.includes(badge.id)) {
    return; // Already shown this badge notification
  }

  // Add to shown badges and save to localStorage
  shownBadges.push(badge.id);
  localStorage.setItem('shownBadgeNotifications', JSON.stringify(shownBadges));

  toast.success(
    `Congrats on earning ${badge.name} badge! To see more go to the achievements tab in Profile page`,
    {
      duration: 5000,
      position: 'top-right',
      style: {
        minWidth: '400px',
      },
      description: `🏆 You've earned the ${badge.name} badge!`,
    }
  );
};

// Hook to check for badge earning
export const useBadgeEarning = () => {
  const checkAndUpdateBadges = async (userId: string) => {
    // This would fetch current user stats and badge progress from the database
    // For now, return empty results until real data is available
    const emptyStats: UserStats = {
      totalRankings: 0,
      rankingsByPosition: { QB: 0, RB: 0, WR: 0, TE: 0 },
      topPercentileRankings: 0,
      consecutiveTopPercentile: 0,
      followers: 0,
      groupsJoined: 0,
      groupsCreated: 0,
      daysSinceJoined: 0,
      isVerified: false,
      isBetaTester: false,
      isFoundingMember: false,
      percentileRankings: {
        QB: { total: 0, top10: 0, top5: 0, top1: 0 },
        RB: { total: 0, top10: 0, top5: 0, top1: 0 },
        WR: { total: 0, top10: 0, top5: 0, top1: 0 },
        TE: { total: 0, top10: 0, top5: 0, top1: 0 },
      },
      weeklyPerformance: {},
      seasonPerformance: {
        totalRankings: 0,
        averagePercentile: 0,
        topPercentileCount: 0,
      },
    };

    const emptyProgress: BadgeProgress = {};

    const { newProgress, newlyEarned } = checkBadgeEarning(emptyStats, emptyProgress, userId);

    // Show toasts for newly earned badges
    newlyEarned.forEach(badge => {
      showBadgeEarnedToast(badge);
    });

    // Here you would save the new progress to the database
    // await saveBadgeProgress(userId, newProgress);

    return { newProgress, newlyEarned };
  };

  return { checkAndUpdateBadges };
}; 