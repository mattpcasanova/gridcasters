"use client"

import { useState, useEffect } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CircularProgress } from "@/components/ui/circular-progress"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Trophy,
  Target,
  Users,
  BarChart3,
  GripVertical,
} from "lucide-react"
import Link from "next/link"

const demoSteps = [
  {
    id: 1,
    title: "Welcome to RankBet",
    description: "Your fantasy football ranking companion",
    content: "RankBetDemo",
  },
  {
    id: 2,
    title: "Create Your Rankings",
    description: "Drag and drop players to create your weekly rankings",
    content: "RankingsDemo",
  },
  {
    id: 3,
    title: "Track Your Accuracy",
    description: "See how your predictions match real player performance",
    content: "AccuracyDemo",
  },
  {
    id: 4,
    title: "Compete on Leaderboards",
    description: "Climb the ranks and compete with other users",
    content: "LeaderboardDemo",
  },
  {
    id: 5,
    title: "Join the Community",
    description: "Follow friends, share rankings, and grow your network",
    content: "CommunityDemo",
  },
]

function RankBetDemo() {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mx-auto flex items-center justify-center">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to RankBet</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The ultimate fantasy football ranking platform where your predictions meet performance. Track accuracy,
          compete with friends, and become a ranking expert.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-sm font-medium">Accurate Rankings</p>
        </div>
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-sm font-medium">Performance Tracking</p>
        </div>
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
          <p className="text-sm font-medium">Leaderboards</p>
        </div>
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <p className="text-sm font-medium">Community</p>
        </div>
      </div>
    </div>
  )
}

function RankingsDemo() {
  const players = [
    { name: "Josh Allen", team: "BUF", position: "QB", projected: 24.8 },
    { name: "Lamar Jackson", team: "BAL", position: "QB", projected: 23.2 },
    { name: "Jalen Hurts", team: "PHI", position: "QB", projected: 22.1 },
    { name: "Patrick Mahomes", team: "KC", position: "QB", projected: 21.9 },
    { name: "Dak Prescott", team: "DAL", position: "QB", projected: 20.5 },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Create Your QB Rankings</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Drag players to arrange them in your predicted order of performance
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-2">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 border rounded-lg cursor-move hover:shadow-md transition-shadow"
          >
            <GripVertical className="w-4 h-4 text-slate-400" />
            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{player.name}</span>
                <Badge variant="outline" className="text-xs">
                  {player.team}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Projected: {player.projected} pts</p>
            </div>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">{player.position}</Badge>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Save Rankings
        </Button>
      </div>
    </div>
  )
}

function AccuracyDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Track Your Accuracy</h3>
        <p className="text-slate-600 dark:text-slate-400">See how your rankings performed compared to actual results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center pt-6">
            <CircularProgress value={87.3} size={80} />
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Overall Accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <div className="text-2xl font-bold text-green-600 mb-2">+12</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rank Improvement</p>
            <p className="text-xs text-slate-500">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">94.2%</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Best Week</p>
            <p className="text-xs text-slate-500">Week 6 - QB</p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-md mx-auto">
        <h4 className="font-semibold mb-3">Position Breakdown</h4>
        <div className="space-y-3">
          {[
            { position: "QB", accuracy: 91.3, color: "bg-red-500" },
            { position: "RB", accuracy: 87.0, color: "bg-green-500" },
            { position: "WR", accuracy: 81.7, color: "bg-blue-500" },
            { position: "TE", accuracy: 89.3, color: "bg-yellow-500" },
          ].map((pos) => (
            <div key={pos.position} className="flex items-center space-x-3">
              <Badge className={`${pos.color} text-white font-bold w-12 justify-center`}>{pos.position}</Badge>
              <div className="flex-1">
                <Progress value={pos.accuracy} className="h-2" />
              </div>
              <span className="text-sm font-medium w-12">{pos.accuracy}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LeaderboardDemo() {
  const leaderboard = [
    { rank: 1, name: "FantasyGuru", accuracy: 94.2, badge: "👑" },
    { rank: 2, name: "RankMaster", accuracy: 92.8, badge: "🥈" },
    { rank: 3, name: "You", accuracy: 87.3, badge: "🥉", isUser: true },
    { rank: 4, name: "StatNinja", accuracy: 86.1, badge: "" },
    { rank: 5, name: "GridironPro", accuracy: 85.9, badge: "" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Compete on Leaderboards</h3>
        <p className="text-slate-600 dark:text-slate-400">See how you stack up against other fantasy experts</p>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Leaderboard</CardTitle>
            <CardDescription>Top performers this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  user.isUser
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "bg-slate-50 dark:bg-slate-800"
                }`}
              >
                <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {user.rank}
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${user.isUser ? "text-blue-700 dark:text-blue-300" : ""}`}>
                      {user.name}
                    </span>
                    {user.badge && <span>{user.badge}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{user.accuracy}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">You're in the top 15% of all users!</p>
        <Button variant="outline">View Full Leaderboard</Button>
      </div>
    </div>
  )
}

function CommunityDemo() {
  const friends = [
    { name: "Mike Johnson", accuracy: 89.2, following: true },
    { name: "Sarah Chen", accuracy: 91.5, following: false },
    { name: "Alex Rodriguez", accuracy: 86.8, following: true },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Join the Community</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Follow friends, share insights, and learn from top performers
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggested Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {friends.map((friend, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {friend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{friend.accuracy}% accuracy</p>
                </div>
                <Button size="sm" variant={friend.following ? "outline" : "default"}>
                  {friend.following ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="text-center pt-6">
              <div className="text-2xl font-bold">247</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Followers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center pt-6">
              <div className="text-2xl font-bold">189</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Following</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <Link href="/signup">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Get Started Free
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(currentStep + 1)
              return 0
            } else {
              setIsPlaying(false)
              return 100
            }
          }
          return prev + 1
        })
      }, 50) // 5 seconds per step
    }

    return () => clearInterval(interval)
  }, [isPlaying, currentStep])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setProgress(0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setProgress(0)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setProgress(0)
    setIsPlaying(false)
  }

  const renderStepContent = () => {
    switch (demoSteps[currentStep].content) {
      case "RankBetDemo":
        return <RankBetDemo />
      case "RankingsDemo":
        return <RankingsDemo />
      case "AccuracyDemo":
        return <AccuracyDemo />
      case "LeaderboardDemo":
        return <LeaderboardDemo />
      case "CommunityDemo":
        return <CommunityDemo />
      default:
        return <RankBetDemo />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">RankBet Demo</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Take a guided tour of RankBet's features and see how it works
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{demoSteps[currentStep].title}</span>
            </div>
            <div className="flex space-x-2 mb-2">
              {demoSteps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                    index < currentStep
                      ? "bg-green-500"
                      : index === currentStep
                        ? "bg-blue-500"
                        : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  {index === currentStep && (
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle>{demoSteps[currentStep].title}</CardTitle>
              <CardDescription>{demoSteps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="py-8">{renderStepContent()}</CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentStep === 0}>
              <SkipBack className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button variant="outline" size="sm" onClick={handlePlay}>
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={handleNext} disabled={currentStep === demoSteps.length - 1}>
              Next
              <SkipForward className="w-4 h-4 ml-2" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>

          {/* Call to Action */}
          {currentStep === demoSteps.length - 1 && (
            <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
              <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Join thousands of fantasy football enthusiasts already using RankBet
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
