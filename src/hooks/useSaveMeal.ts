"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface MealItemPayload {
  food_id: string;
  quantity_grams: number;
  selected_unit: string;
  selected_quantity: number;
}

interface SaveMealVariables {
  userId: string;
  mealName: string;
  items: MealItemPayload[];
}

export const useSaveMeal = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveMealVariables>({
    mutationFn: async ({ userId, mealName, items }) => {
      // 1. Inserir a refeição na tabela saved_meals
      const { data: savedMeal, error: mealError } = await supabase
        .from('saved_meals')
        .insert({ user_id: userId, name: mealName })
        .select('id')
        .single();

      if (mealError) {
        throw new Error(mealError.message);
      }

      if (!savedMeal) {
        throw new Error('Erro ao criar a refeição salva.');
      }

      // 2. Inserir os itens da refeição na tabela saved_meal_items
      const itemsWithMealId = items.map(item => ({
        ...item,
        saved_meal_id: savedMeal.id,
      }));

      const { error: itemsError } = await supabase
        .from('saved_meal_items')
        .insert(itemsWithMealId);

      if (itemsError) {
        // Se houver erro nos itens, tentar reverter a criação da refeição
        await supabase.from('saved_meals').delete().eq('id', savedMeal.id);
        throw new Error(itemsError.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess(`Refeição "${variables.mealName}" salva com sucesso! 🎉`);
      queryClient.invalidateQueries({ queryKey: ['savedMeals', variables.userId] });
    },
    onError: (error) => {
      showError('Erro ao salvar refeição: ' + error.message);
    },
  });
};