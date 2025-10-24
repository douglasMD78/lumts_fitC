"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

interface DailyEntryPayload {
  user_id: string;
  cycle_id: string;
  entry_date: string;
  energy_level: string | null;
  strength_level: string | null;
  notes: string | null;
  sleep_quality: string | null;
  stress_level: string | null;
  workout_intensity: string | null;
}

interface SaveDailyEntryVariables {
  userId: string;
  cycleId: string;
  selectedDate: Date;
  entryData: Partial<DailyEntryPayload>;
  existingEntryId?: string;
}

export const useSaveDailyCycleEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveDailyEntryVariables>({
    mutationFn: async ({ userId, cycleId, selectedDate, entryData, existingEntryId }) => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const payload = {
        ...entryData,
        user_id: userId,
        cycle_id: cycleId,
        entry_date: formattedDate,
      };

      if (existingEntryId) {
        const { error } = await supabase.from('daily_cycle_entries').update(payload).eq('id', existingEntryId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('daily_cycle_entries').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: (data, variables) => {
      showSuccess(variables.existingEntryId ? 'Registro atualizado!' : 'Registro salvo!');
      queryClient.invalidateQueries({ queryKey: ['dailyCycleEntries', variables.userId] });
    },
    onError: (error) => {
      showError('Erro ao salvar registro: ' + error.message);
    },
  });
};