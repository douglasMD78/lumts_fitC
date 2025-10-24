"use client";

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface ResendConfirmationEmailVariables {
  email: string;
}

export const useResendConfirmationEmail = () => {
  return useMutation<void, Error, ResendConfirmationEmailVariables>({
    mutationFn: async ({ email }) => {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Novo e-mail de confirmação enviado! Verifique sua caixa de entrada. 📧');
    },
    onError: (error) => {
      showError('Erro ao reenviar e-mail de confirmação: ' + error.message);
    },
  });
};