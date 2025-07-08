"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientButton } from "@/components/ui/gradient-button"
import { StatCard } from "@/components/ui/stat-card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Calendar, MapPin, Users, UserPlus, MessageCircle, Trophy, Star, TrendingUp, Award, Camera, Settings, LogOut, Share } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { BADGES } from "@/lib/constants/badges"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Mock user data - in a real app, this would be fetched based on the ID
const userData = {
  id: "2",
  username: "mikechen",
  displayName: "Mike Chen",
  bio: "Fantasy football enthusiast and data analyst. Always looking for the next sleeper pick! 🏈📊",
  avatar: "/placeholder-user.jpg",
  joinedDate: "July 2025",
  location: "San Francisco, CA",
  isPrivate: false,
  isFollowing: false,
  followers: 1247,
  following: 892,
  featuredBadges: [
    { name: "Top 1% Accuracy", description: "Achieved 95%+ accuracy in season rankings" },
    { name: "Sleeper Expert", description: "Identified 10+ breakout players before consensus" },
    { name: "Consistency King", description: "Top 10% accuracy for 3 consecutive seasons" },
  ],
  stats: {
    overallAccuracy: 87.3,
    weeklyAccuracy: 82.1,
    seasonRank: 156,
    totalRankings: 47,
    correctPredictions: 234,
    streakWeeks: 4,
    percentile: 94.8,
  },
  recentRankings: [
    {
      id: "1",
      title: "Week 8 QB Rankings",
      week: "Week 8",
      position: "QB",
      accuracy: 94.2,
      date: "2 days ago",
      isPublic: true,
    },
    {
      id: "2",
      title: "Week 8 RB Rankings",
      week: "Week 8",
      position: "RB",
      accuracy: 89.1,
      date: "3 days ago",
      isPublic: true,
    },
    {
      id: "3",
      title: "Week 7 WR Rankings",
      week: "Week 7",
      position: "WR",
      accuracy: 91.8,
      date: "1 week ago",
      isPublic: true,
    },
    {
      id: "4",
      title: "Week 7 TE Rankings",
      week: "Week 7",
      position: "TE",
      accuracy: 85.4,
      date: "1 week ago",
      isPublic: false,
    },
  ],
  achievements: [
    {
      id: "1",
      name: "Perfect Week",
      description: "100% accuracy in weekly rankings",
      icon: Trophy,
      earned: true,
      date: "Week 6, 2024",
    },
    {
      id: "2",
      name: "Sleeper Spotter",
      description: "Identified breakout player before consensus",
      icon: Star,
      earned: true,
      date: "Week 4, 2024",
    },
    {
      id: "3",
      name: "Consistency Champion",
      description: "Top 10% accuracy for 5 weeks straight",
      icon: TrendingUp,
      earned: true,
      date: "Week 8, 2024",
    },
    {
      id: "4",
      name: "Top 1% Elite",
      description: "Ranked in top 1% of all users",
      icon: Award,
      earned: false,
      date: null,
    },
  ],
}

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

const getTierGradient = (tier: 'bronze' | 'silver' | 'gold' | 'diamond' | null) => {
  switch (tier) {
    case 'bronze':
      return 'bg-gradient-to-br from-amber-100/50 to-amber-200/50 dark:from-amber-900/20 dark:to-amber-800/20'
    case 'silver':
      return 'bg-gradient-to-br from-slate-100/50 to-slate-200/50 dark:from-slate-800/20 dark:to-slate-700/20'
    case 'gold':
      return 'bg-gradient-to-br from-yellow-100/50 to-yellow-200/50 dark:from-yellow-900/20 dark:to-yellow-800/20'
    case 'diamond':
      return 'bg-gradient-to-br from-blue-100/50 to-blue-200/50 dark:from-blue-900/20 dark:to-blue-800/20'
    default:
      return 'bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20'
  }
}

