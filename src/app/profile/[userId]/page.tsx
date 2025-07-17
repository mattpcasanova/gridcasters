"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { SearchInput } from "@/components/ui/search-input"
import { Calendar, MapPin, Users, UserPlus, MessageCircle, Trophy, Star, TrendingUp, Award, Camera, Settings, LogOut, Share, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { BADGES, getTierBgColor, getTierColor, getCategoryLabel, getBadgeIconBg, type Badge as BadgeType } from "@/lib/constants/badges"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const getPositionColor = (position: string) => {
  switch (position) {
    case "QB":
      return "bg-red-500 text-white"
    case "WR":
      return "bg-blue-500 text-white"
    case "RB":
      return "bg-green-500 text-white"
    case "TE":
      return "bg-yellow-500 text-white"
    case "OVR":
      return "bg-purple-500 text-white"
    case "FLX":
      return "bg-purple-500 text-white"
    default:
      return "bg-slate-500 text-white"
  }
}

const getPositionIconColor = (position: string) => {
  switch (position) {
    case "QB":
      return "text-red-800 dark:text-red-400"
    case "WR":
      return "text-blue-800 dark:text-blue-400"
    case "RB":
      return "text-green-800 dark:text-green-400"
    case "TE":
      return "text-yellow-800 dark:text-yellow-400"
    case "FLX":
      return "text-purple-800 dark:text-purple-400"
    default:
      return "text-slate-800 dark:text-slate-400"
  }
}

// Real user data structure
interface UserData {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  joinedDate: string;
  location: string;
  isPrivate: boolean;
  isFollowing: boolean;
  followers: number;
  following: number;
  featuredBadges: Array<{ id: string; name: string; description: string }>;
  stats: {
    overallAccuracy: number;
    weeklyAccuracy: number;
    seasonRank: number;
    totalRankings: number;
    correctPredictions: number;
    streakWeeks: number;
    percentile: number;
  };
  recentRankings: Array<{
    id: string;
    title: string;
    week: string;
    position: string;
    accuracy: number | null;
    date: string;
    isPublic: boolean;
  }>;
  earnedBadges: Record<string, { earned: boolean; progress: number }>;
}

export default function UserProfile() {
  const params = useParams()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [profileData, setProfileData] = useState<{ id: string, username: string, display_name: string | null, bio: string | null, avatar_url: string | null, created_at: string } | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [recentRankings, setRecentRankings] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = useSupabase()

  // Fetch profile data and rankings
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // First try to fetch by username
        let { data: profile, error } = await supabase
          .from('profiles')
          .select('id, username, display_name, bio, avatar_url, created_at')
          .eq('username', params.userId)
          .single()

        if (error) {
          // If not found by username, try by ID
          const { data: profileById, error: idError } = await supabase
            .from('profiles')
            .select('id, username, display_name, bio, avatar_url, created_at')
            .eq('id', params.userId)
            .single()

          if (idError) {
            console.error('Error fetching profile:', idError)
            toast.error('Profile not found')
            router.push('/leaderboard')
            return
          }
          profile = profileById
        }

        if (!profile) {
          toast.error('Profile not found')
          router.push('/leaderboard')
          return
        }

        setProfileData(profile)

        // Fetch user's rankings
        const { data: rankings, error: rankingsError } = await supabase
          .from('rankings')
          .select('*')
          .eq('user_id', profile.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10)

        if (rankingsError) {
          console.error('Error fetching rankings:', rankingsError)
        } else {
          setRecentRankings(rankings || [])
        }

        // Get follower count
        const { count: followers } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profile.id)

        setFollowerCount(followers || 0)

        // Check if current user is following this profile
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: followData } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', profile.id)
          .single()

        setIsFollowing(!!followData)

        // Get badge progress for this user
        const { data: badgeProgress } = await supabase
          .from('badge_progress')
          .select('badge_id, earned, progress')
          .eq('user_id', profile.id)

        // Convert badge progress to expected format
        const earnedBadges: Record<string, { earned: boolean; progress: number }> = {}
        badgeProgress?.forEach((bp: any) => {
          earnedBadges[bp.badge_id] = {
            earned: bp.earned,
            progress: bp.progress
          }
        })

        // Determine featured badges (earned badges to show prominently)
        const featuredBadges = []
        if (earnedBadges.beta_tester?.earned) {
          featuredBadges.push({ id: 'beta_tester', name: "Beta Tester", description: "Early GridCasters beta participant" })
        }
        if (earnedBadges.founding_forecaster?.earned) {
          featuredBadges.push({ id: 'founding_forecaster', name: "Founding Forecaster", description: "GridCasters founding member" })
        }
        if (earnedBadges.rookie_forecaster?.earned) {
          featuredBadges.push({ id: 'rookie_forecaster', name: "Rookie Forecaster", description: "Created your first ranking" })
        }

        // Create user data object
        const userDataObj: UserData = {
          id: profile.id,
          username: profile.username,
          displayName: profile.display_name || profile.username,
          bio: profile.bio || "",
          avatar: profile.avatar_url || "/placeholder-user.jpg",
          joinedDate: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          location: "",
          isPrivate: false,
          isFollowing: !!followData,
          followers: followers || 0,
          following: 0,
          featuredBadges,
          stats: {
            overallAccuracy: 0,
            weeklyAccuracy: 0,
            seasonRank: 0,
            totalRankings: rankings?.length || 0,
            correctPredictions: 0,
            streakWeeks: 0,
            percentile: 0,
          },
          recentRankings: [],
          earnedBadges
        }

        setUserData(userDataObj)
      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast.error('Failed to load profile')
        router.push('/leaderboard')
      }
    }

    fetchProfileData()
  }, [supabase, params.userId, router])

  const handleFollowToggle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please sign in to follow users')
        return
      }

      if (!profileData?.id) {
        toast.error('Could not find user profile')
        return
      }

      const newFollowingState = !isFollowing
      
      // Update the follows table
      if (newFollowingState) {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: profileData.id,
          })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('follows')
          .delete()
          .match({
            follower_id: user.id,
            following_id: profileData.id,
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

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Profile</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profileData?.avatar_url || "/placeholder-user.jpg"} />
              <AvatarFallback>
                {profileData?.display_name
                  ? profileData.display_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : profileData?.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{profileData?.display_name || profileData?.username}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">@{profileData?.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">
            <input
              type="text"
              value={`${window.location.origin}/profile/${profileData?.id}`}
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/profile/${profileData?.id}`)}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const getInitials = (profile: any) => {
    if (profile.display_name) {
      return profile.display_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    }
    return profile.username.slice(0, 2).toUpperCase()
  }

  const getDisplayName = (profile: any) => {
    return profile.display_name || profile.username
  }

  if (!profileData || !userData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Profile Info */}
              <div className="flex items-start">
                <div className="flex items-start space-x-6 flex-1">
                  {/* Profile Picture */}
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-2 border-transparent bg-gradient-to-br from-blue-500 to-green-500 p-[2px]">
                      <div className="rounded-full bg-white dark:bg-slate-900 w-full h-full flex items-center justify-center overflow-hidden">
                        <AvatarImage 
                          src={profileData?.avatar_url || "/placeholder-user.jpg"} 
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="text-xl">{getInitials(profileData)}</AvatarFallback>
                      </div>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full shadow-lg pointer-events-none"></div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getDisplayName(profileData)}</h1>
                      <Badge variant="outline" className="text-xs">Public</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">@{profileData?.username} • Joined {new Date(profileData?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 min-w-[140px]">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900/20"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                  {isFollowing ? (
                    <Button
                      onClick={handleFollowToggle}
                      variant="outline"
                      className="w-full justify-center border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Following
                    </Button>
                  ) : (
                    <GradientButton
                      onClick={handleFollowToggle}
                      className="w-full justify-center"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </GradientButton>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-4">
                {userData.featuredBadges.map((featuredBadge) => {
                  const badge = BADGES.find((b) => b.id === featuredBadge.id)
                  if (!badge) return null
                  const badgeStatus = userData.earnedBadges[badge.id]
                  return (
                    <div
                      key={badge.id}
                      className={`relative flex items-center space-x-3 p-4 rounded-lg ${getTierBgColor(badge.tier)} transition-all`}
                    >
                      <div
                        className={`relative w-12 h-12 flex items-center justify-center p-3 rounded-lg ${
                          badgeStatus?.earned || true // Always show gradient for displayed badges
                            ? getBadgeIconBg(badge.id, badge.tier)
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      >
                        <Image
                          src={badge.icon}
                          alt={badge.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          quality={100}
                        />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${getTierColor(badge.tier)}`}>{badge.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{badge.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="text-slate-700 dark:text-slate-300">{profileData?.bio || userData.bio}</p>
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
                <CardDescription>Latest player rankings and their performance</CardDescription>
                <SearchInput
                  placeholder="Search rankings..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="max-w-md mt-4"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRankings
                    .filter(ranking => 
                      ranking.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      ranking.position?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 10)
                    .map((ranking) => (
                    <Link
                      key={ranking.id}
                      href={`/rankings/${ranking.id}`}
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${getPositionColor(ranking.position)}`}>
                            {ranking.position}
                          </div>
                          <div>
                            <h3 className="font-semibold">{ranking.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                              <Badge className={getPositionColor(ranking.position)} variant="outline">
                                {ranking.position}
                              </Badge>
                              <span>{new Date(ranking.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {ranking.accuracy_score !== null ? (
                            <CircularProgress value={ranking.accuracy_score} size="sm" />
                          ) : (
                            <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-500">--</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {recentRankings.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-600 dark:text-slate-400">No rankings found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed breakdown of ranking performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card className={`p-4 ${getTierBgColor('bronze')}`}>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Accuracy</p>
                        <div className="flex items-center justify-center mt-2">
                          <div className="text-sm text-slate-500">Pending</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className={`p-4 ${getTierBgColor('bronze')}`}>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Global Rank</p>
                        <h2 className="text-2xl font-bold">Pending</h2>
                      </div>
                    </div>
                  </Card>

                  <Card className={`p-4 ${getTierBgColor('bronze')}`}>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Rankings</p>
                        <h2 className="text-2xl font-bold">{userData.stats.totalRankings}</h2>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Position Accuracy */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Accuracy by Position</h3>
                    <div className="space-y-3">
                      {[
                        { position: 'FLX', accuracy: 0 },
                        { position: 'QB', accuracy: 0 },
                        { position: 'RB', accuracy: 0 },
                        { position: 'WR', accuracy: 0 },
                        { position: 'TE', accuracy: 0 }
                      ].map(({ position, accuracy }) => (
                        <div key={position} className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-md text-sm font-medium ${getPositionColor(position)}`}>
                            {position}
                          </span>
                          <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-500">--</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Percentile Rankings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Percentile Rankings</h3>
                    <div className="space-y-3">
                      {[
                        { position: 'FLX', percentile: 0 },
                        { position: 'QB', percentile: 0 },
                        { position: 'RB', percentile: 0 },
                        { position: 'WR', percentile: 0 },
                        { position: 'TE', percentile: 0 }
                      ].map(({ position, percentile }) => (
                        <div key={position} className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-md text-sm font-medium ${getPositionColor(position)}`}>
                            {position}
                          </span>
                          <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-500">--</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Time Data */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">All Time Data</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Top 10 Percentile', value: 0 },
                        { label: 'Top 20 Percentile', value: 0 },
                        { label: 'Top 30 Percentile', value: 0 },
                        { label: 'Perfect Picks', value: 0 },
                        { label: '95%+ Accuracy Score', value: 0 },
                        { label: '90%+ Accuracy Score', value: 0 },
                        { label: '80%+ Accuracy Score', value: 0 }
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{value}</span>
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
                {/* Group badges by category */}
                {(['ranking', 'performance', 'consistency', 'social', 'position', 'seasonal', 'milestone', 'special'] as BadgeType['category'][]).map(category => {
                  const categoryBadges = BADGES.filter(badge => badge.category === category)
                  if (categoryBadges.length === 0) return null

                  return (
                    <div key={category} className="mb-8 last:mb-0">
                      <h2 className="text-xl font-semibold mb-4">{getCategoryLabel(category)}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryBadges.map((badge) => {
                          const badgeStatus = userData.earnedBadges[badge.id]
                          return (
                            <div
                              key={badge.id}
                              className={`p-4 border rounded-lg text-left transition-all ${getTierBgColor(badge.tier)} ${
                                badge.tier === 'bronze'
                                  ? 'border-amber-200 dark:border-amber-800'
                                  : badge.tier === 'silver'
                                  ? 'border-slate-200 dark:border-slate-700'
                                  : badge.tier === 'gold'
                                  ? 'border-yellow-200 dark:border-yellow-800'
                                  : badge.tier === 'diamond'
                                  ? 'border-blue-200 dark:border-blue-800'
                                  : badge.tier === 'platinum'
                                  ? 'border-purple-200 dark:border-purple-800'
                                  : badge.tier === 'verified'
                                  ? 'border-green-200 dark:border-green-800'
                                  : badge.tier === 'special'
                                  ? 'border-blue-200 dark:border-blue-800'
                                  : 'border-indigo-200 dark:border-indigo-800'
                              } ${
                                !badgeStatus?.earned ? 'opacity-75' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`p-3 rounded-lg ${
                                    badgeStatus?.earned
                                      ? getBadgeIconBg(badge.id, badge.tier)
                                      : "bg-slate-300 dark:bg-slate-600"
                                  }`}
                                >
                                  <div className="relative w-12 h-12 flex items-center justify-center">
                                    <Image
                                      src={badge.icon}
                                      alt={badge.name}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-contain"
                                      quality={100}
                                    />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h3 className={`font-semibold ${getTierColor(badge.tier)}`}>{badge.name}</h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{badge.description}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-500">{badge.subtitle}</p>
                                  {badgeStatus?.earned ? (
                                    <Badge variant="outline" className="text-xs mt-2">
                                      Earned
                                    </Badge>
                                  ) : (
                                    <div className="space-y-1 mt-2">
                                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                        <span>Progress</span>
                                        <span>{badgeStatus?.progress || 0}%</span>
                                      </div>
                                      <Progress value={badgeStatus?.progress || 0} className="h-1" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showShareModal && <ShareModal />}
      </div>
    </div>
  )
} 