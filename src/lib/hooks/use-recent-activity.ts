'use client';
import { useState, useEffect } from 'react';
import { useSupabase } from './use-supabase';
import { getCurrentSeasonInfo, isWeekComplete } from '@/lib/utils/season';

export interface RecentRanking {
  id: string;
  name: string;
  accuracy: number | null;
  trend: 'up' | 'down' | 'same';
  date: string;
  position: string;
  status: 'active' | 'completed';
  week: string;
  type: 'weekly' | 'preseason';
}

export function useRecentActivity() {
  const [recentRankings, setRecentRankings] = useState<RecentRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase();

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRecentRankings([]);
        return;
      }

      const { data: rankings, error: rankingsError } = await supabase
        .from('rankings')
        .select('*')
        .eq('user_id', user.id)
        .not('position', 'like', 'AGG_%') // Exclude aggregate rankings
        .order('updated_at', { ascending: false })
        .limit(6);

      if (rankingsError) {
        console.error('Error fetching recent rankings:', rankingsError);
        setError('Failed to load recent activity');
        return;
      }

      const seasonInfo = getCurrentSeasonInfo();
      const currentWeek = seasonInfo.currentWeek || 1;

      const formattedRankings = rankings?.map((ranking: any) => {
        // Determine if this ranking is active or completed
        let isActive = false;
        
        if (ranking.type === 'preseason') {
          // Preseason rankings are always active until regular season starts
          isActive = seasonInfo.isPreSeason;
        } else if (ranking.type === 'weekly') {
          // Weekly rankings are active if the week hasn't completed yet
          isActive = !isWeekComplete(ranking.week);
        }
        
        // Use updated_at if available, otherwise fall back to created_at
        const dateToUse = ranking.updated_at || ranking.created_at;
        
        return {
          id: ranking.id,
          name: ranking.title, // Use the actual title from database which includes scoring format
          accuracy: isActive ? null : ranking.accuracy_score, // Use real accuracy score if available
          trend: 'same', // We'll implement trend calculation later
          date: formatRelativeTime(dateToUse),
          position: ranking.position,
          status: isActive ? 'active' : 'completed',
          week: ranking.type === 'preseason' ? 'preseason' : `week${ranking.week}`,
          type: ranking.type
        } as RecentRanking;
      }) || [];

      setRecentRankings(formattedRankings);
      setError(null);
    } catch (err) {
      console.error('Error in fetchRecentActivity:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recent activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, [supabase]);

  const formatRelativeTime = (dateString: string): string => {
    if (!dateString) {
      return 'Recently';
    }
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Recently';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 7) {
      return date.toLocaleDateString();
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };

  return {
    recentRankings,
    loading,
    error,
    refetch: fetchRecentActivity
  };
} 