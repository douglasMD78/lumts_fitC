"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Food } from './useSearchFoods'; // Import Food interface

interface CommonServing {
  unit: string;
  grams: number;
}

export interface LoggedFood {
  id: string;
  food_id: string;
  meal_type: string;
  quantity_grams: number; // Total grams logged
  selected_unit: string; // The unit chosen by the user (e.g., 'gramas', 'xícara')
  selected_quantity: number; // The quantity of the chosen unit (e.g., 2 for '2 xícaras')
  log_date: string;
  foods: Food | null; // Corrigido: de Food[] para Food | null
}

const fetchLoggedFoodsForDate = async (userId: string, date: Date): Promise<LoggedFood[]> => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const { data, error } = await supabase
    .from('logged_foods')
    .select(`
      id,
      food_id,
      meal_type,
      quantity_grams,
      selected_unit,
      selected_quantity,
      log_date,
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
    `)
    .eq('user_id', userId)
    .eq('log_date', formattedDate)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data as LoggedFood[] || []; // Explicitly cast data
};

export const useLoggedFoodsForDate = (date: Date) => {
  const { user } = useAuth();

  return useQuery<LoggedFood[], Error>({
    queryKey: ['loggedFoods', user?.id, format(date, 'yyyy-MM-dd')],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchLoggedFoodsForDate(user.id, date);
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute
  });
};