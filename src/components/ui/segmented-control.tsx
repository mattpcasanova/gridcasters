'use client';
import { cn } from '@/lib/utils';

interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export function SegmentedControl({ value, onChange, options, className }: SegmentedControlProps) {
  return (
    <div className={cn("flex bg-gray-100 rounded-lg p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
            value === option.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
} 