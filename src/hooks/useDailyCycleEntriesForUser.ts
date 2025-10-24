"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DailyEntry {
  id: string;
  entry_date: string;
  energy_level: string | null;
  strength_level: string | null;
  notes: string | null;
  sleep_quality: string | null;
  stress_level: string | null;
  workout_intensity: string | null;
}

const fetchDailyCycleEntriesForUser = async (userId: string): Promise<DailyEntry[]> => {
  const { data, error } = await supabase.from('daily_cycle_entries').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data || [];
};

export const useDailyCycleEntriesForUser = () => {
  const { user } = useAuth();

  return useQuery<DailyEntry[], Error>({
    queryKey: ['dailyCycleEntries', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchDailyCycleEntriesForUser(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minuto
  });
};