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
          variant="outline" // Usar outline como base para ter borda
          onClick={() => onValueChange(option.value)}
          className={cn(
            "flex flex-col items-start justify-start text-left py-5 px-4 rounded-xl transition-all duration-200 h-auto", // Adicionado h-auto para permitir que a altura se ajuste ao conteúdo
            "border-2", // Adicionado borda para todos os estados
            selectedValue === option.value
              ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:from-pink-600 hover:to-fuchsia-600 shadow-lg shadow-pink-500/30 border-pink-500" // Borda mais forte e cor primária
              : "border-gray-200 text-slate-700 hover:bg-pink-50/50 hover:border-pink-300 bg-white"
          )}
        >
          {option.icon && (
            <div className={cn(
              "mb-2", // Espaçamento abaixo do ícone
              selectedValue === option.value ? "text-white" : "text-pink-500" // Cor do ícone no estado selecionado
            )}>
              {option.icon}
            </div>
          )}
          <span className="font-bold text-base">{option.label}</span>
          {option.description && (
            <p className={cn(
              "text-sm mt-1 leading-snug text-wrap", // Aumentado para text-sm, ajustado line-height e adicionado text-wrap
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