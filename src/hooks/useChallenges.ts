"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  rewards: string | null;
  duration: string | null;
  difficulty: string | null;
  created_at: string;
  isJoined?: boolean;
}

const fetchChallenges = async (userId: string | undefined): Promise<Challenge[]> => {
  const { data: challengesData, error: challengesError } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false });

  if (challengesError) {
    throw new Error(challengesError.message);
  }

  let userChallenges: { challenge_id: string }[] = [];
  if (userId) {
    const { data: userChallengesData, error: userChallengesError } = await supabase
      .from('user_challenges')
      .select('challenge_id')
      .eq('user_id', userId);

    if (userChallengesError) {
      console.error('Erro ao carregar desafios do usuário:', userChallengesError.message);
      // Não lançar erro aqui para não bloquear a exibição dos desafios públicos
    } else {
      userChallenges = userChallengesData || [];
    }
  }

  const challengesWithJoinStatus = challengesData.map((challenge: Challenge) => ({
    ...challenge,
    isJoined: userChallenges.some(uc => uc.challenge_id === challenge.id)
  }));

  return challengesWithJoinStatus || [];
};

export const useChallenges = () => {
  const { user } = useAuth();

  return useQuery<Challenge[], Error, Challenge[], (string | undefined)[]>({
    queryKey: ['challenges', user?.id],
    queryFn: () => fetchChallenges(user?.id),
    enabled: true,
    staleTime: 1000 * 60 * 5,
    // onError: (error: Error) => { // Removido conforme a nova API do TanStack Query v5
    //   showError('Erro ao carregar desafios: ' + error.message);
    // },
  });
};