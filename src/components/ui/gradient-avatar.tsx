'use client'

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { DEFAULT_AVATAR_URL } from '@/lib/constants/avatars';

interface GradientAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

export function GradientAvatar({ 
  src, 
  alt, 
  fallback, 
  size = 'md', 
  className,
  onClick 
}: GradientAvatarProps) {
  return (
    <div 
      className={cn(
        'relative inline-block',
        sizeClasses[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Gradient circle outline */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-green-500 p-0.5">
        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-0.5">
          <Avatar className="w-full h-full">
            <AvatarImage 
              src={src || undefined} 
              alt={alt}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_AVATAR_URL;
              }}
            />
            <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800">
              {fallback || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
} 