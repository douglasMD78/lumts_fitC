export interface WaterCalculationInputs {
  weight: number; // kg
  activityLevel: 'sedentary' | 'moderate' | 'active';
  dietaryHabits: 'highFruitsVeggies' | 'balanced' | 'lowFruitsVeggies'; // Novo campo
}

export function calculateWaterIntake(inputs: WaterCalculationInputs): number {
  const { weight, activityLevel, dietaryHabits } = inputs; // Removido 'climate'

  // Base recommendation: 35ml per kg of body weight
  let recommendedIntake = weight * 35; // in ml

  // Adjust for activity level
  switch (activityLevel) {
    case 'moderate':
      recommendedIntake += 200; // Add 200ml for moderate activity
      break;
    case 'active':
      recommendedIntake += 500; // Add 500ml for active individuals
      break;
    // 'sedentary' has no additional adjustment
  }

  // Adjust for dietary habits (new adjustment)
  switch (dietaryHabits) {
    case 'highFruitsVeggies':
      recommendedIntake -= 150; // Reduce 150ml if diet is rich in water-rich foods
      break;
    case 'lowFruitsVeggies':
      recommendedIntake += 150; // Add 150ml if diet is low in water-rich foods
      break;
    // 'balanced' has no additional adjustment
  }

  // Ensure a minimum intake (e.g., 1500ml or 1.5 liters)
  return Math.max(Math.round(recommendedIntake), 1500);
}