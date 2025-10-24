"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Utensils, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import { useSaveMeal } from '@/hooks/useSaveMeal';
import { Food } from '@/hooks/useSearchFoods'; // Importar a interface Food

interface LoggedFoodItem {
  id: string;
  food_id: string;
  meal_type: string;
  quantity_grams: number;
  selected_unit: string;
  selected_quantity: number;
  log_date: string;
  foods: Food;
}

const saveMealSchema = z.object({
  mealName: z.string().min(3, 'O nome da refeição é obrigatório.').max(100, 'O nome da refeição é muito longo.'),
});

type SaveMealFormInputs = z.infer<typeof saveMealSchema>;

interface SaveMealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  foodsToSave: LoggedFoodItem[];
}

const SaveMealDialog = ({ isOpen, onOpenChange, foodsToSave }: SaveMealDialogProps) => {
  const { user } = useAuth();
  const saveMealMutation = useSaveMeal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaveMealFormInputs>({
    resolver: zodResolver(saveMealSchema),
    defaultValues: {
      mealName: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: SaveMealFormInputs) => {
    if (!user) {
      showError('Você precisa estar logada para salvar refeições.');
      return;
    }
    if (foodsToSave.length === 0) {
      showError('Não há alimentos para salvar nesta refeição.');
      return;
    }

    const itemsPayload = foodsToSave.map(item => ({
      food_id: item.food_id,
      quantity_grams: item.quantity_grams,
      selected_unit: item.selected_unit,
      selected_quantity: item.selected_quantity,
    }));

    saveMealMutation.mutate(
      {
        userId: user.id,
        mealName: data.mealName,
        items: itemsPayload,
      },
      {
        onSuccess: () => {
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
            <Save className="h-6 w-6 mr-2 text-pink-500" /> Salvar Refeição Padrão
          </DialogTitle>
          <DialogDescription>
            Dê um nome à sua refeição para salvá-la e adicioná-la rapidamente no futuro.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mealName">Nome da Refeição</Label>
            <Input
              id="mealName"
              placeholder="Ex: Café da Manhã Fit, Almoço Rápido"
              {...register('mealName')}
              className={errors.mealName ? 'border-red-500' : ''}
            />
            {errors.mealName && <p className="text-red-500 text-sm">{errors.mealName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Alimentos nesta refeição:</Label>
            <ul className="list-disc list-inside text-sm text-slate-600 max-h-32 overflow-y-auto border p-2 rounded-md">
              {foodsToSave.length > 0 ? (
                foodsToSave.map(food => (
                  <li key={food.id}>{food.foods.name} ({food.selected_quantity} {food.selected_unit})</li>
                ))
              ) : (
                <li>Nenhum alimento selecionado.</li>
              )}
            </ul>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancelar</Button>
            <Button type="submit" disabled={saveMealMutation.isPending}>
              {saveMealMutation.isPending ? 'Salvando...' : 'Salvar Refeição'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveMealDialog;