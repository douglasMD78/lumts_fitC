import { addHours, setHours, setMinutes, format, parse } from 'date-fns';

export interface FastingCalculationInputs {
  lastMealTime: string; // HH:MM format
  fastingDurationHours: number;
}

export interface FastingDetails {
  title: string;
  description: string;
  benefits: { title: string; content: string; }[];
  eatingWindowTips: { title: string; content: string; }[];
  generalTips: { title: string; content: string; }[];
  colorClass: string; // Tailwind class for styling
}

export interface FastingCalculationResults {
  fastingWindowEnd: string; // HH:MM
  eatingWindowStart: string; // HH:MM
  eatingWindowEnd: string; // HH:MM
  details: FastingDetails; // Adicionado para informações detalhadas
}

const getFastingDetails = (duration: number): FastingDetails => {
  if (duration >= 12 && duration <= 14) {
    return {
      title: "Jejum Leve (12-14h)",
      description: "Ideal para iniciantes, foca na transição metabólica e primeiros benefícios.",
      benefits: [
        { title: "Queima de Gordura", content: "O corpo começa a usar gordura como principal fonte de energia após esgotar as reservas de glicogênio." },
        { title: "Melhora da Sensibilidade à Insulina", content: "Ajuda a regular os níveis de açúcar no sangue, reduzindo o risco de resistência à insulina." },
      ],
      eatingWindowTips: [
        { title: "Quebre o Jejum Suavemente", content: "Comece com alimentos leves e de fácil digestão, como caldos, vegetais cozidos ou iogurte natural." },
        { title: "Priorize Nutrientes", content: "Foque em proteínas magras, gorduras saudáveis e carboidratos complexos para reabastecer o corpo." },
      ],
      generalTips: [
        { title: "Hidrate-se", content: "Beba bastante água, chás sem açúcar e café puro durante o jejum." },
        { title: "Escute seu Corpo", content: "Se sentir tontura ou mal-estar, quebre o jejum. Não force." },
      ],
      colorClass: "bg-green-500",
    };
  } else if (duration >= 15 && duration <= 17) {
    return {
      title: "Jejum Moderado (15-17h)",
      description: "Um passo adiante, aprofundando os benefícios metabólicos e de reparo celular.",
      benefits: [
        { title: "Autofagia Aumentada", content: "Processo de 'limpeza celular' onde o corpo remove células danificadas, promovendo a renovação." },
        { title: "Produção de HGH", content: "Aumento do hormônio do crescimento, que auxilia na queima de gordura e construção muscular." },
      ],
      eatingWindowTips: [
        { title: "Refeições Balanceadas", content: "Planeje refeições completas e nutritivas para aproveitar a janela de alimentação." },
        { title: "Evite Ultraprocessados", content: "Alimentos ricos em açúcar e gorduras ruins podem anular os benefícios do jejum." },
      ],
      generalTips: [
        { title: "Eletrólitos", content: "Considere suplementos de eletrólitos (magnésio, potássio, sódio) se o jejum for mais longo." },
        { title: "Atividade Física", content: "Treinos leves a moderados podem ser feitos durante o jejum, mas adapte à sua energia." },
      ],
      colorClass: "bg-indigo-500",
    };
  } else if (duration >= 18 && duration <= 20) {
    return {
      title: "Jejum Avançado (18-20h)",
      description: "Para quem busca otimização máxima, com foco em reparo celular e queima de gordura profunda.",
      benefits: [
        { title: "Reparo Celular Intenso", content: "A autofagia atinge níveis mais altos, promovendo maior longevidade celular." },
        { title: "Estabilização de Humor e Energia", content: "Muitos relatam clareza mental e energia estável após a adaptação." },
      ],
      eatingWindowTips: [
        { title: "Nutrição Densa", content: "Como a janela é menor, cada refeição deve ser rica em nutrientes essenciais." },
        { title: "Cuidado com Exageros", content: "Evite comer em excesso na janela de alimentação para não sobrecarregar o sistema digestivo." },
      ],
      generalTips: [
        { title: "Progressão Gradual", content: "Não comece com jejuns longos. Aumente a duração aos poucos para adaptação." },
        { title: "Consulte um Profissional", content: "Jejuns mais longos devem ser acompanhados por um médico ou nutricionista." },
      ],
      colorClass: "bg-purple-500",
    };
  }
  // Default fallback
  return {
    title: "Jejum Intermitente",
    description: "Informações gerais sobre o jejum intermitente.",
    benefits: [],
    eatingWindowTips: [],
    generalTips: [],
    colorClass: "bg-gray-500",
  };
};

export function calculateFastingWindows(inputs: FastingCalculationInputs): FastingCalculationResults {
  const { lastMealTime, fastingDurationHours } = inputs;

  // Use a reference date (e.g., today) to work with times
  const now = new Date();
  const [hours, minutes] = lastMealTime.split(':').map(Number);
  let lastMealDateTime = setMinutes(setHours(now, hours), minutes);

  // Calculate fasting window end
  let fastingWindowEndDateTime = addHours(lastMealDateTime, fastingDurationHours);

  // If fasting ends on the next day, adjust the date
  if (fastingWindowEndDateTime.getDate() !== lastMealDateTime.getDate() && fastingWindowEndDateTime.getHours() < lastMealDateTime.getHours()) {
    // This means fasting crosses midnight. The date of fastingWindowEndDateTime is already correct.
  } else if (fastingWindowEndDateTime.getDate() === lastMealDateTime.getDate() && fastingWindowEndDateTime.getHours() < lastMealDateTime.getHours()) {
    // This case should not happen if fastingDurationHours is positive, but as a safeguard
    fastingWindowEndDateTime = addHours(fastingWindowEndDateTime, 24);
  }

  // Eating window duration is 24 - fastingDurationHours
  const eatingWindowDurationHours = 24 - fastingDurationHours;

  // Eating window starts immediately after fasting ends
  const eatingWindowStartDateTime = fastingWindowEndDateTime;

  // Eating window ends after its duration
  const eatingWindowEndDateTime = addHours(eatingWindowStartDateTime, eatingWindowDurationHours);

  const details = getFastingDetails(fastingDurationHours);

  return {
    fastingWindowEnd: format(fastingWindowEndDateTime, 'HH:mm'),
    eatingWindowStart: format(eatingWindowStartDateTime, 'HH:mm'),
    eatingWindowEnd: format(eatingWindowEndDateTime, 'HH:mm'),
    details: details, // Incluir os detalhes
  };
}