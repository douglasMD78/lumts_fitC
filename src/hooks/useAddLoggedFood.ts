"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

interface AddLoggedFoodVariables {
  userId: string;
  foodId: string;
  mealType: string;
  quantityGrams: number;
  selectedUnit: string;
  selectedQuantity: number;
  logDate: Date;
}

export const useAddLoggedFood = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddLoggedFoodVariables>({
    mutationFn: async (variables) => {
      const formattedDate = format(variables.logDate, 'yyyy-MM-dd');
      const { error } = await supabase.from('logged_foods').insert({
        user_id: variables.userId,
        food_id: variables.foodId,
        meal_type: variables.mealType,
        quantity_grams: variables.quantityGrams,
        selected_unit: variables.selectedUnit,
        selected_quantity: variables.selectedQuantity,
        log_date: formattedDate,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess('Alimento registrado com sucesso! 🎉');
      queryClient.invalidateQueries({ queryKey: ['loggedFoods', variables.userId, format(variables.logDate, 'yyyy-MM-dd')] });
    },
    onError: (error) => {
      showError('Erro ao registrar alimento: ' + error.message);
    },
  });
};