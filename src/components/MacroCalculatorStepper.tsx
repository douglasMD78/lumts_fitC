"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { showError } from "@/utils/toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import VisualSelection from './VisualSelection'; // Importar o novo componente
import { MacroCalculationInputs, calculateMacros } from '@/utils/macroCalculations'; // Importar a lógica de cálculo
import { ArrowLeft, Heart, Zap, Dumbbell, Utensils, Activity, Leaf, CalendarDays, Droplet, Sparkles } from 'lucide-react'; // Ícones

// Define o schema Zod para validação
const calculatorSchema = z.object({
  age: z.coerce.number().min(1, "Idade deve ser maior que 0").max(120, "Idade inválida"),
  weight: z.coerce.number().min(10, "Peso deve ser maior que 0").max(300, "Peso inválido"),
  height: z.coerce.number().min(50, "Altura deve ser maior que 0").max(250, "Altura inválida"),
  gender: z.enum(['male', 'female'], { message: "Selecione o gênero" }),
  bodyState: z.enum(['definida', 'tonificada', 'magraNatural', 'equilibrada', 'extrasLeves', 'emagrecer'], { message: "Selecione seu estado físico" }),
  activity: z.enum(['sedentaria', 'leve', 'moderada', 'intensa', 'muitoIntensa'], { message: "Selecione seu nível de atividade" }),
  goal: z.enum(['emagrecerSuave', 'emagrecerFoco', 'transformacaoIntensa', 'manterPeso', 'ganharMassa', 'ganhoAcelerado'], { message: "Selecione seu objetivo" }),
  // Novo campo para percentual de gordura corporal, opcional
  bodyFatPercentage: z.coerce.number().min(5, "Gordura corporal deve ser no mínimo 5%").max(60, "Gordura corporal deve ser no máximo 60%").nullable().optional(),
});

type CalculatorFormInputs = z.infer<typeof calculatorSchema>;

interface MacroCalculatorStepperProps {
  onCalculate: (results: any, formData: MacroCalculationInputs) => void;
  initialData?: {
    age?: string;
    weight?: string;
    height?: string;
  };
}

const genderOptions = [
  { value: 'female', label: 'Feminino', icon: '👩' },
  { value: 'male', label: 'Masculino', icon: '👨' },
];

const bodyStateOptions = [
  { value: 'definida', label: 'Definição visível', icon: '💎', description: 'Músculos bem marcados' },
  { value: 'tonificada', label: 'Corpo tonificado', icon: '💪', description: 'Forma atlética, pouca gordura' },
  { value: 'magraNatural', label: 'Magra natural', icon: '📐', description: 'Metabolismo rápido, dificuldade em ganhar peso' },
  { value: 'equilibrada', label: 'Peso equilibrado', icon: '⚖️', description: 'Confortável com seu corpo' },
  { value: 'extrasLeves', label: 'Alguns quilos extras', icon: '📊', description: 'Gordura corporal um pouco acima do ideal' },
  { value: 'emagrecer', label: 'Preciso emagrecer', icon: '🎯', description: 'Busca por perda de peso significativa' },
];

const activityOptions = [
  { value: 'sedentaria', label: 'Sedentária', icon: '🛋️', description: 'Pouco ou nenhum exercício' },
  { value: 'leve', label: 'Levemente Ativa', icon: '🚶‍♀️', description: 'Exercício leve 1-3 dias/semana' },
  { value: 'moderada', label: 'Moderadamente Ativa', icon: '🏃‍♀️', description: 'Exercício moderado 3-5 dias/semana' },
  { value: 'intensa', label: 'Altamente Ativa', icon: '💪', description: 'Exercício intenso 6-7 dias/semana' },
  { value: 'muitoIntensa', label: 'Muito Ativa', icon: '🔥', description: 'Exercício intenso diário ou trabalho físico' },
];

const goalOptions = [
  { value: 'emagrecerSuave', label: 'Emagrecer Suavemente', icon: '🌸', description: 'Perda de peso gradual e sustentável' },
  { value: 'emagrecerFoco', label: 'Emagrecer com Foco', icon: '🌺', description: 'Perda de peso mais acelerada' },
  { value: 'transformacaoIntensa', label: 'Transformação Intensa', icon: '🔥', description: 'Déficit calórico agressivo para resultados rápidos' },
  { value: 'manterPeso', label: 'Manter Meu Peso', icon: '💖', description: 'Estabilizar o peso atual' },
  { value: 'ganharMassa', label: 'Ganhar Massa', icon: '🌻', description: 'Aumento gradual de massa muscular' },
  { value: 'ganhoAcelerado', label: 'Ganho Acelerado', icon: '💪', description: 'Superávit calórico para ganho rápido de massa' },
];

export function MacroCalculatorStepper({ onCalculate, initialData }: MacroCalculatorStepperProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6; // Dados Pessoais, Gênero, Estado Físico, Percentual de Gordura, Atividade, Objetivo
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger, // Para validar campos antes de avançar
    formState: { errors },
  } = useForm<CalculatorFormInputs>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      age: initialData?.age ? parseInt(initialData.age) : undefined,
      weight: initialData?.weight ? parseFloat(initialData.weight) : undefined,
      height: initialData?.height ? parseInt(initialData.height) : undefined,
      gender: undefined,
      bodyState: undefined,
      activity: undefined,
      goal: undefined,
      bodyFatPercentage: undefined, // Valor padrão para o novo campo
    },
  });

  // Atualiza os dados do formulário se initialData mudar
  useEffect(() => {
    if (initialData) {
      if (initialData.age) setValue("age", parseInt(initialData.age));
      if (initialData.weight) setValue("weight", parseFloat(initialData.weight));
      if (initialData.height) setValue("height", parseInt(initialData.height));
    }
  }, [initialData, setValue]);

  const currentValues = watch(); // Observa todos os valores do formulário

  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['age', 'weight', 'height']);
    } else if (step === 2) {
      isValid = await trigger('gender');
    } else if (step === 3) {
      isValid = await trigger('bodyState');
    } else if (step === 4) { // Novo passo para bodyFatPercentage
      isValid = await trigger('bodyFatPercentage');
      // bodyFatPercentage é opcional, então se não for preenchido, ainda é válido
      if (!currentValues.bodyFatPercentage) isValid = true; 
    } else if (step === 5) {
      isValid = await trigger('activity');
    }
    
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      showError("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = (data: CalculatorFormInputs) => {
    // Cast data to MacroCalculationInputs, assuming validation ensures all fields are present
    const calculatedResults = calculateMacros(data as MacroCalculationInputs);
    onCalculate(calculatedResults, data as MacroCalculationInputs);
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full max-w-md card-style p-6 sm:p-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">💖</div>
        <h2 className="text-2xl font-bold gradient-text mb-3">Calculadora de Macros</h2>
        <p className="text-pink-600 text-base">Seu plano nutricional em {totalSteps} passos!</p>
      </div>

      <Progress value={progress} className="w-full mb-6 h-2 bg-pink-100" indicatorClassName="bg-gradient-to-r from-pink-500 to-fuchsia-500" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-800 mb-4">1. Seus Dados Pessoais</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-pink-700" htmlFor="age">✨ Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  {...register("age", { valueAsNumber: true })}
                  className={errors.age ? "border-red-500" : ""}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-pink-700" htmlFor="weight">⚖️ Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  {...register("weight", { valueAsNumber: true })}
                  className={errors.weight ? "border-red-500" : ""}
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-pink-700" htmlFor="height">📏 Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  {...register("height", { valueAsNumber: true })}
                  className={errors.height ? "border-red-500" : ""}
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-800 mb-4">2. Qual seu Gênero?</h3>
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
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-800 mb-4">3. Como você se sente?</h3>
            <Controller
              name="bodyState"
              control={control}
              render={({ field }) => (
                <VisualSelection
                  options={bodyStateOptions}
                  selectedValue={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            {errors.bodyState && <p className="text-red-500 text-sm mt-2">{errors.bodyState.message}</p>}
          </div>
        )}

        {step === 4 && ( // Novo passo para percentual de gordura corporal
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-800 mb-4">4. Percentual de Gordura Corporal (Opcional)</h3>
            <p className="text-slate-600 text-sm mb-4">
              Se você souber seu percentual de gordura, insira-o para um cálculo mais preciso. Caso contrário, pode deixar em branco.
            </p>
            <div className="space-y-2">
              <Label className="font-semibold text-pink-700" htmlFor="bodyFatPercentage">
                % Gordura Corporal
              </Label>
              <Input
                id="bodyFatPercentage"
                type="number"
                step="0.1"
                placeholder="Ex: 25.0"
                {...register("bodyFatPercentage", { valueAsNumber: true })}
                className={errors.bodyFatPercentage ? "border-red-500" : ""}
              />
              {errors.bodyFatPercentage && <p className="text-red-500 text-sm mt-1">{errors.bodyFatPercentage.message}</p>}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-800 mb-4">5. Nível de Atividade Física</h3>
            <Controller
              name="activity"
              control={control}
              render={({ field }) => (
                <VisualSelection
                  options={activityOptions}
                  selectedValue={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            {errors.activity && <p className="text-red-500 text-sm mt-2">{errors.activity.message}</p>}
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-800 mb-4">6. Qual seu Objetivo?</h3>
            <Controller
              name="goal"
              control={control}
              render={({ field }) => (
                <VisualSelection
                  options={goalOptions}
                  selectedValue={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            {errors.goal && <p className="text-red-500 text-sm mt-2">{errors.goal.message}</p>}
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handlePrevStep} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
          )}
          {step < totalSteps ? (
            <Button type="button" onClick={handleNextStep} className="ml-auto bg-pink-500 hover:bg-pink-600">
              Próximo
            </Button>
          ) : (
            <Button type="submit" className="btn-calculate">
              ✨ Criar Meu Plano
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}