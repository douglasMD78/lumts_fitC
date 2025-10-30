"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast'; // Importar showError

const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, age, weight, height, avatar_url, role')
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
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      showError('Erro ao carregar perfil do usuário: ' + error.message);
    },
  });
};