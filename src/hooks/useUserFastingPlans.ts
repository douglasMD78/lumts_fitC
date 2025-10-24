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

const fetchUserFastingPlans = async (userId: string): Promise<FastingPlan[]> => {
  const { data, error } = await supabase
    .from('fasting_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export const useUserFastingPlans = () => {
  const { user } = useAuth();

  return useQuery<FastingPlan[], Error>({
    queryKey: ['userFastingPlans', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchUserFastingPlans(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};