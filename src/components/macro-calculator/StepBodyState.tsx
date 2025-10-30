"use client";

import { UseFormReturn, Controller } from 'react-hook-form';
import VisualSelection from '@/components/VisualSelection';
import { bodyStateOptions } from '@/utils/macroCalculatorOptions';
import { CalculatorFormInputs } from '@/components/MacroCalculatorStepper'; // Importar o tipo do componente pai

interface StepBodyStateProps {
  form: UseFormReturn<CalculatorFormInputs>;
}

const StepBodyState = ({ form }: StepBodyStateProps) => {
  const { control, formState: { errors } } = form;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-4">3. Como você se sente?</h3>
      <p className="text-slate-600 text-sm mb-4">
        Selecione a opção que melhor descreve seu estado físico atual.
      </p>
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
  );
};

export default StepBodyState;