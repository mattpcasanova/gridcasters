"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500/20 rounded-full blur-xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full">
        <Card className="backdrop-blur-sm bg-white/10 border-white/20 text-white">
          <CardContent className="p-8 text-center">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/images/rankbet-logo.png"
                alt="RankBet"
                width={80}
                height={80}
                className="mx-auto drop-shadow-2xl"
              />
            </div>

            {/* 404 Header */}
            <div className="mb-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
                404
              </h1>
              <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
              <p className="text-blue-100">
                Looks like this ranking doesn't exist. Let's get you back to the leaderboard!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>

              <Link href="/rankings" className="block">
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Rankings
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full text-white hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Fun Stats */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-sm text-blue-200">Fun fact: The average accuracy score on RankBet is 83.7%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
