"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { X, Plus, BarChart3, TrendingUp, Save, Share, ArrowLeft, Users, Trophy, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useSleeperRankings } from "@/lib/hooks/use-sleeper-rankings"
import { getPositionColor } from "@/lib/sleeper-utils"

const availableRankings = [
  {
    id: "user1-week8-qb",
    name: "Mike Chen's Week 8 QB",
    type: "user",
    user: "Mike Chen",
    verified: true,
    accuracy: 94.2,
    week: "Week 8",
    position: "QB",
    leagueType: "Half PPR",
  },
  {
    id: "user2-week8-qb",
    name: "Sarah Johnson's Week 8 QB",
    type: "user",
    user: "Sarah Johnson",
    verified: false,
    accuracy: 91.8,
    week: "Week 8",
    position: "QB",
    leagueType: "Full PPR",
  },
  {
    id: "espn-week8-qb",
    name: "ESPN Week 8 QB Rankings",
    type: "expert",
    user: "ESPN",
    verified: true,
    accuracy: 88.5,
    week: "Week 8",
    position: "QB",
    leagueType: "Half PPR",
  },
  {
    id: "fantasypros-week8-qb",
    name: "FantasyPros Week 8 QB",
    type: "expert",
    user: "FantasyPros",
    verified: true,
    accuracy: 89.2,
    week: "Week 8",
    position: "QB",
    leagueType: "Standard",
  },
  {
    id: "user3-week8-qb",
    name: "Alex Rodriguez's Week 8 QB",
    type: "user",
    user: "Alex Rodriguez",
    verified: false,
    accuracy: 85.1,
    week: "Week 8",
    position: "QB",
    leagueType: "Half PPR",
  },
  {
    id: "user1-week7-qb",
    name: "Mike Chen's Week 7 QB",
    type: "user",
    user: "Mike Chen",
    verified: true,
    accuracy: 96.1,
    week: "Week 7",
    position: "QB",
    leagueType: "Full PPR",
  },
]

const mockCommunityPlayers = [
  {
    id: "1",
    name: "Josh Allen",
    team: "BUF",
    position: "QB",
    averageRank: 1.2,
    totalRankings: 847,
    accuracy: 89.2,
    trend: "up",
    projectedPoints: 24.8,
    rankings: [{ source: "Community Average", rank: 1.2 }],
  },
  {
    id: "2",
    name: "Lamar Jackson",
    team: "BAL",
    position: "QB",
    averageRank: 2.0,
    totalRankings: 923,
    accuracy: 91.7,
    trend: "up",
    projectedPoints: 23.2,
    rankings: [{ source: "Community Average", rank: 2.0 }],
  },
  {
    id: "3",
    name: "Jalen Hurts",
    team: "PHI",
    position: "QB",
    averageRank: 2.7,
    totalRankings: 756,
    accuracy: 87.4,
    trend: "down",
    projectedPoints: 22.1,
    rankings: [{ source: "Community Average", rank: 2.7 }],
  },
  {
    id: "4",
    name: "Patrick Mahomes",
    team: "KC",
    position: "QB",
    averageRank: 4.0,
    totalRankings: 634,
    accuracy: 85.9,
    trend: "neutral",
    projectedPoints: 21.9,
    rankings: [{ source: "Community Average", rank: 4.0 }],
  },
]

