"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Clock, Hourglass, RefreshCcw, Share2, Sparkles, Lightbulb, Utensils, CheckCircle } from 'lucide-react';
import { calculateFastingWindows, FastingCalculationInputs, FastingCalculationResults } from '@/utils/fastingCalculations';
import { showError, showSuccess } from '@/utils/toast';
import LoginGate from '@/components/LoginGate';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Importar o novo hook
import { useSaveFastingPlan } from '@/hooks/useSaveFastingPlan';

const fastingCalculatorSchema = z.object({
  lastMealTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
  fastingDurationHours: z.coerce.number().min(12, "Duração mínima de 12h").max(20, "Duração máxima de 20h"),
});

type FastingCalculatorFormInputs = z.infer<typeof fastingCalculatorSchema>;

const IntermittentFastingCalculatorPage = () => {
  const { user } = useAuth();
  const [result, setResult] = useState<FastingCalculationResults | null>(null);
  const [formData, setFormData] = useState<FastingCalculationInputs | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FastingCalculatorFormInputs>({
    resolver: zodResolver(fastingCalculatorSchema),
    defaultValues: {
      lastMealTime: "19:00",
      fastingDurationHours: 16,
    },
  });

  const saveFastingPlanMutation = useSaveFastingPlan();

  const onSubmit = (data: FastingCalculatorFormInputs) => {
    try {
      const calculatedWindows = calculateFastingWindows(data as FastingCalculationInputs); // Explicitly cast data
      setResult(calculatedWindows);
      setFormData(data as FastingCalculationInputs); // Explicitly cast data
    } catch (error: any) {
      showError("Erro ao calcular as janelas de jejum: " + error.message);
    }
  };

  const handleSavePlan = async () => {
    if (!user || !result || !formData) {
      showError("Você precisa estar logada e ter um plano calculado para salvar.");
      return;
    }

    saveFastingPlanMutation.mutate({
      userId: user.id,
      lastMealTime: formData.lastMealTime,
      fastingDurationHours: formData.fastingDurationHours,
      fastingWindowEnd: result.fastingWindowEnd,
      eatingWindowStart: result.eatingWindowStart,
      eatingWindowEnd: result.eatingWindowEnd,
    });
  };

  const handleShareResult = () => {
    if (result === null) return;
    const text = `⏰ Meu Plano de Jejum Intermitente LumtsFit ⏰\n\nFim do Jejum: ${result.fastingWindowEnd}\nInício da Janela de Alimentação: ${result.eatingWindowStart}\nFim da Janela de Alimentação: ${result.eatingWindowEnd}\n\nOtimize seu bem-estar com LumtsFit!`;
    if (navigator.share) {
      navigator.share({
        title: "Meu Plano de Jejum Intermitente LumtsFit",
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
    setFormData(null);
    reset();
  };

  const isLoading = saveFastingPlanMutation.isPending;

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <Hourglass className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Calculadora de Jejum</h2>
          <p className="text-indigo-600 text-base">Planeje seu jejum intermitente de forma eficaz!</p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lastMealTime" className="font-semibold text-indigo-700">⏰ Hora da Última Refeição</Label>
              <Input
                id="lastMealTime"
                type="time"
                placeholder="19:00"
                {...register("lastMealTime")}
                className={errors.lastMealTime ? "border-red-500" : ""}
              />
              {errors.lastMealTime && <p className="text-red-500 text-sm mt-1">{errors.lastMealTime.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-indigo-700">⏳ Duração do Jejum (horas)</Label>
              <Controller
                name="fastingDurationHours"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
                    <SelectTrigger className={errors.fastingDurationHours ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione a duração..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 horas (12:12)</SelectItem>
                      <SelectItem value="13">13 horas (13:11)</SelectItem>
                      <SelectItem value="14">14 horas (14:10)</SelectItem>
                      <SelectItem value="15">15 horas (15:9)</SelectItem>
                      <SelectItem value="16">16 horas (16:8)</SelectItem>
                      <SelectItem value="17">17 horas (17:7)</SelectItem>
                      <SelectItem value="18">18 horas (18:6)</SelectItem>
                      <SelectItem value="19">19 horas (19:5)</SelectItem>
                      <SelectItem value="20">20 horas (20:4)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.fastingDurationHours && <p className="text-red-500 text-sm mt-1">{errors.fastingDurationHours.message}</p>}
            </div>

            <Button type="submit" className="btn-calculate bg-indigo-500 hover:bg-indigo-600" disabled={isLoading}>
              {isLoading ? 'Calculando...' : '✨ Calcular Jejum'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Card className={`main-result-card bg-gradient-to-r from-indigo-500 to-purple-500 shadow-purple-500/30`}>
              <CardHeader className="text-center">
                <Sparkles className="h-12 w-12 mx-auto text-white mb-3" />
                <CardTitle className="text-2xl font-bold text-white">Seu Plano de Jejum</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="text-lg text-white/90">Fim do Jejum:</p>
                <p className="text-4xl font-bold text-white mb-4">{result.fastingWindowEnd}</p>
                <p className="text-lg text-white/90">Janela de Alimentação:</p>
                <p className="text-3xl font-bold text-white">{result.eatingWindowStart} - {result.eatingWindowEnd}</p>
              </CardContent>
            </Card>

            {/* Detalhes do Jejum */}
            <Card className="p-6 shadow-lg border-indigo-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Hourglass className={`h-6 w-6 mr-3 text-indigo-500`} />
                  {result.details.title}
                </CardTitle>
                <p className="text-slate-600 text-sm">{result.details.description}</p>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="beneficios">
                    <AccordionTrigger className="text-lg font-bold text-slate-800 hover:no-underline">
                      <Lightbulb className="h-5 w-5 mr-3 text-indigo-500" /> Benefícios
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pl-8">
                      {result.details.benefits.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold text-slate-700">{item.title}</h4>
                          <p className="text-sm text-slate-600">{item.content}</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dicas-alimentacao">
                    <AccordionTrigger className="text-lg font-bold text-slate-800 hover:no-underline">
                      <Utensils className="h-5 w-5 mr-3 text-indigo-500" /> Dicas para a Janela de Alimentação
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pl-8">
                      {result.details.eatingWindowTips.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold text-slate-700">{item.title}</h4>
                          <p className="text-sm text-slate-600">{item.content}</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dicas-gerais">
                    <AccordionTrigger className="text-lg font-bold text-slate-800 hover:no-underline">
                      <CheckCircle className="h-5 w-5 mr-3 text-indigo-500" /> Dicas Gerais
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pl-8">
                      {result.details.generalTips.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold text-slate-700">{item.title}</h4>
                          <p className="text-sm text-slate-600">{item.content}</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Button className="btn-calculate bg-indigo-500 hover:bg-indigo-600" onClick={handleRestart}>
              <RefreshCcw className="h-5 w-5 mr-2" /> Calcular Novamente
            </Button>

            <LoginGate
              message="Crie uma conta ou faça login para salvar e acompanhar seus planos de jejum."
              featureName="Salvar Plano de Jejum"
            >
              <Button
                variant="outline"
                className="w-full bg-green-100/50 text-green-700 font-bold py-4 rounded-2xl border-2 border-green-200 hover:bg-green-100 transition-all duration-300 h-auto text-base"
                onClick={handleSavePlan}
                disabled={isLoading}
              >
                💾 Salvar Meu Plano
              </Button>
            </LoginGate>

            <Button
              variant="outline"
              className="w-full bg-indigo-100/50 text-indigo-700 font-bold py-4 rounded-2xl border-2 border-indigo-200 hover:bg-indigo-100 transition-all duration-300 h-auto text-base"
              onClick={handleShareResult}
            >
              <Share2 className="h-5 w-5 mr-2" /> Compartilhar Resultado
            </Button>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-6">
              <h3 className="text-sm font-bold text-yellow-800 mb-2">⚠️ IMPORTANTE</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>• Consulte um profissional de saúde antes de iniciar qualquer dieta.</p>
                <p>• Ouça seu corpo e ajuste conforme suas necessidades.</p>
                <p>• Mantenha-se hidratada durante o jejum.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntermittentFastingCalculatorPage;