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

      // 1. Upsert into goal_progress_history
      const { error: historyError } = await supabase
        .from('goal_progress_history')
        .upsert({
          user_id: userId,
          goal_id: goal.id,
          recorded_date: formattedDate,
          value: value,
        }, { onConflict: 'goal_id, recorded_date' });

      if (historyError) throw historyError;

      // 2. Update current_value in user_goals if this is the latest entry or if it's the only entry
      // We need to fetch the latest entry to decide if user_goals.current_value should be updated
      const { data: latestHistoryEntry, error: latestHistoryError } = await supabase
        .from('goal_progress_history')
        .select('value, recorded_date')
        .eq('goal_id', goal.id)
        .order('recorded_date', { ascending: false })
        .limit(1)
        .single();

      if (latestHistoryError && latestHistoryError.code !== 'PGRST116') {
        throw latestHistoryError;
      }

      let newGoalCurrentValue = goal.current_value;
      let newIsCompleted = goal.is_completed;

      if (latestHistoryEntry) {
        newGoalCurrentValue = latestHistoryEntry.value;
        if (goal.target_value !== null && goal.target_value !== undefined) {
          newIsCompleted = latestHistoryEntry.value >= goal.target_value;
        }
      } else {
        // If no history entries, revert to initial goal current_value or 0
        newGoalCurrentValue = 0; // Or whatever default makes sense
        newIsCompleted = false;
      }

      const { error: updateGoalError } = await supabase
        .from('user_goals')
        .update({
          current_value: newGoalCurrentValue,
          is_completed: newIsCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goal.id);

      if (updateGoalError) throw updateGoalError;
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