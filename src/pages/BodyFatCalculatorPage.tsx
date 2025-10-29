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
import { Ruler, RefreshCcw, Share2, Sparkles, User, Scale } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { calculateBodyFatPercentage, BodyFatCalculationInputs } from '@/utils/bodyFatCalculations';
import VisualSelection from '@/components/VisualSelection';
import { genderOptions } from '@/utils/macroCalculatorOptions'; // Importar de macroCalculatorOptions

const bodyFatCalculatorSchema = z.object({
  gender: z.enum(['male', 'female'], { message: "Selecione o gênero" }),
  height: z.coerce.number().min(50, "Altura deve ser maior que 0").max(250, "Altura inválida"),
  neck: z.coerce.number().min(20, "Pescoço deve ser maior que 0").max(60, "Pescoço inválido"),
  waist: z.coerce.number().min(40, "Cintura deve ser maior que 0").max(150, "Cintura inválida"),
  hip: z.coerce.number().min(50, "Quadril deve ser maior que 0").max(150, "Quadril inválido").optional(), // Optional for males
}).superRefine((data, ctx) => {
  if (data.gender === 'female' && (data.hip === undefined || data.hip === null)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A medida do quadril é obrigatória para o cálculo feminino.",
      path: ["hip"],
    });
  }

  // Validação para garantir que os argumentos de Math.log10 sejam positivos
  if (data.gender === 'male') {
    if (data.waist <= data.neck) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A medida da cintura deve ser maior que a do pescoço para o cálculo masculino.",
        path: ["waist"],
      });
    }
  } else { // female
    if (data.hip !== undefined && data.hip !== null && (data.waist + data.hip) <= data.neck) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A soma da cintura e quadril deve ser maior que a do pescoço para o cálculo feminino.",
        path: ["waist"], // Pode ser 'hip' também, dependendo de qual é mais provável ser o problema
      });
    }
  }
});

type BodyFatCalculatorFormInputs = z.infer<typeof bodyFatCalculatorSchema>;

const BodyFatCalculatorPage = () => {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<BodyFatCalculatorFormInputs>({
    resolver: zodResolver(bodyFatCalculatorSchema),
    defaultValues: {
      gender: undefined,
      height: undefined,
      neck: undefined,
      waist: undefined,
      hip: undefined,
    },
  });

  const watchedGender = watch('gender');

  const onSubmit = (data: BodyFatCalculatorFormInputs) => {
    setLoading(true);
    try {
      const calculatedBF = calculateBodyFatPercentage(data as BodyFatCalculationInputs);
      setResult(calculatedBF);
    } catch (error: any) {
      showError("Erro ao calcular percentual de gordura: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShareResult = () => {
    if (result === null) return;
    const text = `✨ Meu Percentual de Gordura Corporal LumtsFit ✨\n\nMeu BF% estimado: ${result}%\n\nDescubra o seu em LumtsFit!`;
    if (navigator.share) {
      navigator.share({
        title: "Meu Percentual de Gordura Corporal LumtsFit",
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
          <Scale className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Calculadora de BF%</h2>
          <p className="text-pink-600 text-base">Estime seu percentual de gordura corporal!</p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-semibold text-pink-700">Qual seu Gênero?</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <VisualSelection
                    options={genderOptions}
                    selectedValue={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
              {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="font-semibold text-pink-700">📏 Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 165"
                {...register("height", { valueAsNumber: true })}
                className={errors.height ? "border-red-500" : ""}
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="neck" className="font-semibold text-pink-700">Pescoço (cm)</Label>
              <Input
                id="neck"
                type="number"
                step="0.1"
                placeholder="Ex: 34.5"
                {...register("neck", { valueAsNumber: true })}
                className={errors.neck ? "border-red-500" : ""}
              />
              {errors.neck && <p className="text-red-500 text-sm mt-1">{errors.neck.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="waist" className="font-semibold text-pink-700">Cintura (cm)</Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                placeholder="Ex: 70.0"
                {...register("waist", { valueAsNumber: true })}
                className={errors.waist ? "border-red-500" : ""}
              />
              {errors.waist && <p className="text-red-500 text-sm mt-1">{errors.waist.message}</p>}
            </div>

            {watchedGender === 'female' && (
              <div className="space-y-2 animate-fade-in-up">
                <Label htmlFor="hip" className="font-semibold text-pink-700">Quadril (cm)</Label>
                <Input
                  id="hip"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 98.0"
                  {...register("hip", { valueAsNumber: true })}
                  className={errors.hip ? "border-red-500" : ""}
                />
                {errors.hip && <p className="text-red-500 text-sm mt-1">{errors.hip.message}</p>}
              </div>
            )}

            <Button type="submit" className="btn-calculate" disabled={loading}>
              {loading ? 'Calculando...' : '✨ Calcular BF%'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Card className="main-result-card bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-fuchsia-500/30">
              <CardHeader className="text-center">
                <Sparkles className="h-12 w-12 mx-auto text-white mb-3" />
                <CardTitle className="text-2xl font-bold text-white">Seu Percentual de Gordura</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-5xl font-bold text-white mb-2">{result}%</p>
                <p className="text-lg text-white/90">é a sua estimativa de BF%</p>
              </CardContent>
            </Card>

            <Button className="btn-calculate" onClick={handleRestart}>
              <RefreshCcw className="h-5 w-5 mr-2" /> Calcular Novamente
            </Button>
            <Button
              variant="outline"
              className="w-full bg-pink-100/50 text-pink-700 font-bold py-4 rounded-2xl border-2 border-pink-200 hover:bg-pink-100 transition-all duration-300 h-auto text-base"
              onClick={handleShareResult}
            >
              <Share2 className="h-5 w-5 mr-2" /> Compartilhar Resultado
            </Button>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-6">
              <h3 className="text-sm font-bold text-yellow-800 mb-2">⚠️ IMPORTANTE</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>• Esta é uma estimativa baseada em fórmulas.</p>
                <p>• A precisão pode variar. Para medições exatas, consulte um profissional.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyFatCalculatorPage;