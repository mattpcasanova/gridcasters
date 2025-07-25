import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Trophy, Users, Target, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="GridCasters Logo" width={48} height={48} className="w-12 h-12" />
            <span className="text-2xl font-bold">
              <span className="text-blue-400">Grid</span>
              <span className="text-green-400">Casters</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">
              Features
            </a>
            <Link href="/demo" className="text-slate-300 hover:text-white transition-colors">
              How it Works
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        {/* More Prominent Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-600/30">Rank Smart. Bet Better.</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"> Rankings</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create, track, and compare your fantasy football player rankings with statistical accuracy scoring. Compete
            with friends and improve your prediction skills with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Ranking <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 text-lg px-8 bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Watch Demo
                  </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Screenshot Showcase Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Your Rankings, Your Record</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the power of data-driven fantasy football rankings
            </p>
          </div>

          {/* Main Screenshot Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Browser Frame */}
            <div className="bg-slate-800 rounded-t-2xl p-4 border border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 bg-slate-700 rounded ml-4 px-3 py-1">
                  <span className="text-slate-400 text-sm">gridcasters.com/dashboard</span>
                </div>
              </div>
            </div>

            {/* Main Dashboard Screenshot */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-b-2xl border-x border-b border-slate-700 relative overflow-hidden min-h-[400px] sm:min-h-[500px]">
              {/* Simulated Dashboard Content */}
              <div className="p-4 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg"></div>
                    <span className="text-lg sm:text-xl font-bold text-slate-800">GridCasters</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium">
                      New Ranking
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-300 rounded-full"></div>
                  </div>
                </div>

                {/* Welcome Section */}
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-lg sm:text-2xl font-bold text-slate-800 mb-1">Welcome back, John!</h1>
                  <p className="text-sm sm:text-base text-slate-600">Here's how your rankings are performing this week.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg sm:text-2xl font-bold text-slate-800">87.3%</div>
                        <div className="text-xs sm:text-sm text-slate-600">Accuracy Score</div>
                        <div className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +2.1% from last week
                        </div>
                      </div>
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">87%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="text-lg sm:text-2xl font-bold text-slate-800">#3</div>
                    <div className="text-xs sm:text-sm text-slate-600">League Rank</div>
                    <div className="text-xs text-slate-500 mt-1">in Global Rankings</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="text-lg sm:text-2xl font-bold text-slate-800">6</div>
                    <div className="text-xs sm:text-sm text-slate-600">Week 8 Rankings</div>
                    <div className="text-xs text-slate-500 mt-1">Active this week</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="text-lg sm:text-2xl font-bold text-slate-800">247</div>
                    <div className="text-xs sm:text-sm text-slate-600">Followers</div>
                    <div className="text-xs text-green-600 mt-1">+12 this week</div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* Rankings List */}
                  <div className="sm:col-span-2 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-800">Recent Rankings</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { name: "Week 8 QB Rankings", accuracy: "92%", status: "active" },
                        { name: "Week 8 RB Rankings", accuracy: "85%", status: "active" },
                        { name: "Week 8 WR Rankings", accuracy: "78%", status: "active" },
                        { name: "Week 8 TE Rankings", accuracy: "88%", status: "active" },
                      ].map((ranking, i) => (
                        <div key={i} className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-bold">
                                {ranking.name.includes("QB")
                                  ? "QB"
                                  : ranking.name.includes("RB")
                                    ? "RB"
                                    : ranking.name.includes("WR")
                                      ? "WR"
                                      : "TE"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-sm sm:text-base text-slate-800">{ranking.name}</div>
                              <div className="text-xs text-slate-500">2 days ago</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <div className="bg-green-100 text-green-800 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                              {ranking.accuracy}
                            </div>
                            <div className="bg-blue-100 text-blue-800 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                              {ranking.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leaderboard */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-800">Top Rankers</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { name: "Sarah K.", accuracy: "94%", rank: 1 },
                        { name: "Mike R.", accuracy: "91%", rank: 2 },
                        { name: "You", accuracy: "87%", rank: 3, isUser: true },
                        { name: "Alex M.", accuracy: "85%", rank: 4 },
                      ].map((user, i) => (
                        <div key={i} className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                          user.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                        }`}>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-300 rounded-full"></div>
                            <div>
                              <div className={`font-medium text-sm sm:text-base ${user.isUser ? 'text-blue-800' : 'text-slate-800'}`}>
                                {user.name}
                              </div>
                              <div className="text-xs text-slate-500">#{user.rank} Global</div>
                            </div>
                          </div>
                          <div className="bg-green-100 text-green-800 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                            {user.accuracy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to create, track, and improve your fantasy football rankings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-bold">Statistical Accuracy</CardTitle>
                <CardDescription className="text-slate-300 leading-relaxed">
                  Track your prediction accuracy with advanced statistical analysis and performance metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-bold">Competitive Rankings</CardTitle>
                <CardDescription className="text-slate-300 leading-relaxed">
                  Compete with friends and the community to prove your ranking expertise.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-bold">Social Features</CardTitle>
                <CardDescription className="text-slate-300 leading-relaxed">
                  Follow friends, join groups, and share your rankings with the community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Ranking?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of fantasy football enthusiasts and start tracking your rankings today.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6">
              <Image src="/logo.png" alt="GridCasters Logo" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-bold">
                <span className="text-blue-400">Grid</span>
                <span className="text-green-400">Casters</span>
              </span>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} GridCasters. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
