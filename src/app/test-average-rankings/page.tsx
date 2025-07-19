'use client';

import { useEffect, useState } from 'react';
import { getAverageRankings } from '@/lib/average-rankings';

export default function TestAverageRankings() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAverageRankings = async () => {
      try {
        console.log('Test page - Starting average rankings test');
        
        const rbRankings = await getAverageRankings('RB', 2025, 'preseason');
        const wrRankings = await getAverageRankings('WR', 2025, 'preseason');
        const qbRankings = await getAverageRankings('QB', 2025, 'preseason');
        
        setResults({
          RB: {
            count: rbRankings.length,
            first5: rbRankings.slice(0, 5).map((r: any) => ({ id: r.player_id, name: r.player_name, rank: r.average_rank }))
          },
          WR: {
            count: wrRankings.length,
            first5: wrRankings.slice(0, 5).map((r: any) => ({ id: r.player_id, name: r.player_name, rank: r.average_rank }))
          },
          QB: {
            count: qbRankings.length,
            first5: qbRankings.slice(0, 5).map((r: any) => ({ id: r.player_id, name: r.player_name, rank: r.average_rank }))
          }
        });
      } catch (error) {
        console.error('Test page - Error:', error);
        setResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    testAverageRankings();
  }, []);

  if (loading) {
    return <div className="p-8">Loading test results...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Average Rankings Test</h1>
      
      {results?.error ? (
        <div className="text-red-600">Error: {results.error}</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(results || {}).map(([position, data]: [string, any]) => (
            <div key={position} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{position}</h2>
              <p>Count: {data.count}</p>
              <p>First 5:</p>
              <ul className="ml-4">
                {data.first5?.map((player: any, index: number) => (
                  <li key={index}>
                    {player.rank}. {player.name} (ID: {player.id})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 