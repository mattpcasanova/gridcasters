"use client"

import * as React from "react"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  showText?: boolean
}

export function CircularProgress({
  value,
  size = 40,
  strokeWidth = 4,
  showText = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="w-full h-full rotate-[-90deg]">
        <circle
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="text-blue-500 dark:text-blue-400"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
          {Math.round(value)}%
        </div>
      )}
    </div>
  )
} 