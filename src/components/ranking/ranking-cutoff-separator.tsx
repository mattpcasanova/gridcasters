'use client';

interface RankingCutoffSeparatorProps {
  position: string;
  rankingLimit: number;
}

export function RankingCutoffSeparator({ position, rankingLimit }: RankingCutoffSeparatorProps) {
  return (
    <div className="flex items-center gap-4 py-4 my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm font-medium text-red-700">
          Rankings below #{rankingLimit} don't count for scoring
        </span>
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
    </div>
  );
} 