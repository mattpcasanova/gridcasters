"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavigationHeader } from "@/components/layout/navigation-header"
import { CircularProgress } from "@/components/ui/circular-progress"
import { ArrowLeft, Share, Star, Trophy, TrendingUp, TrendingDown, Calendar, Users } from "lucide-react"
import Link from "next/link"

// Mock data for the ranking detail
const getRankingData = (id: string) => {
  const rankings = {
    "week8-qb": {
      id: "week8-qb",
      title: "Week 8 QB Rankings",
      position: "QB",
      week: "Week 8",
      season: "2024",
      accuracy: 92.1,
      rank: 15,
      totalRankings: 847,
      createdDate: "October 28, 2024",
      user: {
        name: "Matt Casanova",
        username: "mattcasanova",
        avatar: "/placeholder-user.jpg",
        verified: false
      },
      players: [
        {
          id: 1,
          name: "Josh Allen",
          team: "BUF",
          position: "QB",
          rank: 1,
          projectedPoints: 24.8,
          isStarred: true,
          actualPoints: 26.2,
          accuracy: 95.2
        },
        {
          id: 2,
          name: "Lamar Jackson", 
          team: "BAL",
          position: "QB",
          rank: 2,
          projectedPoints: 23.2,
          isStarred: false,
          actualPoints: 21.8,
          accuracy: 87.3
        },
        {
          id: 3,
          name: "Jalen Hurts",
          team: "PHI", 
          position: "QB",
          rank: 3,
          projectedPoints: 22.1,
          isStarred: true,
          actualPoints: 18.4,
          accuracy: 78.9
        },
        {
          id: 4,
          name: "Patrick Mahomes",
          team: "KC",
          position: "QB", 
          rank: 4,
          projectedPoints: 21.9,
          isStarred: false,
          actualPoints: 24.1,
          accuracy: 91.7
        },
        {
          id: 5,
          name: "Dak Prescott",
          team: "DAL",
          position: "QB",
          rank: 5,
          projectedPoints: 20.5,
          isStarred: false,
          actualPoints: 19.2,
          accuracy: 89.1
        }
      ]
    },
    "week7-rb": {
      id: "week7-rb",
      title: "Week 7 RB Rankings",
      position: "RB", 
      week: "Week 7",
      season: "2024",
      accuracy: 85.4,
      rank: 23,
      totalRankings: 923,
      createdDate: "October 21, 2024",
      user: {
        name: "Matt Casanova",
        username: "mattcasanova", 
        avatar: "/placeholder-user.jpg",
        verified: false
      },
      players: [
        {
          id: 1,
          name: "Christian McCaffrey",
          team: "SF",
          position: "RB",
          rank: 1,
          projectedPoints: 22.4,
          isStarred: true,
          actualPoints: 24.8,
          accuracy: 92.1
        },
        {
          id: 2,
          name: "Derrick Henry",
          team: "BAL",
          position: "RB", 
          rank: 2,
          projectedPoints: 19.8,
          isStarred: false,
          actualPoints: 18.2,
          accuracy: 86.7
        }
      ]
    }
  }
  
  return rankings[id as keyof typeof rankings] || rankings["week8-qb"]
}

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

export default function RankingDetailPage({ params }: { params: { id: string } }) {
  const ranking = getRankingData(params.id)
  const [showShareModal, setShowShareModal] = useState(false)

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Ranking</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
            ×
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={ranking.user.avatar} />
              <AvatarFallback>
                {ranking.user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{ranking.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">by {ranking.user.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">
            <input
              type="text"
              value={`https://gridcasters.com/rankings/${ranking.id}`}
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(`https://gridcasters.com/rankings/${ranking.id}`)}
            >
              Copy
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
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>

        {/* Ranking Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={ranking.user.avatar} />
                  <AvatarFallback className="text-xl">
                    {ranking.user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{ranking.title}</h1>
                    <Badge className={getPositionColor(ranking.position)}>
                      {ranking.position}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    by {ranking.user.name} • Created {ranking.createdDate}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <CircularProgress value={ranking.accuracy} size={60} />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">#{ranking.rank}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Global Rank</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{ranking.totalRankings}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Rankings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{ranking.players.filter(p => p.isStarred).length}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">My Guys</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button variant="outline" onClick={() => setShowShareModal(true)}>
                    <Share className="w-4 h-4 mr-2" />
                    Share Ranking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Player Rankings</CardTitle>
            <CardDescription>
              {ranking.week} {ranking.position} rankings with accuracy scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ranking.players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {player.rank}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${player.name.split(" ").map(n => n[0]).join("")}`} />
                      <AvatarFallback>
                        {player.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">{player.name}</p>
                        {player.isStarred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
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

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="font-semibold">{player.projectedPoints}</p>
                      <p className="text-xs text-slate-500">Projected</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{player.actualPoints}</p>
                      <p className="text-xs text-slate-500">Actual</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress value={player.accuracy} size={40} />
                      <p className="text-xs text-slate-500 mt-1">Accuracy</p>
                    </div>
                    <div className="text-center">
                      {player.accuracy >= 90 ? (
                        <TrendingUp className="w-5 h-5 text-green-500 mx-auto" />
                      ) : player.accuracy >= 80 ? (
                        <Trophy className="w-5 h-5 text-yellow-500 mx-auto" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showShareModal && <ShareModal />}
    </div>
  )
} 