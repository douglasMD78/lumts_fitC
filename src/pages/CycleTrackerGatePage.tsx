"use client";

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Droplet, Zap, Dumbbell, Sparkles } from 'lucide-react';

const CycleTrackerGatePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      return; // Aguarda a autenticação ser resolvida
    }

    if (user) {
      const checkExistingData = async () => {
        const { data, error } = await supabase
          .from('menstrual_cycles')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Erro ao verificar dados do ciclo:", error);
        }

        if (data) {
          // Usuário logado e com dados, vai para a visualização
          navigate('/rastreador-ciclo/hoje', { replace: true });
        } else {
          // Usuário logado mas sem dados, vai para a configuração
          navigate('/rastreador-ciclo/configurar', { replace: true });
        }
      };
      checkExistingData();
    }
    // Se não houver usuário, a página de login/cadastro será renderizada
  }, [user, authLoading, navigate]);

  if (authLoading || user) {
    // Mostra um loader enquanto a lógica de redirecionamento está em andamento
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando rastreador de ciclo...</p>
      </div>
    );
  }

  // Renderiza a página de "venda" da funcionalidade para usuários não logados
  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8 text-center">
        <Droplet className="h-16 w-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold gradient-text mb-3">Sincronize seu ciclo com sua vida.</h2>
        <p className="text-purple-600 text-base mb-6">
          Desbloqueie insights sobre sua energia, força e bem-estar para otimizar seus treinos e sua rotina diária.
        </p>
        
        <div className="space-y-3 text-left mb-8">
            <div className="flex items-start"><Zap className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" /><span>Entenda seus níveis de energia em cada fase.</span></div>
            <div className="flex items-start"><Dumbbell className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" /><span>Saiba os melhores dias para treinos de força ou cardio.</span></div>
            <div className="flex items-start"><Sparkles className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" /><span>Receba dicas personalizadas para maximizar seu bem-estar.</span></div>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full btn-calculate bg-purple-500 hover:bg-purple-600">
            <Link to="/login">Fazer Login para Acessar</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/signup">Não tenho conta, quero criar!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CycleTrackerGatePage;