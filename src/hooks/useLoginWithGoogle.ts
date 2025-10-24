"use client";

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

export const useLoginWithGoogle = () => {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/overview', // Redireciona de volta para o overview após o login
        },
      });
      if (error) {
        throw error;
      }
    },
    onError: (error) => {
      showError('Erro ao fazer login com Google: ' + error.message);
    },
  });
};