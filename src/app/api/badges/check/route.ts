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

    // Get current user stats
    const userStats = await getUserStats(supabase, user.id);
    
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

async function getUserStats(supabase: any, userId: string): Promise<UserStats> {
  // Get total rankings
  const { count: totalRankings } = await supabase
    .from('rankings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get rankings by position
  const { data: rankingsByPosition } = await supabase
    .from('rankings')
    .select('position')
    .eq('user_id', userId);

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

  // Get actual percentile data
  const { data: percentileStats } = await supabase.rpc('get_user_percentile_stats', {
    user_uuid: userId
  });

  const stats = percentileStats?.[0] || {
    total_rankings: 0,
    avg_percentile: 0,
    top_10_percentile_count: 0,
    top_25_percentile_count: 0,
    top_50_percentile_count: 0,
    best_percentile: 0,
    recent_percentile_trend: 0
  };

  const topPercentileRankings = stats.top_10_percentile_count || 0;
  const consecutiveTopPercentile = Math.min(stats.top_10_percentile_count || 0, 3); // Simplified for now

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
    isBetaTester: true, // Mock - would be based on user data
    isFoundingMember: daysSinceJoined > 365, // Mock - would be based on user data
  };
} 