"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateNutrient } from '@/utils/nutritionHelpers';
import { Food } from '@/hooks/useSearchFoods'; // Importar a interface Food
import { useUpdateLoggedFood } from '@/hooks/useUpdateLoggedFood'; // Importar o hook de mutação

interface CommonServing {
  unit: string;
  grams: number;
}

interface LoggedFood {
  id: string;
  food_id: string;
  meal_type: string;
  quantity_grams: number; // Total grams logged
  selected_unit: string; // The unit chosen by the user (e.g., 'gramas', 'xícara')
  selected_quantity: number; // The quantity of the chosen unit (e.g., 2 for '2 xícaras')
  log_date: string;
  foods: Food;
}

interface EditLoggedFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingFood: LoggedFood | null;
  userId: string;
  selectedDate: Date;
}

const EditLoggedFoodDialog = ({
  isOpen,
  onOpenChange,
  editingFood,
  userId,
  selectedDate,
}: EditLoggedFoodDialogProps) => {
  const [editingQuantity, setEditingQuantity] = useState<number>(0);
  const [editingUnit, setEditingUnit] = useState<string>('gramas');

  const updateLoggedFoodMutation = useUpdateLoggedFood();

  useEffect(() => {
    if (editingFood) {
      setEditingQuantity(editingFood.selected_quantity);
      setEditingUnit(editingFood.selected_unit);
    }
  }, [editingFood]);

  const getGramsPerUnit = (food: Food, unit: string): number => {
    if (unit === 'gramas') return 1;
    const commonServing = food.common_servings?.find(s => s.unit === unit);
    return commonServing ? commonServing.grams : food.serving_size_grams || 100;
  };

  const handleSaveEditedFood = () => {
    if (!editingFood || editingQuantity <= 0) {
      // showError('Quantidade inválida ou alimento não selecionado.'); // Error handling is in the mutation hook
      return;
    }
    const totalGrams = editingQuantity * getGramsPerUnit(editingFood.foods, editingUnit);

    updateLoggedFoodMutation.mutate({
      userId: userId,
      loggedFoodId: editingFood.id,
      quantityGrams: totalGrams,
      selectedUnit: editingUnit,
      selectedQuantity: editingQuantity,
      logDate: selectedDate,
    }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  const editingFoodAvailableUnits = editingFood ? [
    { value: 'gramas', label: 'Gramas' },
    ...(editingFood.foods.common_servings || []).map(s => ({ value: s.unit, label: s.unit })),
  ] : [{ value: 'gramas', label: 'Gramas' }];

  const currentEditedFoodTotalGrams = editingFood ? editingQuantity * getGramsPerUnit(editingFood.foods, editingUnit) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Alimento</DialogTitle>
          <DialogDescription>
            Ajuste a quantidade e a unidade de {editingFood?.foods.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="edit-quantity" className="sr-only">Quantidade</Label>
            <Input
              id="edit-quantity"
              type="number"
              value={editingQuantity}
              onChange={(e) => setEditingQuantity(parseFloat(e.target.value))}
              min="1"
              className="w-1/2"
            />
            <Select onValueChange={setEditingUnit} value={editingUnit}>
              <SelectTrigger className="w-1/2"> {/* className moved here */}
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                {editingFoodAvailableUnits.map(unit => (
                  <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {editingFood && (
            <div className="text-sm text-slate-600 space-y-1">
              <p>Calorias: {calculateNutrient(editingFood.foods.calories, editingFood.foods.serving_size_grams, currentEditedFoodTotalGrams).toFixed(0)} kcal</p>
              <p>Proteína: {calculateNutrient(editingFood.foods.protein, editingFood.foods.serving_size_grams, currentEditedFoodTotalGrams).toFixed(1)}g</p>
              <p>Carboidratos: {calculateNutrient(editingFood.foods.carbs, editingFood.foods.serving_size_grams, currentEditedFoodTotalGrams).toFixed(1)}g</p>
              <p>Gorduras: {calculateNutrient(editingFood.foods.fat, editingFood.foods.serving_size_grams, currentEditedFoodTotalGrams).toFixed(1)}g</p>
              <p>Fibras: {calculateNutrient(editingFood.foods.fiber, editingFood.foods.serving_size_grams, currentEditedFoodTotalGrams).toFixed(1)}g</p>
              <p>Açúcar: {calculateNutrient(editingFood.foods.sugar, editingFood.foods.serving_size_grams, currentEditedFoodTotalGrams).toFixed(1)}g</p>
              <p>Sódio: {calculateNutrient(editingFood.foods.sodium, editingFood.foods.serving_size_grams, currentEditedFoodTotalGrams).toFixed(0)}mg</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancelar</Button>
          <Button onClick={handleSaveEditedFood} disabled={updateLoggedFoodMutation.isPending}>
            {updateLoggedFoodMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditLoggedFoodDialog;