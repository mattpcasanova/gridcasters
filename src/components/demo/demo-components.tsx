"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CircularProgress } from "@/components/ui/circular-progress"
import { GradientButton } from "@/components/ui/gradient-button"
import { Trophy, Target, Users, BarChart3, GripVertical, UserCheck, UserPlus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function GridCastersDemo() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <div className="w-20 h-20 mx-auto">
          <Image src="/logo.png" alt="GridCasters Logo" width={80} height={80} className="w-full h-full object-contain" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">
            <span className="text-slate-600 dark:text-slate-400">Welcome to </span>
            <span className="text-blue-600">Grid</span>
            <span className="text-green-600">Casters</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            The ultimate fantasy football ranking platform where your predictions meet performance. Track accuracy,
            compete with friends, and become a ranking expert.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <Target className="w-8 h-8 mx-auto mb-3 text-blue-600" />
          <p className="font-semibold text-blue-900 dark:text-blue-100">Accurate Rankings</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
          <BarChart3 className="w-8 h-8 mx-auto mb-3 text-green-600" />
          <p className="font-semibold text-green-900 dark:text-green-100">Performance Tracking</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
          <p className="font-semibold text-yellow-900 dark:text-yellow-100">Leaderboards</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
          <p className="font-semibold text-purple-900 dark:text-purple-100">Community</p>
        </div>
      </div>
    </div>
  )
}

