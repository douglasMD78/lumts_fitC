"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client'; // Importar supabase
import { useAuth } from '@/contexts/AuthContext'; // Importar useAuth
import { showError } from '@/utils/toast'; // Importar showError
import { useSaveUserGoal } from '@/hooks/useSaveUserGoal'; // Importar o novo hook

interface UserGoal {
  id?: string;
  goal_name: string;
  goal_type: string;
  target_value?: number | null;
  target_unit?: string | null;
  target_description?: string | null; // Novo campo
  current_value?: number | null;
  start_date: Date;
  end_date?: Date | null;
  is_completed: boolean;
}

const goalSchema = z.object({
  goal_name: z.string().min(3, 'O nome da meta é obrigatório.'),
  goal_type: z.string().min(1, 'Selecione o tipo de meta.'),
  target_value: z.coerce.number().min(0.1, 'O valor alvo deve ser maior que 0.').nullable().optional(),
  target_unit: z.string().nullable().optional(),
  target_description: z.string().max(255, 'A descrição não pode exceder 255 caracteres.').nullable().optional(), // Novo campo
  current_value: z.coerce.number().min(0, 'O valor atual deve ser 0 ou mais.').nullable().optional(),
  start_date: z.date({ required_error: 'A data de início é obrigatória.' }),
  end_date: z.date().nullable().optional(),
  is_completed: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (['weight', 'workout_frequency', 'workout_duration', 'cardio_distance', 'sleep_duration', 'body_measurement', 'water_intake'].includes(data.goal_type)) {
    if (data.target_value === null || data.target_value === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O valor alvo é obrigatório para este tipo de meta.",
        path: ["target_value"],
      });
    }
    if (data.target_unit === null || data.target_unit === undefined || data.target_unit === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A unidade é obrigatória para este tipo de meta.",
        path: ["target_unit"],
      });
    }
    // Ensure target_description is null for these types
    if (data.target_description !== null && data.target_description !== undefined && data.target_description !== '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A descrição não é aplicável para este tipo de meta.",
        path: ["target_description"],
      });
    }
  } else if (data.goal_type === 'other') {
    if (data.target_description === null || data.target_description === undefined || data.target_description === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A descrição da meta é obrigatória para metas 'Outro'.",
        path: ["target_description"],
      });
    }
    // Ensure target_value and target_unit are null for 'other'
    if (data.target_value !== null && data.target_value !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valor alvo numérico não é aplicável para metas 'Outro'.",
        path: ["target_value"],
      });
    }
    if (data.target_unit !== null && data.target_unit !== undefined && data.target_unit !== '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Unidade não é aplicável para metas 'Outro'. Use a descrição.",
        path: ["target_unit"],
      });
    }
  }
});

type GoalFormInputs = z.infer<typeof goalSchema>;

interface GoalSettingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: UserGoal | null;
}

const goalTypesOptions = [
  { value: 'weight', label: 'Peso Corporal', units: ['kg', 'lbs', 'g'] },
  { value: 'workout_frequency', label: 'Frequência de Treino', units: ['vezes/semana', 'vezes/mês', 'dias/semana'] },
  { value: 'workout_duration', label: 'Duração de Treino', units: ['minutos/dia', 'horas/semana', 'minutos/sessão'] },
  { value: 'cardio_distance', label: 'Distância de Cardio', units: ['km', 'milhas', 'metros'] },
  { value: 'sleep_duration', label: 'Duração do Sono', units: ['horas/dia'] },
  { value: 'body_measurement', label: 'Medida Corporal', units: ['cm', 'polegadas'] },
  { value: 'water_intake', label: 'Ingestão de Água', units: ['litros/dia', 'ml/dia'] },
  { value: 'other', label: 'Outro', units: [] }, // 'other' has no predefined units
];

