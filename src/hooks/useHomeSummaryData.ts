"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, differenceInDays } from 'date-fns';
import { calculateNutrient } from '@/utils/nutritionHelpers';
import { Food } from './useSearchFoods'; // Import Food interface

interface CommonServing {
  unit: string;
  grams: number;
}

// Re-definindo LoggedFood para corresponder à estrutura do select
interface LoggedFood {
  food_id: string;
  meal_type: string; // Adicionado meal_type
  quantity_grams: number;
  log_date: string;
  foods: Food | null; // Corrigido: de Food[] para Food | null
  selected_unit: string; // Adicionado
  selected_quantity: number; // Adicionado
}

interface DailyRoutine {
  routine_date: string;
  workout_duration_minutes: number | null;
  cardio_distance_km: number | null;
  sleep_hours: number | null;
}

interface MacroPlan {
  target_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
}

interface HomeSummaryData {
  avgCalories: number;
  avgProtein: number;
  avgWorkoutDuration: number;
  targetCalories: number;
}

const fetchHomeSummaryData = async (userId: string): Promise<HomeSummaryData> => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const formattedStartDate = format(thirtyDaysAgo, 'yyyy-MM-dd');
  const formattedEndDate = format(today, 'yyyy-MM-dd');

  // Fetch macro plan
  const { data: plan, error: planError } = await supabase
    .from('macro_plans')
    .select('target_calories')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (planError && planError.code !== 'PGRST116') throw planError;
  const targetCalories = plan?.target_calories || 0;

  // Fetch logged foods
  const { data: foodsLog, error: foodsError } = await supabase
    .from('logged_foods')
    .select(`
      food_id,
      log_date,
      quantity_grams,
      meal_type,
      selected_unit,
      selected_quantity,
      foods (id, name, calories, protein, serving_size_grams, common_servings, user_id)
    `)
    .eq('user_id', userId)
    .gte('log_date', formattedStartDate)
    .lte('log_date', formattedEndDate);

  if (foodsError) throw foodsError;

  // Fetch daily routines
  const { data: routines, error: routinesError } = await supabase
    .from('daily_routines')
    .select('routine_date, workout_duration_minutes')
    .eq('user_id', userId)
    .gte('routine_date', formattedStartDate)
    .lte('routine_date', formattedEndDate);

  if (routinesError) throw routinesError;

  const numDaysInPeriod = differenceInDays(today, thirtyDaysAgo) + 1;

  let totalCaloriesSum = 0;
  let totalProteinSum = 0;
  (foodsLog as LoggedFood[]).forEach((log: LoggedFood) => { // Explicitly cast foodsLog
    if (log.foods) { // Adicionado verificação para foods
      totalCaloriesSum += calculateNutrient(log.foods.calories, log.foods.serving_size_grams, log.quantity_grams);
      totalProteinSum += calculateNutrient(log.foods.protein, log.foods.serving_size_grams, log.quantity_grams);
    }
  });

  let totalWorkoutDurationSum = 0;
  routines.forEach((routine: DailyRoutine) => {
    totalWorkoutDurationSum += routine.workout_duration_minutes || 0;
  });

  const avgCalories = numDaysInPeriod > 0 ? totalCaloriesSum / numDaysInPeriod : 0;
  const avgProtein = numDaysInPeriod > 0 ? totalProteinSum / numDaysInPeriod : 0;
  const avgWorkoutDuration = numDaysInPeriod > 0 ? totalWorkoutDurationSum / numDaysInPeriod : 0;

  return {
    avgCalories,
    avgProtein,
    avgWorkoutDuration,
    targetCalories,
  };
};

export const useHomeSummaryData = () => {
  const { user } = useAuth();

  return useQuery<HomeSummaryData, Error>({
    queryKey: ['homeSummaryData', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve({ avgCalories: 0, avgProtein: 0, avgWorkoutDuration: 0, targetCalories: 0 });
      return fetchHomeSummaryData(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};