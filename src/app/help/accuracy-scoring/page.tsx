import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  BarChart3, 
  Trophy, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  CheckCircle, 
  MinusCircle,
  HelpCircle,
  Star,
  Award,
  Zap,
  Users,
  Calculator,
  Circle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accuracy Scoring Guide - RankBet',
  description: 'Learn how RankBet calculates accuracy scores for your fantasy football rankings',
};

export default function AccuracyScoringPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Accuracy Scoring Guide</h1>
        <p className="text-muted-foreground">
          Learn how we calculate accuracy scores for your fantasy football rankings
        </p>
      </div>

      <div className="space-y-8">
        {/* What We're Measuring */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Target className="w-6 h-6 text-blue-600" />
              What We're Measuring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700 leading-relaxed">
              Think of it like this: You're trying to predict which players will be the best performers in fantasy football each week. 
              It's like predicting who will win a race, but instead of just picking the winner, you have to rank ALL the runners from 1st to 36th place.
            </p>
          </CardContent>
        </Card>

        {/* How Scoring Works */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <BarChart3 className="w-6 h-6 text-green-600" />
              How Scoring Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6 font-semibold text-gray-900">
              The closer your guess is to reality, the more points you get.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">How Far Off You Are</th>
                    <th className="text-left p-3 font-semibold">Points You Get</th>
                    <th className="text-left p-3 font-semibold">What This Means</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-semibold text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Perfect! (exactly right)
                    </td>
                    <td className="p-3 font-bold text-green-700">100 points</td>
                    <td className="p-3 text-green-600">You nailed it!</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-2">1 spot off</td>
                    <td className="p-3 font-bold">85 points</td>
                    <td className="p-3 text-green-600">Really close!</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-2">2 spots off</td>
                    <td className="p-3 font-bold">70 points</td>
                    <td className="p-3 text-green-600">Pretty good!</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-2">3 spots off</td>
                    <td className="p-3 font-bold">55 points</td>
                    <td className="p-3 text-yellow-600">Not bad</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-2">4 spots off</td>
                    <td className="p-3 font-bold">40 points</td>
                    <td className="p-3 text-orange-600">Getting worse</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-2">5 spots off</td>
                    <td className="p-3 font-bold">25 points</td>
                    <td className="p-3 text-red-600">Pretty far off</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-2">6-10 spots off</td>
                    <td className="p-3 font-bold">25→10 points</td>
                    <td className="p-3 text-red-600">Way off</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-2">11+ spots off</td>
                    <td className="p-3 font-bold">10→0 points</td>
                    <td className="p-3 text-red-600">Really wrong</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bonus Points */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Star className="w-6 h-6 text-yellow-600" />
              Bonus Points (Extra Credit!)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700">
              You get <strong>bonus points</strong> for being really smart:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Predicted a top 10 player correctly</h4>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-2">+15 points</p>
                <p className="text-sm text-gray-600">You spotted a star!</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Predicted a top 5 player correctly</h4>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">+10 extra points</p>
                <p className="text-sm text-gray-600">You're really good at this!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Penalties */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Penalties (Oops!)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700">
              You lose points for big mistakes:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-gray-900">Ranked a bust in your top 10</h4>
                </div>
                <p className="text-3xl font-bold text-red-600 mb-2">-15 points</p>
                <p className="text-sm text-gray-600">You thought they'd be great, but they stunk</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <MinusCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-gray-900">Ranked a bust in your top 5</h4>
                </div>
                <p className="text-3xl font-bold text-red-600 mb-2">-20 points</p>
                <p className="text-sm text-gray-600">You really thought they'd be amazing, but they were terrible</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">Ranked someone who didn't play</h4>
                </div>
                <p className="text-3xl font-bold text-orange-600 mb-2">-10 points</p>
                <p className="text-sm text-gray-600">You picked someone who was injured/suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's a Bust */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <XCircle className="w-6 h-6 text-orange-600" />
              What's a "Bust"?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700">
              A <strong>bust</strong> is when you think someone will be great, but they end up being terrible.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <p className="font-semibold text-gray-800">Example:</p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                You rank a player #3, thinking they'll be one of the best. But they finish #25. That's a bust!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Real-World Example */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Circle className="w-6 h-6 text-purple-600" />
              Real-World Example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700">
              Let's say you're ranking Quarterbacks (QBs) for Week 1:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Your Rank</th>
                    <th className="text-left p-3 font-semibold">Player</th>
                    <th className="text-left p-3 font-semibold">Actual Rank</th>
                    <th className="text-left p-3 font-semibold">Points</th>
                    <th className="text-left p-3 font-semibold">Why?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">1</td>
                    <td className="p-3">Josh Allen</td>
                    <td className="p-3">1</td>
                    <td className="p-3 font-bold text-green-600">100 + 25</td>
                    <td className="p-3">Perfect! + Top 5 bonus</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">2</td>
                    <td className="p-3">Patrick Mahomes</td>
                    <td className="p-3">3</td>
                    <td className="p-3 font-bold text-green-600">85 + 25</td>
                    <td className="p-3">2 spots off + Top 10 bonus</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">3</td>
                    <td className="p-3">Jalen Hurts</td>
                    <td className="p-3">8</td>
                    <td className="p-3 font-bold text-green-600">25 + 15</td>
                    <td className="p-3">5 spots off + Top 10 bonus</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">4</td>
                    <td className="p-3">Lamar Jackson</td>
                    <td className="p-3">2</td>
                    <td className="p-3 font-bold text-green-600">70 + 25</td>
                    <td className="p-3">2 spots off + Top 10 bonus</td>
                  </tr>
                  <tr>
                    <td className="p-3">5</td>
                    <td className="p-3">Justin Herbert</td>
                    <td className="p-3">25</td>
                    <td className="p-3 font-bold text-red-600">5 - 35</td>
                    <td className="p-3">20 spots off + Top 5 bust penalty</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                <p className="font-semibold text-gray-800 text-lg">Your QB Score: <span className="text-3xl font-bold text-blue-600">68%</span></p>
              </div>
              <p className="text-sm text-gray-600">Average: 57% + Net Bonus: +11% = 68%</p>
            </div>
          </CardContent>
        </Card>

        {/* Position Differences */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              Position Differences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700">
              Different positions are harder or easier to predict:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">QB - Easier</h4>
                </div>
                <p className="text-sm text-gray-600">Quarterbacks are more consistent</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <Circle className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900">RB - Medium</h4>
                </div>
                <p className="text-sm text-gray-600">Running backs are somewhat predictable</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">WR - Harder</h4>
                </div>
                <p className="text-sm text-gray-600">Wide receivers are more volatile</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-gray-900">TE - Hardest</h4>
                </div>
                <p className="text-sm text-gray-600">Tight ends are the most unpredictable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's a Good Score */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Users className="w-6 h-6 text-emerald-600" />
              What's a Good Score?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700">
              Based on our simulations with 1,000 users:
            </p>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-green-100 text-green-800">90-100%</Badge>
                  <span className="font-semibold">Elite</span>
                </div>
                <span className="text-sm text-muted-foreground">15.6%</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-blue-100 text-blue-800">80-89%</Badge>
                  <span className="font-semibold">Excellent</span>
                </div>
                <span className="text-sm text-muted-foreground">32.1%</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-yellow-100 text-yellow-800">70-79%</Badge>
                  <span className="font-semibold">Good</span>
                </div>
                <span className="text-sm text-muted-foreground">33.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-orange-100 text-orange-800">60-69%</Badge>
                  <span className="font-semibold">Average</span>
                </div>
                <span className="text-sm text-muted-foreground">16.1%</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-red-100 text-red-800">Below 60%</Badge>
                  <span className="font-semibold">Needs Work</span>
                </div>
                <span className="text-sm text-muted-foreground">3.2%</span>
              </div>
            </div>
            
            <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-emerald-600" />
                <p className="font-semibold text-gray-800 text-lg">Most people score between 70-89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Line */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Zap className="w-6 h-6 text-blue-600" />
              The Bottom Line
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700">
              <strong>It's like a test where:</strong>
            </p>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Getting the exact answer right = 100 points</span>
              </li>
              <li className="flex items-center gap-3">
                <Circle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Being close = still good points</span>
              </li>
              <li className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <span>Being way off = few points</span>
              </li>
              <li className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>Making big mistakes = lose points</span>
              </li>
              <li className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <span>Being really smart = bonus points</span>
              </li>
            </ul>
            
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                <p className="font-semibold text-gray-800 text-lg">
                  <strong>The goal:</strong> Get as close as possible to predicting how players will actually perform!
                </p>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-600 italic flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              This system rewards both accuracy and smart decision-making, just like real fantasy football!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 