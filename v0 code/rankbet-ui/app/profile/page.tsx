"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { NavigationHeader } from "@/components/navigation-header"
import { CircularProgress } from "@/components/ui/circular-progress"
import { GradientButton } from "@/components/ui/gradient-button"
import {
  Award,
  Edit,
  Save,
  X,
  Calendar,
  Share,
  Settings,
  BarChart3,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import * as React from "react"

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

const achievements = [
  {
    id: 1,
    name: "Expert Analyst",
    description: "RankBet verified expert",
    earned: true,
    percentage: 2.1,
    category: "special",
  },
  {
    id: 2,
    name: "90% Accuracy",
    description: "Achieved 90%+ accuracy on a ranking",
    earned: true,
    percentage: 15.3,
    category: "weekly",
  },
  {
    id: 3,
    name: "95% Accuracy",
    description: "Achieved 95%+ accuracy on a ranking",
    earned: true,
    percentage: 8.7,
    category: "weekly",
  },
  {
    id: 4,
    name: "Perfect Score",
    description: "Achieved 100% accuracy on a ranking",
    earned: false,
    percentage: 1.2,
    category: "weekly",
  },
  {
    id: 5,
    name: "Triple Threat",
    description: "90%+ accuracy on 3 separate rankings",
    earned: true,
    percentage: 12.4,
    category: "consistency",
  },
  {
    id: 6,
    name: "Consistency King",
    description: "90%+ accuracy on 5 separate rankings",
    earned: true,
    percentage: 6.8,
    category: "consistency",
  },
  {
    id: 7,
    name: "Perfect Streak",
    description: "90%+ accuracy on 10 separate rankings",
    earned: false,
    percentage: 2.3,
    category: "consistency",
  },
  {
    id: 8,
    name: "Top 10%",
    description: "Reached top 10% in any ranking",
    earned: true,
    percentage: 18.9,
    category: "ranking",
  },
  {
    id: 9,
    name: "Top 5%",
    description: "Reached top 5% in any ranking",
    earned: true,
    percentage: 9.4,
    category: "ranking",
  },
  {
    id: 10,
    name: "Elite 1%",
    description: "Reached top 1% in any ranking",
    earned: false,
    percentage: 3.1,
    category: "ranking",
  },
  {
    id: 11,
    name: "Weekly Champion",
    description: "Ranked #1 overall for any week",
    earned: false,
    percentage: 0.8,
    category: "champion",
  },
  {
    id: 12,
    name: "First Timer",
    description: "Created your first ranking",
    earned: true,
    percentage: 89.2,
    category: "milestone",
  },
  {
    id: 13,
    name: "Getting Started",
    description: "Created 5 rankings",
    earned: true,
    percentage: 45.6,
    category: "milestone",
  },
  {
    id: 14,
    name: "Veteran Ranker",
    description: "Created 10 rankings",
    earned: true,
    percentage: 23.7,
    category: "milestone",
  },
  {
    id: 15,
    name: "Community Leader",
    description: "1000+ followers",
    earned: false,
    percentage: 4.2,
    category: "social",
  },
]

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
}: {
  title: string
  value: React.ReactNode
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
    icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  }
  progress?: number
}) {
  // Helper to render either a component **type** or an element
  const renderIcon = (
    IconOrElement?: React.ComponentType<{ className?: string }> | React.ReactNode,
    className = "",
  ) => {
    // If it's an existing element, just return it.
    // Otherwise treat it as a component type (function or forwardRef object) and render it.
    if (!IconOrElement) return null
    if (React.isValidElement(IconOrElement)) {
      return IconOrElement
    }
    const Cmp = IconOrElement as React.ComponentType<{ className?: string }>
    return <Cmp className={className} />
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</span>
          {renderIcon(icon, "w-4 h-4 text-slate-500")}
        </div>

        <div className="text-2xl font-bold mb-1">{value}</div>

        {subtitle && <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{subtitle}</div>}

        {progress !== undefined && <Progress value={progress} className="h-2 mb-2" />}

        {trend && (
          <div className="flex items-center space-x-1 text-xs">
            {renderIcon(trend.icon, "w-3 h-3")}
            <span
              className={
                trend.direction === "up"
                  ? "text-green-600 dark:text-green-400"
                  : trend.direction === "down"
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-600 dark:text-slate-400"
              }
            >
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(
    "Fantasy football enthusiast and data analyst. Always looking to improve my rankings and help others do the same!",
  )
  const [tempBio, setTempBio] = useState(bio)
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedBadges, setSelectedBadges] = useState([1, 5, 8]) // IDs of selected badges
  const [showShareModal, setShowShareModal] = useState(false)

  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "rankings"

  const handleSave = () => {
    setBio(tempBio)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempBio(bio)
    setIsEditing(false)
  }

  const toggleBadgeSelection = (badgeId: number) => {
    if (selectedBadges.includes(badgeId)) {
      setSelectedBadges(selectedBadges.filter((id) => id !== badgeId))
    } else if (selectedBadges.length < 3) {
      setSelectedBadges([...selectedBadges, badgeId])
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
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">@johndoe</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">
            <input
              type="text"
              value="https://rankbet.com/user/johndoe"
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button size="sm" onClick={() => navigator.clipboard.writeText("https://rankbet.com/user/johndoe")}>
              Copy
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1 bg-transparent" variant="outline">
              Twitter
            </Button>
            <Button className="flex-1 bg-transparent" variant="outline">
              Facebook
            </Button>
            <Button className="flex-1 bg-transparent" variant="outline">
              Instagram
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">John Doe</h1>
                    <Badge variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      {isPrivate ? "Private" : "Public"}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">@johndoe • Joined January 2024</p>

                  {/* Featured Badges */}
                  <div className="flex items-center space-x-2 mb-4">
                    {selectedBadges.map((badgeId) => {
                      const badge = achievements.find((a) => a.id === badgeId)
                      if (!badge || !badge.earned) return null
                      return (
                        <div
                          key={badgeId}
                          className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full"
                        >
                          <Award className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">{badge.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="min-h-[80px]"
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-slate-700 dark:text-slate-300">{bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <CircularProgress value={87.3} size={60} />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <CircularProgress value={97.2} size={60} />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">97.2nd Percentile</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">247</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">98</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Rankings</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={() => setShowShareModal(true)}>
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rankings">My Rankings</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="rankings">
            <Card>
              <CardHeader>
                <CardTitle>My Rankings</CardTitle>
                <CardDescription>Your recent player rankings and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { week: "Week 8", position: "QB", accuracy: null, status: "active" },
                    { week: "Week 8", position: "RB", accuracy: null, status: "active" },
                    { week: "Week 8", position: "WR", accuracy: null, status: "active" },
                    { week: "Week 7", position: "QB", accuracy: 92, status: "completed" },
                    { week: "Week 7", position: "RB", accuracy: 85, status: "completed" },
                    { week: "Week 7", position: "WR", accuracy: 78, status: "completed" },
                    { week: "Week 7", position: "TE", accuracy: 88, status: "completed" },
                    { week: "Week 6", position: "QB", accuracy: 94, status: "completed" },
                    { week: "Week 6", position: "RB", accuracy: 89, status: "completed" },
                  ].map((ranking, index) => (
                    <Link key={index} href={`/rankings?week=${ranking.week}&position=${ranking.position}`}>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="font-medium">{ranking.week}</span>
                            </div>
                            <Badge variant={ranking.status === "active" ? "default" : "secondary"}>
                              {ranking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={`${getPositionColor(ranking.position)} font-bold`}>
                              {ranking.position}
                            </Badge>
                            {ranking.accuracy ? (
                              <CircularProgress value={ranking.accuracy} size={45} />
                            ) : (
                              <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                <span className="text-xs text-slate-500">Pending</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Featured Badges</CardTitle>
                  <CardDescription>
                    Select up to 3 badges to showcase on your profile (click to select/deselect)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {achievements
                      .filter((a) => a.earned)
                      .map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-4 border rounded-lg text-center cursor-pointer transition-all ${
                            selectedBadges.includes(achievement.id)
                              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                          onClick={() => toggleBadgeSelection(achievement.id)}
                        >
                          <Award className="w-8 h-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
                          <h3 className="font-semibold text-sm">{achievement.name}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{achievement.description}</p>
                          <p className="text-xs text-slate-500 mt-2">{achievement.percentage}% of users</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Achievements</CardTitle>
                  <CardDescription>Your progress towards earning all badges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg text-center ${
                          achievement.earned
                            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                            : "opacity-50"
                        }`}
                      >
                        <Award
                          className={`w-8 h-8 mx-auto mb-2 ${
                            achievement.earned ? "text-yellow-600 dark:text-yellow-400" : "text-slate-400"
                          }`}
                        />
                        <h3 className="font-semibold text-sm">{achievement.name}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{achievement.description}</p>
                        <p className="text-xs text-slate-500 mt-2">{achievement.percentage}% of users</p>
                        {achievement.earned && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Season Average"
                  value="87.3%"
                  icon={BarChart3}
                  trend={{ value: "+2.1% vs last season", direction: "up", icon: TrendingUp }}
                  progress={87.3}
                />
                <StatCard title="Best Week" value="94.2%" subtitle="Week 6 - QB Rankings" icon={Trophy} />
                <StatCard
                  title="Consistency Score"
                  value="8.7/10"
                  subtitle="Low variance across weeks"
                  icon={Target}
                  progress={87}
                />
                <StatCard
                  title="Rank Improvement"
                  value="+47 spots"
                  subtitle="From #203 to #156"
                  icon={TrendingUp}
                  trend={{ value: "Since Week 1", direction: "up", icon: TrendingUp }}
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Accuracy Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Accuracy Trend</CardTitle>
                    <CardDescription>Your accuracy performance over the season</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { week: "Week 8", accuracy: null, status: "pending", rankings: 6 },
                        { week: "Week 7", accuracy: 87, status: "completed", rankings: 4, change: "+2.1%" },
                        { week: "Week 6", accuracy: 85, status: "completed", rankings: 4, change: "+3.2%" },
                        { week: "Week 5", accuracy: 82, status: "completed", rankings: 3, change: "-1.8%" },
                        { week: "Week 4", accuracy: 79, status: "completed", rankings: 4, change: "+4.1%" },
                        { week: "Week 3", accuracy: 76, status: "completed", rankings: 2, change: "-2.3%" },
                        { week: "Week 2", accuracy: 78, status: "completed", rankings: 3, change: "+1.9%" },
                        { week: "Week 1", accuracy: 74, status: "completed", rankings: 2, change: "baseline" },
                      ].map((week, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium w-16">{week.week}</span>
                            <Badge variant="outline" className="text-xs">
                              {week.rankings} rankings
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3">
                            {week.accuracy ? (
                              <>
                                <Progress value={week.accuracy} className="w-20" />
                                <span className="text-sm font-medium w-12">{week.accuracy}%</span>
                                {week.change !== "baseline" && (
                                  <span
                                    className={`text-xs w-16 text-right ${week.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {week.change}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-slate-400 w-32 text-right">Pending results</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Position Performance Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Position Strengths</CardTitle>
                    <CardDescription>Your accuracy by position this season</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { position: "QB", accuracy: 91.3, rankings: 12, trend: "up", color: "text-red-600" },
                        { position: "TE", accuracy: 89.3, rankings: 8, trend: "up", color: "text-yellow-600" },
                        { position: "RB", accuracy: 87.0, rankings: 15, trend: "neutral", color: "text-green-600" },
                        { position: "WR", accuracy: 81.7, rankings: 18, trend: "down", color: "text-blue-600" },
                      ].map((pos, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getPositionColor(pos.position)} font-bold`}>{pos.position}</Badge>
                              <span className="text-sm">{pos.rankings} rankings</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {pos.trend === "up" ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              ) : pos.trend === "down" ? (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                              ) : (
                                <Minus className="w-3 h-3 text-slate-400" />
                              )}
                              <span className={`text-sm font-semibold ${pos.color}`}>{pos.accuracy}%</span>
                            </div>
                          </div>
                          <Progress value={pos.accuracy} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Ranking Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ranking Distribution</CardTitle>
                    <CardDescription>Where you typically rank players</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { range: "Top 5", percentage: 23, count: 34 },
                        { range: "6-15", percentage: 31, count: 46 },
                        { range: "16-30", percentage: 28, count: 41 },
                        { range: "31-50", percentage: 18, count: 27 },
                      ].map((range, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{range.range}</span>
                          <div className="flex items-center space-x-3">
                            <Progress value={range.percentage} className="w-24" />
                            <span className="text-sm text-slate-600 dark:text-slate-400 w-12">{range.count}</span>
                            <span className="text-sm font-medium w-8">{range.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Accuracy Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Insights</CardTitle>
                    <CardDescription>Key patterns in your rankings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center space-x-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-300">Strength</span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          You excel at identifying QB sleepers - 94% accuracy on QBs ranked 15-25
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center space-x-2 mb-1">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Trend</span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Your accuracy improves 12% when you rank players within 3 spots of consensus
                        </p>
                      </div>

                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center space-x-2 mb-1">
                          <Target className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Opportunity</span>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          Consider being more aggressive with WR rankings - you tend to be conservative
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Performance Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Performance History</CardTitle>
                  <CardDescription>Complete breakdown of your ranking accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week</TableHead>
                        <TableHead>QB</TableHead>
                        <TableHead>RB</TableHead>
                        <TableHead>WR</TableHead>
                        <TableHead>TE</TableHead>
                        <TableHead>Overall</TableHead>
                        <TableHead>Rank Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { week: "Week 7", qb: 92, rb: 85, wr: 78, te: 88, overall: 86, change: "+12" },
                        { week: "Week 6", qb: 94, rb: 89, wr: 82, te: 91, overall: 89, change: "+8" },
                        { week: "Week 5", qb: 88, rb: 87, wr: 85, te: 89, overall: 87, change: "+3" },
                        { week: "Week 4", qb: 85, rb: 82, wr: 79, te: 86, overall: 83, change: "-5" },
                        { week: "Week 3", qb: 89, rb: 78, wr: 74, te: 82, overall: 81, change: "+15" },
                        { week: "Week 2", qb: 91, rb: 83, wr: 77, te: 85, overall: 84, change: "+7" },
                        { week: "Week 1", qb: 87, rb: 76, wr: 72, te: 79, overall: 79, change: "baseline" },
                      ].map((week, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{week.week}</TableCell>
                          <TableCell
                            className={
                              week.qb >= 90 ? "text-green-600" : week.qb >= 80 ? "text-yellow-600" : "text-red-600"
                            }
                          >
                            {week.qb}%
                          </TableCell>
                          <TableCell
                            className={
                              week.rb >= 90 ? "text-green-600" : week.rb >= 80 ? "text-yellow-600" : "text-red-600"
                            }
                          >
                            {week.rb}%
                          </TableCell>
                          <TableCell
                            className={
                              week.wr >= 90 ? "text-green-600" : week.wr >= 80 ? "text-yellow-600" : "text-red-600"
                            }
                          >
                            {week.wr}%
                          </TableCell>
                          <TableCell
                            className={
                              week.te >= 90 ? "text-green-600" : week.te >= 80 ? "text-yellow-600" : "text-red-600"
                            }
                          >
                            {week.te}%
                          </TableCell>
                          <TableCell
                            className={
                              week.overall >= 90
                                ? "text-green-600"
                                : week.overall >= 80
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          >
                            {week.overall}%
                          </TableCell>
                          <TableCell>
                            {week.change === "baseline" ? (
                              <span className="text-slate-500">-</span>
                            ) : (
                              <span className={week.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                                {week.change}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your profile privacy and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Private Account</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      When enabled, users must request to follow you to see your rankings and detailed stats
                    </p>
                  </div>
                  <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Profile Avatar</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="display-name" className="text-base">
                    Display Name
                  </Label>
                  <Input id="display-name" defaultValue="John Doe" />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="username" className="text-base">
                    Username
                  </Label>
                  <Input id="username" defaultValue="johndoe" />
                </div>

                <div className="pt-4 border-t">
                  <GradientButton>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </GradientButton>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showShareModal && <ShareModal />}
    </div>
  )
}
