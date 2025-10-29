"use client";

import React, { useEffect } from 'react';
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from "@/components/ui/dialog";
import { Scale } from 'lucide-react';
import { showError } from '@/utils/toast';
import { calculateBodyFatPercentage, BodyFatCalculationInputs } from '@/utils/bodyFatCalculations';
import { Link } from 'react-router-dom';
import { genderOptions } from '@/utils/macroCalculatorOptions'; // Importar de macroCalculatorOptions

// Schema Zod para o formulário de cálculo de BF% dentro do diálogo
const bfCalculatorDialogSchema = z.object({
  gender: z.enum(['male', 'female'], { message: "Selecione o gênero" }),
  height: z.coerce.number().min(50, "Altura deve ser maior que 0").max(250, "Altura inválida"),
  neck: z.coerce.number().min(20, "Pescoço deve ser maior que 0").max(60, "Pescoço inválido"),
  waist: z.coerce.number().min(40, "Cintura deve ser maior que 0").max(150, "Cintura inválida"),
  hip: z.coerce.number().min(50, "Quadril deve ser maior que 0").max(150, "Quadril inválido").optional(),
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

export type BfCalculatorDialogInputs = z.infer<typeof bfCalculatorDialogSchema>;

interface BodyFatCalculatorDialogProps {
  onCalculateBF: (bf: number) => void;
  initialGender?: 'male' | 'female';
  initialHeight?: number;
}

const BodyFatCalculatorDialog = ({ onCalculateBF, initialGender, initialHeight }: BodyFatCalculatorDialogProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BfCalculatorDialogInputs>({
    resolver: zodResolver(bfCalculatorDialogSchema),
    defaultValues: {
      gender: initialGender,
      height: initialHeight,
      neck: undefined,
      waist: undefined,
      hip: undefined,
    },
  });

  const watchedGender = watch('gender');

  const onSubmit = (data: BfCalculatorDialogInputs) => {
    try {
      const calculatedBF = calculateBodyFatPercentage(data as BodyFatCalculationInputs);
      onCalculateBF(calculatedBF);
    } catch (error: any) {
      showError("Erro ao calcular BF%: " + error.message);
    }
  };

  useEffect(() => {
    if (initialGender) setValue('gender', initialGender);
    if (initialHeight) setValue('height', initialHeight);
  }, [initialGender, initialHeight, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label className="font-semibold text-pink-700">Gênero</Label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Selecione seu gênero" /></SelectTrigger>
              <SelectContent>
                {genderOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="height-bf" className="font-semibold text-pink-700">Altura (cm)</Label>
        <Input
          id="height-bf"
          type="number"
          placeholder="Ex: 165"
          {...register("height", { valueAsNumber: true })}
          className={errors.height ? "border-red-500" : ""}
        />
        {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="neck-bf" className="font-semibold text-pink-700">Pescoço (cm)</Label>
        <Input
          id="neck-bf"
          type="number"
          step="0.1"
          placeholder="Ex: 34.5"
          {...register("neck", { valueAsNumber: true })}
          className={errors.neck ? "border-red-500" : ""}
        />
        {errors.neck && <p className="text-red-500 text-sm mt-1">{errors.neck.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="waist-bf" className="font-semibold text-pink-700">Cintura (cm)</Label>
        <Input
          id="waist-bf"
          type="number"
          step="0.1"
          placeholder="Ex: 70.0"
          {...register("waist", { valueAsNumber: true })}
          className={errors.waist ? "border-red-500" : ""}
        />
        {errors.waist && <p className="text-red-500 text-sm mt-1">{errors.waist.message}</p>}
      </div>
      {watchedGender === 'female' && (
        <div className="space-y-2">
          <Label htmlFor="hip-bf" className="font-semibold text-pink-700">Quadril (cm)</Label>
          <Input
            id="hip-bf"
            type="number"
            step="0.1"
            placeholder="Ex: 98.0"
            {...register("hip", { valueAsNumber: true })}
            className={errors.hip ? "border-red-500" : ""}
          />
          {errors.hip && <p className="text-red-500 text-sm mt-1">{errors.hip.message}</p>}
        </div>
      )}
      <DialogFooter>
        <Button type="submit" className="btn-calculate">Calcular BF%</Button>
      </DialogFooter>
    </form>
  );
};

export default BodyFatCalculatorDialog;