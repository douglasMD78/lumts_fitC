"use client";

import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calculator, BookOpen, Droplet, Lightbulb, GlassWater, Scale } from "lucide-react"; // Removed Dumbbell, Target, TrendingUp, Users
import { Button } from "@/components/ui/button";

const MySpacePage = () => {
  const { user } = useAuth();
  const { data: profileData, isLoading: loadingProfile } = useUserProfile();

  const userName = profileData?.first_name || user?.email?.split('@')[0] || 'Usuária';

  const featureCards = [
    {
      title: "Meu Perfil",
      description: "Gerencie suas informações pessoais e avatar.",
      icon: User,
      link: "/perfil",
    },
    {
      title: "Calculadora de Macros",
      description: "Calcule suas necessidades nutricionais diárias.",
      icon: Calculator,
      link: "/calculadora-macros",
    },
    {
      title: "Meus Planos de Macros",
      description: "Acesse e gerencie seus planos nutricionais salvos.",
      icon: Calculator, // Reutilizando o ícone de calculadora para planos de macros
      link: "/meus-planos",
    },
    {
      title: "Calculadora de Água",
      description: "Descubra sua necessidade diária de hidratação.",
      icon: GlassWater,
      link: "/calculadora-agua",
    },
    {
      title: "Calculadora de BF%",
      description: "Estime seu percentual de gordura corporal.",
      icon: Scale,
      link: "/calculadora-bf",
    },
    {
      title: "Suples da Lu",
      description: "Encontre os suplementos ideais para seus objetivos.",
      icon: Lightbulb,
      link: "/suples-da-lu", // Updated link
    },
    {
      title: "Rastreador de Ciclo",
      description: "Sincronize seu ciclo com seu treino e bem-estar.",
      icon: Droplet,
      link: "/rastreador-ciclo",
    },
    {
      title: "Ebook de Receitas",
      description: "Acesse seu guia completo com receitas exclusivas.",
      icon: BookOpen,
      link: "/ebook",
    },
    {
      title: "Blog",
      description: "Artigos, dicas e inspirações para sua jornada de bem-estar.",
      icon: Newspaper, // Changed from Users to Newspaper for Blog
      link: "/blog",
    },
    {
      title: "Desafios",
      description: "Participe de desafios para manter a motivação alta.",
      icon: Trophy, // Added Trophy icon for Challenges
      link: "/desafios",
    },
  ];

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando seu espaço pessoal...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Bem-vinda ao seu <span className="text-pink-500">Meu Espaço</span>, {userName}!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Aqui você encontra todas as ferramentas e informações para sua jornada LumtsFit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-pink-200/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-pink-100 p-3 rounded-full mr-4">
                      <Icon className="h-6 w-6 text-pink-500" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 text-sm">{card.description}</p>
                  <Button asChild className="w-full bg-pink-500 hover:bg-pink-600">
                    <Link to={card.link}>Acessar</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MySpacePage;