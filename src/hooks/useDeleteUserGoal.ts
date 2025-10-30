"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface DeleteUserGoalVariables {
  userId: string;
  goalId: string;
  goalName: string;
}

export const useDeleteUserGoal = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteUserGoalVariables>({
    mutationFn: async ({ userId, goalId }) => {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => { // 'data' is the result of mutation, 'variables' is the input
      showSuccess(`Meta "${variables.goalName}" deletada com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['userGoals', variables.userId] }); // Invalidate all user goals
      queryClient.invalidateQueries({ queryKey: ['userGoals', variables.userId, 'active'] }); // Invalidate active goals
    },
    onError: (error) => {
      showError('Erro ao deletar meta: ' + error.message);
    },
  });
};