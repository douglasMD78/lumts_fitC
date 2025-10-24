"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Utensils, Flame, Beef, Carrot, Nut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import { useFrequentFoods } from '@/hooks/useFrequentFoods'; // Removido Food daqui
import { Food } from '@/hooks/useSearchFoods'; // Importado Food de useSearchFoods
import { calculateNutrient } from '@/utils/nutritionHelpers';
import EmptyState from './EmptyState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FrequentFoodsSectionProps {
  userId: string;
  onFoodAdd: (food: Food, selectedQuantity: number, selectedUnit: string, totalGrams: number, mealType: string) => void;
  isAddingFood: boolean;
}

const FrequentFoodsSection = ({ userId, onFoodAdd, isAddingFood }: FrequentFoodsSectionProps) => {
  const { data: frequentFoods, isLoading: loadingFrequentFoods, error: fetchError } = useFrequentFoods();
  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);
  const [selectedFoodToAdd, setSelectedFoodToAdd] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('gramas');
  const [mealType, setMealType] = useState<string>('snack'); // Default meal type

  useEffect(() => {
    if (fetchError) {
      showError('Erro ao carregar alimentos frequentes: ' + fetchError.message);
    }
  }, [fetchError]);

  const getGramsPerUnit = (food: Food, unit: string): number => {
    if (unit === 'gramas') return 1;
    const commonServing = food.common_servings?.find(s => s.unit === unit);
    return commonServing ? commonServing.grams : food.serving_size_grams || 100;
  };

  const handleOpenAddFoodDialog = (food: Food) => {
    setSelectedFoodToAdd(food);
    setQuantity(food.serving_size_grams || 100);
    setSelectedUnit('gramas');
    setMealType('snack'); // Reset to default
    setIsAddFoodDialogOpen(true);
  };

  const handleConfirmAddFood = () => {
    if (!selectedFoodToAdd || quantity <= 0) {
      showError('Quantidade inválida ou alimento não selecionado.');
      return;
    }

    const gramsPerUnit = getGramsPerUnit(selectedFoodToAdd, selectedUnit);
    const totalGrams = quantity * gramsPerUnit;

    onFoodAdd(selectedFoodToAdd, quantity, selectedUnit, totalGrams, mealType);
    setIsAddFoodDialogOpen(false);
    setSelectedFoodToAdd(null);
  };

  const currentFoodTotalGrams = selectedFoodToAdd ? quantity * getGramsPerUnit(selectedFoodToAdd, selectedUnit) : 0;

  const availableUnits = selectedFoodToAdd ? [
    { value: 'gramas', label: 'Gramas' },
    ...(selectedFoodToAdd.common_servings || []).map(s => ({ value: s.unit, label: s.unit })),
  ] : [{ value: 'gramas', label: 'Gramas' }];

  const mealTypesOptions = [
    { key: 'breakfast', label: 'Café da Manhã' },
    { key: 'lunch', label: 'Almoço' },
    { key: 'dinner', label: 'Jantar' },
    { key: 'snack', label: 'Lanche' },
  ];

  if (loadingFrequentFoods) {
    return (
      <Card className="p-6 shadow-lg border-pink-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
            <Utensils className="h-6 w-6 mr-3 text-pink-500" /> Alimentos Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Carregando alimentos frequentes...</p>
        </CardContent>
      </Card>
    );
  }

  if (!frequentFoods || frequentFoods.length === 0) {
    return (
      <EmptyState
        icon={Utensils}
        title="Nenhum alimento frequente"
        description="Comece a registrar seus alimentos para ver seus favoritos aqui!"
        iconColorClass="text-pink-500"
        className="p-6"
      />
    );
  }

  return (
    <Card className="p-6 shadow-lg border-pink-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
          <Utensils className="h-6 w-6 mr-3 text-pink-500" /> Alimentos Frequentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {frequentFoods.map(food => (
            <Button
              key={food.id}
              variant="outline"
              className="flex flex-col items-center justify-center text-center h-auto py-4 px-3 rounded-xl transition-all duration-200 min-h-[100px] bg-white border-gray-200 text-slate-700 hover:bg-pink-50/50 hover:border-pink-200"
              onClick={() => handleOpenAddFoodDialog(food)}
              disabled={isAddingFood}
            >
              <span className="font-bold text-base">{food.name}</span>
              <p className="text-xs mt-1 text-slate-500">{food.calories} kcal / {food.serving_size_grams}g</p>
            </Button>
          ))}
        </div>

        <Dialog open={isAddFoodDialogOpen} onOpenChange={setIsAddFoodDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar {selectedFoodToAdd?.name}</DialogTitle>
              <DialogDescription>
                Ajuste a quantidade e o tipo de refeição.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedFoodToAdd && (
                <div className="space-y-3 p-3 border rounded-md bg-slate-50">
                  <p className="font-semibold text-slate-800">{selectedFoodToAdd.name}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <p>Calorias: {calculateNutrient(selectedFoodToAdd.calories, selectedFoodToAdd.serving_size_grams, currentFoodTotalGrams).toFixed(0)} kcal</p>
                    <p>Proteína: {calculateNutrient(selectedFoodToAdd.protein, selectedFoodToAdd.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</p>
                    <p>Carboidratos: {calculateNutrient(selectedFoodToAdd.carbs, selectedFoodToAdd.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</p>
                    <p>Gorduras: {calculateNutrient(selectedFoodToAdd.fat, selectedFoodToAdd.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="add-quantity" className="sr-only">Quantidade</Label>
                    <Input
                      id="add-quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value))}
                      placeholder="Quantidade"
                      min="1"
                      className="w-1/2"
                    />
                    <Select onValueChange={setSelectedUnit} value={selectedUnit}>
                      <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUnits.map(unit => (
                          <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meal-type">Tipo de Refeição</Label>
                    <Select onValueChange={setMealType} value={mealType}>
                      <SelectTrigger id="meal-type">
                        <SelectValue placeholder="Selecione o tipo de refeição" />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypesOptions.map(meal => (
                          <SelectItem key={meal.key} value={meal.key}>{meal.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddFoodDialogOpen(false)} type="button">Cancelar</Button>
              <Button onClick={handleConfirmAddFood} disabled={isAddingFood}>
                {isAddingFood ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FrequentFoodsSection;