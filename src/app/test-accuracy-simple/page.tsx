'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SimpleTestPage() {
  useEffect(() => {
    // Auto-run tests when page loads
    if (typeof window !== 'undefined' && (window as any).runAccuracyTests) {
      console.log('🧪 Auto-running accuracy tests...');
      setTimeout(() => {
        (window as any).runAccuracyTests();
      }, 500);
    }
  }, []);

  const runTests = () => {
    if (typeof window !== 'undefined' && (window as any).runAccuracyTests) {
      console.clear();
      console.log('🧪 Manual test run...');
      (window as any).runAccuracyTests();
    } else {
      console.error('Test runner not available');
    }
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
            Tests are automatically running. Check the browser console (F12) for detailed results.
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Runner</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runTests} className="flex items-center gap-2">
              Run Tests Again
            </Button>
            <p className="text-sm text-slate-600 mt-2">
              Open Developer Tools (F12) to see detailed test output in the console.
            </p>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to View Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
              <li>Press F12 to open Developer Tools</li>
              <li>Go to the Console tab</li>
              <li>Look for test results starting with 🧪</li>
              <li>Green ✅ indicates passed tests</li>
              <li>Red ❌ indicates failed tests</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 