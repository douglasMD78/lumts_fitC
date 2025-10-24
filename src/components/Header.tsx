import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, User as UserIcon, LogOut, LayoutDashboard, Settings, Utensils, Dumbbell, Target, TrendingUp, Calculator, Hourglass, GlassWater, BookOpen, Newspaper, Users, Droplet, Apple } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLogout } from "@/hooks/useLogout";
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const publicNavLinks = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre Mim" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Contato" },
];

const loggedInNavLinks = [
  { to: "/", label: "Início" },
  { to: "/meu-espaco", label: "Meu Espaço" },
  { to: "/blog", label: "Blog" },
  { to: "/comunidade", label: "Comunidade" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const logout = useLogout();
  const isMobile = useIsMobile(); // Use the hook

  const { data: profileData } = useUserProfile();
  const avatarUrl = profileData?.avatar_url || null;
  const firstName = profileData?.first_name || user?.email?.split('@')[0] || 'Usuária';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentNavLinks = user ? loggedInNavLinks : publicNavLinks;

  return (
    <header className={cn(
      "sticky top-0 z-10 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent",
      isMobile && "h-16" // Compact header height on mobile
    )}>
      <div className="container mx-auto flex justify-between items-center p-4 h-20 relative">
        {/* Mobile Menu Trigger (Hamburger) */}
        <div className="lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                <Menu className="h-6 w-6 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-6 p-6">
                <Link to="/" onClick={() => setIsSheetOpen(false)} className="mb-4">
                  <h1 className="text-3xl font-bold text-pink-500">lumts<span className="font-light">fit</span></h1>
                </Link>
                {currentNavLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsSheetOpen(false)}
                    className={({ isActive }) =>
                      `text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                
                <Separator className="my-4" />

                {user ? (
                  <>
                    <NavLink
                      to="/meu-espaco"
                      onClick={() => setIsSheetOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"}`
                      }
                    >
                      <LayoutDashboard className="h-5 w-5 mr-3" /> Meu Espaço
                    </NavLink>
                    <NavLink
                      to="/perfil"
                      onClick={() => setIsSheetOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"}`
                      }
                    >
                      <UserIcon className="h-5 w-5 mr-3" /> Meu Perfil
                    </NavLink>
                    <NavLink
                      to="/rastreador-rotina"
                      onClick={() => setIsSheetOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"}`
                      }
                    >
                      <Dumbbell className="h-5 w-5 mr-3" /> Rastreador de Rotina
                    </NavLink>
                    <NavLink
                      to="/rastreador-alimentos"
                      onClick={() => setIsSheetOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"}`
                      }
                    >
                      <Utensils className="h-5 w-5 mr-3" /> Rastreador de Alimentos
                    </NavLink>
                    <NavLink
                      to="/minhas-metas"
                      onClick={() => setIsSheetOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"}`
                      }
                    >
                      <Target className="h-5 w-5 mr-3" /> Minhas Metas
                    </NavLink>
                    <NavLink
                      to="/progresso"
                      onClick={() => setIsSheetOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"}`
                      }
                    >
                      <TrendingUp className="h-5 w-5 mr-3" /> Meu Progresso
                    </NavLink>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout();
                        setIsSheetOpen(false);
                      }}
                      className="flex items-center justify-start text-xl font-medium text-slate-700 hover:text-pink-500"
                    >
                      <LogOut className="h-5 w-5 mr-3" /> Sair da Conta
                    </Button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setIsSheetOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"}`
                    }
                  >
                    <UserIcon className="h-5 w-5 mr-3" /> Login / Cadastro
                  </NavLink>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          isMobile ? "text-3xl" : "text-4xl" // Smaller logo on mobile
        )}>
          <Link to="/">
            <h1 className="font-bold text-pink-500">lumts<span className="font-light">fit</span></h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-grow justify-center">
          <ul className="flex space-x-8">
            {currentNavLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors hover:text-pink-500 ${isActive ? "text-pink-500" : "text-slate-700"}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User/Login Button */}
        <div className="hidden lg:block">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl || undefined} alt="Avatar do Usuário" />
                    <AvatarFallback className="bg-pink-100 text-pink-500">
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{firstName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/meu-espaco" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Meu Espaço</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/rastreador-rotina" className="flex items-center">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    <span>Rastreador de Rotina</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/rastreador-alimentos" className="flex items-center">
                    <Utensils className="mr-2 h-4 w-4" />
                    <span>Rastreador de Alimentos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/minhas-metas" className="flex items-center">
                    <Target className="mr-2 h-4 w-4" />
                    <span>Minhas Metas</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/progresso" className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Meu Progresso</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair da Conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;