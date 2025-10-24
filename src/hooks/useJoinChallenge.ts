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
      // 1. Inserir na tabela user_challenges
      const { error: insertError } = await supabase
        .from('user_challenges')
        .insert({ user_id: userId, challenge_id: challengeId });

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation, user already joined
          throw new Error('Você já está participando deste desafio!');
        }
        throw insertError;
      }

      // 2. Atualizar o contador de participantes na tabela challenges
      const { data: currentChallenge, error: fetchError } = await supabase
        .from('challenges')
        .select('participants')
        .eq('id', challengeId)
        .single();

      if (fetchError) throw fetchError;

      const newParticipantsCount = (currentChallenge?.participants || 0) + 1;

      const { error: updateError } = await supabase
        .from('challenges')
        .update({ participants: newParticipantsCount })
        .eq('id', challengeId);

      if (updateError) throw updateError;
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