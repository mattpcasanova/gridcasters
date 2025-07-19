'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestSupabase() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        console.log('Test page - Testing Supabase connection');
        
        // Test basic connection
        const { data: testData, error: testError } = await supabase
          .from('player_average_rankings')
          .select('count(*)')
          .eq('position', 'RB')
          .eq('season', 2025)
          .eq('type', 'preseason');
        
        console.log('Test page - Count query result:', { testData, testError });
        
        // Test actual data fetch
        const { data: rankings, error: rankingsError } = await supabase
          .from('player_average_rankings')
          .select('*')
          .eq('position', 'RB')
          .eq('season', 2025)
          .eq('type', 'preseason')
          .order('average_rank', { ascending: true })
          .limit(5);
        
        console.log('Test page - Rankings query result:', { rankings, rankingsError });
        
        setResults({
          countQuery: { data: testData, error: testError },
          rankingsQuery: { 
            data: rankings, 
            error: rankingsError,
            count: rankings?.length || 0
          }
        });
      } catch (error) {
        console.error('Test page - Error:', error);
        setResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    testSupabase();
  }, []);

  if (loading) {
    return <div className="p-8">Testing Supabase connection...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      {results?.error ? (
        <div className="text-red-600">Error: {results.error}</div>
      ) : (
        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Count Query</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(results?.countQuery, null, 2)}
            </pre>
          </div>
          
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Rankings Query</h2>
            <p>Count: {results?.rankingsQuery?.count}</p>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(results?.rankingsQuery, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 