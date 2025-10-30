"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { parseISO } from 'date-fns';
import { showError } from '@/utils/toast'; // Importar showError

interface MenstrualCycle {
  id: string;
  start_date: Date;
  cycle_length: number;
  menstrual_length: number;
}

const fetchLatestMenstrualCycle = async (userId: string): Promise<MenstrualCycle | null> => {
  const { data, error } = await supabase
    .from('menstrual_cycles')
    .select('id, start_date, cycle_length, menstrual_length')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  if (data) {
    return {
      id: data.id,
      start_date: parseISO(data.start_date),
      cycle_length: data.cycle_length,
      menstrual_length: data.menstrual_length || 5,
    };
  }
  return null;
};

export const useLatestMenstrualCycle = () => {
  const { user } = useAuth();

  return useQuery({ // Updated syntax
    queryKey: ['latestMenstrualCycle', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve(null);
      return fetchLatestMenstrualCycle(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
    onError: (error: Error) => { // Updated error type
      showError('Erro ao carregar o último ciclo menstrual: ' + error.message);
    },
  });
};