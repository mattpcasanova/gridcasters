"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  icon?: LucideIcon
  children: React.ReactNode
}

export function GradientButton({
  size = "md",
  icon: Icon,
  children,
  className,
  ...props
}: GradientButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium text-white rounded-lg transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  )
} 