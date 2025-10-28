import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Calculator, BookOpen, Users, Trophy, Calendar, Dumbbell, Target, TrendingUp, Bike, Bed, Smile, NotebookPen, CheckCircle, Lightbulb, Droplet, Sparkles } from "lucide-react";
import { GlassWater } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showError } from "@/utils/toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPredictedDates } from "@/utils/cycleCalculations";
import { mapWorkoutType, mapWorkoutIntensity, mapCardioType, mapMoodLevel } from '@/utils/displayHelpers';
import { Progress } from '@/components/ui/progress';

// Importar os novos hooks
import { useLatestMacroPlan } from '@/hooks/useLatestMacroPlan';
import { useDailyRoutineForDate } from '@/hooks/useDailyRoutineForDate';
import { useUserGoals } from '@/hooks/useUserGoals';
import { useLatestMenstrualCycle } from '@/hooks/useLatestMenstrualCycle';
import { useUserProfile } from '@/hooks/useUserProfile';


const OverviewPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profileData, isLoading: loadingProfile } = useUserProfile();
  const [today] = useState(new Date());

  // Usar os novos hooks
  const { data: latestMacroPlan, isLoading: loadingMacroPlan, error: macroPlanError } = useLatestMacroPlan();
  const { data: dailyRoutineToday, isLoading: loadingDailyRoutineToday, error: dailyRoutineTodayError } = useDailyRoutineForDate(today);
  const { data: activeGoals, isLoading: loadingActiveGoals, error: activeGoalsError } = useUserGoals(true); // Fetch only active goals
  const { data: latestMenstrualCycle, isLoading: loadingMenstrualCycle, error: menstrualCycleError } = useLatestMenstrualCycle();

  const [nextPeriodDate, setNextPeriodDate] = useState<Date | null>(null);

  useEffect(() => {
    if (macroPlanError) showError('Erro ao carregar plano de macros: ' + macroPlanError.message);
    if (dailyRoutineTodayError) showError('Erro ao carregar rotina diária: ' + dailyRoutineTodayError.message);
    if (activeGoalsError) showError('Erro ao carregar metas ativas: ' + activeGoalsError.message);
    if (menstrualCycleError) showError('Erro ao carregar dados do ciclo menstrual: ' + menstrualCycleError.message);
  }, [macroPlanError, dailyRoutineTodayError, activeGoalsError, menstrualCycleError]);

  useEffect(() => {
    if (latestMenstrualCycle) {
      const predicted = getPredictedDates(latestMenstrualCycle.start_date, latestMenstrualCycle.cycle_length, latestMenstrualCycle.menstrual_length);
      setNextPeriodDate(predicted.nextPeriodStartDate);
    } else {
      setNextPeriodDate(null);
    }
  }, [latestMenstrualCycle]);

  const isLoadingData = authLoading || loadingProfile || loadingMacroPlan ||
                         loadingDailyRoutineToday || loadingActiveGoals || loadingMenstrualCycle;

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando visão geral...</p>
      </div>
    );
  }

  const userName = profileData?.first_name || user?.email?.split('@')[0] || 'usuária';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Bem-vinda de volta, {userName}!
          </h1>
          <p className="text-slate-600">
            Aqui está o que está acontecendo na sua jornada hoje
          </p>
        </div>

        {/* Daily Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Routine Summary */}
          <Card className="p-6 shadow-lg border-pink-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                <Dumbbell className="h-6 w-6 mr-3 text-purple-500" /> Rotina de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dailyRoutineToday ? (
                <div className="space-y-2 text-slate-700 text-sm">
                  {dailyRoutineToday.workout_type && dailyRoutineToday.workout_type !== 'none' && (
                    <p className="flex items-center"><Dumbbell className="h-4 w-4 mr-2 text-purple-500" /> Treino: {mapWorkoutType(dailyRoutineToday.workout_type)} ({dailyRoutineToday.workout_duration_minutes} min)</p>
                  )}
                  {dailyRoutineToday.cardio_type && dailyRoutineToday.cardio_type !== 'none' && (
                    <p className="flex items-center"><Bike className="h-4 w-4 mr-2 text-purple-500" /> Cardio: {mapCardioType(dailyRoutineToday.cardio_type)} ({dailyRoutineToday.cardio_distance_km} km)</p>
                  )}
                  {dailyRoutineToday.sleep_hours !== null && (
                    <p className="flex items-center"><Bed className="h-4 w-4 mr-2 text-purple-500" /> Sono: {dailyRoutineToday.sleep_hours} horas</p>
                  )}
                  {dailyRoutineToday.mood_level && (
                    <p className="flex items-center"><Smile className="h-4 w-4 mr-2 text-purple-500" /> Humor: {mapMoodLevel(dailyRoutineToday.mood_level)}</p>
                  )}
                  {(!dailyRoutineToday.workout_type || dailyRoutineToday.workout_type === 'none') &&
                   (!dailyRoutineToday.cardio_type || dailyRoutineToday.cardio_type === 'none') &&
                   dailyRoutineToday.sleep_hours === null && !dailyRoutineToday.mood_level && (
                    <p className="text-slate-500">Nenhum registro de rotina hoje.
                      <Button asChild variant="link" className="p-0 h-0 text-pink-500 hover:text-pink-600">
                        <Link to="/rastreador-rotina">Adicionar agora!</Link>
                      </Button>
                    </p>
                  )}
                  <Button asChild variant="outline" className="w-full mt-4 border-purple-500 text-purple-500 hover:bg-purple-50">
                    <Link to="/rastreador-rotina">Ver Detalhes</Link>
                  </Button>
                </div>
              ) : (
                <p className="text-slate-500">Nenhum registro de rotina hoje.
                  <Button asChild variant="link" className="p-0 h-0 text-pink-500 hover:text-pink-600">
                    <Link to="/rastreador-rotina">Adicionar agora!</Link>
                  </Button>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Active Goals Summary */}
          <Card className="p-6 shadow-lg border-pink-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                <Target className="h-6 w-6 mr-3 text-green-500" /> Metas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeGoals && activeGoals.length > 0 ? (
                <div className="space-y-3">
                  {activeGoals.map(goal => {
                    const progressPercentage = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
                    const isGoalMet = goal.target_value ? goal.current_value >= goal.target_value : goal.is_completed;
                    return (
                      <div key={goal.id} className="bg-slate-50 p-3 rounded-md">
                        <div className="flex items-center justify-between text-sm">
                          <p className="font-medium text-slate-700">{goal.goal_name}</p>
                          {isGoalMet && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        {goal.target_value && goal.target_unit ? (
                          <>
                            <p className="text-xs text-slate-500">{goal.current_value} {goal.target_unit} / {goal.target_value} {goal.target_unit}</p>
                            <Progress value={progressPercentage} className="h-1 bg-green-100 mt-1" indicatorClassName={isGoalMet ? "bg-green-500" : "bg-gradient-to-r from-green-400 to-emerald-500"} />
                          </>
                        ) : (
                          <p className="text-xs text-slate-500">{goal.target_description || 'N/A'}</p>
                        )}
                      </div>
                    );
                  })}
                  <Button asChild variant="outline" className="w-full mt-4 border-green-500 text-green-500 hover:bg-green-50">
                    <Link to="/minhas-metas">Ver Todas as Metas</Link>
                  </Button>
                </div>
              ) : (
                <p className="text-slate-500">Nenhuma meta ativa.
                  <Button asChild variant="link" className="p-0 h-0 text-pink-500 hover:text-pink-600">
                    <Link to="/minhas-metas">Defina sua primeira meta!</Link>
                  </Button>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Latest Plans Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {latestMacroPlan ? (
            <Card className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-2xl shadow-lg p-6 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Calculator className="h-6 w-6 mr-3" /> Último Plano de Macros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-lg font-semibold">🎯 Calorias Diárias: {latestMacroPlan.target_calories} kcal</p>
                <Button asChild variant="secondary" className="bg-white text-pink-500 font-bold rounded-full px-6 py-3 h-auto hover:bg-gray-100">
                  <Link to="/meus-planos">Ver Detalhes</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center p-6">
              <CardContent>
                <Calculator className="h-12 w-12 text-pink-500 mx-auto mb-3" />
                <p className="text-slate-600 mb-3">Nenhum plano de macros salvo.</p>
                <Button asChild className="bg-pink-500 hover:bg-pink-600">
                  <Link to="/calculadora-macros">Criar Plano</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cycle Tracker Next Period */}
        {nextPeriodDate && (
          <Card className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl shadow-lg p-6 text-white mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <Droplet className="h-6 w-6 mr-3" /> Próxima Menstruação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-lg font-semibold">Prevista para: {format(nextPeriodDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
              <Button asChild variant="secondary" className="bg-white text-purple-500 font-bold rounded-full px-6 py-3 h-auto hover:bg-gray-100">
                <Link to="/rastreador-ciclo/hoje">Ver Rastreador</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {overviewItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link 
                key={index} 
                to={item.link}
                className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-pink-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <Icon className="h-6 w-6 text-pink-500" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">{item.title}</h2>
                </div>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const overviewItems = [
  {
    title: "Meu Perfil",
    description: "Gerencie suas informações pessoais e avatar.",
    icon: User,
    link: "/perfil",
  },
  {
    title: "Rastreador de Rotina",
    description: "Monitore seus treinos, cardio, dieta e bem-estar diário.",
    icon: Dumbbell,
    link: "/rastreador-rotina",
  },
  {
    title: "Minhas Metas",
    description: "Defina e acompanhe seus objetivos de fitness e saúde.",
    icon: Target,
    link: "/minhas-metas",
  },
  {
    title: "Meu Progresso",
    description: "Visualize suas tendências e conquistas ao longo do tempo.",
    icon: TrendingUp,
    link: "/progresso",
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
    icon: Calculator,
    link: "/meus-planos",
  },
  {
    title: "Calculadora de Água",
    description: "Descubra sua necessidade diária de hidratação.",
    icon: GlassWater,
    link: "/calculadora-agua",
  },
  {
    title: "Recomendador de Suplementos",
    description: "Encontre os suplementos ideais para seus objetivos.",
    icon: Lightbulb,
    link: "/recomendador-suplementos",
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
    title: "Comunidade & Desafios",
    description: "Conecte-se com outras mulheres e participe de desafios.",
    icon: Users,
    link: "/comunidade",
  },
];

export default OverviewPage;