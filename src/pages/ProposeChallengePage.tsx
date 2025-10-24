"use client";

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';

// Importar o novo hook
import { useProposeChallenge } from '@/hooks/useProposeChallenge';

const challengeSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres').max(100, 'O título não pode exceder 100 caracteres'),
  description: z.string().min(20, 'A descrição deve ter pelo menos 20 caracteres').max(500, 'A descrição não pode exceder 500 caracteres'),
  duration: z.string().min(1, 'Selecione a duração do desafio'),
  difficulty: z.string().min(1, 'Selecione a dificuldade do desafio'),
  rewards: z.string().max(200, 'As recompensas não podem exceder 200 caracteres').optional().or(z.literal('')),
});

type ChallengeFormInputs = z.infer<typeof challengeSchema>;

const ProposeChallengePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChallengeFormInputs>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: '',
      difficulty: '',
      rewards: '',
    },
  });

  const proposeChallengeMutation = useProposeChallenge();

  const onSubmit = async (data: ChallengeFormInputs) => {
    if (!user) {
      showError('Você precisa estar logada para propor um desafio.');
      navigate('/login');
      return;
    }

    proposeChallengeMutation.mutate({
      userId: user.id,
      title: data.title,
      description: data.description,
      duration: data.duration,
      difficulty: data.difficulty,
      rewards: data.rewards || null,
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p className="text-lg text-slate-700 mb-4">Você precisa estar logada para propor um desafio.</p>
        <Button asChild className="mt-4 bg-pink-500 hover:bg-pink-600">
          <Link to="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto card-style p-6 sm:p-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-pink-500 hover:text-pink-600">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-3">Proponha um Novo Desafio</h1>
          <p className="text-pink-600 text-base">Compartilhe sua ideia com a comunidade LumtsFit!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold text-pink-700">Título do Desafio</Label>
            <Input
              id="title"
              placeholder="Ex: Desafio 30 Dias de Agachamento"
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold text-pink-700">Descrição Detalhada</Label>
            <Textarea
              id="description"
              placeholder="Descreva o desafio, regras e o que as participantes precisam fazer."
              rows={5}
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold text-pink-700">Duração</Label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.duration ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione a duração..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7 dias">7 dias</SelectItem>
                      <SelectItem value="14 dias">14 dias</SelectItem>
                      <SelectItem value="21 dias">21 dias</SelectItem>
                      <SelectItem value="30 dias">30 dias</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-pink-700">Dificuldade</Label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.difficulty ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione a dificuldade..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Moderado">Moderado</SelectItem>
                      <SelectItem value="Difícil">Difícil</SelectItem>
                      <SelectItem value="Intenso">Intenso</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rewards" className="font-semibold text-pink-700">Recompensas (Opcional)</Label>
            <Input
              id="rewards"
              placeholder="Ex: Badge virtual, menção no Instagram"
              {...register('rewards')}
              className={errors.rewards ? 'border-red-500' : ''}
            />
            {errors.rewards && <p className="text-red-500 text-sm mt-1">{errors.rewards.message}</p>}
          </div>

          <Button type="submit" className="btn-calculate" disabled={proposeChallengeMutation.isPending}>
            {proposeChallengeMutation.isPending ? 'Enviando Proposta...' : '✨ Propor Desafio'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProposeChallengePage;