import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GradientLoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32'
};

const logoSizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
};

export function GradientLoading({ 
  text = "Loading...", 
  size = 'md',
  className 
}: GradientLoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Static logo in center */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Image
            src="/logo.png"
            alt="GridCasters Logo"
            width={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
            height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
            className={cn('object-contain', logoSizeClasses[size])}
          />
        </div>
        
        {/* Rotating gradient circle outline */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-green-500 p-1 animate-spin">
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-900"></div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );
} 