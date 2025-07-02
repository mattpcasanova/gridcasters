import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Trophy, Users, Target, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/images/rankbet-logo.png" alt="RankBet Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold">
              <span className="text-blue-400">Rank</span>
              <span className="text-green-400">Bet</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">
              How It Works
            </a>
            <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/signin">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
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
            <Link href="/rankings">
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
                  <span className="text-slate-400 text-sm">rankbet.com/dashboard</span>
                </div>
              </div>
            </div>

            {/* Main Dashboard Screenshot */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-b-2xl border-x border-b border-slate-700 relative overflow-hidden min-h-[500px]">
              {/* Simulated Dashboard Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg"></div>
                    <span className="text-xl font-bold text-slate-800">RankBet</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-3 py-1 rounded text-sm font-medium">
                      New Ranking
                    </div>
                    <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                  </div>
                </div>

                {/* Welcome Section */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back, John!</h1>
                  <p className="text-slate-600">Here's how your rankings are performing this week.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-slate-800">87.3%</div>
                        <div className="text-sm text-slate-600">Accuracy Score</div>
                        <div className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +2.1% from last week
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">87%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-slate-800">#3</div>
                    <div className="text-sm text-slate-600">League Rank</div>
                    <div className="text-xs text-slate-500 mt-1">in Global Rankings</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-slate-800">6</div>
                    <div className="text-sm text-slate-600">Week 8 Rankings</div>
                    <div className="text-xs text-slate-500 mt-1">Active this week</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-slate-800">247</div>
                    <div className="text-sm text-slate-600">Followers</div>
                    <div className="text-xs text-green-600 mt-1">+12 this week</div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Rankings List */}
                  <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Recent Rankings</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Week 8 QB Rankings", accuracy: "92%", status: "active" },
                        { name: "Week 8 RB Rankings", accuracy: "85%", status: "active" },
                        { name: "Week 8 WR Rankings", accuracy: "78%", status: "active" },
                        { name: "Week 8 TE Rankings", accuracy: "88%", status: "active" },
                      ].map((ranking, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
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
                              <div className="font-medium text-slate-800">{ranking.name}</div>
                              <div className="text-xs text-slate-500">2 days ago</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              {ranking.accuracy} accuracy
                            </div>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leaderboard */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Global Leaderboard</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Mike Chen", accuracy: "94.2%", rank: 1 },
                        { name: "Sarah Johnson", accuracy: "91.8%", rank: 2 },
                        { name: "You", accuracy: "87.3%", rank: 3, isUser: true },
                        { name: "Alex Rodriguez", accuracy: "85.1%", rank: 4 },
                      ].map((user, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-2 rounded ${user.isUser ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                user.rank === 1
                                  ? "bg-yellow-500 text-white"
                                  : user.rank === 2
                                    ? "bg-gray-400 text-white"
                                    : user.rank === 3
                                      ? "bg-orange-500 text-white"
                                      : "bg-slate-200"
                              }`}
                            >
                              {user.rank}
                            </div>
                            <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
                            <span className={`text-sm ${user.isUser ? "font-semibold text-blue-600" : ""}`}>
                              {user.name}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-slate-600">{user.accuracy}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-20 right-8 bg-white rounded-lg shadow-lg p-4 transform rotate-3">
                <div className="text-sm font-semibold text-slate-800 mb-2">Weekly Performance</div>
                <div className="text-2xl font-bold text-green-600">+3.2%</div>
                <div className="text-xs text-slate-600">vs last week</div>
              </div>

              <div className="absolute bottom-20 left-8 bg-white rounded-lg shadow-lg p-4 transform -rotate-2">
                <div className="text-sm font-semibold text-slate-800 mb-2">Quick Actions</div>
                <div className="space-y-1">
                  <div className="text-xs bg-gradient-to-r from-blue-600 to-green-600 text-white px-2 py-1 rounded">
                    Create New Ranking
                  </div>
                  <div className="text-xs bg-slate-100 px-2 py-1 rounded">View Analytics</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Your Rankings, Your Record</h3>
              <p className="text-slate-300">
                See how your predictions perform against actual player results with live accuracy scoring
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Outrank the Competition</h3>
              <p className="text-slate-300">
                Compete with friends and the community to see who has the most accurate fantasy predictions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">Get started with RankBet in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create Your Rankings</h3>
              <p className="text-slate-300 leading-relaxed">
                Drag and drop players to create your weekly fantasy football rankings. Use our intuitive interface to
                rank QBs, RBs, WRs, and TEs based on your analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Track Your Accuracy</h3>
              <p className="text-slate-300 leading-relaxed">
                After each week, see how your predictions performed against actual player results. Our algorithm
                calculates your accuracy score and tracks your improvement over time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Compete & Improve</h3>
              <p className="text-slate-300 leading-relaxed">
                Climb the global leaderboards, follow expert analysts, and join groups to compete with friends. Use
                aggregate rankings to combine multiple sources for better predictions.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8"
              >
                Start Ranking Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to become a fantasy football ranking expert
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Accuracy Scoring</CardTitle>
                <CardDescription className="text-slate-300">
                  Track your ranking accuracy with advanced statistical algorithms and performance metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Social Competition</CardTitle>
                <CardDescription className="text-slate-300">
                  Follow friends, join groups, and compete on accuracy leaderboards
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Aggregate Rankings</CardTitle>
                <CardDescription className="text-slate-300">
                  Combine rankings from ESPN, Yahoo, FantasyPros, and friends with custom weighting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">Performance Analytics</CardTitle>
                <CardDescription className="text-slate-300">
                  Detailed insights into your ranking trends and improvement over time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-red-400" />
                </div>
                <CardTitle className="text-white">Expert Integration</CardTitle>
                <CardDescription className="text-slate-300">
                  Compare your rankings with expert predictions from major fantasy platforms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-teal-400" />
                </div>
                <CardTitle className="text-white">Achievement System</CardTitle>
                <CardDescription className="text-slate-300">
                  Earn badges and achievements as you improve your ranking accuracy
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Outrank the Competition?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of fantasy football players who are improving their skills with RankBet
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8"
            >
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image src="/images/rankbet-logo.png" alt="RankBet Logo" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-bold">
                <span className="text-blue-400">Rank</span>
                <span className="text-green-400">Bet</span>
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
            <p>&copy; 2024 RankBet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
