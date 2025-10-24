"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface DeleteCustomFoodVariables {
  userId: string;
  foodId: string;
  foodName: string;
}

export const useDeleteCustomFood = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteCustomFoodVariables>({
    mutationFn: async ({ userId, foodId }) => {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', foodId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess(`Alimento "${variables.foodName}" deletado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['customFoods', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['customFoodsCount', variables.userId] });
    },
    onError: (error) => {
      showError('Erro ao deletar alimento: ' + error.message);
    },
  });
};