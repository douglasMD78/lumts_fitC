"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface DeleteSavedMealVariables {
  userId: string;
  mealId: string;
  mealName: string;
}

export const useDeleteSavedMeal = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteSavedMealVariables>({
    mutationFn: async ({ userId, mealId }) => {
      const { error } = await supabase
        .from('saved_meals')
        .delete()
        .eq('id', mealId)
        .eq('user_id', userId); // Garantir que o usuário só pode deletar suas próprias refeições

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess(`Refeição "${variables.mealName}" deletada com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['savedMeals', variables.userId] });
    },
    onError: (error) => {
      showError('Erro ao deletar refeição: ' + error.message);
    },
  });
};