"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavigationHeader } from "@/components/navigation-header"
import { SearchInput } from "@/components/ui/search-input"
import { StatCard } from "@/components/ui/stat-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Trophy, Medal, Award, TrendingUp, Users, Target, Plus, UserCheck } from "lucide-react"
import Link from "next/link"

const leaderboardData = [
  {
    id: 1,
    name: "Mike Chen",
    username: "@mikechen",
    accuracy: 94.2,
    weeklyChange: 2.1,
    totalRankings: 156,
    followers: 1247,
    avatar: "/placeholder-user.jpg",
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
    avatar: "/placeholder-user.jpg",
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
    avatar: "/placeholder-user.jpg",
    isCurrentUser: true,
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    username: "@alexr",
    accuracy: 85.1,
    weeklyChange: -1.2,
    totalRankings: 134,
    followers: 567,
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
    isFollowing: true,
  },
  {
    id: 6,
    name: "David Kim",
    username: "@davidk",
    accuracy: 82.4,
    weeklyChange: 0.3,
    totalRankings: 167,
    followers: 789,
    isFollowing: false,
  },
  {
    id: 7,
    name: "Lisa Brown",
    username: "@lisab",
    accuracy: 81.9,
    weeklyChange: -2.1,
    totalRankings: 123,
    followers: 334,
    isFollowing: false,
  },
  {
    id: 8,
    name: "Ryan Taylor",
    username: "@ryant",
    accuracy: 80.6,
    weeklyChange: 1.5,
    totalRankings: 78,
    followers: 156,
    isFollowing: false,
  },
]

const groupData = [
  {
    id: 1,
    name: "Fantasy Experts",
    members: 247,
    avgAccuracy: 89.4,
    avatar: "/placeholder-group.jpg",
  },
  {
    id: 2,
    name: "College Friends",
    members: 12,
    avgAccuracy: 82.1,
    avatar: "/placeholder-group.jpg",
  },
  {
    id: 3,
    name: "NFL Analysts",
    members: 156,
    avgAccuracy: 91.2,
    avatar: "/placeholder-group.jpg",
  },
]

export default function Leaderboard() {
  const [followingUsers, setFollowingUsers] = useState<number[]>(
    leaderboardData.filter((user) => user.isFollowing).map((user) => user.id),
  )

  const toggleFollow = (userId: number) => {
    setFollowingUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
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

  const rightButtons = (
    <>
      <Link href="/rankings">
        <GradientButton size="sm" icon={Plus}>
          New Ranking
        </GradientButton>
      </Link>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader rightButtons={rightButtons} />

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

          <StatCard title="Total Players" value="2,847" icon={Users} subtitle="Active this week" />

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

                          {/* User Info - Clickable */}
                          <Link
                            href={`/user/${user.id}?from=leaderboard`}
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                          >
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <div className="flex items-center space-x-2">
                                <p
                                  className={`font-semibold ${user.isCurrentUser ? "text-blue-600 dark:text-blue-400" : ""}`}
                                >
                                  {user.name}
                                </p>
                                {user.isCurrentUser && (
                                  <Badge variant="outline" className="text-xs">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{user.username}</p>
                            </div>
                          </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-6 text-right">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-bold text-lg">{user.accuracy}%</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">accuracy</p>
                            </div>
                            <CircularProgress value={user.accuracy} size={45} />
                          </div>

                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            <p>{user.totalRankings} rankings</p>
                            <p>{user.followers} followers</p>
                          </div>

                          {user.isCurrentUser ? (
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/profile">View Profile</Link>
                            </Button>
                          ) : followingUsers.includes(user.id) ? (
                            <GradientButton size="sm" onClick={() => toggleFollow(user.id)} className="min-w-[100px]">
                              <UserCheck className="w-4 h-4 mr-1" />
                              Following
                            </GradientButton>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleFollow(user.id)}
                              className="min-w-[100px]"
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Showing your position and nearby competitors
                  </p>
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
                    <CardDescription>Top performers by week</CardDescription>
                  </div>
                  <Select defaultValue="week8">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preseason">Pre-Season</SelectItem>
                      <SelectItem value="week8">Week 8</SelectItem>
                      <SelectItem value="week7">Week 7</SelectItem>
                      <SelectItem value="week6">Week 6</SelectItem>
                      <SelectItem value="week5">Week 5</SelectItem>
                      <SelectItem value="week4">Week 4</SelectItem>
                      <SelectItem value="week3">Week 3</SelectItem>
                      <SelectItem value="week2">Week 2</SelectItem>
                      <SelectItem value="week1">Week 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <SearchInput placeholder="Search users..." className="max-w-md mt-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.slice(0, 5).map((user, index) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        user.isCurrentUser
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0
                              ? "bg-yellow-500 text-white"
                              : index === 1
                                ? "bg-gray-400 text-white"
                                : index === 2
                                  ? "bg-orange-500 text-white"
                                  : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <Link
                          href={`/user/${user.id}?from=leaderboard`}
                          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p
                              className={`font-semibold ${user.isCurrentUser ? "text-blue-600 dark:text-blue-400" : ""}`}
                            >
                              {user.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{user.username}</p>
                          </div>
                        </Link>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-bold text-lg">{user.accuracy}%</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Week 8 accuracy</p>
                        </div>
                        <CircularProgress value={user.accuracy} size={45} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <CardTitle>Friends Leaderboard</CardTitle>
                <CardDescription>People you're following ranked by accuracy</CardDescription>
                <SearchInput placeholder="Search friends..." className="max-w-md mt-4" />
              </CardHeader>
              <CardContent>
                {friendsList.length > 0 ? (
                  <div className="space-y-4">
                    {friendsList
                      .sort((a, b) => b.accuracy - a.accuracy)
                      .map((user, friendsRank) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                friendsRank === 0
                                  ? "bg-yellow-500 text-white"
                                  : friendsRank === 1
                                    ? "bg-gray-400 text-white"
                                    : friendsRank === 2
                                      ? "bg-orange-500 text-white"
                                      : "bg-slate-200 dark:bg-slate-700"
                              }`}
                            >
                              {friendsRank + 1}
                            </div>

                            <Link
                              href={`/user/${user.id}?from=leaderboard`}
                              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{user.username}</p>
                              </div>
                            </Link>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-bold text-lg">{user.accuracy}%</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">accuracy</p>
                            </div>
                            <CircularProgress value={user.accuracy} size={45} />
                            <GradientButton size="sm" onClick={() => toggleFollow(user.id)} className="min-w-[100px]">
                              <UserCheck className="w-4 h-4 mr-1" />
                              Following
                            </GradientButton>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>You're not following anyone yet</p>
                    <Link href="/find-users">
                      <GradientButton className="mt-4">Find Friends</GradientButton>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Group Leaderboards</CardTitle>
                <CardDescription>Click on a group to view details</CardDescription>
                <SearchInput placeholder="Search groups..." className="max-w-md mt-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupData.map((group, index) => (
                    <Link key={group.id} href={`/group/${group.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                  ? "bg-gray-400 text-white"
                                  : index === 2
                                    ? "bg-orange-500 text-white"
                                    : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={group.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              <Users className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{group.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{group.members} members</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-bold text-lg">{group.avgAccuracy}%</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">avg accuracy</p>
                          </div>
                          <CircularProgress value={group.avgAccuracy} size={45} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/find-users?tab=groups">
                    <GradientButton>Browse Groups</GradientButton>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
