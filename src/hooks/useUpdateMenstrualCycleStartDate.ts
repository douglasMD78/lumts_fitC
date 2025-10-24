"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format, isFuture } from 'date-fns';

interface UpdateMenstrualCycleStartDateVariables {
  cycleId: string;
  newStartDate: Date;
}

export const useUpdateMenstrualCycleStartDate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateMenstrualCycleStartDateVariables>({
    mutationFn: async ({ cycleId, newStartDate }) => {
      if (isFuture(newStartDate)) { // Fixed: Removed { unit: 'day' }
        throw new Error("A data de início do ciclo não pode ser no futuro.");
      }
      const { error } = await supabase
        .from('menstrual_cycles')
        .update({ start_date: format(newStartDate, 'yyyy-MM-dd') })
        .eq('id', cycleId);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Data do ciclo atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['latestMenstrualCycle'] });
      queryClient.invalidateQueries({ queryKey: ['dailyCycleEntries'] }); // Invalidate daily entries as cycle start affects them
    },
    onError: (error) => {
      showError("Erro ao atualizar data: " + error.message);
    },
  });
};