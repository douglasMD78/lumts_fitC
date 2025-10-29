"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Weight, Ruler } from 'lucide-react';
import { CalculatorFormInputs } from '@/components/MacroCalculatorStepper'; // Importar o tipo do componente pai

interface StepPersonalDataProps {
  form: UseFormReturn<CalculatorFormInputs>;
}

const StepPersonalData = ({ form }: StepPersonalDataProps) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-4">1. Seus Dados Pessoais</h3>
      <p className="text-slate-600 text-sm mb-4">
        Precisamos de algumas informações básicas para começar seu cálculo.
      </p>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="font-semibold text-pink-700 flex items-center" htmlFor="age">
            <CalendarDays className="h-5 w-5 mr-2" /> Idade
          </Label>
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
          <Label className="font-semibold text-pink-700 flex items-center" htmlFor="weight">
            <Weight className="h-5 w-5 mr-2" /> Peso (kg)
          </Label>
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
          <Label className="font-semibold text-pink-700 flex items-center" htmlFor="height">
            <Ruler className="h-5 w-5 mr-2" /> Altura (cm)
          </Label>
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
  );
};

export default StepPersonalData;