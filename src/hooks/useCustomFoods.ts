"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CommonServing {
  unit: string;
  grams: number;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size_grams: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  cholesterol: number | null;
  saturated_fat: number | null;
  trans_fat: number | null;
  calcium: number | null;
  iron: number | null;
  vitamin_a: number | null;
  vitamin_c: number | null;
  category: string | null;
  source: string;
  external_id: string | null;
  common_servings: CommonServing[] | null;
  user_id: string | null; // Adicionado para consistência
}

const fetchCustomFoods = async (userId: string): Promise<Food[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('user_id', userId)
    .eq('source', 'user_custom')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
};

export const useCustomFoods = (userId: string | undefined) => {
  const { user } = useAuth();

  return useQuery<Food[], Error>({
    queryKey: ['customFoods', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchCustomFoods(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};