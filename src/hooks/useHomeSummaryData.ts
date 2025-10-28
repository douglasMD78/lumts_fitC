"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, differenceInDays } from 'date-fns';

interface DailyRoutine {
  routine_date: string;
  workout_duration_minutes: number | null;
  cardio_distance_km: number | null;
  sleep_hours: number | null;
}

interface HomeSummaryData {
  avgWorkoutDuration: number;
}

const fetchHomeSummaryData = async (userId: string): Promise<HomeSummaryData> => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const formattedStartDate = format(thirtyDaysAgo, 'yyyy-MM-dd');
  const formattedEndDate = format(today, 'yyyy-MM-dd');

  // Fetch daily routines
  const { data: routines, error: routinesError } = await supabase
    .from('daily_routines')
    .select('routine_date, workout_duration_minutes')
    .eq('user_id', userId)
    .gte('routine_date', formattedStartDate)
    .lte('routine_date', formattedEndDate);

  if (routinesError) throw routinesError;

  const numDaysInPeriod = differenceInDays(today, thirtyDaysAgo) + 1;

  let totalWorkoutDurationSum = 0;
  routines.forEach((routine: DailyRoutine) => {
    totalWorkoutDurationSum += routine.workout_duration_minutes || 0;
  });

  const avgWorkoutDuration = numDaysInPeriod > 0 ? totalWorkoutDurationSum / numDaysInPeriod : 0;

  return {
    avgWorkoutDuration,
  };
};

export const useHomeSummaryData = () => {
  const { user } = useAuth();

  return useQuery<HomeSummaryData, Error>({
    queryKey: ['homeSummaryData', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve({ avgWorkoutDuration: 0 });
      return fetchHomeSummaryData(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};