"use client";

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface ForgotPasswordVariables {
  email: string;
}

export const useForgotPassword = () => {
  return useMutation<void, Error, ForgotPasswordVariables>({
    mutationFn: async ({ email }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Se um usuário com este e-mail existir, um link de redefinição de senha foi enviado para ele. Verifique sua caixa de entrada (e spam)! 📧');
    },
    onError: (error) => {
      showError('Erro ao enviar e-mail de recuperação: ' + error.message);
    },
  });
};