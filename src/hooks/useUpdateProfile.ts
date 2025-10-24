"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface ProfileUpdateData {
  first_name: string;
  last_name: string;
  age: number | null;
  weight: number | null;
  height: number | null;
}

export const useUpdateProfile = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProfileUpdateData>({
    mutationFn: async (profileData) => {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          age: profileData.age,
          weight: profileData.weight,
          height: profileData.height,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      showSuccess('Perfil atualizado com sucesso! 💕');
    },
    onError: (error) => {
      showError('Erro ao atualizar perfil: ' + error.message);
    },
  });
};