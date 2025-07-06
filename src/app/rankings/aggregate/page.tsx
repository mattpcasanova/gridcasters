"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import { Checkbox } from "@/components/ui/checkbox"
import { CircularProgress } from "@/components/ui/circular-progress"
import {
  Filter,
  Save,
  Share,
  X,
  Plus,
  Minus,
  BarChart3,
  Users,
  Settings,
  TrendingUp,
  TrendingDown,
  Star,
  Trophy,
} from "lucide-react"
import Link from "next/link"

// Mock data for aggregate rankings
const mockPlayers = [
  {
    id: 1,
    name: "Josh Allen",
    position: "QB",
    team: "BUF",
    avgRank: { overall: 2.3, qb: 1.8, flex: 2.1 },
    rankings: 847,
    accuracy: 89.2,
    trend: "up",
  },
  {
    id: 2,
    name: "Christian McCaffrey",
    position: "RB",
    team: "SF",
    avgRank: { overall: 1.2, rb: 1.1, flex: 1.0 },
    rankings: 923,
    accuracy: 91.7,
    trend: "up",
  },
  {
    id: 3,
    name: "Cooper Kupp",
    position: "WR",
    team: "LAR",
    avgRank: { overall: 3.8, wr: 2.1, flex: 3.2 },
    rankings: 756,
    accuracy: 87.4,
    trend: "down",
  },
  {
    id: 4,
    name: "Travis Kelce",
    position: "TE",
    team: "KC",
    avgRank: { overall: 8.9, te: 1.2, flex: 7.8 },
    rankings: 634,
    accuracy: 85.9,
    trend: "neutral",
  },
  {
    id: 5,
    name: "Stefon Diggs",
    position: "WR",
    team: "BUF",
    avgRank: { overall: 5.2, wr: 3.4, flex: 4.8 },
    rankings: 689,
    accuracy: 88.1,
    trend: "up",
  },
]

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

const getAvgRankText = (filter: string) => {
  switch (filter) {
    case "overall":
      return "Avg OVR Rank"
    case "qb":
      return "Avg QB Rank"
    case "rb":
      return "Avg RB Rank"
    case "wr":
      return "Avg WR Rank"
    case "te":
      return "Avg TE Rank"
    case "flex":
      return "Avg FLX Rank"
    default:
      return "Avg OVR Rank"
  }
}

export default function AggregateRankings() {
  const [positionFilter, setPositionFilter] = useState("all")
  const [weekFilter, setWeekFilter] = useState("current")
  const [minRankings, setMinRankings] = useState("10")
  const [aggregateName, setAggregateName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const filteredPlayers = mockPlayers.filter((player) => {
    if (positionFilter === "all") return true
    return player.position === positionFilter.toUpperCase()
  })

  const handleSaveAggregate = async () => {
    if (!aggregateName.trim()) {
      alert("Please enter a name for your aggregate ranking")
      return
    }

    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert(`Aggregate ranking "${aggregateName}" saved successfully!`)
    setAggregateName("")
  }

  const getAvgRankForFilter = (player: any) => {
    switch (positionFilter) {
      case "qb":
        return player.avgRank.qb
      case "rb":
        return player.avgRank.rb
      case "wr":
        return player.avgRank.wr
      case "te":
        return player.avgRank.te
      case "flex":
        return player.avgRank.flex
      default:
        return player.avgRank.overall
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Aggregate Rankings</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Community-driven rankings based on thousands of user submissions
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="qb">QB</SelectItem>
                    <SelectItem value="rb">RB</SelectItem>
                    <SelectItem value="wr">WR</SelectItem>
                    <SelectItem value="te">TE</SelectItem>
                    <SelectItem value="flex">FLEX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Week</Label>
                <Select value={weekFilter} onValueChange={setWeekFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Week</SelectItem>
                    <SelectItem value="week7">Week 7</SelectItem>
                    <SelectItem value="week6">Week 6</SelectItem>
                    <SelectItem value="week5">Week 5</SelectItem>
                    <SelectItem value="season">Full Season</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Min Rankings</Label>
                <Select value={minRankings} onValueChange={setMinRankings}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5+ Rankings</SelectItem>
                    <SelectItem value="10">10+ Rankings</SelectItem>
                    <SelectItem value="25">25+ Rankings</SelectItem>
                    <SelectItem value="50">50+ Rankings</SelectItem>
                    <SelectItem value="100">100+ Rankings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Save Aggregate</Label>
                <div className="flex space-x-2">
                  <Input
                    key="aggregate-name-input"
                    placeholder="Enter name..."
                    value={aggregateName}
                    onChange={(e) => setAggregateName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveAggregate} disabled={isSaving} size="sm">
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Rankings</p>
                  <p className="text-2xl font-bold">3,249</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Contributors</p>
                  <p className="text-2xl font-bold">1,847</p>
                </div>
                <Trophy className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Accuracy</p>
                  <p className="text-2xl font-bold">88.4%</p>
                </div>
                <CircularProgress value={88.4} size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Last Updated</p>
                  <p className="text-2xl font-bold">2h ago</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rankings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Community Rankings</CardTitle>
            <CardDescription>
              Rankings aggregated from {filteredPlayers.reduce((sum, p) => sum + p.rankings, 0)} community submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-slate-400 w-8">{index + 1}</div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {player.position}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{player.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPositionColor(player.position)} variant="outline">
                          {player.position}
                        </Badge>
                        <span className="text-sm text-slate-500">{player.team}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{getAvgRankForFilter(player).toFixed(1)}</div>
                      <div className="text-xs text-slate-500">{getAvgRankText(positionFilter)}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold">{player.rankings}</div>
                      <div className="text-xs text-slate-500">Rankings</div>
                    </div>

                    <div className="text-center">
                      <CircularProgress value={player.accuracy} size={50} />
                      <div className="text-xs text-slate-500 mt-1">Accuracy</div>
                    </div>

                    <div className="text-center">
                      {player.trend === "up" ? (
                        <TrendingUp className="w-6 h-6 text-green-500 mx-auto" />
                      ) : player.trend === "down" ? (
                        <TrendingUp className="w-6 h-6 text-red-500 mx-auto rotate-180" />
                      ) : (
                        <div className="w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto" />
                      )}
                      <div className="text-xs text-slate-500 mt-1">Trend</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 