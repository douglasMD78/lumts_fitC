"use client";

import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import VisualSelection from '@/components/VisualSelection';
import { genderOptions } from '@/utils/macroCalculatorOptions';
import { CalculatorFormInputs } from '@/components/MacroCalculatorStepper'; // Importar o tipo do componente pai

interface StepGenderProps {
  form: UseFormReturn<CalculatorFormInputs>;
}

const StepGender = ({ form }: StepGenderProps) => {
  const { control, formState: { errors } } = form;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-4">2. Qual seu Gênero?</h3>
      <p className="text-slate-600 text-sm mb-4">
        Isso nos ajuda a ajustar as fórmulas de cálculo para você.
      </p>
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
  );
};

export default StepGender;