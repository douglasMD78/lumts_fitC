"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, format } from 'date-fns';
import { Food } from './useSearchFoods'; // Import Food interface

// Removida a re-declaração da interface Food aqui, pois já é importada.

interface LoggedFoodForFrequentFoods { // Nova interface para o select específico
  food_id: string;
  foods: Food | null; // Pode ser null se a relação não for encontrada
}

const fetchFrequentFoods = async (userId: string): Promise<Food[]> => {
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

  // Fetch logged foods for the last 30 days
  const { data: loggedFoods, error } = await supabase
    .from('logged_foods')
    .select(`
      food_id,
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
        common_servings,
        user_id
      )
    `)
    .eq('user_id', userId)
    .gte('log_date', thirtyDaysAgo);

  if (error) {
    throw new Error(error.message);
  }

  if (!loggedFoods || loggedFoods.length === 0) {
    return [];
  }

  // Aggregate food counts
  const foodCounts: { [foodId: string]: { count: number; food: Food } } = {};
  (loggedFoods as LoggedFoodForFrequentFoods[]).forEach(log => { // Explicitly cast log
    if (log.foods) {
      foodCounts[log.food_id] = { count: (foodCounts[log.food_id]?.count || 0) + 1, food: log.foods };
    }
  });

  // Sort by frequency and return top N foods
  const sortedFoods = Object.values(foodCounts)
    .sort((a, b) => b.count - a.count)
    .map(item => item.food)
    .slice(0, 5); // Top 5 frequent foods

  return sortedFoods;
};

export const useFrequentFoods = () => {
  const { user } = useAuth();

  return useQuery<Food[], Error>({
    queryKey: ['frequentFoods', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchFrequentFoods(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};