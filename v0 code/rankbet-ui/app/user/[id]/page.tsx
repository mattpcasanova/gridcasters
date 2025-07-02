"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationHeader } from "@/components/navigation-header"
import { GradientButton } from "@/components/ui/gradient-button"
import { StatCard } from "@/components/ui/stat-card"
import { Calendar, MapPin, Users, UserPlus, MessageCircle, Trophy, Star, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock user data - in a real app, this would be fetched based on the ID
const userData = {
  id: "2",
  username: "mikechen",
  displayName: "Mike Chen",
  bio: "Fantasy football enthusiast and data analyst. Always looking for the next sleeper pick! 🏈📊",
  avatar: "/placeholder-user.jpg",
  joinedDate: "March 2023",
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

export default function UserProfile() {
  const params = useParams()
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing)
  const [followerCount, setFollowerCount] = useState(userData.followers)

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1)
  }

  const publicRankings = userData.recentRankings.filter((ranking) => ranking.isPublic)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {userData.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{userData.displayName}</h1>
                    <p className="text-slate-600 dark:text-slate-400">@{userData.username}</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <GradientButton
                      onClick={handleFollowToggle}
                      variant={isFollowing ? "following" : "default"}
                      icon={UserPlus}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </GradientButton>
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>

                {/* Featured Badges */}
                {userData.featuredBadges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {userData.featuredBadges.map((badge, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 dark:from-blue-900/20 dark:to-green-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        title={badge.description}
                      >
                        <Trophy className="w-3 h-3 mr-1" />
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-slate-700 dark:text-slate-300 mb-4">{userData.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {userData.joinedDate}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userData.location}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <strong>{followerCount}</strong> followers
                    </span>
                    <span>
                      <strong>{userData.following}</strong> following
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Overall Accuracy"
            value={`${userData.stats.overallAccuracy}%`}
            icon={TrendingUp}
            progress={userData.stats.overallAccuracy}
          />
          <StatCard
            title="Percentile Rank"
            value={`${userData.stats.percentile}%`}
            subtitle="among all users"
            icon={Award}
          />
          <StatCard
            title="Season Rank"
            value={`#${userData.stats.seasonRank}`}
            subtitle="out of 12,847 users"
            icon={Trophy}
          />
          <StatCard
            title="Total Rankings"
            value={userData.stats.totalRankings.toString()}
            subtitle="this season"
            icon={Star}
          />
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="rankings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="rankings">
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
                      href={`/rankings?week=${ranking.week.toLowerCase().replace(" ", "")}&position=${ranking.position.toLowerCase()}`}
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
                        <div className="text-right">
                          <div className="font-semibold text-green-600 dark:text-green-400">{ranking.accuracy}%</div>
                          <div className="text-xs text-slate-500">accuracy</div>
                        </div>
                      </div>
                    </Link>
                  ))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.achievements.map((achievement) => {
                    const IconComponent = achievement.icon
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg ${
                          achievement.earned
                            ? "bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              achievement.earned
                                ? "bg-gradient-to-br from-blue-500 to-green-500 text-white"
                                : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{achievement.description}</p>
                            {achievement.earned && achievement.date && (
                              <Badge variant="outline" className="text-xs">
                                Earned {achievement.date}
                              </Badge>
                            )}
                            {!achievement.earned && (
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
