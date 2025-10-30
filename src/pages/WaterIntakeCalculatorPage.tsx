"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import *as z from "zod";
import { Droplet, RefreshCcw, Share2, Sparkles } from 'lucide-react';
import { calculateWaterIntake, WaterCalculationInputs } from '@/utils/waterCalculations';
import { showError, showSuccess } from '@/utils/toast';

const waterCalculatorSchema = z.object({
  weight: z.coerce.number().min(10, "Peso deve ser maior que 0").max(300, "Peso inválido"),
  activityLevel: z.enum(['sedentary', 'moderate', 'active'], { message: "Selecione seu nível de atividade" }),
  dietaryHabits: z.enum(['highFruitsVeggies', 'balanced', 'lowFruitsVeggies'], { message: "Selecione seus hábitos alimentares" }), // Novo campo
});

type WaterCalculatorFormInputs = z.infer<typeof waterCalculatorSchema>;

const WaterIntakeCalculatorPage = () => {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<WaterCalculatorFormInputs>({
    resolver: zodResolver(waterCalculatorSchema),
    defaultValues: {
      weight: undefined,
      activityLevel: undefined,
      dietaryHabits: undefined, // Valor padrão para o novo campo
    },
  });

  const onSubmit = (data: WaterCalculatorFormInputs) => {
    setLoading(true);
    try {
      const calculatedIntake = calculateWaterIntake(data as WaterCalculationInputs); // Explicitly cast data
      setResult(calculatedIntake);
    } catch (error: any) {
      showError("Erro ao calcular a ingestão de água: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShareResult = () => {
    if (result === null) return;
    const text = `💧 Meu Plano de Hidratação LumtsFit 💧\n\nRecomendação diária: ${result / 1000} litros de água!\n\nCuide-se com LumtsFit!`;
    if (navigator.share) {
      navigator.share({
        title: "Meu Plano de Hidratação LumtsFit",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        showSuccess("Resultado copiado! 💕 Cole onde quiser compartilhar!");
      });
    }
  };

  const handleRestart = () => {
    setResult(null);
    reset();
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <Droplet className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Calculadora de Água</h2>
          <p className="text-blue-600 text-base">Descubra sua necessidade diária de hidratação!</p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weight" className="font-semibold text-blue-700">⚖️ Seu Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 65.0"
                {...register("weight", { valueAsNumber: true })}
                className={errors.weight ? "border-red-500" : ""}
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-blue-700">🏃‍♀️ Nível de Atividade</Label>
              <Controller
                name="activityLevel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.activityLevel ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione seu nível de atividade..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                      <SelectItem value="moderate">Moderado (exercício 3-5 vezes/semana)</SelectItem>
                      <SelectItem value="active">Ativo (exercício intenso diariamente)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.activityLevel && <p className="text-red-500 text-sm mt-1">{errors.activityLevel.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-blue-700">🍎 Hábitos Alimentares</Label>
              <Controller
                name="dietaryHabits"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.dietaryHabits ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione seus hábitos alimentares..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highFruitsVeggies">Rico em frutas e vegetais</SelectItem>
                      <SelectItem value="balanced">Equilibrado</SelectItem>
                      <SelectItem value="lowFruitsVeggies">Baixo em frutas e vegetais</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.dietaryHabits && <p className="text-red-500 text-sm mt-1">{errors.dietaryHabits.message}</p>}
            </div>

            <Button type="submit" className="btn-calculate bg-blue-500 hover:bg-blue-600" disabled={loading}>
              {loading ? 'Calculando...' : '✨ Calcular Água'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Card className="main-result-card bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/30">
              <CardHeader className="text-center">
                <Sparkles className="h-12 w-12 mx-auto text-white mb-3" />
                <CardTitle className="text-2xl font-bold text-white">Sua Recomendação Diária</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-5xl font-bold text-white mb-2">{result / 1000} L</p>
                <p className="text-lg text-white/90">de água por dia</p>
              </CardContent>
            </Card>

            <Button className="btn-calculate bg-blue-500 hover:bg-blue-600" onClick={handleRestart}>
              <RefreshCcw className="h-5 w-5 mr-2" /> Calcular Novamente
            </Button>
            <Button
              variant="outline"
              className="w-full bg-blue-100/50 text-blue-700 font-bold py-4 rounded-2xl border-2 border-blue-200 hover:bg-blue-100 transition-all duration-300 h-auto text-base"
              onClick={handleShareResult}
            >
              <Share2 className="h-5 w-5 mr-2" /> Compartilhar Resultado
            </Button>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-6">
              <h3 className="text-sm font-bold text-yellow-800 mb-2">⚠️ IMPORTANTE</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>• Esta é uma estimativa geral.</p>
                <p>• Suas necessidades podem variar com base em saúde, medicação e outros fatores.</p>
                <p>• Consulte um profissional de saúde para recomendações personalizadas.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterIntakeCalculatorPage;