"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { GradientLoading } from "@/components/ui/gradient-loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchInput } from "@/components/ui/search-input"
import { StatCard } from "@/components/ui/stat-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Trophy, Medal, Award, TrendingUp, Users, Target, Plus, UserCheck, UserPlus, Star, Calendar, Crown, Lock } from "lucide-react"
import Link from "next/link"
import { useHeaderButtons } from "@/components/layout/root-layout-client"
import { useLeaderboard } from "@/lib/contexts/leaderboard-context"
import { getCurrentSeasonInfo, isWeekComplete } from "@/lib/utils/season"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"

interface LeaderboardUser {
  id: string;
  rank: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  accuracy: number;
  rankings: number;
  followers: number;
  isFollowing: boolean;
  isCurrentUser?: boolean;
  weeklyAccuracy?: number;
  weeklyRank?: number;
  change?: number;
  weeklyChange?: number; // Added for weekly change
}

interface GroupData {
  id: string;
  name: string;
  members: number;
  avgAccuracy: number;
  avatar: string;
  userRank?: number;
  isJoined?: boolean;
  isPrivate?: boolean;
}




export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("overall")
  const [searchTerm, setSearchTerm] = useState("")
  const [pprType, setPprType] = useState("combined")
  const [selectedWeek, setSelectedWeek] = useState("Week 1")
  const { selectedView, setSelectedView, getViewLabel, getUserRank, userGroups } = useLeaderboard()
  
  // Handle tab parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && ['overall', 'weekly', 'friends', 'groups'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])
  
  // Get current season info and default to current week
  const seasonInfo = getCurrentSeasonInfo()
  const currentWeek = seasonInfo.currentWeek || 1
  const isPreSeason = seasonInfo.isPreSeason

  // Get total rankings based on PPR type
  const getTotalRankings = (type: string) => {
    // Sum all users' rankings to get total cumulative count
    const totalRankings = leaderboardData.reduce((sum, user) => {
      console.log(`User ${user.user.name}: ${user.rankings} rankings, running total: ${sum + user.rankings}`)
      return sum + user.rankings
    }, 0)
    console.log(`Final total rankings: ${totalRankings}`)
    return totalRankings
  }

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [searchResults, setSearchResults] = useState<LeaderboardUser[]>([])
  const [groups, setGroups] = useState<GroupData[]>([])
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const { setRightButtons } = useHeaderButtons()
  const supabase = useSupabase()

  // Fetch top 10 users for leaderboard
  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        // Get current user first
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log('No authenticated user found')
          return
        }
        setCurrentUserId(user.id)

        // Fetch top 10 users by accuracy score (or by creation date if no accuracy yet)
        const { data: topUsers, error } = await supabase
          .from('rankings')
          .select(`
            user_id,
            accuracy_score,
            profiles!inner (
              id,
              username,
              display_name,
              avatar_url,
              is_verified,
              created_at
            )
          `)
          .not('accuracy_score', 'is', null)
          .order('accuracy_score', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Error fetching top users:', error)
          return
        }

        // Transform to leaderboard format
        const leaderboardUsers: LeaderboardUser[] = topUsers.map((ranking, index) => {
          const profile = ranking.profiles as any; // Type assertion for now
          return {
            id: ranking.user_id,
            rank: index + 1,
            user: {
              name: profile.display_name || profile.username,
              username: profile.username,
              avatar: profile.avatar_url || "/placeholder-user.jpg",
              verified: profile.is_verified || false,
            },
            accuracy: ranking.accuracy_score || 0,
            rankings: 0, // Will be fetched separately
            followers: 0, // Will be fetched separately
            isFollowing: false, // Will be checked separately
            isCurrentUser: ranking.user_id === user.id,
            weeklyAccuracy: 0,
            weeklyRank: 0,
            change: 0,
            weeklyChange: 0,
          };
        })

        // Get follow status for top users
        const { data: followData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id)

        const followingIds = new Set(followData?.map(f => f.following_id) || [])

        // Update follow status
        const updatedUsers = leaderboardUsers.map(user => ({
          ...user,
          isFollowing: followingIds.has(user.id)
        }))

        setLeaderboardData(updatedUsers)
      } catch (error) {
        console.error('Error fetching top users:', error)
      }
    }

    fetchTopUsers()
  }, [supabase])

  // Fetch ranking counts, follower counts, and accuracy scores
  useEffect(() => {
    const fetchUserStats = async () => {
      if (leaderboardData.length === 0) return

      try {
        // Get ranking counts for each user
        const { data: rankingCounts, error: rankingError } = await supabase
          .from('rankings')
          .select('user_id, id')
          .eq('is_active', true)

        if (rankingError) {
          console.error('Error fetching ranking counts:', rankingError)
          return
        }

        // Count rankings per user
        const userRankingCounts = new Map<string, number>()
        rankingCounts?.forEach(ranking => {
          const count = userRankingCounts.get(ranking.user_id) || 0
          userRankingCounts.set(ranking.user_id, count + 1)
        })

        // Get follower counts for each user
        const { data: followerCounts, error: followerError } = await supabase
          .from('follows')
          .select('following_id')

        if (followerError) {
          console.error('Error fetching follower counts:', followerError)
          return
        }

        // Count followers per user
        const userFollowerCounts = new Map<string, number>()
        followerCounts?.forEach(follow => {
          const count = userFollowerCounts.get(follow.following_id) || 0
          userFollowerCounts.set(follow.following_id, count + 1)
        })

        // Update leaderboard data with real stats
        setLeaderboardData(prevData => 
          prevData.map(user => ({
            ...user,
            rankings: userRankingCounts.get(user.id) || 0,
            followers: userFollowerCounts.get(user.id) || 0,
          }))
        )

      } catch (error) {
        console.error('Error fetching user stats:', error)
      }
    }

    fetchUserStats()
  }, [leaderboardData.length, supabase])

  const currentUser = leaderboardData.find((user: LeaderboardUser) => user.isCurrentUser)
  const friendsData = leaderboardData.filter((user: LeaderboardUser) => user.isFollowing || user.isCurrentUser)

  // Search function to fetch users by name or username
  const searchUsers = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Search profiles by name or username
      const { data: searchData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          avatar_url,
          is_verified,
          created_at
        `)
        .or(`display_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .limit(20)

      if (error) {
        console.error('Error searching users:', error)
        return
      }

      // Get follow status for search results
      const { data: followData } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id)

      const followingIds = new Set(followData?.map(f => f.following_id) || [])

      // Transform search results
      const searchUsers: LeaderboardUser[] = searchData.map((profile) => ({
        id: profile.id,
        rank: 0, // Will be calculated if needed
        user: {
          name: profile.display_name || profile.username,
          username: profile.username,
          avatar: profile.avatar_url || "/placeholder-user.jpg",
          verified: profile.is_verified || false,
        },
        accuracy: 0, // Will be fetched separately if needed
        rankings: 0,
        followers: 0,
        isFollowing: followingIds.has(profile.id),
        isCurrentUser: profile.id === user.id,
        weeklyAccuracy: 0,
        weeklyRank: 0,
        change: 0,
        weeklyChange: 0,
      }))

      setSearchResults(searchUsers)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Trigger search when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchUsers(searchTerm)
      } else {
        setSearchResults([])
        setIsSearching(false)
      }
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Fetch user's groups from database
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setIsLoadingGroups(true)
        console.log('Fetching user groups...')
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log('No user found')
          return
        }
        console.log('User found:', user.id)

        // Fetch groups where user is a member
        const { data: groupMembers, error: membersError } = await supabase
          .from('group_members')
          .select(`
            group_id,
            groups (
              id,
              name,
              description,
              avatar_url,
              is_private,
              host_id
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'approved')

        console.log('Group members query result:', { groupMembers, membersError })

        if (membersError) {
          console.error('Error fetching group members:', membersError)
          return
        }

        // Transform the data to match GroupData interface
        const userGroups: GroupData[] = (groupMembers || []).map((member: any) => ({
          id: member.group_id, // Use UUID directly
          name: member.groups.name,
          members: 0, // Will be updated below
          avgAccuracy: 0, // Will be calculated later
          avatar: member.groups.avatar_url || "/logo.png",
          userRank: undefined, // Will be calculated later
          isJoined: true,
          isPrivate: member.groups.is_private
        }))

        console.log('Transformed user groups:', userGroups)

        // Get member counts for each group
        for (const group of userGroups) {
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
            .eq('status', 'approved')
          
          group.members = count || 0
          console.log(`Group ${group.name} has ${group.members} members`)
        }

        // Debug: Check if there are any groups at all
        const { data: allGroups, error: allGroupsError } = await supabase
          .from('groups')
          .select('*')
        
        console.log('All groups in database:', allGroups)
        console.log('All groups error:', allGroupsError)

        // Debug: Check if there are any group members at all
        const { data: allMembers, error: allMembersError } = await supabase
          .from('group_members')
          .select('*')
        
        console.log('All group members in database:', allMembers)
        console.log('All members error:', allMembersError)

        console.log('Final groups to set:', userGroups)
        setGroups(userGroups)
      } catch (error) {
        console.error('Error fetching user groups:', error)
        toast.error('Failed to load groups')
      } finally {
        setIsLoadingGroups(false)
      }
    }

    fetchUserGroups()
  }, [supabase])

  // Debug groups state changes
  useEffect(() => {
    console.log('Groups state changed:', groups)
    console.log('Groups length:', groups.length)
    console.log('isLoadingGroups:', isLoadingGroups)
  }, [groups, isLoadingGroups])

  // Set header buttons when component mounts
  useEffect(() => {
    setRightButtons(
      <Link href="/rankings">
        <GradientButton size="sm" icon={Plus}>
          New Ranking
        </GradientButton>
      </Link>
    )
  }, [setRightButtons])

  // Sync active tab with selected view from dashboard
  useEffect(() => {
    switch (selectedView) {
      case 'global':
        setActiveTab('overall');
        break;
      case 'friends':
        setActiveTab('friends');
        break;
      default:
        if (selectedView.startsWith('group_')) {
          setActiveTab('groups');
        } else {
          setActiveTab('overall');
        }
        break;
    }
  }, [selectedView])

  const toggleFollow = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please sign in to follow users')
        return
      }

      // Find the user to toggle
      const targetUser = leaderboardData.find(u => u.id === userId)
      if (!targetUser) return

      const newFollowingState = !targetUser.isFollowing

      if (newFollowingState) {
        // Follow the user
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: userId,
          })
        if (error) throw error
      } else {
        // Unfollow the user
        const { error } = await supabase
          .from('follows')
          .delete()
          .match({
            follower_id: user.id,
            following_id: userId,
          })
        if (error) throw error
      }

      // Update local state
      setLeaderboardData((data: LeaderboardUser[]) => 
        data.map((u: LeaderboardUser) => 
          u.id === userId 
            ? { ...u, isFollowing: newFollowingState }
            : u
        )
      )

      toast.success(newFollowingState ? 'Following user' : 'Unfollowed user')
    } catch (error) {
      console.error('Error toggling follow:', error)
      toast.error('Failed to update follow status')
    }
  }

  const toggleGroupJoin = (groupId: string) => {
    setGroups((data: GroupData[]) => 
      data.map((group: GroupData) => 
        group.id === groupId 
          ? { ...group, isJoined: !group.isJoined, userRank: group.isJoined ? undefined : Math.floor(Math.random() * group.members) + 1 }
          : group
      )
    )
  }

  // Use search results if searching, otherwise use top 10 leaderboard data
  const filteredData = searchTerm.length >= 2 ? searchResults : leaderboardData

  const weeklyData = [...leaderboardData].sort((a, b) => (a.weeklyRank || 999) - (b.weeklyRank || 999))

  // Generate available weeks (only current and past weeks)
  const getAvailableWeeks = () => {
    const weeks = []
    // Include all weeks from 1 to current week
    for (let i = 1; i <= currentWeek; i++) {
      weeks.push(`Week ${i}`)
    }
    return weeks.reverse() // Most recent first
  }

  const renderUserRow = (entry: LeaderboardUser, showWeeklyRank = false) => {
    // Determine if we should show actual rankings or placeholders
    const shouldShowPlaceholders = isPreSeason || !isWeekComplete(currentWeek);
    
    const rank = shouldShowPlaceholders ? 0 : (showWeeklyRank ? (entry.weeklyRank || 0) : entry.rank)
    const accuracy = shouldShowPlaceholders ? 0 : (showWeeklyRank ? (entry.weeklyAccuracy || 0) : entry.accuracy)
    
    // Determine background gradient based on rank
    let backgroundClass = "hover:bg-slate-50 dark:hover:bg-slate-800"
    if (rank === 1) {
      backgroundClass = "bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-300 dark:border-yellow-700"
    } else if (rank === 2) {
      backgroundClass = "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 border-gray-300 dark:border-gray-600"
    } else if (rank === 3) {
      backgroundClass = "bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-300 dark:border-orange-700"
    } else if (entry.isCurrentUser) {
      backgroundClass = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
    }

    return (
    <div
      key={entry.id}
      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${backgroundClass}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          rank <= 3 && rank > 0
            ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white" 
            : "bg-slate-100 dark:bg-slate-700"
        }`}>
          {rank > 0 ? rank : '--'}
        </div>

        <Link href={`/profile/${entry.id}`}>
          <GradientAvatar
            src={entry.user.avatar}
            alt={entry.user.name}
            fallback={entry.user.name.split(' ').map((n: string) => n[0]).join('')}
            size="lg"
            className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
          />
        </Link>

        <div>
          <div className="flex items-center space-x-2">
            <Link href={`/profile/${entry.id}`}>
              <p className="font-semibold hover:text-blue-600 cursor-pointer">
                {entry.user.name}
              </p>
            </Link>
            {entry.user.verified && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {entry.isCurrentUser && (
              <Badge variant="outline" className="text-xs">
                You
              </Badge>
            )}
            {showWeeklyRank && entry.change !== undefined && entry.change !== 0 && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  entry.change > 0 
                    ? "border-green-200 text-green-600 dark:border-green-800 dark:text-green-400" 
                    : entry.change < 0 
                    ? "border-red-200 text-red-600 dark:border-red-800 dark:text-red-400" 
                    : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                }`}
              >
                {entry.change > 0 ? `+${entry.change}` : entry.change}
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {entry.user.username}
          </p>
          <p className="text-xs text-slate-500">
            {entry.rankings} rankings • {entry.followers} followers
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-center">
          {accuracy > 0 ? (
            <CircularProgress value={accuracy} size={60} showText />
          ) : (
            <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-500">--</span>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1">accuracy</p>
        </div>

        {!entry.isCurrentUser && (
          <Button
            variant={entry.isFollowing ? "outline" : "default"}
            size="sm"
            onClick={() => toggleFollow(entry.id)}
            className={entry.isFollowing 
              ? "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
              : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            }
          >
            {entry.isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>
    </div>
    )
  }

  // Add PPR type selection before the main tabs
  const renderPPRTabs = () => (
    <div className="mb-6">
      <Tabs value={pprType} onValueChange={setPprType} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="combined">Combined</TabsTrigger>
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="half">Half PPR</TabsTrigger>
          <TabsTrigger value="full">Full PPR</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )

  // Update the description based on PPR type
  const getPPRDescription = () => {
    switch (pprType) {
      case "standard": return "Standard scoring rankings"
      case "half": return "Half PPR scoring rankings"
      case "full": return "Full PPR scoring rankings"
      default: return "Overall performance across all scoring types"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
              <p className="text-slate-600 dark:text-slate-400">Outrank the Competition</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedView} onValueChange={(value: string) => {
                setSelectedView(value as any)
              }}>
                <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm">
                  <SelectValue placeholder="Select leaderboard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global Rankings</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  {userGroups.map((group) => (
                    <SelectItem key={group.id} value={`group_${group.id}`}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title={`Your Rank (${getViewLabel(selectedView)})`}
            value={isPreSeason ? "#--" : `#${getUserRank(selectedView)}`}
            icon={Trophy}
            subtitle={isPreSeason ? "No rankings yet" : "Your current position"}
          />
          <StatCard
            title="Total Rankings"
            value={getTotalRankings(pprType).toString()}
            subtitle="Active (preseason + week 1)"
            icon={Users}
          />
          <StatCard
            title="Your Accuracy"
            value={isPreSeason ? "Pending" : "--"}
            icon={TrendingUp}
            subtitle={isPreSeason ? "Awaiting Week 1" : "Week 1 in progress"}
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="overall">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Overall Leaderboard</CardTitle>
                    <CardDescription>
                      {pprType === "combined" ? "Overall performance across all scoring types" :
                       pprType === "standard" ? "Standard scoring rankings" :
                       pprType === "half" ? "Half PPR scoring rankings" :
                       "Full PPR scoring rankings"}
                    </CardDescription>
                  </div>
                  <Tabs value={pprType} onValueChange={setPprType} className="w-auto">
                    <TabsList>
                      <TabsTrigger value="combined">Combined</TabsTrigger>
                      <TabsTrigger value="standard">Standard</TabsTrigger>
                      <TabsTrigger value="half">Half PPR</TabsTrigger>
                      <TabsTrigger value="full">Full PPR</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <SearchInput
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                  {isSearching && (
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Searching...
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">No users found matching "{searchTerm}"</p>
                    </div>
                  ) : (
                    filteredData.map((entry: LeaderboardUser) => renderUserRow(entry))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Weekly Leaderboard</CardTitle>
                    <CardDescription>
                      {pprType === "combined" ? "Overall performance across all scoring types" :
                       pprType === "standard" ? "Standard scoring rankings" :
                       pprType === "half" ? "Half PPR scoring rankings" :
                       "Full PPR scoring rankings"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableWeeks().map((week) => (
                          <SelectItem key={week} value={week}>
                            {week}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Tabs value={pprType} onValueChange={setPprType} className="w-auto">
                      <TabsList>
                        <TabsTrigger value="combined">Combined</TabsTrigger>
                        <TabsTrigger value="standard">Standard</TabsTrigger>
                        <TabsTrigger value="half">Half PPR</TabsTrigger>
                        <TabsTrigger value="full">Full PPR</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <SearchInput
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                  {isSearching && (
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Searching...
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">No users found matching "{searchTerm}"</p>
                    </div>
                  ) : (
                    (searchTerm.length >= 2 ? searchResults : weeklyData)
                      .map((entry: LeaderboardUser) => renderUserRow(entry, true))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Friends Leaderboard</CardTitle>
                    <CardDescription>See how you rank among your friends</CardDescription>
                  </div>
                  <Link href="/find-friends">
                    <Button variant="outline" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Find Friends
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {friendsData.length > 1 ? (
                  <>
                    <div className="mb-6">
                      <SearchInput
                        placeholder="Search friends..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                      />
                    </div>

                    <div className="space-y-4">
                      {friendsData
                        .filter((user: LeaderboardUser) =>
                          user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.user.username.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .sort((a, b) => a.rank - b.rank)
                        .map((entry: LeaderboardUser, index: number) => (
                          <div key={entry.id} className="relative">
                            {renderUserRow({...entry, rank: index + 1})}
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Follow other users to see how you rank among friends
                    </p>
                    <Link href="/find-friends">
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Find Friends
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Group Leaderboards</CardTitle>
                    <CardDescription>Rankings within your groups</CardDescription>
                  </div>
                  <Link href="/create-group">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <SearchInput
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                {isLoadingGroups ? (
                  <div className="text-center py-12">
                    <GradientLoading text="Loading groups..." size="md" />
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Create or join groups to see group leaderboards
                    </p>
                    <Link href="/create-group">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Group
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groups
                      .filter((group: GroupData) =>
                        group.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((group: GroupData) => (
                        <Link
                          key={group.id}
                          href={`/group/${group.id}`}
                        >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer">
                      
                      <div className="flex items-center space-x-4">
                        <GradientAvatar
                          src={group.avatar}
                          alt={group.name}
                          fallback={group.name.split(' ').map((n: string) => n[0]).join('')}
                          size="lg"
                        />

                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{group.name}</h3>
                            {group.isJoined && (
                              <Badge variant="outline" className="text-xs">
                                Member
                              </Badge>
                            )}
                            {group.isPrivate && (
                              <Badge variant="secondary" className="text-xs">
                                <Lock className="w-3 h-3 mr-1" />
                                Private
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {group.members} members • {group.avgAccuracy > 0 ? `${group.avgAccuracy}%` : '--'} avg accuracy
                          </p>
                          {group.isJoined && group.userRank && (
                            <p className="text-xs text-slate-500">
                              Your rank: #{group.userRank}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          {group.avgAccuracy > 0 ? (
                            <CircularProgress value={group.avgAccuracy} size={60} showText />
                          ) : (
                            <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-500">--</span>
                            </div>
                          )}
                          <p className="text-xs text-slate-500 mt-1">group avg</p>
                        </div>

                        <Button
                          variant={group.isJoined ? "outline" : "default"}
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleGroupJoin(group.id);
                          }}
                          className={group.isJoined 
                            ? "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                            : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                          }
                        >
                          {group.isJoined ? (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Joined
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Join
                            </>
                          )}
                        </Button>
                      </div>
                      </div>
                    </Link>
                  ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 