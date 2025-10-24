"use client";

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { AuthApiError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface LoginVariables {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<void, Error, LoginVariables>({
    mutationFn: async ({ email, password }) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Login realizado com sucesso! Bem-vinda de volta! 💕');
      navigate('/');
    },
    onError: (error) => {
      let errorMessage = error.message;
      if (error instanceof AuthApiError) {
        if (error.status === 400 && error.message.includes('Email not confirmed')) {
          errorMessage = 'Seu e-mail ainda não foi confirmado. Por favor, verifique sua caixa de entrada ou clique em "Reenviar Confirmação".';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'E-mail ou senha incorretos.';
        }
      }
      showError(errorMessage);
    },
  });
};