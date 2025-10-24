export const mapWorkoutType = (value: string | null) => {
  switch (value) {
    case 'strength': return 'Força';
    case 'cardio': return 'Cardio';
    case 'yoga': return 'Yoga';
    case 'pilates': return 'Pilates';
    case 'dance': return 'Dança';
    case 'hiit': return 'HIIT';
    case 'rest': return 'Descanso Ativo';
    case 'none': return 'Nenhum';
    default: return value || 'N/A';
  }
};

export const mapWorkoutIntensity = (value: string | null) => {
  switch (value) {
    case 'light': return 'Leve';
    case 'moderate': return 'Moderado';
    case 'intense': return 'Intenso';
    case 'very_intense': return 'Muito Intenso';
    default: return value || 'N/A';
  }
};

export const mapCardioType = (value: string | null) => {
  switch (value) {
    case 'running': return 'Corrida';
    case 'cycling': return 'Ciclismo';
    case 'swimming': return 'Natação';
    case 'walking': return 'Caminhada';
    case 'elliptical': return 'Elíptico';
    case 'stairs': return 'Escada';
    case 'none': return 'Nenhum';
    default: return value || 'N/A';
  }
};

export const mapMoodLevel = (value: string | null) => {
  switch (value) {
    case 'great': return 'Ótimo';
    case 'good': return 'Bom';
    case 'neutral': return 'Neutro';
    case 'bad': return 'Ruim';
    case 'stressed': return 'Estressado';
    case 'tired': return 'Cansado';
    default: return value || 'N/A';
  }
};

export const mapGoalType = (value: string | null) => {
  switch (value) {
    case 'weight': return 'Peso Corporal';
    case 'workout_frequency': return 'Frequência de Treino';
    case 'workout_duration': return 'Duração de Treino';
    case 'cardio_distance': return 'Distância de Cardio';
    case 'sleep_duration': return 'Duração do Sono';
    case 'body_measurement': return 'Medida Corporal';
    case 'water_intake': return 'Ingestão de Água';
    case 'other': return 'Outro';
    default: return value || 'N/A';
  }
};