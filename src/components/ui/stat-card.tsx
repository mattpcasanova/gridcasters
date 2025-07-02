"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface StatCardProps {
  title: string
  value: React.ReactNode
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
    icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  }
  progress?: number
}

export function StatCard({ title, value, subtitle, icon, trend, progress }: StatCardProps) {
  // Helper to render either a component type or an element
  const renderIcon = (
    IconOrElement?: React.ComponentType<{ className?: string }> | React.ReactNode,
    className = "",
  ) => {
    if (!IconOrElement) return null
    if (React.isValidElement(IconOrElement)) {
      return IconOrElement
    }
    const Cmp = IconOrElement as React.ComponentType<{ className?: string }>
    return <Cmp className={className} />
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</span>
          {renderIcon(icon, "w-4 h-4 text-slate-500")}
        </div>

        <div className="text-2xl font-bold mb-1">{value}</div>

        {subtitle && <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{subtitle}</div>}

        {progress !== undefined && <Progress value={progress} className="h-2 mb-2" />}

        {trend && (
          <div className="flex items-center space-x-1 text-xs">
            {renderIcon(trend.icon, "w-3 h-3")}
            <span
              className={
                trend.direction === "up"
                  ? "text-green-600 dark:text-green-400"
                  : trend.direction === "down"
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-600 dark:text-slate-400"
              }
            >
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 