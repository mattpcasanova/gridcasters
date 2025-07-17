'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSupabase } from '@/lib/hooks/use-supabase';
import { getCurrentSeasonInfo, isWeekComplete, getMostRecentCompletedWeek } from '@/lib/utils/season';

type LeaderboardView = 'global' | 'friends' | `group_${string}`;

interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  accuracy: number;
  rank: number;
  avatar: string;
  followers: number;
  isCurrentUser?: boolean;
}

interface LeaderboardContextType {
  selectedView: LeaderboardView;
  setSelectedView: (view: LeaderboardView) => void;
  getViewLabel: (view: LeaderboardView) => string;
  getLeaderboardData: (view: LeaderboardView) => LeaderboardUser[];
  getUserRank: (view: LeaderboardView) => string;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [selectedView, setSelectedView] = useState<LeaderboardView>('global');
  const [leaderboardData, setLeaderboardData] = useState<Record<LeaderboardView, LeaderboardUser[]>>({
    global: [],
    friends: [],
  });
  const [userGroups, setUserGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const supabase = useSupabase();
  const seasonInfo = getCurrentSeasonInfo();
  const currentWeek = seasonInfo.currentWeek || 1;
  const isPreSeason = seasonInfo.isPreSeason;
  const mostRecentCompletedWeek = getMostRecentCompletedWeek();
  const weekForAccuracy = mostRecentCompletedWeek || currentWeek;

  // Fetch current user and their groups
  useEffect(() => {
    const fetchUserAndGroups = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setCurrentUser({ id: user.id, username: user.email?.split('@')[0] || 'user' });

        // Fetch user's groups
        const { data: groupsData } = await supabase
          .from('group_members')
          .select(`
            groups (
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'approved');

        const groups = groupsData?.map((member: any) => ({
          id: member.groups.id,
          name: member.groups.name
        })) || [];

        setUserGroups(groups);

        // Initialize leaderboard data for groups
        const groupData: Record<string, LeaderboardUser[]> = {};
        groups.forEach(group => {
          groupData[`group_${group.id}`] = [];
        });

        setLeaderboardData(prev => ({
          ...prev,
          ...groupData
        }));

      } catch (error) {
        console.error('Error fetching user and groups:', error);
      }
    };

    fetchUserAndGroups();
  }, [supabase]);

  // Fetch leaderboard data based on selected view
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!currentUser) return;

      try {
        let data: LeaderboardUser[] = [];

        if (selectedView === 'global') {
          // Fetch global leaderboard - top users by accuracy
          const { data: globalData } = await supabase
            .from('rankings')
            .select(`
              user_id,
              accuracy_score,
              profiles!inner (
                username,
                display_name,
                avatar_url
              )
            `)
            .not('accuracy_score', 'is', null)
            .eq('type', 'weekly')
            .eq('week', isPreSeason ? 1 : weekForAccuracy)
            .order('accuracy_score', { ascending: false })
            .limit(10);

          if (globalData) {
            data = globalData.map((ranking: any, index) => ({
              id: ranking.user_id,
              name: ranking.profiles.display_name || ranking.profiles.username,
              username: ranking.profiles.username,
              accuracy: ranking.accuracy_score || 0,
              rank: index + 1,
              avatar: ranking.profiles.avatar_url || '/placeholder-user.jpg',
              followers: 0, // Would need separate query for followers
              isCurrentUser: ranking.user_id === currentUser.id
            }));
          }
        } else if (selectedView === 'friends') {
          // Fetch friends leaderboard - users the current user is following
          const { data: friendsData } = await supabase
            .from('follows')
            .select(`
              following_id,
              profiles!following_id (
                username,
                display_name,
                avatar_url
              )
            `)
            .eq('follower_id', currentUser.id);

          if (friendsData && friendsData.length > 0) {
            const friendIds = friendsData.map(f => f.following_id);
            
            // Get rankings for friends
            const { data: friendRankings } = await supabase
              .from('rankings')
              .select(`
                user_id,
                accuracy_score,
                profiles!inner (
                  username,
                  display_name,
                  avatar_url
                )
              `)
              .in('user_id', friendIds)
              .not('accuracy_score', 'is', null)
              .eq('type', 'weekly')
              .eq('week', isPreSeason ? 1 : weekForAccuracy)
              .order('accuracy_score', { ascending: false });

            if (friendRankings) {
              data = friendRankings.map((ranking: any, index) => ({
                id: ranking.user_id,
                name: ranking.profiles.display_name || ranking.profiles.username,
                username: ranking.profiles.username,
                accuracy: ranking.accuracy_score || 0,
                rank: index + 1,
                avatar: ranking.profiles.avatar_url || '/placeholder-user.jpg',
                followers: 0,
                isCurrentUser: ranking.user_id === currentUser.id
              }));
            }
          }
        } else if (selectedView.startsWith('group_')) {
          // Fetch group leaderboard
          const groupId = selectedView.replace('group_', '');
          
          const { data: groupMembers } = await supabase
            .from('group_members')
            .select(`
              user_id,
              profiles!inner (
                username,
                display_name,
                avatar_url
              )
            `)
            .eq('group_id', groupId)
            .eq('status', 'approved');

          if (groupMembers && groupMembers.length > 0) {
            const memberIds = groupMembers.map(m => m.user_id);
            
            // Get rankings for group members
            const { data: memberRankings } = await supabase
              .from('rankings')
              .select(`
                user_id,
                accuracy_score,
                profiles!inner (
                  username,
                  display_name,
                  avatar_url
                )
              `)
              .in('user_id', memberIds)
              .not('accuracy_score', 'is', null)
              .eq('type', 'weekly')
              .eq('week', isPreSeason ? 1 : weekForAccuracy)
              .order('accuracy_score', { ascending: false });

            if (memberRankings) {
              data = memberRankings.map((ranking: any, index) => ({
                id: ranking.user_id,
                name: ranking.profiles.display_name || ranking.profiles.username,
                username: ranking.profiles.username,
                accuracy: ranking.accuracy_score || 0,
                rank: index + 1,
                avatar: ranking.profiles.avatar_url || '/placeholder-user.jpg',
                followers: 0,
                isCurrentUser: ranking.user_id === currentUser.id
              }));
            }
          }
        }

        // If no real data available (preseason or no rankings), show placeholder
        if (data.length === 0) {
          data = [
            {
              id: currentUser.id,
              name: 'You',
              username: currentUser.username,
              accuracy: 0,
              rank: 1,
              avatar: '/placeholder-user.jpg',
              followers: 0,
              isCurrentUser: true
            }
          ];
        }

        setLeaderboardData(prev => ({
          ...prev,
          [selectedView]: data
        }));

      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, [selectedView, currentUser, supabase, weekForAccuracy, isPreSeason]);

  const getViewLabel = (view: LeaderboardView): string => {
    if (view === 'global') return 'Global Rankings';
    if (view === 'friends') return 'Friends Only';
    if (view.startsWith('group_')) {
      const groupId = view.replace('group_', '');
      const group = userGroups.find(g => g.id === groupId);
      return group ? group.name : 'Group';
    }
    return 'Unknown View';
  };

  const getLeaderboardData = (view: LeaderboardView): LeaderboardUser[] => {
    return leaderboardData[view] || [];
  };

  const getUserRank = (view: LeaderboardView): string => {
    if (!currentUser) return '--';
    
    const data = getLeaderboardData(view);
    const userEntry = data.find(user => user.isCurrentUser);
    
    if (isPreSeason) return '--';
    if (!userEntry) return '--';
    
    return userEntry.rank.toString();
  };

  return (
    <LeaderboardContext.Provider value={{
      selectedView,
      setSelectedView,
      getViewLabel,
      getLeaderboardData,
      getUserRank
    }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
} 