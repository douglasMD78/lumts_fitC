"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Plus, Search, Utensils, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { calculateNutrient } from '@/utils/nutritionHelpers'; // Importar calculateNutrient
import { useSearchFoods, Food } from '@/hooks/useSearchFoods'; // Importar o novo hook e a interface Food

interface CommonServing {
  unit: string;
  grams: number;
}

interface FoodSearchInputProps {
  onFoodAdd: (food: Food, selectedQuantity: number, selectedUnit: string, totalGrams: number) => void;
  mealLabel: string;
  disabled?: boolean;
}

const FoodSearchInput = ({ onFoodAdd, mealLabel, disabled = false }: FoodSearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('gramas');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: searchResults, isLoading: loadingSearchResults, error: searchError } = useSearchFoods(searchTerm);

  useEffect(() => {
    if (searchError) {
      showError('Erro ao buscar alimentos: ' + searchError.message);
    }
  }, [searchError]);

  const getGramsPerUnit = (food: Food, unit: string): number => {
    if (unit === 'gramas') return 1;
    const commonServing = food.common_servings?.find(s => s.unit === unit);
    return commonServing ? commonServing.grams : food.serving_size_grams || 100;
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setSearchTerm(food.name);
    setSelectedUnit('gramas');
    setQuantity(food.serving_size_grams || 100);
    setIsPopoverOpen(false);
  };

  const handleAddFood = () => {
    if (!selectedFood) {
      showError('Por favor, selecione um alimento.');
      return;
    }
    if (quantity <= 0) {
      showError('A quantidade deve ser maior que zero.');
      return;
    }

    const gramsPerUnit = getGramsPerUnit(selectedFood, selectedUnit);
    const totalGrams = quantity * gramsPerUnit;

    onFoodAdd(selectedFood, quantity, selectedUnit, totalGrams);
    setSelectedFood(null);
    setSearchTerm('');
    setQuantity(1);
    setSelectedUnit('gramas');
  };

  const currentFoodTotalGrams = selectedFood ? quantity * getGramsPerUnit(selectedFood, selectedUnit) : 0;

  const availableUnits = selectedFood ? [
    { value: 'gramas', label: 'Gramas' },
    ...(selectedFood.common_servings || []).map(s => ({ value: s.unit, label: s.unit })),
  ] : [{ value: 'gramas', label: 'Gramas' }];

  return (
    <div className="space-y-3">
      <Label htmlFor={`search-food-${mealLabel}`} className="sr-only">Buscar alimento para {mealLabel}</Label>
      <Popover open={isPopoverOpen && !disabled} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id={`search-food-${mealLabel}`}
              placeholder={`Buscar alimento para ${mealLabel}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedFood(null);
                setIsPopoverOpen(true);
              }}
              className="pl-10"
              disabled={disabled}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <ScrollArea className="h-48">
            {loadingSearchResults ? (
              <p className="p-4 text-center text-slate-500">Buscando...</p>
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSelectFood(food)}
                >
                  <span className="font-medium">{food.name}</span>
                  <span className="text-sm text-slate-500">{food.calories} kcal/{food.serving_size_grams}g</span>
                </div>
              ))
            ) : searchTerm.length >= 2 && !loadingSearchResults ? (
              <p className="p-4 text-center text-slate-500">Nenhum alimento encontrado.</p>
            ) : (
              <p className="p-4 text-center text-slate-500">Comece a digitar para buscar alimentos.</p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedFood && (
        <div className="space-y-3 p-3 border rounded-md bg-slate-50">
          <p className="font-semibold text-slate-800">{selectedFood.name}</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            <p>Calorias: {calculateNutrient(selectedFood.calories, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(0)} kcal</p>
            <p>Proteína: {calculateNutrient(selectedFood.protein, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</p>
            <p>Carboidratos: {calculateNutrient(selectedFood.carbs, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</p>
            <p>Gorduras: {calculateNutrient(selectedFood.fat, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</p>
            <p>Fibras: {calculateNutrient(selectedFood.fiber, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</p>
            <p>Açúcar: {calculateNutrient(selectedFood.sugar, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</p>
            <p>Sódio: {calculateNutrient(selectedFood.sodium, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(0)}mg</p>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor={`quantity-${mealLabel}`} className="sr-only">Quantidade</Label>
            <Input
              id={`quantity-${mealLabel}`}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              placeholder="Quantidade"
              min="1"
              className="w-1/3"
              disabled={disabled}
            />
            <Select onValueChange={setSelectedUnit} value={selectedUnit} disabled={disabled}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map(unit => (
                  <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddFood} className="w-1/3 bg-pink-500 hover:bg-pink-600" disabled={disabled}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setSelectedFood(null); setSearchTerm(''); setQuantity(1); setSelectedUnit('gramas'); }} 
            className="w-full text-sm text-slate-500 hover:text-pink-500 flex items-center justify-center"
          >
            <XCircle className="h-4 w-4 mr-1" /> Limpar seleção
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodSearchInput;