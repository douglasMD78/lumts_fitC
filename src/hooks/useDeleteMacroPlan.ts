"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface DeleteMacroPlanVariables {
  userId: string;
  planId: string;
}

export const useDeleteMacroPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteMacroPlanVariables>({
    mutationFn: async ({ userId, planId }) => {
      const { error } = await supabase
        .from('macro_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_data, variables) => { // 'data' is the result of mutation, 'variables' is the input
      showSuccess('Plano de macros deletado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['userMacroPlans', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['latestMacroPlan', variables.userId] }); // Invalidate latest macro plan as well
    },
    onError: (error) => {
      showError('Erro ao deletar o plano: ' + error.message);
    },
  });
};