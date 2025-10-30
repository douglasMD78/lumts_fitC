import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, User as UserIcon, LogOut, LayoutDashboard, Dumbbell, Target, TrendingUp, Calculator, GlassWater, BookOpen, Newspaper, Users, Droplet, Scale, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLogout } from "@/hooks/useLogout";
import { useIsMobile } from '@/hooks/use-mobile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Importar Accordion

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
  { to: "/blog", label: "Blog" },
  { to: "/comunidade", label: "Comunidade" },
];

const loggedInNavLinks = [
  { to: "/", label: "Início" },
  { to: "/blog", label: "Blog" },
  { to: "/comunidade", label: "Comunidade" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const logout = useLogout();
  const isMobile = useIsMobile();

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
      isMobile && "h-16"
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
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col space-y-6 p-4">
                <Link to="/" onClick={() => setIsSheetOpen(false)} className="mb-4">
                  <h1 className="text-3xl font-bold text-pink-500">lumts<span className="font-light">fit</span></h1>
                </Link>

                {currentNavLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsSheetOpen(false)}
                    className={({ isActive }) =>
                      `text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                
                {user ? (
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-xl font-medium text-slate-700 hover:text-pink-500 hover:no-underline">
                        <LayoutDashboard className="h-5 w-5 mr-3" /> Meu Espaço
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 space-y-3 py-2">
                        <NavLink
                          to="/perfil"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <UserIcon className="h-4 w-4 mr-3" /> Meu Perfil
                        </NavLink>
                        <NavLink
                          to="/overview"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <LayoutDashboard className="h-4 w-4 mr-3" /> Visão Geral
                        </NavLink>
                        <NavLink
                          to="/rastreador-rotina"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <Dumbbell className="h-4 w-4 mr-3" /> Rastreador de Rotina
                        </NavLink>
                        <NavLink
                          to="/minhas-metas"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <Target className="h-4 w-4 mr-3" /> Minhas Metas
                        </NavLink>
                        <NavLink
                          to="/progresso"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <TrendingUp className="h-4 w-4 mr-3" /> Meu Progresso
                        </NavLink>
                        <NavLink
                          to="/calculadora-macros"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <Calculator className="h-4 w-4 mr-3" /> Calculadora de Macros
                        </NavLink>
                        <NavLink
                          to="/meus-planos"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <Calculator className="h-4 w-4 mr-3" /> Meus Planos de Macros
                        </NavLink>
                        <NavLink
                          to="/calculadora-agua"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <GlassWater className="h-4 w-4 mr-3" /> Calculadora de Água
                        </NavLink>
                        <NavLink
                          to="/calculadora-bf"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <Scale className="h-4 w-4 mr-3" /> Calculadora de BF%
                        </NavLink>
                        <NavLink
                          to="/recomendador-suplementos"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <Lightbulb className="h-4 w-4 mr-3" /> Recomendador de Suplementos
                        </NavLink>
                        <NavLink
                          to="/rastreador-ciclo"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <Droplet className="h-4 w-4 mr-3" /> Rastreador de Ciclo
                        </NavLink>
                        <NavLink
                          to="/ebook"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <BookOpen className="h-4 w-4 mr-3" /> Ebook de Receitas
                        </NavLink>
                        <NavLink
                          to="/desafios"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          <Users className="h-4 w-4 mr-3" /> Desafios
                        </NavLink>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-xl font-medium text-slate-700 hover:text-pink-500 hover:no-underline">
                        <Heart className="h-5 w-5 mr-3" /> Legal
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 space-y-3 py-2">
                        <NavLink
                          to="/termos"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          Termos de Uso
                        </NavLink>
                        <NavLink
                          to="/privacidade"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          Política de Privacidade
                        </NavLink>
                        <NavLink
                          to="/cookies"
                          onClick={() => setIsSheetOpen(false)}
                          className={({ isActive }) =>
                            `text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                          }
                        >
                          Política de Cookies
                        </NavLink>
                      </AccordionContent>
                    </AccordionItem>

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
                  </Accordion>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setIsSheetOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center text-xl font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                      }
                    >
                      <UserIcon className="h-5 w-5 mr-3" /> Login / Cadastro
                    </NavLink>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-medium text-slate-700 hover:text-pink-500 hover:no-underline">
                          <Heart className="h-5 w-5 mr-3" /> Legal
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 space-y-3 py-2">
                          <NavLink
                            to="/termos"
                            onClick={() => setIsSheetOpen(false)}
                            className={({ isActive }) =>
                              `text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                            }
                          >
                            Termos de Uso
                          </NavLink>
                          <NavLink
                            to="/privacidade"
                            onClick={() => setIsSheetOpen(false)}
                            className={({ isActive }) =>
                              `text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                            }
                          >
                            Política de Privacidade
                          </NavLink>
                          <NavLink
                            to="/cookies"
                            onClick={() => setIsSheetOpen(false)}
                            className={({ isActive }) =>
                              `text-base font-medium ${isActive ? "text-pink-500" : "text-slate-700"} hover:text-pink-500`
                            }
                          >
                            Política de Cookies
                          </NavLink>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className={cn(
          "lg:relative lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0", // Override absolute positioning for desktop
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", // Default for mobile
          isMobile ? "text-3xl" : "text-4xl"
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