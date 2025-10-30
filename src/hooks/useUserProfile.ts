"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  avatar_url: string | null;
  role: string | null;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
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

  return useQuery<UserProfile | null, Error, UserProfile | null, (string | undefined)[]>({
    queryKey: ['userProfile', user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve(null);
      return fetchUserProfile(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    // onError: (error: Error) => { // Removido conforme a nova API do TanStack Query v5
    //   showError('Erro ao carregar perfil do usuário: ' + error.message);
    // },
  });
};