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
            <Image src="/logo.svg" alt="RankBet Logo" width={40} height={40} className="w-10 h-10" />
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
            <Link href="/auth/signup">
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Outrank the Competition?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of fantasy football players who are improving their skills with RankBet
          </p>
          <Link href="/auth/signup">
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
              <Image src="/logo.svg" alt="RankBet Logo" width={32} height={32} className="w-8 h-8" />
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
            <p>&copy; {new Date().getFullYear()} RankBet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
