"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError, showSuccess } from '@/utils/toast'; // Importar showSuccess
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Utensils, Flame, Beef, Carrot, Nut, Trash2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState'; // Importar EmptyState

// Importar os novos hooks
import { useUserMacroPlans } from '@/hooks/useUserMacroPlans';
import { useDeleteMacroPlan } from '@/hooks/useDeleteMacroPlan';


interface MacroPlan {
  id: string;
  target_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  created_at: string;
}

const MyMacroPlansPage = () => {
  const { user, loading: authLoading } = useAuth();

  // Usar os novos hooks de query e mutação
  const { data: plans, isLoading: loadingPlans } = useUserMacroPlans();
  const deleteMacroPlanMutation = useDeleteMacroPlan();

  // Removido useEffect para tratamento de erro, agora gerenciado pelo hook useUserMacroPlans
  // useEffect(() => {
  //   if (fetchError) {
  //     showError('Erro ao carregar seus planos de macros: ' + fetchError.message);
  //   }
  // }, [fetchError]);

  const handleDeletePlan = async (planId: string) => {
    if (!user) {
      showError("Você precisa estar logada para deletar um plano.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja deletar este plano?")) {
      return;
    }

    deleteMacroPlanMutation.mutate({ userId: user.id, planId });
  };

  if (authLoading || loadingPlans) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando seus planos...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Você precisa estar logada para ver seus planos de macros.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Meus Planos de Macros</h1>
          <p className="text-slate-600">Visualize e gerencie seus planos nutricionais salvos.</p>
        </div>

        {plans && plans.length === 0 ? (
          <EmptyState
            icon={Utensils}
            title="Nenhum plano de macros salvo"
            description="Crie seu primeiro plano nutricional personalizado agora!"
            buttonText="Criar Meu Primeiro Plano"
            onClick={() => navigate("/calculadora-macros")} // Adicionado onClick para o EmptyState
            iconColorClass="text-pink-500"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans && plans.map((plan) => (
              <Card key={plan.id} className="relative bg-white rounded-2xl shadow-lg border border-pink-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Plano de {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-red-500 hover:bg-red-50"
                    disabled={deleteMacroPlanMutation.isPending}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-slate-700">
                    <Flame className="h-5 w-5 text-pink-500 mr-2" />
                    <span className="font-semibold">Calorias:</span> {plan.target_calories} kcal
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Beef className="h-5 w-5 text-pink-500 mr-2" />
                    <span className="font-semibold">Proteína:</span> {plan.protein_grams}g
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Carrot className="h-5 w-5 text-pink-500 mr-2" />
                    <span className="font-semibold">Carboidratos:</span> {plan.carbs_grams}g
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Nut className="h-5 w-5 text-pink-500 mr-2" />
                    <span className="font-semibold">Gorduras:</span> {plan.fat_grams}g
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

export default MyMacroPlansPage;