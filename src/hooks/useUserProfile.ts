"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, age, weight, height, avatar_url, role') // Adicionado 'role'
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return data;
};

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => {
      if (!user) return null;
      return fetchUserProfile(user.id);
    },
    enabled: !!user, // A query só será executada se houver um usuário
    staleTime: 1000 * 60 * 5, // Considera os dados "frescos" por 5 minutos
  });
};