'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestDirect() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testDirect = async () => {
      try {
        console.log('Test Direct - Starting direct Supabase test');
        
        // Test 1: Direct Supabase query
        const { data: directData, error: directError } = await supabase
          .from('player_average_rankings')
          .select('*')
          .eq('position', 'RB')
          .eq('season', 2025)
          .eq('type', 'preseason')
          .order('average_rank', { ascending: true })
          .limit(5);
        
        console.log('Test Direct - Direct query result:', { directData, directError });
        
        // Test 2: Count query
        const { count, error: countError } = await supabase
          .from('player_average_rankings')
          .select('*', { count: 'exact', head: true })
          .eq('position', 'RB')
          .eq('season', 2025)
          .eq('type', 'preseason');
        
        console.log('Test Direct - Count query result:', { count, countError });
        
        setResults({
          directQuery: { data: directData, error: directError, count: directData?.length || 0 },
          countQuery: { count, error: countError }
        });
      } catch (error) {
        console.error('Test Direct - Error:', error);
        setResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    testDirect();
  }, []);

  if (loading) {
    return <div className="p-8">Testing direct Supabase connection...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Direct Supabase Test</h1>
      
      {results?.error ? (
        <div className="text-red-600">Error: {results.error}</div>
      ) : (
        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Direct Query</h2>
            <p>Count: {results?.directQuery?.count}</p>
            <p>Error: {results?.directQuery?.error ? 'Yes' : 'No'}</p>
            {results?.directQuery?.error && (
              <p className="text-red-600">Error: {results.directQuery.error.message}</p>
            )}
            {results?.directQuery?.data && results.directQuery.data.length > 0 && (
              <div className="mt-2">
                <p>First 3 results:</p>
                <ul className="ml-4 text-sm">
                  {results.directQuery.data.slice(0, 3).map((item: any, index: number) => (
                    <li key={index}>
                      {item.average_rank}. {item.player_name} ({item.player_id})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Count Query</h2>
            <p>Count: {results?.countQuery?.count}</p>
            <p>Error: {results?.countQuery?.error ? 'Yes' : 'No'}</p>
            {results?.countQuery?.error && (
              <p className="text-red-600">Error: {results.countQuery.error.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 