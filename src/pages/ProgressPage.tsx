"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, TrendingUp, Dumbbell, Target, Printer, Share2, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PrintableProgressReport from '@/components/PrintableProgressReport';
import ShareableProgressStory from '@/components/ShareableProgressStory';
import { useUserProfile } from '@/hooks/useUserProfile';

// Importar os novos hooks
import { useLatestMacroPlan } from '@/hooks/useLatestMacroPlan';
import { useUserGoals } from '@/hooks/useUserGoals';
import { useProgressData } from '@/hooks/useProgressData';


interface UserGoal {
  id: string;
  goal_name: string;
  goal_type: string;
  target_value?: number | null;
  target_unit?: string | null;
  target_description?: string | null;
  current_value: number; // This will now be the latest from user_goals table
  start_date: Date;
  end_date?: Date | null;
  is_completed: boolean;
  created_at: string;
}

const ProgressPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profileData, isLoading: loadingProfile } = useUserProfile();
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isShareStoryDialogOpen, setIsShareStoryDialogOpen] = useState(false);

  const { data: macroPlan, isLoading: loadingMacroPlan } = useLatestMacroPlan(); // Fetch latest macro plan
  const { data: allUserGoals, isLoading: loadingAllGoals } = useUserGoals(false); // Fetch all goals

  // Usar o novo hook para buscar e processar os dados de progresso
  const { data: progressData, isLoading: loadingProgressData } = useProgressData(startDate, endDate);

  // Removido useEffect para tratamento de erro, agora gerenciado pelos hooks
  // useEffect(() => {
  //   if (macroPlanError) showError('Erro ao carregar plano de macros: ' + macroPlanError.message);
  //   if (allGoalsError) showError('Erro ao carregar metas: ' + allGoalsError.message);
  //   if (progressDataError) showError('Erro ao carregar dados de progresso: ' + progressDataError.message);
  // }, [macroPlanError, allGoalsError, progressDataError]);

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    if (range.from) setStartDate(range.from);
    if (range.to) setEndDate(range.to);
    setIsCalendarOpen(false);
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const userName = profileData?.first_name || user?.email?.split('@')[0] || 'Usuária';
  const periodString = `${format(startDate, 'dd/MM', { locale: ptBR })} - ${format(endDate, 'dd/MM', { locale: ptBR })}`;

  if (authLoading || loadingProfile || loadingMacroPlan || loadingAllGoals || loadingProgressData || !progressData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando seu progresso...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <TrendingUp className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold gradient-text mb-3">Seu Progresso</h1>
          <p className="text-pink-600 text-base">Visualize suas tendências e conquistas ao longo do tempo.</p>
        </div>

        <Card className="p-4 flex flex-col sm:flex-row items-center justify-between shadow-lg border-pink-100">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <CalendarIcon className="h-5 w-5 text-slate-600" />
            <span className="font-medium text-slate-700">Período:</span>
            <span className="text-pink-500 font-semibold">
              {format(startDate, 'dd/MM/yyyy', { locale: ptBR })} - {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Selecionar Período
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{ from: startDate, to: endDate }}
                onSelect={handleDateChange}
                initialFocus
                locale={ptBR}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </Card>

        <Card className="p-6 shadow-lg border-pink-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <Dumbbell className="h-6 w-6 mr-3 text-purple-500" /> Tendências de Atividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progressData.activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData.activityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="workoutDuration" fill="#a855f7" name="Treino (min)" />
                  <Bar dataKey="cardioDistance" fill="#3b82f6" name="Cardio (km)" />
                  <Bar dataKey="sleepHours" fill="#6366f1" name="Sono (horas)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhum dado de atividade para o período selecionado.</p>
            )}
          </CardContent>
        </Card>

        <Card className="p-6 shadow-lg border-pink-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <Target className="h-6 w-6 mr-3 text-green-500" /> Suas Metas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allUserGoals && allUserGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allUserGoals.map(goal => {
                  const progressPercentage = calculateProgress(goal.current_value, goal.target_value || 0);
                  const isGoalMet = goal.current_value >= (goal.target_value || 0);
                  return (
                    <div key={goal.id} className="bg-slate-50 p-4 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-700">{goal.goal_name}</p>
                        {isGoalMet && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                      {goal.goal_type !== 'other' && goal.target_value !== null && goal.target_unit !== null ? (
                        <>
                          <p className="text-sm text-slate-500">
                            {goal.current_value} {goal.target_unit} / {goal.target_value} {goal.target_unit}
                          </p>
                          <Progress value={progressPercentage} className="h-2 bg-pink-100 mt-2" indicatorClassName={isGoalMet ? "bg-green-500" : "bg-gradient-to-r from-pink-500 to-fuchsia-600"} />
                        </>
                      ) : (
                        <div className="text-slate-600 text-sm">
                          <span className="font-semibold">Descrição:</span> {goal.target_description || 'N/A'}
                          <p className="text-slate-500 text-sm mt-2">Progresso atual: {goal.current_value}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhuma meta ativa definida.
                <Button asChild variant="link" className="p-0 h-auto text-pink-500 hover:text-pink-600">
                  <Link to="/minhas-metas">Defina sua primeira meta!</Link>
                </Button>
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Printer className="h-5 w-5 mr-2" /> Gerar Relatório
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Pré-visualização do Relatório de Progresso</DialogTitle>
              </DialogHeader>
              <PrintableProgressReport
                activityData={progressData.activityData}
                userGoals={allUserGoals || []}
                macroPlan={macroPlan}
                startDate={startDate}
                endDate={endDate}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isShareStoryDialogOpen} onOpenChange={setIsShareStoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
                <Share2 className="h-5 w-5 mr-2" /> Compartilhar Progresso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Compartilhar seu Progresso</DialogTitle>
              </DialogHeader>
              <ShareableProgressStory
                userName={userName}
                avgWorkoutDuration={progressData.avgWorkoutDuration}
                topGoal={progressData.topGoalForStory}
                period={periodString}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;