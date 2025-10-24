"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // Explicitly import z
import { Utensils, PlusCircle, XCircle } from 'lucide-react';
import { commonServingSchema, customFoodSchema } from '@/utils/schemas';
import { useAddCustomFood } from '@/hooks/useAddCustomFood';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import { useUserProfile } from '@/hooks/useUserProfile'; // Importar useUserProfile
import { Checkbox } from '@/components/ui/checkbox'; // Importar Checkbox
import { CustomFoodData } from '@/hooks/useAddCustomFood'; // Importar a interface CustomFoodData

type CustomFoodFormInputs = z.infer<typeof customFoodSchema>;

interface AddCustomFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCustomFoodDialog = ({ isOpen, onOpenChange }: AddCustomFoodDialogProps) => {
  const { user } = useAuth();
  const { data: userProfile, isLoading: loadingProfile } = useUserProfile(); // Obter perfil do usuário
  const addCustomFoodMutation = useAddCustomFood();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CustomFoodFormInputs>({
    resolver: zodResolver(customFoodSchema),
    defaultValues: {
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      serving_size_grams: 100,
      fiber: null,
      sugar: null,
      sodium: null,
      common_servings: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "common_servings",
  });

  const [isOfficial, setIsOfficial] = useState(false); // Estado para o checkbox oficial

  const onSubmit = async (data: CustomFoodFormInputs) => {
    if (!user) {
      showError('Você precisa estar logada para adicionar alimentos personalizados.');
      return;
    }
    // Explicitamente construir o objeto foodData para corresponder à interface CustomFoodData
    const foodDataPayload: CustomFoodData = {
      name: data.name,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      serving_size_grams: data.serving_size_grams,
      fiber: data.fiber,
      sugar: data.sugar,
      sodium: data.sodium,
      common_servings: data.common_servings,
    };

    addCustomFoodMutation.mutate(
      { userId: user.id, foodData: foodDataPayload, isOfficial: isOfficial }, // Passar isOfficial
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          setIsOfficial(false); // Resetar o estado do checkbox
        },
      }
    );
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      setIsOfficial(false); // Resetar o estado do checkbox ao fechar
    }
  }, [isOpen, reset]);

  const isAdmin = userProfile?.role === 'admin'; // Verificar se o usuário é admin

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Utensils className="h-6 w-6 mr-2 text-pink-500" /> Adicionar Alimento Personalizado
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Alimento</Label>
            <Input id="name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calorias (kcal)</Label>
              <Input id="calories" type="number" {...register('calories')} className={errors.calories ? 'border-red-500' : ''} />
              {errors.calories && <p className="text-red-500 text-sm">{errors.calories.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="serving_size_grams">Porção Padrão (g)</Label>
              <Input id="serving_size_grams" type="number" {...register('serving_size_grams')} className={errors.serving_size_grams ? 'border-red-500' : ''} />
              {errors.serving_size_grams && <p className="text-red-500 text-sm">{errors.serving_size_grams.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein">Proteína (g)</Label>
              <Input id="protein" type="number" step="0.1" {...register('protein')} className={errors.protein ? 'border-red-500' : ''} />
              {errors.protein && <p className="text-red-500 text-sm">{errors.protein.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carboidratos (g)</Label>
              <Input id="carbs" type="number" step="0.1" {...register('carbs')} className={errors.carbs ? 'border-red-500' : ''} />
              {errors.carbs && <p className="text-red-500 text-sm">{errors.carbs.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Gorduras (g)</Label>
              <Input id="fat" type="number" step="0.1" {...register('fat')} className={errors.fat ? 'border-red-500' : ''} />
              {errors.fat && <p className="text-red-500 text-sm">{errors.fat.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiber">Fibras (g)</Label>
              <Input id="fiber" type="number" step="0.1" {...register('fiber')} className={errors.fiber ? 'border-red-500' : ''} />
              {errors.fiber && <p className="text-red-500 text-sm">{errors.fiber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sugar">Açúcar (g)</Label>
              <Input id="sugar" type="number" step="0.1" {...register('sugar')} className={errors.sugar ? 'border-red-500' : ''} />
              {errors.sugar && <p className="text-red-500 text-sm">{errors.sugar.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sodium">Sódio (mg)</Label>
              <Input id="sodium" type="number" step="1" {...register('sodium')} className={errors.sodium ? 'border-red-500' : ''} />
              {errors.sodium && <p className="text-red-500 text-sm">{errors.sodium.message}</p>}
            </div>
          </div>

          {/* Dynamic fields for common_servings */}
          <div className="space-y-3 mt-4 border-t pt-4 border-gray-200">
            <Label className="font-semibold text-pink-700">Unidades de Porção Personalizadas</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`common_servings.${index}.unit`} className="sr-only">Nome da Unidade</Label>
                  <Input
                    id={`common_servings.${index}.unit`}
                    placeholder="Ex: xícara, unidade"
                    {...register(`common_servings.${index}.unit`)}
                    className={errors.common_servings?.[index]?.unit ? 'border-red-500' : ''}
                  />
                  {errors.common_servings?.[index]?.unit && <p className="text-red-500 text-xs mt-1">{errors.common_servings[index].unit.message}</p>}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`common_servings.${index}.grams`} className="sr-only">Gramas</Label>
                  <Input
                    id={`common_servings.${index}.grams`}
                    type="number"
                    placeholder="Gramas"
                    {...register(`common_servings.${index}.grams`, { valueAsNumber: true })}
                    className={errors.common_servings?.[index]?.grams ? 'border-red-500' : ''}
                  />
                  {errors.common_servings?.[index]?.grams && <p className="text-red-500 text-xs mt-1">{errors.common_servings[index].grams.message}</p>}
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-red-500 hover:bg-red-50">
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ unit: '', grams: 0 })}
              className="w-full flex items-center justify-center gap-2 text-pink-500 border-pink-200 hover:bg-pink-50"
            >
              <PlusCircle className="h-4 w-4" /> Adicionar Unidade
            </Button>
          </div>

          {isAdmin && ( // Mostrar apenas para administradores
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="isOfficial"
                checked={isOfficial}
                onCheckedChange={(checked) => setIsOfficial(!!checked)}
              />
              <Label htmlFor="isOfficial" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Marcar como alimento oficial
              </Label>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancelar</Button>
            <Button type="submit" disabled={addCustomFoodMutation.isPending}>
              {addCustomFoodMutation.isPending ? 'Salvando...' : 'Salvar Alimento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomFoodDialog;