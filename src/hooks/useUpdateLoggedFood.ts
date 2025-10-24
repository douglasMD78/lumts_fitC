"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

interface UpdateLoggedFoodVariables {
  userId: string;
  loggedFoodId: string;
  quantityGrams: number;
  selectedUnit: string;
  selectedQuantity: number;
  logDate: Date; // Needed for cache invalidation
}

export const useUpdateLoggedFood = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateLoggedFoodVariables>({
    mutationFn: async (variables) => {
      const { error } = await supabase
        .from('logged_foods')
        .update({
          quantity_grams: variables.quantityGrams,
          selected_unit: variables.selectedUnit,
          selected_quantity: variables.selectedQuantity,
        })
        .eq('id', variables.loggedFoodId)
        .eq('user_id', variables.userId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess('Alimento atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['loggedFoods', variables.userId, format(variables.logDate, 'yyyy-MM-dd')] });
    },
    onError: (error) => {
      showError('Erro ao atualizar alimento: ' + error.message);
    },
  });
};