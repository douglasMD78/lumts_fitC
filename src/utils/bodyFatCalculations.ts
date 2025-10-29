export interface BodyFatCalculationInputs {
  gender: 'male' | 'female';
  height: number; // cm
  neck: number; // cm
  waist: number; // cm
  hip?: number; // cm, optional for males
}

export function calculateBodyFatPercentage(inputs: BodyFatCalculationInputs): number {
  const { gender, height, neck, waist, hip } = inputs;

  let bodyFatPercentage: number;

  if (gender === 'male') {
    // US Navy Formula for Men
    // BF = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const term1 = 1.0324;
    const term2 = 0.19077 * Math.log10(waist - neck);
    const term3 = 0.15456 * Math.log10(height);
    bodyFatPercentage = 495 / (term1 - term2 + term3) - 450;
  } else { // female
    // US Navy Formula for Women
    // BF = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    if (hip === undefined || hip === null) {
      throw new Error("A medida do quadril é obrigatória para o cálculo de BF% feminino.");
    }
    const term1 = 1.29579;
    const term2 = 0.35004 * Math.log10(waist + hip - neck);
    const term3 = 0.22100 * Math.log10(height);
    bodyFatPercentage = 495 / (term1 - term2 + term3) - 450;
  }

  // Ensure the result is within a reasonable range (e.g., 5% to 60%)
  return Math.max(5, Math.min(60, parseFloat(bodyFatPercentage.toFixed(1))));
}