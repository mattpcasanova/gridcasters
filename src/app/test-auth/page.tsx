"use client";

import { useState } from 'react';
import { useSupabase } from '@/lib/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestAuthPage() {
  const supabase = useSupabase();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testUserId, setTestUserId] = useState('');

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      addResult(`Session check - Has session: ${!!session}, User ID: ${session?.user?.id || 'none'}, Error: ${error?.message || 'none'}`);
    } catch (err) {
      addResult(`Session check failed: ${err}`);
    }
  };

  const testProfileRead = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      addResult(`Profile read - Count: ${data?.length || 0}, Error: ${error?.message || 'none'}`);
    } catch (err) {
      addResult(`Profile read failed: ${err}`);
    }
  };

  const testProfileInsert = async () => {
    if (!testUserId) {
      addResult('Please enter a test user ID first');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: testUserId,
          username: `test_${Date.now()}`,
          display_name: 'Test User',
          is_private: false,
          is_verified: false,
        })
        .select();

      addResult(`Profile insert - Success: ${!!data}, Error: ${error?.message || 'none'}, Code: ${error?.code || 'none'}`);
    } catch (err) {
      addResult(`Profile insert failed: ${err}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Authentication & RLS Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <Button onClick={testSession}>Test Session</Button>
          <Button onClick={testProfileRead}>Test Profile Read</Button>
        </div>
        
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Test User ID (UUID)"
            value={testUserId}
            onChange={(e) => setTestUserId(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={testProfileInsert}>Test Profile Insert</Button>
        </div>
        
        <Button onClick={clearResults} variant="outline">Clear Results</Button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
        <div className="space-y-1 font-mono text-sm">
          {testResults.length === 0 ? (
            <div className="text-gray-500">No tests run yet</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <h3 className="font-semibold">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Test Session: Check if user is authenticated</li>
          <li>Test Profile Read: Check if RLS allows reading profiles</li>
          <li>Test Profile Insert: Test inserting a profile (requires valid UUID and authentication)</li>
        </ul>
      </div>
    </div>
  );
} 