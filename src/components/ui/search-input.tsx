import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <Input
        type="search"
        className="pl-10 bg-white dark:bg-slate-800"
        {...props}
      />
    </div>
  )
} 