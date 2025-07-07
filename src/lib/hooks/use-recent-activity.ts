'use client';
import { useState, useEffect } from 'react';
import { useSupabase } from './use-supabase';

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
        .order('updated_at', { ascending: false })
        .limit(6);

      if (rankingsError) {
        console.error('Error fetching recent rankings:', rankingsError);
        setError('Failed to load recent activity');
        return;
      }

      const formattedRankings = rankings?.map((ranking: any) => {
        const isCurrentWeek = ranking.week === 8; // This should be dynamic based on current week
        const weekLabel = ranking.type === 'preseason' ? 'Pre-Season' : `Week ${ranking.week}`;
        
        return {
          id: ranking.id,
          name: `${weekLabel} ${ranking.position} Rankings`,
          accuracy: isCurrentWeek ? null : Math.floor(Math.random() * 20) + 80, // Mock accuracy for completed weeks
          trend: Math.random() > 0.5 ? 'up' : 'down',
          date: formatRelativeTime(ranking.updated_at),
          position: ranking.position,
          status: isCurrentWeek ? 'active' : 'completed',
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
    const date = new Date(dateString);
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