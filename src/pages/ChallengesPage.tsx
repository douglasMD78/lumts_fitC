"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Trophy, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import LoginGate from '@/components/LoginGate';
import EmptyState from '@/components/EmptyState';

// Importar os novos hooks
import { useChallenges } from '@/hooks/useChallenges';
import { useJoinChallenge } from '@/hooks/useJoinChallenge';

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

const ChallengesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [joiningChallengeId, setJoiningChallengeId] = useState<string | null>(null);

  // Usar o hook de query para buscar desafios
  const { data: challenges, isLoading: loadingChallenges, error: fetchError } = useChallenges();
  const joinChallengeMutation = useJoinChallenge();

  useEffect(() => {
    if (fetchError) {
      showError('Erro ao carregar desafios: ' + fetchError.message);
    }
  }, [fetchError]);

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) return;

    setJoiningChallengeId(challengeId);
    try {
      await joinChallengeMutation.mutateAsync({ userId: user.id, challengeId });
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setJoiningChallengeId(null);
    }
  };

  if (authLoading || loadingChallenges) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando desafios...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Desafios <span className="text-pink-500">LumtsFit</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Participe de desafios comunitários para manter a motivação alta e celebrar conquistas juntas.
          </p>
        </div>

        {challenges && challenges.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="Nenhum desafio disponível"
            description="Volte em breve para novos desafios ou proponha o seu!"
            buttonText="Propor Desafio"
            buttonLink="/propor-desafio"
            iconColorClass="text-pink-500"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {challenges && challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-slate-800">{challenge.title}</h2>
                  {challenge.difficulty && (
                    <span className="bg-pink-100 text-pink-800 text-xs font-bold px-2 py-1 rounded-full">
                      {challenge.difficulty}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 mb-4 flex-grow">{challenge.description}</p>

                <div className="flex items-center text-sm text-slate-500 mb-2">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{challenge.participants} participantes</span>
                </div>

                {challenge.rewards && (
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span>{challenge.rewards}</span>
                  </div>
                )}

                {challenge.duration && (
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{challenge.duration}</span>
                    </div>
                  </div>
                )}

                <LoginGate
                  message="Você precisa de uma conta para participar dos desafios da comunidade."
                  featureName="Participar de Desafio"
                >
                  <Button
                    className="bg-pink-500 hover:bg-pink-600 w-full"
                    onClick={() => handleJoinChallenge(challenge.id)}
                    disabled={challenge.isJoined || joiningChallengeId === challenge.id || joinChallengeMutation.isPending}
                  >
                    {joiningChallengeId === challenge.id || joinChallengeMutation.isPending ? 'Entrando...' : challenge.isJoined ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" /> Participando
                      </>
                    ) : (
                      'Participar do Desafio'
                    )}
                  </Button>
                </LoginGate>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <Trophy className="h-16 w-16 text-pink-500 mx-auto" />
            </div>
            <div className="text-center md:text-left flex-grow">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Crie seu próprio desafio</h2>
              <p className="text-slate-600 mb-4">
                Tem uma ideia de desafio? Proponha para a comunidade e incentive outras mulheres a participarem!
              </p>
              <LoginGate
                message="Você precisa de uma conta para propor um desafio à comunidade."
                featureName="Propor Desafio"
              >
                <Button asChild variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
                  <Link to="/propor-desafio">Propor Desafio</Link>
                </Button>
              </LoginGate>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;