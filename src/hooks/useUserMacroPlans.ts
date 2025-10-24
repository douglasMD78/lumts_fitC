"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MacroPlan {
  id: string;
  target_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  created_at: string;
}

const fetchUserMacroPlans = async (userId: string): Promise<MacroPlan[]> => {
  const { data, error } = await supabase
    .from('macro_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export const useUserMacroPlans = () => {
  const { user } = useAuth();

  return useQuery<MacroPlan[], Error>({
    queryKey: ['userMacroPlans', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchUserMacroPlans(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};