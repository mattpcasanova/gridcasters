"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon | React.ReactNode
  children: React.ReactNode
  size?: "default" | "sm" | "lg" | "icon"
}

export function GradientButton({
  className,
  children,
  icon: Icon,
  size = "default",
  ...props
}: GradientButtonProps) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400",
        "text-white shadow-lg hover:shadow-xl",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      size={size}
      {...props}
    >
      <span className="relative flex items-center justify-center gap-2">
        {Icon && (typeof Icon === "function" ? <Icon className="w-4 h-4" /> : Icon)}
        {children}
      </span>
    </Button>
  )
} 