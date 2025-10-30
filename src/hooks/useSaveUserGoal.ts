"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

interface UserGoalPayload {
  id?: string;
  user_id: string;
  goal_name: string;
  goal_type: string;
  target_value?: number | null;
  target_unit?: string | null;
  target_description?: string | null;
  current_value: number;
  start_date: string; // formatted date string
  end_date?: string | null; // formatted date string
  is_completed: boolean;
}

interface SaveUserGoalVariables {
  userId: string;
  goalData: {
    id?: string;
    goal_name: string;
    goal_type: string;
    target_value?: number | null;
    target_unit?: string | null;
    target_description?: string | null;
    current_value?: number | null;
    start_date: Date;
    end_date?: Date | null;
    is_completed?: boolean;
  };
}

export const useSaveUserGoal = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveUserGoalVariables>({
    mutationFn: async ({ userId, goalData }) => {
      const payload: UserGoalPayload = {
        user_id: userId,
        goal_name: goalData.goal_name,
        goal_type: goalData.goal_type,
        target_value: goalData.goal_type !== 'other' ? (goalData.target_value ?? null) : null,
        target_unit: goalData.goal_type !== 'other' ? (goalData.target_unit ?? null) : null,
        target_description: goalData.goal_type === 'other' ? (goalData.target_description ?? null) : null,
        current_value: goalData.current_value ?? 0,
        start_date: format(goalData.start_date, 'yyyy-MM-dd'),
        end_date: goalData.end_date ? format(goalData.end_date, 'yyyy-MM-dd') : null,
        is_completed: goalData.goal_type !== 'other' && goalData.target_value !== null && goalData.target_value !== undefined
          ? (goalData.current_value ?? 0) >= goalData.target_value
          : (goalData.is_completed ?? false),
      };

      let savedGoalId: string | undefined;
      if (goalData.id) {
        // Update existing goal
        const { data: updatedData, error } = await supabase
          .from('user_goals')
          .update(payload)
          .eq('id', goalData.id)
          .select('id')
          .single();
        if (error) throw error;
        savedGoalId = updatedData.id;
      } else {
        // Insert new goal
        const { data: insertedData, error } = await supabase
          .from('user_goals')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        savedGoalId = insertedData.id;
      }

      // Record initial current_value in goal_progress_history if provided and not 'other'
      if (savedGoalId && goalData.current_value !== null && goalData.current_value !== undefined && goalData.goal_type !== 'other') {
        const { error: historyError } = await supabase
          .from('goal_progress_history')
          .upsert({
            user_id: userId,
            goal_id: savedGoalId,
            recorded_date: format(goalData.start_date, 'yyyy-MM-dd'), // Use start_date for initial entry
            value: goalData.current_value,
          }, { onConflict: 'goal_id, recorded_date' }); // Upsert to avoid duplicates

        if (historyError) {
          console.error("Erro ao salvar histórico de progresso inicial:", historyError.message);
          showError("Meta salva, mas houve um erro ao registrar o progresso inicial.");
        }
      }
    },
    onSuccess: (_data, variables) => { // 'data' is the result of mutation, 'variables' is the input
      showSuccess(variables.goalData.id ? 'Meta atualizada com sucesso! ✨' : 'Meta definida com sucesso! 🎉');
      queryClient.invalidateQueries({ queryKey: ['userGoals', variables.userId] }); // Invalidate all user goals
      queryClient.invalidateQueries({ queryKey: ['userGoals', variables.userId, 'active'] }); // Invalidate active goals
    },
    onError: (error) => {
      showError('Erro ao salvar meta: ' + error.message);
    },
  });
};