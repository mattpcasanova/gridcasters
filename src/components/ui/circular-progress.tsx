"use client"

import * as React from "react"

interface CircularProgressProps {
  value: number
  size?: number | "sm" | "md" | "lg"
  showText?: boolean
}

export function CircularProgress({ value, size = "md", showText = true }: CircularProgressProps) {
  // Convert size to number
  const sizeValue = typeof size === "number" ? size : size === "sm" ? 50 : size === "md" ? 70 : 90
  const radius = (sizeValue - 8) / 2
  const strokeWidth = Math.max(2, sizeValue / 15)
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - value) / 100) * circumference

  return (
    <div className="relative inline-flex">
      <svg
        className="transform -rotate-90"
        width={sizeValue}
        height={sizeValue}
      >
        {/* Background circle */}
        <circle
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={sizeValue / 2}
          cy={sizeValue / 2}
        />
        {/* Progress circle */}
        <circle
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          stroke="url(#gradient)"
          fill="none"
          r={radius}
          cx={sizeValue / 2}
          cy={sizeValue / 2}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2567E8" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span
          className={`absolute inset-0 flex items-center justify-center font-medium ${
            sizeValue < 50 ? "text-xs" : sizeValue < 70 ? "text-sm" : "text-base"
          }`}
        >
          {Math.round(value)}%
        </span>
      )}
    </div>
  )
} 