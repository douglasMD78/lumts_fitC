"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';
import { calculateNutrient } from '@/utils/nutritionHelpers';
import { Food } from './useSearchFoods'; // Import Food interface

interface CommonServing {
  unit: string;
  grams: number;
}

// Re-definindo LoggedFood para corresponder à estrutura do select
interface LoggedFood {
  food_id: string;
  quantity_grams: number;
  log_date: string;
  foods: Food | null; // Corrigido: de Food[] para Food | null
  meal_type: string; // Adicionado
  selected_unit: string; // Adicionado
  selected_quantity: number; // Adicionado
}

export interface WeeklyNutritionSummaryData {
  avgFiber: number;
  avgSugar: number;
  avgSodium: number;
  topProteinSources: { name: string; totalGrams: number }[];
  topCarbSources: { name: string; totalGrams: number }[];
  topFatSources: { name: string; totalGrams: number }[];
}

const fetchWeeklyNutritionSummary = async (userId: string): Promise<WeeklyNutritionSummaryData> => {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6); // Last 7 days including today
  const formattedStartDate = format(sevenDaysAgo, 'yyyy-MM-dd');
  const formattedEndDate = format(today, 'yyyy-MM-dd');

  const { data: loggedFoods, error } = await supabase
    .from('logged_foods')
    .select(`
      food_id,
      quantity_grams,
      log_date,
      meal_type,
      selected_unit,
      selected_quantity,
      foods (
        id,
        name,
        calories,
        protein,
        carbs,
        fat,
        fiber,
        sugar,
        sodium,
        serving_size_grams
        -- common_servings -- Removido temporariamente para depuração
      )
    `)
    .eq('user_id', userId)
    .gte('log_date', formattedStartDate)
    .lte('log_date', formattedEndDate);

  if (error) {
    throw new Error(error.message);
  }

  if (!loggedFoods || loggedFoods.length === 0) {
    return {
      avgFiber: 0,
      avgSugar: 0,
      avgSodium: 0,
      topProteinSources: [],
      topCarbSources: [],
      topFatSources: [],
    };
  }

  let totalFiber = 0;
  let totalSugar = 0;
  let totalSodium = 0;

  const proteinSources: { [name: string]: number } = {};
  const carbSources: { [name: string]: number } = {};
  const fatSources: { [name: string]: number } = {};

  const uniqueDates = new Set<string>();

  (loggedFoods as LoggedFood[]).forEach((log: LoggedFood) => { // Explicitly cast loggedFoods
    uniqueDates.add(log.log_date);
    const food = log.foods;
    if (food) {
      totalFiber += calculateNutrient(food.fiber, food.serving_size_grams, log.quantity_grams);
      totalSugar += calculateNutrient(food.sugar, food.serving_size_grams, log.quantity_grams);
      totalSodium += calculateNutrient(food.sodium, food.serving_size_grams, log.quantity_grams);

      const proteinGrams = calculateNutrient(food.protein, food.serving_size_grams, log.quantity_grams);
      const carbsGrams = calculateNutrient(food.carbs, food.serving_size_grams, log.quantity_grams);
      const fatGrams = calculateNutrient(food.fat, food.serving_size_grams, log.quantity_grams);

      proteinSources[food.name] = (proteinSources[food.name] || 0) + proteinGrams;
      carbSources[food.name] = (carbSources[food.name] || 0) + carbsGrams;
      fatSources[food.name] = (fatSources[food.name] || 0) + fatGrams;
    }
  });

  const numDaysLogged = uniqueDates.size;
  const avgFiber = numDaysLogged > 0 ? totalFiber / numDaysLogged : 0;
  const avgSugar = numDaysLogged > 0 ? totalSugar / numDaysLogged : 0;
  const avgSodium = numDaysLogged > 0 ? totalSodium / numDaysLogged : 0;

  const getTopSources = (sources: { [name: string]: number }) =>
    Object.entries(sources)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, totalGrams]) => ({ name, totalGrams: parseFloat(totalGrams.toFixed(1)) }));

  return {
    avgFiber: parseFloat(avgFiber.toFixed(1)),
    avgSugar: parseFloat(avgSugar.toFixed(1)),
    avgSodium: parseFloat(avgSodium.toFixed(0)),
    topProteinSources: getTopSources(proteinSources),
    topCarbSources: getTopSources(carbSources),
    topFatSources: getTopSources(fatSources),
  };
};

export const useWeeklyNutritionSummary = () => {
  const { user } = useAuth();

  return useQuery<WeeklyNutritionSummaryData, Error>({
    queryKey: ['weeklyNutritionSummary', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve({
        avgFiber: 0, avgSugar: 0, avgSodium: 0,
        topProteinSources: [], topCarbSources: [], topFatSources: []
      });
      return fetchWeeklyNutritionSummary(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};