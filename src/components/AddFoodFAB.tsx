"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddFoodFABProps {
  onClick: () => void;
  disabled?: boolean;
}

const AddFoodFAB = ({ onClick, disabled }: AddFoodFABProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "h-14 w-14 rounded-full shadow-lg",
        "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white",
        "hover:from-pink-600 hover:to-fuchsia-700 hover:scale-105",
        "transition-all duration-300 ease-out",
        "flex items-center justify-center"
      )}
      aria-label="Adicionar Alimento"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default AddFoodFAB;