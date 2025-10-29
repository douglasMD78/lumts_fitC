"use client";

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import BodyFatCalculatorDialog from '@/components/macro-calculator/BodyFatCalculatorDialog';
import { CalculatorFormInputs } from '@/components/MacroCalculatorStepper'; // Importar o tipo do componente pai

interface StepBodyFatPercentageProps {
  form: UseFormReturn<CalculatorFormInputs>;
}

const StepBodyFatPercentage = ({ form }: StepBodyFatPercentageProps) => {
  const { register, watch, setValue, formState: { errors } } = form;
  const [isBfDialogOpen, setIsBfDialogOpen] = useState(false);

  const currentGender = watch('gender');
  const currentHeight = watch('height');

  const handleCalculatedBF = (bf: number) => {
    setValue('bodyFatPercentage', bf, { shouldValidate: true });
    setIsBfDialogOpen(false);
  };

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-4">4. Percentual de Gordura Corporal (Opcional)</h3>
      <p className="text-slate-600 text-sm mb-4">
        Se você souber seu percentual de gordura, insira-o para um cálculo mais preciso. Caso contrário, pode deixar em branco.
      </p>
      <div className="space-y-2">
        <Label className="font-semibold text-pink-700 flex items-center" htmlFor="bodyFatPercentage">
          <Scale className="h-5 w-5 mr-2" /> % Gordura Corporal
        </Label>
        <Input
          id="bodyFatPercentage"
          type="number"
          step="0.1"
          placeholder="Ex: 25.0"
          {...register("bodyFatPercentage")}
          className={errors.bodyFatPercentage ? "border-red-500" : ""}
        />
        {errors.bodyFatPercentage && <p className="text-red-500 text-sm mt-1">{errors.bodyFatPercentage.message}</p>}
      </div>
      <div className="mt-4 text-center">
        <Dialog open={isBfDialogOpen} onOpenChange={setIsBfDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2">
              <Scale className="h-4 w-4" /> Não sabe seu BF%? Calcule aqui!
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-2 text-pink-500" /> Calcular BF%
              </DialogTitle>
            </DialogHeader>
            <BodyFatCalculatorDialog
              onCalculateBF={handleCalculatedBF}
              initialGender={currentGender}
              initialHeight={currentHeight}
            />
            <div className="text-center text-sm text-slate-600 mt-4">
              Para uma calculadora mais completa, visite a <Link to="/calculadora-bf" className="font-bold text-pink-500 hover:underline">página dedicada</Link>.
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StepBodyFatPercentage;