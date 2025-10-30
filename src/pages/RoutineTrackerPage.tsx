"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Dumbbell, Heart, Utensils, ChevronLeft, ChevronRight, Plus, Edit, Target, Trash2, CheckCircle, Clock, Bed, Smile, NotebookPen, Bike, Ruler } from 'lucide-react';
import { format, subDays, addDays, isSameDay, parseISO, isAfter, isToday } from 'date-fns'; // Importar isAfter e isToday
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LoginGate from '@/components/LoginGate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import DailyRoutineForm from '@/components/DailyRoutineForm';
import GoalSettingDialog from '@/components/GoalSettingDialog';
import { Progress } from '@/components/ui/progress';
import { mapWorkoutType, mapWorkoutIntensity, mapCardioType, mapMoodLevel, mapGoalType } from '@/utils/displayHelpers';

// Importar os novos hooks
import { useDailyRoutineForDate } from '@/hooks/useDailyRoutineForDate';
import { useUserGoals } from '@/hooks/useUserGoals';
import { useSaveDailyRoutine } from '@/hooks/useSaveDailyRoutine';
import { useDeleteUserGoal } from '@/hooks/useDeleteUserGoal'; // Importar o hook de mutação para deletar meta


interface DailyRoutine {
  id: string;
  routine_date: string;
  workout_type: string | null;
  workout_duration_minutes: number | null;
  workout_intensity: string | null;
  cardio_type: string | null;
  cardio_duration_minutes: number | null;
  cardio_distance_km: number | null;
  diet_notes: string | null;
  mood_level: string | null;
  sleep_hours: number | null;
  general_notes: string | null;
}

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

const RoutineTrackerPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);

  const { data: dailyRoutine, isLoading: loadingRoutine } = useDailyRoutineForDate(selectedDate);
  const { data: userGoals, isLoading: loadingGoals, refetch: refetchUserGoals } = useUserGoals(true); // Fetch only active goals

  const saveDailyRoutineMutation = useSaveDailyRoutine();
  const deleteUserGoalMutation = useDeleteUserGoal(); // Inicializar o hook de mutação

  useEffect(() => {
    if (saveDailyRoutineMutation.isError) {
      showError('Erro ao salvar rotina: ' + saveDailyRoutineMutation.error?.message);
    }
  }, [saveDailyRoutineMutation.isError, saveDailyRoutineMutation.error]);

  const handleSaveRoutine = async (routineData: Partial<DailyRoutine>) => {
    if (!user || !userGoals) {
      showError('Você precisa estar logada para salvar sua rotina.');
      return;
    }
    if (isAfter(selectedDate, new Date()) && !isToday(selectedDate)) {
      showError("Não é possível registrar rotinas para datas futuras.");
      return;
    }

    saveDailyRoutineMutation.mutate({
      userId: user.id,
      selectedDate: selectedDate,
      routineData: routineData,
      existingRoutineId: dailyRoutine?.id,
      userGoals: userGoals,
    }, {
      onSuccess: () => {
        setIsFormDialogOpen(false);
      }
    });
  };

  const handleDeleteGoal = async (goalId: string, goalName: string) => {
    if (!user || !window.confirm(`Tem certeza que deseja deletar a meta "${goalName}"? Esta ação é irreversível.`)) return;
    
    deleteUserGoalMutation.mutate({ userId: user.id, goalId, goalName });
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  if (authLoading || loadingRoutine || loadingGoals) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando rastreador de rotina...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
        <LoginGate
          message="Crie uma conta ou faça login para rastrear sua rotina de fitness."
          featureName="Rastreador de Rotina"
        >
          <Card className="max-w-md mx-auto p-8 text-center card-style">
            <Dumbbell className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold gradient-text mb-3">Rastreador de Rotina</h2>
            <p className="text-pink-600 text-base mb-6">
              Monitore seus treinos, cardio, dieta e bem-estar diário para ver seu progresso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="w-full">
                <Link to="/login">Fazer Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/signup">Criar Conta Grátis</Link>
              </Button>
            </div>
          </Card>
        </LoginGate>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <Dumbbell className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Rastreador de Rotina</h2>
          <p className="text-pink-600 text-base">Monitore seu progresso diário.</p>
        </div>

        {/* Date Navigation */}
        <Card className="p-4 flex items-center justify-between shadow-lg border-pink-100">
          <Button variant="ghost" size="icon" onClick={() => setSelectedDate(subDays(selectedDate, 1))} aria-label="Dia anterior">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40 justify-center" aria-label={`Data selecionada: ${format(selectedDate, 'dd MMM, yyyy', { locale: ptBR })}`}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'dd MMM, yyyy', { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))} aria-label="Próximo dia">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </Card>

        {/* Daily Routine Display / Form Trigger */}
        <Card className="p-6 shadow-lg border-pink-100">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-between">
              Rotina de {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={dailyRoutine ? "Editar rotina" : "Adicionar rotina"}>
                    {dailyRoutine ? <Edit className="h-5 w-5 text-pink-500" /> : <Plus className="h-5 w-5 text-pink-500" />}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{dailyRoutine ? 'Editar Rotina' : 'Adicionar Rotina'}</DialogTitle>
                  </DialogHeader>
                  <DailyRoutineForm
                    initialData={dailyRoutine || undefined}
                    onSave={handleSaveRoutine}
                    loading={saveDailyRoutineMutation.isPending}
                    onClose={() => setIsFormDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            {loadingRoutine ? (
              <p>Carregando...</p>
            ) : dailyRoutine ? (
              <div className="space-y-2">
                {dailyRoutine.workout_type && dailyRoutine.workout_type !== 'none' && (
                  <div className="flex items-center">
                    <Dumbbell className="h-5 w-5 mr-3 text-pink-500" />
                    <p><span className="font-semibold">Treino:</span> {mapWorkoutType(dailyRoutine.workout_type)} ({dailyRoutine.workout_duration_minutes} min, {mapWorkoutIntensity(dailyRoutine.workout_intensity)})</p>
                  </div>
                )}
                {dailyRoutine.cardio_type && dailyRoutine.cardio_type !== 'none' && (
                  <div className="flex items-center">
                    <Bike className="h-5 w-5 mr-3 text-purple-500" />
                    <p><span className="font-semibold">Cardio:</span> {mapCardioType(dailyRoutine.cardio_type)} ({dailyRoutine.cardio_duration_minutes} min, {dailyRoutine.cardio_distance_km} km)</p>
                  </div>
                )}
                {dailyRoutine.diet_notes && (
                  <div className="flex items-center">
                    <Utensils className="h-5 w-5 mr-3 text-green-500" />
                    <p><span className="font-semibold">Dieta:</span> {dailyRoutine.diet_notes}</p>
                  </div>
                )}
                {dailyRoutine.mood_level && (
                  <div className="flex items-center">
                    <Smile className="h-5 w-5 mr-3 text-yellow-500" />
                    <p><span className="font-semibold">Humor:</span> {mapMoodLevel(dailyRoutine.mood_level)}</p>
                  </div>
                )}
                {dailyRoutine.sleep_hours !== null && (
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-3 text-blue-500" />
                    <p><span className="font-semibold">Sono:</span> {dailyRoutine.sleep_hours} horas</p>
                  </div>
                )}
                {dailyRoutine.general_notes && (
                  <div className="flex items-center">
                    <NotebookPen className="h-5 w-5 mr-3 text-slate-500" />
                    <p><span className="font-semibold">Notas:</span> {dailyRoutine.general_notes}</p>
                  </div>
                )}
                {!dailyRoutine.workout_type && !dailyRoutine.cardio_type && !dailyRoutine.diet_notes && !dailyRoutine.mood_level && dailyRoutine.sleep_hours === null && !dailyRoutine.general_notes && (
                  <p className="text-slate-500">Nenhum registro para este dia. Clique no ícone <Edit className="inline-block h-4 w-4 text-pink-500" /> para adicionar.</p>
                )}
              </div>
            ) : (
              <p className="text-slate-500">Nenhum registro para este dia. Clique no ícone <Plus className="inline-block h-4 w-4 text-pink-500" /> para adicionar.</p>
            )}
          </CardContent>
        </Card>

        {/* Active Goals Display */}
        <Card className="p-6 shadow-lg border-pink-100">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <Target className="h-6 w-6 mr-3 text-pink-500" /> Suas Metas Ativas
            </CardTitle>
            <Button asChild variant="ghost" size="icon" aria-label="Gerenciar metas">
              <Link to="/minhas-metas">
                <Edit className="h-5 w-5 text-pink-500" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingGoals ? (
              <p>Carregando metas...</p>
            ) : userGoals && userGoals.length === 0 ? (
              <p className="text-slate-500">Você ainda não definiu nenhuma meta ativa.
                <Button asChild variant="link" className="p-0 h-0 text-pink-500 hover:text-pink-600">
                  <Link to="/minhas-metas">Defina sua primeira meta!</Link>
                </Button>
              </p>
            ) : (
              <div className="space-y-3">
                {userGoals && userGoals.map(goal => {
                  const progressPercentage = calculateProgress(goal.current_value, goal.target_value || 0);
                  const isGoalMet = goal.current_value >= (goal.target_value || 0);
                  return (
                    <div key={goal.id} className="bg-slate-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
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
                          {goal.current_value !== null && goal.current_value !== 0 && (
                            <p className="text-slate-500 text-sm mt-2">Progresso atual: {goal.current_value}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <GoalSettingDialog
          isOpen={isGoalDialogOpen}
          onOpenChange={setIsGoalDialogOpen}
          initialData={editingGoal}
        />
      </div>
    </div>
  );
};

export default RoutineTrackerPage;