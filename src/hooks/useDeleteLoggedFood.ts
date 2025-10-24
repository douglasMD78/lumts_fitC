"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

interface DeleteLoggedFoodVariables {
  userId: string;
  loggedFoodId: string;
  logDate: Date; // Needed for cache invalidation
}

export const useDeleteLoggedFood = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteLoggedFoodVariables>({
    mutationFn: async (variables) => {
      const { error } = await supabase
        .from('logged_foods')
        .delete()
        .eq('id', variables.loggedFoodId)
        .eq('user_id', variables.userId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess('Alimento removido!');
      queryClient.invalidateQueries({ queryKey: ['loggedFoods', variables.userId, format(variables.logDate, 'yyyy-MM-dd')] });
    },
    onError: (error) => {
      showError('Erro ao remover alimento: ' + error.message);
    },
  });
};