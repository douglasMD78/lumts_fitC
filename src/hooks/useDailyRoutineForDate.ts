"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { showError } from '@/utils/toast'; // Importar showError

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

const fetchDailyRoutineForDate = async (userId: string, date: Date): Promise<DailyRoutine | null> => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const { data, error } = await supabase
    .from('daily_routines')
    .select('*')
    .eq('user_id', userId)
    .eq('routine_date', formattedDate)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }
  return data || null;
};

export const useDailyRoutineForDate = (date: Date) => {
  const { user } = useAuth();

  return useQuery<DailyRoutine | null, Error>({
    queryKey: ['dailyRoutine', user?.id, format(date, 'yyyy-MM-dd')],
    queryFn: () => {
      if (!user) return Promise.resolve(null);
      return fetchDailyRoutineForDate(user.id, date);
    },
    enabled: !!user,
    staleTime: 1000 * 60,
    onError: (error) => {
      showError('Erro ao carregar rotina diária: ' + error.message);
    },
  });
};