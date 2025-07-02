"use client"

import * as React from "react"

interface CircularProgressProps {
  value: number
  size?: "sm" | "md" | "lg"
}

export function CircularProgress({ value, size = "md" }: CircularProgressProps) {
  const radius = size === "sm" ? 16 : size === "md" ? 24 : 32
  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 5
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - value) / 100) * circumference

  return (
    <div className="relative inline-flex">
      <svg
        className="transform -rotate-90"
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
      >
        {/* Background circle */}
        <circle
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className="text-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          stroke="url(#gradient)"
          fill="none"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary-blue)" />
            <stop offset="100%" stopColor="var(--secondary-green)" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center font-medium ${
          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
        }`}
      >
        {Math.round(value)}%
      </span>
    </div>
  )
} 