"use client";

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dumbbell, Target, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface PrintableProgressReportProps {
  activityData: any[];
  userGoals: {
    id: string;
    goal_name: string;
    goal_type: string;
    target_value?: number | null;
    target_unit?: string | null;
    target_description?: string | null;
    current_value: number;
    start_date: Date;
    end_date?: Date | null;
    is_completed: boolean;
  }[];
  macroPlan: {
    target_calories: number;
    protein_grams: number;
    carbs_grams: number;
    fat_grams: number;
  } | null;
  startDate: Date;
  endDate: Date;
}

const calculateProgress = (current: number, target: number) => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

const PrintableProgressReport = ({
  activityData,
  userGoals,
  startDate,
  endDate,
}: PrintableProgressReportProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-white print:p-0 print:shadow-none print:border-none">
      <div className="text-center mb-8 print:mb-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 print:text-2xl">Relatório de Progresso LumtsFit</h1>
        <p className="text-slate-600 text-lg print:text-base">
          Período: {format(startDate, 'dd/MM/yyyy', { locale: ptBR })} - {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
        </p>
      </div>

      <div className="space-y-8 print:space-y-4">
        {/* Activity Trends */}
        <section className="mb-8 print:mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4 print:text-lg">
            <Dumbbell className="h-5 w-5 mr-2 text-purple-500 print:hidden" /> Tendências de Atividade
          </h2>
          {activityData.length > 0 ? (
            <div className="w-full h-[300px] print:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="workoutDuration" fill="#a855f7" name="Treino (min)" />
                  <Bar dataKey="cardioDistance" fill="#3b82f6" name="Cardio (km)" />
                  <Bar dataKey="sleepHours" fill="#6366f1" name="Sono (horas)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">Nenhum dado de atividade para o período selecionado.</p>
          )}
        </section>

        {/* Active Goals Summary */}
        <section className="mb-8 print:mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4 print:text-lg">
            <Target className="h-5 w-5 mr-2 text-green-500 print:hidden" /> Suas Metas Ativas
          </h2>
          {userGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1">
              {userGoals.map(goal => {
                const progressPercentage = calculateProgress(goal.current_value, goal.target_value || 0);
                const isGoalMet = goal.current_value >= (goal.target_value || 0);
                return (
                  <div key={goal.id} className="bg-slate-50 p-4 rounded-md print:bg-transparent print:border print:border-gray-200 print:shadow-none">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-700 print:text-slate-800">{goal.goal_name}</p>
                      {isGoalMet && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                    {goal.goal_type !== 'other' && goal.target_value !== null && goal.target_unit !== null ? (
                      <>
                        <p className="text-sm text-slate-500 print:text-slate-700">
                          {goal.current_value} {goal.target_unit} / {goal.target_value} {goal.target_unit}
                        </p>
                        <Progress value={progressPercentage} className="h-2 bg-pink-100 mt-2 print:bg-gray-200" indicatorClassName={isGoalMet ? "bg-green-500" : "bg-gradient-to-r from-pink-500 to-fuchsia-600"} />
                        {isGoalMet ? (
                          <p className="text-green-600 text-sm flex items-center print:text-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" /> Meta Concluída!
                          </p>
                        ) : (
                          <p className="text-slate-500 text-sm print:text-slate-700">Faltam {((goal.target_value ?? 0) - goal.current_value).toFixed(1)} {goal.target_unit} para a meta.</p>
                        )}
                      </>
                    ) : (
                      <div className="text-slate-600 text-sm print:text-slate-700">
                        <span className="font-semibold">Descrição:</span> {goal.target_description || 'N/A'}
                        <p className="text-slate-500 text-sm mt-2 print:text-slate-700">Progresso atual: {goal.current_value}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">Nenhuma meta ativa definida.</p>
          )}
        </section>
      </div>

      <div className="mt-8 text-center print:hidden">
        <Button onClick={handlePrint} className="bg-pink-500 hover:bg-pink-600">
          Imprimir Relatório / Salvar PDF
        </Button>
      </div>
    </div>
  );
};

export default PrintableProgressReport;