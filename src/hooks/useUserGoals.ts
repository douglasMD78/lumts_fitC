"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { parseISO } from 'date-fns';

interface UserGoal {
  id: string;
  goal_name: string;
  goal_type: string;
  target_value?: number | null;
  target_unit?: string | null;
  target_description?: string | null;
  current_value: number;
  start_date: Date;
  end_date?: Date | null;
  is_completed: boolean;
  created_at: string;
}

const fetchUserGoals = async (userId: string, activeOnly: boolean = false): Promise<UserGoal[]> => {
  let query = supabase
    .from('user_goals')
    .select(`
      id,
      goal_name,
      goal_type,
      target_value,
      target_unit,
      target_description,
      current_value,
      start_date,
      end_date,
      is_completed,
      created_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (activeOnly) {
    query = query.eq('is_completed', false);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((goal: any) => ({
    ...goal,
    start_date: parseISO(goal.start_date),
    end_date: goal.end_date ? parseISO(goal.end_date) : null,
  }));
};

export const useUserGoals = (activeOnly: boolean = false) => {
  const { user } = useAuth();

  return useQuery<UserGoal[], Error>({
    queryKey: ['userGoals', user?.id, activeOnly ? 'active' : 'all'],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchUserGoals(user.id, activeOnly);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};