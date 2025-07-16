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
  rankingsByPosition: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
  };
  topPercentileRankings: number;
  consecutiveTopPercentile: number;
  followers: number;
  groupsJoined: number;
  groupsCreated: number;
  daysSinceJoined: number;
  isVerified: boolean;
  isBetaTester: boolean;
  isFoundingMember: boolean;
}

// Badge earning logic
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

      // Performance Badges (simplified - would need actual percentile data)
      case 'rising_forecaster':
        progress = currentStats.topPercentileRankings >= 1 ? 100 : 0;
        earned = currentStats.topPercentileRankings >= 1;
        break;
      case 'top_performer':
        progress = currentStats.topPercentileRankings >= 3 ? 100 : 0;
        earned = currentStats.topPercentileRankings >= 3;
        break;
      case 'super_forecaster':
        progress = currentStats.topPercentileRankings >= 5 ? 100 : 0;
        earned = currentStats.topPercentileRankings >= 5;
        break;
      case 'grid_genius':
        progress = currentStats.topPercentileRankings >= 10 ? 100 : 0;
        earned = currentStats.topPercentileRankings >= 10;
        break;

      // Consistency Badges
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

      // Position Badges
      case 'qb_whisperer':
        progress = Math.min(100, (currentStats.rankingsByPosition.QB / 3) * 100);
        earned = currentStats.rankingsByPosition.QB >= 3;
        break;
      case 'rb_oracle':
        progress = Math.min(100, (currentStats.rankingsByPosition.RB / 3) * 100);
        earned = currentStats.rankingsByPosition.RB >= 3;
        break;
      case 'wr_savant':
        progress = Math.min(100, (currentStats.rankingsByPosition.WR / 3) * 100);
        earned = currentStats.rankingsByPosition.WR >= 3;
        break;
      case 'te_expert':
        progress = Math.min(100, (currentStats.rankingsByPosition.TE / 3) * 100);
        earned = currentStats.rankingsByPosition.TE >= 3;
        break;

      // Special Badges
      case 'expert_analyst':
        progress = currentStats.isVerified ? 100 : 0;
        earned = currentStats.isVerified;
        break;
      case 'beta_tester':
        progress = currentStats.isBetaTester ? 100 : 0;
        earned = currentStats.isBetaTester;
        break;
      case 'founding_forecaster':
        progress = currentStats.isFoundingMember ? 100 : 0;
        earned = currentStats.isFoundingMember;
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
    // For now, only show notification if badge wasn't previously earned
    // This prevents spam until the migration is run
    if (earned && !wasEarned) {
      newlyEarned.push(badge);
      // Mark notification as shown
      newProgress[badge.id].notification_shown = true;
    }
  });

  return { newProgress, newlyEarned };
};

// Toast notification for newly earned badges
export const showBadgeEarnedToast = (badge: Badge) => {
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
    // For now, we'll use mock data
    const mockStats: UserStats = {
      totalRankings: 25,
      rankingsByPosition: { QB: 5, RB: 8, WR: 7, TE: 5 },
      topPercentileRankings: 3,
      consecutiveTopPercentile: 2,
      followers: 45,
      groupsJoined: 1,
      groupsCreated: 0,
      daysSinceJoined: 30,
      isVerified: false,
      isBetaTester: true,
      isFoundingMember: false,
    };

    const mockProgress: BadgeProgress = {
      rookie_forecaster: { earned: true, progress: 100, lastChecked: Date.now(), notification_shown: true },
      active_forecaster: { earned: true, progress: 100, lastChecked: Date.now(), notification_shown: true },
      // ... other badges
    };

    const { newProgress, newlyEarned } = checkBadgeEarning(mockStats, mockProgress, userId);

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