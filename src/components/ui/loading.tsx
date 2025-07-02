import { cn } from "@/lib/utils"

export interface LoadingProps {
  className?: string;
}

export function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-pulse"></div>
        {/* Inner spinner */}
        <div className="absolute top-0 left-0 w-12 h-12">
          <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
        </div>
      </div>
    </div>
  )
} 