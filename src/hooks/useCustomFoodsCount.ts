"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const fetchCustomFoodsCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('foods')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('source', 'user_custom');

  if (error) {
    throw new Error(error.message);
  }
  return count || 0;
};

export const useCustomFoodsCount = () => {
  const { user } = useAuth();

  return useQuery<number, Error>({
    queryKey: ['customFoodsCount', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve(0);
      return fetchCustomFoodsCount(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};