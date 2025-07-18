"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircularProgress } from "@/components/ui/circular-progress"
import { SearchInput } from "@/components/ui/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Filter, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"

const getPositionColor = (position: string) => {
  switch (position) {
    case 'QB': return 'bg-red-500'
    case 'RB': return 'bg-green-500'
    case 'WR': return 'bg-blue-500'
    case 'TE': return 'bg-yellow-500'
    case 'OVR': return 'bg-purple-500'
    case 'FLX': return 'bg-indigo-500'
    default: return 'bg-gray-500'
  }
}

interface Ranking {
  id: string
  title: string
  position: string
  type: 'weekly' | 'preseason'
  week: number | null
  season: number
  accuracy_score: number | null
  created_at: string
  updated_at: string
  is_aggregate: boolean
}

export default function AllRankingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [positionFilter, setPositionFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [scoringFilter, setScoringFilter] = useState<string>("all")
  const [userId, setUserId] = useState<string | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [profileUsername, setProfileUsername] = useState<string | null>(null)

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true)
        
        // Get the user ID from the URL or current user
        const targetUserId = searchParams.get('userId')
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!targetUserId && !user) {
          toast.error('User not found')
          router.push('/leaderboard')
          return
        }

        const targetId = targetUserId || user?.id || null
        setUserId(targetId)
        setIsOwnProfile(!targetUserId) // If no userId in URL, it's own profile

        if (!targetId) {
          toast.error('User not found')
          router.push('/leaderboard')
          return
        }

        // If viewing someone else's rankings, get their username for the back button
        if (targetUserId) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', targetUserId)
            .single()
          
          setProfileUsername(profileData?.username || null)
        }

        // Fetch all rankings for the user (including aggregate)
        const { data: rankingsData, error } = await supabase
          .from('rankings')
          .select('*')
          .eq('user_id', targetId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching rankings:', error)
          toast.error('Failed to load rankings')
          return
        }

        // Transform the data to include aggregate flag
        const transformedRankings = rankingsData?.map((ranking: any) => ({
          ...ranking,
          is_aggregate: ranking.position?.startsWith('AGG_') || false
        })) || []

        setRankings(transformedRankings)
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to load rankings')
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [supabase, searchParams, router])

  // Filter rankings based on search and filters
  const filteredRankings = rankings.filter(ranking => {
    const matchesSearch = 
      ranking.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ranking.position?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPosition = positionFilter === "all" || ranking.position === positionFilter
    const matchesType = typeFilter === "all" || ranking.type === typeFilter
    
    // Filter by scoring format (extract from title)
    const matchesScoring = scoringFilter === "all" || 
      (ranking.title?.toLowerCase().includes(scoringFilter.toLowerCase()))

    return matchesSearch && matchesPosition && matchesType && matchesScoring
  })

  const getScoringFormat = (title: string) => {
    if (title?.toLowerCase().includes('ppr')) return 'PPR'
    if (title?.toLowerCase().includes('half')) return 'Half PPR'
    if (title?.toLowerCase().includes('std')) return 'Standard'
    return 'Half PPR' // Default
  }

  const getWeekDisplay = (ranking: Ranking) => {
    if (ranking.type === 'preseason') return 'Pre-Season'
    if (ranking.week) return `Week ${ranking.week}`
    return 'Unknown'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading rankings...</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={isOwnProfile ? "/profile" : `/profile/${profileUsername || userId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Profile
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  All Rankings
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {isOwnProfile ? 'Your complete ranking history' : 'Complete ranking history'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <SearchInput
                  placeholder="Search rankings..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="QB">QB</SelectItem>
                    <SelectItem value="RB">RB</SelectItem>
                    <SelectItem value="WR">WR</SelectItem>
                    <SelectItem value="TE">TE</SelectItem>
                    <SelectItem value="OVR">Overall</SelectItem>
                    <SelectItem value="FLX">Flex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="preseason">Pre-Season</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={scoringFilter} onValueChange={setScoringFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Scoring" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="ppr">PPR</SelectItem>
                    <SelectItem value="half">Half PPR</SelectItem>
                    <SelectItem value="std">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rankings List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredRankings.length} Ranking{filteredRankings.length !== 1 ? 's' : ''}
            </CardTitle>
            <CardDescription>
              {searchTerm || positionFilter !== 'all' || typeFilter !== 'all' || scoringFilter !== 'all' 
                ? 'Filtered results' 
                : 'All rankings'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRankings.map((ranking) => (
                <Link
                  key={ranking.id}
                  href={`/rankings/${ranking.id}`}
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${getPositionColor(ranking.position)}`}>
                        {ranking.position}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{ranking.title}</h3>
                          {ranking.is_aggregate && (
                            <Badge variant="outline" className="text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              Aggregate
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <Badge className={getPositionColor(ranking.position)} variant="outline">
                            {ranking.position}
                          </Badge>
                          <span>{getWeekDisplay(ranking)}</span>
                          <span>•</span>
                          <span>{getScoringFormat(ranking.title)}</span>
                          <span>•</span>
                          <span>{new Date(ranking.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {ranking.accuracy_score !== null ? (
                        <CircularProgress value={ranking.accuracy_score} size="sm" />
                      ) : (
                        <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-500">--</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredRankings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Rankings Found</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {searchTerm || positionFilter !== 'all' || typeFilter !== 'all' || scoringFilter !== 'all'
                      ? 'Try adjusting your filters to see more results.'
                      : 'No rankings have been created yet.'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 