"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Hourglass, Clock, Trash2, Utensils } from 'lucide-react'; // Adicionado Utensils
import EmptyState from '@/components/EmptyState'; // Importar EmptyState

// Importar os novos hooks
import { useUserFastingPlans } from '@/hooks/useUserFastingPlans';
import { useDeleteFastingPlan } from '@/hooks/useDeleteFastingPlan';


interface FastingPlan {
  id: string;
  last_meal_time: string;
  fasting_duration_hours: number;
  fasting_window_end: string;
  eating_window_start: string;
  eating_window_end: string;
  created_at: string;
}

const MyFastingPlansPage = () => {
  const { user, loading: authLoading } = useAuth();

  // Usar os novos hooks de query e mutação
  const { data: plans, isLoading: loadingPlans, error: fetchError } = useUserFastingPlans();
  const deleteFastingPlanMutation = useDeleteFastingPlan();

  useEffect(() => {
    if (fetchError) {
      showError('Erro ao carregar seus planos de jejum: ' + fetchError.message);
    }
  }, [fetchError]);

  const handleDeletePlan = async (planId: string) => {
    if (!user) {
      showError("Você precisa estar logada para deletar um plano.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja deletar este plano de jejum?")) {
      return;
    }

    deleteFastingPlanMutation.mutate({ userId: user.id, planId });
  };

  if (authLoading || loadingPlans) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando seus planos de jejum...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Você precisa estar logada para ver seus planos de jejum.</p>
        <Button asChild className="mt-4 bg-indigo-500 hover:bg-indigo-600">
          <Link to="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Meus Planos de Jejum</h1>
          <p className="text-slate-600">Visualize e gerencie seus planos de jejum intermitente salvos.</p>
        </div>

        {plans && plans.length === 0 ? (
          <EmptyState
            icon={Hourglass}
            title="Nenhum plano de jejum salvo"
            description="Crie seu primeiro plano de jejum intermitente agora!"
            buttonText="Criar Meu Primeiro Plano de Jejum"
            buttonLink="/calculadora-jejum"
            iconColorClass="text-indigo-500"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans && plans.map((plan) => (
              <Card key={plan.id} className="relative bg-white rounded-2xl shadow-lg border border-indigo-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Plano de {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-red-500 hover:bg-red-50"
                    disabled={deleteFastingPlanMutation.isPending}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-slate-700">
                    <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-semibold">Última Refeição:</span> {plan.last_meal_time}
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Hourglass className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-semibold">Duração do Jejum:</span> {plan.fasting_duration_hours}h
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-semibold">Fim do Jejum:</span> {plan.fasting_window_end}
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Utensils className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-semibold">Janela de Alimentação:</span> {plan.eating_window_start} - {plan.eating_window_end}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFastingPlansPage;