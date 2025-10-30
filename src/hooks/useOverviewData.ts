"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { parseISO } from 'date-fns';
import { showError } from '@/utils/toast'; // Importar showError

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  avatar_url: string | null;
  role: string;
}

interface MacroPlan {
  id: string;
  target_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  created_at: string;
}

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

interface UserGoal {
  id: string;
  goal_name: string;
  goal_type: string;
  target_value?: number | null;
  target_unit?: string | null;
  target_description?: string | null;
  current_value: number;
  start_date: string; // Raw string from DB
  end_date?: string | null; // Raw string from DB
  is_completed: boolean;
  created_at: string;
}

interface MenstrualCycle {
  id: string;
  start_date: string; // Raw string from DB
  cycle_length: number;
  menstrual_length: number;
}

interface OverviewDataResponse {
  profile: ProfileData | null;
  latestMacroPlan: MacroPlan | null;
  dailyRoutineToday: DailyRoutine | null;
  activeGoals: UserGoal[] | null;
  latestMenstrualCycle: MenstrualCycle | null;
}

const fetchOverviewData = async (userId: string): Promise<OverviewDataResponse> => {
  const { data, error } = await supabase.rpc('fn_get_overview_data', { p_user_id: userId });

  if (error) {
    throw new Error(error.message);
  }

  // Parse dates for consistency with other hooks
  const parsedData: OverviewDataResponse = {
    profile: data?.profile || null,
    latestMacroPlan: data?.latestMacroPlan || null,
    dailyRoutineToday: data?.dailyRoutineToday || null,
    activeGoals: (data?.activeGoals || []).map((goal: UserGoal) => ({
      ...goal,
      start_date: parseISO(goal.start_date),
      end_date: goal.end_date ? parseISO(goal.end_date) : null,
    })),
    latestMenstrualCycle: data?.latestMenstrualCycle ? {
      ...data.latestMenstrualCycle,
      start_date: parseISO(data.latestMenstrualCycle.start_date),
    } : null,
  };

  return parsedData;
};

export const useOverviewData = () => {
  const { user } = useAuth();

  return useQuery<OverviewDataResponse, Error>({
    queryKey: ['overviewData', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve({
        profile: null,
        latestMacroPlan: null,
        dailyRoutineToday: null,
        activeGoals: null,
        latestMenstrualCycle: null,
      });
      return fetchOverviewData(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 1, // 1 minute
    onError: (error) => {
      showError('Erro ao carregar dados da visão geral: ' + error.message);
    },
  });
};