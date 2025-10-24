export interface MacroCalculationInputs {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  bodyState: 'definida' | 'tonificada' | 'magraNatural' | 'equilibrada' | 'extrasLeves' | 'emagrecer';
  activity: 'sedentaria' | 'leve' | 'moderada' | 'intensa' | 'muitoIntensa';
  goal: 'emagrecerSuave' | 'emagrecerFoco' | 'transformacaoIntensa' | 'manterPeso' | 'ganharMassa' | 'ganhoAcelerado';
}

export interface MacroCalculationResults {
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

const ACTIVITY_MULTIPLIERS = {
  sedentaria: 1.2,
  leve: 1.375,
  moderada: 1.55,
  intensa: 1.725,
  muitoIntensa: 1.9,
};

const GOAL_MULTIPLIERS = {
  emagrecerSuave: 0.85,
  emagrecerFoco: 0.77,
  transformacaoIntensa: 0.70,
  manterPeso: 1.0,
  ganharMassa: 1.07,
  ganhoAcelerado: 1.15,
};

const BODY_STATE_DATA: { [key: string]: { proteinMult: number; fatPercent: number } } = {
  definida: { proteinMult: 2.0, fatPercent: 0.2 },
  tonificada: { proteinMult: 2.1, fatPercent: 0.22 },
  magraNatural: { proteinMult: 2.3, fatPercent: 0.25 },
  equilibrada: { proteinMult: 2.2, fatPercent: 0.25 },
  extrasLeves: { proteinMult: 2.4, fatPercent: 0.28 },
  emagrecer: { proteinMult: 2.5, fatPercent: 0.3 },
};

export function calculateMacros(inputs: MacroCalculationInputs): MacroCalculationResults {
  const { age, weight, height, gender, bodyState, activity, goal } = inputs;

  // 1. Calcular BMR (Taxa Metabólica Basal)
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else { // female
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 2. Calcular TDEE (Gasto Energético Diário Total)
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activity];
  const tdee = bmr * activityMultiplier;

  // 3. Calcular Calorias Alvo
  const goalMultiplier = GOAL_MULTIPLIERS[goal];
  let targetCalories = tdee * goalMultiplier;
  const minCalories = gender === 'male' ? 1500 : 1200;
  targetCalories = Math.max(targetCalories, minCalories); // Garantir um mínimo de calorias

  // 4. Calcular Macros
  const stateData = BODY_STATE_DATA[bodyState];
  let proteinMultiplier = stateData.proteinMult;
  if (goalMultiplier <= 0.77) { // Se o objetivo é emagrecimento focado ou intenso
    proteinMultiplier += 0.1; // Aumentar um pouco a proteína
  }

  let proteinGrams = Math.round(weight * proteinMultiplier);
  const maxProtein = Math.round(weight * 3.0); // Limite superior de proteína
  const minProtein = Math.round(weight * 1.6); // Limite inferior de proteína
  proteinGrams = Math.min(Math.max(proteinGrams, minProtein), maxProtein);
  const proteinCalories = proteinGrams * 4;

  let fatPercent = stateData.fatPercent;
  if (goalMultiplier <= 0.77 && bodyState !== 'emagrecer') { // Se emagrecendo e não já em estado de emagrecer
    fatPercent = Math.max(fatPercent - 0.05, 0.18); // Reduzir um pouco a gordura, com mínimo
  }
  const fatCalories = targetCalories * fatPercent;
  const fatGrams = Math.round(fatCalories / 9);

  const carbsCalories = Math.max(targetCalories - proteinCalories - fatCalories, 0);
  const carbsGrams = Math.round(carbsCalories / 4);

  // 5. Calcular Percentuais
  const totalMacrosCalories = proteinCalories + carbsCalories + fatCalories;
  const proteinPercent = Math.round((proteinCalories / totalMacrosCalories) * 100);
  const carbsPercent = Math.round((carbsCalories / totalMacrosCalories) * 100);
  const fatPercentDisplay = Math.round((fatCalories / totalMacrosCalories) * 100);

  return {
    targetCalories: Math.round(targetCalories),
    proteinGrams,
    carbsGrams,
    fatGrams,
    proteinPercent,
    carbsPercent,
    fatPercent: fatPercentDisplay,
  };
}