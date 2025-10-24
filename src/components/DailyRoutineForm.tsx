"use client";

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface DailyRoutine {
  id?: string;
  routine_date: string;
  workout_type: string | null;
  workout_duration_minutes: number | null;
  workout_intensity: string | null;
  cardio_type: string | null;
  cardio_duration_minutes: number | null;
  cardio_distance_km: number | null;
  diet_notes: string | null;
  mood_level: string | null;
  sleep_hours: number | null;
  general_notes: string | null;
}

const routineSchema = z.object({
  workout_type: z.string().nullable().optional(),
  workout_duration_minutes: z.coerce.number().min(0, "Duração deve ser 0 ou mais").nullable().optional(),
  workout_intensity: z.string().nullable().optional(),
  cardio_type: z.string().nullable().optional(),
  cardio_duration_minutes: z.coerce.number().min(0, "Duração deve ser 0 ou mais").nullable().optional(),
  cardio_distance_km: z.coerce.number().min(0, "Distância deve ser 0 ou mais").nullable().optional(),
  diet_notes: z.string().max(500, "Notas de dieta não podem exceder 500 caracteres").nullable().optional(),
  mood_level: z.string().nullable().optional(),
  sleep_hours: z.coerce.number().min(0, "Horas de sono devem ser 0 ou mais").max(24, "Horas de sono inválidas").nullable().optional(),
  general_notes: z.string().max(500, "Notas gerais não podem exceder 500 caracteres").nullable().optional(),
}).refine(data => {
  // Custom validation: if workout_type is provided, duration and intensity should ideally be too.
  // Making them optional in schema, but can add a warning/error here if needed.
  return true;
});

type RoutineFormInputs = z.infer<typeof routineSchema>;

interface DailyRoutineFormProps {
  initialData?: DailyRoutine;
  onSave: (data: Partial<DailyRoutine>) => Promise<void>;
  loading: boolean;
  onClose: () => void;
}

const workoutTypes = [
  { value: 'none', label: 'Nenhum' },
  { value: 'strength', label: 'Força' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'dance', label: 'Dança' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'rest', label: 'Descanso Ativo' },
];

const workoutIntensities = [
  { value: 'light', label: 'Leve' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'intense', label: 'Intenso' },
  { value: 'very_intense', label: 'Muito Intenso' },
];

const cardioTypes = [
  { value: 'none', label: 'Nenhum' },
  { value: 'running', label: 'Corrida' },
  { value: 'cycling', label: 'Ciclismo' },
  { value: 'swimming', label: 'Natação' },
  { value: 'walking', label: 'Caminhada' },
  { value: 'elliptical', label: 'Elíptico' },
  { value: 'stairs', label: 'Escada' },
];

const moodLevels = [
  { value: 'great', label: 'Ótimo' },
  { value: 'good', label: 'Bom' },
  { value: 'neutral', label: 'Neutro' },
  { value: 'bad', label: 'Ruim' },
  { value: 'stressed', label: 'Estressado' },
  { value: 'tired', label: 'Cansado' },
];