const mockAggregatedPlayers = [
  {
    id: "1",
    name: "Josh Allen",
    team: "BUF",
    position: "QB",
    averageRank: 1.2,
    totalRankings: 3,
    accuracy: 89.2,
    trend: "up",
    projectedPoints: 24.8,
    rankings: [
      { source: "Mike Chen", rank: 1 },
      { source: "ESPN", rank: 2 },
      { source: "FantasyPros", rank: 1 },
    ],
  },
  {
    id: "2",
    name: "Lamar Jackson",
    team: "BAL",
    position: "QB",
    averageRank: 2.0,
    totalRankings: 3,
    accuracy: 91.7,
    trend: "up",
    projectedPoints: 23.2,
    rankings: [
      { source: "Mike Chen", rank: 2 },
      { source: "ESPN", rank: 1 },
      { source: "FantasyPros", rank: 3 },
    ],
  },
  {
    id: "3",
    name: "Jalen Hurts",
    team: "PHI",
    position: "QB",
    averageRank: 2.7,
    totalRankings: 3,
    accuracy: 87.4,
    trend: "down",
    projectedPoints: 22.1,
    rankings: [
      { source: "Mike Chen", rank: 3 },
      { source: "ESPN", rank: 3 },
      { source: "FantasyPros", rank: 2 },
    ],
  },
  {
    id: "4",
    name: "Patrick Mahomes",
    team: "KC",
    position: "QB",
    averageRank: 4.0,
    totalRankings: 3,
    accuracy: 85.9,
    trend: "neutral",
    projectedPoints: 21.9,
    rankings: [
      { source: "Mike Chen", rank: 4 },
      { source: "ESPN", rank: 4 },
      { source: "FantasyPros", rank: 4 },
    ],
  },
]



const getLeagueTypeColor = (leagueType: string) => {
  switch (leagueType) {
    case "Standard":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    case "Half PPR":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    case "Full PPR":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
  }
}

