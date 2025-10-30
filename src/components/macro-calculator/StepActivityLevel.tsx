"use client";

import { UseFormReturn, Controller } from 'react-hook-form';
import VisualSelection from '@/components/VisualSelection';
import { activityOptions } from '@/utils/macroCalculatorOptions';
import { CalculatorFormInputs } from '@/components/MacroCalculatorStepper'; // Importar o tipo do componente pai

interface StepActivityLevelProps {
  form: UseFormReturn<CalculatorFormInputs>;
}

const StepActivityLevel = ({ form }: StepActivityLevelProps) => {
  const { control, formState: { errors } } = form;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-4">5. Nível de Atividade Física</h3>
      <p className="text-slate-600 text-sm mb-4">
        Quão ativo você é no seu dia a dia e nos treinos?
      </p>
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
  );
};

export default StepActivityLevel;