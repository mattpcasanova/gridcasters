import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Target, Users } from 'lucide-react';

interface PercentileDisplayProps {
  percentileScore: number;
  percentileRank: number;
  totalRankings: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface UserPercentileStats {
  total_rankings: number;
  avg_percentile: number;
  top_10_percentile_count: number;
  top_25_percentile_count: number;
  top_50_percentile_count: number;
  best_percentile: number;
  recent_percentile_trend: number;
}

interface UserPercentilesProps {
  userId: string;
  showDetails?: boolean;
}

export function PercentileDisplay({ 
  percentileScore, 
  percentileRank, 
  totalRankings, 
  showDetails = false,
  size = 'md'
}: PercentileDisplayProps) {
  const getPercentileColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
    if (score >= 75) return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
    return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
  };

  const getPercentileLabel = (score: number) => {
    if (score >= 95) return 'Elite';
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 50) return 'Average';
    return 'Below Average';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        className={`${getPercentileColor(percentileScore)} ${sizeClasses[size]} font-medium`}
      >
        {percentileScore.toFixed(1)}%
      </Badge>
      
      {showDetails && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{getPercentileLabel(percentileScore)}</span>
          <span className="mx-1">•</span>
          <span>#{percentileRank} of {totalRankings}</span>
        </div>
      )}
    </div>
  );
}

export function UserPercentiles({ userId, showDetails = true }: UserPercentilesProps) {
  const [stats, setStats] = useState<UserPercentileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPercentiles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}/percentiles`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch percentile data');
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching percentiles:', err);
        setError('Failed to load percentile data');
      } finally {
        setLoading(false);
      }
    };

    fetchPercentiles();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Performance Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Performance Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load performance data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Performance Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.avg_percentile.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Average Percentile</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.best_percentile.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Best Performance</div>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm">Top 10% Performances</span>
              </div>
              <Badge variant="secondary">{stats.top_10_percentile_count}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Top 25% Performances</span>
              </div>
              <Badge variant="secondary">{stats.top_25_percentile_count}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Total Rankings</span>
              </div>
              <Badge variant="secondary">{stats.total_rankings}</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 