"use client";

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      showSuccess('Você saiu com sucesso! Até a próxima! 👋');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] }); // Invalida o cache do perfil
      navigate('/'); // Redireciona para a página inicial após o logout
    } catch (error: any) {
      showError('Erro ao sair da conta: ' + error.message);
    }
  }, [queryClient, navigate]);

  return logout;
};