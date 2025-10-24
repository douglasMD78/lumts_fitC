"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

interface ProposeChallengeVariables {
  userId: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  rewards: string | null;
}

export const useProposeChallenge = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<void, Error, ProposeChallengeVariables>({
    mutationFn: async (data) => {
      const { error } = await supabase.from('challenges').insert({
        user_id: data.userId,
        title: data.title,
        description: data.description,
        duration: data.duration,
        difficulty: data.difficulty,
        rewards: data.rewards || null,
        participants: 0,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Desafio proposto com sucesso! Ele será revisado em breve. 🎉');
      queryClient.invalidateQueries({ queryKey: ['challenges'] }); // Invalida o cache de desafios
      navigate('/comunidade');
    },
    onError: (error) => {
      showError('Erro ao propor desafio: ' + error.message);
    },
  });
};