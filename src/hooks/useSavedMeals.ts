"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Food } from './useSearchFoods'; // Import Food interface

interface SavedMealItem {
  id: string;
  food_id: string;
  quantity_grams: number;
  selected_unit: string;
  selected_quantity: number;
  foods: Food | null; // Corrigido: de Food[] para Food | null
}

export interface SavedMeal {
  id: string;
  name: string;
  created_at: string;
  saved_meal_items: SavedMealItem[];
}

const fetchSavedMeals = async (userId: string): Promise<SavedMeal[]> => {
  const { data, error } = await supabase
    .from('saved_meals')
    .select(`
      id,
      name,
      created_at,
      saved_meal_items (
        id,
        food_id,
        quantity_grams,
        selected_unit,
        selected_quantity,
        foods (
          id,
          name,
          calories,
          protein,
          carbs,
          fat,
          serving_size_grams,
          fiber,
          sugar,
          sodium,
          cholesterol,
          saturated_fat,
          trans_fat,
          calcium,
          iron,
          vitamin_a,
          vitamin_c,
          category,
          source,
          external_id,
          common_servings,
          user_id
        )
      )
    `)
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data as SavedMeal[] || []; // Explicitly cast data
};

export const useSavedMeals = () => {
  const { user } = useAuth();

  return useQuery<SavedMeal[], Error>({
    queryKey: ['savedMeals', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchSavedMeals(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};