"use client";

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';

interface MacroPlan {
  id: string;
  target_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  created_at: string;
}

const fetchLatestMacroPlan = async (userId: string): Promise<MacroPlan | null> => {
  const { data, error } = await supabase
    .from('macro_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    throw new Error(error.message);
  }
  return data || null;
};

export const useLatestMacroPlan = () => {
  const { user } = useAuth();

  return useQuery<MacroPlan | null, Error, MacroPlan | null, (string | undefined)[]>({
    queryKey: ['latestMacroPlan', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve(null);
      return fetchLatestMacroPlan(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    onError: (error: Error) => {
      showError('Erro ao carregar o último plano de macros: ' + error.message);
    },
  });
};