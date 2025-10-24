"use client";

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface DailyEntry {
  id: string;
  entry_date: string;
  energy_level: string | null;
  strength_level: string | null;
  notes: string | null;
  sleep_quality: string | null;
  stress_level: string | null;
  workout_intensity: string | null;
}

// Schema Zod para validação do formulário de registro diário
const dailyLogSchema = z.object({
  energy_level: z.string().optional(),
  strength_level: z.string().optional(),
  sleep_quality: z.string().optional(),
  stress_level: z.string().optional(),
  workout_intensity: z.string().optional(),
  notes: z.string().max(500, "As notas não podem exceder 500 caracteres").optional(),
});

type DailyLogFormInputs = z.infer<typeof dailyLogSchema>;

interface DailyLogFormProps {
  selectedDate: Date | undefined;
  initialEntry: DailyEntry | null;
  onSave: (entryData: Partial<DailyEntry>) => Promise<void>;
  loading: boolean;
  onClose: () => void;
}

const DailyLogForm = ({ selectedDate, initialEntry, onSave, loading, onClose }: DailyLogFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DailyLogFormInputs>({
    resolver: zodResolver(dailyLogSchema),
    defaultValues: {
      energy_level: '',
      strength_level: '',
      sleep_quality: '',
      stress_level: '',
      workout_intensity: '',
      notes: '',
    },
  });

  useEffect(() => {
    reset({
      energy_level: initialEntry?.energy_level || '',
      strength_level: initialEntry?.strength_level || '',
      sleep_quality: initialEntry?.sleep_quality || '',
      stress_level: initialEntry?.stress_level || '',
      workout_intensity: initialEntry?.workout_intensity || '',
      notes: initialEntry?.notes || '',
    });
  }, [initialEntry, selectedDate, reset]);

  const onSubmit = (data: DailyLogFormInputs) => {
    onSave(data);
  };

  const fields = [
    { id: 'energy_level', label: 'Nível de Energia', options: ['muito_alta', 'alta', 'moderada', 'baixa', 'muito_baixa'] },
    { id: 'strength_level', label: 'Nível de Força', options: ['muito_forte', 'forte', 'normal', 'fraca', 'muito_fraca'] },
    { id: 'sleep_quality', label: 'Qualidade do Sono', options: ['otima', 'boa', 'regular', 'ruim', 'muito_ruim'] },
    { id: 'stress_level', label: 'Nível de Estresse', options: ['baixo', 'moderado', 'alto', 'muito_alto'] },
    { id: 'workout_intensity', label: 'Intensidade do Treino', options: ['nenhum', 'leve', 'moderado', 'intenso', 'muito_intenso'] },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      {fields.map(field => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Controller
            name={field.id as keyof DailyLogFormInputs}
            control={control}
            render={({ field: controllerField }) => (
              <Select onValueChange={controllerField.onChange} value={controllerField.value}>
                <SelectTrigger id={field.id}><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {field.options.map(opt => <SelectItem key={opt} value={opt}>{opt.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {errors[field.id as keyof DailyLogFormInputs] && <p className="text-red-500 text-sm mt-1">{errors[field.id as keyof DailyLogFormInputs]?.message}</p>}
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="notes">Notas Adicionais</Label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea id="notes" placeholder="Alguma observação sobre o dia?" {...field} />
          )}
        />
        {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>}
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Registro'}</Button>
      </DialogFooter>
    </form>
  );
};

export default DailyLogForm;