const DailyRoutineForm = ({ initialData, onSave, loading, onClose }: DailyRoutineFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch, // Adicionado watch
    setValue, // Adicionado setValue
    formState: { errors },
  } = useForm<RoutineFormInputs>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      workout_type: initialData?.workout_type || '',
      workout_duration_minutes: initialData?.workout_duration_minutes || undefined,
      workout_intensity: initialData?.workout_intensity || '',
      cardio_type: initialData?.cardio_type || '',
      cardio_duration_minutes: initialData?.cardio_duration_minutes || undefined,
      cardio_distance_km: initialData?.cardio_distance_km || undefined,
      diet_notes: initialData?.diet_notes || '',
      mood_level: initialData?.mood_level || '',
      sleep_hours: initialData?.sleep_hours || undefined,
      general_notes: initialData?.general_notes || '',
    },
  });

  const watchedWorkoutType = watch('workout_type');
  const watchedCardioType = watch('cardio_type');

  useEffect(() => {
    reset({
      workout_type: initialData?.workout_type || '',
      workout_duration_minutes: initialData?.workout_duration_minutes || undefined,
      workout_intensity: initialData?.workout_intensity || '',
      cardio_type: initialData?.cardio_type || '',
      cardio_duration_minutes: initialData?.cardio_duration_minutes || undefined,
      cardio_distance_km: initialData?.cardio_distance_km || undefined,
      diet_notes: initialData?.diet_notes || '',
      mood_level: initialData?.mood_level || '',
      sleep_hours: initialData?.sleep_hours || undefined,
      general_notes: initialData?.general_notes || '',
    });
  }, [initialData, reset]);

  // Efeito para limpar e desabilitar campos de treino
  useEffect(() => {
    if (watchedWorkoutType === 'none') {
      setValue('workout_duration_minutes', null);
      setValue('workout_intensity', null);
    }
  }, [watchedWorkoutType, setValue]);

  // Efeito para limpar e desabilitar campos de cardio
  useEffect(() => {
    if (watchedCardioType === 'none') {
      setValue('cardio_duration_minutes', null);
      setValue('cardio_distance_km', null);
    }
  }, [watchedCardioType, setValue]);

  const onSubmit = (data: RoutineFormInputs) => {
    onSave(data);
  };

  const isWorkoutDisabled = watchedWorkoutType === 'none';
  const isCardioDisabled = watchedCardioType === 'none';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      {/* Workout Section */}
      <h3 className="text-lg font-bold text-pink-700 mt-4">Treino</h3>
      <div className="space-y-2">
        <Label htmlFor="workout_type">Tipo de Treino</Label>
        <Controller
          name="workout_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger id="workout_type"><SelectValue placeholder="Selecione o tipo de treino" /></SelectTrigger>
              <SelectContent>
                {workoutTypes.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
        {errors.workout_type && <p className="text-red-500 text-sm mt-1">{errors.workout_type.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workout_duration_minutes">Duração (min)</Label>
          <Input
            id="workout_duration_minutes"
            type="number"
            placeholder="Ex: 60"
            min="0"
            step="5"
            {...register("workout_duration_minutes", { valueAsNumber: true })}
            className={errors.workout_duration_minutes ? 'border-red-500' : ''}
            disabled={isWorkoutDisabled}
          />
          {errors.workout_duration_minutes && <p className="text-red-500 text-sm mt-1">{errors.workout_duration_minutes.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="workout_intensity">Intensidade</Label>
          <Controller
            name="workout_intensity"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''} disabled={isWorkoutDisabled}>
                <SelectTrigger id="workout_intensity"><SelectValue placeholder="Selecione a intensidade" /></SelectTrigger>
                <SelectContent>
                  {workoutIntensities.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {errors.workout_intensity && <p className="text-red-500 text-sm mt-1">{errors.workout_intensity.message}</p>}
        </div>
      </div>

      {/* Cardio Section */}
      <h3 className="text-lg font-bold text-pink-700 mt-6">Cardio</h3>
      <div className="space-y-2">
        <Label htmlFor="cardio_type">Tipo de Cardio</Label>
        <Controller
          name="cardio_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger id="cardio_type"><SelectValue placeholder="Selecione o tipo de cardio" /></SelectTrigger>
              <SelectContent>
                {cardioTypes.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
        {errors.cardio_type && <p className="text-red-500 text-sm mt-1">{errors.cardio_type.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cardio_duration_minutes">Duração (min)</Label>
          <Input
            id="cardio_duration_minutes"
            type="number"
            placeholder="Ex: 30"
            min="0"
            step="5"
            {...register("cardio_duration_minutes", { valueAsNumber: true })}
            className={errors.cardio_duration_minutes ? 'border-red-500' : ''}
            disabled={isCardioDisabled}
          />
          {errors.cardio_duration_minutes && <p className="text-red-500 text-sm mt-1">{errors.cardio_duration_minutes.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardio_distance_km">Distância (km)</Label>
          <Input
            id="cardio_distance_km"
            type="number"
            step="0.1"
            placeholder="Ex: 5.0"
            min="0"
            {...register("cardio_distance_km", { valueAsNumber: true })}
            className={errors.cardio_distance_km ? 'border-red-500' : ''}
            disabled={isCardioDisabled}
          />
          {errors.cardio_distance_km && <p className="text-red-500 text-sm mt-1">{errors.cardio_distance_km.message}</p>}
        </div>
      </div>

      {/* Diet Notes */}
      <h3 className="text-lg font-bold text-pink-700 mt-6">Dieta</h3>
      <div className="space-y-2">
        <Label htmlFor="diet_notes">Notas sobre a Dieta</Label>
        <Textarea
          id="diet_notes"
          placeholder="Ex: Comi mais vegetais hoje, evitei doces."
          rows={3}
          {...register('diet_notes')}
          className={errors.diet_notes ? 'border-red-500' : ''}
        />
        {errors.diet_notes && <p className="text-red-500 text-sm mt-1">{errors.diet_notes.message}</p>}
      </div>

      {/* Well-being Section */}
      <h3 className="text-lg font-bold text-pink-700 mt-6">Bem-estar</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mood_level">Humor</Label>
          <Controller
            name="mood_level"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger id="mood_level"><SelectValue placeholder="Como você se sente?" /></SelectTrigger>
                <SelectContent>
                  {moodLevels.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mood_level && <p className="text-red-500 text-sm mt-1">{errors.mood_level.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sleep_hours">Horas de Sono</Label>
          <Input
            id="sleep_hours"
            type="number"
            step="0.5"
            placeholder="Ex: 7.5"
            min="0"
            max="24"
            {...register("sleep_hours", { valueAsNumber: true })}
            className={errors.sleep_hours ? 'border-red-500' : ''}
          />
          {errors.sleep_hours && <p className="text-red-500 text-sm mt-1">{errors.sleep_hours.message}</p>}
        </div>
      </div>

      {/* General Notes */}
      <div className="space-y-2 mt-6">
        <Label htmlFor="general_notes">Notas Gerais</Label>
        <Textarea
          id="general_notes"
          placeholder="Qualquer outra observação importante sobre o seu dia."
          rows={3}
          {...register('general_notes')}
          className={errors.general_notes ? 'border-red-500' : ''}
        />
        {errors.general_notes && <p className="text-red-500 text-sm mt-1">{errors.general_notes.message}</p>}
      </div>

      <DialogFooter className="mt-6">
        <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Rotina'}</Button>
      </DialogFooter>
    </form>
  );
};

export default DailyRoutineForm;