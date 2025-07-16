"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatCard } from "@/components/ui/stat-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, TrendingUp, Trophy, Users, Target, Plus, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { useRouter } from "next/navigation"
import { useLeaderboard } from "@/lib/contexts/leaderboard-context"
import { useRecentActivity } from "@/lib/hooks/use-recent-activity"
import { getCurrentSeasonInfo } from "@/lib/utils/season"
import { CircularProgress } from "@/components/ui/circular-progress"

const getPositionColor = (position: string) => {
  switch (position) {
    case "QB":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "WR":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "RB":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "TE":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
  }
}

const getPositionIconColor = (position: string) => {
  switch (position) {
    case "QB":
      return "text-red-600 dark:text-red-400"
    case "WR":
      return "text-blue-600 dark:text-blue-400"
    case "RB":
      return "text-green-600 dark:text-green-400"
    case "TE":
      return "text-yellow-600 dark:text-yellow-400"
    default:
      return "text-slate-600 dark:text-slate-400"
  }
}

type UserProfile = {
  username: string
  display_name: string | null
  first_name: string | null
  last_name: string | null
}

type UserStats = {
  totalRankings: number
  followers: number
  following: number
  leagueRank: string
}

export default function Dashboard() {
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    totalRankings: 0,
    followers: 0,
    following: 0,
    leagueRank: '--'
  })
  const [isLoading, setIsLoading] = useState(true)
  
  const { 
    selectedView, 
    setSelectedView, 
    getViewLabel, 
    getLeaderboardData, 
    getUserRank 
  } = useLeaderboard()
  
  const { recentRankings, loading: activityLoading } = useRecentActivity()
  
  const seasonInfo = getCurrentSeasonInfo()
  const currentWeek = seasonInfo.currentWeek || 1
  const isPreSeason = seasonInfo.isPreSeason
  
  // Fetch user profile data and stats
  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/signin')
          return
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, display_name, first_name, last_name')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile for dashboard:', profileError)
          toast.error('Failed to load profile. You may need to sign out and back in.')
          return
        }

        setProfile(profileData)

        // Fetch user stats
        const [rankingsResult, followersResult, followingResult] = await Promise.all([
          // Get total rankings (excluding aggregate)
          supabase
            .from('rankings')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id)
            .not('position', 'like', 'AGG_%'),
          
          // Get followers count
          supabase
            .from('follows')
            .select('id', { count: 'exact' })
            .eq('following_id', user.id),
          
          // Get following count
          supabase
            .from('follows')
            .select('id', { count: 'exact' })
            .eq('follower_id', user.id)
        ])

        setUserStats({
          totalRankings: rankingsResult.count || 0,
          followers: followersResult.count || 0,
          following: followingResult.count || 0,
          leagueRank: '--' // Will be calculated based on selected view
        })

      } catch (error) {
        console.error('Error fetching profile and stats for dashboard:', error)
        toast.error('Failed to load profile. You may need to sign out and back in.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileAndStats()
  }, [supabase, router])
  
  useEffect(() => {
    // Show success message if user was redirected after email verification
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified successfully! Welcome to GridCasters!')
    }
  }, [searchParams])

  const getDisplayName = (profile: UserProfile) => {
    if (profile.first_name && profile.last_name) return `${profile.first_name} ${profile.last_name}`
    if (profile.display_name) return profile.display_name
    return profile.username
  }

  const getFirstName = (profile: UserProfile) => {
    if (profile.first_name) return profile.first_name
    if (profile.display_name) {
      const names = profile.display_name.split(' ')
      return names[0]
    }
    return profile.username
  }

  const rightButtons = (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={async () => {
          try {
            const response = await fetch('/api/badges/check', { method: 'POST' });
            if (response.ok) {
              const data = await response.json();
              if (data.newlyEarned && data.newlyEarned.length > 0) {
                toast.success(`Earned ${data.newlyEarned.length} new badge(s)!`);
              } else {
                toast.info('No new badges earned yet. Keep creating rankings!');
              }
            }
          } catch (error) {
            console.error('Error checking badges:', error);
          }
        }}
        className="mr-2"
      >
        Test Badges
      </Button>
      <Link href="/rankings">
        <GradientButton size="sm" icon={Plus}>
          New Ranking
        </GradientButton>
      </Link>
    </>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Unable to load your profile</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This might be because your email hasn't been confirmed yet or there was an issue creating your profile.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={async () => {
                try {
                  await supabase.auth.signOut()
                  router.push('/')
                } catch (error) {
                  console.error('Sign out error:', error)
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.href = '/'
                }
              }}
              className="w-full"
            >
              Sign Out & Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

      return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile ? getFirstName(profile) : "User"}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {isPreSeason 
                ? "Get ready for Week 1! Create your rankings now."
                : `Here's how your rankings are performing in Week ${currentWeek}.`
              }
            </p>
          </div>

        {/* Leaderboard Selection */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leaderboard View</CardTitle>
                <Select value={selectedView} onValueChange={setSelectedView}>
                  <SelectTrigger className="w-48">
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
            </CardHeader>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Previous Week Accuracy"
            value={isPreSeason ? "Pending" : "-"}
            icon={BarChart3}
            subtitle={isPreSeason ? "Awaiting Week 1" : `Week ${Math.max(1, currentWeek - 1)} Score`}
          />

          <StatCard
            title="League Rank"
            value={isPreSeason ? "#--" : `#${getUserRank(selectedView)}`}
            icon={Trophy}
            subtitle={`in ${getViewLabel(selectedView)}`}
          />

          <StatCard
            title={`Week ${currentWeek} Rankings`}
            value={userStats.totalRankings.toString()}
            icon={Target}
            subtitle="Your rankings"
          />

          <StatCard
            title="Followers"
            value={userStats.followers.toString()}
            icon={Users}
            subtitle="People following you"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Rankings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Rankings</CardTitle>
                <CardDescription>Your latest player rankings and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLoading ? (
                    <div className="space-y-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center space-x-3 p-4 border rounded-lg">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-16 h-6 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentRankings.length > 0 ? (
                    recentRankings.map((ranking, index) => (
                    <Link
                      key={index}
                      href={`/rankings/${ranking.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPositionColor(ranking.position)}`}
                          >
                            <span className={`font-bold text-xs ${getPositionIconColor(ranking.position)}`}>
                              {ranking.position}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{ranking.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{ranking.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {ranking.accuracy !== null ? (
                            <div className="flex items-center space-x-2">
                              <CircularProgress value={ranking.accuracy} size="sm" />
                              {ranking.trend === "up" ? (
                                <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              Active
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
                      <p className="text-gray-600 mb-4">Create your first ranking to see activity here</p>
                      <Link href="/rankings">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Ranking
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Rankers</CardTitle>
                    <CardDescription>
                      {isPreSeason 
                        ? "Highest accuracy rankings" 
                        : `${getViewLabel(selectedView)} leaders this week`
                      }
                    </CardDescription>
                  </div>
                  <Link href="/leaderboard">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isPreSeason ? (
                    // Show placeholder during preseason
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Season Starting Soon</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Rankings will appear here once Week 1 begins
                      </p>
                    </div>
                  ) : (
                    getLeaderboardData(selectedView).slice(0, 5).map((user, index) => (
                      <Link
                        key={index}
                        href={user.isCurrentUser ? "/profile" : `/profile/${user.username}`}
                        className={`flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                          user.isCurrentUser ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className={`font-medium ${user.isCurrentUser ? "text-blue-600 dark:text-blue-400" : ""}`}>
                              {user.name}
                              {user.isCurrentUser && " (You)"}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">#{user.rank} Global • {user.followers} followers</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Active
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 