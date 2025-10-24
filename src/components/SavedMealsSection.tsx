"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Utensils, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import { useSavedMeals, SavedMeal } from '@/hooks/useSavedMeals';
import { useDeleteSavedMeal } from '@/hooks/useDeleteSavedMeal';
import { useAddSavedMealToLog } from '@/hooks/useAddSavedMealToLog';
import { format } from 'date-fns';
import { calculateNutrient } from '@/utils/nutritionHelpers';
import EmptyState from './EmptyState';

interface SavedMealsSectionProps {
  userId: string;
  selectedDate: Date;
  onMealAddedToLog: () => void;
}

const SavedMealsSection = ({ userId, selectedDate, onMealAddedToLog }: SavedMealsSectionProps) => {
  const { data: savedMeals, isLoading: loadingSavedMeals, error: fetchError } = useSavedMeals();
  const deleteSavedMealMutation = useDeleteSavedMeal();
  const addSavedMealToLogMutation = useAddSavedMealToLog();

  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);

  useEffect(() => {
    if (fetchError) {
      showError('Erro ao carregar refeições salvas: ' + fetchError.message);
    }
  }, [fetchError]);

  const handleDeleteMeal = (mealId: string, mealName: string) => {
    if (!window.confirm(`Tem certeza que deseja deletar a refeição "${mealName}"?`)) return;
    deleteSavedMealMutation.mutate({ userId, mealId, mealName });
  };

  const handleAddMealToLog = (meal: SavedMeal) => {
    if (!userId) {
      showError('Você precisa estar logada para adicionar refeições.');
      return;
    }

    const itemsToLog = meal.saved_meal_items.map(item => ({
      food_id: item.food_id,
      quantity_grams: item.quantity_grams,
      selected_unit: item.selected_unit,
      selected_quantity: item.selected_quantity,
    }));

    addSavedMealToLogMutation.mutate(
      {
        userId,
        mealType: 'saved_meal', // Pode ser um tipo genérico ou pedir para o usuário escolher
        logDate: selectedDate,
        items: itemsToLog,
      },
      {
        onSuccess: () => {
          onMealAddedToLog(); // Callback para atualizar o FoodTrackerPage
        },
      }
    );
  };

  if (loadingSavedMeals) {
    return (
      <Card className="p-6 shadow-lg border-pink-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
            <Utensils className="h-6 w-6 mr-3 text-pink-500" /> Minhas Refeições Salvas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Carregando refeições salvas...</p>
        </CardContent>
      </Card>
    );
  }

  if (!savedMeals || savedMeals.length === 0) {
    return (
      <EmptyState
        icon={Utensils}
        title="Nenhuma refeição salva"
        description="Salve suas combinações favoritas para um registro rápido!"
        iconColorClass="text-pink-500"
        className="p-6"
      />
    );
  }

  return (
    <Card className="p-6 shadow-lg border-pink-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
          <Utensils className="h-6 w-6 mr-3 text-pink-500" /> Minhas Refeições Salvas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedMeals.map(meal => {
          const totalCalories = meal.saved_meal_items.reduce((sum, item) =>
            sum + calculateNutrient(item.foods.calories, item.foods.serving_size_grams, item.quantity_grams), 0
          );
          const totalProtein = meal.saved_meal_items.reduce((sum, item) =>
            sum + calculateNutrient(item.foods.protein, item.foods.serving_size_grams, item.quantity_grams), 0
          );
          const totalCarbs = meal.saved_meal_items.reduce((sum, item) =>
            sum + calculateNutrient(item.foods.carbs, item.foods.serving_size_grams, item.quantity_grams), 0
          );
          const totalFat = meal.saved_meal_items.reduce((sum, item) =>
            sum + calculateNutrient(item.foods.fat, item.foods.serving_size_grams, item.quantity_grams), 0
          );

          return (
            <div key={meal.id} className="border border-pink-100 rounded-lg p-3 bg-slate-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{meal.name}</h3>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpandedMealId(expandedMealId === meal.id ? null : meal.id)}
                    aria-label={expandedMealId === meal.id ? "Esconder detalhes" : "Mostrar detalhes"}
                  >
                    {expandedMealId === meal.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMeal(meal.id, meal.name)}
                    disabled={deleteSavedMealMutation.isPending}
                    aria-label={`Deletar refeição ${meal.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {totalCalories.toFixed(0)} kcal | P: {totalProtein.toFixed(1)}g | C: {totalCarbs.toFixed(1)}g | G: {totalFat.toFixed(1)}g
              </p>

              {expandedMealId === meal.id && (
                <div className="mt-3 pt-3 border-t border-pink-100 space-y-2">
                  <p className="font-medium text-sm text-slate-700">Itens:</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {meal.saved_meal_items.map(item => (
                      <li key={item.id}>
                        {item.foods.name} ({item.selected_quantity} {item.selected_unit}) - {calculateNutrient(item.foods.calories, item.foods.serving_size_grams, item.quantity_grams).toFixed(0)} kcal
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                className="w-full mt-4 bg-pink-500 hover:bg-pink-600"
                onClick={() => handleAddMealToLog(meal)}
                disabled={addSavedMealToLogMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar ao Log
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SavedMealsSection;