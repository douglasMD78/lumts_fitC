"use client";

import { Button } from '@/components/ui/button';
import { Dumbbell, Target, Share2, Sparkles, CheckCircle } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { Progress } from '@/components/ui/progress';

interface ShareableProgressStoryProps {
  userName: string;
  avgWorkoutDuration: number; // in minutes
  topGoal?: {
    name: string;
    progress: number; // percentage
    isCompleted: boolean;
  };
  period: string; // e.g., "Últimos 30 dias"
}

const ShareableProgressStory = ({
  userName,
  avgWorkoutDuration,
  topGoal,
  period,
}: ShareableProgressStoryProps) => {

  const handleShare = async () => {
    const shareText = `✨ Meu Progresso LumtsFit! ✨\n\nOlá, ${userName}!\n\n🗓️ Período: ${period}\n💪 Treino (média): ${avgWorkoutDuration.toFixed(0)} min/dia\n\n${topGoal ? `🎯 Meta Principal: ${topGoal.name} (${topGoal.progress.toFixed(0)}% ${topGoal.isCompleted ? 'Concluída!' : 'em andamento'})` : ''}\n\nJunte-se a mim e transforme sua jornada fitness com LumtsFit! #LumtsFit #Fitness #Progresso #Saúde`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Progresso LumtsFit',
          text: shareText,
          url: window.location.origin, // Link para o app
        });
        showSuccess('Progresso compartilhado com sucesso!');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        showError('Não foi possível compartilhar o progresso.');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText + `\n\n${window.location.origin}`).then(() => {
        showSuccess('Progresso copiado para a área de transferência! Cole nos seus stories. 💕');
      }).catch(err => {
        console.error('Erro ao copiar:', err);
        showError('Não foi possível copiar o progresso.');
      });
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-3xl shadow-2xl p-6 text-white overflow-hidden">
      {/* Background elements for visual appeal */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 text-8xl font-bold opacity-5">
        FIT
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <Sparkles className="h-6 w-6 mr-2" /> Meu Progresso
        </h3>
        <span className="text-sm font-medium opacity-80">{period}</span>
      </div>

      <p className="text-lg font-semibold mb-6">
        Olá, <span className="capitalize">{userName}</span>! Veja sua evolução:
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between bg-white/20 p-3 rounded-xl">
          <div className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-3" />
            <span className="font-medium">Treino (média)</span>
          </div>
          <span className="font-bold">{avgWorkoutDuration.toFixed(0)} min/dia</span>
        </div>
        {topGoal && (
          <div className="bg-white/20 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-3" />
                <span className="font-medium">Meta: {topGoal.name}</span>
              </div>
              {topGoal.isCompleted && <CheckCircle className="h-5 w-5 text-green-300" />}
            </div>
            <Progress value={topGoal.progress} className="h-2 bg-white/30" indicatorClassName={topGoal.isCompleted ? "bg-green-300" : "bg-white"} />
            <p className="text-xs mt-1 opacity-80">{topGoal.progress.toFixed(0)}% {topGoal.isCompleted ? 'Concluída!' : 'em andamento'}</p>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <p className="text-xs opacity-70 mb-2">#LumtsFit #Fitness #Progresso</p>
        <p className="text-sm font-bold">lumtsfit.com</p>
      </div>

      <Button
        onClick={handleShare}
        className="w-full mt-6 bg-white text-pink-500 hover:bg-gray-100 font-bold rounded-full py-3 text-base shadow-lg"
      >
        <Share2 className="h-5 w-5 mr-2" /> Compartilhar nos Stories
      </Button>
    </div>
  );
};

export default ShareableProgressStory;