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
import { BarChart3, TrendingUp, Trophy, Users, Target, Plus, ArrowUp, ArrowDown, Minus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { useRouter } from "next/navigation"
import { useLeaderboard } from "@/lib/contexts/leaderboard-context"
import { useRecentActivity } from "@/lib/hooks/use-recent-activity"

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

export default function Dashboard() {
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { 
    selectedView, 
    setSelectedView, 
    getViewLabel, 
    getLeaderboardData, 
    getUserRank 
  } = useLeaderboard()
  
  const { recentRankings, loading: activityLoading } = useRecentActivity()
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('username, display_name, first_name, last_name')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile for dashboard:', error)
          toast.error('Failed to load profile. You may need to sign out and back in.')
          return
        }

        setProfile(profileData)
      } catch (error) {
        console.error('Error fetching profile for dashboard:', error)
        toast.error('Failed to load profile. You may need to sign out and back in.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
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
            <p className="text-slate-600 dark:text-slate-400">Here's how your rankings are performing this week.</p>
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

        {/* Stats Overview - Note: No accuracy scores shown for active week */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Previous Week Accuracy"
            value="87.3%"
            icon={BarChart3}
            trend={{ value: "+2.1% from Week 6", direction: "up", icon: ArrowUp }}
            progress={87.3}
            subtitle="Week 7 Final Score"
          />

          <StatCard
            title="League Rank"
            value={`#${getUserRank(selectedView)}`}
            icon={Trophy}
            trend={{ value: "+2 positions", direction: "up", icon: ArrowUp }}
            subtitle={`in ${getViewLabel(selectedView)}`}
          />

          <StatCard
            title="Week 8 Rankings"
            value="6"
            icon={Target}
            subtitle="Accuracy pending"
          />

          <StatCard
            title="Followers"
            value="247"
            icon={Users}
            trend={{ value: "+12 this week", direction: "up", icon: ArrowUp }}
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
                      href={`/rankings?week=${ranking.week}&position=${ranking.position}`}
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
                              <div className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded text-xs font-medium">
                                {ranking.accuracy}%
                              </div>
                              {ranking.trend === "up" ? (
                                <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                          ) : (
                            <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded text-xs font-medium">
                              {ranking.status}
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
                    <CardDescription>{getViewLabel(selectedView)} leaders this week</CardDescription>
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
                  {getLeaderboardData(selectedView).slice(0, 5).map((user, index) => (
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
                      <div className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded text-xs font-medium">
                        {user.accuracy}%
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 