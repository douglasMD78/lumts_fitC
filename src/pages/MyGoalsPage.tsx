"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Plus, Edit, Trash2, CheckCircle, TrendingUp } from 'lucide-react'; // Adicionado TrendingUp
import { Progress } from '@/components/ui/progress';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import GoalSettingDialog from '@/components/GoalSettingDialog';
import RecordProgressDialog from '@/components/RecordProgressDialog'; // Importar o novo componente
import { mapGoalType } from '@/utils/displayHelpers'; // Importar helper
import EmptyState from '@/components/EmptyState'; // Importar EmptyState

// Importar o novo hook
import { useUserGoals } from '@/hooks/useUserGoals';
import { useDeleteUserGoal } from '@/hooks/useDeleteUserGoal'; // Importar o novo hook de mutação


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

const MyGoalsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [loadingGoals, setLoadingGoals] = useState(true); // Keep local loading state for initial fetch
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);
  // const [isSaving, setIsSaving] = useState(false); // Removido, gerenciado pelo hook de mutação

  const [isRecordProgressDialogOpen, setIsRecordProgressDialogOpen] = useState(false);
  const [selectedGoalForProgress, setSelectedGoalForProgress] = useState<UserGoal | null>(null);

  // Usar o novo hook para buscar todas as metas
  const { data: userGoals, isLoading: queryLoadingGoals, refetch: refetchUserGoals } = useUserGoals(false);
  const deleteUserGoalMutation = useDeleteUserGoal(); // Inicializar o hook de mutação

  useEffect(() => {
    if (!authLoading && !queryLoadingGoals) {
      setLoadingGoals(false); // Set local loading to false once query is done
    }
    // Removido useEffect para tratamento de erro, agora gerenciado pelo hook useUserGoals
    // if (goalsError) {
    //   showError('Erro ao carregar metas: ' + goalsError.message);
    // }
  }, [authLoading, queryLoadingGoals]);

  // A função handleSaveGoal foi movida para o hook useSaveUserGoal e não é mais necessária aqui.
  // O GoalSettingDialog agora gerencia sua própria lógica de salvamento.

  const handleDeleteGoal = async (goalId: string, goalName: string) => {
    if (!user || !window.confirm(`Tem certeza que deseja deletar a meta "${goalName}"? Esta ação é irreversível.`)) return;
    
    deleteUserGoalMutation.mutate({ userId: user.id, goalId, goalName });
  };

  const handleRecordProgressClick = (goal: UserGoal) => {
    setSelectedGoalForProgress(goal);
    setIsRecordProgressDialogOpen(true);
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  if (authLoading || loadingGoals) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando suas metas...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Você precisa estar logada para ver suas metas.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Minhas Metas</h1>
            <p className="text-slate-600">Acompanhe seu progresso e conquiste seus objetivos!</p>
          </div>
          <Button onClick={() => { setEditingGoal(null); setIsGoalDialogOpen(true); }} className="bg-pink-500 hover:bg-pink-600">
            <Plus className="h-5 w-5 mr-2" /> Adicionar Nova Meta
          </Button>
        </div>

        {userGoals && userGoals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Nenhuma meta definida"
            description="Defina sua primeira meta de fitness e saúde para começar a acompanhar seu progresso!"
            buttonText="Definir Minha Primeira Meta"
            onClick={() => { setEditingGoal(null); setIsGoalDialogOpen(true); }} // Passa a função onClick aqui
            iconColorClass="text-pink-500"
            buttonVariant="default"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userGoals && userGoals.map((goal) => {
              const progressPercentage = calculateProgress(goal.current_value, goal.target_value || 0);
              const isGoalMet = goal.current_value >= (goal.target_value || 0);

              return (
                <Card key={goal.id} className="relative bg-white rounded-2xl shadow-lg border border-pink-100">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-bold text-slate-800">{goal.goal_name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingGoal(goal); setIsGoalDialogOpen(true); }} aria-label={`Editar meta ${goal.goal_name}`}>
                        <Edit className="h-5 w-5 text-blue-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteGoal(goal.id, goal.goal_name)} 
                        aria-label={`Remover meta ${goal.goal_name}`}
                        disabled={deleteUserGoalMutation.isPending}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-600 text-sm">
                      Tipo: <span className="font-semibold">{mapGoalType(goal.goal_type)}</span>
                    </p>
                    <p className="text-slate-600 text-sm">
                      Início: {format(goal.start_date, 'dd/MM/yyyy', { locale: ptBR })}
                      {goal.end_date && ` | Término: ${format(goal.end_date, 'dd/MM/yyyy', { locale: ptBR })}`}
                    </p>
                    
                    {goal.goal_type !== 'other' && goal.target_value !== null && goal.target_unit !== null ? (
                      <>
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="font-semibold">Progresso:</span>
                          <span>{goal.current_value} {goal.target_unit} / {goal.target_value} {goal.target_unit}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 bg-pink-100 mt-2" indicatorClassName={isGoalMet ? "bg-green-500" : "bg-gradient-to-r from-pink-500 to-fuchsia-600"} />
                        {isGoalMet ? (
                          <p className="text-green-600 text-sm flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" /> Meta Concluída!
                          </p>
                        ) : (
                          <p className="text-slate-500 text-sm">Faltam {(goal.target_value - goal.current_value).toFixed(1)} {goal.target_unit} para a meta.</p>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 border-pink-500 text-pink-500 hover:bg-pink-50"
                          onClick={() => handleRecordProgressClick(goal)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" /> Registrar Progresso
                        </Button>
                      </>
                    ) : (
                      <div className="text-slate-600 text-sm">
                        <span className="font-semibold">Descrição:</span> {goal.target_description || 'N/A'}
                        {goal.current_value !== null && goal.current_value !== 0 && ( // Only show if not null and not 0
                          <p className="text-slate-500 text-sm mt-2">Progresso atual: {goal.current_value}</p>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 border-pink-500 text-pink-500 hover:bg-pink-50"
                          onClick={() => handleRecordProgressClick(goal)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" /> Registrar Progresso
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <GoalSettingDialog
          isOpen={isGoalDialogOpen}
          onOpenChange={setIsGoalDialogOpen}
          initialData={editingGoal}
        />

        {selectedGoalForProgress && (
          <RecordProgressDialog
            isOpen={isRecordProgressDialogOpen}
            onOpenChange={setIsRecordProgressDialogOpen}
            goal={selectedGoalForProgress}
            onProgressRecorded={refetchUserGoals} // Refresh goals after recording progress
          />
        )}
      </div>
    </div>
  );
};

export default MyGoalsPage;