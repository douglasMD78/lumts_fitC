"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface CommonServing {
  unit: string;
  grams: number;
}

interface CustomFoodData {
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

interface AddCustomFoodVariables {
  userId: string;
  foodData: CustomFoodData;
  isOfficial?: boolean; // Novo campo para indicar se é um alimento oficial
}

export const useAddCustomFood = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddCustomFoodVariables>({
    mutationFn: async ({ userId, foodData, isOfficial = false }) => {
      const { error } = await supabase
        .from('foods')
        .insert({
          user_id: isOfficial ? null : userId, // Se for oficial, user_id é null
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
          source: isOfficial ? 'admin_official' : 'user_custom', // Define a fonte
        });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess(`Alimento "${variables.foodData.name}" adicionado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['customFoods', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['customFoodsCount', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['searchFoods'] }); // Invalida a busca para que o novo alimento apareça
    },
    onError: (error) => {
      showError('Erro ao adicionar alimento personalizado: ' + error.message);
    },
  });
};