"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface DeleteFastingPlanVariables {
  userId: string;
  planId: string;
}

export const useDeleteFastingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteFastingPlanVariables>({
    mutationFn: async ({ userId, planId }) => {
      const { error } = await supabase
        .from('fasting_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      showSuccess('Plano de jejum deletado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['userFastingPlans', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['latestFastingPlan', variables.userId] }); // Invalidate latest fasting plan as well
    },
    onError: (error) => {
      showError('Erro ao deletar o plano: ' + error.message);
    },
  });
};