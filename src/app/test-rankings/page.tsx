'use client';

import { useState, useEffect } from 'react';
import { useSleeperRankings } from '@/lib/hooks/use-sleeper-rankings';

export default function TestRankings() {
  const [position, setPosition] = useState('RB');
  const [week, setWeek] = useState<'preseason' | number>('preseason');
  const [scoringFormat, setScoringFormat] = useState('half_ppr');

  const { 
    players, 
    loading, 
    error 
  } = useSleeperRankings(position, week, scoringFormat);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Rankings Test</h1>
      
      <div className="mb-4 space-y-2">
        <div>
          <label className="block text-sm font-medium mb-1">Position:</label>
          <select 
            value={position} 
            onChange={(e) => setPosition(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="RB">RB</option>
            <option value="WR">WR</option>
            <option value="QB">QB</option>
            <option value="TE">TE</option>
            <option value="OVR">OVR</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Week:</label>
          <select 
            value={week} 
            onChange={(e) => setWeek(e.target.value === 'preseason' ? 'preseason' : parseInt(e.target.value))}
            className="border rounded px-3 py-1"
          >
            <option value="preseason">Preseason</option>
            <option value="1">Week 1</option>
            <option value="2">Week 2</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Scoring Format:</label>
          <select 
            value={scoringFormat} 
            onChange={(e) => setScoringFormat(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="half_ppr">Half PPR</option>
            <option value="ppr">PPR</option>
            <option value="std">Standard</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <p><strong>Status:</strong> {loading ? 'Loading...' : error ? 'Error' : 'Loaded'}</p>
        <p><strong>Player Count:</strong> {players.length}</p>
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      </div>
      
      {!loading && !error && players.length > 0 && (
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Players ({players.length})</h2>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {players.slice(0, 20).map((player, index) => (
              <div key={player.id} className="flex items-center space-x-2 text-sm">
                <span className="w-8 text-right">{player.rank}.</span>
                <span className="w-32">{player.name}</span>
                <span className="w-8">{player.team}</span>
                <span className="w-8">{player.position}</span>
                <span className="w-16 text-right">{player.projectedPoints?.toFixed(1) || '0.0'}</span>
              </div>
            ))}
            {players.length > 20 && (
              <div className="text-gray-500 text-sm">
                ... and {players.length - 20} more players
              </div>
            )}
          </div>
        </div>
      )}
      
      {!loading && !error && players.length === 0 && (
        <div className="text-gray-500">
          No players found for {position} {week === 'preseason' ? 'preseason' : `week ${week}`}
        </div>
      )}
    </div>
  );
} 