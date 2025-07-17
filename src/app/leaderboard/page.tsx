"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  id: number;
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

const mockLeaderboardData: LeaderboardUser[] = [
  {
    id: 1,
    rank: 1,
    user: {
      name: "Mike Chen",
      username: "@mikechen",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    accuracy: 0, // No accuracy before Week 1
    rankings: 6, // 2 rankings each for Standard, Half PPR, Full PPR (preseason + week 1)
    followers: 1247,
    isFollowing: false,
    weeklyAccuracy: 0, // No weekly accuracy before Week 1
    weeklyRank: 0, // No weekly rank before Week 1
    change: 0,
    weeklyChange: 0,
  },
  {
    id: 2,
    rank: 2,
    user: {
      name: "Sarah Johnson", 
      username: "@sarahj",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    accuracy: 0,
    rankings: 9, // 3 rankings each for Standard, Half PPR, Full PPR
    followers: 892,
    isFollowing: true,
    weeklyAccuracy: 0,
    weeklyRank: 0,
    change: 0,
    weeklyChange: 0,
  },
  {
    id: 3,
    rank: 3,
    user: {
      name: "Alex Rodriguez",
      username: "@alexr",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    accuracy: 0,
    rankings: 3, // 1 ranking each for Standard, Half PPR, Full PPR
    followers: 567,
    isFollowing: false,
    weeklyAccuracy: 0,
    weeklyRank: 0,
    change: 0,
    weeklyChange: 0,
  },
  {
    id: 4,
    rank: 4,
    user: {
      name: "Emma Wilson",
      username: "@emmaw",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    accuracy: 0,
    rankings: 6, // 2 rankings each for Standard, Half PPR, Full PPR
    followers: 423,
    isFollowing: true,
    weeklyAccuracy: 0,
    weeklyRank: 0,
    change: 0,
    weeklyChange: 0,
  },
  {
    id: 5,
    rank: 5,
    user: {
      name: "Matt Casanova",
      username: "@mattcasanova",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    accuracy: 0,
    rankings: 18, // 6 rankings each for Standard, Half PPR, Full PPR (preseason + week 1)
    followers: 0,
    isFollowing: false,
    isCurrentUser: true,
    weeklyAccuracy: 0,
    weeklyRank: 0,
    change: 0,
    weeklyChange: 0,
  },
  {
    id: 6,
    rank: 8,
    user: {
      name: "David Kim",
      username: "@davidk",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    accuracy: 0,
    rankings: 3, // 1 ranking each for Standard, Half PPR, Full PPR
    followers: 156,
    isFollowing: true,
    weeklyAccuracy: 0,
    weeklyRank: 0,
    change: 0,
    weeklyChange: 0,
  },
  {
    id: 7,
    rank: 12,
    user: {
      name: "Lisa Park",
      username: "@lisap",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    accuracy: 0,
    rankings: 0, // No rankings yet
    followers: 298,
    isFollowing: true,
    weeklyAccuracy: 0,
    weeklyRank: 0,
    change: 0,
    weeklyChange: 0,
  },
];

const groupData: GroupData[] = [
  {
    id: "1",
    name: "Fantasy Experts",
    members: 247,
    avgAccuracy: 0, // No accuracy before Week 1
    avatar: "/placeholder-group.jpg",
    userRank: 15,
    isJoined: true,
  },
  {
    id: "2",
    name: "College Friends",
    members: 12,
    avgAccuracy: 0,
    avatar: "/placeholder-group.jpg",
    userRank: 3,
    isJoined: true,
  },
  {
    id: "3",
    name: "NFL Analysts",
    members: 156,
    avgAccuracy: 0,
    avatar: "/placeholder-group.jpg",
    userRank: 42,
    isJoined: true,
  },
  {
    id: "4",
    name: "Monday Night Football",
    members: 89,
    avgAccuracy: 0,
    avatar: "/placeholder-group.jpg",
    isJoined: false,
  },
  {
    id: "5",
    name: "Dynasty League Pros",
    members: 324,
    avgAccuracy: 0,
    avatar: "/placeholder-group.jpg",
    isJoined: false,
  },
]

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("overall")
  const [searchTerm, setSearchTerm] = useState("")
  const [pprType, setPprType] = useState("combined")
  const [selectedWeek, setSelectedWeek] = useState("Week 1")
  const { selectedView, setSelectedView, getViewLabel, getUserRank } = useLeaderboard()
  
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

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>(mockLeaderboardData)
  const [groups, setGroups] = useState<GroupData[]>([])
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const { setRightButtons } = useHeaderButtons()
  const supabase = useSupabase()

  const currentUser = leaderboardData.find((user: LeaderboardUser) => user.isCurrentUser)
  const friendsData = leaderboardData.filter((user: LeaderboardUser) => user.isFollowing || user.isCurrentUser)

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

  const toggleFollow = (userId: number) => {
    setLeaderboardData((data: LeaderboardUser[]) => 
      data.map((user: LeaderboardUser) => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    )
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

  const filteredData = leaderboardData.filter((user: LeaderboardUser) =>
    user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
            <AvatarImage src={entry.user.avatar} />
            <AvatarFallback>
              {entry.user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
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
                  {/* Dynamic group options will be added by the context */}
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
                </div>

                <div className="space-y-4">
                  {filteredData.map((entry: LeaderboardUser) => renderUserRow(entry))}
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
                </div>

                <div className="space-y-4">
                  {weeklyData
                    .filter((user: LeaderboardUser) =>
                      user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.user.username.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((entry: LeaderboardUser) => renderUserRow(entry, true))}
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading groups...</p>
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
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={group.avatar} />
                          <AvatarFallback>
                            {group.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

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