export function RankingsDemo() {
  const [players, setPlayers] = useState([
    { 
      id: "1", 
      name: "Josh Allen", 
      team: "BUF", 
      position: "QB", 
      projected: 24.8, 
      rank: 1,
      avatarUrl: "https://sleepercdn.com/content/nfl/players/thumb/7328.jpg",
      teamLogoUrl: "https://sleepercdn.com/images/team_logos/nfl/BUF.png"
    },
    { 
      id: "2", 
      name: "Lamar Jackson", 
      team: "BAL", 
      position: "QB", 
      projected: 23.2, 
      rank: 2,
      avatarUrl: "https://sleepercdn.com/content/nfl/players/thumb/4034.jpg",
      teamLogoUrl: "https://sleepercdn.com/images/team_logos/nfl/BAL.png"
    },
    { 
      id: "3", 
      name: "Patrick Mahomes", 
      team: "KC", 
      position: "QB", 
      projected: 22.1, 
      rank: 3,
      avatarUrl: "https://sleepercdn.com/content/nfl/players/thumb/6797.jpg",
      teamLogoUrl: "https://sleepercdn.com/images/team_logos/nfl/KC.png"
    },
    { 
      id: "4", 
      name: "Joe Burrow", 
      team: "CIN", 
      position: "QB", 
      projected: 21.9, 
      rank: 4,
      avatarUrl: "https://sleepercdn.com/content/nfl/players/thumb/6798.jpg",
      teamLogoUrl: "https://sleepercdn.com/images/team_logos/nfl/CIN.png"
    },
    { 
      id: "5", 
      name: "Jalen Hurts", 
      team: "PHI", 
      position: "QB", 
      projected: 20.5, 
      rank: 5,
      avatarUrl: "https://sleepercdn.com/content/nfl/players/thumb/3097.jpg",
      teamLogoUrl: "https://sleepercdn.com/images/team_logos/nfl/PHI.png"
    },
  ])

  const [editingRank, setEditingRank] = useState<string | null>(null)
  const [rankValue, setRankValue] = useState("")

  const handleRankChange = (playerId: string, newRank: number) => {
    if (newRank < 1 || newRank > players.length) return

    const updatedPlayers = [...players]
    const playerIndex = updatedPlayers.findIndex(p => p.id === playerId)
    const oldRank = updatedPlayers[playerIndex].rank

    // Update the target player's rank
    updatedPlayers[playerIndex].rank = newRank

    // Adjust other players' ranks
    if (newRank > oldRank) {
      // Moving down - shift players up
      updatedPlayers.forEach((player, index) => {
        if (index !== playerIndex && player.rank > oldRank && player.rank <= newRank) {
          player.rank -= 1
        }
      })
    } else {
      // Moving up - shift players down
      updatedPlayers.forEach((player, index) => {
        if (index !== playerIndex && player.rank >= newRank && player.rank < oldRank) {
          player.rank += 1
        }
      })
    }

    // Sort by rank
    updatedPlayers.sort((a, b) => a.rank - b.rank)
    setPlayers(updatedPlayers)
  }

  const startEditing = (playerId: string, currentRank: number) => {
    setEditingRank(playerId)
    setRankValue(currentRank.toString())
  }

  const finishEditing = () => {
    if (editingRank && rankValue) {
      const newRank = parseInt(rankValue)
      if (newRank > 0 && newRank <= players.length) {
        handleRankChange(editingRank, newRank)
      }
    }
    setEditingRank(null)
    setRankValue("")
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Create Your QB Rankings</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Click on rank numbers to edit or drag players to reorder
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardTitle className="text-center">QB Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border-2 rounded-xl hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  {/* Rank Input */}
                  <div className="w-12 text-center">
                    {editingRank === player.id ? (
                      <input
                        type="number"
                        value={rankValue}
                        onChange={(e) => setRankValue(e.target.value)}
                        onBlur={finishEditing}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') finishEditing()
                          if (e.key === 'Escape') setEditingRank(null)
                        }}
                        className="w-12 text-center font-bold text-lg text-gray-900 border-b border-blue-500 focus:outline-none bg-transparent"
                        autoFocus
                        min="1"
                        max={players.length}
                      />
                    ) : (
                      <div 
                        className="font-bold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => startEditing(player.id, player.rank)}
                      >
                        {player.rank}
                      </div>
                    )}
                  </div>

                  {/* Player Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-green-500 p-0.5">
                      <img 
                        src={player.avatarUrl}
                        alt={player.name}
                        className="w-full h-full rounded-full bg-gray-200 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = player.teamLogoUrl;
                          target.onerror = () => {
                            target.src = '/placeholder-user.jpg';
                          };
                        }}
                      />
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {player.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
                        {player.position}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <img 
                        src={player.teamLogoUrl}
                        alt={player.team}
                        className="w-4 h-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <span className="font-medium">{player.team}</span>
                    </div>
                  </div>

                  {/* Projected Points */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {player.projected} pts
                    </div>
                    <div className="text-xs text-gray-500">projected</div>
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

export function AccuracyDemo() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Get Real Feedback</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          See how your rankings performed compared to actual results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
          <CardContent className="text-center pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <CircularProgress value={87.3} size={100} />
            </div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Overall Accuracy</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
          <CardContent className="text-center pt-8 pb-6">
            <div className="text-4xl font-bold text-green-600 mb-4">+12</div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Rank Improvement</p>
            <p className="text-sm text-slate-500 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
          <CardContent className="text-center pt-8 pb-6">
            <div className="text-4xl font-bold text-blue-600 mb-4">94.2%</div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Best Week</p>
            <p className="text-sm text-slate-500 mt-1">Week 6 - QB</p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardTitle>Position Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { position: "QB", accuracy: 91.3, color: "bg-red-500" },
                { position: "RB", accuracy: 87.0, color: "bg-green-500" },
                { position: "WR", accuracy: 81.7, color: "bg-blue-500" },
                { position: "TE", accuracy: 89.3, color: "bg-yellow-500" },
              ].map((pos) => (
                <div key={pos.position} className="flex items-center space-x-4">
                  <Badge className={`${pos.color} text-white font-bold w-12 justify-center text-sm`}>
                    {pos.position}
                  </Badge>
                  <div className="flex-1">
                    <Progress value={pos.accuracy} className="h-3" />
                  </div>
                  <span className="text-lg font-bold w-16 text-right">{pos.accuracy}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function LeaderboardDemo() {
  const leaderboard = [
    { rank: 1, name: "FantasyGuru", accuracy: 94.2, badge: "👑" },
    { rank: 2, name: "RankMaster", accuracy: 92.8, badge: "🥈" },
    { rank: 3, name: "You", accuracy: 87.3, badge: "🥉", isUser: true },
    { rank: 4, name: "StatNinja", accuracy: 86.1, badge: "" },
    { rank: 5, name: "GridironPro", accuracy: 85.9, badge: "" },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">See How You Stack Up</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg">See how you stack up against other fantasy experts</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardTitle className="text-xl">Weekly Leaderboard</CardTitle>
            <CardDescription className="text-base">Top performers this week</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
                    user.isUser
                      ? "bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-300 dark:border-blue-700 shadow-md"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white dark:border-slate-700 shadow-sm">
                    {user.rank}
                  </div>
                  <Avatar className="w-10 h-10 border-2 border-white dark:border-slate-700 shadow-sm">
                    <AvatarImage src="/logo.png" />
                    <AvatarFallback className="text-sm font-bold">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-lg ${user.isUser ? "text-blue-700 dark:text-blue-300" : ""}`}>
                        {user.name}
                      </span>
                      {user.badge && <span className="text-lg">{user.badge}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{user.accuracy}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-full border border-green-200 dark:border-green-800">
          <Trophy className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-700 dark:text-green-300">You're in the top 15% of all users!</span>
        </div>
      </div>
    </div>
  )
}

export function CommunityDemo() {
  const [friends, setFriends] = useState([
    { id: 1, name: "Mike Johnson", accuracy: 89.2, following: true },
    { id: 2, name: "Sarah Chen", accuracy: 91.5, following: false },
    { id: 3, name: "Alex Rodriguez", accuracy: 86.8, following: true },
  ])

  const toggleFollow = (userId: number) => {
    setFriends(friends.map((friend) => 
      friend.id === userId ? { ...friend, following: !friend.following } : friend
    ))
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Join the Community</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Connect with fellow fantasy football enthusiasts and share your insights
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardTitle className="text-xl">Find Fellow GridCasters</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                      <AvatarImage src="/logo.png" />
                      <AvatarFallback className="font-bold">
                        {friend.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-semibold">{friend.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{friend.accuracy}% accuracy</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <CircularProgress value={friend.accuracy} size={40} />
                    </div>

                    {friend.following ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFollow(friend.id)}
                        className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                      </Button>
                    ) : (
                      <GradientButton size="sm" onClick={() => toggleFollow(friend.id)} icon={UserPlus}>
                        Follow
                      </GradientButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
            <CardContent className="text-center pt-8 pb-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">247</div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Followers</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
            <CardContent className="text-center pt-8 pb-6">
              <div className="text-3xl font-bold text-green-600 mb-2">189</div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Following</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 