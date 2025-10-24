"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface SaveMenstrualCycleConfigVariables {
  userId: string;
  lastPeriodStartDate: Date;
  cycleLength: number;
  menstrualLength: number;
}

export const useSaveMenstrualCycleConfig = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<void, Error, SaveMenstrualCycleConfigVariables>({
    mutationFn: async (data) => {
      const { error } = await supabase.from('menstrual_cycles').insert({
        user_id: data.userId,
        start_date: format(data.lastPeriodStartDate, 'yyyy-MM-dd'),
        cycle_length: data.cycleLength,
        menstrual_length: data.menstrualLength,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Configurações salvas! Redirecionando para seu status diário.");
      queryClient.invalidateQueries({ queryKey: ['latestMenstrualCycle'] }); // Invalida o cache do último ciclo
      navigate('/rastreador-ciclo/hoje');
    },
    onError: (error) => {
      showError("Erro ao salvar configurações: " + error.message);
    },
  });
};