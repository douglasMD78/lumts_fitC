"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FastingPlan {
  id: string;
  last_meal_time: string;
  fasting_duration_hours: number;
  fasting_window_end: string;
  eating_window_start: string;
  eating_window_end: string;
  created_at: string;
}

const fetchLatestFastingPlan = async (userId: string): Promise<FastingPlan | null> => {
  const { data, error } = await supabase
    .from('fasting_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }
  return data || null;
};

export const useLatestFastingPlan = () => {
  const { user } = useAuth();

  return useQuery<FastingPlan | null, Error>({
    queryKey: ['latestFastingPlan', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve(null);
      return fetchLatestFastingPlan(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};