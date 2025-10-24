"use client";

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

interface UpdatePasswordVariables {
  password: string;
}

export const useUpdatePassword = () => {
  const navigate = useNavigate();

  return useMutation<void, Error, UpdatePasswordVariables>({
    mutationFn: async ({ password }) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Sua senha foi atualizada com sucesso! 🎉');
      navigate('/login');
    },
    onError: (error) => {
      showError('Erro ao atualizar senha: ' + error.message);
    },
  });
};