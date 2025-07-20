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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Filter,
  GripVertical,
  Star,
  TrendingUp,
  TrendingDown,
  Save,
  ChevronDown,
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
import { RankingCutoffSeparator } from "@/components/ranking/ranking-cutoff-separator"
import { RankingsTutorial } from "@/components/ui/rankings-tutorial"
import { RankingPlayer } from "@/lib/types"
import { getAvailableWeeks, getCurrentSeasonInfo, getDefaultWeek } from "@/lib/utils/season"
import { getPositionLimits } from "@/lib/constants/position-limits"
import { getPositionColor } from "@/lib/sleeper-utils"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"

export default function Rankings() {
  const [selectedPosition, setSelectedPosition] = useState("OVR")
  const [selectedWeek, setSelectedWeek] = useState<number | 'preseason' | null>(null)
  const [hasPreseasonRankings, setHasPreseasonRankings] = useState<boolean | null>(null) // null = loading
  const [selectedReference, setSelectedReference] = useState<string | null>(null)
  const [scoringFormat, setScoringFormat] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rankbet-scoring-format') || 'half_ppr';
    }
    return 'half_ppr';
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [myGuysFilter, setMyGuysFilter] = useState("All")
  const [showPlayerModal, setShowPlayerModal] = useState<string | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialChecked, setTutorialChecked] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = useSupabase()

  
  // Check if user has preseason rankings and initialize week
  useEffect(() => {
    const initializeWeekSelection = async () => {
      try {
        const seasonInfo = getCurrentSeasonInfo();
        const queryParams = new URLSearchParams({
          position: 'OVR',
          season: seasonInfo.season.toString(),
          type: 'preseason'
        });
        
        const response = await fetch(`/api/rankings?${queryParams.toString()}`);
        let hasPreseasonData = false;
        
        if (response.ok) {
          const { rankings } = await response.json();
          hasPreseasonData = rankings && rankings.length > 0;
        }
        
        setHasPreseasonRankings(hasPreseasonData);
        
        // Set default week based on preseason rankings status
        if (selectedWeek === null) {
          const defaultWeek = getDefaultWeek(hasPreseasonData);
          
          // If it's preseason and user has saved preseason rankings, default to week 1
          // Otherwise, if it's preseason and no saved rankings, default to preseason
          if (seasonInfo.isPreSeason && hasPreseasonData) {
            setSelectedWeek(1);
          } else if (seasonInfo.isPreSeason && !hasPreseasonData) {
            setSelectedWeek('preseason');
          } else {
            setSelectedWeek(defaultWeek);
          }
        }
        
      } catch (error) {
        console.log('Could not check preseason rankings:', error);
        setHasPreseasonRankings(false);
        
        // Fallback to default logic
        if (selectedWeek === null) {
          const seasonInfo = getCurrentSeasonInfo();
          const defaultWeek = getDefaultWeek(false);
          setSelectedWeek(seasonInfo.isPreSeason ? 'preseason' : defaultWeek);
        }
      }
    };
    
    initializeWeekSelection();
  }, []); // Only run once on mount

  // Check if user has dismissed the tutorial
  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('tutorial_dismissed')
            .eq('id', user.id)
            .single();
          
          // Show tutorial if user hasn't dismissed it
          if (profile && !profile.tutorial_dismissed) {
            setShowTutorial(true);
          }
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
        // If there's an error, don't show the tutorial to avoid blocking the user
      }
    };
    
    checkTutorialStatus();
  }, [supabase]);

  // Save scoring format to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rankbet-scoring-format', scoringFormat);
    }
  }, [scoringFormat]);

  const { 
    players, 
    loading, 
    error, 
    currentWeek,
    rankingType,
    toggleStar, 
    reorderPlayers,
    updatePlayerRank,
    starredPlayers,
    saveRankings 
  } = useSleeperRankings(selectedPosition, selectedWeek || undefined, scoringFormat, selectedReference)

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
    setIsSaving(true);
    try {
      const result = await saveRankings(selectedPosition);
      
      if (result.success) {
        const actionText = result.action === 'created' ? 'created' : 'updated';
        let message = `Rankings ${actionText} successfully!`;
        
        if ((selectedPosition === 'OVR' || selectedPosition === 'FLX') && result.positionRankingsUpdated) {
          message += ' Individual position rankings have been updated to maintain consistency.';
        }
      
        // If this was a preseason ranking save, update the state
        if (rankingType === 'preseason') {
          setHasPreseasonRankings(true);
          
          // After saving preseason rankings, switch to week 1 if we're still in preseason
          const seasonInfo = getCurrentSeasonInfo();
          if (seasonInfo.isPreSeason) {
            setSelectedWeek(1);
          }
        }
        
        toast.success(message);
      } else {
        toast.error(`Failed to save rankings: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving rankings:', error);
      toast.error('An error occurred while saving rankings.');
    } finally {
      setIsSaving(false);
    }
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

  // Debug: Show current limits and player counts
  const currentLimits = getPositionLimits(selectedPosition);
  console.log(`Rankings Debug - Position: ${selectedPosition}, Players: ${players.length}, Filtered: ${filteredPlayers.length}, Search Term: "${searchTerm}", Limits:`, currentLimits);

  // Calculate player counts for each position
  const getPositionPlayerCount = (position: string) => {
    // Show the ranking cutoff limit - this is how many players actually matter for rankings
    const limits = getPositionLimits(position);
    return limits.rankingLimit;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
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
      <div className="container mx-auto p-4 sm:p-6">
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
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {rankingType === 'preseason' ? 'Pre-Season Rankings' : `Week ${selectedWeek} Rankings`}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {rankingType === 'preseason' 
            ? 'Create your season-long player rankings' 
            : 'Drag and drop players to create your custom rankings'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-1 order-1">
          {/* Position Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold mb-3">Position Filter</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
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
                  <div className="flex flex-col items-center">
                    <span>{position}</span>
                    <span className="text-xs opacity-75">
                      Top {getPositionPlayerCount(position)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Scoring Format */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="font-medium mb-2">Scoring Format</h4>
              <Tabs value={scoringFormat} onValueChange={setScoringFormat} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="std">Standard</TabsTrigger>
                  <TabsTrigger value="half_ppr">Half PPR</TabsTrigger>
                  <TabsTrigger value="ppr">Full PPR</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Week Selection */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium mb-2">Week Selection</h4>
              <Select 
                value={selectedWeek?.toString() || 'preseason'} 
                onValueChange={(value) => {
                  if (value === 'preseason') {
                    setSelectedWeek('preseason');
                  } else {
                    setSelectedWeek(parseInt(value));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableWeeks().map((week) => (
                    <SelectItem 
                      key={week.value} 
                      value={week.value}
                      className={`
                        ${week.isCurrent ? 'bg-blue-50 text-blue-700 font-semibold' : ''}
                        ${week.isFuture ? 'text-gray-500' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{week.label}</span>
                        {week.isCurrent && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-2">
                            Current
                          </span>
                        )}
                        {week.isFuture && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-2">
                            Future
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reference Point Selection */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium mb-2">Reference Point</h4>
              <Select 
                value={selectedReference || 'default'} 
                onValueChange={(value) => {
                  if (value === 'default') {
                    setSelectedReference(null);
                  } else {
                    setSelectedReference(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reference point" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <div className="flex items-center">
                      <span>Default (Previous Week)</span>
                      <span className="ml-2 text-xs text-gray-500">Auto</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="preseason">Pre-Season Rankings</SelectItem>
                  <SelectItem value="average">
                    <div className="flex items-center">
                      <span>Average Player Rankings</span>
                      <span className="ml-2 text-xs text-gray-500">Crowd Wisdom</span>
                    </div>
                  </SelectItem>
                  {/* Aggregate rankings will be loaded dynamically */}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Choose what to use as a starting point for your rankings
              </p>
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
            <div className="space-y-3">
              {myGuys.slice(0, 5).map(player => (
                <div key={player.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">#{player.rank}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
                      {player.position}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-sm text-gray-900">{player.name}</div>
                    <div className="text-xs text-gray-500">{player.team}</div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {player.projectedPoints > 0 ? player.projectedPoints.toFixed(1) : '--'} pts
                  </div>
                </div>
              ))}
              {myGuys.length === 0 && (
                <div className="text-center py-4">
                  <div className="text-gray-400 mb-2">⭐</div>
                  <p className="text-sm text-gray-500">No starred players yet</p>
                  <p className="text-xs text-gray-400 mt-1">Star players to add them here</p>
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 order-2">
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
              <GradientButton 
                onClick={handleSaveRankings} 
                icon={isSaving ? undefined : Save} 
                className="w-full sm:w-auto"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </GradientButton>
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
                  {filteredPlayers.map((player, index) => {
                    const limits = getPositionLimits(selectedPosition);
                    const showCutoff = index === limits.rankingLimit - 1 && filteredPlayers.length > limits.rankingLimit;
                    
                    return (
                      <div key={player.id}>
                        <Draggable draggableId={player.id} index={index}>
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
                        {showCutoff && (
                          <RankingCutoffSeparator 
                            position={selectedPosition}
                            rankingLimit={limits.rankingLimit}
                          />
                        )}
                      </div>
                    );
                  })}
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

      {/* Tutorial Modal */}
      <RankingsTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

    </div>
  )
} 