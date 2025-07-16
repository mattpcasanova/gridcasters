'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { AccuracyTestRunner } from '@/lib/utils/accuracy-scoring.test';

interface TestResult {
  name: string;
  passed: boolean;
  expected?: any;
  actual?: any;
}

interface TestSummary {
  passed: number;
  total: number;
  percentage: number;
  results: TestResult[];
}

export default function TestAccuracyPage() {
  const [testResults, setTestResults] = useState<TestSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    setTestResults(null);
    
    // Clear console for fresh output
    console.clear();
    
    setTimeout(() => {
      try {
        const runner = new AccuracyTestRunner();
        const results = runner.runTests();
        setTestResults(results);
      } catch (error) {
        console.error('Test runner error:', error);
        setTestResults({
          passed: 0,
          total: 0,
          percentage: 0,
          results: []
        });
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Accuracy Scoring Tests</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Run comprehensive tests to verify the accuracy scoring system works correctly.
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Test Runner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run All Tests
                  </>
                )}
              </Button>
              
              {testResults && (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={testResults.percentage === 100 ? "default" : "secondary"}
                    className={testResults.percentage === 100 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                  >
                    {testResults.passed}/{testResults.total} tests passed
                  </Badge>
                  <span className="text-sm text-slate-600">
                    ({testResults.percentage}%)
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.percentage === 100 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.results.map((result, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      result.passed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
                        {result.name}
                      </p>
                      {!result.passed && (
                        <p className="text-sm text-red-600">
                          Expected {result.expected}, got {result.actual}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What These Tests Cover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Core Functionality</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Perfect predictions score 100%</li>
                  <li>• Close predictions (1-2 spots off) score high</li>
                  <li>• Bust penalties for ranking poor performers high</li>
                  <li>• Bonus points for identifying top performers</li>
                  <li>• Penalties for inactive players</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Edge Cases</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Empty rankings handle gracefully</li>
                  <li>• Partial player matches work correctly</li>
                  <li>• Scores never go negative</li>
                  <li>• Scores cap at 100%</li>
                  <li>• All positions (QB, RB, WR, TE) work</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Console Output Note */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Console Output</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-2">
              Detailed test output is also logged to the browser console. Open Developer Tools (F12) to see the full test run.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('🧪 Manual test run triggered');
                runTests();
              }}
            >
              Run Tests & Log to Console
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 