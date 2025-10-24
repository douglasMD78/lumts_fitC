"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showError, showSuccess } from "@/utils/toast";
import { Droplet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Importar o novo hook
import { useSaveMenstrualCycleConfig } from '@/hooks/useSaveMenstrualCycleConfig';

const setupSchema = z.object({
  lastPeriodStartDate: z.date({
    required_error: "A data da última menstruação é obrigatória.",
    invalid_type_error: "Data inválida.",
  }),
  cycleLength: z.coerce.number().min(20, "Ciclo deve ter no mínimo 20 dias").max(45, "Ciclo deve ter no máximo 45 dias"),
  menstrualLength: z.coerce.number().min(2, "Menstruação deve ter no mínimo 2 dias").max(10, "Menstruação deve ter no máximo 10 dias"),
});

type SetupFormInputs = z.infer<typeof setupSchema>;

const CycleTrackerConfigPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormInputs>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      lastPeriodStartDate: undefined,
      cycleLength: 28,
      menstrualLength: 5,
    },
  });

  const saveMenstrualCycleConfigMutation = useSaveMenstrualCycleConfig();

  const onSubmit = async (data: SetupFormInputs) => {
    if (!user) {
      showError("Você precisa estar logada para salvar os dados do ciclo.");
      return;
    }
    saveMenstrualCycleConfigMutation.mutate({
      userId: user.id,
      lastPeriodStartDate: data.lastPeriodStartDate,
      cycleLength: data.cycleLength,
      menstrualLength: data.menstrualLength,
    });
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <Droplet className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Sincronize seu ciclo com seu treino.</h2>
          <p className="text-purple-600 text-base">Vamos começar com algumas informações básicas para personalizar sua jornada.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="lastPeriodStartDate" className="font-semibold text-purple-700">Data da Última Menstruação</Label>
            <Controller
              name="lastPeriodStartDate"
              control={control}
              render={({ field }) => (
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  locale={ptBR}
                  className="rounded-md border w-full"
                />
              )}
            />
            {errors.lastPeriodStartDate && <p className="text-red-500 text-sm mt-1">{errors.lastPeriodStartDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycleLength" className="font-semibold text-purple-700">Duração Média do Ciclo (dias)</Label>
            <Input
              id="cycleLength"
              type="number"
              placeholder="28"
              {...control.register("cycleLength")}
              className={errors.cycleLength ? 'border-red-500' : ''}
            />
            {errors.cycleLength && <p className="text-red-500 text-sm mt-1">{errors.cycleLength.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="menstrualLength" className="font-semibold text-purple-700">Duração Média da Menstruação (dias)</Label>
            <Input
              id="menstrualLength"
              type="number"
              placeholder="5"
              {...control.register("menstrualLength")}
              className={errors.menstrualLength ? 'border-red-500' : ''}
            />
            {errors.menstrualLength && <p className="text-red-500 text-sm mt-1">{errors.menstrualLength.message}</p>}
          </div>

          <Button type="submit" className="btn-calculate bg-purple-500 hover:bg-purple-600" disabled={saveMenstrualCycleConfigMutation.isPending}>
            {saveMenstrualCycleConfigMutation.isPending ? 'Salvando...' : 'VER MEU STATUS DE HOJE'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CycleTrackerConfigPage;