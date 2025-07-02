"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NavigationHeader } from "@/components/navigation-header"
import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import {
  Filter,
  GripVertical,
  Star,
  TrendingUp,
  TrendingDown,
  Save,
  Share,
  ChevronDown,
  X,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

const initialPlayers = [
  // QBs
  {
    id: "1",
    name: "Josh Allen",
    team: "BUF",
    position: "QB",
    projectedPoints: 24.8,
    avgRanks: { OVR: 3.2, FLX: 1.8, QB: 1.3 },
    trend: "up",
    rank: 1,
    starred: false,
  },
  {
    id: "2",
    name: "Lamar Jackson",
    team: "BAL",
    position: "QB",
    projectedPoints: 23.2,
    avgRanks: { OVR: 4.1, FLX: 2.3, QB: 2.1 },
    trend: "up",
    rank: 2,
    starred: true,
  },
  {
    id: "3",
    name: "Jalen Hurts",
    team: "PHI",
    position: "QB",
    projectedPoints: 22.1,
    avgRanks: { OVR: 5.8, FLX: 3.1, QB: 2.8 },
    trend: "down",
    rank: 3,
    starred: false,
  },
  {
    id: "4",
    name: "Patrick Mahomes",
    team: "KC",
    position: "QB",
    projectedPoints: 21.9,
    avgRanks: { OVR: 6.2, FLX: 3.5, QB: 3.2 },
    trend: "up",
    rank: 4,
    starred: true,
  },
  // RBs
  {
    id: "5",
    name: "Christian McCaffrey",
    team: "SF",
    position: "RB",
    projectedPoints: 20.8,
    avgRanks: { OVR: 1.1, FLX: 1.1, RB: 1.1 },
    trend: "up",
    rank: 5,
    starred: false,
  },
  {
    id: "6",
    name: "Austin Ekeler",
    team: "LAC",
    position: "RB",
    projectedPoints: 19.5,
    avgRanks: { OVR: 8.4, FLX: 3.2, RB: 2.4 },
    trend: "down",
    rank: 6,
    starred: false,
  },
  {
    id: "7",
    name: "Saquon Barkley",
    team: "NYG",
    position: "RB",
    projectedPoints: 18.9,
    avgRanks: { OVR: 9.1, FLX: 4.2, RB: 3.1 },
    trend: "up",
    rank: 7,
    starred: true,
  },
  {
    id: "8",
    name: "Derrick Henry",
    team: "TEN",
    position: "RB",
    projectedPoints: 18.2,
    avgRanks: { OVR: 12.2, FLX: 6.1, RB: 4.2 },
    trend: "down",
    rank: 8,
    starred: false,
  },
  // WRs
  {
    id: "9",
    name: "Cooper Kupp",
    team: "LAR",
    position: "WR",
    projectedPoints: 17.8,
    avgRanks: { OVR: 7.8, FLX: 2.1, WR: 1.8 },
    trend: "up",
    rank: 9,
    starred: false,
  },
  {
    id: "10",
    name: "Davante Adams",
    team: "LV",
    position: "WR",
    projectedPoints: 17.3,
    avgRanks: { OVR: 10.3, FLX: 4.8, WR: 2.3 },
    trend: "up",
    rank: 10,
    starred: true,
  },
  {
    id: "11",
    name: "Tyreek Hill",
    team: "MIA",
    position: "WR",
    projectedPoints: 16.9,
    avgRanks: { OVR: 11.9, FLX: 5.2, WR: 2.9 },
    trend: "down",
    rank: 11,
    starred: false,
  },
  {
    id: "12",
    name: "Stefon Diggs",
    team: "BUF",
    position: "WR",
    projectedPoints: 16.5,
    avgRanks: { OVR: 13.4, FLX: 6.8, WR: 3.4 },
    trend: "up",
    rank: 12,
    starred: false,
  },
  // TEs
  {
    id: "13",
    name: "Travis Kelce",
    team: "KC",
    position: "TE",
    projectedPoints: 16.1,
    avgRanks: { OVR: 14.2, FLX: 7.1, TE: 1.2 },
    trend: "up",
    rank: 13,
    starred: true,
  },
  {
    id: "14",
    name: "Mark Andrews",
    team: "BAL",
    position: "TE",
    projectedPoints: 14.8,
    avgRanks: { OVR: 18.1, FLX: 9.8, TE: 2.1 },
    trend: "down",
    rank: 14,
    starred: false,
  },
  {
    id: "15",
    name: "George Kittle",
    team: "SF",
    position: "TE",
    projectedPoints: 14.2,
    avgRanks: { OVR: 21.8, FLX: 12.1, TE: 2.8 },
    trend: "up",
    rank: 15,
    starred: false,
  },
  {
    id: "16",
    name: "T.J. Hockenson",
    team: "DET",
    position: "TE",
    projectedPoints: 13.5,
    avgRanks: { OVR: 24.5, FLX: 14.2, TE: 3.5 },
    trend: "up",
    rank: 16,
    starred: false,
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

export default function Rankings() {
  const [players, setPlayers] = useState(initialPlayers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("Overall")
  const [editingRank, setEditingRank] = useState<string | null>(null)
  const [tempRank, setTempRank] = useState("")
  const [externalSearchTerm, setExternalSearchTerm] = useState("")
  const [myGuysFilter, setMyGuysFilter] = useState("All")
  const [currentWeek, setCurrentWeek] = useState("Week 8")
  const [showShareModal, setShowShareModal] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    teams: [],
    rookieOnly: false,
    injuryStatus: "all",
    priceRange: "all",
    trending: "all",
  })
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])

  const filterCount =
    (filters.rookieOnly ? 1 : 0) +
    (filters.injuryStatus !== "all" ? 1 : 0) +
    (filters.priceRange !== "all" ? 1 : 0) +
    (filters.trending !== "all" ? 1 : 0) +
    selectedTeams.length

  const clearAllFilters = () => {
    setFilters({
      teams: [],
      rookieOnly: false,
      injuryStatus: "all",
      priceRange: "all",
      trending: "all",
    })
    setSelectedTeams([])
  }

  const toggleTeamFilter = (team: string) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team))
    } else {
      setSelectedTeams([...selectedTeams, team])
    }
  }

  // Update individual position rankings when overall changes
  useEffect(() => {
    if (selectedPosition !== "Overall" && selectedPosition !== "Flex") {
      // Filter and rerank players for the selected position
      const positionPlayers = players
        .filter((player) => player.position === selectedPosition)
        .sort((a, b) => a.rank - b.rank)
        .map((player, index) => ({ ...player, rank: index + 1 }))

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          const positionPlayer = positionPlayers.find((p) => p.id === player.id)
          return positionPlayer || player
        }),
      )
    }
  }, [selectedPosition])

  const rightButtons = (
    <>
      <Link href="/rankings/aggregate" className="hidden sm:block">
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Aggregate Rankings
        </Button>
      </Link>
    </>
  )

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(filteredPlayers)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update ranks for the filtered view
    const updatedItems = items.map((item, index) => ({
      ...item,
      rank: index + 1,
    }))

    // Update the main players array
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        const updatedPlayer = updatedItems.find((item) => item.id === player.id)
        return updatedPlayer || player
      }),
    )
  }

  const handleRankEdit = (playerId: string, newRank: number) => {
    const maxRank = filteredPlayers.length
    if (newRank < 1 || newRank > maxRank) return

    const updatedPlayers = [...filteredPlayers]
    const playerIndex = updatedPlayers.findIndex((p) => p.id === playerId)
    const player = updatedPlayers[playerIndex]

    // Remove player from current position
    updatedPlayers.splice(playerIndex, 1)

    // Insert at new position
    updatedPlayers.splice(newRank - 1, 0, player)

    // Update all ranks
    const rerankedPlayers = updatedPlayers.map((p, index) => ({
      ...p,
      rank: index + 1,
    }))

    // Update the main players array
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        const rerankedPlayer = rerankedPlayers.find((p) => p.id === player.id)
        return rerankedPlayer || player
      }),
    )

    setEditingRank(null)
    setTempRank("")
  }

  const toggleStar = (playerId: string) => {
    setPlayers(players.map((player) => (player.id === playerId ? { ...player, starred: !player.starred } : player)))
  }

  const handleSaveRankings = () => {
    // Simulate saving rankings
    alert("Rankings saved successfully!")
  }

  const filteredPlayers = players
    .filter((player) => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
      let matchesPosition = false

      if (selectedPosition === "Overall") {
        matchesPosition = true
      } else if (selectedPosition === "Flex") {
        // Flex excludes QB
        matchesPosition = player.position !== "QB"
      } else {
        matchesPosition = player.position === selectedPosition
      }

      return matchesSearch && matchesPosition
    })
    .sort((a, b) => a.rank - b.rank)

  const myGuys = players.filter((player) => {
    if (!player.starred) return false
    if (myGuysFilter === "All") return true
    return player.position === myGuysFilter
  })

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Rankings</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="font-semibold">
              {currentWeek} {selectedPosition} Rankings
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">by @johndoe</p>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">
            <input
              type="text"
              value={`https://rankbet.com/rankings/${currentWeek.toLowerCase().replace(" ", "")}-${selectedPosition.toLowerCase()}`}
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button
              size="sm"
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://rankbet.com/rankings/${currentWeek.toLowerCase().replace(" ", "")}-${selectedPosition.toLowerCase()}`,
                )
              }
            >
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
              Reddit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const PlayerModal = ({ playerId }: { playerId: string }) => {
    const player = players.find((p) => p.id === playerId)
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

          <div className="space-y-6">
            {/* Player Header */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={`/placeholder.svg?height=64&width=64&text=${player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}`}
                />
                <AvatarFallback className="text-lg">
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

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">{player.projectedPoints}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Projected Points</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">#{player.rank}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Current Rank</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">ADP Round</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">8.7</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">RankBet Avg</p>
              </div>
            </div>

            {/* Game by Game Stats */}
            <div>
              <h5 className="font-semibold mb-3">Recent Games</h5>
              <div className="space-y-2">
                {[
                  { week: "Week 7", opponent: "vs MIA", points: 24.8, result: "W" },
                  { week: "Week 6", opponent: "@ NYJ", points: 18.2, result: "W" },
                  { week: "Week 5", opponent: "vs JAX", points: 31.4, result: "W" },
                  { week: "Week 4", opponent: "@ BAL", points: 12.6, result: "L" },
                ].map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">{game.week}</span>
                      <span className="text-sm">{game.opponent}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{game.points} pts</span>
                      <Badge variant={game.result === "W" ? "default" : "secondary"} className="text-xs">
                        {game.result}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RankBet Community Rankings */}
            <div>
              <h5 className="font-semibold mb-3">Community Rankings</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Rank</span>
                  <span className="font-semibold">#{Math.floor(player.rank + Math.random() * 3)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Highest Rank</span>
                  <span className="font-semibold">#{Math.max(1, player.rank - 2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lowest Rank</span>
                  <span className="font-semibold">#{player.rank + 4}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Times Ranked</span>
                  <span className="font-semibold">247 users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader rightButtons={rightButtons} />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{currentWeek} Rankings</h1>
          <p className="text-slate-600 dark:text-slate-400">Drag and drop players to create your custom rankings</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Position Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {["Overall", "Flex", "QB", "RB", "WR", "TE"].map((position) => (
                    <Button
                      key={position}
                      variant={selectedPosition === position ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPosition(position)}
                      className="w-full"
                    >
                      {position === "Overall" ? "OVR" : position === "Flex" ? "FLX" : position}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Reference Point</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select defaultValue="week7">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your ranking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week7">My Week 7 Rankings</SelectItem>
                    <SelectItem value="preseason">My Pre-season Rankings</SelectItem>
                    <SelectItem value="week6">My Week 6 Rankings</SelectItem>
                    <SelectItem value="week5">My Week 5 Rankings</SelectItem>
                    <SelectItem value="week4">My Week 4 Rankings</SelectItem>
                    <SelectItem value="aggregate1">My Consensus QB Week 8</SelectItem>
                    <SelectItem value="aggregate2">Friends + ESPN RB Week 7</SelectItem>
                  </SelectContent>
                </Select>

                <SearchInput
                  placeholder="Search external rankings..."
                  value={externalSearchTerm}
                  onChange={setExternalSearchTerm}
                />

                {externalSearchTerm && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    <div className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer text-sm">
                      @mikechen's Week 7 QB
                    </div>
                    <div className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer text-sm">
                      FantasyPros Week 7 QB
                    </div>
                    <div className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer text-sm">
                      ESPN Week 7 QB
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ranking Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Last Updated</span>
                  <span className="font-semibold">2 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy Score</span>
                  <Badge variant="default">87.3%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">My Guys</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{myGuys.length}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full bg-transparent">
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setMyGuysFilter("All")}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMyGuysFilter("QB")}>QB</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMyGuysFilter("RB")}>RB</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMyGuysFilter("WR")}>WR</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMyGuysFilter("TE")}>TE</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMyGuysFilter("Overall")}>OVR</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMyGuysFilter("Flex")}>FLX</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {myGuys.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      My Guys {myGuysFilter !== "All" && `(${myGuysFilter})`}:
                    </h4>
                    <div className="space-y-1">
                      {myGuys.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between text-xs p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{player.name}</span>
                            <Badge className={`text-xs ${getPositionColor(player.position)}`}>{player.position}</Badge>
                          </div>
                          <span className="text-yellow-600 font-medium">#{player.rank}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <SearchInput
                placeholder="Search players..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="flex-1"
              />
              <div className="flex gap-2">
                <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-shrink-0 bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {(filters.teams.length > 0 ||
                        filters.rookieOnly ||
                        filters.injuryStatus !== "all" ||
                        filters.priceRange !== "all" ||
                        filters.trending !== "all") && (
                        <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                          {filters.teams.length +
                            (filters.rookieOnly ? 1 : 0) +
                            (filters.injuryStatus !== "all" ? 1 : 0) +
                            (filters.priceRange !== "all" ? 1 : 0) +
                            (filters.trending !== "all" ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Teams</label>
                        <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto">
                          {[
                            "BUF",
                            "MIA",
                            "NE",
                            "NYJ",
                            "BAL",
                            "CIN",
                            "CLE",
                            "PIT",
                            "HOU",
                            "IND",
                            "JAX",
                            "TEN",
                            "DEN",
                            "KC",
                            "LV",
                            "LAC",
                            "DAL",
                            "NYG",
                            "PHI",
                            "WAS",
                            "CHI",
                            "DET",
                            "GB",
                            "MIN",
                            "ATL",
                            "CAR",
                            "NO",
                            "TB",
                            "ARI",
                            "LAR",
                            "SF",
                            "SEA",
                          ].map((team) => (
                            <Button
                              key={team}
                              variant={filters.teams.includes(team) ? "default" : "outline"}
                              size="sm"
                              className="text-xs h-6"
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  teams: prev.teams.includes(team)
                                    ? prev.teams.filter((t) => t !== team)
                                    : [...prev.teams, team],
                                }))
                              }}
                            >
                              {team}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rookie-filter"
                          checked={filters.rookieOnly}
                          onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, rookieOnly: checked }))}
                        />
                        <label htmlFor="rookie-filter" className="text-sm">
                          Rookies Only
                        </label>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Injury Status</label>
                        <Select
                          value={filters.injuryStatus}
                          onValueChange={(value) => setFilters((prev) => ({ ...prev, injuryStatus: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Players</SelectItem>
                            <SelectItem value="healthy">Healthy Only</SelectItem>
                            <SelectItem value="questionable">Include Questionable</SelectItem>
                            <SelectItem value="injured">Injured Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Price Range (DraftKings)</label>
                        <Select
                          value={filters.priceRange}
                          onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="value">Value Plays ($3K-$5K)</SelectItem>
                            <SelectItem value="mid">Mid-Tier ($5K-$7K)</SelectItem>
                            <SelectItem value="premium">Premium ($7K+)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Trending</label>
                        <Select
                          value={filters.trending}
                          onValueChange={(value) => setFilters((prev) => ({ ...prev, trending: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Players</SelectItem>
                            <SelectItem value="up">Trending Up</SelectItem>
                            <SelectItem value="down">Trending Down</SelectItem>
                            <SelectItem value="hot">Community Favorites</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex space-x-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() =>
                            setFilters({
                              teams: [],
                              rookieOnly: false,
                              injuryStatus: "all",
                              priceRange: "all",
                              trending: "all",
                            })
                          }
                        >
                          Clear All
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => setShowFilters(false)}>
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/rankings/aggregate" className="sm:hidden">
                  <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                    <Users className="w-4 h-4 mr-2" />
                    Aggregate
                  </Button>
                </Link>
              </div>
            </div>

            {/* Rankings List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span>{selectedPosition} Rankings</span>
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <Link href="/rankings/aggregate">
                      <GradientButton size="sm" icon={BarChart3}>
                        Create Aggregate
                      </GradientButton>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {currentWeek}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setCurrentWeek("Pre-Season")}>Pre-Season</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 1")}>Week 1</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 2")}>Week 2</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 3")}>Week 3</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 4")}>Week 4</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 5")}>Week 5</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 6")}>Week 6</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 7")}>Week 7</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 8")}>Week 8</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 9")}>Week 9</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentWeek("Week 10")}>Week 10</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardTitle>
                <CardDescription>
                  Drag players to reorder your rankings. Click rank numbers to edit directly. Changes are saved
                  automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="players">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {filteredPlayers.map((player, index) => (
                          <Draggable key={player.id} draggableId={player.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center p-4 bg-white dark:bg-slate-800 border rounded-lg transition-all ${
                                  snapshot.isDragging ? "shadow-lg scale-105" : "hover:shadow-md"
                                }`}
                              >
                                <div {...provided.dragHandleProps} className="mr-4 text-slate-400 hover:text-slate-600">
                                  <GripVertical className="w-5 h-5" />
                                </div>

                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center space-x-4">
                                    {editingRank === player.id ? (
                                      <Input
                                        type="number"
                                        value={tempRank}
                                        onChange={(e) => setTempRank(e.target.value)}
                                        onBlur={() => {
                                          const newRank = Number.parseInt(tempRank)
                                          if (!isNaN(newRank)) {
                                            handleRankEdit(player.id, newRank)
                                          } else {
                                            setEditingRank(null)
                                            setTempRank("")
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            const newRank = Number.parseInt(tempRank)
                                            if (!isNaN(newRank)) {
                                              handleRankEdit(player.id, newRank)
                                            }
                                          } else if (e.key === "Escape") {
                                            setEditingRank(null)
                                            setTempRank("")
                                          }
                                        }}
                                        className="w-12 h-8 text-center"
                                        autoFocus
                                      />
                                    ) : (
                                      <div
                                        className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        onClick={() => {
                                          setEditingRank(player.id)
                                          setTempRank((index + 1).toString())
                                        }}
                                      >
                                        {index + 1}
                                      </div>
                                    )}

                                    <div className="flex items-center space-x-3">
                                      <div className="cursor-pointer" onClick={() => setShowPlayerModal(player.id)}>
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
                                      </div>

                                      <div className="cursor-pointer" onClick={() => setShowPlayerModal(player.id)}>
                                        <p className="font-semibold hover:text-blue-600 transition-colors">
                                          {player.name}
                                        </p>
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
                                  </div>

                                  <div className="flex items-center space-x-4">
                                    <div className="text-right bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border">
                                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                                        {(() => {
                                          const currentAvg =
                                            selectedPosition === "Overall"
                                              ? player.avgRanks.OVR
                                              : selectedPosition === "Flex"
                                                ? player.avgRanks.FLX
                                                : player.avgRanks[selectedPosition] || player.avgRanks.OVR
                                          return currentAvg.toFixed(1)
                                        })()}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        avg{" "}
                                        {selectedPosition === "Overall"
                                          ? "OVR"
                                          : selectedPosition === "Flex"
                                            ? "FLX"
                                            : selectedPosition.toUpperCase()}{" "}
                                        rank
                                      </p>
                                    </div>

                                    <div className="text-right">
                                      <p className="font-semibold">{player.projectedPoints} pts</p>
                                      <p className="text-xs text-slate-500">projected</p>
                                    </div>

                                    <div className="flex items-center">
                                      {player.trend === "up" ? (
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                      )}
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleStar(player.id)}
                                      className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                    >
                                      <Star
                                        className={`w-4 h-4 ${
                                          player.starred
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-slate-400 hover:text-yellow-400"
                                        }`}
                                      />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <GradientButton size="sm" icon={Save} onClick={handleSaveRankings}>
                    Save Rankings
                  </GradientButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showShareModal && <ShareModal />}
      {showPlayerModal && <PlayerModal playerId={showPlayerModal} />}
    </div>
  )
}
