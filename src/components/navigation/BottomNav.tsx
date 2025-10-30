"use client";

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dumbbell, Target, Users, User } from 'lucide-react'; // Alterado Compass para Users
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/utils/analytics';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { to: "/rastreador-rotina", label: "Rotina", icon: Dumbbell, authRequired: true },
  { to: "/minhas-metas", label: "Metas", icon: Target, authRequired: true },
  { to: "/comunidade", label: "Comunidade", icon: Users }, // Alterado label e ícone
  { to: "/meu-espaco", label: "Eu", icon: User, authRequired: true },
];

const BottomNav = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  if (!isMobile) {
    return null; // Não renderiza no desktop
  }

  const filteredNavItems = navItems.filter(item => !item.authRequired || user);

  const handleTabSelect = (tab: string) => {
    trackEvent('navigation.tab_select', { tab_name: tab });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
      <div className="flex justify-around h-16 items-center max-w-md mx-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center text-xs font-medium text-gray-500 transition-colors duration-200",
              "hover:text-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2",
              isActive ? "text-pink-500" : ""
            )}
            onClick={() => handleTabSelect(item.label)}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;