'use client';
import { useState } from 'react';
import { RankingPlayer } from '@/lib/types';
import { getPositionColor, getInjuryStatusColor } from '@/lib/sleeper-utils';
import { Star, TrendingUp, GripVertical } from 'lucide-react';

interface PlayerRankingCardProps {
  player: RankingPlayer;
  onStar: () => void;
  onRankChange?: (newRank: number) => void;
  onPlayerClick?: () => void;
  isDragging?: boolean;
}

export function PlayerRankingCard({ 
  player, 
  onStar, 
  onRankChange, 
  onPlayerClick,
  isDragging = false
}: PlayerRankingCardProps) {
  const [isEditingRank, setIsEditingRank] = useState(false);
  const [rankValue, setRankValue] = useState(player.rank.toString());

  const handleRankSubmit = () => {
    const newRank = parseInt(rankValue);
    if (newRank > 0 && newRank <= 50 && onRankChange) {
      onRankChange(newRank);
    }
    setIsEditingRank(false);
  };

  const handleRankKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRankSubmit();
    } else if (e.key === 'Escape') {
      setRankValue(player.rank.toString());
      setIsEditingRank(false);
    }
  };

  return (
    <div 
      className={`flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 ${
        isDragging ? 'shadow-lg scale-105' : ''
      }`}
    >
      {/* Drag Handle & Rank */}
      <div className="flex items-center gap-3">
        <div className="cursor-move text-gray-400 hover:text-gray-600">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="w-8 text-center">
          {isEditingRank ? (
            <input
              type="number"
              value={rankValue}
              onChange={(e) => setRankValue(e.target.value)}
              onBlur={handleRankSubmit}
              onKeyDown={handleRankKeyPress}
              className="w-8 text-center font-bold text-lg text-gray-900 border-b border-blue-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <div 
              className="font-bold text-lg text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditingRank(true)}
            >
              {player.rank}
            </div>
          )}
        </div>
      </div>

      {/* Player Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-green-500 p-0.5">
          <img 
            src={player.avatarUrl}
            alt={player.name}
            className="w-full h-full rounded-full bg-gray-200 cursor-pointer hover:opacity-80 transition-opacity object-cover"
            onClick={onPlayerClick}
            onError={(e) => {
              // Fallback to team logo or placeholder
              const target = e.target as HTMLImageElement;
              target.src = player.teamLogoUrl;
              target.onerror = () => {
                target.src = '/placeholder-user.jpg';
              };
            }}
          />
        </div>
        {player.injuryStatus && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 
            className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600"
            onClick={onPlayerClick}
          >
            {player.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
            {player.position}
          </span>
          {player.injuryStatus && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInjuryStatusColor(player.injuryStatus)}`}>
              {player.injuryStatus}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <img 
            src={player.teamLogoUrl}
            alt={player.team}
            className="w-4 h-4"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <span className="font-medium">{player.team}</span>
          {player.age && (
            <span className="text-gray-400">• {player.age}y</span>
          )}
          {player.yearsExp !== undefined && (
            <span className="text-gray-400">• {player.yearsExp}yr exp</span>
          )}
        </div>
      </div>

      {/* Projected Points */}
      <div className="text-right">
        <div className="text-lg font-bold text-gray-900">
          {player.projectedPoints > 0 ? player.projectedPoints.toFixed(1) : '--'} pts
        </div>
        <div className="text-xs text-gray-500">projected</div>
      </div>

      {/* Trend Arrow (placeholder for now) */}
      <div className="text-gray-400">
        <TrendingUp className="w-4 h-4" />
      </div>

      {/* Star Button */}
      <button
        onClick={onStar}
        className={`p-2 rounded-full transition-colors ${
          player.isStarred 
            ? 'text-yellow-500 hover:text-yellow-600' 
            : 'text-gray-400 hover:text-yellow-500'
        }`}
      >
        <Star className={`w-5 h-5 ${player.isStarred ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
} 