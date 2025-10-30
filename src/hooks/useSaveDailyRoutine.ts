"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

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

interface SaveDailyRoutineVariables {
  userId: string;
  selectedDate: Date;
  routineData: Partial<DailyRoutinePayload>;
  existingRoutineId?: string;
}

export const useSaveDailyRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveDailyRoutineVariables>({
    mutationFn: async ({ userId, selectedDate, routineData, existingRoutineId }) => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const { error } = await supabase.rpc('fn_save_routine_and_update_goals', {
        p_user_id: userId,
        p_routine_date: formattedDate,
        p_workout_type: routineData.workout_type || null,
        p_workout_duration_minutes: routineData.workout_duration_minutes || null,
        p_workout_intensity: routineData.workout_intensity || null,
        p_cardio_type: routineData.cardio_type || null,
        p_cardio_duration_minutes: routineData.cardio_duration_minutes || null,
        p_cardio_distance_km: routineData.cardio_distance_km || null,
        p_diet_notes: routineData.diet_notes || null,
        p_mood_level: routineData.mood_level || null,
        p_sleep_hours: routineData.sleep_hours || null,
        p_general_notes: routineData.general_notes || null,
        p_existing_routine_id: existingRoutineId || null,
      });

      if (error) {
        throw error;
      }
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