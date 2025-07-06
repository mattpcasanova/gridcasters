"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useHeaderButtons } from "@/components/layout/root-layout-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSleeperRankings } from "@/lib/hooks/use-sleeper-rankings"
import { PlayerRankingCard } from "@/components/ranking/player-ranking-card"
import { PlayerModal } from "@/components/ranking/player-modal"
import { RankingPlayer } from "@/lib/types"

export default function Rankings() {
  const [selectedPosition, setSelectedPosition] = useState("OVR")
  const [searchTerm, setSearchTerm] = useState("")
  const [myGuysFilter, setMyGuysFilter] = useState("All")
  const [showPlayerModal, setShowPlayerModal] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  
  const { 
    players, 
    loading, 
    error, 
    currentWeek, 
    toggleStar, 
    reorderPlayers,
    updatePlayerRank,
    starredPlayers,
    saveRankings 
  } = useSleeperRankings(selectedPosition)

  const { setRightButtons } = useHeaderButtons()

  // Set header buttons when component mounts
  useEffect(() => {
    setRightButtons(
      <Link href="/rankings/aggregate">
        <GradientButton size="sm" icon={Users}>
          Create Aggregate
        </GradientButton>
      </Link>
    )
  }, [setRightButtons])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    reorderPlayers(result.source.index, result.destination.index)
  }

  const handlePlayerClick = (playerId: string) => {
    setShowPlayerModal(playerId)
  }

  const handleSaveRankings = async () => {
    try {
      const result = await saveRankings(selectedPosition);
      
      if (result.success) {
        const actionText = result.action === 'created' ? 'created' : 'updated';
        alert(`Rankings ${actionText} successfully!`);
      } else {
        alert(`Failed to save rankings: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving rankings:', error);
      alert('An error occurred while saving rankings.');
    }
  }

  const handleShareRankings = () => {
    setShowShareModal(true)
  }

  // Filter players by search term
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get starred players for "My Guys" section
  const myGuys = players.filter(player => {
    if (!player.isStarred) return false
    if (myGuysFilter === "All") return true
    return player.position === myGuysFilter
  })

  const selectedPlayer = showPlayerModal ? players.find(p => p.id === showPlayerModal) : null

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
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
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Week {currentWeek} Rankings</h1>
        <p className="text-gray-600">Drag and drop players to create your custom rankings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Position Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold mb-3">Position Filter</h3>
            <div className="grid grid-cols-2 gap-2">
              {["OVR", "FLX", "QB", "RB", "WR", "TE"].map((position) => (
                <button
                  key={position}
                  onClick={() => setSelectedPosition(position)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPosition === position
                      ? "bg-gradient-to-r from-blue-600 to-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          {/* My Guys */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">My Guys ({starredPlayers.length})</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setMyGuysFilter("All")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMyGuysFilter("QB")}>QB</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMyGuysFilter("RB")}>RB</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMyGuysFilter("WR")}>WR</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMyGuysFilter("TE")}>TE</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              {myGuys.slice(0, 5).map(player => (
                <div key={player.id} className="flex items-center gap-2 text-sm">
                  <span className="font-medium">#{player.rank}</span>
                  <span className="truncate">{player.name}</span>
                  <span className="text-gray-500">{player.position}</span>
                </div>
              ))}
              {myGuys.length === 0 && (
                <p className="text-sm text-gray-500">No starred players yet</p>
              )}
            </div>
          </div>

          {/* Week Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold mb-3">Week Selection</h3>
            <Select value={`Week ${currentWeek}`} onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(18)].map((_, i) => (
                  <SelectItem key={i + 1} value={`Week ${i + 1}`}>
                    Week {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveRankings}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleShareRankings}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Players List */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="players">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {filteredPlayers.map((player, index) => (
                    <Draggable key={player.id} draggableId={player.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <PlayerRankingCard
                            player={player}
                            onStar={() => toggleStar(player.id)}
                            onRankChange={(newRank) => updatePlayerRank(player.id, newRank)}
                            onPlayerClick={() => handlePlayerClick(player.id)}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No players found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Player Modal */}
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          isOpen={!!showPlayerModal}
          onClose={() => setShowPlayerModal(null)}
          onStar={() => toggleStar(selectedPlayer.id)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Rankings</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">Week {currentWeek} {selectedPosition} Rankings</p>
                <p className="text-sm text-gray-600">by @username</p>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                <input
                  type="text"
                  value={`https://gridcasters.com/rankings/week${currentWeek}-${selectedPosition.toLowerCase()}`}
                  readOnly
                  className="flex-1 bg-transparent text-sm"
                />
                <Button
                  size="sm"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://gridcasters.com/rankings/week${currentWeek}-${selectedPosition.toLowerCase()}`
                    )
                  }
                >
                  Copy
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1" variant="outline">
                  Twitter
                </Button>
                <Button className="flex-1" variant="outline">
                  Facebook
                </Button>
                <Button className="flex-1" variant="outline">
                  Reddit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 