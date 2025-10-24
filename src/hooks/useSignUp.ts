"use client";

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { AuthApiError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface SignUpVariables {
  email: string;
  password: string;
}

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation<void, Error, SignUpVariables>({
    mutationFn: async ({ email, password }) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Conta criada com sucesso! Por favor, verifique seu email para confirmar sua conta antes de fazer login. 📧');
      navigate('/login');
    },
    onError: (error) => {
      let errorMessage = error.message;
      if (error instanceof AuthApiError) {
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este e-mail já está cadastrado. Tente fazer login ou recuperar sua senha.';
        } else if (error.message.includes('Password should be at least 6 characters')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        }
      }
      showError(errorMessage);
    },
  });
};