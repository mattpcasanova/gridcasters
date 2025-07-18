import React from 'react';
import { cn } from '@/lib/utils';

interface AccuracyCircleProps {
  accuracy: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20'
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
};

export function AccuracyCircle({ 
  accuracy, 
  size = 'md',
  showText = true,
  className 
}: AccuracyCircleProps) {
  // Ensure accuracy is between 0 and 100
  const clampedAccuracy = Math.max(0, Math.min(100, accuracy));
  
  // Calculate the stroke dasharray to show the percentage
  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedAccuracy / 100) * circumference;

  // Generate unique ID for gradient
  const gradientId = `accuracyGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="#e5e7eb"
            strokeWidth="3"
            fill="none"
            className="dark:stroke-slate-700"
          />
          {/* Progress circle with gradient */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold text-slate-900 dark:text-slate-100', textSizeClasses[size])}>
            {Math.round(clampedAccuracy)}%
          </span>
        </div>
      </div>
      
      {showText && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          accuracy
        </span>
      )}
    </div>
  );
} 