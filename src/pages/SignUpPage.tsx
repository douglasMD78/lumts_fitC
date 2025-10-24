import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Importar o novo hook
import { useSignUp } from '@/hooks/useSignUp';

const signUpSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
    .regex(/[^a-zA-Z0-9]/, { message: 'A senha deve conter pelo menos um caractere especial' }),
});

type SignUpFormInputs = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpMutation = useSignUp();

  const onSubmit = async (data: SignUpFormInputs) => {
    signUpMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-3">Crie Sua Conta</h2>
          <p className="text-pink-600 text-base">Comece sua jornada de transformação</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-pink-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-pink-700">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Crie uma senha forte"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="btn-calculate" disabled={signUpMutation.isPending}>
            {signUpMutation.isPending ? 'Criando...' : '✨ Criar Conta'}
          </Button>
          <p className="text-center text-sm text-slate-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-bold text-pink-500 hover:underline">
              Faça login
            </Link>
          </p>
          <p className="text-center text-xs text-slate-500 mt-4">
            Após o cadastro, verifique sua caixa de entrada (e spam) para confirmar seu email.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;