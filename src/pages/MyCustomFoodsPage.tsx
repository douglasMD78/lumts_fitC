"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Utensils, Plus, Trash2, Edit, Flame, Beef, Carrot, Nut, XCircle, PlusCircle } from 'lucide-react';
import AddCustomFoodDialog from '@/components/AddCustomFoodDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { commonServingSchema, customFoodSchema } from '@/utils/schemas'; // Importar schemas
import EmptyState from '@/components/EmptyState'; // Importar EmptyState

// Importar os novos hooks de mutação
import { useAddCustomFood } from '@/hooks/useAddCustomFood';
import { useUpdateCustomFood } from '@/hooks/useUpdateCustomFood';
import { useDeleteCustomFood } from '@/hooks/useDeleteCustomFood';
import { useCustomFoods, Food } from '@/hooks/useCustomFoods'; // Importar o novo hook e a interface Food


type CustomFoodFormInputs = z.infer<typeof customFoodSchema>;

const MyCustomFoodsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Usar o hook de query para buscar a lista de alimentos
  const { data: customFoods, isLoading: loadingFoods, error: fetchError } = useCustomFoods(user?.id);

  // Usar os hooks de mutação
  const addCustomFoodMutation = useAddCustomFood();
  const updateCustomFoodMutation = useUpdateCustomFood();
  const deleteCustomFoodMutation = useDeleteCustomFood();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CustomFoodFormInputs>({
    resolver: zodResolver(customFoodSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "common_servings",
  });

  useEffect(() => {
    if (fetchError) {
      showError('Erro ao carregar alimentos personalizados: ' + fetchError.message);
    }
  }, [fetchError]);

  useEffect(() => {
    if (!isEditDialogOpen) {
      reset(); // Limpa o formulário de edição ao fechar o diálogo
    }
  }, [isEditDialogOpen, reset]);

  const handleAddFood = async (foodData: CustomFoodFormInputs) => {
    if (!user) {
      showError('Você precisa estar logada para adicionar alimentos personalizados.');
      return;
    }
    addCustomFoodMutation.mutate(
      { userId: user.id, foodData: foodData },
      {
        onSuccess: () => setIsAddDialogOpen(false),
      }
    );
  };

  const handleEditFood = (food: Food) => {
    setEditingFood(food);
    reset({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      serving_size_grams: food.serving_size_grams,
      fiber: food.fiber,
      sugar: food.sugar,
      sodium: food.sodium,
      common_servings: food.common_servings || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedFood = async (foodData: CustomFoodFormInputs) => {
    if (!user || !editingFood) return;
    updateCustomFoodMutation.mutate(
      { userId: user.id, foodId: editingFood.id, foodData: { id: editingFood.id, ...foodData } }, // Passar id explicitamente
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingFood(null);
        },
      }
    );
  };

  const handleDeleteFood = async (foodId: string, foodName: string) => {
    if (!user || !window.confirm(`Tem certeza que deseja deletar o alimento "${foodName}"? Esta ação é irreversível.`)) return;
    deleteCustomFoodMutation.mutate({ userId: user.id, foodId, foodName });
  };

  if (authLoading || loadingFoods) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando seus alimentos personalizados...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Você precisa estar logada para ver seus alimentos personalizados.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Meus Alimentos Personalizados</h1>
            <p className="text-slate-600">Gerencie os alimentos que você adicionou.</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-pink-500 hover:bg-pink-600">
            <Plus className="h-5 w-5 mr-2" /> Adicionar Novo
          </Button>
        </div>

        {customFoods && customFoods.length === 0 ? (
          <EmptyState
            icon={Utensils}
            title="Nenhum alimento personalizado"
            description="Adicione seus próprios alimentos para um rastreamento nutricional ainda mais preciso."
            buttonText="Adicionar Meu Primeiro Alimento"
            buttonLink="#" // Link placeholder, action is handled by setIsAddDialogOpen
            iconColorClass="text-pink-500"
            buttonVariant="default"
            onClick={() => setIsAddDialogOpen(true)} // Add onClick to the card
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customFoods && customFoods.map((food) => (
              <Card key={food.id} className="relative bg-white rounded-2xl shadow-lg border border-pink-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold text-slate-800">{food.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditFood(food)} aria-label={`Editar ${food.name}`}>
                      <Edit className="h-5 w-5 text-blue-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteFood(food.id, food.name)} 
                      aria-label={`Remover ${food.name}`}
                      disabled={deleteCustomFoodMutation.isPending}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 text-pink-500 mr-2" />
                    <span className="font-semibold">Calorias:</span> {food.calories} kcal ({food.serving_size_grams}g)
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center"><Beef className="h-4 w-4 text-pink-500 mr-2" /> P: {food.protein}g</div>
                    <div className="flex items-center"><Carrot className="h-4 w-4 text-pink-500 mr-2" /> C: {food.carbs}g</div>
                    <div className="flex items-center"><Nut className="h-4 w-4 text-pink-500 mr-2" /> G: {food.fat}g</div>
                  </div>
                  {(food.fiber !== null || food.sugar !== null || food.sodium !== null) && (
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 pt-2 border-t border-pink-50">
                      {food.fiber !== null && <div>Fibras: {food.fiber}g</div>}
                      {food.sugar !== null && <div>Açúcar: {food.sugar}g</div>}
                      {food.sodium !== null && <div>Sódio: {food.sodium}mg</div>}
                    </div>
                  )}
                  {food.common_servings && food.common_servings.length > 0 && (
                    <div className="pt-2 border-t border-pink-50">
                      <p className="font-semibold text-xs text-slate-700 mb-1">Unidades:</p>
                      <ul className="list-disc list-inside text-xs text-slate-600">
                        {food.common_servings.map((serving, idx) => (
                          <li key={idx}>{serving.unit}: {serving.grams}g</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Custom Food Dialog (reused) */}
        <AddCustomFoodDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          // onSave={handleAddFood} // Removido, agora gerenciado pelo hook
          // loading={addCustomFoodMutation.isPending} // Removido, agora gerenciado pelo hook
        />

        {/* Edit Custom Food Dialog (reusing the form structure) */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="h-6 w-6 mr-2 text-blue-500" /> Editar Alimento Personalizado
              </DialogTitle>
              <DialogDescription>
                Ajuste os detalhes de "{editingFood?.name}".
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleSaveEditedFood)} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Alimento</Label>
                <Input id="edit-name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-calories">Calorias (kcal)</Label>
                  <Input id="edit-calories" type="number" {...register('calories')} className={errors.calories ? 'border-red-500' : ''} />
                  {errors.calories && <p className="text-red-500 text-sm">{errors.calories.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-serving_size_grams">Porção Padrão (g)</Label>
                  <Input id="edit-serving_size_grams" type="number" {...register('serving_size_grams')} className={errors.serving_size_grams ? 'border-red-500' : ''} />
                  {errors.serving_size_grams && <p className="text-red-500 text-sm">{errors.serving_size_grams.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-protein">Proteína (g)</Label>
                  <Input id="edit-protein" type="number" step="0.1" {...register('protein')} className={errors.protein ? 'border-red-500' : ''} />
                  {errors.protein && <p className="text-red-500 text-sm">{errors.protein.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-carbs">Carboidratos (g)</Label>
                  <Input id="edit-carbs" type="number" step="0.1" {...register('carbs')} className={errors.carbs ? 'border-red-500' : ''} />
                  {errors.carbs && <p className="text-red-500 text-sm">{errors.carbs.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fat">Gorduras (g)</Label>
                  <Input id="edit-fat" type="number" step="0.1" {...register('fat')} className={errors.fat ? 'border-red-500' : ''} />
                  {errors.fat && <p className="text-red-500 text-sm">{errors.fat.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fiber">Fibras (g)</Label>
                  <Input id="edit-fiber" type="number" step="0.1" {...register('fiber')} className={errors.fiber ? 'border-red-500' : ''} />
                  {errors.fiber && <p className="text-red-500 text-sm">{errors.fiber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sugar">Açúcar (g)</Label>
                  <Input id="edit-sugar" type="number" step="0.1" {...register('sugar')} className={errors.sugar ? 'border-red-500' : ''} />
                  {errors.sugar && <p className="text-red-500 text-sm">{errors.sugar.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sodium">Sódio (mg)</Label>
                  <Input id="edit-sodium" type="number" step="1" {...register('sodium')} className={errors.sodium ? 'border-red-500' : ''} />
                  {errors.sodium && <p className="text-red-500 text-sm">{errors.sodium.message}</p>}
                </div>
              </div>

              <div className="space-y-3 mt-4 border-t pt-4 border-gray-200">
                <Label className="font-semibold text-pink-700">Unidades de Porção Personalizadas</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`edit-common_servings.${index}.unit`} className="sr-only">Nome da Unidade</Label>
                      <Input
                        id={`edit-common_servings.${index}.unit`}
                        placeholder="Ex: xícara, unidade"
                        {...register(`common_servings.${index}.unit`)}
                        className={errors.common_servings?.[index]?.unit ? 'border-red-500' : ''}
                      />
                      {errors.common_servings?.[index]?.unit && <p className="text-red-500 text-xs mt-1">{errors.common_servings[index].unit.message}</p>}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`edit-common_servings.${index}.grams`} className="sr-only">Gramas</Label>
                      <Input
                        id={`edit-common_servings.${index}.grams`}
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

              <DialogFooter className="mt-6">
                <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} type="button">Cancelar</Button>
                <Button type="submit" disabled={updateCustomFoodMutation.isPending}>
                  {updateCustomFoodMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyCustomFoodsPage;