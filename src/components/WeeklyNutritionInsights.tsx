"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Leaf, Candy, Info, Beef, Carrot, Nut, TrendingUp } from 'lucide-react'; // Corrigido: SaltShaker para Info
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import { useWeeklyNutritionSummary } from '@/hooks/useWeeklyNutritionSummary';
import DailyMacroSummarySkeleton from './DailyMacroSummarySkeleton'; // Reutilizar skeleton para loading

interface WeeklyNutritionInsightsProps {
  userId: string;
}

const WeeklyNutritionInsights = ({ userId }: WeeklyNutritionInsightsProps) => {
  const { data: summary, isLoading, error } = useWeeklyNutritionSummary();

  useEffect(() => {
    if (error) {
      showError('Erro ao carregar insights nutricionais semanais: ' + error.message);
    }
  }, [error]);

  if (isLoading) {
    return <DailyMacroSummarySkeleton />; // Usar um skeleton genérico para carregamento
  }

  if (!summary || (summary.avgFiber === 0 && summary.avgSugar === 0 && summary.avgSodium === 0 && summary.topProteinSources.length === 0)) {
    return (
      <Card className="p-6 shadow-lg border-pink-100 text-center">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 mr-3 text-pink-500" /> Insights Nutricionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Registre seus alimentos para ver insights semanais aqui!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg border-pink-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
          <TrendingUp className="h-6 w-6 mr-3 text-pink-500" /> Insights Nutricionais (Últimos 7 dias)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <Leaf className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-sm text-slate-600">Fibras (média)</p>
            <p className="text-lg font-bold text-slate-800">{summary.avgFiber}g</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <Candy className="h-5 w-5 text-red-500 mx-auto mb-1" />
            <p className="text-sm text-slate-600">Açúcar (média)</p>
            <p className="text-lg font-bold text-slate-800">{summary.avgSugar}g</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Info className="h-5 w-5 text-blue-500 mx-auto mb-1" /> {/* Corrigido: SaltShaker para Info */}
            <p className="text-sm text-slate-600">Sódio (média)</p>
            <p className="text-lg font-bold text-slate-800">{summary.avgSodium}mg</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-pink-100">
          <h3 className="font-bold text-slate-800 text-lg">Principais Fontes</h3>
          {summary.topProteinSources.length > 0 && (
            <div>
              <p className="flex items-center font-medium text-slate-700 mb-1"><Beef className="h-4 w-4 mr-2 text-pink-500" /> Proteína:</p>
              <ul className="list-disc list-inside text-sm text-slate-600 ml-6">
                {summary.topProteinSources.map((source, index) => (
                  <li key={index}>{source.name} ({source.totalGrams}g)</li>
                ))}
              </ul>
            </div>
          )}
          {summary.topCarbSources.length > 0 && (
            <div>
              <p className="flex items-center font-medium text-slate-700 mb-1"><Carrot className="h-4 w-4 mr-2 text-purple-500" /> Carboidratos:</p>
              <ul className="list-disc list-inside text-sm text-slate-600 ml-6">
                {summary.topCarbSources.map((source, index) => (
                  <li key={index}>{source.name} ({source.totalGrams}g)</li>
                ))}
              </ul>
            </div>
          )}
          {summary.topFatSources.length > 0 && (
            <div>
              <p className="flex items-center font-medium text-slate-700 mb-1"><Nut className="h-4 w-4 mr-2 text-orange-500" /> Gorduras:</p>
              <ul className="list-disc list-inside text-sm text-slate-600 ml-6">
                {summary.topFatSources.map((source, index) => (
                  <li key={index}>{source.name} ({source.totalGrams}g)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyNutritionInsights;