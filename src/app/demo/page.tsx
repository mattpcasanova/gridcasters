"use client"

import { useState } from "react"
import { NavigationHeader } from "@/components/layout/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientButton } from "@/components/ui/gradient-button"
import { SkipForward, SkipBack, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { 
  GridCastersDemo, 
  RankingsDemo, 
  AccuracyDemo, 
  LeaderboardDemo, 
  CommunityDemo 
} from "@/components/demo/demo-components"

const demoSteps = [
  {
    id: 1,
    title: "Welcome to GridCasters",
    description: "Your fantasy football ranking companion",
    content: "GridCastersDemo",
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
    description: "See how your rankings performed compared to actual results",
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

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
  }

  const renderStepContent = () => {
    switch (demoSteps[currentStep].content) {
      case "GridCastersDemo":
        return <GridCastersDemo />
      case "RankingsDemo":
        return <RankingsDemo />
      case "AccuracyDemo":
        return <AccuracyDemo />
      case "LeaderboardDemo":
        return <LeaderboardDemo />
      case "CommunityDemo":
        return <CommunityDemo />
      default:
        return <GridCastersDemo />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-green-900/10">
      {/* Simple header with logo and name */}
      <header className="border-b bg-white dark:bg-slate-800 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="GridCasters Logo" width={48} height={48} className="w-12 h-12" />
            <span className="text-2xl font-bold">
              <span className="text-blue-600 dark:text-blue-400">Grid</span>
              <span className="text-green-600 dark:text-green-400">Casters</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-blue-600">Grid</span>
              <span className="text-green-600">Casters</span>
              <span className="text-slate-600 dark:text-slate-400"> Demo</span>
            </h1>
          </div>

          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
              <span className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                {demoSteps[currentStep].title}
              </span>
            </div>
            <div className="flex space-x-2 mb-4">
              {demoSteps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                    index < currentStep
                      ? "bg-gradient-to-r from-green-500 to-green-600 shadow-sm"
                      : index === currentStep
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
                        : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <Card className="mb-12 shadow-2xl border-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-b-2">
              <CardTitle className="text-2xl">{demoSteps[currentStep].title}</CardTitle>
              <CardDescription className="text-lg">{demoSteps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="py-12">{renderStepContent()}</CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <GradientButton onClick={handlePrevious} disabled={currentStep === 0} size="lg" icon={SkipBack}>
              Previous
            </GradientButton>

            <GradientButton
              onClick={handleNext}
              disabled={currentStep === demoSteps.length - 1}
              size="lg"
              icon={SkipForward}
            >
              Next
            </GradientButton>

            <GradientButton onClick={handleRestart} size="lg" icon={RotateCcw}>
              Restart
            </GradientButton>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-slate-600 dark:text-slate-400">Ready to Get Started?</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
              Join thousands of fantasy football enthusiasts already using <span className="text-blue-600">Grid</span>
              <span className="text-green-600">Casters</span>
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Link href="/auth/signup">
                <GradientButton size="lg">Sign Up Free</GradientButton>
              </Link>
              <Link href="/auth/signin">
                <GradientButton size="lg">Sign In</GradientButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 