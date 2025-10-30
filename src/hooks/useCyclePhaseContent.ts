"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CyclePhase } from '@/utils/cycleCalculations';

export interface CyclePhaseContent {
  phase_name: CyclePhase;
  energy_title: string;
  energy_description: string;
  workout_title: string;
  workout_description: string;
  body_title: string;
  body_description: string;
  cravings_title: string;
  cravings_description: string;
  color: string; // Tailwind class for card background
  progress_color: string; // Tailwind class for progress bar
}

const fetchCyclePhaseContent = async (phaseName: CyclePhase): Promise<CyclePhaseContent | null> => {
  const { data, error } = await supabase
    .from('cycle_phase_content')
    .select('*')
    .eq('phase_name', phaseName)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }
  return data || null;
};

export const useCyclePhaseContent = (phaseName: CyclePhase | null) => {
  return useQuery<CyclePhaseContent | null, Error>({
    queryKey: ['cyclePhaseContent', phaseName],
    queryFn: () => {
      if (!phaseName) return Promise.resolve(null);
      return fetchCyclePhaseContent(phaseName);
    },
    enabled: !!phaseName,
    staleTime: Infinity, // Static content, can be cached indefinitely
  });
};