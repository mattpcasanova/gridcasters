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
import { Trophy, Medal, Award, TrendingUp, Users, Target, Plus, UserCheck, UserPlus, Star, Calendar, Crown } from "lucide-react"
import Link from "next/link"
import { useHeaderButtons } from "@/components/layout/root-layout-client"
import { useLeaderboard } from "@/lib/contexts/leaderboard-context"
import { getCurrentSeasonInfo } from "@/lib/utils/season"

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
}

interface GroupData {
  id: number;
  name: string;
  members: number;
  avgAccuracy: number;
  avatar: string;
  userRank?: number;
  isJoined?: boolean;
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
    accuracy: 94.2,
    rankings: 156,
    followers: 1247,
    isFollowing: false,
    weeklyAccuracy: 96.1,
    weeklyRank: 1,
    change: 0,
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
    accuracy: 91.8,
    rankings: 142,
    followers: 892,
    isFollowing: true,
    weeklyAccuracy: 93.4,
    weeklyRank: 2,
    change: 1,
  },
  {
    id: 3,
    rank: 3,
    user: {
      name: "Matt Casanova",
      username: "@mattcasanova",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    accuracy: 87.3,
    rankings: 98,
    followers: 234,
    isFollowing: false,
    isCurrentUser: true,
    weeklyAccuracy: 89.7,
    weeklyRank: 5,
    change: -2,
  },
  {
    id: 4,
    rank: 4,
    user: {
      name: "Alex Rodriguez",
      username: "@alexr",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    accuracy: 85.1,
    rankings: 78,
    followers: 567,
    isFollowing: false,
    weeklyAccuracy: 91.2,
    weeklyRank: 3,
    change: 1,
  },
  {
    id: 5,
    rank: 5,
    user: {
      name: "Emma Wilson",
      username: "@emmaw",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    accuracy: 83.7,
    rankings: 134,
    followers: 423,
    isFollowing: true,
    weeklyAccuracy: 90.8,
    weeklyRank: 4,
    change: 1,
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
    accuracy: 82.1,
    rankings: 89,
    followers: 156,
    isFollowing: true,
    weeklyAccuracy: 87.3,
    weeklyRank: 6,
    change: 2,
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
    accuracy: 79.8,
    rankings: 67,
    followers: 298,
    isFollowing: true,
    weeklyAccuracy: 85.1,
    weeklyRank: 7,
    change: 5,
  },
]

const groupData: GroupData[] = [
  {
    id: 1,
    name: "Fantasy Experts",
    members: 247,
    avgAccuracy: 89.4,
    avatar: "/placeholder-group.jpg",
    userRank: 15,
    isJoined: true,
  },
  {
    id: 2,
    name: "College Friends",
    members: 12,
    avgAccuracy: 82.1,
    avatar: "/placeholder-group.jpg",
    userRank: 3,
    isJoined: true,
  },
  {
    id: 3,
    name: "NFL Analysts",
    members: 156,
    avgAccuracy: 91.2,
    avatar: "/placeholder-group.jpg",
    userRank: 42,
    isJoined: true,
  },
  {
    id: 4,
    name: "Monday Night Football",
    members: 89,
    avgAccuracy: 86.7,
    avatar: "/placeholder-group.jpg",
    isJoined: false,
  },
  {
    id: 5,
    name: "Dynasty League Pros",
    members: 324,
    avgAccuracy: 88.9,
    avatar: "/placeholder-group.jpg",
    isJoined: false,
  },
]

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("overall")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Get current season info and default to current week
  const seasonInfo = getCurrentSeasonInfo()
  const currentWeek = seasonInfo.isPreSeason ? 1 : (seasonInfo.currentWeek || 1)
  const [selectedWeek, setSelectedWeek] = useState(`Week ${currentWeek}`)
  
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>(mockLeaderboardData)
  const [groups, setGroups] = useState<GroupData[]>(groupData)
  const { setRightButtons } = useHeaderButtons()
  const { selectedView, setSelectedView, getViewLabel, getUserRank } = useLeaderboard()

  const currentUser = leaderboardData.find((user: LeaderboardUser) => user.isCurrentUser)
  const friendsData = leaderboardData.filter((user: LeaderboardUser) => user.isFollowing || user.isCurrentUser)

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
      case 'group1':
      case 'group2':
        setActiveTab('groups');
        break;
      default:
        setActiveTab('overall');
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

  const toggleGroupJoin = (groupId: number) => {
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
    for (let i = 1; i <= currentWeek; i++) {
      weeks.push(`Week ${i}`)
    }
    return weeks.reverse() // Most recent first
  }

  const renderUserRow = (entry: LeaderboardUser, showWeeklyRank = false) => {
    const rank = showWeeklyRank ? (entry.weeklyRank || 999) : entry.rank
    
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
          rank <= 3 
            ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white" 
            : "bg-slate-100 dark:bg-slate-700"
        }`}>
          {rank}
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
            {showWeeklyRank && entry.change !== undefined && (
              <Badge variant={entry.change > 0 ? "default" : entry.change < 0 ? "destructive" : "secondary"} className="text-xs">
                {entry.change > 0 ? `+${entry.change}` : entry.change === 0 ? "=" : entry.change}
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
          <CircularProgress value={showWeeklyRank ? entry.weeklyAccuracy || 0 : entry.accuracy} size={60} showText />
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
              <Select value={selectedView} onValueChange={(value: 'global' | 'friends' | 'group1' | 'group2') => {
                setSelectedView(value)
              }}>
                <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm">
                  <SelectValue placeholder="Select leaderboard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global Rankings</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="group1">Fantasy Experts Group</SelectItem>
                  <SelectItem value="group2">College Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title={`Your Rank (${getViewLabel(selectedView)})`}
            value={`#${getUserRank(selectedView) || 'N/A'}`}
            icon={Trophy}
            trend={{
              value: "+2 positions this week",
              direction: "up",
              icon: TrendingUp
            }}
          />
          <StatCard
            title="Total Players"
            value="2,847"
            subtitle="Active this week"
            icon={Users}
          />
          <StatCard
            title="Your Accuracy"
            value={`${currentUser?.accuracy || 0}%`}
            icon={TrendingUp}
            trend={{
              value: "+3.2% from last week",
              direction: "up",
              icon: TrendingUp
            }}
            progress={currentUser?.accuracy}
          />
        </div>

        {/* Tabs */}
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
                <CardTitle>Overall Leaderboard</CardTitle>
                <CardDescription>Your position and nearby competitors</CardDescription>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Weekly Leaderboard</CardTitle>
                    <CardDescription>This week's top performers</CardDescription>
                  </div>
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
                  <Link href="/find-groups">
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Find Groups
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
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {group.members} members • {group.avgAccuracy}% avg accuracy
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
                          <CircularProgress value={group.avgAccuracy} size={60} showText />
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 