"use client";

import { Link } from 'react-router-dom';
import { Calculator, BookOpen, Newspaper, Droplet, User, LogIn, GlassWater, Scale, Lightbulb, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/utils/analytics';

interface StoryItem {
  to: string;
  label: string;
  icon: React.ElementType; // Lucide icon component
}

const StoriesSection = () => {
  const { user } = useAuth();

  const storyItems: StoryItem[] = [
    { to: "/calculadora-macros", label: "Macros", icon: Calculator },
    { to: "/rastreador-ciclo", label: "Ciclo", icon: Droplet },
    { to: "/calculadora-agua", label: "Água", icon: GlassWater },
    { to: "/calculadora-bf", label: "BF%", icon: Scale },
    { to: "/suples-da-lu", label: "Suples", icon: Lightbulb },
    { to: "/ebook", label: "Ebook", icon: BookOpen },
    { to: "/blog", label: "Blog", icon: Newspaper },
    { to: "/desafios", label: "Desafios", icon: Trophy },
    // Story condicional para Perfil/Login
    user
      ? { to: "/perfil", label: "Perfil", icon: User }
      : { to: "/login", label: "Login", icon: LogIn },
  ];

  return (
    <section className="w-full max-w-4xl mb-12 opacity-0 animate-fade-in-up animation-delay-100">
      <div className="flex w-full space-x-4 overflow-x-auto p-4 no-scrollbar"> {/* Refactored for horizontal scroll */}
        {storyItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex flex-col items-center flex-shrink-0 w-20 group"
            onClick={() => trackEvent('navigation.story_select', { story_name: item.label })}
          >
            <Avatar className="h-16 w-16 border-2 border-pink-300 p-1 bg-white shadow-md group-hover:scale-105 group-hover:border-pink-500 transition-all duration-300 ease-out">
              <AvatarFallback className="bg-pink-100 text-pink-500">
                <item.icon className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-slate-700 mt-2 text-center leading-tight group-hover:text-pink-500 transition-colors duration-300">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default StoriesSection;