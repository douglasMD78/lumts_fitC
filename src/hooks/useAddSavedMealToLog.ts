"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

interface SavedMealItemToLog {
  food_id: string;
  quantity_grams: number;
  selected_unit: string;
  selected_quantity: number;
}

interface AddSavedMealToLogVariables {
  userId: string;
  mealType: string;
  logDate: Date;
  items: SavedMealItemToLog[];
}

export const useAddSavedMealToLog = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddSavedMealToLogVariables>({
    mutationFn: async ({ userId, mealType, logDate, items }) => {
      const formattedDate = format(logDate, 'yyyy-MM-dd');
      const loggedFoodEntries = items.map(item => ({
        user_id: userId,
        food_id: item.food_id,
        meal_type: mealType,
        quantity_grams: item.quantity_grams,
        selected_unit: item.selected_unit,
        selected_quantity: item.selected_quantity,
        log_date: formattedDate,
      }));

      const { error } = await supabase.from('logged_foods').insert(loggedFoodEntries);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess(`Refeição adicionada ao log de ${variables.mealType}! 🎉`);
      queryClient.invalidateQueries({ queryKey: ['loggedFoods', variables.userId, format(variables.logDate, 'yyyy-MM-dd')] });
    },
    onError: (error) => {
      showError('Erro ao adicionar refeição salva ao log: ' + error.message);
    },
  });
};