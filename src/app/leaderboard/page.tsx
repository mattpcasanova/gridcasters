"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationHeader } from "@/components/layout/navigation-header"
import { SearchInput } from "@/components/ui/search-input"
import { StatCard } from "@/components/ui/stat-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Trophy, Medal, Award, TrendingUp, Users, Target, Plus, UserCheck } from "lucide-react"
import Link from "next/link"

// Mock data - replace with real data from Supabase
interface LeaderboardUser {
  id: number
  name: string
  username: string
  accuracy: number
  weeklyChange: number
  totalRankings: number
  followers: number
  avatar: string
  isFollowing: boolean
  isCurrentUser?: boolean
}

const leaderboardData: LeaderboardUser[] = [
  {
    id: 1,
    name: "Mike Chen",
    username: "@mikechen",
    accuracy: 94.2,
    weeklyChange: 2.1,
    totalRankings: 156,
    followers: 1247,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    isFollowing: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    username: "@sarahj",
    accuracy: 91.8,
    weeklyChange: -0.5,
    totalRankings: 142,
    followers: 892,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    isFollowing: true,
  },
  {
    id: 3,
    name: "John Doe",
    username: "@johndoe",
    accuracy: 87.3,
    weeklyChange: 3.2,
    totalRankings: 98,
    followers: 247,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    isCurrentUser: true,
    isFollowing: false,
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    username: "@alexr",
    accuracy: 85.1,
    weeklyChange: -1.2,
    totalRankings: 134,
    followers: 567,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    isFollowing: false,
  },
  {
    id: 5,
    name: "Emma Wilson",
    username: "@emmaw",
    accuracy: 83.7,
    weeklyChange: 1.8,
    totalRankings: 89,
    followers: 423,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    isFollowing: true,
  }
]

const groupData = [
  {
    id: 1,
    name: "Fantasy Experts",
    members: 247,
    avgAccuracy: 89.4,
    avatar: "/placeholder-group.jpg",
  },
  // ... more mock data
]

export default function Leaderboard() {
  const [followingUsers, setFollowingUsers] = useState<number[]>(
    leaderboardData.filter((user) => user.isFollowing).map((user) => user.id)
  )

  const toggleFollow = (userId: number) => {
    setFollowingUsers((prev) => 
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  // Get current user's position and surrounding users
  const currentUserIndex = leaderboardData.findIndex((user) => user.isCurrentUser)
  const getGlobalLeaderboardView = () => {
    const startIndex = Math.max(0, currentUserIndex - 2)
    const endIndex = Math.min(leaderboardData.length, currentUserIndex + 3)
    return leaderboardData.slice(startIndex, endIndex)
  }

  // Get friends list (users being followed)
  const friendsList = leaderboardData.filter((user) => followingUsers.includes(user.id))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader
        rightButtons={
          <Link href="/rankings">
            <GradientButton size="sm" icon={Plus}>
              New Ranking
            </GradientButton>
          </Link>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Outrank the Competition</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Your Rank"
            value="#3"
            icon={Trophy}
            trend={{ value: "+2 positions this week", direction: "up", icon: TrendingUp }}
          />
          <StatCard 
            title="Total Players" 
            value="2,847" 
            icon={Users} 
            subtitle="Active this week" 
          />
          <StatCard
            title="Your Accuracy"
            value="87.3%"
            icon={Target}
            trend={{ value: "+3.2% this week", direction: "up", icon: TrendingUp }}
            progress={87.3}
          />
        </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="overall" className="space-y-6">
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
                <SearchInput placeholder="Search users..." className="max-w-md mt-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getGlobalLeaderboardView().map((user, index) => {
                    const actualRank = leaderboardData.findIndex((u) => u.id === user.id) + 1
                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                          user.isCurrentUser
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Rank */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              actualRank === 1
                                ? "bg-yellow-500 text-white"
                                : actualRank === 2
                                ? "bg-gray-400 text-white"
                                : actualRank === 3
                                ? "bg-orange-500 text-white"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          >
                            {actualRank <= 3 ? (
                              actualRank === 1 ? (
                                <Trophy className="w-4 h-4" />
                              ) : actualRank === 2 ? (
                                <Medal className="w-4 h-4" />
                              ) : (
                                <Award className="w-4 h-4" />
                              )
                            ) : (
                              actualRank
                            )}
                          </div>

                          {/* User Info */}
                          <Link
                            href={`/profile/${user.id}`}
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                          >
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-slate-500">{user.username}</div>
                            </div>
                          </Link>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center space-x-8">
                          <div className="text-right">
                            <div className="font-medium">{user.accuracy}%</div>
                            <div className="text-sm text-slate-500">Accuracy</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{user.totalRankings}</div>
                            <div className="text-sm text-slate-500">Rankings</div>
                          </div>
                          {!user.isCurrentUser && (
                            <Button
                              variant={followingUsers.includes(user.id) ? "secondary" : "default"}
                              size="sm"
                              onClick={() => toggleFollow(user.id)}
                            >
                              {followingUsers.includes(user.id) ? (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Following
                                </>
                              ) : (
                                "Follow"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents would go here */}
        </Tabs>
      </div>
    </div>
  )
} 