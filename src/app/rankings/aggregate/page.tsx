"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { GradientLoading } from "@/components/ui/gradient-loading"
import { AccuracyCircle } from "@/components/ui/accuracy-circle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { X, Plus, BarChart3, TrendingUp, Save, ArrowLeft, Users, Trophy, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useSleeperRankings } from "@/lib/hooks/use-sleeper-rankings"
import { getPositionColor, getPlayerAvatarURL, getTeamLogoURL } from "@/lib/sleeper-utils"
import { getCurrentSeasonInfo, getAvailableWeeks } from "@/lib/utils/season"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { PlayerRankingCard } from '@/components/ranking/player-ranking-card';
import { getPositionLimits } from '@/lib/constants/position-limits';
import { globalCache, CACHE_KEYS, generateCacheKey } from '@/lib/utils/cache';

interface AvailableRanking {
  id: string;
  name: string;
  type: "user" | "projection";
  user: string;
  verified: boolean;
  accuracy: number;
  week: string;
  position: string;
  leagueType: string;
  userId?: string;
  avatarUrl?: string | null;
}

interface CommunityPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  averageRank: number;
  totalRankings: number;
  trend: "up" | "down" | "neutral";
  projectedPoints: number;
  rankings: Array<{ source: string; rank: number }>;
}

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
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [selectedPosition, setSelectedPosition] = useState("OVR")
  const [showResults, setShowResults] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState<string | null>(null)
  const [aggregateName, setAggregateName] = useState("")
  const [availableRankings, setAvailableRankings] = useState<AvailableRanking[]>([])
  const [loadingRankings, setLoadingRankings] = useState(true)
  const [loadingAggregate, setLoadingAggregate] = useState(false)
  
  // Scoring format state
  const [scoringFormat, setScoringFormat] = useState('half_ppr');

  const supabase = useSupabase()
  
  // Use Sleeper API for real player data
  const { 
    players, 
    loading, 
    error, 
    currentWeek 
  } = useSleeperRankings(selectedPosition)

  // Initialize week selection based on current season
  useEffect(() => {
    const seasonInfo = getCurrentSeasonInfo()
    const availableWeeks = getAvailableWeeks()
    const currentWeek = availableWeeks.find(w => w.isCurrent)
    setSelectedWeek(currentWeek?.value || "1")
  }, [])

  // Fetch available rankings (user's own rankings + followed users' rankings)
  useEffect(() => {
    const fetchAvailableRankings = async () => {
      try {
        setLoadingRankings(true)
        
        // Check cache first
        const cacheKey = generateCacheKey(CACHE_KEYS.AGGREGATE_RANKINGS, {
          week: selectedWeek,
          position: selectedPosition,
          scoringFormat
        });
        
        const cachedData = globalCache.get<AvailableRanking[]>(cacheKey);
        if (cachedData) {
          setAvailableRankings(cachedData);
          setLoadingRankings(false);
          return;
        }
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get user's own rankings
        const { data: ownRankings } = await supabase
          .from('rankings')
          .select(`
            id,
            title,
            position,
            type,
            week,
            season,
            accuracy_score,
            user_id,
            profiles!inner (
              username,
              display_name,
              is_verified,
              avatar_url
            )
          `)
          .eq('user_id', user.id)
          .eq('season', getCurrentSeasonInfo().season)
          .not('position', 'like', 'AGG_%')
          .order('created_at', { ascending: false })

        // Get followed users' rankings
        const { data: followedUsers } = await supabase
          .from('follows')
          .select(`
            following_id,
            profiles!following_id (
              username,
              display_name,
              is_verified
            )
          `)
          .eq('follower_id', user.id)

        const followedUserIds = followedUsers?.map(f => f.following_id) || []

        const { data: followedRankings } = await supabase
          .from('rankings')
          .select(`
            id,
            title,
            position,
            type,
            week,
            season,
            accuracy_score,
            user_id,
            profiles!inner (
              username,
              display_name,
              is_verified,
              avatar_url
            )
          `)
          .in('user_id', followedUserIds)
          .eq('season', getCurrentSeasonInfo().season)
          .not('position', 'like', 'AGG_%')
          .order('created_at', { ascending: false })

        // Transform rankings to AvailableRanking format
        const transformedRankings: AvailableRanking[] = []

        // Add user's own rankings (only one per position/week combination)
        const userRankingsMap = new Map<string, any>()
        ownRankings?.forEach(ranking => {
          const key = `${ranking.position}-${ranking.type}-${ranking.week}`
          if (!userRankingsMap.has(key)) {
            userRankingsMap.set(key, ranking)
          }
        })

        userRankingsMap.forEach(ranking => {
          const profile = Array.isArray(ranking.profiles) ? ranking.profiles[0] : ranking.profiles
          transformedRankings.push({
            id: ranking.id,
            name: ranking.title,
            type: "user" as const,
            user: profile?.display_name || profile?.username || "Unknown User",
            verified: profile?.is_verified || false,
            accuracy: ranking.accuracy_score || 0,
            week: ranking.type === 'preseason' ? 'Preseason' : `Week ${ranking.week}`,
            position: ranking.position,
            leagueType: getScoringFormatDisplay(scoringFormat),
            userId: ranking.user_id,
            avatarUrl: profile?.avatar_url
          })
        })

        // Add followed users' rankings (only one per user per position/week combination)
        const followedRankingsMap = new Map<string, any>()
        followedRankings?.forEach(ranking => {
          const key = `${ranking.user_id}-${ranking.position}-${ranking.type}-${ranking.week}`
          if (!followedRankingsMap.has(key)) {
            followedRankingsMap.set(key, ranking)
          }
        })

        followedRankingsMap.forEach(ranking => {
          const profile = Array.isArray(ranking.profiles) ? ranking.profiles[0] : ranking.profiles
          transformedRankings.push({
            id: ranking.id,
            name: ranking.title,
            type: "user" as const,
            user: profile?.display_name || profile?.username || "Unknown User",
            verified: profile?.is_verified || false,
            accuracy: ranking.accuracy_score || 0,
            week: ranking.type === 'preseason' ? 'Preseason' : `Week ${ranking.week}`,
            position: ranking.position,
            leagueType: getScoringFormatDisplay(scoringFormat),
            userId: ranking.user_id,
            avatarUrl: profile?.avatar_url
          })
        })

        console.log('Available rankings:', transformedRankings);
        setAvailableRankings(transformedRankings)
        
        // Cache the results
        globalCache.set(cacheKey, transformedRankings, 2 * 60 * 1000); // 2 minutes cache
      } catch (error) {
        console.error('Error fetching available rankings:', error)
        toast.error('Failed to load available rankings')
      } finally {
        setLoadingRankings(false)
      }
    }

    if (selectedWeek && selectedPosition) {
      fetchAvailableRankings()
    }
  }, [supabase, selectedWeek, selectedPosition, scoringFormat])

  // Helper function to get scoring format display name
  const getScoringFormatDisplay = (format: string) => {
    switch (format) {
      case 'std': return 'Standard'
      case 'half_ppr': return 'Half PPR'
      case 'ppr': return 'Full PPR'
      default: return 'Half PPR'
    }
  }

  const toggleRanking = (rankingId: string) => {
    console.log('Toggling ranking:', rankingId);
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
            players: aggregatePlayers,
            position: selectedPosition,
            week: selectedWeek === 'preseason' ? null : selectedWeek,
            season: new Date().getFullYear(),
            type: selectedWeek === 'preseason' ? 'preseason' : 'weekly',
            scoringFormat: scoringFormat
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
    const matchesSearch = ranking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ranking.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWeek = ranking.week === (selectedWeek === 'preseason' ? 'Preseason' : `Week ${selectedWeek}`)
    const matchesPosition = ranking.position === selectedPosition
    return matchesSearch && matchesWeek && matchesPosition
  })

  // Deduplicate available rankings by userId and ranking type
  const dedupedRankings = Array.from(
    new Map(filteredRankings.map(r => [`${r.userId}-${r.position}-${r.type}-${r.week}`, r])).values()
  );

  // Aggregate logic
  const [aggregatePlayers, setAggregatePlayers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAggregatePlayers() {
      if (selectedRankings.length === 0) {
        setAggregatePlayers([]);
        return;
      }

      console.log('Selected rankings for aggregation:', selectedRankings);
      setLoadingAggregate(true);
      
      try {
        // Fetch all player rankings for selected users for the selected week/position/scoringFormat
        const playerRankingsByUser = await Promise.all(selectedRankings.map(async (rankingId) => {
          try {
            // Fetch player rankings for this rankingId
            const res = await fetch(`/api/rankings/${rankingId}/players?scoringFormat=${scoringFormat}`);
            if (!res.ok) {
              const errorText = await res.text();
              console.error(`Failed to fetch ranking ${rankingId}:`, res.status, errorText);
              throw new Error(`Failed to fetch ranking ${rankingId}: ${res.status} ${errorText}`);
            }
            const data = await res.json();
            console.log(`Ranking ${rankingId} data:`, data);
            return data.players || []; // [{player_id, rank_position, ...}]
          } catch (error) {
            console.error(`Error fetching ranking ${rankingId}:`, error);
            throw error;
          }
        }));

        // Aggregate: for each player, average their rank across all selected users
        const playerMap = new Map<string, number[]>();
        playerRankingsByUser.forEach((players, index) => {
          console.log(`Ranking ${index + 1} has ${players.length} players:`, players);
          players.forEach((p: { player_id: string, rank_position: number }) => {
            if (!playerMap.has(p.player_id)) playerMap.set(p.player_id, []);
            playerMap.get(p.player_id)!.push(p.rank_position);
          });
        });

        const averaged = Array.from(playerMap.entries()).map(([playerId, ranks]) => ({
          playerId,
          avgRank: ranks.reduce((a, b) => a + b, 0) / ranks.length,
          count: ranks.length
        }));

        // Sort by avgRank, lowest to highest
        averaged.sort((a, b) => a.avgRank - b.avgRank);

        // Join with player info from loaded Sleeper API data
        console.log('Available players from Sleeper API:', players.length);
        const playerInfoMap = new Map(players.map((p: any) => [p.id, p]));
        const { rankingLimit } = getPositionLimits(selectedPosition);
        
        const aggregateWithInfo = averaged
          .map((agg, idx) => {
            const info = playerInfoMap.get(agg.playerId);
            if (!info) {
              console.log(`No player info found for playerId: ${agg.playerId}`);
              return null;
            }
            return {
              ...agg,
              ...info,
              rank: idx + 1,
            };
          })
          .filter(Boolean)
          .slice(0, rankingLimit);

        console.log('Final aggregate players:', aggregateWithInfo.length);

        setAggregatePlayers(aggregateWithInfo);
              } catch (error) {
          console.error('Error generating aggregate:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          toast.error(`Failed to generate aggregate rankings: ${errorMessage}`);
        } finally {
          setLoadingAggregate(false);
        }
    }

    fetchAggregatePlayers();
  }, [selectedRankings, selectedPosition, scoringFormat, players]);

  // PlayerModal component
  const PlayerModal = ({ playerId }: { playerId: string }) => {
    const player = aggregatePlayers.find((p) => p.playerId === playerId)
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
              <GradientAvatar
                src={getPlayerAvatarURL(player.playerId)}
                alt={player.name}
                fallback={player.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
                size="xl"
              />
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
                <p className="text-2xl font-bold">#{player.avgRank.toFixed(1)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Average Rank</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">{player.count}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Rankings</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold">{player.rank}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Final Rank</p>
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

          {/* Scoring format tabs */}
          <Tabs value={scoringFormat} onValueChange={setScoringFormat} className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="std">Standard</TabsTrigger>
              <TabsTrigger value="half_ppr">Half PPR</TabsTrigger>
              <TabsTrigger value="ppr">Full PPR</TabsTrigger>
            </TabsList>
          </Tabs>
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Position</label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OVR">Overall</SelectItem>
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
                  {selectedRankings.length} of {dedupedRankings.length} rankings selected (min: 2, max: 6)
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
                    Select rankings to include in your aggregate. Choose from your rankings and followed users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRankings ? (
                    <div className="flex items-center justify-center py-12">
                      <GradientLoading text="Loading rankings..." size="md" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dedupedRankings.map((ranking) => (
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
                              <GradientAvatar
                                src={ranking.avatarUrl}
                                alt={ranking.user}
                                fallback={ranking.user
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                                size="md"
                              />
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
                                  <Badge variant={ranking.type === "projection" ? "default" : "outline"} className="text-xs">
                                    {ranking.type === "projection" ? "Projection" : "User"}
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
                            <AccuracyCircle accuracy={ranking.accuracy} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span>
                      Aggregated {selectedWeek === 'preseason' ? 'Preseason' : `Week ${selectedWeek}`} {selectedPosition}{" "}
                      Rankings
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <GradientButton size="sm" onClick={() => setShowSaveModal(true)}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Aggregate Ranking
                      </GradientButton>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Consensus ranking based on {selectedRankings.length} selected sources • {getScoringFormatDisplay(scoringFormat)} scoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAggregate ? (
                    <div className="flex items-center justify-center py-12">
                      <GradientLoading text="Generating aggregate rankings..." size="md" />
                    </div>
                  ) : aggregatePlayers.length > 0 ? (
                    <div className="space-y-3">
                      {aggregatePlayers.map((agg: any) => (
                        <PlayerRankingCard
                          key={agg.playerId}
                          player={{
                            id: agg.playerId,
                            name: agg.name,
                            team: agg.team,
                            position: agg.position,
                            projectedPoints: agg.projectedPoints,
                            avatarUrl: agg.avatarUrl,
                            teamLogoUrl: agg.teamLogoUrl,
                            isStarred: false,
                            rank: agg.rank,
                          }}
                          onStar={() => {}}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      No aggregate rankings available
                    </div>
                  )}

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

            {/* Show aggregate rankings box - always visible */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span>Aggregate Rankings</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <GradientButton 
                      size="sm" 
                      onClick={() => setShowSaveModal(true)} 
                      disabled={selectedRankings.length < 2}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Aggregate Ranking
                    </GradientButton>
                  </div>
                </CardTitle>
                <CardDescription>
                  {selectedRankings.length >= 2 
                    ? `Consensus ranking based on ${selectedRankings.length} selected sources`
                    : "Select specific rankings above to create a custom aggregate."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRankings.length < 2 ? (
                  <div className="text-center py-12 text-slate-500">
                    Select at least 2 rankings to generate aggregate rankings
                  </div>
                ) : loadingAggregate ? (
                  <div className="flex items-center justify-center py-12">
                    <GradientLoading text="Generating aggregate rankings..." size="md" />
                  </div>
                ) : aggregatePlayers.length > 0 ? (
                  <div className="space-y-3">
                    {aggregatePlayers.map((agg: any) => (
                      <PlayerRankingCard
                        key={agg.playerId}
                        player={{
                          id: agg.playerId,
                          name: agg.name,
                          team: agg.team,
                          position: agg.position,
                          projectedPoints: agg.projectedPoints,
                          avatarUrl: agg.avatarUrl,
                          teamLogoUrl: agg.teamLogoUrl,
                          isStarred: false,
                          rank: agg.rank,
                        }}
                        onStar={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    No aggregate rankings available
                  </div>
                )}
              </CardContent>
            </Card>
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
                      <p className="text-2xl font-bold">{dedupedRankings.length}</p>
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
                      <AccuracyCircle 
                        accuracy={selectedRankings.length > 0
                          ? Math.round(
                              selectedRankings.reduce((sum, id) => {
                                const ranking = availableRankings.find((r) => r.id === id)
                                return sum + (ranking?.accuracy || 0)
                              }, 0) / selectedRankings.length,
                            )
                          : 0}
                        size="lg"
                        showText={false}
                      />
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
                      <p className="text-xs text-slate-500 mt-1">*At least 2 users are required to generate an aggregate ranking</p>
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