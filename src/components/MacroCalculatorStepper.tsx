"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { showError } from "@/utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import *as z from "zod";
import { ArrowLeft, Heart } from 'lucide-react';
import { calculateMacros, MacroCalculationInputs } from '@/utils/macroCalculations';

// Importar os novos componentes de passo
import StepPersonalData from '@/components/macro-calculator/StepPersonalData';
import StepGender from '@/components/macro-calculator/StepGender';
import StepBodyState from '@/components/macro-calculator/StepBodyState';
import StepBodyFatPercentage from '@/components/macro-calculator/StepBodyFatPercentage';
import StepActivityLevel from '@/components/macro-calculator/StepActivityLevel';
import StepGoal from '@/components/macro-calculator/StepGoal';

// Define o schema Zod para validação
export const calculatorSchema = z.object({
  age: z.coerce.number().min(1, "Idade deve ser maior que 0").max(120, "Idade inválida"),
  weight: z.coerce.number().min(10, "Peso deve ser maior que 0").max(300, "Peso inválido"),
  height: z.coerce.number().min(50, "Altura deve ser maior que 0").max(250, "Altura inválida"),
  gender: z.enum(['male', 'female'], { message: "Selecione o gênero" }),
  bodyState: z.enum(['definida', 'tonificada', 'magraNatural', 'equilibrada', 'extrasLeves', 'emagrecer'], { message: "Selecione seu estado físico" }),
  activity: z.enum(['sedentaria', 'leve', 'moderada', 'intensa', 'muitoIntensa'], { message: "Selecione seu nível de atividade" }),
  goal: z.enum(['emagrecerSuave', 'emagrecerFoco', 'transformacaoIntensa', 'manterPeso', 'ganharMassa', 'ganhoAcelerado'], { message: "Selecione seu objetivo" }),
  bodyFatPercentage: z.preprocess(
    (val) => (val === "" ? undefined : val), // Converte string vazia para undefined
    z.coerce.number().min(5, "Gordura corporal deve ser no mínimo 5%").max(60, "Gordura corporal deve ser no máximo 60%").optional() // Torna o número coercivo opcional
  ),
});

export type CalculatorFormInputs = z.infer<typeof calculatorSchema>;

interface MacroCalculatorStepperProps {
  onCalculate: (results: any, formData: MacroCalculationInputs) => void;
  initialData?: {
    age?: string;
    weight?: string;
    height?: string;
  };
}

export function MacroCalculatorStepper({ onCalculate, initialData }: MacroCalculatorStepperProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const form = useForm<CalculatorFormInputs>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      age: initialData?.age ? parseInt(initialData.age) : undefined,
      weight: initialData?.weight ? parseFloat(initialData.weight) : undefined,
      height: initialData?.height ? parseInt(initialData.height) : undefined,
      gender: undefined,
      bodyState: undefined,
      activity: undefined,
      goal: undefined,
      bodyFatPercentage: undefined,
    },
  });

  const { handleSubmit, trigger, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (initialData) {
      if (initialData.age) setValue("age", parseInt(initialData.age));
      if (initialData.weight) setValue("weight", parseFloat(initialData.weight));
      if (initialData.height) setValue("height", parseInt(initialData.height));
    }
  }, [initialData, setValue]);

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof CalculatorFormInputs)[] = [];
    if (step === 1) {
      fieldsToValidate = ['age', 'weight', 'height'];
    } else if (step === 2) {
      fieldsToValidate = ['gender'];
    } else if (step === 3) {
      fieldsToValidate = ['bodyState'];
    } else if (step === 4) {
      fieldsToValidate = ['bodyFatPercentage'];
    } else if (step === 5) {
      fieldsToValidate = ['activity'];
    } else if (step === 6) {
      fieldsToValidate = ['goal'];
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      // Esta é a única mensagem de erro para validação de passo
      let firstErrorMessage = "Por favor, preencha todos os campos obrigatórios ou corrija os erros.";
      for (const field of fieldsToValidate) {
        if (errors[field]) {
          firstErrorMessage = errors[field]?.message || firstErrorMessage;
          break;
        }
      }
      showError(firstErrorMessage);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = (data: CalculatorFormInputs) => {
    // Esta função só é chamada se todas as validações passarem
    const calculatedResults = calculateMacros(data as MacroCalculationInputs);
    onCalculate(calculatedResults, data as MacroCalculationInputs);
  };

  const progress = (step / totalSteps) * 100;

  const renderStepComponent = () => {
    switch (step) {
      case 1: return <StepPersonalData form={form} />;
      case 2: return <StepGender form={form} />;
      case 3: return <StepBodyState form={form} />;
      case 4: return <StepBodyFatPercentage form={form} />;
      case 5: return <StepActivityLevel form={form} />;
      case 6: return <StepGoal form={form} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-md card-style p-6 sm:p-8">
      <div className="text-center mb-8">
        <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold gradient-text mb-3">Calculadora de Macros</h2>
        <p className="text-pink-600 text-base">Seu plano nutricional em {totalSteps} passos!</p>
      </div>

      <Progress value={progress} className="w-full mb-6 h-2 bg-pink-100" indicatorClassName="bg-gradient-to-r from-pink-500 to-fuchsia-500" />

      <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-6">
        {renderStepComponent()}

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