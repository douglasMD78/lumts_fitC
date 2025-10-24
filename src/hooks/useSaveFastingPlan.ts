"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface SaveFastingPlanVariables {
  userId: string;
  lastMealTime: string;
  fastingDurationHours: number;
  fastingWindowEnd: string;
  eatingWindowStart: string;
  eatingWindowEnd: string;
}

export const useSaveFastingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveFastingPlanVariables>({
    mutationFn: async (data) => {
      const { error } = await supabase.from('fasting_plans').insert({
        user_id: data.userId,
        last_meal_time: data.lastMealTime,
        fasting_duration_hours: data.fastingDurationHours,
        fasting_window_end: data.fastingWindowEnd,
        eating_window_start: data.eatingWindowStart,
        eating_window_end: data.eatingWindowEnd,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      showSuccess("Seu plano de jejum foi salvo com sucesso! 🎉");
      queryClient.invalidateQueries({ queryKey: ['userFastingPlans', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['latestFastingPlan', variables.userId] });
    },
    onError: (error) => {
      showError("Erro ao salvar o plano: " + error.message);
    },
  });
};