"use client";

import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { Flame, Beef, Carrot, Nut, Share2, RefreshCcw, Sparkles } from 'lucide-react';
import LoginGate from "./LoginGate"; // Importar o LoginGate

interface ResultsDisplayProps {
  results: {
    targetCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
  onRestart: () => void;
  onSavePlan?: (results: any) => Promise<void>;
}

const MacroCard = ({ icon, title, subtitle, grams, percent, barColor, textColor, barPercent }: any) => (
  <div className="result-card p-4 sm:p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <p className={`text-sm ${textColor}`}>{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-2xl font-bold ${textColor}`}>{grams}g</div>
        <div className="text-sm text-slate-500">{percent}%</div>
      </div>
    </div>
    <div className="macro-bar">
      <div className={`macro-fill ${barColor}`} style={{ width: `${barPercent}%` }}></div>
    </div>
  </div>
);

export function ResultsDisplay({ results, onRestart, onSavePlan }: ResultsDisplayProps) {
  const { targetCalories, proteinGrams, carbsGrams, fatGrams, proteinPercent, carbsPercent, fatPercent } = results;

  const shareResults = () => {
    const text = `✨ Meu Plano Nutricional Personalizado LumtsFit ✨\n\n🎯 ${targetCalories} calorias por dia\n🥩 Proteína: ${proteinGrams}g (${proteinPercent}%)\n🍞 Carboidratos: ${carbsGrams}g (${carbsPercent}%)\n🥑 Gorduras: ${fatGrams}g (${fatPercent}%)\n\nCrie o seu também em LumtsFit!`;
    if (navigator.share) {
      navigator.share({
        title: "Meu Plano Nutricional LumtsFit",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        showSuccess("Resultado copiado! 💕 Cole onde quiser compartilhar!");
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="main-result-card p-6 sm:p-8">
        <div className="text-center">
          <div className="text-4xl mb-3"><Sparkles className="h-12 w-12 mx-auto text-white" /></div>
          <h2 className="text-2xl font-bold mb-4">SEU PLANO PERSONALIZADO</h2>
          <div className="text-5xl font-bold mb-2">{targetCalories}</div>
          <div className="text-lg opacity-90">calorias por dia</div>
        </div>
      </div>

      <MacroCard
        icon={<Beef className="h-6 w-6 text-pink-500" />}
        title="PROTEÍNA"
        subtitle="Preserva e constrói músculos"
        grams={proteinGrams}
        percent={proteinPercent}
        barColor="protein-fill"
        textColor="text-pink-500"
        barPercent={proteinPercent}
      />
      <MacroCard
        icon={<Carrot className="h-6 w-6 text-purple-500" />}
        title="CARBOIDRATOS"
        subtitle="Principal fonte de energia para treinos"
        grams={carbsGrams}
        percent={carbsPercent}
        barColor="carbs-fill"
        textColor="text-purple-500"
        barPercent={carbsPercent}
      />
      <MacroCard
        icon={<Nut className="h-6 w-6 text-orange-500" />}
        title="GORDURAS"
        subtitle="Essencial para hormônios e vitaminas"
        grams={fatGrams}
        percent={fatPercent}
        barColor="fat-fill"
        textColor="text-orange-500"
        barPercent={fatPercent}
      />

      <div className="space-y-4 pt-4">
        <Button className="btn-calculate" onClick={onRestart}>
          <RefreshCcw className="h-5 w-5 mr-2" /> Calcular Novamente
        </Button>
        
        <LoginGate
          message="Crie uma conta ou faça login para salvar e acompanhar seus planos de macros."
          featureName="Salvar Plano de Macros"
        >
          <Button
            variant="outline"
            className="w-full bg-green-100/50 text-green-700 font-bold py-4 rounded-2xl border-2 border-green-200 hover:bg-green-100 transition-all duration-300 h-auto text-base"
            onClick={() => onSavePlan && onSavePlan(results)}
          >
            💾 Salvar Meu Plano
          </Button>
        </LoginGate>

        <Button
          variant="outline"
          className="w-full bg-pink-100/50 text-pink-700 font-bold py-4 rounded-2xl border-2 border-pink-200 hover:bg-pink-100 transition-all duration-300 h-auto text-base"
          onClick={shareResults}
        >
          <Share2 className="h-5 w-5 mr-2" /> Compartilhar Resultado
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-6">
        <h3 className="text-sm font-bold text-yellow-800 mb-2">⚠️ IMPORTANTE</h3>
        <div className="text-xs text-yellow-700 space-y-1">
          <p>• Estimativas baseadas em fórmulas científicas.</p>
          <p>• Consulte um nutricionista para um plano personalizado.</p>
          <p>• Monitore e ajuste conforme necessário.</p>
        </div>
      </div>
    </div>
  );
}