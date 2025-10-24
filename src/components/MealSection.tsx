"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Utensils, Coffee, Soup, Salad, Apple, Plus } from 'lucide-react'; // Adicionado Plus
import LoggedFoodItemSkeleton from '@/components/LoggedFoodItemSkeleton';
import { calculateNutrient } from '@/utils/nutritionHelpers';
import { Food } from '@/hooks/useSearchFoods'; // Importar a interface Food

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

interface MealSectionProps {
  mealKey: string;
  mealLabel: string;
  loggedFoods: LoggedFood[] | undefined;
  loadingLoggedFoods: boolean;
  onEditLoggedFood: (food: LoggedFood) => void;
  onDeleteLoggedFood: (id: string) => void;
  isAddingFood: boolean;
  isDeletingFood: boolean;
  onAddFoodClick: (mealKey: string) => void; // Novo prop para abrir o modal
}

const MealSection = ({
  mealKey,
  mealLabel,
  loggedFoods,
  loadingLoggedFoods,
  onEditLoggedFood,
  onDeleteLoggedFood,
  isAddingFood,
  isDeletingFood,
  onAddFoodClick, // Usar o novo prop
}: MealSectionProps) => {

  const getMealIcon = (key: string) => {
    switch (key) {
      case 'breakfast': return <Coffee className="h-5 w-5 mr-2 text-pink-500" />;
      case 'lunch': return <Soup className="h-5 w-5 mr-2 text-purple-500" />;
      case 'dinner': return <Salad className="h-5 w-5 mr-2 text-blue-500" />;
      case 'snack': return <Apple className="h-5 w-5 mr-2 text-green-500" />;
      default: return <Utensils className="h-5 w-5 mr-2 text-slate-500" />;
    }
  };

  const calculateMealTotals = () => {
    let mealCalories = 0;
    let mealProtein = 0;
    let mealCarbs = 0;
    let mealFat = 0;

    loggedFoods
      ?.filter(log => log.meal_type === mealKey)
      .forEach(log => {
        const food = log.foods;
        if (food) {
          mealCalories += calculateNutrient(food.calories, food.serving_size_grams, log.quantity_grams);
          mealProtein += calculateNutrient(food.protein, food.serving_size_grams, log.quantity_grams);
          mealCarbs += calculateNutrient(food.carbs, food.serving_size_grams, log.quantity_grams);
          mealFat += calculateNutrient(food.fat, food.serving_size_grams, log.quantity_grams);
        }
      });
    return { mealCalories, mealProtein, mealCarbs, mealFat };
  };

  const { mealCalories, mealProtein, mealCarbs, mealFat } = calculateMealTotals();

  return (
    <Card className="p-4 shadow-lg border-pink-100">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center">
          {getMealIcon(mealKey)}
          <CardTitle className="text-xl font-bold text-slate-800 capitalize">{mealLabel}</CardTitle>
        </div>
        <div className="text-sm text-slate-600">
          {mealCalories.toFixed(0)} kcal | P: {mealProtein.toFixed(1)}g | C: {mealCarbs.toFixed(1)}g | G: {mealFat.toFixed(1)}g
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loadingLoggedFoods ? (
          Array.from({ length: 2 }).map((_, index) => (
            <LoggedFoodItemSkeleton key={index} />
          ))
        ) : loggedFoods && loggedFoods.filter(log => log.meal_type === mealKey).length > 0 ? (
          loggedFoods
            .filter(log => log.meal_type === mealKey)
            .map(log => (
              <div key={log.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
                <div>
                  <p className="font-medium text-slate-700">{log.foods.name}</p>
                  <p className="text-sm text-slate-500">
                    {log.selected_quantity} {log.selected_unit} - {calculateNutrient(log.foods.calories, log.foods.serving_size_grams, log.quantity_grams).toFixed(0)} kcal
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => onEditLoggedFood(log)} aria-label={`Editar ${log.foods.name}`}>
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteLoggedFood(log.id)}
                    aria-label={`Remover ${log.foods.name}`}
                    disabled={isDeletingFood}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
        ) : (
          <p className="text-slate-500 text-sm text-center py-4">Nenhum alimento registrado para {mealLabel.toLowerCase()}.</p>
        )}
        <Button
          variant="outline"
          className="w-full mt-4 border-pink-200 text-pink-500 hover:bg-pink-50/50"
          onClick={() => onAddFoodClick(mealKey)}
          disabled={isAddingFood}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Alimento
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealSection;