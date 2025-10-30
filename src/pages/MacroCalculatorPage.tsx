import { useState, useEffect } from "react";
import { MacroCalculatorStepper } from "@/components/MacroCalculatorStepper";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/utils/toast";
import { MacroCalculationInputs } from "@/utils/macroCalculations";

// Importar os novos hooks
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useSaveMacroPlan } from '@/hooks/useSaveMacroPlan';

const MacroCalculatorPage = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<any | null>(null);
  const [initialData, setInitialData] = useState<{
    age?: string;
    weight?: string;
    height?: string;
  }>({});

  const { data: profileData, isLoading: loadingProfile } = useUserProfile();
  const updateProfileMutation = useUpdateProfile(user?.id || '');
  const saveMacroPlanMutation = useSaveMacroPlan();

  useEffect(() => {
    if (profileData) {
      setInitialData({
        age: profileData.age ? String(profileData.age) : undefined,
        weight: profileData.weight ? String(profileData.weight) : undefined,
        height: profileData.height ? String(profileData.height) : undefined,
      });
    }
  }, [profileData]);

  const handleSavePlan = async (planResults: any) => {
    if (!user) {
      showError("Você precisa estar logada para salvar um plano.");
      return;
    }

    saveMacroPlanMutation.mutate(
      {
        userId: user.id,
        targetCalories: planResults.targetCalories,
        proteinGrams: planResults.proteinGrams,
        carbsGrams: planResults.carbsGrams,
        fatGrams: planResults.fatGrams,
      },
      {
        onSuccess: () => {
          // No longer redirecting to food tracker
        },
      }
    );
  };

  const handleCalculateAndSaveProfile = async (calculatedResults: any, formData: MacroCalculationInputs) => {
    if (user) {
      updateProfileMutation.mutate(
        {
          first_name: profileData?.first_name || '', // Manter valores existentes se não forem alterados
          last_name: profileData?.last_name || '',
          age: formData.age ?? null, // Convert undefined to null
          weight: formData.weight ?? null, // Convert undefined to null
          height: formData.height ?? null, // Convert undefined to null
        },
        {
          onSuccess: () => {
            showSuccess("Seus dados de idade, peso e altura foram atualizados no perfil! ✨");
          },
          onError: (error) => {
            showError("Erro ao atualizar dados do perfil: " + error.message);
          }
        }
      );
    }
    setResults(calculatedResults);
  };

  if (loadingProfile) {
    return (
      <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
        <p>Carregando dados para a calculadora...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      {!results ? (
        <MacroCalculatorStepper onCalculate={handleCalculateAndSaveProfile} initialData={initialData} />
      ) : (
        <ResultsDisplay results={results} onRestart={() => setResults(null)} onSavePlan={handleSavePlan} />
      )}
    </div>
  );
};

export default MacroCalculatorPage;