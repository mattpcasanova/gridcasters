"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GradientButtonProps {
  children: React.ReactNode
  /** Accept *either* a Lucide component type (e.g. Plus) **or** a ready-made JSX element */
  icon?: React.ReactNode
  size?: "sm" | "default" | "lg"
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

export function GradientButton({
  children,
  icon,
  size = "default",
  className,
  disabled,
  type = "button",
  onClick,
}: GradientButtonProps) {
  /** normalise icon so we always render a valid element */
  const renderIcon = () => {
    if (!icon) return null
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, {
        className: cn("w-4 h-4 mr-2", (icon as any).props?.className),
      })
    }
    if (typeof icon === "function") {
      // Lucide icons are forwardRef functions/objects
      const IconComp = icon as React.ComponentType<React.SVGProps<SVGSVGElement>>
      return <IconComp className="w-4 h-4 mr-2" />
    }
    return null
  }

  return (
    <Button
      type={type}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 border-0 shadow-md hover:shadow-lg transition-all duration-300",
        className,
      )}
    >
      {renderIcon()}
      {children}
    </Button>
  )
}
