"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CircularProgress } from "@/components/ui/circular-progress"
import { GradientButton } from "@/components/ui/gradient-button"
import { Trophy, Target, Users, BarChart3, GripVertical } from "lucide-react"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

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
    { id: "1", name: "Josh Allen", team: "BUF", position: "QB", projected: 24.8, rank: 1 },
    { id: "2", name: "Lamar Jackson", team: "BAL", position: "QB", projected: 23.2, rank: 2 },
    { id: "3", name: "Jalen Hurts", team: "PHI", position: "QB", projected: 22.1, rank: 3 },
    { id: "4", name: "Patrick Mahomes", team: "KC", position: "QB", projected: 21.9, rank: 4 },
    { id: "5", name: "Dak Prescott", team: "DAL", position: "QB", projected: 20.5, rank: 5 },
  ])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(players)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update ranks
    const updatedItems = items.map((item, index) => ({
      ...item,
      rank: index + 1,
    }))

    setPlayers(updatedItems)
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
          Drag players to arrange them in your predicted order of performance
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardTitle className="text-center">Week 8 QB Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="demo-players">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {players.map((player, index) => (
                      <Draggable key={player.id} draggableId={player.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center space-x-4 p-4 bg-white dark:bg-slate-800 border-2 rounded-xl transition-all ${
                              snapshot.isDragging
                                ? "shadow-2xl scale-105 border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                                : "hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-6 h-6" />
                            </div>

                            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white dark:border-slate-700 shadow-sm">
                              {index + 1}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-1">
                                <span className="font-bold text-lg">{player.name}</span>
                                <Badge variant="outline" className="font-medium">
                                  {player.team}
                                </Badge>
                                <Badge className={`font-medium ${getPositionColor(player.position)}`}>
                                  {player.position}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                Projected: {player.projected} pts
                              </p>
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
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <GradientButton size="lg">Save Rankings</GradientButton>
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
  const friends = [
    { name: "Mike Johnson", accuracy: 89.2, following: true },
    { name: "Sarah Chen", accuracy: 91.5, following: false },
    { name: "Alex Rodriguez", accuracy: 86.8, following: true },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Join the Community</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Follow friends, share insights, and learn from top performers
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardTitle className="text-xl">Suggested Users</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {friends.map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border"
                >
                  <Avatar className="w-12 h-12 border-2 border-white dark:border-slate-700 shadow-sm">
                    <AvatarImage src="/logo.png" />
                    <AvatarFallback className="font-bold">
                      {friend.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{friend.name}</p>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{friend.accuracy}% accuracy</p>
                  </div>
                  <GradientButton size="sm">{friend.following ? "Following" : "Follow"}</GradientButton>
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