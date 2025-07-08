"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
      <input
        type="search"
        className={cn(
          "h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:ring-slate-300",
          "shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
          className
        )}
        {...props}
      />
    </div>
  )
} 