export default function UserProfile() {
  const params = useParams()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing)
  const [followerCount, setFollowerCount] = useState(userData.followers)
  const [isUploading, setIsUploading] = useState(false)
  const supabase = useSupabase()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  const handleFollowToggle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const newFollowingState = !isFollowing
      
      // Update the follows table
      if (newFollowingState) {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: params.userId,
          })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('follows')
          .delete()
          .match({
            follower_id: user.id,
            following_id: params.userId,
          })
        if (error) throw error
      }

      // Update local state
      setIsFollowing(newFollowingState)
      setFollowerCount(newFollowingState ? followerCount + 1 : followerCount - 1)
      toast.success(newFollowingState ? 'Following user' : 'Unfollowed user')
    } catch (error) {
      console.error('Error toggling follow:', error)
      toast.error('Failed to update follow status')
    }
  }

  const handleAvatarUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(filePath)

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      // Refresh the page to show the new avatar
      window.location.reload()
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setIsUploading(false)
    }
  }, [supabase])

  const publicRankings = userData.recentRankings.filter((ranking) => ranking.isPublic)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              {/* Profile Picture */}
              <div className="relative group">
                <Avatar className="w-24 h-24 border border-transparent bg-gradient-to-br from-blue-500 to-green-500 p-[1px]">
                  <div className="rounded-full bg-white dark:bg-slate-900 w-full h-full flex items-center justify-center overflow-hidden">
                    <AvatarImage 
                      src={userData.avatar || "/placeholder-user.jpg"} 
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className="text-xl">
                      {userData.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </div>
                </Avatar>
                <div className="absolute inset-0 rounded-full shadow-lg pointer-events-none"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{userData.displayName}</h1>
                      <Badge variant="outline" className="text-xs">Public</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">@{userData.username} • Joined {userData.joinedDate}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900/20"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                    {isFollowing ? (
                      <Button
                        onClick={handleFollowToggle}
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Following
                      </Button>
                    ) : (
                      <GradientButton
                        onClick={handleFollowToggle}
                        icon={UserPlus}
                      >
                        Follow
                      </GradientButton>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-slate-700 dark:text-slate-300">{userData.bio}</p>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-4">
                  {userData.featuredBadges.map((badge, index) => (
                    <div
                      key={index}
                      className={`relative flex items-center space-x-3 p-4 rounded-lg ${
                        badge.name.includes("Top 1%")
                          ? "bg-blue-50/50 dark:bg-blue-900/20"
                          : badge.name.includes("Sleeper")
                          ? "bg-amber-50/50 dark:bg-amber-900/20"
                          : "bg-slate-50/50 dark:bg-slate-800/50"
                      } transition-all`}
                    >
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <Image
                          src="/badges/rookie_forecaster_bronze.png"
                          alt={badge.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-contain"
                          quality={100}
                        />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${badge.name.includes("Top 1%") ? "text-blue-600 dark:text-blue-400" : badge.name.includes("Sleeper") ? "text-amber-600 dark:text-amber-400" : "text-slate-600 dark:text-slate-400"}`}>{badge.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Accuracy</p>
                    <div className="flex items-center space-x-2">
                      <CircularProgress value={userData.stats.overallAccuracy} size="sm" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Global Rank</p>
                    <h2 className="text-2xl font-bold">#{userData.stats.seasonRank}</h2>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Rankings</p>
                    <h2 className="text-2xl font-bold">{userData.stats.totalRankings}</h2>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Recent Rankings</CardTitle>
                <CardDescription>
                  {userData.isPrivate ? "Only public rankings are shown" : "All recent rankings"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publicRankings.map((ranking) => (
                    <Link
                      key={ranking.id}
                      href={`/rankings/${ranking.id}`}
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {ranking.position}
                          </div>
                          <div>
                            <h3 className="font-semibold">{ranking.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                              <Badge className={getPositionColor(ranking.position)} variant="outline">
                                {ranking.position}
                              </Badge>
                              <span>{ranking.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center space-x-2">
                          <div>
                            <div className="font-semibold text-green-600 dark:text-green-400">{ranking.accuracy}%</div>
                            <div className="text-xs text-slate-500">accuracy</div>
                          </div>
                          <CircularProgress value={ranking.accuracy} size="sm" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed breakdown of your ranking performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Position Accuracy */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Accuracy by Position</h3>
                    <div className="space-y-3">
                      {[
                        { position: 'QB', accuracy: 89.2 },
                        { position: 'RB', accuracy: 85.7 },
                        { position: 'WR', accuracy: 82.4 },
                        { position: 'TE', accuracy: 87.1 }
                      ].map(({ position, accuracy }) => (
                        <div key={position} className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-md text-sm font-medium ${getPositionColor(position)}`}>
                            {position}
                          </span>
                          <CircularProgress value={accuracy} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Percentile Rankings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Percentile Rankings</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Overall', value: 94.8 },
                        { label: 'Weekly', value: 92.3 },
                        { label: 'Preseason', value: 88.5 },
                        { label: 'Consistency', value: 91.2 }
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">Top {(100 - value).toFixed(1)}%</span>
                            <CircularProgress value={value} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Streak Stats */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Current Streaks</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Top 10%', value: 4, max: 5 },
                        { label: 'Weekly Wins', value: 3, max: 5 },
                        { label: 'Perfect Picks', value: 2, max: 5 }
                      ].map(({ label, value, max }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{value} weeks</span>
                            <CircularProgress value={value / max * 100} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Badges and milestones earned on RankBet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BADGES.map((badge) => {
                    const isEarned = Math.random() > 0.5 // Replace with actual earned logic
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 border rounded-lg ${
                          isEarned
                            ? "bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-3 rounded-lg ${
                              isEarned
                                ? "bg-gradient-to-br from-blue-500 to-green-500"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          >
                            <div className="relative w-12 h-12 flex items-center justify-center">
                              <Image
                                src={badge.icon}
                                alt={badge.name}
                                width={48}
                                height={48}
                                className="w-full h-full"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{badge.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{badge.description}</p>
                            {isEarned ? (
                              <Badge variant="outline" className="text-xs">
                                Earned
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Not Earned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 