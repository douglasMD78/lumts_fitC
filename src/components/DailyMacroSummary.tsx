"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Beef, Carrot, Nut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DailyMacroSummaryProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

const MacroProgressBar = ({ label, current, target, icon: Icon, colorClass, indicatorClass }: { label: string; current: number; target: number; icon: React.ElementType; colorClass: string; indicatorClass: string }) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isOver = current > target && target > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className={cn("h-5 w-5 mr-2", colorClass)} />
          <span className="font-medium text-slate-700">{label}</span>
        </div>
        <span className={cn("font-bold", isOver ? "text-red-500" : "text-slate-800")}>
          {current.toFixed(0)}g / {target.toFixed(0)}g
        </span>
      </div>
      <Progress value={percentage} className="h-2 bg-gray-200" indicatorClassName={cn(indicatorClass, isOver ? "bg-red-500" : "")} />
      {isOver && <p className="text-red-500 text-xs mt-1">Você excedeu sua meta de {label.toLowerCase()}!</p>}
    </div>
  );
};

const DailyMacroSummary = ({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFat,
}: DailyMacroSummaryProps) => {
  const caloriesProgress = targetCalories > 0 ? Math.min((totalCalories / targetCalories) * 100, 100) : 0;
  const isCaloriesOver = totalCalories > targetCalories && targetCalories > 0;

  const totalMacrosGrams = totalProtein + totalCarbs + totalFat;
  const macroDataForChart = totalMacrosGrams > 0 ? [
    { name: 'Proteína', value: totalProtein, color: '#ec4899' }, // pink-500
    { name: 'Carboidratos', value: totalCarbs, color: '#a855f7' }, // purple-500
    { name: 'Gorduras', value: totalFat, color: '#f97316' }, // orange-500
  ] : [];

  return (
    <Card className="p-6 shadow-lg border-pink-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
          <Flame className="h-7 w-7 mr-3 text-pink-500" /> Resumo Diário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Flame className="h-5 w-5 mr-2 text-pink-500" />
              <span className="font-medium text-slate-700">Calorias</span>
            </div>
            <span className={cn("font-bold text-xl", isCaloriesOver ? "text-red-500" : "text-slate-800")}>
              {totalCalories.toFixed(0)} kcal / {targetCalories.toFixed(0)} kcal
            </span>
          </div>
          <Progress value={caloriesProgress} className="h-3 bg-pink-100" indicatorClassName={cn("bg-gradient-to-r from-pink-500 to-fuchsia-600", isCaloriesOver ? "bg-red-500" : "")} />
          {isCaloriesOver && <p className="text-red-500 text-xs mt-1">Você excedeu sua meta de calorias!</p>}
        </div>

        <div className="space-y-4">
          <MacroProgressBar
            label="Proteína"
            current={totalProtein}
            target={targetProtein}
            icon={Beef}
            colorClass="text-pink-500"
            indicatorClass="protein-fill"
          />
          <MacroProgressBar
            label="Carboidratos"
            current={totalCarbs}
            target={targetCarbs}
            icon={Carrot}
            colorClass="text-purple-500"
            indicatorClass="carbs-fill"
          />
          <MacroProgressBar
            label="Gorduras"
            current={totalFat}
            target={targetFat}
            icon={Nut}
            colorClass="text-orange-500"
            indicatorClass="fat-fill"
          />
        </div>

        {macroDataForChart.length > 0 && (
          <div className="mt-6 pt-6 border-t border-pink-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Distribuição de Macros</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroDataForChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {macroDataForChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${(value / totalMacrosGrams * 100).toFixed(1)}% (${value.toFixed(1)}g)`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyMacroSummary;