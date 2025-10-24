"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VisualSelectionOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface VisualSelectionProps {
  options: VisualSelectionOption[];
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
  className?: string;
}

const VisualSelection = ({
  options,
  selectedValue,
  onValueChange,
  className,
}: VisualSelectionProps) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selectedValue === option.value ? "default" : "outline"}
          onClick={() => onValueChange(option.value)}
          className={cn(
            "flex flex-col items-center justify-center text-center h-auto py-4 px-3 rounded-xl transition-all duration-200",
            "min-h-[100px] sm:min-h-[120px]", // Altura mínima para mobile
            selectedValue === option.value
              ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:from-pink-600 hover:to-fuchsia-600 shadow-lg shadow-pink-500/30 border-none"
              : "border-gray-200 text-slate-700 hover:bg-pink-50/50 hover:border-pink-200 bg-white"
          )}
        >
          {option.icon && <span className="text-3xl mb-2">{option.icon}</span>}
          <span className="font-bold text-base">{option.label}</span>
          {option.description && (
            <p className={cn(
              "text-xs mt-1",
              selectedValue === option.value ? "text-white/80" : "text-slate-500"
            )}>
              {option.description}
            </p>
          )}
        </Button>
      ))}
    </div>
  );
};

export default VisualSelection;