export default function AggregateRankings() {
  const [selectedRankings, setSelectedRankings] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWeek, setSelectedWeek] = useState("Week 8")
  const [selectedPosition, setSelectedPosition] = useState("QB")
  const [selectedLeagueType, setSelectedLeagueType] = useState("Half PPR")
  const [showResults, setShowResults] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState<string | null>(null)
  const [aggregateName, setAggregateName] = useState("")
  
  // Use Sleeper API for real player data
  const { 
    players, 
    loading, 
    error, 
    currentWeek 
  } = useSleeperRankings(selectedPosition)

  const toggleRanking = (rankingId: string) => {
    if (selectedRankings.includes(rankingId)) {
      setSelectedRankings(selectedRankings.filter((id) => id !== rankingId))
    } else if (selectedRankings.length < 6) {
      setSelectedRankings([...selectedRankings, rankingId])
    } else {
      toast.error("You can select up to 6 rankings for aggregation.")
    }
  }

  const generateAggregate = () => {
    if (selectedRankings.length >= 2) {
      setShowResults(true)
    }
  }

  const handleSaveAggregate = async () => {
    if (aggregateName.trim()) {
      try {
        const response = await fetch('/api/rankings/aggregate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: aggregateName,
            players: mockAggregatedPlayers,
            position: selectedPosition,
            week: selectedWeek.replace('Week ', ''),
            season: new Date().getFullYear(),
            type: 'weekly',
            scoringFormat: 'half_ppr'
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(`Aggregate ranking "${aggregateName}" saved successfully! It will now appear in your Reference Point dropdown.`)
          setShowSaveModal(false)
          setAggregateName("")
        } else {
          toast.error(`Failed to save aggregate ranking: ${data.error}`)
        }
      } catch (error) {
        console.error('Error saving aggregate ranking:', error);
        toast.error('Failed to save aggregate ranking')
      }
    } else {
      toast.error("Please enter an aggregate name.")
    }
  }

  const filteredRankings = availableRankings.filter((ranking) => {
    const matchesSearch = ranking.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWeek = ranking.week === selectedWeek
    const matchesPosition = ranking.position === selectedPosition
    const matchesLeagueType = ranking.leagueType === selectedLeagueType
    return matchesSearch && matchesWeek && matchesPosition && matchesLeagueType
  })

  // Show community rankings by default, aggregated rankings when selections are made
  const currentPlayers = selectedRankings.length > 0 ? mockAggregatedPlayers : players.slice(0, 10).map(player => ({
    id: player.id,
    name: player.name,
    team: player.team,
    position: player.position,
    averageRank: player.rank,
    totalRankings: Math.floor(Math.random() * 500) + 200, // Mock data for now
    accuracy: Math.floor(Math.random() * 15) + 85, // Mock accuracy
    trend: Math.random() > 0.5 ? "up" : "down" as "up" | "down" | "neutral",
    projectedPoints: player.projectedPoints,
    rankings: [{ source: "Community Average", rank: player.rank }],
  }))

  const PlayerModal = ({ playerId }: { playerId: string }) => {
    const player = currentPlayers.find((p) => p.id === playerId)
    if (!player) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Player Stats</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPlayerModal(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Player Header */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={`/placeholder.svg?height=64&width=64&text=${player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}`}
                />
                <AvatarFallback>
                  {player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-xl font-bold">{player.name}</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{player.team}</Badge>
                  <Badge className={getPositionColor(player.position)}>{player.position}</Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">{player.projectedPoints}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Projected Points</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">#{player.averageRank.toFixed(1)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Average Rank</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">{player.totalRankings}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Rankings</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">{player.accuracy}%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Accuracy</p>
              </div>
            </div>

            {/* Rankings Breakdown */}
            <div>
              <h5 className="font-semibold mb-3">Ranking Sources</h5>
              <div className="space-y-2">
                {player.rankings.map((ranking, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <span className="font-medium">{ranking.source}</span>
                    <Badge variant="outline">
                      #{typeof ranking.rank === "number" ? ranking.rank : (ranking.rank as number).toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const SaveModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Save Aggregate Ranking</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowSaveModal(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Ranking Name</label>
            <Input
              key="aggregate-name-input"
              placeholder="e.g., Consensus QB Week 8"
              value={aggregateName}
              onChange={(e) => setAggregateName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This will be saved to your Reference Point dropdown for future use.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowSaveModal(false)} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <GradientButton onClick={handleSaveAggregate} className="flex-1" disabled={!aggregateName.trim()}>
              Save Ranking
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading data: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/rankings">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rankings
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Aggregate Rankings</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Combine multiple rankings from friends, experts, and platforms to create a consensus ranking
          </p>

          {/* League Type Selector */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-1 p-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              {["Standard", "Half PPR", "Full PPR"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedLeagueType(type)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedLeagueType === type
                      ? "bg-blue-500 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Selection Panel */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Week</label>
                  <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Week 8">Week 8</SelectItem>
                      <SelectItem value="Week 7">Week 7</SelectItem>
                      <SelectItem value="Week 6">Week 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Position</label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QB">QB</SelectItem>
                      <SelectItem value="RB">RB</SelectItem>
                      <SelectItem value="WR">WR</SelectItem>
                      <SelectItem value="TE">TE</SelectItem>
                      <SelectItem value="FLX">Flex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <SearchInput placeholder="Search rankings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Rankings</CardTitle>
                <CardDescription>
                  {selectedRankings.length} of {filteredRankings.length} rankings selected (min: 2, max: 6)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRankings.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Select at least 2 rankings to generate aggregate
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedRankings.map((rankingId) => {
                      const ranking = availableRankings.find((r) => r.id === rankingId)
                      if (!ranking) return null
                      return (
                        <div
                          key={rankingId}
                          className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            {ranking.verified && (
                              <Image
                                src="/logo.png"
                                alt="GridCasters Logo"
                                width={12}
                                height={12}
                                className="w-3 h-3"
                              />
                            )}
                            <span className="text-sm font-medium">{ranking.user}</span>
                            <Badge className={`text-xs ${getLeagueTypeColor(ranking.leagueType)}`}>
                              {ranking.leagueType}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRanking(rankingId)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedRankings.length >= 2 && (
                  <div className="mt-4">
                    <GradientButton onClick={generateAggregate} className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Aggregate
                    </GradientButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!showResults ? (
              <Card>
                <CardHeader>
                  <CardTitle>Available Rankings</CardTitle>
                  <CardDescription>
                    Select rankings to include in your aggregate. Choose from friends, experts, and platforms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredRankings.map((ranking) => (
                      <div
                        key={ranking.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedRankings.includes(ranking.id)
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                        onClick={() => toggleRanking(ranking.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <Checkbox checked={selectedRankings.includes(ranking.id)} />
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback className="text-xs">
                                {ranking.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">{ranking.user}</p>
                                {ranking.verified && (
                                  <Image
                                    src="/logo.png"
                                    alt="GridCasters Logo"
                                    width={16}
                                    height={16}
                                    className="w-4 h-4"
                                  />
                                )}
                                <Badge variant={ranking.type === "expert" ? "default" : "outline"} className="text-xs">
                                  {ranking.type === "expert" ? "Expert" : "User"}
                                </Badge>
                                <Badge className={`text-xs ${getLeagueTypeColor(ranking.leagueType)}`}>
                                  {ranking.leagueType}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {ranking.week} {ranking.position} Rankings
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{ranking.accuracy}%</p>
                          <p className="text-xs text-slate-500">accuracy</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span>
                      {selectedRankings.length > 0 ? "Aggregated" : "Community"} {selectedWeek} {selectedPosition}{" "}
                      Rankings
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <GradientButton size="sm" onClick={() => setShowSaveModal(true)}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Aggregate Ranking
                      </GradientButton>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {selectedRankings.length > 0
                      ? `Consensus ranking based on ${selectedRankings.length} selected sources`
                      : "Community consensus ranking from all users"}{" "}
                    • {selectedLeagueType} scoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentPlayers.map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setShowPlayerModal(player.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40&text=${player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}`}
                            />
                            <AvatarFallback>
                              {player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{player.name}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {player.team}
                              </Badge>
                              <Badge className={`text-xs ${getPositionColor(player.position)}`}>
                                {player.position}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">Avg: {player.averageRank.toFixed(1)}</p>
                            <div className="flex items-center space-x-1 text-xs text-slate-500">
                              <span>{player.totalRankings} sources</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <CircularProgress value={player.accuracy} size={40} />
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setShowResults(false)}
                      className="w-full sm:w-auto bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add More Rankings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show current rankings being displayed */}
            {selectedRankings.length === 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Community Rankings</CardTitle>
                  <CardDescription>
                    Showing community consensus rankings. Select specific rankings above to create a custom aggregate.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentPlayers.map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setShowPlayerModal(player.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40&text=${player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}`}
                            />
                            <AvatarFallback>
                              {player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{player.name}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {player.team}
                              </Badge>
                              <Badge className={`text-xs ${getPositionColor(player.position)}`}>
                                {player.position}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">Avg: {player.averageRank.toFixed(1)}</p>
                            <div className="flex items-center space-x-1 text-xs text-slate-500">
                              <span>{player.totalRankings} rankings</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <CircularProgress value={player.accuracy} size={40} />
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        {!showResults && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Available Rankings</p>
                      <p className="text-2xl font-bold">{filteredRankings.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Selected</p>
                      <p className="text-2xl font-bold">{selectedRankings.length}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Avg Accuracy</p>
                      <p className="text-2xl font-bold">
                        {selectedRankings.length > 0
                          ? Math.round(
                              selectedRankings.reduce((sum, id) => {
                                const ranking = availableRankings.find((r) => r.id === id)
                                return sum + (ranking?.accuracy || 0)
                              }, 0) / selectedRankings.length,
                            )
                          : 0}
                        %
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Ready to Generate</p>
                      <p className="text-2xl font-bold">{selectedRankings.length >= 2 ? "Yes" : "No"}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {showSaveModal && <SaveModal />}
      {showPlayerModal && <PlayerModal playerId={showPlayerModal} />}
    </div>
  )
} 