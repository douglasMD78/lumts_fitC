"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface SaveMacroPlanVariables {
  userId: string;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export const useSaveMacroPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveMacroPlanVariables>({
    mutationFn: async (data) => {
      const { error } = await supabase.from('macro_plans').insert({
        user_id: data.userId,
        target_calories: data.targetCalories,
        protein_grams: data.proteinGrams,
        carbs_grams: data.carbsGrams,
        fat_grams: data.fatGrams,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: (variables) => {
      showSuccess("Seu plano de macros foi salvo com sucesso! 🎉");
      queryClient.invalidateQueries({ queryKey: ['userMacroPlans', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['latestMacroPlan', variables.userId] });
    },
    onError: (error) => {
      showError("Erro ao salvar o plano: " + error.message);
    },
  });
};