const GoalSettingDialog = ({ isOpen, onOpenChange, initialData }: GoalSettingDialogProps) => {
  const { user } = useAuth();
  const saveGoalMutation = useSaveUserGoal();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GoalFormInputs>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal_name: '',
      goal_type: '',
      target_value: null,
      target_unit: null,
      target_description: null,
      current_value: null, // Alterado para null como valor padrão para novas metas
      start_date: new Date(),
      end_date: null,
      is_completed: false,
    },
  });

  const selectedGoalType = watch('goal_type');
  const availableUnits = selectedGoalType !== 'other'
    ? (goalTypesOptions.find(opt => opt.value === selectedGoalType)?.units || ['unidade'])
    : [];

  useEffect(() => {
    if (isOpen) {
      reset({
        goal_name: initialData?.goal_name || '',
        goal_type: initialData?.goal_type || '',
        target_value: initialData?.target_value ?? null,
        target_unit: initialData?.target_unit ?? null,
        target_description: initialData?.target_description ?? null,
        current_value: initialData?.current_value ?? null, // Garante null para novas metas ou valor existente
        start_date: initialData?.start_date || new Date(),
        end_date: initialData?.end_date || null,
        is_completed: initialData?.is_completed || false,
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: GoalFormInputs) => {
    if (!user) {
      showError("Você precisa estar logada para salvar metas.");
      return;
    }

    saveGoalMutation.mutate(
      {
        userId: user.id,
        goalData: { // Explicitly cast data to match UserGoal type
          id: initialData?.id,
          goal_name: data.goal_name,
          goal_type: data.goal_type,
          target_value: data.target_value,
          target_unit: data.target_unit,
          target_description: data.target_description,
          current_value: data.current_value,
          start_date: data.start_date,
          end_date: data.end_date,
          is_completed: data.is_completed,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false); // Fecha o diálogo após o sucesso
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="h-6 w-6 mr-2 text-pink-500" /> {initialData ? 'Editar Meta' : 'Definir Nova Meta'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal_name">Nome da Meta</Label>
            <Input 
              id="goal_name" 
              placeholder="Ex: Perder 5kg até o verão" 
              {...register('goal_name')} 
              className={errors.goal_name ? 'border-red-500' : ''} 
            />
            {errors.goal_name && <p className="text-red-500 text-sm">{errors.goal_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal_type">Tipo de Meta</Label>
            <Controller
              name="goal_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(value) => { 
                  field.onChange(value); 
                  setValue('target_value', null, { shouldValidate: true });
                  setValue('target_unit', null, { shouldValidate: true });
                  setValue('target_description', null, { shouldValidate: true });
                  setValue('current_value', null, { shouldValidate: true }); // Reset current_value to null
                }} value={field.value || ''}>
                  <SelectTrigger className={errors.goal_type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o tipo de meta" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypesOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.goal_type && <p className="text-red-500 text-sm">{errors.goal_type.message}</p>}
          </div>

          {/* Conditional rendering for target_value, target_unit, or target_description */}
          {selectedGoalType && (
            <>
              {selectedGoalType !== 'other' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_value">Valor Alvo</Label>
                    <Input 
                      id="target_value" 
                      type="number" 
                      step="0.1" 
                      placeholder="Ex: 60" 
                      {...register('target_value', { valueAsNumber: true })} 
                      className={errors.target_value ? 'border-red-500' : ''} 
                    />
                    {errors.target_value && <p className="text-red-500 text-sm">{errors.target_value.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_unit">Unidade</Label>
                    <Controller
                      name="target_unit"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger className={errors.target_unit ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableUnits.map(unit => (
                              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.target_unit && <p className="text-red-500 text-sm">{errors.target_unit.message}</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="target_description">Descrição da Meta (Ex: 50 flexões por dia)</Label>
                  <Textarea 
                    id="target_description" 
                    placeholder="Descreva sua meta de forma flexível, ex: 'Fazer 50 flexões por dia'" 
                    {...register('target_description')} 
                    className={errors.target_description ? 'border-red-500' : ''} 
                  />
                  {errors.target_description && <p className="text-red-500 text-sm">{errors.target_description.message}</p>}
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="current_value">Valor Atual (Opcional)</Label>
            <Input 
              id="current_value" 
              type="number" 
              step="0.1" 
              placeholder="Ex: 65" 
              {...register('current_value', { valueAsNumber: true })} 
              className={errors.current_value ? 'border-red-500' : ''} 
            />
            {errors.current_value && <p className="text-red-500 text-sm">{errors.current_value.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início</Label>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.start_date && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Término (Opcional)</Label>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.end_date && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancelar</Button>
            <Button type="submit" disabled={saveGoalMutation.isPending}>
              {saveGoalMutation.isPending ? 'Salvando...' : (initialData ? 'Salvar Alterações' : 'Definir Meta')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalSettingDialog;