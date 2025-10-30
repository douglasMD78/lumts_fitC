"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface JoinChallengeVariables {
  userId: string;
  challengeId: string;
}

export const useJoinChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, JoinChallengeVariables>({
    mutationFn: async ({ userId, challengeId }) => {
      const { error } = await supabase.rpc('fn_join_challenge', {
        p_user_id: userId,
        p_challenge_id: challengeId,
      });

      if (error) {
        if (error.code === '23505') { // Unique violation, user already joined
          throw new Error('Você já está participando deste desafio!');
        }
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      showSuccess('Você se juntou ao desafio com sucesso! 🎉');
      queryClient.invalidateQueries({ queryKey: ['challenges', variables.userId] }); // Invalida o cache de desafios para atualizar o status
    },
    onError: (error) => {
      showError('Erro ao participar do desafio: ' + error.message);
    },
  });
};