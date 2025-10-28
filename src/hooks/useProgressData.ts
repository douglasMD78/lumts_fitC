"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLatestMacroPlan } from './useLatestMacroPlan';
import { useUserGoals } from './useUserGoals';

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
  activityData: any[];
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
  allUserGoals: UserGoal[] | undefined
): Promise<ProgressData> => {
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  // Fetch daily routines for the period
  const { data: routines, error: routinesError } = await supabase
    .from('daily_routines')
    .select('routine_date, workout_duration_minutes, cardio_distance_km, sleep_hours')
    .eq('user_id', userId)
    .gte('routine_date', formattedStartDate)
    .lte('routine_date', formattedEndDate)
    .order('routine_date', { ascending: true });

  if (routinesError) throw routinesError;

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
  const totalWorkoutDurationSum = processedActivityData.reduce((sum, entry) => sum + entry.workoutDuration, 0);

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
    activityData: processedActivityData,
    avgWorkoutDuration,
    topGoalForStory,
  };
};

export const useProgressData = (startDate: Date, endDate: Date) => {
  const { user } = useAuth();
  const { data: allUserGoals, isLoading: loadingAllGoals } = useUserGoals(false);

  return useQuery<ProgressData, Error>({
    queryKey: ['progressData', user?.id, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: () => {
      if (!user || !allUserGoals) {
        return Promise.resolve({
          activityData: [],
          avgWorkoutDuration: 0,
          topGoalForStory: undefined,
        });
      }
      return fetchProgressData(user.id, startDate, endDate, allUserGoals);
    },
    enabled: !!user && !!allUserGoals && !loadingAllGoals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};