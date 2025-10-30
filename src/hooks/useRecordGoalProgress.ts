"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

interface UserGoal {
  id: string;
  goal_name: string;
  target_value?: number | null;
  target_unit?: string | null;
  current_value: number; // The latest value from user_goals
  is_completed: boolean;
}

interface RecordProgressVariables {
  userId: string;
  goal: UserGoal;
  value: number;
  recorded_date: Date;
}

export const useRecordGoalProgress = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RecordProgressVariables>({
    mutationFn: async ({ userId, goal, value, recorded_date }) => {
      const formattedDate = format(recorded_date, 'yyyy-MM-dd');

      const { error } = await supabase.rpc('fn_record_goal_progress', {
        p_user_id: userId,
        p_goal_id: goal.id,
        p_value: value,
        p_recorded_date: formattedDate,
      });

      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      showSuccess('Progresso registrado com sucesso! ✨');
      queryClient.invalidateQueries({ queryKey: ['userGoals', variables.userId] }); // Invalidate all user goals
      queryClient.invalidateQueries({ queryKey: ['userGoals', variables.userId, 'active'] }); // Invalidate active goals
      queryClient.invalidateQueries({ queryKey: ['goalProgressHistory', variables.goal.id] }); // Invalidate history for this goal
    },
    onError: (error) => {
      showError('Erro ao registrar progresso: ' + error.message);
    },
  });
};