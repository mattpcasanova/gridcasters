import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavigationHeader } from "@/components/navigation-header"
import { StatCard } from "@/components/ui/stat-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { BarChart3, TrendingUp, Trophy, Users, Target, Plus, ArrowUp, ArrowDown, Minus } from "lucide-react"
import Link from "next/link"

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

export default function Dashboard() {
  const rightButtons = (
    <>
      <Link href="/rankings">
        <GradientButton size="sm" icon={<Plus className="w-4 h-4" />}>
          New Ranking
        </GradientButton>
      </Link>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader rightButtons={rightButtons} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-slate-600 dark:text-slate-400">Here's how your rankings are performing this week.</p>
        </div>

        {/* Leaderboard Selection */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leaderboard View</CardTitle>
                <Select defaultValue="global">
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
            value="#3"
            icon={Trophy}
            trend={{ value: "+2 positions", direction: "up", icon: ArrowUp }}
            subtitle="in Global Rankings"
          />

          <StatCard
            title="Week 8 Rankings"
            value="6"
            icon={Target}
            trend={{ value: "Active this week", direction: "neutral", icon: Minus }}
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
                  {[
                    {
                      name: "Week 8 QB Rankings",
                      accuracy: null,
                      trend: "up",
                      date: "2 days ago",
                      position: "QB",
                      status: "active",
                      week: "week8",
                    },
                    {
                      name: "Week 8 RB Rankings",
                      accuracy: null,
                      trend: "up",
                      date: "3 days ago",
                      position: "RB",
                      status: "active",
                      week: "week8",
                    },
                    {
                      name: "Week 8 WR Rankings",
                      accuracy: null,
                      trend: "up",
                      date: "4 days ago",
                      position: "WR",
                      status: "active",
                      week: "week8",
                    },
                    {
                      name: "Week 7 QB Rankings",
                      accuracy: 92,
                      trend: "up",
                      date: "1 week ago",
                      position: "QB",
                      status: "completed",
                      week: "week7",
                    },
                    {
                      name: "Week 7 RB Rankings",
                      accuracy: 85,
                      trend: "up",
                      date: "1 week ago",
                      position: "RB",
                      status: "completed",
                      week: "week7",
                    },
                    {
                      name: "Week 7 WR Rankings",
                      accuracy: 78,
                      trend: "down",
                      date: "1 week ago",
                      position: "WR",
                      status: "completed",
                      week: "week7",
                    },
                  ].map((ranking, index) => (
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
                            <p className="font-medium">{ranking.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{ranking.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {ranking.accuracy ? (
                            <Badge variant={ranking.accuracy > 85 ? "default" : "secondary"}>
                              {ranking.accuracy}% accuracy
                            </Badge>
                          ) : (
                            <Badge variant="outline">{ranking.status === "active" ? "Pending" : "No data"}</Badge>
                          )}
                          {ranking.trend === "up" ? (
                            <ArrowUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/rankings">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Rankings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Your accuracy trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { week: "Week 7", accuracy: 87, status: "completed" },
                    { week: "Week 6", accuracy: 85, status: "completed" },
                    { week: "Week 5", accuracy: 82, status: "completed" },
                    { week: "Week 4", accuracy: 79, status: "completed" },
                  ].map((week, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{week.week}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={week.accuracy} className="w-20" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{week.accuracy}%</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between opacity-50">
                    <span className="text-sm font-medium">Week 8</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <span className="text-sm text-slate-400">Pending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
                <CardDescription>Top performers this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Mike Chen", accuracy: 94.2, rank: 1 },
                    { name: "Sarah Johnson", accuracy: 91.8, rank: 2 },
                    { name: "You", accuracy: 87.3, rank: 3, isUser: true },
                    { name: "Alex Rodriguez", accuracy: 85.1, rank: 4 },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded ${user.isUser ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            user.rank === 1
                              ? "bg-yellow-500 text-white"
                              : user.rank === 2
                                ? "bg-gray-400 text-white"
                                : user.rank === 3
                                  ? "bg-orange-500 text-white"
                                  : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        >
                          {user.rank}
                        </div>
                        <span className={`text-sm ${user.isUser ? "font-semibold" : ""}`}>{user.name}</span>
                      </div>
                      <span className="text-sm font-medium">{user.accuracy}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/leaderboard">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Full Leaderboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/rankings">
                  <GradientButton className="w-full justify-start" icon={<Plus className="w-4 h-4" />}>
                    Create New Ranking
                  </GradientButton>
                </Link>
                <Link href="/profile?tab=analytics">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/find-users">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Find Friends & Groups
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
