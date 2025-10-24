"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeedCardProps {
  title: string;
  description: string;
  link: string;
  buttonText: string;
  icon?: React.ElementType; // Lucide icon component
  image?: string; // URL da imagem de capa
  variant?: 'default' | 'hero'; // Para um card de destaque
  colorClass?: string; // Para cores de fundo e texto personalizadas
}

const FeedCard = ({
  title,
  description,
  link,
  buttonText,
  icon: Icon,
  image,
  variant = 'default',
  colorClass = 'bg-white text-slate-800',
}: FeedCardProps) => {
  const isHero = variant === 'hero';

  return (
    <Card className={cn(
      "rounded-2xl shadow-lg border border-pink-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-pink-200/50 hover:-translate-y-1", // Adicionado hover effect
      isHero ? "col-span-full md:col-span-2 lg:col-span-3" : "", // Ocupa mais espaço se for hero
      colorClass.includes('bg-') ? colorClass : `bg-white ${colorClass}` // Garante um background
    )}>
      {image && (
        <img src={image} alt={title} className={cn(
          "w-full object-cover",
          isHero ? "h-64 md:h-80" : "h-48"
        )} />
      )}
      <CardHeader className={cn(
        "pb-4",
        isHero ? "text-center" : ""
      )}>
        {Icon && (
          <div className={cn(
            "mb-3",
            isHero ? "mx-auto" : ""
          )}>
            <Icon className={cn(
              "h-8 w-8 text-pink-500",
              isHero ? "h-12 w-12 text-white" : ""
            )} />
          </div>
        )}
        <CardTitle className={cn(
          "text-xl font-bold",
          isHero ? "text-3xl md:text-4xl text-white" : "text-slate-800"
        )}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        "space-y-4",
        isHero ? "text-center text-white/90" : "text-slate-600"
      )}>
        <p className={cn(
          isHero ? "text-lg" : "text-sm"
        )}>{description}</p>
        <Button asChild 
          className={cn(
            "w-full",
            isHero ? "bg-white text-pink-500 hover:bg-gray-100 font-bold rounded-full px-8 py-4 h-auto shadow-lg" : "bg-pink-500 hover:bg-pink-600"
          )}
        >
          <Link to={link}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedCard;