"use client";

import { UseFormReturn, Controller } from 'react-hook-form';
import VisualSelection from '@/components/VisualSelection';
import { goalOptions } from '@/utils/macroCalculatorOptions';
import { CalculatorFormInputs } from '@/components/MacroCalculatorStepper'; // Importar o tipo do componente pai

interface StepGoalProps {
  form: UseFormReturn<CalculatorFormInputs>;
}

const StepGoal = ({ form }: StepGoalProps) => {
  const { control, formState: { errors } } = form;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-4">6. Qual seu Objetivo?</h3>
      <p className="text-slate-600 text-sm mb-4">
        Selecione o que você busca alcançar com seu plano nutricional.
      </p>
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
  );
};

export default StepGoal;