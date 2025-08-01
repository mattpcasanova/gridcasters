'use client';
import { RankingPlayer } from '@/lib/types';
import { getPositionColor, getInjuryStatusColor } from '@/lib/sleeper-utils';
import { getCurrentSeasonInfo } from '@/lib/utils/season';
import { X, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface PlayerModalProps {
  player: RankingPlayer;
  isOpen: boolean;
  onClose: () => void;
  onStar: () => void;
}

export function PlayerModal({ player, isOpen, onClose, onStar }: PlayerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-green-500 p-0.5">
                <img 
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full rounded-full bg-gray-200 dark:bg-slate-700 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = player.teamLogoUrl;
                    target.onerror = () => {
                      target.src = '/placeholder-user.jpg';
                    };
                  }}
                />
              </div>
              {player.injuryStatus && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{player.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPositionColor(player.position)}`}>
                  {player.position}
                </span>
                <div className="flex items-center gap-1">
                  <img 
                    src={player.teamLogoUrl}
                    alt={player.team}
                    className="w-5 h-5"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="font-medium text-gray-700 dark:text-slate-300">{player.team}</span>
                </div>
                {player.injuryStatus && (
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getInjuryStatusColor(player.injuryStatus)}`}>
                    {player.injuryStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onStar}
              className={`p-2 rounded-full transition-colors ${
                player.isStarred 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <Star className={`w-6 h-6 ${player.isStarred ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">#{player.rank}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Current Rank</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {player.projectedPoints > 0 ? player.projectedPoints.toFixed(1) : '--'}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Projected Points</div>
            </div>
            {player.age && (
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{player.age}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Age</div>
              </div>
            )}
            {player.yearsExp !== undefined && (
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{player.yearsExp}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Years Experience</div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            {player.college && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-600 dark:text-slate-400">College</span>
                <span className="font-medium text-gray-900 dark:text-white">{player.college}</span>
              </div>
            )}
            
            {/* Current Week Context */}
            {(() => {
              const seasonInfo = getCurrentSeasonInfo();
              const currentWeek = seasonInfo.currentWeek || 1;
              const weekType = seasonInfo.isPreSeason ? 'Preseason' : `Week ${currentWeek}`;
              
              return (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{weekType} Outlook</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Projected to be a strong performer based on recent form.
                  </p>
                </div>
              );
            })()}

            {/* Performance Trends - Placeholder */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Performance</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Trending up over last 3 weeks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 