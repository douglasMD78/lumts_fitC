"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format, parseISO, isSameDay } from 'date-fns';

interface DailyRoutinePayload {
  user_id: string;
  routine_date: string;
  workout_type: string | null;
  workout_duration_minutes: number | null;
  workout_intensity: string | null;
  cardio_type: string | null;
  cardio_duration_minutes: number | null;
  cardio_distance_km: number | null;
  diet_notes: string | null;
  mood_level: string | null;
  sleep_hours: number | null;
  general_notes: string | null;
}

interface UserGoal {
  id: string;
  goal_name: string;
  goal_type: string;
  target_value?: number | null;
  target_unit?: string | null;
  current_value: number;
  start_date: Date;
  end_date?: Date | null;
  is_completed: boolean;
}

interface SaveDailyRoutineVariables {
  userId: string;
  selectedDate: Date;
  routineData: Partial<DailyRoutinePayload>;
  existingRoutineId?: string;
  userGoals: UserGoal[]; // Pass active goals to the mutation
}

export const useSaveDailyRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveDailyRoutineVariables>({
    mutationFn: async ({ userId, selectedDate, routineData, existingRoutineId, userGoals }) => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const payload = {
        ...routineData,
        user_id: userId,
        routine_date: formattedDate,
      };

      if (existingRoutineId) {
        const { error } = await supabase.from('daily_routines').update(payload).eq('id', existingRoutineId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('daily_routines').insert(payload);
        if (error) throw error;
      }

      // --- Automatic Goal Update Logic ---
      if (userGoals) {
        for (const goal of userGoals) {
          let newValue: number | null = null;
          let shouldUpdate = false;

          if (goal.goal_type !== 'other' && goal.target_value !== null && goal.target_value !== undefined) {
            const goalStartDate = parseISO(goal.start_date.toString());
            const goalEndDate = goal.end_date ? parseISO(goal.end_date.toString()) : null;

            if (isSameDay(selectedDate, goalStartDate) || (selectedDate > goalStartDate && (!goalEndDate || selectedDate <= goalEndDate))) {
              if (goal.goal_type === 'sleep_duration') {
                if (routineData.sleep_hours !== null && routineData.sleep_hours !== undefined) {
                  newValue = routineData.sleep_hours;
                  shouldUpdate = true;
                }
              } else if (['workout_duration', 'cardio_distance'].includes(goal.goal_type)) {
                const { data: allRoutinesForGoal, error: routinesForGoalError } = await supabase
                  .from('daily_routines')
                  .select(goal.goal_type === 'workout_duration' ? 'workout_duration_minutes' : 'cardio_distance_km')
                  .eq('user_id', userId)
                  .gte('routine_date', format(goalStartDate, 'yyyy-MM-dd'))
                  .lte('routine_date', goalEndDate ? format(goalEndDate, 'yyyy-MM-dd') : formattedDate);

                if (routinesForGoalError) {
                  console.error(`Error fetching routines for goal ${goal.id}:`, routinesForGoalError.message);
                  showError(`Erro ao recalcular meta "${goal.goal_name}".`);
                  continue;
                }

                let cumulativeSum = 0;
                if (allRoutinesForGoal) {
                  allRoutinesForGoal.forEach(r => {
                    if (goal.goal_type === 'workout_duration' && (r as { workout_duration_minutes: number | null }).workout_duration_minutes !== null) {
                      cumulativeSum += (r as { workout_duration_minutes: number | null }).workout_duration_minutes!;
                    } else if (goal.goal_type === 'cardio_distance' && (r as { cardio_distance_km: number | null }).cardio_distance_km !== null) {
                      cumulativeSum += (r as { cardio_distance_km: number | null }).cardio_distance_km!;
                    }
                  });
                }
                newValue = cumulativeSum;
                shouldUpdate = true;
              }
            }
          }

          if (shouldUpdate && newValue !== null) {
            const isCompleted = newValue >= (goal.target_value || 0);
            
            const { error: historyError } = await supabase
              .from('goal_progress_history')
              .upsert({
                user_id: userId,
                goal_id: goal.id,
                recorded_date: formattedDate,
                value: newValue,
              }, { onConflict: 'goal_id, recorded_date' });

            if (historyError) {
              console.error("Erro ao salvar histórico de progresso inicial:", historyError.message);
              showError("Rotina salva, mas houve um erro ao registrar o progresso da meta.");
            }

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
            }

            const { error: updateGoalError } = await supabase
              .from('user_goals')
              .update({ current_value: newGoalCurrentValue, is_completed: newIsCompleted, updated_at: new Date().toISOString() })
              .eq('id', goal.id);

            if (updateGoalError) {
              console.error(`Erro ao atualizar meta ${goal.goal_name}:`, updateGoalError.message);
              showError(`Erro ao atualizar meta "${goal.goal_name}".`);
            } else if (newIsCompleted && !goal.is_completed) {
              showSuccess(`Meta "${goal.goal_name}" concluída! 🎉`);
            }
          }
        }
      }
      // --- End Automatic Goal Update Logic ---
    },
    onSuccess: (data, variables) => {
      showSuccess(variables.existingRoutineId ? 'Rotina atualizada com sucesso! ✨' : 'Rotina salva com sucesso! 🎉');
      queryClient.invalidateQueries({ queryKey: ['dailyRoutine', variables.userId, format(variables.selectedDate, 'yyyy-MM-dd')] });
      queryClient.invalidateQueries({ queryKey: ['userGoals', variables.userId, 'active'] }); // Invalidate active goals
      queryClient.invalidateQueries({ queryKey: ['userGoals', variables.userId, 'all'] }); // Invalidate all goals
      queryClient.invalidateQueries({ queryKey: ['dailyRoutinesForDateRange', variables.userId] }); // Invalidate for overview/progress
    },
    onError: (error) => {
      showError('Erro ao salvar rotina: ' + error.message);
    },
  });
};