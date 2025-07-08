"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SegmentedControlItem {
  value: string
  label: string
}

export interface SegmentedControlProps {
  value: string
  onValueChange: (value: string) => void
  items: SegmentedControlItem[]
  className?: string
}

export function SegmentedControl({ value, onValueChange, items, className }: SegmentedControlProps) {
  return (
    <div className={cn("inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onValueChange(item.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            value === item.value
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
} 