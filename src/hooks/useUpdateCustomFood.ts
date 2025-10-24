"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface CommonServing {
  unit: string;
  grams: number;
}

interface CustomFoodUpdateData {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size_grams: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  common_servings?: CommonServing[];
}

interface UpdateCustomFoodVariables {
  userId: string;
  foodId: string;
  foodData: CustomFoodUpdateData;
}

export const useUpdateCustomFood = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateCustomFoodVariables>({
    mutationFn: async ({ userId, foodId, foodData }) => {
      const { error } = await supabase
        .from('foods')
        .update({
          name: foodData.name,
          calories: foodData.calories,
          protein: foodData.protein,
          carbs: foodData.carbs,
          fat: foodData.fat,
          serving_size_grams: foodData.serving_size_grams,
          fiber: foodData.fiber,
          sugar: foodData.sugar,
          sodium: foodData.sodium,
          common_servings: foodData.common_servings || [],
        })
        .eq('id', foodId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess(`Alimento "${variables.foodData.name}" atualizado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['customFoods', variables.userId] });
    },
    onError: (error) => {
      showError('Erro ao atualizar alimento: ' + error.message);
    },
  });
};