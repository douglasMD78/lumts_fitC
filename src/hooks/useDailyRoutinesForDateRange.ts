"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface DailyRoutine {
  id: string;
  routine_date: string;
  workout_type: string | null;
  workout_duration_minutes: number | null;
  workout_intensity: string | null;
  cardio_type: string | null;
  cardio_duration_minutes: number | null;
  cardio_distance_km: number | null;
  diet_notes: string | null;
  mood_level: string | null;
  sleep_hours: number | null;
  general_notes: string | null;
}

const fetchDailyRoutinesForDateRange = async (userId: string, startDate: Date, endDate: Date): Promise<DailyRoutine[]> => {
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('daily_routines')
    .select('*')
    .eq('user_id', userId)
    .gte('routine_date', formattedStartDate)
    .lte('routine_date', formattedEndDate)
    .order('routine_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export const useDailyRoutinesForDateRange = (startDate: Date, endDate: Date) => {
  const { user } = useAuth();

  return useQuery<DailyRoutine[], Error>({
    queryKey: ['dailyRoutinesForDateRange', user?.id, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchDailyRoutinesForDateRange(user.id, startDate, endDate);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};