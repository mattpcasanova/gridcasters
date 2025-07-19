import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { checkBadgeEarning, type UserStats, type BadgeProgress } from '@/lib/utils/badge-earning';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user stats with real percentile data
    const userStats = await getUserStatsWithPercentiles(supabase, user.id);
    
    // Get current badge progress
    const { data: badgeProgressData } = await supabase
      .from('badge_progress')
      .select('badge_id, earned, progress, last_checked')
      .eq('user_id', user.id);

    // Convert to BadgeProgress format
    const currentProgress: BadgeProgress = {};
    badgeProgressData?.forEach((bp: any) => {
      currentProgress[bp.badge_id] = {
        earned: bp.earned,
        progress: bp.progress,
        lastChecked: new Date(bp.last_checked).getTime(),
        notification_shown: bp.earned // Assume earned badges have been shown
      };
    });

    // Check for new badges
    const { newProgress, newlyEarned } = checkBadgeEarning(userStats, currentProgress, user.id);

    // Update badge progress in database
    const updates = Object.entries(newProgress).map(([badgeId, progress]) => ({
      user_id: user.id,
      badge_id: badgeId,
      earned: progress.earned,
      progress: progress.progress
      // notification_shown will be added after migration runs successfully
    }));

    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('badge_progress')
        .upsert(updates, { onConflict: 'user_id,badge_id' });

      if (updateError) {
        console.error('Error updating badge progress:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      newlyEarned: newlyEarned.map(badge => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon
      })),
      totalEarned: Object.values(newProgress).filter(p => p.earned).length
    });

  } catch (error) {
    console.error('Error checking badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getUserStatsWithPercentiles(supabase: any, userId: string): Promise<UserStats> {
  // Get total rankings (excluding aggregate rankings)
  const { count: totalRankings } = await supabase
    .from('rankings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('position', 'like', 'AGG_%');

  // Get rankings by position (excluding aggregate rankings)
  const { data: rankingsByPosition } = await supabase
    .from('rankings')
    .select('position')
    .eq('user_id', userId)
    .not('position', 'like', 'AGG_%');

  const positionCounts = { QB: 0, RB: 0, WR: 0, TE: 0 };
  rankingsByPosition?.forEach((r: any) => {
    if (r.position in positionCounts) {
      positionCounts[r.position as keyof typeof positionCounts]++;
    }
  });

  // Get followers count
  const { count: followers } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  // Get groups joined
  const { count: groupsJoined } = await supabase
    .from('group_members')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'approved');

  // Get groups created
  const { count: groupsCreated } = await supabase
    .from('groups')
    .select('*', { count: 'exact', head: true })
    .eq('host_id', userId);

  // Get user profile for additional info
  const { data: profile } = await supabase
    .from('profiles')
    .select('created_at, is_verified')
    .eq('id', userId)
    .single();

  // Calculate days since joined
  const daysSinceJoined = profile?.created_at 
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Determine founding member status (first 250 users)
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const isFoundingMember = totalUsers ? totalUsers <= 250 : false;

  // Get percentile data for all user rankings
  const { data: percentileData } = await supabase
    .from('rankings')
    .select(`
      id,
      position,
      week,
      season,
      accuracy_score,
      percentile_rank
    `)
    .eq('user_id', userId)
    .not('position', 'like', 'AGG_%')
    .not('percentile_rank', 'is', null);

  // Calculate percentile-based stats
  const percentileRankings: { [position: string]: { total: number; top10: number; top5: number; top1: number } } = {
    QB: { total: 0, top10: 0, top5: 0, top1: 0 },
    RB: { total: 0, top10: 0, top5: 0, top1: 0 },
    WR: { total: 0, top10: 0, top5: 0, top1: 0 },
    TE: { total: 0, top10: 0, top5: 0, top1: 0 }
  };

  const weeklyPerformance: { [week: string]: { totalRankings: number; topPercentileCount: number } } = {};
  let consecutiveTopPercentile = 0;
  let topPercentileRankings = 0;

  // Process percentile data
  percentileData?.forEach((ranking: any) => {
    const percentile = ranking.percentile_rank;
    const position = ranking.position;
    const week = ranking.week?.toString() || 'preseason';

    // Count by position
    if (position in percentileRankings) {
      percentileRankings[position].total++;
      if (percentile >= 90) percentileRankings[position].top10++;
      if (percentile >= 95) percentileRankings[position].top5++;
      if (percentile >= 99) percentileRankings[position].top1++;
    }

    // Count by week
    if (!weeklyPerformance[week]) {
      weeklyPerformance[week] = { totalRankings: 0, topPercentileCount: 0 };
    }
    weeklyPerformance[week].totalRankings++;
    if (percentile >= 90) {
      weeklyPerformance[week].topPercentileCount++;
      topPercentileRankings++;
    }

    // Track consecutive top percentile (simplified - would need more complex logic for true consecutive)
    if (percentile >= 90) {
      consecutiveTopPercentile++;
    } else {
      consecutiveTopPercentile = 0;
    }
  });

  // Calculate season performance
  const totalRankingsWithPercentiles = percentileData?.length || 0;
  const averagePercentile = totalRankingsWithPercentiles > 0 
    ? percentileData?.reduce((sum: number, r: any) => sum + (r.percentile_rank || 0), 0) / totalRankingsWithPercentiles
    : 0;

  const seasonPerformance = {
    totalRankings: totalRankingsWithPercentiles,
    averagePercentile,
    topPercentileCount: topPercentileRankings
  };

  return {
    totalRankings: totalRankings || 0,
    rankingsByPosition: positionCounts,
    topPercentileRankings,
    consecutiveTopPercentile,
    followers: followers || 0,
    groupsJoined: groupsJoined || 0,
    groupsCreated: groupsCreated || 0,
    daysSinceJoined,
    isVerified: profile?.is_verified || false,
    isBetaTester: false, // Removed beta tester badge
    isFoundingMember,
    percentileRankings,
    weeklyPerformance,
    seasonPerformance
  };
} 