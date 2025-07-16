'use client';

import { useState, useEffect } from 'react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Calculator, TrendingUp, Clock } from 'lucide-react';

interface AccuracyScoreDisplayProps {
  rankingId: string;
  position: string;
  initialScore?: number | null;
  showCalculateButton?: boolean;
  isPending?: boolean;
  pendingReason?: string;
}

interface AccuracyBreakdown {
  baseScore: number;
  bonuses: number;
  penalties: number;
  details: {
    perfectMatches: number;
    closeMatches: number;
    top10Correct: number;
    top5Correct: number;
    busts: number;
    inactivePlayers: number;
  };
}

export function AccuracyScoreDisplay({ 
  rankingId, 
  position, 
  initialScore, 
  showCalculateButton = true,
  isPending = false,
  pendingReason = "Week hasn't finished yet"
}: AccuracyScoreDisplayProps) {
  const [accuracyScore, setAccuracyScore] = useState<number | null>(initialScore || null);
  const [breakdown, setBreakdown] = useState<AccuracyBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (initialScore !== undefined) {
      setAccuracyScore(initialScore);
    }
  }, [initialScore]);

  const fetchAccuracyScore = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rankings/${rankingId}/accuracy`);
      if (response.ok) {
        const data = await response.json();
        setAccuracyScore(data.accuracyScore);
        if (data.breakdown) {
          setBreakdown(data.breakdown);
        }
      }
    } catch (error) {
      console.error('Error fetching accuracy score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAccuracyScore = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch(`/api/rankings/${rankingId}/accuracy`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setAccuracyScore(data.accuracyScore);
        setBreakdown(data.breakdown);
      }
    } catch (error) {
      console.error('Error calculating accuracy score:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Elite', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 80) return { level: 'Excellent', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 70) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 60) return { level: 'Average', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'Needs Work', color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Accuracy Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Accuracy Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-200 bg-amber-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xs text-amber-600 mt-1 font-medium">Pending</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Score Pending</p>
              <p className="text-xs text-slate-500">{pendingReason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (accuracyScore === null) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Accuracy Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No accuracy score available yet</p>
            {showCalculateButton && (
              <Button 
                onClick={calculateAccuracyScore} 
                disabled={isCalculating}
                className="w-full"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Score
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const scoreLevel = getScoreLevel(accuracyScore);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Accuracy Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <CircularProgress 
              value={accuracyScore} 
              size="lg" 
              showText={true}
            />
            <div>
              <Badge className={`${scoreLevel.bg} ${scoreLevel.color} border-0`}>
                {scoreLevel.level}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">
                {position} Rankings
              </p>
            </div>
          </div>
          {showCalculateButton && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={calculateAccuracyScore} 
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Recalculate'}
            </Button>
          )}
        </div>

        {breakdown && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">{breakdown.details.perfectMatches}</div>
                <div className="text-gray-600">Perfect</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">{breakdown.details.closeMatches}</div>
                <div className="text-gray-600">Close</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">{breakdown.details.top10Correct}</div>
                <div className="text-gray-600">Top 10</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Score Breakdown</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Base Score:</span>
                  <span className="font-medium">{breakdown.baseScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonuses:</span>
                  <span className="font-medium text-green-600">+{breakdown.bonuses}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Penalties:</span>
                  <span className="font-medium text-red-600">-{breakdown.penalties}%</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Final Score:</span>
                  <span>{accuracyScore}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 