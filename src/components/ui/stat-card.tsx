"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { CircularProgress } from "@/components/ui/circular-progress"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  subtitle?: string
  trend?: {
    value: string
    direction: "up" | "down"
    icon: LucideIcon
  }
  progress?: number
}

export function StatCard({ title, value, icon: Icon, subtitle, trend, progress }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">{value}</h2>
              {progress !== undefined && (
                <CircularProgress value={progress} size="sm" />
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2 space-x-1">
                <trend.icon className={`w-4 h-4 ${trend.direction === "up" ? "text-green-500" : "text-red-500"}`} />
                <span className={`text-sm ${trend.direction === "up" ? "text-green-500" : "text-red-500"}`}>
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 