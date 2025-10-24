import { addDays, differenceInDays, isBefore, startOfDay } from 'date-fns';

export type CyclePhase = 'menstrual' | 'folicular' | 'ovulatoria' | 'lutea';

export interface CyclePhaseInfo {
  phase: CyclePhase;
  dayInCycle: number;
  cycleLength: number;
  phaseContent: typeof PHASE_CONTENT['menstrual']; // Type for the content block
}

// Define the static content for each phase with fitness focus
export const PHASE_CONTENT = {
  menstrual: {
    energy: {
      title: "Sua Energia",
      description: "Baixa. A queda hormonal pode te deixar mais cansada. Priorize o descanso."
    },
    workout: {
      title: "Treino Ideal",
      description: "Recuperação Ativa. Foque em mobilidade, yoga restaurativa e caminhadas leves."
    },
    body: {
      title: "Seu Corpo",
      description: "Cólicas e cansaço são comuns. Foco em hidratação e alimentos ricos em ferro."
    },
    cravings: {
      title: "Alerta de Desejos",
      description: "Vontade de conforto? Opte por alimentos nutritivos e quentes. Evite excessos."
    },
    color: "bg-rose-200 text-rose-800", // For card background
    progressColor: "bg-rose-500" // For progress bar
  },
  folicular: {
    energy: {
      title: "Sua Energia",
      description: "Em Alta! O estrogênio está subindo, te dando mais força e disposição."
    },
    workout: {
      title: "Treino Ideal",
      description: "Força Progressiva. Ideal para levantamento de peso pesado e novos desafios."
    },
    body: {
      title: "Seu Corpo",
      description: "Pele mais clara e sensação de leveza. Ótimo momento para iniciar novos hábitos."
    },
    cravings: {
      title: "Alerta de Desejos",
      description: "Apetite mais controlado. Foque em proteínas para ajudar na reconstrução muscular."
    },
    color: "bg-emerald-200 text-emerald-800",
    progressColor: "bg-emerald-500"
  },
  ovulatoria: {
    energy: {
      title: "Sua Energia",
      description: "Pico de Energia! Sinta-se confiante e pronta para qualquer desafio."
    },
    workout: {
      title: "Treino Ideal",
      description: "Intensidade Máxima! Dia perfeito para buscar recordes e treinos HIIT."
    },
    body: {
      title: "Seu Corpo",
      description: "Aumento da libido e clareza mental. Aproveite o auge da sua performance."
    },
    cravings: {
      title: "Alerta de Desejos",
      description: "Apetite estável. Mantenha a ingestão de proteínas e carboidratos para sustentar a energia."
    },
    color: "bg-sky-200 text-sky-800",
    progressColor: "bg-sky-500"
  },
  lutea: {
    energy: {
      title: "Sua Energia",
      description: "Moderada a Baixa. A progesterona alta pode te deixar mais cansada. Respeite seus limites."
    },
    workout: {
      title: "Treino Ideal",
      description: "Resistência e Cardio Moderado. Foque em mais repetições, menos carga. Evite recordes."
    },
    body: {
      title: "Seu Corpo",
      description: "Retenção de líquidos é normal. Você pode se sentir inchada. É água, não gordura!"
    },
    cravings: {
      title: "Alerta de Desejos",
      description: "Vontade de doce? Seu corpo pede energia. Opte por chocolate amargo ou frutas."
    },
    color: "bg-violet-200 text-violet-800",
    progressColor: "bg-violet-500"
  },
};

// Helper to get phase based on day, menstrualLength, and cycleLength
const getPhaseForDay = (
  dayInCycle: number,
  menstrualLength: number,
  cycleLength: number
): CyclePhase => {
  // Phase definitions based on briefing
  const ovulatoryStartDay = cycleLength - 14; // Day 15 for a 28-day cycle
  const ovulatoryEndDay = cycleLength - 12;   // Day 17 for a 28-day cycle
  const folicularEndDay = ovulatoryStartDay - 1;

  if (dayInCycle >= 1 && dayInCycle <= menstrualLength) {
    return 'menstrual';
  } else if (dayInCycle > menstrualLength && dayInCycle <= folicularEndDay) {
    return 'folicular';
  } else if (dayInCycle >= ovulatoryStartDay && dayInCycle <= ovulatoryEndDay) {
    return 'ovulatoria';
  } else if (dayInCycle > ovulatoryEndDay && dayInCycle <= cycleLength) {
    return 'lutea';
  }
  // Fallback for unexpected dayInCycle values (should not happen if inputs are valid)
  console.warn(`Day ${dayInCycle} is outside expected cycle phase ranges for cycleLength ${cycleLength} and menstrualLength ${menstrualLength}.`);
  return 'folicular'; // Default to follicular
};


export function getCycleDayInfo(
  lastPeriodStartDate: Date,
  cycleLength: number,
  menstrualLength: number,
  today: Date = new Date(),
): CyclePhaseInfo | null {
  const startOfToday = startOfDay(today);
  const startOfLastPeriod = startOfDay(lastPeriodStartDate);

  if (isBefore(startOfToday, startOfLastPeriod)) {
    return null; // Today cannot be before the last period start
  }

  let dayInCycle = differenceInDays(startOfToday, startOfLastPeriod) + 1;

  // Adjust dayInCycle if it exceeds the cycleLength to wrap around
  if (dayInCycle > cycleLength) {
    dayInCycle = ((dayInCycle - 1) % cycleLength) + 1;
  }

  const phase = getPhaseForDay(dayInCycle, menstrualLength, cycleLength);
  const phaseContent = PHASE_CONTENT[phase];

  return {
    phase,
    dayInCycle,
    cycleLength,
    phaseContent,
  };
}

export function getPredictedDates(
  lastPeriodStartDate: Date,
  cycleLength: number,
  menstrualLength: number,
) {
  const startOfLastPeriod = startOfDay(lastPeriodStartDate);

  const nextPeriodStartDate = addDays(startOfLastPeriod, cycleLength);

  // Ovulatory window as defined in the briefing
  const ovulatoryStartDay = cycleLength - 14;
  const ovulatoryEndDay = cycleLength - 12;

  const ovulationDate = addDays(startOfLastPeriod, ovulatoryStartDay); // Using start of ovulatory window as a proxy for "ovulation date"
  const fertileWindowStart = addDays(startOfLastPeriod, ovulatoryStartDay - 2); // 2 days before ovulatory window start
  const fertileWindowEnd = addDays(startOfLastPeriod, ovulatoryEndDay + 1); // 1 day after ovulatory window end

  return {
    nextPeriodStartDate,
    ovulationDate, // This is now the start of the ovulatory window
    fertileWindowStart,
    fertileWindowEnd,
  };
}