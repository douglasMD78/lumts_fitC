"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ElementType; // Lucide icon component
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
  iconColorClass?: string; // Tailwind class for icon color, e.g., 'text-pink-500'
  buttonVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  onClick?: () => void; // Adicionado a prop onClick
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonLink,
  className,
  iconColorClass = 'text-pink-500',
  buttonVariant = 'default',
  onClick, // Desestruturado a prop onClick
}: EmptyStateProps) => {
  return (
    <Card className={cn("text-center p-8 card-style", className)} onClick={onClick}> {/* Adicionado onClick aqui */}
      <CardContent className="flex flex-col items-center justify-center">
        <Icon className={cn("h-16 w-16 mx-auto mb-4", iconColorClass)} />
        <h3 className="text-lg font-bold text-slate-700 mb-3">{title}</h3>
        <p className="text-slate-500 mb-6">{description}</p>
        {buttonText && buttonLink && (
          <Button asChild className={cn(
            "bg-pink-500 hover:bg-pink-600", // Default styling
            buttonVariant === 'outline' && 'border-pink-500 text-pink-500 hover:bg-pink-50',
            buttonVariant === 'secondary' && 'bg-white text-pink-500 hover:bg-gray-100',
            buttonVariant === 'destructive' && 'bg-red-500 hover:bg-red-600',
            buttonVariant === 'ghost' && 'text-pink-500 hover:bg-pink-50',
            buttonVariant === 'link' && 'text-pink-500 hover:text-pink-600'
          )}>
            <Link to={buttonLink}>{buttonText}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;