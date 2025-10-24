"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Plus, Search, Utensils, XCircle, Filter, User, Database, Globe, CheckCircle } from 'lucide-react'; // Adicionado CheckCircle
import { showError } from '@/utils/toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateNutrient } from '@/utils/nutritionHelpers';
import { useSearchFoods, Food } from '@/hooks/useSearchFoods';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface FoodSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFoodAdd: (food: Food, selectedQuantity: number, selectedUnit: string, totalGrams: number, mealType: string) => void; // Adicionado mealType aqui
  initialMealType?: string; // Novo: para pré-selecionar o tipo de refeição
  isAddingFood: boolean;
}

const mealTypesOptions = [
  { key: 'breakfast', label: 'Café da Manhã' },
  { key: 'lunch', label: 'Almoço' },
  { key: 'dinner', label: 'Jantar' },
  { key: 'snack', label: 'Lanche' },
];

const FoodSearchModal = ({ isOpen, onOpenChange, onFoodAdd, initialMealType, isAddingFood }: FoodSearchModalProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('gramas');
  const [selectedMealType, setSelectedMealType] = useState<string>(initialMealType || 'snack'); // Usar initialMealType
  // const [filterSource, setFilterSource] = useState<string>('all'); // Removido o estado do filtro

  const { data: searchResults, isLoading: loadingSearchResults, error: searchError } = useSearchFoods(searchTerm);

  useEffect(() => {
    if (searchError) showError('Erro ao buscar alimentos: ' + searchError.message);
  }, [searchError]);

  useEffect(() => {
    if (isOpen) {
      setSelectedMealType(initialMealType || 'snack'); // Resetar para initialMealType ou padrão ao abrir
    } else {
      setSearchTerm('');
      setSelectedFood(null);
      setQuantity(1);
      setSelectedUnit('gramas');
      // setFilterSource('all'); // Removido o reset do filtro
    }
  }, [isOpen, initialMealType]);

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
  };

  const handleConfirmAddFood = () => {
    if (!selectedFood) {
      showError('Por favor, selecione um alimento.');
      return;
    }
    if (quantity <= 0) {
      showError('A quantidade deve ser maior que zero.');
      return;
    }
    if (!selectedMealType) {
      showError('Por favor, selecione o tipo de refeição.');
      return;
    }

    const gramsPerUnit = getGramsPerUnit(selectedFood, selectedUnit);
    const totalGrams = quantity * gramsPerUnit;

    onFoodAdd(selectedFood, quantity, selectedUnit, totalGrams, selectedMealType);
    onOpenChange(false);
  };

  const currentFoodTotalGrams = selectedFood ? quantity * getGramsPerUnit(selectedFood, selectedUnit) : 0;

  const availableUnits = selectedFood ? [
    { value: 'gramas', label: 'Gramas' },
    ...(selectedFood.common_servings || []).map(s => ({ value: s.unit, label: s.unit })),
  ] : [{ value: 'gramas', label: 'Gramas' }];

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'user_custom': return <User className="h-3 w-3 text-pink-500" />;
      case 'admin_official': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'local': return <Database className="h-3 w-3 text-purple-500" />;
      case 'open_food_facts': return <Globe className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'user_custom': return 'Cadastrado por usuário';
      case 'admin_official': return 'Oficial';
      case 'local': return 'LumtsFit';
      case 'open_food_facts': return 'Open Food Facts (legado)';
      default: return 'Outros';
    }
  };

  const groupedFoods = useCallback(() => {
    if (!searchResults) return {};

    const grouped: { [source: string]: Food[] } = {};

    searchResults.forEach(food => {
      const actualSource = food.source;
      if (!grouped[actualSource]) {
        grouped[actualSource] = [];
      }
      grouped[actualSource].push(food);
    });

    // Ordem de exibição: Oficial, Meus Alimentos, LumtsFit, Outros
    const orderedSources = ['admin_official', 'user_custom', 'local'].filter(source => grouped[source]);
    const result: { [source: string]: Food[] } = {};
    orderedSources.forEach(source => {
      result[source] = grouped[source];
    });

    return result;
  }, [searchResults]); // Removido filterSource da dependência

  const foodsToDisplay = groupedFoods();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Utensils className="h-6 w-6 mr-2 text-pink-500" /> Adicionar Alimento
          </DialogTitle>
          <DialogDescription>
            Busque por alimentos e selecione a refeição.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow flex flex-col space-y-4 py-4 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar alimento..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedFood(null);
              }}
              className="pl-10"
              disabled={isAddingFood}
            />
          </div>

          {/* Removido o seletor de filtro de fonte */}
          {/*
          <div className="flex items-center space-x-2">
            <Label htmlFor="filter-source" className="sr-only">Filtrar por Fonte</Label>
            <Select onValueChange={setFilterSource} value={filterSource} disabled={isAddingFood}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filtrar por fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Fontes</SelectItem>
                {user && <SelectItem value="admin_official">Oficiais</SelectItem>}
                {user && <SelectItem value="user_custom">Meus Alimentos</SelectItem>}
                <SelectItem value="local">LumtsFit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          */}

          <ScrollArea className="flex-grow border rounded-md p-2">
            {loadingSearchResults ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : Object.keys(foodsToDisplay).length > 0 ? (
              Object.entries(foodsToDisplay).map(([source, foods]) => (
                <div key={source} className="mb-4">
                  <h3 className="flex items-center text-sm font-semibold text-slate-700 mb-2 px-2">
                    {getSourceIcon(source)}
                    <span className="ml-2">{getSourceLabel(source)}</span>
                  </h3>
                  <div className="space-y-1">
                    {foods.map((food) => (
                      <div
                        key={food.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 cursor-pointer hover:bg-slate-50 rounded-md transition-colors duration-150"
                        onClick={() => handleSelectFood(food)}
                      >
                        <span className="font-medium text-slate-800">{food.name}</span>
                        <div className="text-xs text-slate-500 sm:text-right mt-1 sm:mt-0">
                          <span>{food.calories} kcal</span>
                          <span className="ml-2">P: {food.protein.toFixed(1)}g</span>
                          <span className="ml-2">C: {food.carbs.toFixed(1)}g</span>
                          <span className="ml-2">G: {food.fat.toFixed(1)}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : searchTerm.length >= 2 && !loadingSearchResults ? (
              <p className="p-4 text-center text-slate-500">Nenhum alimento encontrado.</p>
            ) : (
              <p className="p-4 text-center text-slate-500">Comece a digitar para buscar alimentos.</p>
            )}
          </ScrollArea>

          {selectedFood && (
            <div className="space-y-3 p-3 border rounded-md bg-slate-50">
              <p className="font-semibold text-slate-800 text-lg">{selectedFood.name}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <p>Calorias: <span className="font-medium">{calculateNutrient(selectedFood.calories, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(0)} kcal</span></p>
                <p>Proteína: <span className="font-medium">{calculateNutrient(selectedFood.protein, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</span></p>
                <p>Carboidratos: <span className="font-medium">{calculateNutrient(selectedFood.carbs, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</span></p>
                <p>Gorduras: <span className="font-medium">{calculateNutrient(selectedFood.fat, selectedFood.serving_size_grams, currentFoodTotalGrams).toFixed(1)}g</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="quantity" className="sr-only">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                  placeholder="Quantidade"
                  min="1"
                  className="w-1/2"
                  disabled={isAddingFood}
                />
                <Select onValueChange={setSelectedUnit} value={selectedUnit} disabled={isAddingFood}>
                  <SelectTrigger className="w-1/2"> {/* className moved here */}
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
                <Select onValueChange={setSelectedMealType} value={selectedMealType} disabled={isAddingFood}>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedFood(null); setSearchTerm(''); setQuantity(1); setSelectedUnit('gramas'); }}
                className="w-full text-sm text-slate-500 hover:text-pink-500 flex items-center justify-center"
                disabled={isAddingFood}
              >
                <XCircle className="h-4 w-4 mr-1" /> Limpar seleção
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="mt-auto">
          <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancelar</Button>
          <Button onClick={handleConfirmAddFood} disabled={isAddingFood || !selectedFood || !selectedMealType}>
            {isAddingFood ? 'Adicionando...' : 'Adicionar Alimento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FoodSearchModal;