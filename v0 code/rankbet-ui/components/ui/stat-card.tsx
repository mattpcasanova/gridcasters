import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
    icon?: React.ReactNode
  }
  progress?: number
  className?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, progress, className }: StatCardProps) {
  const renderAnyIcon = (icon?: React.ReactNode, className?: string) => {
    if (!icon) return null
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, {
        className: cn(className, (icon as any).props?.className),
      })
    }
    if (typeof icon === "function") {
      const IconComp = icon as React.ComponentType<{ className?: string }>
      return <IconComp className={className} />
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderAnyIcon(Icon, "h-4 w-4 text-muted-foreground")}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div
                className={`flex items-center text-xs ${
                  trend.direction === "up"
                    ? "text-green-600"
                    : trend.direction === "down"
                      ? "text-red-600"
                      : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {renderAnyIcon(trend?.icon, "w-3 h-3 mr-1")}
                {trend.value}
              </div>
            )}
            {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
          </div>
          {progress !== undefined && <CircularProgress value={progress} size={50} />}
        </div>
      </CardContent>
    </Card>
  )
}
