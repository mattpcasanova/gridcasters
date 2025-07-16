"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Calculator, 
  BarChart3, 
  Trash2, 
  Users, 
  Trophy, 
  Target,
  TrendingUp,
  Clock,
  Database
} from 'lucide-react';

interface SimulationStats {
  totalUsers: number;
  totalRankings: number;
  rankingsPerUser: number;
  positions: string[];
  accuracyRange: {
    min: number;
    max: number;
    avg: number;
  };
}

interface AnalysisResults {
  totalUsers: number;
  totalRankings: number;
  averageAccuracy: number;
  accuracyDistribution: Record<string, number>;
  percentileDistribution: Record<string, number>;
  performanceBySkillLevel: Record<string, { avgAccuracy: number; avgPercentile: number }>;
  systemPerformance: {
    calculationTime: string;
    memoryUsage: string;
    databaseQueries: number;
    cacheHitRate: string;
  };
}

export default function TestPercentilesPage() {
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [stats, setStats] = useState<SimulationStats | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const [numUsers, setNumUsers] = useState(100);
  const [numRankings, setNumRankings] = useState(5);

  const runSimulation = async (action: string) => {
    setLoading(true);
    setCurrentAction(action);

    try {
      const response = await fetch('/api/test/percentile-simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          numUsers,
          numRankings
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (action === 'generate') {
          setStats(data.stats);
        } else if (action === 'analyze') {
          setAnalysis(data.analysis);
        }
      } else {
        console.error('Simulation failed:', data.error);
      }
    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setLoading(false);
      setCurrentAction('');
    }
  };

  const getLoadingMessage = () => {
    switch (currentAction) {
      case 'generate':
        return `Generating ${numUsers} users with ${numRankings} rankings each...`;
      case 'calculate':
        return 'Calculating percentiles for all periods...';
      case 'analyze':
        return 'Analyzing simulation results...';
      case 'cleanup':
        return 'Cleaning up simulation data...';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Percentile System Test</h1>
        <p className="text-muted-foreground">
          Test the percentile tracking system with simulated data to verify it works at scale.
        </p>
      </div>

      {/* Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Simulation Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Number of Users</label>
              <input
                type="number"
                value={numUsers}
                onChange={(e) => setNumUsers(parseInt(e.target.value) || 100)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                min="10"
                max="1000"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rankings per User</label>
              <input
                type="number"
                value={numRankings}
                onChange={(e) => setNumRankings(parseInt(e.target.value) || 5)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                min="1"
                max="20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button
          onClick={() => runSimulation('generate')}
          disabled={loading}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <Play className="h-5 w-5" />
          <span className="text-sm">Generate Data</span>
        </Button>

        <Button
          onClick={() => runSimulation('calculate')}
          disabled={loading}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <Calculator className="h-5 w-5" />
          <span className="text-sm">Calculate Percentiles</span>
        </Button>

        <Button
          onClick={() => runSimulation('analyze')}
          disabled={loading}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm">Analyze Results</span>
        </Button>

        <Button
          onClick={() => runSimulation('cleanup')}
          disabled={loading}
          variant="destructive"
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <Trash2 className="h-5 w-5" />
          <span className="text-sm">Cleanup</span>
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>{getLoadingMessage()}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulation Stats */}
      {stats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Simulation Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalRankings}</div>
                <div className="text-sm text-muted-foreground">Total Rankings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.rankingsPerUser}</div>
                <div className="text-sm text-muted-foreground">Per User</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.accuracyRange.avg.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Avg Accuracy</div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Accuracy Range</h4>
              <div className="flex items-center gap-2 text-sm">
                <span>Min: {stats.accuracyRange.min.toFixed(1)}%</span>
                <span>•</span>
                <span>Max: {stats.accuracyRange.max.toFixed(1)}%</span>
                <span>•</span>
                <span>Avg: {stats.accuracyRange.avg.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Positions</h4>
              <div className="flex gap-2">
                {stats.positions.map(pos => (
                  <Badge key={pos} variant="secondary">{pos}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analysis.totalRankings}</div>
                  <div className="text-sm text-muted-foreground">Rankings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analysis.averageAccuracy.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Avg Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{analysis.systemPerformance.calculationTime}</div>
                  <div className="text-sm text-muted-foreground">Calculation Time</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accuracy Distribution */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Accuracy Distribution
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(analysis.accuracyDistribution).map(([range, percentage]) => (
                      <div key={range} className="flex items-center justify-between">
                        <span className="text-sm">{range}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20" />
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Percentile Distribution */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Percentile Distribution
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(analysis.percentileDistribution).map(([range, percentage]) => (
                      <div key={range} className="flex items-center justify-between">
                        <span className="text-sm">{range}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20" />
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skill Level Performance */}
              <div className="mt-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance by Skill Level
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysis.performanceBySkillLevel).map(([level, stats]) => (
                    <div key={level} className="text-center p-3 border rounded-lg">
                      <div className="font-medium capitalize text-sm mb-1">{level}</div>
                      <div className="text-lg font-bold text-blue-600">{stats.avgAccuracy.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                      <div className="text-lg font-bold text-green-600">{stats.avgPercentile.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Percentile</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Performance */}
              <div className="mt-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  System Performance
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{analysis.systemPerformance.calculationTime}</div>
                    <div className="text-sm text-muted-foreground">Calculation Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{analysis.systemPerformance.memoryUsage}</div>
                    <div className="text-sm text-muted-foreground">Memory Usage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{analysis.systemPerformance.databaseQueries}</div>
                    <div className="text-sm text-muted-foreground">DB Queries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{analysis.systemPerformance.cacheHitRate}</div>
                    <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 