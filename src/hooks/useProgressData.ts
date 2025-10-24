"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { calculateNutrient } from '@/utils/nutritionHelpers';
import { useLatestMacroPlan } from './useLatestMacroPlan'; // Importado
import { useUserGoals } from './useUserGoals'; // Importado
import { Food } from './useSearchFoods'; // Importado

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

interface UserGoal {
  id: string;
  goal_name: string;
  goal_type: string;
  target_value?: number | null;
  target_unit?: string | null;
  target_description?: string | null;
  current_value: number;
  start_date: Date;
  end_date?: Date | null;
  is_completed: boolean;
  created_at: string;
}

interface MacroPlan {
  target_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
}

interface ProgressData {
  macroData: any[];
  activityData: any[];
  avgCalories: number;
  avgProtein: number;
  avgWorkoutDuration: number;
  topGoalForStory?: {
    name: string;
    progress: number;
    isCompleted: boolean;
  };
}

const calculateProgressPercentage = (current: number, target: number) => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

const fetchProgressData = async (
  userId: string,
  startDate: Date,
  endDate: Date,
  macroPlan: MacroPlan | null,
  allUserGoals: UserGoal[] | undefined
): Promise<ProgressData> => {
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  // Fetch logged foods for the period
  const { data: foodsLog, error: foodsError } = await supabase
    .from('logged_foods')
    .select(`
      log_date,
      quantity_grams,
      meal_type,
      selected_unit,
      selected_quantity,
      foods (id, name, calories, protein, carbs, fat, serving_size_grams, common_servings)
    `)
    .eq('user_id', userId)
    .gte('log_date', formattedStartDate)
    .lte('log_date', formattedEndDate)
    .order('log_date', { ascending: true });

  if (foodsError) throw foodsError;

  // Fetch daily routines for the period
  const { data: routines, error: routinesError } = await supabase
    .from('daily_routines')
    .select('routine_date, workout_duration_minutes, cardio_distance_km, sleep_hours')
    .eq('user_id', userId)
    .gte('routine_date', formattedStartDate)
    .lte('routine_date', formattedEndDate)
    .order('routine_date', { ascending: true });

  if (routinesError) throw routinesError;

  // Process Macro Data
  const dailyMacroSummary: { [key: string]: { calories: number; protein: number; carbs: number; fat: number } } = {};
  (foodsLog as LoggedFood[]).forEach((log: LoggedFood) => { // Explicitly cast foodsLog
    const date = log.log_date;
    if (!dailyMacroSummary[date]) {
      dailyMacroSummary[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    if (log.foods) { // Adicionado verificação para foods
      dailyMacroSummary[date].calories += calculateNutrient(log.foods.calories, log.foods.serving_size_grams, log.quantity_grams);
      dailyMacroSummary[date].protein += calculateNutrient(log.foods.protein, log.foods.serving_size_grams, log.quantity_grams);
      dailyMacroSummary[date].carbs += calculateNutrient(log.foods.carbs, log.foods.serving_size_grams, log.quantity_grams);
      dailyMacroSummary[date].fat += calculateNutrient(log.foods.fat, log.foods.serving_size_grams, log.quantity_grams);
    }
  });

  const processedMacroData = Object.keys(dailyMacroSummary).map(date => ({
    date: format(parseISO(date), 'dd/MM', { locale: ptBR }),
    calories: Math.round(dailyMacroSummary[date].calories),
    protein: Math.round(dailyMacroSummary[date].protein),
    carbs: Math.round(dailyMacroSummary[date].carbs),
    fat: Math.round(dailyMacroSummary[date].fat),
    targetCalories: macroPlan?.target_calories || 0,
    targetProtein: macroPlan?.protein_grams || 0,
    targetCarbs: macroPlan?.carbs_grams || 0,
    targetFat: macroPlan?.fat_grams || 0,
  }));

  // Process Activity Data
  const dailyActivitySummary: { [key: string]: { workoutDuration: number; cardioDistance: number; sleepHours: number } } = {};
  routines.forEach((routine: DailyRoutine) => {
    const date = routine.routine_date;
    if (!dailyActivitySummary[date]) {
      dailyActivitySummary[date] = { workoutDuration: 0, cardioDistance: 0, sleepHours: 0 };
    }
    dailyActivitySummary[date].workoutDuration += routine.workout_duration_minutes || 0;
    dailyActivitySummary[date].cardioDistance += routine.cardio_distance_km || 0;
    dailyActivitySummary[date].sleepHours = routine.sleep_hours || 0;
  });

  const processedActivityData = Object.keys(dailyActivitySummary).map(date => ({
    date: format(parseISO(date), 'dd/MM', { locale: ptBR }),
    workoutDuration: dailyActivitySummary[date].workoutDuration,
    cardioDistance: dailyActivitySummary[date].cardioDistance,
    sleepHours: dailyActivitySummary[date].sleepHours,
  }));

  // Calculate Averages for Shareable Story
  const numDaysInPeriod = differenceInDays(endDate, startDate) + 1;
  const totalCaloriesSum = processedMacroData.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProteinSum = processedMacroData.reduce((sum, entry) => sum + entry.protein, 0);
  const totalWorkoutDurationSum = processedActivityData.reduce((sum, entry) => sum + entry.workoutDuration, 0);

  const avgCalories = numDaysInPeriod > 0 ? totalCaloriesSum / numDaysInPeriod : 0;
  const avgProtein = numDaysInPeriod > 0 ? totalProteinSum / numDaysInPeriod : 0;
  const avgWorkoutDuration = numDaysInPeriod > 0 ? totalWorkoutDurationSum / numDaysInPeriod : 0;

  // Set top goal for story
  let topGoalForStory = undefined;
  if (allUserGoals && allUserGoals.length > 0) {
    const firstActiveGoal = allUserGoals.find(g => !g.is_completed && g.goal_type !== 'other');
    if (firstActiveGoal) {
      const progressPercentage = calculateProgressPercentage(firstActiveGoal.current_value, firstActiveGoal.target_value || 0);
      topGoalForStory = {
        name: firstActiveGoal.goal_name,
        progress: progressPercentage,
        isCompleted: firstActiveGoal.is_completed,
      };
    }
  }

  return {
    macroData: processedMacroData,
    activityData: processedActivityData,
    avgCalories,
    avgProtein,
    avgWorkoutDuration,
    topGoalForStory,
  };
};

export const useProgressData = (startDate: Date, endDate: Date) => {
  const { user } = useAuth();
  const { data: macroPlan, isLoading: loadingMacroPlan } = useLatestMacroPlan(); // Importado
  const { data: allUserGoals, isLoading: loadingAllGoals } = useUserGoals(false); // Importado

  return useQuery<ProgressData, Error>({
    queryKey: ['progressData', user?.id, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: () => {
      if (!user || !macroPlan || !allUserGoals) {
        // Return a default empty state or throw an error if data is essential
        return Promise.resolve({
          macroData: [],
          activityData: [],
          avgCalories: 0,
          avgProtein: 0,
          avgWorkoutDuration: 0,
          topGoalForStory: undefined,
        });
      }
      return fetchProgressData(user.id, startDate, endDate, macroPlan, allUserGoals);
    },
    enabled: !!user && !!macroPlan && !!allUserGoals && !loadingMacroPlan && !loadingAllGoals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};