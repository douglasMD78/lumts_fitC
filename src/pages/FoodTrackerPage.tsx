"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Utensils, Plus, Flame, Beef, Carrot, Nut, Save } from 'lucide-react';
import { format } from 'date-fns';
import { calculateNutrient } from '@/utils/nutritionHelpers';

// Componentes modulares
import DateNavigator from '@/components/DateNavigator';
import MealSection from '@/components/MealSection';
import EditLoggedFoodDialog from '@/components/EditLoggedFoodDialog';
import DailyMacroSummary from '@/components/DailyMacroSummary';
import LoginGate from '@/components/LoginGate';
import DailyMacroSummarySkeleton from '@/components/DailyMacroSummarySkeleton';
import AddCustomFoodDialog from '@/components/AddCustomFoodDialog';
import SaveMealDialog from '@/components/SaveMealDialog';
import SavedMealsSection from '@/components/SavedMealsSection';
import FrequentFoodsSection from '@/components/FrequentFoodsSection';
import FoodSearchModal from '@/components/FoodSearchModal'; // Novo componente
import WeeklyNutritionInsights from '@/components/WeeklyNutritionInsights'; // Novo componente
import AddFoodFAB from '@/components/AddFoodFAB'; // Importar o novo FAB

// Hooks
import { useLatestMacroPlan } from '@/hooks/useLatestMacroPlan';
import { useLoggedFoodsForDate } from '@/hooks/useLoggedFoodsForDate';
import { useCustomFoodsCount } from '@/hooks/useCustomFoodsCount';
import { useAddLoggedFood } from '@/hooks/useAddLoggedFood';
import { useUpdateLoggedFood } from '@/hooks/useUpdateLoggedFood';
import { useDeleteLoggedFood } from '@/hooks/useDeleteLoggedFood';
import { Food } from '@/hooks/useSearchFoods'; // Importar a interface Food

interface CommonServing {
  unit: string;
  grams: number;
}

interface LoggedFood {
  id: string;
  food_id: string;
  meal_type: string;
  quantity_grams: number;
  selected_unit: string;
  selected_quantity: number;
  log_date: string;
  foods: Food;
}

const mealTypes = [
  { key: 'breakfast', label: 'Café da Manhã' },
  { key: 'lunch', label: 'Almoço' },
  { key: 'dinner', label: 'Jantar' },
  { key: 'snack', label: 'Lanche' },
];

const FoodTrackerPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCustomFoodDialogOpen, setIsCustomFoodDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<LoggedFood | null>(null);
  const [isSaveMealDialogOpen, setIsSaveMealDialogOpen] = useState(false);
  const [isFoodSearchModalOpen, setIsFoodSearchModalOpen] = useState(false);
  const [currentMealTypeForModal, setCurrentMealTypeForModal] = useState<string | undefined>(undefined); // Novo estado

  // Hooks de dados
  const { data: loggedFoods, isLoading: loadingLoggedFoods, error: loggedFoodsError, refetch: refetchLoggedFoods } = useLoggedFoodsForDate(selectedDate);
  const { data: macroPlan, isLoading: loadingMacroPlan, error: macroPlanError } = useLatestMacroPlan();
  const { refetch: refetchCustomFoodsCount } = useCustomFoodsCount();

  // Hooks de mutação
  const addLoggedFoodMutation = useAddLoggedFood();
  const updateLoggedFoodMutation = useUpdateLoggedFood();
  const deleteLoggedFoodMutation = useDeleteLoggedFood();

  useEffect(() => {
    if (macroPlanError) showError('Erro ao carregar plano de macros: ' + macroPlanError.message);
    if (loggedFoodsError) showError('Erro ao carregar alimentos registrados: ' + loggedFoodsError.message);
  }, [macroPlanError, loggedFoodsError]);

  const handleFoodAdd = (food: Food, selectedQuantity: number, selectedUnit: string, totalGrams: number, mealType: string) => {
    if (!user) {
      showError('Você precisa estar logada para registrar alimentos.');
      return;
    }
    addLoggedFoodMutation.mutate({
      userId: user.id,
      foodId: food.id,
      mealType: mealType,
      quantityGrams: totalGrams,
      selectedUnit: selectedUnit,
      selectedQuantity: selectedQuantity,
      logDate: selectedDate,
    });
  };

  const handleEditLoggedFood = (food: LoggedFood) => {
    setEditingFood(food);
    setIsEditDialogOpen(true);
  };

  const handleDeleteLoggedFood = (id: string) => {
    if (!user || !window.confirm('Tem certeza que deseja remover este alimento?')) return;
    deleteLoggedFoodMutation.mutate({
      userId: user.id,
      loggedFoodId: id,
      logDate: selectedDate,
    });
  };

  const handleOpenFoodSearchModal = (mealType?: string) => {
    setCurrentMealTypeForModal(mealType);
    setIsFoodSearchModalOpen(true);
  };

  const calculateDailyTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    loggedFoods?.forEach(log => {
      const food = log.foods;
      if (food) {
        totalCalories += calculateNutrient(food.calories, food.serving_size_grams, log.quantity_grams);
        totalProtein += calculateNutrient(food.protein, food.serving_size_grams, log.quantity_grams);
        totalCarbs += calculateNutrient(food.carbs, food.serving_size_grams, log.quantity_grams);
        totalFat += calculateNutrient(food.fat, food.serving_size_grams, log.quantity_grams);
      }
    });

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateDailyTotals();

  const isLoadingData = authLoading || loadingLoggedFoods || loadingMacroPlan;

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando seu rastreador de alimentos...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
        <LoginGate
          message="Crie uma conta ou faça login para rastrear seus alimentos e macros."
          featureName="Rastreador de Alimentos"
        >
          <Card className="max-w-md mx-auto p-8 text-center card-style">
            <Utensils className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold gradient-text mb-3">Rastreador de Alimentos</h2>
            <p className="text-pink-600 text-base mb-6">
              Monitore sua ingestão de calorias e macros para alcançar seus objetivos de forma eficaz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="w-full">
                <Link to="/login">Fazer Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/signup">Criar Conta Grátis</Link>
              </Button>
            </div>
          </Card>
        </LoginGate>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <Utensils className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Rastreador de Alimentos</h2>
          <p className="text-pink-600 text-base">Monitore sua nutrição diária.</p>
        </div>

        {/* Date Navigation */}
        <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

        {/* Daily Macro Summary */}
        {loadingLoggedFoods || loadingMacroPlan ? (
          <DailyMacroSummarySkeleton />
        ) : macroPlan ? (
          <DailyMacroSummary
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            totalCarbs={totalCarbs}
            totalFat={totalFat}
            targetCalories={macroPlan.target_calories}
            targetProtein={macroPlan.protein_grams}
            targetCarbs={macroPlan.carbs_grams}
            targetFat={macroPlan.fat_grams}
          />
        ) : (
          <Card className="p-6 text-center shadow-lg border-pink-100">
            <CardContent>
              <p className="text-slate-600 mb-4">
                Você não tem um plano de macros definido.
              </p>
              <Button asChild className="bg-pink-500 hover:bg-pink-600">
                <Link to="/calculadora-macros" state={{ fromFoodTracker: true }}>Definir Meu Plano de Macros</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Saved Meals Section */}
        <SavedMealsSection userId={user.id} selectedDate={selectedDate} onMealAddedToLog={refetchLoggedFoods} />

        {/* Frequent Foods Section */}
        <FrequentFoodsSection userId={user.id} onFoodAdd={handleFoodAdd} isAddingFood={addLoggedFoodMutation.isPending} />

        {/* Meal Sections */}
        {mealTypes.map(meal => (
          <MealSection
            key={meal.key}
            mealKey={meal.key}
            mealLabel={meal.label}
            loggedFoods={loggedFoods}
            loadingLoggedFoods={loadingLoggedFoods}
            onEditLoggedFood={handleEditLoggedFood}
            onDeleteLoggedFood={handleDeleteLoggedFood}
            isAddingFood={addLoggedFoodMutation.isPending}
            isDeletingFood={deleteLoggedFoodMutation.isPending}
            onAddFoodClick={() => handleOpenFoodSearchModal(meal.key)} // Passa o meal.key
          />
        ))}

        {/* Add Custom Food Button */}
        <Button
          variant="outline"
          className="w-full bg-pink-50 text-pink-700 font-bold py-4 rounded-2xl border-2 border-pink-200 hover:bg-pink-100 transition-all duration-300 h-auto text-base"
          onClick={() => setIsCustomFoodDialogOpen(true)}
          disabled={loadingLoggedFoods}
        >
          <Plus className="h-5 w-5 mr-2" /> Adicionar Alimento Personalizado
        </Button>

        {/* Save Meal Button */}
        {loggedFoods && loggedFoods.length > 0 && (
          <Button
            variant="outline"
            className="w-full bg-green-50 text-green-700 font-bold py-4 rounded-2xl border-2 border-green-200 hover:bg-green-100 transition-all duration-300 h-auto text-base"
            onClick={() => setIsSaveMealDialogOpen(true)}
            disabled={loadingLoggedFoods}
          >
            <Save className="h-5 w-5 mr-2" /> Salvar Refeição do Dia
          </Button>
        )}

        {/* Weekly Nutrition Insights */}
        <WeeklyNutritionInsights userId={user.id} />

        <AddCustomFoodDialog
          isOpen={isCustomFoodDialogOpen}
          onOpenChange={setIsCustomFoodDialogOpen}
        />

        {/* Edit Logged Food Dialog */}
        <EditLoggedFoodDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingFood={editingFood}
          userId={user.id}
          selectedDate={selectedDate}
        />

        {/* Save Meal Dialog */}
        <SaveMealDialog
          isOpen={isSaveMealDialogOpen}
          onOpenChange={setIsSaveMealDialogOpen}
          foodsToSave={loggedFoods || []}
        />

        {/* Food Search Modal (triggered by FAB or MealSection buttons) */}
        <FoodSearchModal
          isOpen={isFoodSearchModalOpen}
          onOpenChange={setIsFoodSearchModalOpen}
          onFoodAdd={handleFoodAdd}
          initialMealType={currentMealTypeForModal} // Passa o tipo de refeição inicial
          isAddingFood={addLoggedFoodMutation.isPending}
        />
      </div>
      
      {/* Floating Action Button */}
      <AddFoodFAB onClick={() => handleOpenFoodSearchModal()} disabled={loadingLoggedFoods} />
    </div>
  );
};

export default FoodTrackerPage;