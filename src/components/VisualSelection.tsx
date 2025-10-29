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
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          onClick={() => onValueChange(option.value)}
          className={cn(
            "flex flex-col items-start justify-start text-left p-5 rounded-xl transition-all duration-200 h-auto min-h-[140px]", // Aumentado min-h
            "border-2",
            selectedValue === option.value
              ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:from-pink-600 hover:to-fuchsia-600 shadow-lg shadow-pink-500/30 border-pink-500"
              : "border-gray-200 text-slate-700 hover:bg-pink-50/50 hover:border-pink-300 bg-white"
          )}
        >
          {option.icon && (
            <div className={cn(
              "mb-2 text-3xl",
              selectedValue === option.value ? "text-white" : "text-pink-500"
            )}>
              {React.isValidElement(option.icon) ? React.cloneElement(option.icon as React.ReactElement, {
                className: cn("h-8 w-8", selectedValue === option.value ? "text-white" : "text-pink-500")
              }) : option.icon}
            </div>
          )}
          <span className="font-bold text-lg leading-tight">{option.label}</span> {/* Aumentado para text-lg */}
          {option.description && (
            <p className={cn(
              "text-sm mt-1 leading-snug text-wrap",
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