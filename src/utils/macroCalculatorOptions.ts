"use client";

import React from 'react';
import { UserRound, User, Diamond, Dumbbell, Leaf, Scale, Weight, Goal, Bed, Hand, Bike, Flame, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

export const genderOptions = [
  { value: 'female', label: 'Feminino', icon: <UserRound /> },
  { value: 'male', label: 'Masculino', icon: <User /> },
];

export const bodyStateOptions = [
  { value: 'definida', label: 'Definição visível', icon: <Diamond />, description: 'Músculos bem marcados' },
  { value: 'tonificada', label: 'Corpo tonificado', icon: <Dumbbell />, description: 'Forma atlética, pouca gordura' },
  { value: 'magraNatural', label: 'Magra natural', icon: <Leaf />, description: 'Metabolismo rápido, dificuldade em ganhar peso' },
  { value: 'equilibrada', label: 'Peso equilibrado', icon: <Scale />, description: 'Confortável com seu corpo' },
  { value: 'extrasLeves', label: 'Alguns quilos extras', icon: <Weight />, description: 'Gordura corporal um pouco acima do ideal' },
  { value: 'emagrecer', label: 'Preciso emagrecer', icon: <Goal />, description: 'Busca por perda de peso significativa' },
];

export const activityOptions = [
  { value: 'sedentaria', label: 'Sedentária', icon: <Bed />, description: 'Pouco ou nenhum exercício' },
  { value: 'leve', label: 'Levemente Ativa', icon: <Hand />, description: 'Exercício leve 1-3 dias/semana' },
  { value: 'moderada', label: 'Moderadamente Ativa', icon: <Bike />, description: 'Exercício moderado 3-5 dias/semana' },
  { value: 'intensa', label: 'Altamente Ativa', icon: <Dumbbell />, description: 'Exercício intenso 6-7 dias/semana' },
  { value: 'muitoIntensa', label: 'Muito Ativa', icon: <Flame />, description: 'Exercício intenso diário ou trabalho físico' },
];

export const goalOptions = [
  { value: 'emagrecerSuave', label: 'Emagrecer Suavemente', icon: <Leaf />, description: 'Perda de peso gradual e sustentável' },
  { value: 'emagrecerFoco', label: 'Emagrecer com Foco', icon: <Goal />, description: 'Perda de peso mais acelerada' },
  { value: 'transformacaoIntensa', label: 'Transformação Intensa', icon: <Zap />, description: 'Déficit calórico agressivo para resultados rápidos' },
  { value: 'manterPeso', label: 'Manter Meu Peso', icon: <ShieldCheck />, description: 'Estabilizar o peso atual' },
  { value: 'ganharMassa', label: 'Ganhar Massa', icon: <Dumbbell />, description: 'Aumento gradual de massa muscular' },
  { value: 'ganhoAcelerado', label: 'Ganho Acelerado', icon: <TrendingUp />, description: 'Superávit calórico para ganho rápido de massa' },
];