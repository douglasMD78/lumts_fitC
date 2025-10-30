import { Link } from "react-router-dom";
import { Calculator, Apple, Newspaper, Users, Droplet, Heart, Sparkles, BookOpen, GlassWater, Dumbbell, LayoutDashboard, TrendingUp, Flame, Scale } from "lucide-react"; // Adicionado Scale
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import StoriesSection from "@/components/StoriesSection";
import FeedCard from "@/components/FeedCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";
import { showError } from "@/utils/toast";

// Importar os novos hooks
import { useLatestMacroPlan } from '@/hooks/useLatestMacroPlan';
import { useHomeSummaryData } from '@/hooks/useHomeSummaryData';


const HomePage = () => {
  const { user } = useAuth();
  const { data: profileData } = useUserProfile();
  const userName = profileData?.first_name || user?.email?.split('@')[0] || 'Usuária';

  const { data: homeSummary, isLoading: loadingSummary } = useHomeSummaryData();
  const { data: latestMacroPlan } = useLatestMacroPlan();

  // Removido useEffect para tratamento de erro, agora gerenciado pelo hook useHomeSummaryData
  // useEffect(() => {
  //   if (summaryError) {
  //     showError('Erro ao carregar resumo da página inicial: ' + summaryError.message);
  //   }
  // }, [summaryError]);

  return (
    <div className="container mx-auto px-4 pt-8 pb-16 flex flex-col items-center">
      {/* Stories Section */}
      <StoriesSection />

      {/* Main Feed Section */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user ? (
          <>
            {/* Welcome Card for Logged-in Users */}
            <Card className="col-span-full md:col-span-2 lg:col-span-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-2xl shadow-xl shadow-pink-500/20 p-6 sm:p-8 text-center">
              <CardHeader className="pb-4">
                <Sparkles className="h-12 w-12 mx-auto mb-3" />
                <CardTitle className="text-3xl md:text-4xl font-bold">
                  Bem-vinda, {userName}!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-white/90">
                  Seu espaço pessoal para gerenciar sua jornada fitness.
                </p>
                <Button asChild variant="secondary" className="bg-white text-pink-500 hover:bg-gray-100 font-bold rounded-full px-8 py-4 h-auto shadow-lg">
                  <Link to="/meu-espaco">ACESSAR MEU ESPAÇO</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Overview Card for Logged-in Users */}
            <Card className="col-span-full md:col-span-2 lg:col-span-3 bg-white text-slate-800 rounded-2xl shadow-lg border border-pink-100 p-6 sm:p-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <LayoutDashboard className="h-7 w-7 mr-3 text-pink-500" /> Visão Geral Rápida (Últimos 30 dias)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingSummary ? (
                  <p className="text-slate-600">Carregando seu resumo...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Dumbbell className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Treino (média)</p>
                      <p className="text-xl font-bold text-slate-800">{homeSummary?.avgWorkoutDuration.toFixed(0)} min/dia</p>
                    </div>
                  </div>
                )}
                <Button asChild variant="outline" className="w-full mt-4 border-pink-500 text-pink-500 hover:bg-pink-50">
                  <Link to="/progresso">Ver Relatório Completo</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <FeedCard
            variant="hero"
            title="Sua Transformação Começa Aqui"
            description="Descubra receitas deliciosas, planos personalizados e uma comunidade acolhedora para te apoiar na sua jornada fitness."
            link="/signup"
            buttonText="CRIAR MINHA CONTA GRÁTIS"
            icon={Sparkles}
            colorClass="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-pink-500/20"
          />
        )}

        {/* Routine Tracker Card */}
        <FeedCard
          title="Rastreador de Rotina"
          description="Monitore seus treinos, cardio, dieta e bem-estar diário para ver seu progresso."
          link="/rastreador-rotina"
          buttonText="Rastrear Rotina"
          icon={Dumbbell}
          colorClass="bg-white text-slate-800"
        />

        {/* Macro Calculator Card */}
        <FeedCard
          title="Calcule Seus Macros"
          description="Descubra suas necessidades nutricionais diárias para atingir seus objetivos."
          link="/calculadora-macros"
          buttonText="Calcular Agora"
          icon={Calculator}
          colorClass="bg-white text-slate-800"
        />

        {/* Water Intake Calculator Card */}
        <FeedCard
          title="Calculadora de Água"
          description="Saiba a quantidade ideal de água para você se manter hidratada e saudável."
          link="/calculadora-agua"
          buttonText="Calcular Água"
          icon={GlassWater}
          colorClass="bg-white text-slate-800"
        />

        {/* Body Fat Calculator Card */}
        <FeedCard
          title="Calculadora de BF%"
          description="Estime seu percentual de gordura corporal para um acompanhamento mais preciso."
          link="/calculadora-bf"
          buttonText="Calcular BF%"
          icon={Scale}
          colorClass="bg-white text-slate-800"
        />

        {/* Ebook Card */}
        <FeedCard
          title="Ebook de Receitas Exclusivas"
          description="Acesse nosso guia completo com receitas deliciosas e saudáveis para sua dieta."
          link="/ebook"
          buttonText="Ver Ebook"
          icon={BookOpen}
          colorClass="bg-white text-slate-800"
        />

        {/* Blog Card */}
        <FeedCard
          title="Dicas e Artigos no Blog"
          description="Mantenha-se informada com os últimos artigos sobre fitness, nutrição e bem-estar."
          link="/blog"
          buttonText="Ler Blog"
          icon={Newspaper}
          colorClass="bg-white text-slate-800"
        />

        {/* Community Card */}
        <FeedCard
          title="Comunidade LumtsFit"
          description="Conecte-se com outras mulheres, compartilhe experiências e encontre apoio."
          link="/comunidade"
          buttonText="Acessar Comunidade"
          icon={Users}
          colorClass="bg-white text-slate-800"
        />

        {/* Cycle Tracker Card */}
        <FeedCard
          title="Rastreador de Ciclo Menstrual"
          description="Entenda como seu ciclo influencia sua energia e otimize seus treinos e bem-estar."
          link="/rastreador-ciclo"
          buttonText="Rastrear Meu Ciclo"
          icon={Droplet}
          colorClass="bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-purple-300/30"
        />
      </section>
    </div>
  );
};

export default HomePage;