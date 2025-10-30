"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isAfter, isToday } from 'date-fns'; // Importar isAfter e isToday
import { ptBR } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError, showSuccess } from '@/utils/toast';
import { useRecordGoalProgress } from '@/hooks/useRecordGoalProgress'; // Importar o novo hook

interface UserGoal {
  id: string;
  goal_name: string;
  target_value?: number | null;
  target_unit?: string | null;
  current_value: number; // The latest value from user_goals
  is_completed: boolean;
}

const recordProgressSchema = z.object({
  value: z.coerce.number().min(0, 'O valor deve ser 0 ou mais.'),
  recorded_date: z.date({ required_error: 'A data do registro é obrigatória.' }),
});

type RecordProgressFormInputs = z.infer<typeof recordProgressSchema>;

interface RecordProgressDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  goal: UserGoal | null;
  onProgressRecorded: () => void; // Callback to refresh goals list
}

const RecordProgressDialog = ({ isOpen, onOpenChange, goal, onProgressRecorded }: RecordProgressDialogProps) => {
  const { user } = useAuth();
  const recordProgressMutation = useRecordGoalProgress(); // Usar o hook de mutação

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecordProgressFormInputs>({
    resolver: zodResolver(recordProgressSchema),
    defaultValues: {
      value: 0,
      recorded_date: new Date(),
    },
  });

  useEffect(() => {
    if (isOpen && goal) {
      reset({
        value: goal.current_value,
        recorded_date: new Date(),
      });
    } else if (!isOpen) {
      reset(); // Clear form when dialog closes
    }
  }, [isOpen, goal, reset]);

  const onSubmit = async (data: RecordProgressFormInputs) => {
    if (!user || !goal) {
      showError("Usuário não autenticado ou meta não selecionada.");
      return;
    }
    if (isAfter(data.recorded_date, new Date()) && !isToday(data.recorded_date)) {
      showError("A data do registro não pode ser no futuro.");
      return;
    }

    recordProgressMutation.mutate(
      {
        userId: user.id,
        goal: goal,
        value: data.value,
        recorded_date: data.recorded_date,
      },
      {
        onSuccess: () => {
          onProgressRecorded(); // Notify parent to refresh
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-pink-500" /> Registrar Progresso: {goal?.goal_name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="value">Valor Atual ({goal?.target_unit || 'unidade'})</Label>
            <Input
              id="value"
              type="number"
              step="0.1"
              placeholder="Ex: 65.2"
              {...register('value', { valueAsNumber: true })}
              className={errors.value ? 'border-red-500' : ''}
            />
            {errors.value && <p className="text-red-500 text-sm">{errors.value.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recorded_date">Data do Registro</Label>
            <Controller
              name="recorded_date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                        errors.recorded_date && "border-red-500"
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
                      disabled={(date) => isAfter(date, new Date()) && !isToday(date)}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.recorded_date && <p className="text-red-500 text-sm">{errors.recorded_date.message}</p>}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancelar</Button>
            <Button type="submit" disabled={recordProgressMutation.isPending}>
              {recordProgressMutation.isPending ? 'Salvando...' : 'Salvar Progresso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordProgressDialog;